import BLOG from '@/blog.config'
import { createCacheStore, getCacheEntry, setCacheEntry } from '@/lib/server/cache'

const AUDIO_META_DB_ID =
  process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  BLOG.MUSIC_PLAYER_ARTICLE_META_DB_ID ||
  ''
const ARCHIVE_DB_ID =
  process.env.MUSIC_PLAYER_ARCHIVE_DB_ID ||
  process.env.NOTION_AUDIO_ARCHIVE_DB_ID ||
  process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARCHIVE_DB_ID ||
  ''

const AUDIO_META_CACHE_TTL = Number(BLOG.MUSIC_PLAYER_AUDIO_META_CACHE_TTL || 10 * 60 * 1000)
const AUDIO_META_CACHE_KEY = 'audio-meta:map'
const cacheProviderConfigured = String(BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const cache = createCacheStore(cacheProviderConfigured, {
  keyPrefix: 'blognext:audio-meta',
  defaultTtl: AUDIO_META_CACHE_TTL
})

let pendingPromise = null

const readPlainText = property => {
  if (!property) return ''
  if (typeof property.plain_text === 'string') return property.plain_text
  if (typeof property.url === 'string') return property.url
  if (typeof property.email === 'string') return property.email
  if (typeof property.phone_number === 'string') return property.phone_number
  if (typeof property.number === 'number') return String(property.number)
  if (typeof property.checkbox === 'boolean') return String(property.checkbox)
  if (typeof property.formula?.string === 'string') return property.formula.string
  if (typeof property.formula?.number === 'number') return String(property.formula.number)
  if (typeof property.formula?.boolean === 'boolean') return String(property.formula.boolean)
  if (typeof property.rollup?.number === 'number') return String(property.rollup.number)
  if (typeof property.select?.name === 'string') return property.select.name
  if (typeof property.status?.name === 'string') return property.status.name
  if (Array.isArray(property.title)) {
    return property.title.map(item => item?.plain_text || '').join('').trim()
  }
  if (Array.isArray(property.rich_text)) {
    return property.rich_text.map(item => item?.plain_text || '').join('').trim()
  }
  return ''
}

const readUrl = property => {
  if (!property) return ''
  return (
    property.url ||
    property.files?.[0]?.file?.url ||
    property.files?.[0]?.external?.url ||
    property.formula?.string ||
    readPlainText(property) ||
    ''
  )
}

const pickPropertyValue = (properties = {}, names = [], reader = readPlainText) => {
  for (const name of names) {
    const value = reader(properties?.[name])
    if (value) return value
  }
  return ''
}

const readBooleanProperty = property => {
  if (!property) return false
  if (typeof property.checkbox === 'boolean') return property.checkbox

  const normalized = String(readPlainText(property) || '').trim().toLowerCase()
  return ['true', '1', 'yes', 'on', 'enabled', 'podcast', '播客', '是'].includes(normalized)
}

const pickBooleanPropertyValue = (properties = {}, names = []) => {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(properties || {}, name)) {
      return readBooleanProperty(properties?.[name])
    }
  }
  return false
}


const readNumberProperty = property => {
  if (!property) return null
  if (typeof property.number === 'number' && Number.isFinite(property.number)) return property.number
  if (typeof property.formula?.number === 'number' && Number.isFinite(property.formula.number)) return property.formula.number

  const value = Number(readPlainText(property))
  return Number.isFinite(value) ? value : null
}

const isArchivePlaylistEnabled = properties => {
  const candidates = ['InGlobalPlayer', 'AddToPlaylist', 'AddToGlobalPlayer', 'GlobalPlayerEnabled']
  return candidates.some(name => readBooleanProperty(properties?.[name]))
}

const isDirectoryLikeAudioValue = value => {
  const normalized = String(value || '').trim().split('?')[0]
  return Boolean(normalized && /\/$/.test(normalized))
}

export const normalizeAudioKey = rawUrl => {
  if (!rawUrl) return ''
  const cleanUrl = String(rawUrl).trim().split('?')[0]
  if (!cleanUrl || isDirectoryLikeAudioValue(cleanUrl)) return ''

  try {
    const u = new URL(cleanUrl)
    const filename = u.pathname.split('/').pop()
    return filename ? decodeURIComponent(filename) : ''
  } catch {
    const filename = cleanUrl.split('/').pop()
    return filename ? decodeURIComponent(filename) : ''
  }
}

export const buildAudioKeyVariants = rawValue => {
  const normalized = normalizeAudioKey(rawValue)
  if (!normalized) return []

  const variants = new Set([normalized])
  const withoutExt = normalized.replace(/\.[a-z0-9]{1,8}$/i, '')
  if (withoutExt && withoutExt !== normalized) {
    variants.add(withoutExt)
  }

  return Array.from(variants)
}

export const normalizeTrackId = rawId => String(rawId || '').trim()

const buildAudioMetaEntry = page => {
  const properties = page?.properties || {}
  const explicitAudioKey = pickPropertyValue(properties, ['AudioKey', '音频Key'])
  const rawUrl = pickPropertyValue(
    properties,
    ['AudioUrl', 'OriginalSourceUrl', 'SourceAudioUrl', 'OriginAudioUrl', 'ArchivedAudioUrl', 'StableAudioUrl'],
    readUrl
  )
  const archivedAudioUrl = pickPropertyValue(
    properties,
    ['ArchivedAudioUrl', 'StableAudioUrl', 'AudioUrl'],
    readUrl
  )
  const key = normalizeAudioKey(explicitAudioKey || rawUrl)
  const trackId = normalizeTrackId(
    pickPropertyValue(properties, ['TrackId', 'SourceTrackId', 'SongId', 'MetingId'])
  )

  return {
    key,
    entry: {
      trackId: trackId || null,
      name:
        pickPropertyValue(properties, ['Name']) ||
        pickPropertyValue(properties, ['Title']) ||
        '',
      artist: pickPropertyValue(properties, ['Artist']) || '',
      album: pickPropertyValue(properties, ['Album']) || '',
      cover: pickPropertyValue(properties, ['Cover'], readUrl) || '',
      lrc: pickPropertyValue(properties, ['Lyrics', 'Lrc']) || '',
      rawUrl,
      archivedAudioUrl,
      sourceAudioUrl: pickPropertyValue(
        properties,
        ['SourceAudioUrl', 'OriginAudioUrl', 'OriginalSourceUrl'],
        readUrl
      ) || '',
      archiveStatus: pickPropertyValue(properties, ['ArchiveStatus', 'Status']) || '',
      playlistOrder: readNumberProperty(properties?.PlaylistOrder),
      inGlobalPlayer: isArchivePlaylistEnabled(properties),
      isPodcast: pickBooleanPropertyValue(properties, ['IsPodcast', 'isPodcast', 'Podcast', 'Is PodCast', '播客', '播客版']),
      pcDescription: pickPropertyValue(properties, ['PCDescription', 'PodcastDescription', '播客描述']) || ''

    }
  }
}


const queryNotionDatabase = async ({ databaseId, notionToken, filter = null }) => {
  const results = []
  let nextCursor = undefined

  while (true) {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(filter ? { filter } : {}),
          ...(nextCursor ? { start_cursor: nextCursor } : {})
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      const err = new Error(`Notion API Error: ${response.status}`)
      err.status = 502
      err.code = 'NOTION_FETCH_FAILED'
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

const buildAudioMetaMaps = pages => {
  const byAudioKey = {}
  const byTrackId = {}
  const archivePlaylist = []

  for (const page of pages) {
    const { key, entry } = buildAudioMetaEntry(page)
    const trackId = normalizeTrackId(entry.trackId)
    const audioKeys = buildAudioKeyVariants(key)

    for (const audioKey of audioKeys) {
      byAudioKey[audioKey] = entry
    }

    if (trackId) {
      byTrackId[trackId] = entry
    }

    if (entry.inGlobalPlayer && (entry.archivedAudioUrl || entry.rawUrl || key || trackId)) {
      archivePlaylist.push({
        id: trackId || key,
        name: entry.name || trackId || key,
        artist: entry.artist || '',
        url: entry.archivedAudioUrl || entry.rawUrl || '',
        cover: entry.cover || '',
        lrc: entry.lrc || '',
        meta: {
          trackId: trackId || null,
          sourceUrl: entry.sourceAudioUrl || entry.rawUrl || '',
          source: 'archive-playlist',
          playlistOrder: entry.playlistOrder,
          isPodcast: entry.isPodcast || false,
          pcDescription: entry.pcDescription || '',
          audioArchive: {
            matched: true,
            by: trackId ? 'trackId' : 'audioKey',
            archived: Boolean(entry.archivedAudioUrl),
            archiveStatus: entry.archiveStatus || null
          }
        }
      })
    }
  }

  archivePlaylist.sort((a, b) => {
    const left = a?.meta?.playlistOrder
    const right = b?.meta?.playlistOrder
    if (left == null && right == null) return 0
    if (left == null) return 1
    if (right == null) return -1
    return left - right
  })

  return { byAudioKey, byTrackId, archivePlaylist }
}

const mergeAudioMetaEntry = (current = {}, incoming = {}) => ({
  trackId: incoming.trackId || current.trackId || null,
  name: incoming.name || current.name || '',
  artist: incoming.artist || current.artist || '',
  album: incoming.album || current.album || '',
  cover: incoming.cover || current.cover || '',
  lrc: incoming.lrc || current.lrc || '',
  rawUrl: incoming.rawUrl || current.rawUrl || '',
  archivedAudioUrl: incoming.archivedAudioUrl || current.archivedAudioUrl || '',
  sourceAudioUrl: incoming.sourceAudioUrl || current.sourceAudioUrl || '',
  archiveStatus: incoming.archiveStatus || current.archiveStatus || '',
  playlistOrder: incoming.playlistOrder ?? current.playlistOrder ?? null,
  inGlobalPlayer: Boolean(incoming.inGlobalPlayer || current.inGlobalPlayer),
  isPodcast: Boolean(incoming.isPodcast || current.isPodcast),
  pcDescription: incoming.pcDescription || current.pcDescription || ''
})

const enrichArchivePlaylistTrack = (track, mergedMaps) => {
  const trackId = normalizeTrackId(track?.meta?.trackId || track?.id)
  const audioKey = buildAudioKeyVariants(track?.meta?.sourceUrl || track?.url)[0]
  const entry =
    (trackId && mergedMaps.byTrackId?.[trackId]) ||
    (audioKey && mergedMaps.byAudioKey?.[audioKey]) ||
    null

  if (!entry) return track

  return {
    ...track,
    name: track?.name || entry.name || trackId || audioKey,
    artist: track?.artist || entry.artist || '',
    cover: track?.cover || entry.cover || '',
    lrc: track?.lrc || entry.lrc || '',
    meta: {
      ...(track?.meta || {}),
      trackId: trackId || entry.trackId || null,
      sourceUrl: track?.meta?.sourceUrl || entry.sourceAudioUrl || entry.rawUrl || track?.url || ''
    }
  }
}

const mergeAudioMetaMaps = (...mapsList) => {
  const merged = { byAudioKey: {}, byTrackId: {}, archivePlaylist: [] }

  for (const maps of mapsList) {
    for (const [key, entry] of Object.entries(maps?.byAudioKey || {})) {
      merged.byAudioKey[key] = mergeAudioMetaEntry(merged.byAudioKey[key], entry)
    }

    for (const [trackId, entry] of Object.entries(maps?.byTrackId || {})) {
      merged.byTrackId[trackId] = mergeAudioMetaEntry(merged.byTrackId[trackId], entry)
    }

    if (Array.isArray(maps?.archivePlaylist)) {
      merged.archivePlaylist.push(...maps.archivePlaylist)
    }
  }

  merged.archivePlaylist = merged.archivePlaylist.map(track => enrichArchivePlaylistTrack(track, merged))

  return merged
}

export const hasAudioMetaSourceConfigured = () =>
  Boolean((AUDIO_META_DB_ID || ARCHIVE_DB_ID) && process.env.NOTION_ACCESS_TOKEN)

export async function getAudioMetaMaps({ strict = true } = {}) {
  const shouldBypassCache = process.env.NODE_ENV !== 'production'

  if (!shouldBypassCache) {
    const cachedEntry = await getCacheEntry(cache, AUDIO_META_CACHE_KEY, AUDIO_META_CACHE_TTL)
    if (cachedEntry?.data) {
      return cachedEntry.data
    }
  }


  if (!AUDIO_META_DB_ID && !ARCHIVE_DB_ID) {
    const error = new Error('Audio meta database is not configured')
    error.code = 'AUDIO_META_DB_ID_MISSING'
    error.status = 500
    if (strict) throw error
    return { byAudioKey: {}, byTrackId: {}, archivePlaylist: [] }
  }

  const notionToken = process.env.NOTION_ACCESS_TOKEN
  if (!notionToken) {
    const error = new Error('NOTION_ACCESS_TOKEN is missing')
    error.code = 'NOTION_TOKEN_MISSING'
    error.status = 503
    if (strict) throw error
    return { byAudioKey: {}, byTrackId: {}, archivePlaylist: [] }
  }

  try {
    if (!pendingPromise) {
      pendingPromise = (async () => {
        const audioMetaPages = AUDIO_META_DB_ID
          ? await queryNotionDatabase({
              databaseId: AUDIO_META_DB_ID,
              notionToken,
              filter: {
                property: 'Enabled',
                checkbox: { equals: true }
              }
            })
          : []
        const archivePages = ARCHIVE_DB_ID
          ? await queryNotionDatabase({
              databaseId: ARCHIVE_DB_ID,
              notionToken
            })
          : []

        return mergeAudioMetaMaps(
          buildAudioMetaMaps(audioMetaPages),
          buildAudioMetaMaps(archivePages)
        )
      })()
    }

    const metaMaps = await pendingPromise
    await setCacheEntry(cache, AUDIO_META_CACHE_KEY, metaMaps, {
      source: 'notion',
      cachedAt: new Date().toISOString(),
      ttl: AUDIO_META_CACHE_TTL
    })

    return metaMaps
  } catch (error) {
    if (strict) throw error
    return { byAudioKey: {}, byTrackId: {}, archivePlaylist: [] }
  } finally {
    pendingPromise = null
  }
}

export const getAudioMetaMap = async options => {
  const maps = await getAudioMetaMaps(options)
  return maps.byAudioKey || {}
}

export const getArchivePlaylistTracks = async options => {
  const maps = await getAudioMetaMaps(options)
  return maps.archivePlaylist || []
}
