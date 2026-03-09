// 简单的内存缓存
const cache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 缓存 30 分钟

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function getEnv(name, fallback = '') {
  const value = process.env[name]
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function buildUpstreamUrl({ id, level, type }) {
  const upstreamBase = getEnv('MUSIC_PLAYER_METING_UPSTREAM', getEnv('NEXT_PUBLIC_MUSIC_PLAYER_METING_UPSTREAM'))

  if (!upstreamBase) {
    return {
      error:
        'Missing env `MUSIC_PLAYER_METING_UPSTREAM` (or `NEXT_PUBLIC_MUSIC_PLAYER_METING_UPSTREAM`) for DynamicIslandPlayer meting proxy.'
    }
  }

  let upstream
  try {
    upstream = new URL(upstreamBase)
  } catch (error) {
    return {
      error: `Invalid meting upstream url: ${upstreamBase}`
    }
  }

  const urlParam = getEnv('MUSIC_PLAYER_METING_UPSTREAM_URL_PARAM', 'url')
  const levelParam = getEnv('MUSIC_PLAYER_METING_UPSTREAM_LEVEL_PARAM', 'level')
  const typeParam = getEnv('MUSIC_PLAYER_METING_UPSTREAM_TYPE_PARAM', 'type')

  upstream.searchParams.set(urlParam, id)
  upstream.searchParams.set(levelParam, String(level))
  upstream.searchParams.set(typeParam, String(type))

  return { url: upstream.toString() }
}

function pickTrack(payload, fallbackId) {
  const data = payload?.data || payload?.result || payload?.track || payload

  if (Array.isArray(data)) {
    return data.length ? pickTrack(data[0], fallbackId) : null
  }

  if (!data || typeof data !== 'object') return null

  const audioUrl =
    data.url ||
    data.audio ||
    data.src ||
    data.songUrl ||
    data.playUrl

  if (!audioUrl) return null

  return {
    name: data.name || data.title || data.songName || data.al_name || fallbackId,
    artist: data.artist || data.author || data.ar_name || '',
    url: typeof audioUrl === 'string' ? audioUrl.replace(/^http:\/\//, 'https://') : audioUrl,
    cover: data.cover || data.pic || data.poster || data.image || '',
    lrc: data.lrc || data.lyric || data.lyrics || ''
  }
}

export default async function handler(req, res) {
  const { url, level = 'jyeffect', type = 'json' } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing required query param: url' })
  }

  const candidates = String(url)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const results = await Promise.all(
      candidates.map(async id => {
        const cacheKey = `${id}_${level}_${type}`
        const cachedData = cache.get(cacheKey)
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
          return cachedData.data
        }

        try {
          const upstream = buildUpstreamUrl({ id, level, type })
          if (upstream.error) {
            throw new Error(upstream.error)
          }

          const response = await fetch(upstream.url, {
            headers: {
              'User-Agent': DEFAULT_USER_AGENT,
              Accept: 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error(`Upstream responded with ${response.status}`)
          }

          const payload = await response.json()
          const track = pickTrack(payload, id)
          if (!track?.url) return null

          cache.set(cacheKey, { data: track, timestamp: Date.now() })
          return track
        } catch (error) {
          console.error(`Failed to fetch ID ${id}:`, error)
          return null
        }
      })
    )

    const tracks = results.filter(Boolean)

    if (tracks.length === 0) {
      const upstreamConfig = getEnv('MUSIC_PLAYER_METING_UPSTREAM', getEnv('NEXT_PUBLIC_MUSIC_PLAYER_METING_UPSTREAM'))
      if (!upstreamConfig) {
        return res.status(500).json({
          error:
            'Meting upstream is not configured. Please set MUSIC_PLAYER_METING_UPSTREAM in your environment variables.'
        })
      }

      return res.status(502).json({ error: 'All upstream requests failed' })
    }

    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[tracks[i], tracks[j]] = [tracks[j], tracks[i]]
    }

    return res.status(200).json(tracks)
  } catch (error) {
    console.error('Meting Proxy Multi-Fetch Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
