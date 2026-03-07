import BLOG from '@/blog.config'
import { createLogger, createRequestId } from '@/lib/server/logger'
import { getAudioMetaMap } from '@/lib/server/audioMeta'

const logger = createLogger('audio-meta')
const debugBadgeEnabled = ['true', '1', 'yes', 'on'].includes(
  String(BLOG.MUSIC_PLAYER_DEBUG_BADGE || '').trim().toLowerCase()
)
const cacheProviderConfigured = String(BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const cacheProviderActive = cacheProviderConfigured === 'memory' ? 'memory' : 'memory'
const STRICT_ERROR = BLOG.MUSIC_PLAYER_AUDIO_META_STRICT_ERROR !== false

const setCacheHeaders = (res, maxAgeSeconds = 600) => {
  res.setHeader('Cache-Control', `public, s-maxage=${maxAgeSeconds}`)
}

const setProviderDebugHeaders = (res, requestId) => {
  if (!debugBadgeEnabled) return

  const fallback = cacheProviderConfigured !== cacheProviderActive
  res.setHeader('X-Player-Debug', '1')
  res.setHeader('X-Request-Id', requestId)
  res.setHeader('X-Cache-Provider-Configured', cacheProviderConfigured)
  res.setHeader('X-Cache-Provider-Active', cacheProviderActive)
  res.setHeader('X-Cache-Provider-Fallback', String(fallback))
  res.setHeader('X-Cache-Provider-Reason', fallback ? 'provider-fallback' : 'none')
}

const sendError = (res, status, requestId, error, code, maxAgeSeconds = 60) => {
  setCacheHeaders(res, maxAgeSeconds)
  return res.status(status).json({ error, code, requestId })
}

export default async function handler(_req, res) {
  const requestId = createRequestId()

  setProviderDebugHeaders(res, requestId)

  try {
    const metaMap = await getAudioMetaMap({ strict: STRICT_ERROR })
    logger.debug('Audio metadata fetched', {
      requestId,
      total: Object.keys(metaMap || {}).length
    })
    setCacheHeaders(res, 600)
    return res.status(200).json(metaMap || {})
  } catch (error) {
    logger.error('Failed to fetch audio metadata', {
      requestId,
      error: error?.message,
      code: error?.code
    })

    if (!STRICT_ERROR) {
      logger.warn('Fallback to empty metadata map due to non-strict mode', { requestId })
      setCacheHeaders(res, 60)
      return res.status(200).json({})
    }

    return sendError(
      res,
      error?.status || 502,
      requestId,
      error?.message === 'Audio meta database is not configured'
        ? 'Audio meta database is not configured'
        : error?.message === 'NOTION_ACCESS_TOKEN is missing'
          ? 'NOTION_ACCESS_TOKEN is missing'
          : 'Failed to fetch audio metadata from Notion',
      error?.code || 'NOTION_FETCH_FAILED'
    )
  }
}
