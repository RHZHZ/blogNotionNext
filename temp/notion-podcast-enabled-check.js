const fs = require('fs')
const path = require('path')

function loadEnv(filePath) {
  const fullPath = path.resolve(filePath)
  const content = fs.readFileSync(fullPath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

const readPlainText = property => {
  if (!property) return ''
  if (Array.isArray(property.title)) return property.title.map(item => item?.plain_text || '').join('').trim()
  if (Array.isArray(property.rich_text)) return property.rich_text.map(item => item?.plain_text || '').join('').trim()
  if (typeof property.url === 'string') return property.url
  if (typeof property.checkbox === 'boolean') return String(property.checkbox)
  return ''
}

const readUrl = property => property?.url || property?.files?.[0]?.file?.url || property?.files?.[0]?.external?.url || readPlainText(property) || ''

async function notionFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_ACCESS_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  })
  const json = await res.json()
  return { ok: res.ok, status: res.status, json }
}

async function main() {
  loadEnv('.env.local')
  const db = process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID
  const result = await notionFetch(`https://api.notion.com/v1/databases/${db}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: { property: 'IsPodcast', checkbox: { equals: true } },
      page_size: 20
    })
  })

  console.log(JSON.stringify((result.json.results || []).map(page => ({
    pageId: page.id,
    Name: readPlainText(page.properties?.Name),
    AudioKey: readPlainText(page.properties?.AudioKey),
    SourceAudioUrl: readUrl(page.properties?.SourceAudioUrl),
    Enabled: page.properties?.Enabled?.checkbox,
    IsPodcast: page.properties?.IsPodcast?.checkbox,
    PCDescriptionLength: readPlainText(page.properties?.PCDescription).length
  })), null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
