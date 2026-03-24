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

  const audioMetaDbId = process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID
  const archiveDbId = process.env.MUSIC_PLAYER_ARCHIVE_DB_ID

  const dbIds = [
    { label: 'audioMetaDb', id: audioMetaDbId },
    { label: 'archiveDb', id: archiveDbId }
  ]

  for (const item of dbIds) {
    const detail = await notionFetch(`https://api.notion.com/v1/databases/${item.id}`)
    console.log(JSON.stringify({
      type: 'database-detail',
      label: item.label,
      id: item.id,
      ok: detail.ok,
      status: detail.status,
      title: (detail.json.title || []).map(x => x.plain_text).join(''),
      properties: Object.keys(detail.json.properties || {})
    }, null, 2))
  }

  const podcastQuery = await notionFetch(`https://api.notion.com/v1/databases/${audioMetaDbId}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        property: 'IsPodcast',
        checkbox: { equals: true }
      },
      page_size: 10
    })
  })

  console.log(JSON.stringify({
    type: 'isPodcast-query',
    id: audioMetaDbId,
    ok: podcastQuery.ok,
    status: podcastQuery.status,
    resultCount: (podcastQuery.json.results || []).length,
    samples: (podcastQuery.json.results || []).map(page => ({
      pageId: page.id,
      propertyNames: Object.keys(page.properties || {}),
      name: (page.properties?.Name?.title || []).map(x => x.plain_text).join('') ||
        (page.properties?.Title?.title || []).map(x => x.plain_text).join('') || ''
    }))
  }, null, 2))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
