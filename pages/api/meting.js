// 简单的内存缓存
const cache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 缓存 30 分钟

export default async function handler(req, res) {
  const { url, level = 'standard', type = 'json' } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing required query param: url' })
  }

  const candidates = String(url)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  // 1. 设置浏览器端的响应头缓存（让浏览器 10 分钟内不重复发请求）
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')

  try {
    const results = await Promise.all(
      candidates.map(async (id) => {
        // 2. 检查内存缓存
        const cacheKey = `${id}_${level}`
        const cachedData = cache.get(cacheKey)
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          return cachedData.data
        }

        try {
          const upstream = new URL('https://metings.qjqq.cn/Song_V1')
          upstream.searchParams.set('url', id)
          upstream.searchParams.set('level', String(level))
          upstream.searchParams.set('type', String(type))

          const response = await fetch(upstream.toString(), {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          })

          if (!response.ok) return null
          const payload = await response.json()
          const d = payload?.data
          if (!d?.url) return null

          const track = {
            name: d.name || d.al_name || id,
            artist: d.ar_name || '',
            url: typeof d.url === 'string' ? d.url.replace(/^http:\/\//, 'https://') : d.url,
            cover: d.pic || '',
            lrc: d.lyric || ''
          }

          // 存入内存缓存
          cache.set(cacheKey, { data: track, timestamp: Date.now() })
          return track
        } catch (e) {
          console.error(`Failed to fetch ID ${id}:`, e)
          return null
        }
      })
    )

    const tracks = results.filter(Boolean)

    if (tracks.length === 0) {
      return res.status(502).json({ error: 'All upstream requests failed' })
    }

    // 随机打乱列表顺序 (Shuffle)
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]]
    }

    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json(tracks)
  } catch (error) {
    console.error('Meting Proxy Multi-Fetch Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
