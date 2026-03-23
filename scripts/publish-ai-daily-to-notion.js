const fs = require('fs/promises')
const path = require('path')
const { loadLocalEnv } = require('./load-local-env')

loadLocalEnv()

const ROOT = process.cwd()

const DEFAULT_POST_JSON = path.join(ROOT, 'temp', 'ai-daily-post.json')
const NOTION_API_BASE = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw)
}

function richText(content) {
  const text = String(content || '').trim()
  if (!text) return []
  return parseInlineRichText(text)
}

function titleText(content) {
  const text = String(content || '').trim()
  if (!text) return []
  return [{ text: { content: text.slice(0, 1900) } }]
}

function createTextNode(content, annotations = {}, link = null) {
  const text = String(content || '')
  if (!text) return null
  return {
    type: 'text',
    text: {
      content: text.slice(0, 1900),
      ...(link ? { link: { url: link } } : {})
    },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
      ...annotations
    }
  }
}

function parseInlineRichText(content = '') {
  const text = String(content || '').trim()
  if (!text) return []

  const tokens = []
  const pattern = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = createTextNode(text.slice(lastIndex, match.index))
      if (plain) tokens.push(plain)
    }

    if (match[2]) {
      const bold = createTextNode(match[2], { bold: true })
      if (bold) tokens.push(bold)
    } else if (match[4] && match[5]) {
      const link = createTextNode(match[4], {}, match[5])
      if (link) tokens.push(link)
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    const rest = createTextNode(text.slice(lastIndex))
    if (rest) tokens.push(rest)
  }

  return tokens.length ? tokens : [{ text: { content: text.slice(0, 1900) } }]
}

function splitLines(markdown = '') {
  return String(markdown).replace(/\r\n/g, '\n').split('\n')
}

function chunkArray(items = [], size = 100) {
  const chunks = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}

function markdownToBlocks(markdown) {
  const lines = splitLines(markdown)
  const blocks = []
  let listBuffer = []
  let listType = null
  let paragraphBuffer = []

  const createImageBlock = url => ({
    object: 'block',
    type: 'image',
    image: {
      type: 'external',
      external: { url }
    }
  })



  const flushParagraph = () => {
    if (!paragraphBuffer.length) return
    const content = paragraphBuffer.join(' ').trim()
    if (!content) {
      paragraphBuffer = []
      return
    }

    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: richText(content) }
    })
    paragraphBuffer = []
  }

  const flushList = () => {
    if (!listBuffer.length) return
    const blockType = listType === 'numbered' ? 'numbered_list_item' : 'bulleted_list_item'
    for (const item of listBuffer) {
      blocks.push({
        object: 'block',
        type: blockType,
        [blockType]: { rich_text: richText(item) }
      })
    }
    listBuffer = []
    listType = null
  }


  const flushAll = () => {
    flushParagraph()
    flushList()
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      flushAll()
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph()
      if (listType && listType !== 'bulleted') {
        flushList()
      }
      listType = 'bulleted'
      listBuffer.push(line.replace(/^[-*]\s+/, '').trim())
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph()
      if (listType && listType !== 'numbered') {
        flushList()
      }
      listType = 'numbered'
      listBuffer.push(line.replace(/^\d+\.\s+/, '').trim())
      continue
    }


    if (line.startsWith('# ')) {
      flushAll()
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: richText(line.slice(2)) }
      })
      continue
    }

    if (line.startsWith('## ')) {
      flushAll()
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: richText(line.slice(3)) }
      })
      continue
    }

    if (line.startsWith('### ')) {
      flushAll()
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: richText(line.slice(4)) }
      })
      continue
    }

    if (line.startsWith('> ')) {
      flushAll()
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: richText(line.slice(2)) }
      })
      continue
    }

    if (/^---+$/.test(line)) {
      flushAll()
      blocks.push({
        object: 'block',
        type: 'divider',
        divider: {}
      })
      continue
    }

    const imageMatch = line.match(/^!\[[^\]]*\]\((https?:\/\/[^)]+)\)$/i)
    if (imageMatch?.[1]) {
      flushAll()
      blocks.push(createImageBlock(imageMatch[1]))
      continue
    }

    flushList()
    paragraphBuffer.push(line)
  }


  flushAll()
  return blocks
}

function getDefaultFieldMappings() {
  return {
    title: process.env.AI_DAILY_NOTION_TITLE_PROPERTY || 'title',
    type: process.env.AI_DAILY_NOTION_TYPE_PROPERTY || 'type',
    status: process.env.AI_DAILY_NOTION_STATUS_PROPERTY || 'status',
    date: process.env.AI_DAILY_NOTION_DATE_PROPERTY || 'date',
    slug: process.env.AI_DAILY_NOTION_SLUG_PROPERTY || 'slug',
    summary: process.env.AI_DAILY_NOTION_SUMMARY_PROPERTY || 'summary',
    tags: process.env.AI_DAILY_NOTION_TAGS_PROPERTY || 'tags',
    category: process.env.AI_DAILY_NOTION_CATEGORY_PROPERTY || 'category',
    icon: process.env.AI_DAILY_NOTION_ICON_PROPERTY || 'icon',
    cover: process.env.AI_DAILY_NOTION_COVER_PROPERTY || 'cover',
    password: process.env.AI_DAILY_NOTION_PASSWORD_PROPERTY || 'password',
    ai_summary: process.env.AI_DAILY_NOTION_AI_SUMMARY_PROPERTY || 'ai_summary'
  }
}


function getPostFieldValues(post) {
  return {
    title: post.title,
    type: post.type || 'Post',
    status: post.status || 'Published',
    date: post.date,
    slug: post.slug,
    summary: post.summary,
    tags: Array.isArray(post.tags) ? post.tags : [],
    category: post.category || 'AI 情报',
    icon: post.icon || '🤖',
    cover: post.cover || process.env.AI_DAILY_DEFAULT_COVER || 'https://s41.ax1x.com/2026/03/23/peKAi7T.jpg',
    password: post.password || '',
    ai_summary: post.ai_summary ?? false
  }
}


function buildPropertyValue(property, rawValue) {
  const type = property?.type
  if (!type) return null

  if (type === 'title') {
    return { title: titleText(rawValue) }
  }

  if (type === 'rich_text') {
    if (Array.isArray(rawValue)) {
      return { rich_text: richText(rawValue.join(', ')) }
    }
    return { rich_text: richText(rawValue) }
  }

  if (type === 'date') {
    return { date: rawValue ? { start: String(rawValue) } : null }
  }

  if (type === 'checkbox') {
    return { checkbox: Boolean(rawValue) }
  }

  if (type === 'select') {
    return { select: rawValue ? { name: String(rawValue).slice(0, 100) } : null }
  }

  if (type === 'status') {
    return { status: rawValue ? { name: String(rawValue).slice(0, 100) } : null }
  }

  if (type === 'multi_select') {
    const values = Array.isArray(rawValue)
      ? rawValue
      : String(rawValue || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    return {
      multi_select: values.slice(0, 20).map(name => ({ name: String(name).slice(0, 100) }))
    }
  }

  if (type === 'url') {
    return { url: rawValue ? String(rawValue) : null }
  }

  if (type === 'number') {
    const num = Number(rawValue)
    return { number: Number.isFinite(num) ? num : null }
  }

  return { rich_text: richText(rawValue) }
}

function buildPropertiesFromSchema(schema, post) {
  const mappings = getDefaultFieldMappings()
  const values = getPostFieldValues(post)
  const properties = {}

  for (const [logicalName, propertyName] of Object.entries(mappings)) {
    const property = schema?.[propertyName]
    if (!property) continue
    const notionValue = buildPropertyValue(property, values[logicalName])
    if (notionValue) {
      properties[propertyName] = notionValue
    }
  }

  return properties
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

async function getDatabaseSchema(databaseId) {
  const data = await notionRequest(`${NOTION_API_BASE}/databases/${databaseId}`, {
    method: 'GET'
  })
  return data?.properties || {}
}

async function appendBlocksToPage(pageId, blocks = []) {
  const chunks = chunkArray(blocks, 100)
  for (const chunk of chunks) {
    await notionRequest(`${NOTION_API_BASE}/blocks/${pageId}/children`, {
      method: 'PATCH',
      body: JSON.stringify({ children: chunk })
    })
  }
}

async function main() {
  const postFile = process.env.AI_DAILY_POST_JSON || DEFAULT_POST_JSON
  const databaseId = String(process.env.AI_DAILY_NOTION_DATABASE_ID || '').trim()
  const dryRun = String(process.env.AI_DAILY_DRY_RUN || '').trim() === '1'

  try {
    await fs.access(postFile)
  } catch {
    console.log('⏭️ 本次未生成日报正文，跳过 Notion 发布。')
    return
  }

  if (!databaseId) {
    throw new Error('缺少 AI_DAILY_NOTION_DATABASE_ID')
  }

  const post = await readJson(postFile)

  const schema = await getDatabaseSchema(databaseId)
  const properties = buildPropertiesFromSchema(schema, post)
  const children = markdownToBlocks(post.markdown)

  if (!properties.title) {
    throw new Error('数据库中未找到 title 标题字段，请检查 AI_DAILY_NOTION_TITLE_PROPERTY 或数据库字段名')
  }

  const [firstChunk = [], ...restChunks] = chunkArray(children, 100)
  const payload = {
    parent: { database_id: databaseId },
    properties,
    children: firstChunk,
    ...(post.cover
      ? {
          cover: {
            type: 'external',
            external: { url: post.cover }
          }
        }
      : {})
  }


  if (dryRun) {
    console.log('AI_DAILY_DRY_RUN=1，以下为即将写入 Notion 的 payload：')
    console.log(JSON.stringify({ ...payload, remainingChildrenCount: restChunks.flat().length }, null, 2))
    return
  }

  const data = await notionRequest(`${NOTION_API_BASE}/pages`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })

  if (restChunks.length > 0) {
    await appendBlocksToPage(data.id, restChunks.flat())
  }

  console.log('✅ 日报已写入 Notion 草稿页')
  console.log(`页面 ID: ${data.id}`)
  console.log(`标题: ${post.title}`)
  console.log(`正文块数: ${children.length}`)
}

main().catch(error => {
  console.error('❌ 写入 Notion 失败:', error.message)
  process.exit(1)
})
