const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const DEFAULT_SOURCES_FILE = path.join(ROOT, 'conf', 'ai-daily-sources.json')
const DEFAULT_OUTPUT_FILE = path.join(ROOT, 'temp', 'ai-daily-source-items.json')
const NOTION_API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'


function decodeHtml(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}


function extractTag(content, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = content.match(regex)
  return match ? decodeHtml(match[1]) : ''
}

function extractItemsFromXml(xml = '') {
  const matches = xml.match(/<item\b[\s\S]*?<\/item>/gi) || xml.match(/<entry\b[\s\S]*?<\/entry>/gi) || []
  return matches
}

function extractLink(block = '') {
  const atomLink = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)
  if (atomLink?.[1]) return decodeHtml(atomLink[1]).trim()
  const rssLink = extractTag(block, 'link')
  return rssLink.trim()
}

function extractExternalLinks(block = '') {
  const links = new Set()
  const hrefRegex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi
  let match

  while ((match = hrefRegex.exec(block)) !== null) {
    const url = decodeHtml(match[1] || '').trim()
    if (!url || !/^https?:\/\//i.test(url)) continue
    links.add(url)
  }

  const textUrlRegex = /https?:\/\/[^\s<>")]+/gi
  while ((match = textUrlRegex.exec(block)) !== null) {
    const url = decodeHtml(match[0] || '').trim().replace(/[.,]+$/, '')
    if (!url || !/^https?:\/\//i.test(url)) continue
    links.add(url)
  }

  return Array.from(links)
}

function selectPreferredSourceUrl(aggregateUrl = '', links = []) {
  const normalizedAggregateUrl = String(aggregateUrl || '').trim()
  const candidates = links.filter(link => {
    if (!link) return false
    if (!/^https?:\/\//i.test(link)) return false
    if (normalizedAggregateUrl && link === normalizedAggregateUrl) return false

    try {
      const hostname = new URL(link).hostname.toLowerCase()
      if (hostname.endsWith('daheiai.com')) return false
      return true
    } catch {
      return false
    }
  })

  return candidates[0] || normalizedAggregateUrl
}

function mapXmlItem(block, source) {
  const aggregateUrl = extractLink(block)
  const content = extractTag(block, 'content:encoded') || ''
  const summary = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content')
  const sourceLinks = extractExternalLinks(block)
  const preferredUrl = selectPreferredSourceUrl(aggregateUrl, sourceLinks)

  return {
    title: extractTag(block, 'title'),
    url: preferredUrl,
    aggregateUrl,
    sourceLinks,
    source: source.name,
    sourceGroup: source.groupName || '',
    sourceTier: source.tier || '',
    publishedAt: extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated'),
    category: source.category || '',
    summary: summary || content,
    sourceType: source.sourceType || 'unknown',
    credibility: Number(source.credibility || 3),
    developerValue: Number(source.developerValue || 3),
    industryImpact: Number(source.industryImpact || 3)
  }
}


function normalizeGroupSources(groups = []) {
  return groups
    .sort((a, b) => Number(a.priority || 999) - Number(b.priority || 999))
    .flatMap(group => {
      const sources = Array.isArray(group.sources) ? group.sources : []
      return sources.map(source => ({
        ...source,
        groupName: group.name || '',
        groupPriority: Number(group.priority || 999),
        groupDescription: group.description || ''
      }))
    })
}

function getDatePartsInTimeZone(date = new Date(), timeZone = 'Asia/Shanghai') {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value
  const day = parts.find(part => part.type === 'day')?.value
  const hour = Number(parts.find(part => part.type === 'hour')?.value || 0)

  return {
    date: `${year}-${month}-${day}`,
    hour
  }
}

function getDateInTimeZone(date = new Date(), timeZone = 'Asia/Shanghai') {
  return getDatePartsInTimeZone(date, timeZone).date
}


function isPublishedOnDateInTimeZone(value, targetDate, timeZone = 'Asia/Shanghai') {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false
  return getDateInTimeZone(date, timeZone) === targetDate
}

function shouldUseFallback(primaryItems = [], strategy = {}) {
  const minimumPrimaryItemsToday = Math.max(1, Number(strategy.minimumPrimaryItemsToday || 1))
  const timeZone = strategy.timezone || 'Asia/Shanghai'
  const fallbackAfterHour = Math.max(0, Math.min(23, Number(strategy.fallbackAfterHour ?? 23)))
  const now = getDatePartsInTimeZone(new Date(), timeZone)
  const todayCount = primaryItems.filter(item => isPublishedOnDateInTimeZone(item.publishedAt, now.date, timeZone)).length
  const reachedFallbackTime = now.hour >= fallbackAfterHour

  return {
    useFallback: reachedFallbackTime && todayCount < minimumPrimaryItemsToday,
    todayCount,
    minimumPrimaryItemsToday,
    today: now.date,
    currentHour: now.hour,
    fallbackAfterHour,
    reachedFallbackTime,
    shouldWaitForPrimary: !reachedFallbackTime && todayCount < minimumPrimaryItemsToday,
    timeZone
  }
}





async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function notionRequest(url, options = {}) {
  const token = String(process.env.NOTION_ACCESS_TOKEN || '').trim()
  if (!token) {
    throw new Error('缺少 NOTION_ACCESS_TOKEN')
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Notion 请求失败: ${response.status} ${data?.message || ''}`.trim())
  }

  return data
}

async function hasPublishedToday(timeZone = 'Asia/Shanghai') {
  const token = String(process.env.NOTION_ACCESS_TOKEN || '').trim()
  const databaseId = String(process.env.AI_DAILY_NOTION_DATABASE_ID || '').trim()
  if (!token || !databaseId) return false

  const today = getDateInTimeZone(new Date(), timeZone)
  const slugProperty = process.env.AI_DAILY_NOTION_SLUG_PROPERTY || 'slug'
  const slug = `daily-ai-news-${today}`

  const data = await notionRequest(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      page_size: 1,
      filter: {
        property: slugProperty,
        rich_text: {
          equals: slug
        }
      }
    })
  })

  return Array.isArray(data?.results) && data.results.length > 0
}

async function loadSourceConfig(configFile) {

  const parsed = await readJson(configFile)

  if (Array.isArray(parsed)) {
    return {
      strategy: {},
      sources: parsed.filter(source => source && source.enabled !== false)
    }
  }

  if (Array.isArray(parsed.sources)) {
    return {
      strategy: parsed.strategy || {},
      sources: parsed.sources.filter(source => source && source.enabled !== false)
    }
  }

  if (Array.isArray(parsed.groups)) {
    return {
      strategy: parsed.strategy || {},
      sources: normalizeGroupSources(parsed.groups).filter(source => source && source.enabled !== false)
    }
  }

  throw new Error('来源配置格式错误：应为数组、sources 数组或 groups 分组结构')
}



async function loadJsonSource(source) {
  const target = String(source.url || '').trim()
  const absolutePath = target.startsWith('http') ? null : path.resolve(ROOT, target)
  const parsed = absolutePath ? await readJson(absolutePath) : await fetch(target).then(res => res.json())
  const items = Array.isArray(parsed) ? parsed : parsed.items
  if (!Array.isArray(items)) return []

  return items.map(item => ({
    ...item,
    source: item.source || source.name,
    sourceGroup: item.sourceGroup || source.groupName || '',
    sourceTier: item.sourceTier || source.tier || '',
    category: item.category || source.category || '',
    sourceType: item.sourceType || source.sourceType || 'unknown',
    credibility: Number(item.credibility || source.credibility || 3),
    developerValue: Number(item.developerValue || source.developerValue || 3),
    industryImpact: Number(item.industryImpact || source.industryImpact || 3)
  }))
}


async function loadRssSource(source) {
  const response = await fetch(source.url, {
    headers: {
      'User-Agent': 'RHZ-AI-Daily-Collector/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`抓取失败: ${response.status} ${response.statusText}`)
  }

  const xml = await response.text()
  return extractItemsFromXml(xml).map(block => mapXmlItem(block, source))
}

async function fetchSource(source) {
  const type = String(source.type || 'rss').toLowerCase()
  if (type === 'json') {
    return loadJsonSource(source)
  }
  if (type === 'rss' || type === 'atom' || type === 'xml') {
    return loadRssSource(source)
  }
  throw new Error(`暂不支持的来源类型: ${source.type}`)
}

async function main() {
  const configFile = process.env.AI_DAILY_SOURCES_CONFIG || DEFAULT_SOURCES_FILE
  const outputFile = process.env.AI_DAILY_SOURCE_FILE || DEFAULT_OUTPUT_FILE
  const { strategy, sources } = await loadSourceConfig(configFile)

  console.log('开始抓取每日 AI 情报来源...')
  console.log(`来源配置: ${configFile}`)
  console.log(`启用来源数: ${sources.length}`)

  const alreadyPublishedToday = await hasPublishedToday(strategy.timezone || 'Asia/Shanghai').catch(error => {
    console.warn(`  当日发布检查失败，继续执行抓取: ${error.message}`)
    return false
  })

  if (alreadyPublishedToday) {
    console.log('✅ 检测到今日 AI 日报已发布，跳过本次抓取。')
    await ensureDir(path.dirname(outputFile))
    await fs.writeFile(
      outputFile,
      JSON.stringify({
        strategy,
        activeSources: [],
        alreadyPublishedToday: true,
        shouldWaitForPrimary: false,
        fallbackDecision: null,
        items: []
      }, null, 2),
      'utf8'
    )
    return
  }

  const primarySources = sources.filter(source => source.role === 'primary')

  const fallbackSources = sources.filter(source => source.role === 'fallback')
  const defaultSources = sources.filter(source => !source.role)
  const allItems = []
  const activeSourceNames = []

  const fetchAndCollect = async source => {
    try {
      console.log(`- 抓取来源: ${source.name}`)
      const items = await fetchSource(source)
      console.log(`  获取到 ${items.length} 条`)
      allItems.push(...items)
      activeSourceNames.push(source.name)
      return items
    } catch (error) {
      console.warn(`  来源抓取失败: ${source.name} - ${error.message}`)
      return []
    }
  }

  let primaryItems = []
  for (const source of primarySources) {
    const items = await fetchAndCollect(source)
    primaryItems.push(...items)
  }

  const fallbackDecision = shouldUseFallback(primaryItems, strategy)
  if (fallbackDecision.useFallback && fallbackSources.length > 0) {
    console.log(
      `⚠️ 已到 ${fallbackDecision.timeZone} 的 ${fallbackDecision.today} ${fallbackDecision.currentHour}:00 最终发布时间，主源仅有 ${fallbackDecision.todayCount} 条当日内容，低于阈值 ${fallbackDecision.minimumPrimaryItemsToday}，启用回退源补齐。`
    )


    for (const source of fallbackSources) {
      await fetchAndCollect(source)
    }
  } else if (primarySources.length > 0) {
    console.log(
      `✅ 主源在 ${fallbackDecision.timeZone} 的 ${fallbackDecision.today} 已有 ${fallbackDecision.todayCount} 条当日内容，本次仅使用主源生成当天完整日报。`
    )

  }

  for (const source of defaultSources) {
    await fetchAndCollect(source)
  }

  await ensureDir(path.dirname(outputFile))
  await fs.writeFile(
    outputFile,
    JSON.stringify({
      strategy,
      activeSources: activeSourceNames,
      shouldWaitForPrimary: Boolean(fallbackDecision.shouldWaitForPrimary),
      fallbackDecision,
      items: allItems
    }, null, 2),
    'utf8'
  )


  console.log(`✅ 来源抓取完成: ${outputFile}`)
  console.log(`实际抓取来源数: ${activeSourceNames.length}`)
  console.log(`总条目数: ${allItems.length}`)
}


main().catch(error => {
  console.error('❌ 抓取 AI 情报来源失败:', error.message)
  process.exit(1)
})
