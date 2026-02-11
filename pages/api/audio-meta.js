import BLOG from '@/blog.config'

// 优先读取配置中的文章元数据库 ID，如果没有则使用默认 ID
const AUDIO_META_DB_ID =
  process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  BLOG.MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  ''

/**
 * 规范化音频 Key：支持从 URL 提取文件名或直接使用字符串
 * @param {string} rawUrl
 * @returns {string}
 */
const normalizeAudioKey = (rawUrl) => {
  if (!rawUrl) return ''
  const cleanUrl = String(rawUrl).trim().split('?')[0]
  try {
    const u = new URL(cleanUrl)
    const filename = u.pathname.split('/').pop()
    return filename ? decodeURIComponent(filename) : cleanUrl
  } catch {
    const filename = cleanUrl.split('/').pop()
    return filename ? decodeURIComponent(filename) : cleanUrl
  }
}

// 简单的内存缓存
const cache = {
  data: null,
  timestamp: 0
}
const CACHE_TTL = 10 * 60 * 1000 // 缓存 10 分钟

export default async function handler(_req, res) {
  // 安全起见：只从环境变量读取 Token，不再从 blog.config 读取以防泄露
  const notionToken = process.env.NOTION_ACCESS_TOKEN

  // 1. 检查内存缓存
  if (cache.data && (Date.now() - cache.timestamp < CACHE_TTL)) {
    console.log('--- AudioMeta Cache Hit ---')
    res.setHeader('Cache-Control', 'public, s-maxage=600')
    return res.status(200).json(cache.data)
  }

  console.log('--- AudioMeta Debug (Fetching from Notion) ---')

  if (!notionToken) {
    console.error('Error: NOTION_ACCESS_TOKEN is missing in env or blog.config.js')
    return res.status(200).json({})
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${AUDIO_META_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: {
            property: 'Enabled',
            checkbox: { equals: true }
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Notion API Error Status:', response.status)
      console.error('Notion API Error Detail:', data)
      return res.status(200).json({})
    }

    console.log('Success: Fetched', data.results?.length, 'rows from Notion')

    const metaMap = {}

    for (const page of data?.results || []) {
      const p = page?.properties || {}
      
      // 根据截图修正字段解析逻辑：
      // AudioUrl 是 URL 类型，直接读取 .url
      const rawUrl = p.AudioUrl?.url || p.AudioUrl?.rich_text?.[0]?.plain_text || ''
      const key = normalizeAudioKey(rawUrl)

      if (!key) {
        console.log('Row skipped: AudioUrl is empty')
        continue
      }

      const name = p.Name?.title?.[0]?.plain_text || 
                   (Array.isArray(p.Name?.rich_text) ? p.Name.rich_text.map(t => t.plain_text).join('') : '') || 
                   p.Name?.rich_text?.[0]?.plain_text || 
                   ''
      const artist = p.Artist?.rich_text?.[0]?.plain_text || ''
      
      // Cover 列可能是 URL 或 Files 类型
      const cover =
        p.Cover?.url ||
        p.Cover?.files?.[0]?.file?.url ||
        p.Cover?.files?.[0]?.external?.url ||
        ''

      const lrc = Array.isArray(p.Lyrics?.rich_text)
        ? p.Lyrics.rich_text.map(t => t.plain_text).join('')
        : ''

      const album = p.Album?.rich_text?.[0]?.plain_text || ''

      metaMap[key] = {
        name,
        artist,
        album,
        cover,
        lrc,
        rawUrl
      }
      console.log(`Row processed: [${key}] -> ${name}`)
    }

    res.setHeader('Cache-Control', 'public, s-maxage=600')
    console.log('MetaMap final keys:', Object.keys(metaMap))

    // 存入缓存
    cache.data = metaMap
    cache.timestamp = Date.now()

    return res.status(200).json(metaMap)
  } catch (error) {
    console.error('Fetch System Error:', error)
    res.setHeader('Cache-Control', 'public, s-maxage=60')
    return res.status(200).json({})
  }
}
