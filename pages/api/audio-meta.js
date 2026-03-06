import BLOG from '@/blog.config'
import { createLogger, createRequestId } from '@/lib/server/logger'
import { createCacheStore, getCacheEntry, setCacheEntry } from '@/lib/server/cache'

const logger = createLogger('audio-meta')
const debugBadgeEnabled = ['true', '1', 'yes', 'on'].includes(
  String(BLOG.MUSIC_PLAYER_DEBUG_BADGE || '').trim().toLowerCase()
)
const logCacheHit = meta => logger.debug('Cache hit', meta)
const logPendingReuse = meta => logger.debug('Reuse pending metadata request', meta)
const logFetchSuccess = meta => logger.debug('Metadata fetch succeeded', meta)
const logFetchFailure = meta => logger.error('Fetch failed', meta)
const logFallback = meta => logger.warn('Fallback to empty metadata map due to non-strict mode', meta)
const logConfigError = (message, meta) => logger.error(message, meta)
const logProviderDiagnostics = requestId => {
  if (hasLoggedProviderDiagnostics) return
  hasLoggedProviderDiagnostics = true

  const fallback = cacheProviderConfigured !== cache.provider
  logger.debug('Provider diagnostics', {
    requestId,
    cacheProviderConfigured,
    cacheProviderActive: cache.provider,
    cacheFallback: fallback,
    cacheUnavailableReason: fallback ? 'provider-fallback' : null
  })
}

const setProviderDebugHeaders = (res, requestId) => {
  if (!debugBadgeEnabled) return

  const fallback = cacheProviderConfigured !== cache.provider
  res.setHeader('X-Player-Debug', '1')
  res.setHeader('X-Request-Id', requestId)
  res.setHeader('X-Cache-Provider-Configured', cacheProviderConfigured)
  res.setHeader('X-Cache-Provider-Active', cache.provider)
  res.setHeader('X-Cache-Provider-Fallback', String(fallback))
  res.setHeader('X-Cache-Provider-Reason', fallback ? 'provider-fallback' : 'none')
}

const AUDIO_META_DB_ID =
  process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  BLOG.MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  ''

const CACHE_TTL = Number(BLOG.MUSIC_PLAYER_AUDIO_META_CACHE_TTL || 10 * 60 * 1000)
const STRICT_ERROR = BLOG.MUSIC_PLAYER_AUDIO_META_STRICT_ERROR !== false
const AUDIO_META_CACHE_KEY = 'audio-meta:map'
const cacheProviderConfigured = String(BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const cache = createCacheStore(cacheProviderConfigured, {
  keyPrefix: 'blognext:audio-meta',
  defaultTtl: CACHE_TTL
})

let pendingPromise = null
let hasLoggedProviderDiagnostics = false

const normalizeAudioKey = rawUrl => {
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

const setCacheHeaders = (res, maxAgeSeconds = 600) => {
  res.setHeader('Cache-Control', `public, s-maxage=${maxAgeSeconds}`)
}

const sendError = (res, status, requestId, error, code, maxAgeSeconds = 60) => {
  setCacheHeaders(res, maxAgeSeconds)
  return res.status(status).json({ error, code, requestId })
}

async function queryNotionDatabase(notionToken) {
  const results = []
  let nextCursor = undefined

  while (true) {
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
          },
          ...(nextCursor ? { start_cursor: nextCursor } : {})
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const err = new Error(`Notion API Error: ${response.status}`)
      err.status = response.status
      err.payload = data
      throw err
    }

    results.push(...(data?.results || []))

    if (!data?.has_more || !data?.next_cursor) {
      break
    }

    nextCursor = data.next_cursor
  }

  return results
}

async function fetchAudioMetaMap(notionToken) {
  const pages = await queryNotionDatabase(notionToken)
  const metaMap = {}

  for (const page of pages) {
    const p = page?.properties || {}
    const rawUrl = p.AudioUrl?.url || p.AudioUrl?.rich_text?.[0]?.plain_text || ''
    const key = normalizeAudioKey(rawUrl)

    if (!key) continue

    const name =
      p.Name?.title?.[0]?.plain_text ||
      (Array.isArray(p.Name?.rich_text)
        ? p.Name.rich_text.map(t => t.plain_text).join('')
        : '') ||
      p.Name?.rich_text?.[0]?.plain_text ||
      ''

    const artist = p.Artist?.rich_text?.[0]?.plain_text || ''
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
  }

  return metaMap
}

export default async function handler(_req, res) {
  const requestId = createRequestId()
  const notionToken = process.env.NOTION_ACCESS_TOKEN

  logProviderDiagnostics(requestId)
  setProviderDebugHeaders(res, requestId)
  const cachedEntry = await getCacheEntry(cache, AUDIO_META_CACHE_KEY, CACHE_TTL)
  if (cachedEntry?.data) {
    logCacheHit({ requestId, provider: cache.provider })
    setCacheHeaders(res, 600)
    return res.status(200).json(cachedEntry.data)
  }

  if (!AUDIO_META_DB_ID) {
    logConfigError('Missing AUDIO_META_DB_ID', { requestId })
    return sendError(
      res,
      500,
      requestId,
      'Audio meta database is not configured',
      'AUDIO_META_DB_ID_MISSING'
    )
  }

  if (!notionToken) {
    logConfigError('Missing NOTION_ACCESS_TOKEN', { requestId })
    return sendError(
      res,
      503,
      requestId,
      'NOTION_ACCESS_TOKEN is missing',
      'NOTION_TOKEN_MISSING'
    )
  }

  try {
    if (!pendingPromise) {
      pendingPromise = fetchAudioMetaMap(notionToken)
    } else {
      logPendingReuse({ requestId })
    }

    const metaMap = await pendingPromise
    await setCacheEntry(cache, AUDIO_META_CACHE_KEY, metaMap, {
      source: 'notion',
      cachedAt: new Date().toISOString(),
      ttl: CACHE_TTL
    })

    logFetchSuccess({ requestId, total: Object.keys(metaMap).length, provider: cache.provider })
    setCacheHeaders(res, 600)
    return res.status(200).json(metaMap)
  } catch (error) {
    logFetchFailure({ requestId, error: error?.message })
    if (!STRICT_ERROR) {
      logFallback({ requestId })
      setCacheHeaders(res, 60)
      return res.status(200).json({})
    }
    return sendError(
      res,
      502,
      requestId,
      'Failed to fetch audio metadata from Notion',
      'NOTION_FETCH_FAILED'
    )
  } finally {
    pendingPromise = null
  }
}
