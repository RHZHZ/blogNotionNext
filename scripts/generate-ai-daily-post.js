const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')


loadLocalEnv()

const { cacheImageToQiniu } = require('./qiniu-image-cache')


const ROOT = process.cwd()

const TEMP_DIR = path.join(ROOT, 'temp')
const DEFAULT_CANDIDATES_FILE = path.join(TEMP_DIR, 'ai-daily-candidates.json')
const DEFAULT_POST_JSON = path.join(TEMP_DIR, 'ai-daily-post.json')
const DEFAULT_POST_MD = path.join(TEMP_DIR, 'ai-daily-post.md')

function parseRequestedDate(value = '') {
  const normalized = String(value || '').trim()
  if (!normalized) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    throw new Error('AI_DAILY_DATE 格式错误，应为 YYYY-MM-DD')
  }
  return normalized
}

function normalizeDate(date = new Date()) {

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

function stripMarkdown(value = '') {
  return String(value)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\(([^)]*)\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/^-\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/---+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractSummaryFromMarkdown(markdown = '') {
  const normalized = String(markdown || '').replace(/\r\n/g, '\n')
  const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean)
  const preferred = lines.find(line => /^\*\*.+\*\*$/.test(line) || /^(结论|判断|如果只看今天|今天最重要的)/.test(line))
  const candidate = preferred || lines.find(line => !line.startsWith('##') && !line.startsWith('###') && !line.startsWith('- ') && !/^\d+\./.test(line)) || ''
  const clean = stripMarkdown(candidate)
  if (!clean) return ''
  return clean.slice(0, 140)
}

function buildInsightTitle(item = {}, index = 0) {
  const source = String(item.source || '这条动态')
  const category = String(item.category || '')
  const rawTitle = stripMarkdown(item.title || '')
  const summary = stripMarkdown(item.summary || '')

  const shortSummary = summary.slice(0, 28)
  const shortTitle = rawTitle.slice(0, 26)

  if (shortSummary) {
    return `${index + 1}. ${shortSummary}${shortSummary.endsWith('。') ? '' : '：'}这是今天更值得优先看的变化`
  }

  if (category) {
    return `${index + 1}. ${source} 把今天的关注点推向了「${category}」`
  }

  if (shortTitle) {
    return `${index + 1}. ${shortTitle} 背后更值得看的，是它释放出的新信号`
  }

  return `${index + 1}. 这条动态更值得看的，是它所代表的方向变化`
}

function stripAiInsertedImages(markdown = '') {
  return String(markdown || '')
    .replace(/^!\[.*\]\((https?:\/\/[^)]+)\)\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function normalizeForMatch(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[“”"'‘’《》【】\[\](){}:：,，.。!！?？、\-_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildItemMatchTokens(item = {}) {
  const values = [item.title, item.summary, item.source, item.category]
  const tokenSet = new Set()

  for (const value of values) {
    const normalized = normalizeForMatch(stripMarkdown(value || ''))
    if (!normalized) continue

    for (const token of normalized.split(' ')) {
      if (token.length >= 2) tokenSet.add(token)
    }
  }

  return Array.from(tokenSet)
}

const GENERIC_MATCH_TOKENS = new Set([
  'agent', 'ai', 'cli', 'mcp', 'prompt', 'hub', 'google', 'openai', 'langchain', 'langsmith',
  '开发者', '工具', '产品', '能力', '平台', '系统', '团队', '工作流', '发布', '环境', '模型', '今天'
])

function extractNamedEntities(value = '') {

  const text = stripMarkdown(value || '')
  const entitySet = new Set()
  const patterns = [
    /[A-Za-z][A-Za-z0-9.+-]{1,}/g,
    /[\u4e00-\u9fa5A-Za-z0-9]{2,}(?:Agent|agent|CLI|MCP|Prompt|Hub|OpenAI|Google|LangChain|LangSmith|CodePilot|Feishu|DingTalk|飞书|钉钉|谷歌|快手|KAT|OpenClaw)/g,
    /[\u4e00-\u9fa5]{2,8}/g
  ]

  for (const pattern of patterns) {
    const matches = text.match(pattern) || []
    for (const match of matches) {
      const normalized = normalizeForMatch(match)
      if (!normalized || normalized.length < 2) continue
      entitySet.add(normalized)
    }
  }

  return Array.from(entitySet).filter(token => token.length >= 2)
}

function extractUrlsFromText(value = '') {
  return String(value || '').match(/https?:\/\/[^\s)\]]+/g) || []
}

function tokenizeUrl(url = '') {
  const tokenSet = new Set()
  const normalizedUrl = String(url || '').trim()
  if (!normalizedUrl) return []

  try {
    const parsed = new URL(normalizedUrl)
    const hostParts = parsed.hostname.toLowerCase().split('.').filter(Boolean)
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const searchParts = Array.from(parsed.searchParams.values())
    const rawParts = [...hostParts, ...pathParts, ...searchParts]

    for (const part of rawParts) {
      for (const token of normalizeForMatch(part).split(' ')) {
        if (token.length >= 2) tokenSet.add(token)
      }
    }
  } catch {
    for (const token of normalizeForMatch(normalizedUrl).split(' ')) {
      if (token.length >= 2) tokenSet.add(token)
    }
  }

  return Array.from(tokenSet)
}

function buildSectionMatchContext(sectionText = '') {
  const lines = String(sectionText || '').replace(/\r\n/g, '\n').split('\n')
  const headingText = stripMarkdown((lines.find(line => /^###\s+/.test(line.trim())) || '').replace(/^###\s+/, ''))
  const introText = stripMarkdown(lines.slice(1, 6).join(' '))
  const cleanText = stripMarkdown(sectionText || '')
  const normalizedText = normalizeForMatch(cleanText)
  const normalizedHeading = normalizeForMatch(headingText)
  const normalizedIntro = normalizeForMatch(introText)
  const urls = extractUrlsFromText(sectionText)
  const urlTokens = new Set(urls.flatMap(url => tokenizeUrl(url)))
  const entities = new Set([
    ...extractNamedEntities(headingText),
    ...extractNamedEntities(introText)
  ])

  return {
    normalizedText,
    normalizedHeading,
    normalizedIntro,
    urls,
    urlTokens,
    entities
  }
}


function scoreItemForSection(sectionContext = {}, item = {}) {
  const image = String(item?.image || '').trim()
  if (!image) return { score: -1, reasons: [] }

  const titleText = stripMarkdown(item.title || '')
  const summaryText = stripMarkdown(item.summary || '')
  const title = normalizeForMatch(titleText)
  const summary = normalizeForMatch(summaryText)
  const itemTokens = buildItemMatchTokens(item).filter(token => !GENERIC_MATCH_TOKENS.has(token))
  const itemEntities = new Set([
    ...extractNamedEntities(titleText),
    ...extractNamedEntities(summaryText),
    ...extractNamedEntities(item.source || ''),
    ...extractNamedEntities(item.category || '')
  ])
  const itemUrls = [item.url, ...(Array.isArray(item.sourceLinks) ? item.sourceLinks : [])].filter(Boolean)
  const itemUrlTokens = new Set(itemUrls.flatMap(url => tokenizeUrl(url)).filter(token => !GENERIC_MATCH_TOKENS.has(token)))

  let score = 0
  const reasons = []

  if (title && sectionContext.normalizedHeading.includes(title)) {
    score += 28
    reasons.push('title-heading-exact')
  } else if (title && sectionContext.normalizedText.includes(title)) {
    score += 12
    reasons.push('title-exact')
  }

  if (summary && sectionContext.normalizedIntro && (sectionContext.normalizedIntro.includes(summary) || summary.includes(sectionContext.normalizedIntro))) {
    score += 8
    reasons.push('summary-intro')
  }

  for (const entity of itemEntities) {
    if (!entity || entity.length < 2) continue
    if (sectionContext.entities.has(entity)) {
      const weight = entity.length >= 6 ? 8 : 6
      score += weight
      reasons.push(`entity:${entity}`)
    }
  }

  for (const token of itemTokens) {
    if (!token || token.length < 3) continue
    if (sectionContext.normalizedHeading.includes(token)) {
      score += token.length >= 6 ? 7 : 5
      reasons.push(`heading-token:${token}`)
    } else if (sectionContext.normalizedIntro.includes(token)) {
      score += token.length >= 6 ? 4 : 3
      reasons.push(`intro-token:${token}`)
    }
  }

  for (const token of itemUrlTokens) {
    if (!token || token.length < 2) continue
    if (sectionContext.urlTokens.has(token)) {
      score += token.length >= 6 ? 10 : 8
      reasons.push(`url:${token}`)
    }
  }

  if (sectionContext.urls.some(url => itemUrls.includes(url))) {
    score += 24
    reasons.push('url-exact')
  }

  return { score, reasons }
}


function findBestImageItemForSection(sectionText = '', items = [], usedItemIds = new Set()) {
  const sectionContext = buildSectionMatchContext(sectionText)
  if (!sectionContext.normalizedText) return { item: null, score: 0, reasons: [] }

  let bestItem = null
  let bestScore = 0
  let bestReasons = []

  for (const item of items) {
    if (usedItemIds.has(item.id)) continue

    const { score, reasons } = scoreItemForSection(sectionContext, item)
    if (score > bestScore) {
      bestScore = score
      bestItem = item
      bestReasons = reasons
    }
  }

  return {
    item: bestScore >= 4 ? bestItem : null,
    score: bestScore,
    reasons: bestReasons
  }
}


function normalizeImageUrlForDedup(url = '') {
  const normalized = String(url || '').trim()
  if (!normalized) return ''

  if (normalized.startsWith('data:image/svg+xml')) {
    return normalized.slice(0, 240)
  }

  try {
    const parsed = new URL(normalized)
    parsed.hash = ''
    const removableParams = [
      'w',
      'width',
      'h',
      'height',
      'fit',
      'crop',
      'quality',
      'q',
      'format',
      'fm',
      'auto',
      'ixlib',
      'ixid',
      'updatedAt',
      'ver'
    ]
    for (const key of removableParams) {
      parsed.searchParams.delete(key)
    }
    return parsed.toString()
  } catch {
    return normalized
  }
}

function escapeXml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function wrapSvgText(text = '', maxCharsPerLine = 18, maxLines = 3) {
  const normalized = stripMarkdown(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const chars = Array.from(normalized)
  const lines = []
  let current = ''

  for (const char of chars) {
    current += char
    if (current.length >= maxCharsPerLine) {
      lines.push(current)
      current = ''
      if (lines.length >= maxLines) break
    }
  }

  if (current && lines.length < maxLines) lines.push(current)
  if (lines.length === maxLines && chars.length > lines.join('').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxCharsPerLine - 1))}…`
  }

  return lines
}

function buildFallbackCardImage(item = {}, index = 0, publishDate = '') {
  const category = escapeXml(item.category || 'AI 日报')
  const dateText = escapeXml(publishDate || '')
  const lines = wrapSvgText(item.title || `AI 情报配图 ${index + 1}`)
  const titleLines = lines.length ? lines : [`AI 情报配图 ${index + 1}`]
  const titleSvg = titleLines
    .map((line, lineIndex) => `<text x="72" y="${156 + lineIndex * 54}" fill="#F8FAFC" font-size="36" font-weight="700">${escapeXml(line)}</text>`)
    .join('')

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="55%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" rx="36" fill="url(#bg)"/>
  <circle cx="1040" cy="110" r="160" fill="rgba(255,255,255,0.08)"/>
  <circle cx="980" cy="520" r="220" fill="rgba(59,130,246,0.18)"/>
  <rect x="72" y="76" width="172" height="44" rx="22" fill="rgba(255,255,255,0.14)"/>
  <text x="100" y="105" fill="#BFDBFE" font-size="24" font-weight="600">AI 日报</text>
  <text x="72" y="420" fill="#93C5FD" font-size="26" font-weight="600">${category}</text>
  <text x="72" y="468" fill="#CBD5E1" font-size="22">${dateText}</text>
  ${titleSvg}
  <rect x="56" y="548" width="1088" height="54" rx="18" fill="rgba(15,23,42,0.72)" stroke="rgba(255,255,255,0.12)"/>
  <text x="84" y="582" fill="#E2E8F0" font-size="22" font-weight="700">blog: rhzhz.cn</text>
  <text x="386" y="582" fill="#BFDBFE" font-size="22" font-weight="600">公众号 RHZZZ</text>
  <text x="664" y="582" fill="#E5E7EB" font-size="20">关注 RHZZZ，持续获取每日 AI 情报</text>
</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function buildItemSectionMarker(item = {}) {
  return `[[ITEM_ID:${String(item.id || '').trim()}]]`
}

function annotateItemsForGeneration(items = []) {
  return items.map((item, index) => ({
    ...item,
    sectionMarker: buildItemSectionMarker(item),
    sectionIndex: index + 1
  }))
}

function stripSectionMarkers(markdown = '') {
  return String(markdown || '')
    .replace(/^\[\[ITEM_ID:[^\]]+\]\]\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function findItemBySectionMarker(sectionText = '', items = []) {
  const markerMatch = String(sectionText || '').match(/\[\[ITEM_ID:([^\]]+)\]\]/)
  if (!markerMatch?.[1]) return null
  const itemId = markerMatch[1].trim()
  return items.find(item => String(item?.id || '').trim() === itemId) || null
}

async function injectItemImagesIntoMarkdown(markdown = '', items = [], publishDate = '') {


  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
  const headings = []

  for (let index = 0; index < lines.length; index += 1) {
    if (/^###\s+/.test(lines[index].trim())) {
      headings.push(index)
    }
  }

  if (!headings.length) return markdown

  const result = [...lines]
  const usedItemIds = new Set()
  const usedImages = new Set()
  let offset = 0

  for (let i = 0; i < headings.length; i += 1) {
    const start = headings[i] + offset
    const nextHeading = i + 1 < headings.length ? headings[i + 1] + offset : result.length
    const sectionLines = result.slice(start, nextHeading)
    const alreadyHasImage = sectionLines.slice(1).some(line => /^!\[[^\]]*\]\((https?:\/\/[^)]+)\)$/.test(line.trim()))
    if (alreadyHasImage) continue

    const sectionText = sectionLines.join('\n')
    const markerMatchedItem = findItemBySectionMarker(sectionText, items)
    const matchResult = markerMatchedItem
      ? { item: markerMatchedItem, score: 999, reasons: ['marker'] }
      : findBestImageItemForSection(sectionText, items, usedItemIds)
    const matchedItem = matchResult.item
    const fallbackItem = markerMatchedItem || matchResult.score >= 4 ? null : items.find(item => {
      const image = String(item?.image || '').trim() || buildFallbackCardImage(item, i, publishDate)
      if (!image) return false
      return !usedItemIds.has(item.id)
    })
    const selectedItem = matchedItem || fallbackItem

    if (!selectedItem) continue

    const matchedIndex = items.findIndex(item => item?.id === selectedItem.id)

    const preferredItems = [selectedItem, ...items.slice(0, matchedIndex), ...items.slice(matchedIndex + 1)]
    const dedupedItem = preferredItems.find(item => {
      const image = String(item?.image || '').trim() || buildFallbackCardImage(item, i, publishDate)
      if (!image) return false
      if (usedItemIds.has(item.id)) return false
      const dedupKey = normalizeImageUrlForDedup(image)
      if (!dedupKey || usedImages.has(dedupKey)) return false
      const itemMatch = scoreItemForSection(buildSectionMatchContext(sectionText), item)
      return item.id === selectedItem.id || itemMatch.score >= 4
    })

    const chosenItem = dedupedItem || selectedItem


    const originalImage = String(chosenItem?.image || '').trim() || buildFallbackCardImage(chosenItem, i, publishDate)
    const imageDedupKey = normalizeImageUrlForDedup(originalImage)
    if (!originalImage || (imageDedupKey && usedImages.has(imageDedupKey))) continue

    const image = await cacheImageToQiniu(chosenItem, originalImage, publishDate)
    const isFallbackCard = originalImage.startsWith('data:image/svg+xml')
    const finalImage = isFallbackCard && image.startsWith('data:image/svg+xml') ? '' : (image || originalImage)
    if (!finalImage) continue

    const finalDedupKey = normalizeImageUrlForDedup(finalImage)
    const insertAt = start + 1
    const alt = stripMarkdown(chosenItem.title || `AI 情报配图 ${i + 1}`)
      .replace(/[\[\]\r\n]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    result.splice(insertAt, 0, `![${alt || `AI 情报配图 ${i + 1}`}](${finalImage})`, '')


    usedItemIds.add(chosenItem.id)
    if (finalDedupKey) usedImages.add(finalDedupKey)
    offset += 2
  }

  return stripSectionMarkers(result.join('\n'))
}







function buildDefaultMarkdown({ title, items }) {


  const topItems = items.slice(0, Math.min(10, Math.max(6, items.length)))

  const sourceNames = Array.from(new Set(topItems.map(item => item.source).filter(Boolean)))
  const sections = topItems.map((item, index) => {
    const conclusion = item.summary || '这条动态的信息增量较高，值得优先看完。'
    const whyItMatters = item.whyItMatters || '它真正值得关注的地方，不在于“又多了一条新闻”，而在于它反映了产品、模型或开发工具链正在发生的实际变化。'
    const impact = item.category || '模型、产品与开发者工具'
    const insightTitle = buildInsightTitle(item, index)
    return [
      `### ${insightTitle}`,

      '',
      `**先说判断：** ${conclusion}`,
      '',
      `这一条最值得看的，不只是它说了什么，而是它把今天的关注点进一步推向了“${impact}”这条主线。`,
      '',
      '- **关键信息**：',
      `  - 来源：${item.source || '未知来源'}`,
      `  - 类别：${impact}`,
      item.publishedAt ? `  - 发布时间：${item.publishedAt}` : '  - 发布时间：待补充',
      '',
      `**为什么现在值得看：** ${whyItMatters}`,
      '',
      `**对谁更重要：** 如果你最近在关注 ${impact} 相关方向，这条信息更值得优先消化。`,
      '',
      `**原始链接：** ${item.url || '待补充'}`
    ].join('\n')
  })

  return [
    `# ${title}`,
    '',
    '> 今天真正值得看的，不是“信息又多了几条”，而是哪几条已经开始影响开发者工具、产品能力和实际落地。',
    '',
    '## 今日总览',
    `今天这份 AI 日报，优先筛选上海时区当天的主源推送内容，再补充少量真正有信息增量的条目。相比零散快讯，更值得看的是：哪些变化已经开始变成可用的能力、可落地的工具和更明确的行业信号。`,
    '',
    '- **3 个核心判断**：',
    '- **判断一**：今天值得看的重点，不是单条新闻本身，而是它们共同指向的产品化进展。',
    '- **判断二**：开发者真正需要关注的，是哪些能力开始变得可调用、可接入、可复用。',
    '- **判断三**：如果一条信息不能影响工作流、使用体验或工具链，它的重要性就应该后排。',
    '',
    '---',
    '',
    '## 今天最值得看的 5-7 条',
    '',
    sections.join('\n\n---\n\n'),
    '',
    '---',
    '',
    '## 开发者视角',
    `今天这批信息里，更值得开发者重点看的通常集中在三个方向：一是模型或产品能力有没有进一步开放；二是工具链是否缩短了接入、调试或部署路径；三是哪些信号说明“能演示”正在变成“能落地”。${sourceNames.length ? `这篇内容涉及的核心来源包括：${sourceNames.join('、')}。` : ''}`,
    '',
    '- **如果你做内容或产品**：优先看哪些能力已经变成用户能直接感知的体验。',
    '- **如果你做开发或工作流**：优先看哪些工具、接口、平台更新能立刻接入现有流程。',
    '- **如果你关注行业判断**：优先看哪些变化不是概念升级，而是实际执行能力升级。',
    '',
    '## 今天的判断',
    '如果只看今天，一个更清晰的判断是：AI 内容已经不适合再按“新闻列表”来理解，而应该按“哪些东西正在变得可用、可部署、可持续”来筛选。真正值得留下来的，不是热闹感，而是那些能改变工作方式的增量。',
    '',
    '## RHZ 简评',
    '这类日报最怕写成平铺直叙的信息堆积，所以更好的方法不是把内容写更多，而是把真正有价值的那几条先拎出来。对读者来说，最好的阅读体验永远不是“看完全部”，而是“很快知道今天最该看什么”。',
    ''
  ].join('\n')
}


async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true })
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

async function removeFileIfExists(filePath) {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error
    }
  }
}

async function clearGeneratedPostArtifacts(postJsonFile, postMdFile) {
  await Promise.all([
    removeFileIfExists(postJsonFile),
    removeFileIfExists(postMdFile)
  ])
}

async function generateWithApi({ apiUrl, apiKey, prompt }) {

  const model = process.env.AI_DAILY_MODEL || process.env.AI_SUMMARY_MODEL || 'gpt-5.4'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: [
            '你是 RHZ 的中文技术博客编辑，擅长把 AI 动态写成有判断、有节奏、适合长文阅读的日报。',
            '文章要适合 HEO 主题阅读体验：开头抓人、段落短、层次清晰、标题明确、适合目录导航。',
            '不要写成资讯站快讯堆砌，也不要只复述新闻；要像一个有审美和判断的个人博客作者。',
            '输出只包含 Markdown 正文，不要解释，不要 JSON。',
            '每个重点情报都必须包含：发生了什么、为什么值得看、对开发者意味着什么。',
            '请避免空洞套话，优先写能让人继续往下读的具体判断。'
          ].join(' ')
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.55,
      max_tokens: 4200
    })
  })


  const text = await response.text()
  if (!response.ok) {
    throw new Error(`AI 接口请求失败: ${response.status} ${text.slice(0, 200)}`)
  }

  const data = JSON.parse(text)
  return data?.choices?.[0]?.message?.content?.trim() || ''
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateWithRetry({ apiUrl, apiKey, prompt }) {
  const maxAttempts = Math.max(1, Number(process.env.AI_DAILY_GENERATE_MAX_RETRIES || 3))
  const retryDelayMs = Math.max(0, Number(process.env.AI_DAILY_GENERATE_RETRY_DELAY_MS || 120000))
  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      if (attempt > 1) {
        console.log(`🔁 正在进行第 ${attempt}/${maxAttempts} 次 AI 正文生成尝试...`)
      }
      return await generateWithApi({ apiUrl, apiKey, prompt })
    } catch (error) {
      lastError = error
      const isLastAttempt = attempt >= maxAttempts
      console.warn(`⚠️ 第 ${attempt}/${maxAttempts} 次 AI 正文生成失败：${error.message}`)
      if (!isLastAttempt && retryDelayMs > 0) {
        console.log(`⏳ ${retryDelayMs}ms 后重试 AI 正文生成...`)
        await sleep(retryDelayMs)
      }
    }
  }

  throw lastError || new Error('AI 正文生成失败，且未捕获到具体错误')
}

async function main() {

  const candidatesFile = process.env.AI_DAILY_CANDIDATES_FILE || DEFAULT_CANDIDATES_FILE
  const postJsonFile = process.env.AI_DAILY_POST_JSON || DEFAULT_POST_JSON
  const postMdFile = process.env.AI_DAILY_POST_MD || DEFAULT_POST_MD
  const requestedDate = parseRequestedDate(process.env.AI_DAILY_DATE)
  const targetDate = requestedDate || normalizeDate()


  console.log('开始生成每日 AI 情报正文...')
  console.log(`候选池文件: ${candidatesFile}`)
  if (requestedDate) {
    console.log(`指定日期模式: ${requestedDate}`)
  }


  const candidates = await readJson(candidatesFile)
  const items = Array.isArray(candidates.items) ? candidates.items : []

  if (!items.length) {
    const candidateDate = String(candidates.date || targetDate).trim()
    const alreadyPublishedForTargetDate = Boolean(candidates.alreadyPublishedForTargetDate)
    const shouldWaitForPrimary = Boolean(candidates.shouldWaitForPrimary)
    if (alreadyPublishedForTargetDate) {
      await clearGeneratedPostArtifacts(postJsonFile, postMdFile)
      console.log(`✅ 目标日期 ${candidateDate} 的 AI 日报已存在，已清理旧正文产物并跳过本次生成。`)
      return
    }

    if (shouldWaitForPrimary) {
      await clearGeneratedPostArtifacts(postJsonFile, postMdFile)
      console.log(`⏳ 目标日期 ${candidateDate} 仍处于主源等待窗口，已清理旧正文产物并跳过本次生成。`)
      return
    }
    throw new Error(`目标日期 ${candidateDate} 的候选池为空，无法生成日报正文`)
  }




  const title = `每日 AI 情报｜${candidates.date || targetDate}`
  const slug = `daily-ai-news-${candidates.date || targetDate}`
  const annotatedItems = annotateItemsForGeneration(items)
  let markdown = ''

  let generationMode = 'template'
  let generationStatus = 'fallback'
  let generationWarning = ''

  const apiUrl = process.env.AI_DAILY_API || process.env.AI_SUMMARY_API || ''

  const apiKey = process.env.AI_DAILY_KEY || process.env.AI_SUMMARY_KEY || ''

  if (apiUrl && apiKey) {
    const prompt = [
      `请根据下面整理好的 AI 情报素材，为 ${title} 生成一篇适合直接发布到 RHZ 博客的中文 Markdown 长文。`,

      '',
      '写作目标：',
      '1. 不是简单汇总，而是帮读者快速判断今天真正值得看的变化。',
      '2. 文章必须具备明显的扫读体验：优先输出 6-10 条，按当天信息密度动态决定；宁可多 1-2 条，也不要为了压缩篇幅漏掉关键事实。',

      '3. 风格像个人技术博客，不像门户资讯站，也不像按时间倒序罗列的快讯流。',
      '4. 面向开发者，但也要照顾普通科技读者的理解成本。',

      '',
      '结构要求：',
      '1. 仅输出 Markdown。',
      '2. 不要再输出文章总标题，因为页面已有标题。',
      '3. 只使用这些 Markdown 结构：##、###、普通段落、- 无序列表、1. 编号列表、> 引用、--- 分隔线、**加粗**、Markdown 链接。不要使用表格、代码块、HTML、自定义标签。',
      '4. 必须包含这些二级标题：今日总览、今天最值得看的 6-10 条、开发者视角、今天的判断、RHZ 简评。',
      '5. 在“今日总览”里，先用 1 段给出今天的主判断，再用 3 条 bullet 写“3 个核心判断”，每条都要短、狠、明确。',
      '6. 在“今天最值得看的 6-10 条”下面，每条都用三级标题，标题必须带编号（如“### 1. ……”），并且标题必须是观点句或判断句，禁止直接复述原标题，最好让读者只看标题就知道这条信息为什么重要。',
      '6.1 每个三级标题下一行，必须单独保留该条素材自带的 sectionMarker，原样输出且不要改写、不要删除，例如 [[ITEM_ID:xxx]]。',

      '7. 每条三级标题下面第一段必须先给一句结论式开场，让读者一眼知道这条为什么值得读。',


      '8. 每条内容至少包含四个阅读锚点：一句判断、发生了什么、为什么值得关注、对谁影响更大。',
      '9. 如果某条素材提供了 image 字段且是明显可用的文章首图，可以在该条三级标题下插入 1 张 Markdown 图片，增强可读性；没有图片就不要强行补图。',
      '10. 多用短段落，每段尽量不超过 3 行，不要写连续大段文字墙。',
      '11. 可以用少量 bullet 提取关键信息，让正文兼顾扫读与深读。',
      '12. 每个大章节之间可以用 --- 分隔，但不要滥用。',
      '13. 结尾要有总结判断，收住全文。',

      '',
      '内容要求：',
      '1. 优先选择开发者价值高、信息增量大的候选，不要把明显偏泛资讯的内容写成重点。',
      '2. 允许引用原始来源名称和链接，但不要让链接喧宾夺主。',
      '3. 不要使用僵硬模板腔，但要保留清晰阅读节奏，让每条信息边界明显。',
      '4. 如果某条信息不够硬核但行业意义大，也可以入选，但要说清理由。',
      '5. 用词尽量自然、有判断，避免 AI 味太重。',
      '6. 整体读感要像一篇 HEO 风格的专题观察，不像新闻列表；优先制造“先看结论，再看展开”的阅读节奏。',
      '7. 开头与结尾都要有一句可以单独摘出来当卡片文案的强判断。',
      '8. 标题层级要服务目录导航，避免层级过深；正文尽量保持 H2 + H3 为主。',
      '9. 可以少量使用引用块承载核心判断，让页面更像专题文章。',
      '10. 文章必须让读者即使不逐段细看，也能通过标题、加粗句和 bullet 快速抓住重点。',
      '11. 每条三级标题都应尽量避免出现完整原标题原样照搬，而要把原标题翻译成一个更适合博客阅读的观点式标题。',
      '12. 正文里绝对不要出现“候选池”“素材池”“汇总链接”“内部来源”“系统输入”“提示词”等面向内部流程的措辞，要像作者直接在引用公开信息。',
      '13. 如果需要提到来源，请使用“公开信息显示”“原始来源显示”“相关项目/官方/作者提到”等自然表达；不要写“候选池提到”或“参考来源：候选池汇总链接”。',
      '14. 若某条信息只有聚合站链接而缺少原始项目链接，不要在正文中硬写“汇总链接”，而应改写为自然叙述，或使用更接近原始来源的公开链接。',
      '15. 除非素材本身明确属于同一件事的多个侧面，否则不要把两个不同候选条目的信息揉进同一小节。',
      '16. 如果某个候选条目本身是聚合快讯，正文也要尽量交代其中最关键的 1-2 个具体子信息，而不是只写成模糊的“大方向总结”。',


      '',
      '可参考的 AI 情报素材如下：',
      JSON.stringify(annotatedItems, null, 2)


    ].join('\n')

    console.log('检测到 AI 接口配置，尝试生成正式日报内容...')
    try {
      markdown = await generateWithRetry({ apiUrl, apiKey, prompt })
      if (markdown) {
        generationMode = 'ai'
        generationStatus = 'success'
      }
    } catch (error) {
      generationWarning = String(error.message || '').trim()
      console.warn(`⚠️ AI 接口多次重试后仍失败，将生成模板降级稿但默认不发布：${generationWarning}`)
    }
  }


  if (!markdown) {
    console.log('未配置 AI 接口、AI 返回为空或接口异常，使用本地模板生成日报草稿。')
    markdown = buildDefaultMarkdown({ title, date: targetDate, items: annotatedItems })

    generationMode = 'template-fallback'
    generationStatus = apiUrl && apiKey ? 'fallback_after_retry' : 'fallback_no_api'
  }



  markdown = stripAiInsertedImages(markdown)
  markdown = await injectItemImagesIntoMarkdown(markdown, annotatedItems, candidates.date || targetDate)


  const summary = extractSummaryFromMarkdown(markdown) || '今天最值得看的，不是某个模型参数更新，而是 AI 系统开始全面转向可执行、可治理、可持续运行的工程阶段。'



  const cover = process.env.AI_DAILY_DEFAULT_COVER || 'https://s41.ax1x.com/2026/03/23/peKAi7T.jpg'
  const payload = {

    title,
    slug,
    summary,
    tags: ['AI', '日报', '人工智能', '推荐'],
    status: 'Published',
    category: 'AI 情报',
    type: 'Post',
    icon: '🤖',
    cover,
    password: '',
    ai_summary: false,
    date: candidates.date || targetDate,
    markdown,
    sourceCount: items.length,
    generationMode,
    generationStatus,
    generationWarning,
    generatedAt: new Date().toISOString()
  }




  await ensureDir(path.dirname(postJsonFile))
  await fs.writeFile(postJsonFile, JSON.stringify(payload, null, 2), 'utf8')
  await fs.writeFile(postMdFile, markdown, 'utf8')

  console.log(`✅ 日报 JSON 已生成: ${postJsonFile}`)
  console.log(`✅ 日报 Markdown 已生成: ${postMdFile}`)
}

main().catch(error => {
  console.error('❌ 生成日报正文失败:', error.message)
  process.exit(1)
})
