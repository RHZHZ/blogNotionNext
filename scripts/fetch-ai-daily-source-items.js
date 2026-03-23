const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const DEFAULT_SOURCES_FILE = path.join(ROOT, 'conf', 'ai-daily-sources.json')
const DEFAULT_OUTPUT_FILE = path.join(ROOT, 'temp', 'ai-daily-source-items.json')

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
  if (atomLink?.[1]) return atomLink[1].trim()
  const rssLink = extractTag(block, 'link')
  return rssLink.trim()
}

function mapXmlItem(block, source) {
  return {
    title: extractTag(block, 'title'),
    url: extractLink(block),
    source: source.name,
    sourceGroup: source.groupName || '',
    sourceTier: source.tier || '',
    publishedAt: extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated'),
    category: source.category || '',
    summary: extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content'),
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


async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function loadSourceConfig(configFile) {
  const parsed = await readJson(configFile)

  if (Array.isArray(parsed)) {
    return parsed.filter(source => source && source.enabled !== false)
  }

  if (Array.isArray(parsed.sources)) {
    return parsed.sources.filter(source => source && source.enabled !== false)
  }

  if (Array.isArray(parsed.groups)) {
    return normalizeGroupSources(parsed.groups).filter(source => source && source.enabled !== false)
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
  const sources = await loadSourceConfig(configFile)

  console.log('开始抓取每日 AI 情报来源...')
  console.log(`来源配置: ${configFile}`)
  console.log(`启用来源数: ${sources.length}`)

  const allItems = []

  for (const source of sources) {
    try {
      console.log(`- 抓取来源: ${source.name}`)
      const items = await fetchSource(source)
      console.log(`  获取到 ${items.length} 条`)
      allItems.push(...items)
    } catch (error) {
      console.warn(`  来源抓取失败: ${source.name} - ${error.message}`)
    }
  }

  await ensureDir(path.dirname(outputFile))
  await fs.writeFile(outputFile, JSON.stringify({ items: allItems }, null, 2), 'utf8')

  console.log(`✅ 来源抓取完成: ${outputFile}`)
  console.log(`总条目数: ${allItems.length}`)
}

main().catch(error => {
  console.error('❌ 抓取 AI 情报来源失败:', error.message)
  process.exit(1)
})
