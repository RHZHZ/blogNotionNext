import BLOG from '@/blog.config'
import { createLogger, createRequestId } from '@/lib/server/logger'
import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import {
  buildMetingCacheKey,
  createCacheStore,
  getCacheEntry,
  setCacheEntry,
  __internal as cacheInternal
} from '@/lib/server/cache'
import {
  checkIpRateLimit,
  checkUpstreamRateLimit,
  cleanupExpiredIpLimits,
  createIpRateLimitStore,
  createUpstreamRateLimitStore,
  setRateLimitHeaders
} from '@/lib/server/rateLimit'
import {
  getAudioMetaMaps,
  hasAudioMetaSourceConfigured,
  normalizeAudioKey,
  normalizeTrackId,
  buildAudioKeyVariants
} from '@/lib/server/audioMeta'

const logger = createLogger('meting')

const debugBadgeEnabled = ['true', '1', 'yes', 'on'].includes(
  String(BLOG.MUSIC_PLAYER_DEBUG_BADGE || '').trim().toLowerCase()
)
const cacheProviderConfigured = String(BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const rateLimitProviderConfigured = String(BLOG.MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER || 'memory')
const cacheStore = createCacheStore(cacheProviderConfigured)
const cache = cacheStore
const pendingRequests = new Map();
const CACHE_TTL = Number(BLOG.MUSIC_PLAYER_METING_CACHE_TTL || 24 * 60 * 60 * 1000); // 24小时
const PLAYLIST_CACHE_TTL = Number(BLOG.MUSIC_PLAYER_METING_PLAYLIST_CACHE_TTL || CACHE_TTL);
const PLAYLIST_MAX_TRACKS = Number(BLOG.MUSIC_PLAYER_METING_PLAYLIST_MAX_TRACKS || 20);
const buildPlaylistCacheKey = playlistId => `meting:playlist:${String(playlistId || '').trim()}`
const cacheStats = {
  hits: 0,
  misses: 0,
  retries: 0,
  rateLimited: 0
};
let hasLoggedProviderDiagnostics = false;

// 速率限制配置
const RATE_LIMIT_CONFIG = {
  // 基于IP的请求限制
  ip: {
    windowMs: 60 * 1000, // 1分钟窗口
    maxRequests: Number(BLOG.MUSIC_PLAYER_METING_MAX_REQUESTS || 60),     // 每分钟最多请求数
    burstLimit: 10,      // 突发请求限制
  },
  // 基于上游API的限制
  upstream: {
    windowMs: 60 * 1000,  // 1分钟窗口
    maxRequests: Number(BLOG.MUSIC_PLAYER_METING_UPSTREAM_LIMIT || 30),      // 每分钟最多上游请求数
    retryAfterMs: 1000,   // 超出限制后重试间隔
  }
};

// 速率限制存储
const rateLimits = {
  ipLimits: createIpRateLimitStore(rateLimitProviderConfigured),    // IP -> {count, resetTime, burstCount}
  upstreamLimits: createUpstreamRateLimitStore(rateLimitProviderConfigured, {
    initialState: {
      resetTime: Date.now() + RATE_LIMIT_CONFIG.upstream.windowMs
    }
  })      // 上游API限制
};

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,           // 最大重试次数
  baseDelay: 1000,         // 基础延迟1秒
  maxDelay: 10000,         // 最大延迟10秒
  backoffFactor: 2,        // 指数退避因子
  retryableErrors: [       // 可重试的错误类型
    'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND',
    'ECONNREFUSED', 'EAI_AGAIN', 'AbortError'
  ],
  retryableStatusCodes: [  // 可重试的HTTP状态码
    408, 429, 500, 502, 503, 504, 403
  ]
};

const logRequest = (message, meta) => logger.info(message, meta)
const logResponse = (message, meta) => logger.info(message, meta)
const logCacheHit = (message, meta) => logger.info(message, meta)
const logFetchSuccess = (message, meta) => logger.info(message, meta)
const logRetry = (message, meta) => logger.warn(message, meta)
const logRateLimit = (message, meta) => logger.warn(message, meta)
const logWarning = (message, meta) => logger.warn(message, meta)
const logError = (message, meta) => logger.error(message, meta)
const logDebug = (message, meta) => logger.debug(message, meta)

function resolveProviderAvailability(provider) {
  const normalized = String(provider || '').trim().toLowerCase()
  if (normalized === 'redis') {
    return typeof cacheInternal?.getRedisAvailability === 'function'
      ? cacheInternal.getRedisAvailability()
      : { enabled: cache.provider === 'redis', reason: null }
  }
  if (normalized === 'upstash' || normalized === 'kv') {
    return typeof cacheInternal?.getRestAvailability === 'function'
      ? cacheInternal.getRestAvailability(normalized)
      : { enabled: cache.provider === normalized, reason: null }
  }
  return { enabled: true, reason: null }
}

function logProviderDiagnostics(requestId) {
  if (hasLoggedProviderDiagnostics) return
  hasLoggedProviderDiagnostics = true

  const cacheAvailability = resolveProviderAvailability(cacheProviderConfigured)
  const rateLimitAvailability = resolveProviderAvailability(rateLimitProviderConfigured)
  const cacheFallback = cacheProviderConfigured !== cache.provider
  const ipFallback = rateLimitProviderConfigured !== rateLimits.ipLimits.provider
  const upstreamFallback = rateLimitProviderConfigured !== rateLimits.upstreamLimits.provider

  logDebug('Provider diagnostics', {
    requestId,
    cacheProviderConfigured,
    cacheProviderActive: cache.provider,
    cacheFallback,
    cacheUnavailableReason: cacheFallback ? cacheAvailability.reason : null,
    rateLimitProviderConfigured,
    ipRateLimitProviderActive: rateLimits.ipLimits.provider,
    upstreamRateLimitProviderActive: rateLimits.upstreamLimits.provider,
    ipRateLimitFallback: ipFallback,
    upstreamRateLimitFallback: upstreamFallback,
    rateLimitUnavailableReason: ipFallback || upstreamFallback ? rateLimitAvailability.reason : null
  })
}

function setProviderDebugHeaders(res, requestId) {
  if (!debugBadgeEnabled) return

  const cacheAvailability = resolveProviderAvailability(cacheProviderConfigured)
  const rateLimitAvailability = resolveProviderAvailability(rateLimitProviderConfigured)
  const cacheFallback = cacheProviderConfigured !== cache.provider
  const ipFallback = rateLimitProviderConfigured !== rateLimits.ipLimits.provider
  const upstreamFallback = rateLimitProviderConfigured !== rateLimits.upstreamLimits.provider

  res.setHeader('X-Player-Debug', '1')
  res.setHeader('X-Request-Id', requestId)
  res.setHeader('X-Cache-Provider-Configured', cacheProviderConfigured)
  res.setHeader('X-Cache-Provider-Active', cache.provider)
  res.setHeader('X-Cache-Provider-Fallback', String(cacheFallback))
  res.setHeader('X-Cache-Provider-Reason', cacheFallback ? (cacheAvailability.reason || 'provider-fallback') : 'none')
  res.setHeader('X-RateLimit-Provider-Configured', rateLimitProviderConfigured)
  res.setHeader('X-Ip-RateLimit-Provider-Active', rateLimits.ipLimits.provider)
  res.setHeader('X-Upstream-RateLimit-Provider-Active', rateLimits.upstreamLimits.provider)
  res.setHeader('X-RateLimit-Provider-Fallback', String(ipFallback || upstreamFallback))
  res.setHeader(
    'X-RateLimit-Provider-Reason',
    ipFallback || upstreamFallback ? (rateLimitAvailability.reason || 'provider-fallback') : 'none'
  )
}

async function checkIPRateLimit(ip) {
  return checkIpRateLimit(rateLimits.ipLimits, RATE_LIMIT_CONFIG.ip, ip, () => {
    cacheStats.rateLimited++
  })
}

// 检查上游API速率限制
async function checkUpstreamRateLimitLocal() {
  return checkUpstreamRateLimit(
    rateLimits.upstreamLimits,
    RATE_LIMIT_CONFIG.upstream,
    () => {
      cacheStats.rateLimited++
    }
  )
}

// 指数退避延迟计算
function calculateRetryDelay(attempt) {
  const delay = Math.min(
    RETRY_CONFIG.maxDelay,
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt - 1)
  );
  return delay + Math.random() * 1000; // 添加随机抖动避免惊群
}

// 判断错误是否可重试
function isRetryableError(error, statusCode) {
  // 检查错误类型
  if (error && RETRY_CONFIG.retryableErrors.includes(error.name || error.code)) {
    return true;
  }
  
  // 检查HTTP状态码
  if (statusCode && RETRY_CONFIG.retryableStatusCodes.includes(statusCode)) {
    return true;
  }
  
  // 特定错误消息匹配
  if (error && error.message) {
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('timeout') || 
        errorMsg.includes('network') || 
        errorMsg.includes('socket') ||
        errorMsg.includes('连接') ||
        errorMsg.includes('超时')) {
      return true;
    }
  }
  
  return false;
}

// 带重试和速率限制的fetchTrack函数
async function fetchTrack(id, level, type, startTime, attempt = 1) {
  const upstream = new URL('https://metings.qjqq.cn/Song_V1');
  upstream.searchParams.set('url', id);
  upstream.searchParams.set('level', String(level));
  upstream.searchParams.set('type', String(type));
  
  // 检查上游速率限制
  const upstreamLimit = await checkUpstreamRateLimitLocal();
  if (!upstreamLimit.allowed) {
    logRateLimit('上游API限制中', {
      reason: '达到上游请求限制',
      retryAfter: upstreamLimit.retryAfter
    });
    await new Promise(resolve => setTimeout(resolve, upstreamLimit.retryAfter));
    return fetchTrack(id, level, type, startTime, attempt); // 递归重试
  }
  
  const controller = new AbortController();
  const timeout = Math.min(10000, 2000 * attempt); // 重试时增加超时时间
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(upstream.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const fetchTime = Date.now() - startTime;
    
    if (!response.ok) {
      // 检查是否可重试
      if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(null, response.status)) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
    logRetry(`HTTP ${response.status}: ${id}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchTrack(id, level, type, startTime, attempt + 1);
      }
      
      logError(`上游请求失败`, { 
        details: `ID: ${id} | 状态码: ${response.status} | 耗时: ${fetchTime}ms | 尝试: ${attempt}`
      });
      return null;
    }
    
    const payload = await response.json();
    const d = payload?.data;
    if (!d?.url) {
      // 无效数据，检查是否重试
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
        logRetry(`无效响应数据: ${id}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchTrack(id, level, type, startTime, attempt + 1);
      }
      
      logError(`无效响应数据`, { 
        details: `ID: ${id} | 耗时: ${fetchTime}ms | 尝试: ${attempt}`
      });
      return null;
    }
    
    if (attempt > 1) {
      logRetry(`重试成功: ${d.name || id}`, {
        attempt: attempt - 1,
        totalAttempts: attempt
      });
    }
    
    logFetchSuccess(`获取成功: ${d.name || id}`, { 
      duration: fetchTime,
      attempt
    });
    
    return {
      id: String(id),
      name: d.name || d.al_name || id,
      artist: d.ar_name || '',
      url: typeof d.url === 'string' ? d.url.replace(/^http:\/\//, 'https://') : d.url,
      cover: d.pic || '',
      lrc: d.lyric || '',
      meta: {
        trackId: String(id),
        sourceUrl: typeof d.url === 'string' ? d.url : '',
        attemptCount: attempt,
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const errorType = error.name === 'AbortError' ? '超时' : '网络错误';
    const fetchTime = Date.now() - startTime;
    
    // 检查是否可重试
    if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(error)) {
      const delay = calculateRetryDelay(attempt);
      cacheStats.retries++;
      logRetry(`${errorType}: ${id}`, {
        attempt,
        delay,
        nextAttempt: attempt + 1,
        error: error.message
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchTrack(id, level, type, startTime, attempt + 1);
    }
    
    logError(`${errorType}: ${id}`, { 
      details: `${error.message} | 耗时: ${fetchTime}ms | 尝试: ${attempt}次`
    });
    return null;
  }
}

function normalizeTrack(track, fallback = {}) {
  return {
    id: track?.id || fallback.id,
    name: track?.name || fallback.name || fallback.id,
    artist: track?.artist || fallback.artist || '',
    url: track?.url,
    cover: track?.cover || fallback.cover || '',
    lrc: track?.lrc || '',
    meta: {
      ...(fallback.meta || {}),
      ...(track?.meta || {})
    }
  };
}

function resolveAudioMetaEntry(candidate, track, audioMetaMaps) {
  if (!audioMetaMaps) return null

  const trackIdCandidates = [
    track?.id,
    candidate?.id,
    track?.meta?.trackId,
    candidate?.meta?.trackId
  ]
    .map(value => normalizeTrackId(value))
    .filter(Boolean)

  for (const trackId of trackIdCandidates) {
    const entry = audioMetaMaps.byTrackId?.[trackId]
    if (entry) return entry
  }

  const audioKeyCandidates = [track?.url, track?.meta?.sourceUrl, candidate?.meta?.sourceUrl]
    .flatMap(value => buildAudioKeyVariants(value))
    .filter(Boolean)

  for (const audioKey of audioKeyCandidates) {
    const entry = audioMetaMaps.byAudioKey?.[audioKey]
    if (entry) return entry
  }

  return null
}

function applyAudioMetaToTrack(track, candidate, audioMetaMaps) {
  const normalizedTrack = normalizeTrack(track, candidate)
  const audioMetaEntry = resolveAudioMetaEntry(candidate, normalizedTrack, audioMetaMaps)

  if (!audioMetaEntry) {
    return normalizedTrack
  }

  const preserveStableArchiveUrl = [normalizedTrack?.meta?.source, candidate?.meta?.source].includes('archive-playlist')
  const archivedAudioUrl = audioMetaEntry.archivedAudioUrl || (preserveStableArchiveUrl ? normalizedTrack.url : (audioMetaEntry.rawUrl || normalizedTrack.url))
  return {
    ...normalizedTrack,
    name: audioMetaEntry.name || normalizedTrack.name,
    artist: audioMetaEntry.artist || normalizedTrack.artist,
    url: archivedAudioUrl || normalizedTrack.url,
    cover: audioMetaEntry.cover || normalizedTrack.cover,
    lrc: audioMetaEntry.lrc || normalizedTrack.lrc,
    meta: {
      ...(normalizedTrack.meta || {}),
      trackId: audioMetaEntry.trackId || normalizedTrack.meta?.trackId || candidate?.id || null,
      sourceUrl: audioMetaEntry.sourceAudioUrl || audioMetaEntry.rawUrl || normalizedTrack.meta?.sourceUrl || normalizedTrack.url || '',
      playlistOrder: audioMetaEntry.playlistOrder ?? normalizedTrack.meta?.playlistOrder ?? candidate?.meta?.playlistOrder ?? null,
      originalIndex: normalizedTrack.meta?.originalIndex ?? candidate?.meta?.originalIndex ?? null,
      isPodcast: Boolean(audioMetaEntry.isPodcast),
      pcDescription: audioMetaEntry.pcDescription || '',
      audioArchive: {
        matched: true,
        by: audioMetaEntry.trackId ? 'trackId' : 'audioKey',
        archived: Boolean(audioMetaEntry.archivedAudioUrl || preserveStableArchiveUrl),
        archiveStatus: audioMetaEntry.archiveStatus || null
      }
    }
  }
}


function createPlaylistTrackFallback(item = {}, index = 0) {
  return {
    id: String(item?.id || ''),
    name: item?.name || String(item?.id || ''),
    artist: typeof item?.artists === 'string'
      ? item.artists
      : Array.isArray(item?.artists)
        ? item.artists.join(' / ')
        : '',
    cover: item?.coverImgUrl || item?.picUrl || '',
    meta: {
      album: item?.album || '',
      source: 'playlist-fallback',
      trackId: String(item?.id || ''),
      sourceUrl: item?.url || '',
      playlistOrder: Number.isFinite(item?.playlistOrder) ? item.playlistOrder : null,
      originalIndex: index
    }
  };
}

function buildTrackIdentityKeys(track) {
  const trackId = normalizeTrackId(track?.id || track?.meta?.trackId)
  const audioKey = normalizeAudioKey(track?.meta?.sourceUrl || track?.url)
  const urlKey = String(track?.url || '').trim()

  return {
    trackId,
    audioKey,
    urlKey
  }
}

function getTrackPlaylistOrder(track) {
  const value = Number(track?.meta?.playlistOrder)
  return Number.isFinite(value) && value > 0 ? value : null
}

function sortTracksByPlaylistOrder(tracks = []) {
  return tracks
    .map((track, index) => ({ track, index }))
    .sort((left, right) => {
      const leftOrder = getTrackPlaylistOrder(left.track)
      const rightOrder = getTrackPlaylistOrder(right.track)
      const leftOriginalIndex = Number.isFinite(left.track?.meta?.originalIndex) ? left.track.meta.originalIndex : left.index
      const rightOriginalIndex = Number.isFinite(right.track?.meta?.originalIndex) ? right.track.meta.originalIndex : right.index

      if (leftOrder == null && rightOrder == null) return leftOriginalIndex - rightOriginalIndex
      if (leftOrder == null) return 1
      if (rightOrder == null) return -1
      if (leftOrder !== rightOrder) return leftOrder - rightOrder
      return leftOriginalIndex - rightOriginalIndex
    })
    .map(item => item.track)
}

function mergePlaylistTracksWithArchivePool(playlistTracks = [], archiveTracks = [], audioMetaMaps) {
  const merged = []
  const seen = new Set()

  const findArchiveMatch = track => {
    const targetKeys = buildTrackIdentityKeys(track)
    return archiveTracks.find(archiveTrack => {
      const archiveKeys = buildTrackIdentityKeys(archiveTrack)
      return (
        (targetKeys.trackId && archiveKeys.trackId && targetKeys.trackId === archiveKeys.trackId) ||
        (targetKeys.audioKey && archiveKeys.audioKey && targetKeys.audioKey === archiveKeys.audioKey) ||
        (targetKeys.urlKey && archiveKeys.urlKey && targetKeys.urlKey === archiveKeys.urlKey)
      )
    })
  }

  const pushTrack = (track, source) => {
    if (!track) return

    const archiveMatch = source === 'playlist' ? findArchiveMatch(track) : null
    const normalized = source === 'archive-pool'
      ? applyAudioMetaToTrack(track, track, audioMetaMaps)
      : archiveMatch
        ? applyAudioMetaToTrack(track, archiveMatch, audioMetaMaps)
        : track
    const { trackId, audioKey, urlKey } = buildTrackIdentityKeys(normalized)
    const keys = [trackId && `track:${trackId}`, audioKey && `audio:${audioKey}`, urlKey && `url:${urlKey}`].filter(Boolean)

    if (keys.some(key => seen.has(key))) return

    keys.forEach(key => seen.add(key))
    merged.push(normalized)
  }

  playlistTracks.forEach(track => pushTrack(track, 'playlist'))
  archiveTracks.forEach(track => pushTrack(track, 'archive-pool'))

  return sortTracksByPlaylistOrder(merged)
}

async function fetchPlaylist(playlistId, startTime, { forceRefresh = false, attempt = 1 } = {}) {
  const playlistCacheKey = buildPlaylistCacheKey(playlistId)

  const getCachedPlaylistFallback = async fallbackReason => {
    const cachedPlaylist = await getCacheEntry(cache, playlistCacheKey, PLAYLIST_CACHE_TTL)
    if (!cachedPlaylist?.data) return null

    cacheStats.hits++
    return {
      ...cachedPlaylist.data,
      meta: {
        ...(cachedPlaylist.data.meta || {}),
        cacheSource: 'playlist-cache-fallback',
        fallbackReason
      }
    }
  }

  if (!forceRefresh) {
    const cachedPlaylist = await getCacheEntry(cache, playlistCacheKey, PLAYLIST_CACHE_TTL)
    if (cachedPlaylist?.data) {
      cacheStats.hits++
      return {
        ...cachedPlaylist.data,
        meta: {
          ...(cachedPlaylist.data.meta || {}),
          cacheSource: 'playlist-cache'
        }
      }
    }
  }

  const upstreamLimit = await checkUpstreamRateLimitLocal();
  if (!upstreamLimit.allowed) {
    logRateLimit('上游API限制中', {
      reason: '达到上游请求限制',
      retryAfter: upstreamLimit.retryAfter,
      playlistId,
      attempt
    });
    await new Promise(resolve => setTimeout(resolve, upstreamLimit.retryAfter));
    return fetchPlaylist(playlistId, startTime, { forceRefresh, attempt });
  }

  const upstream = new URL('https://metings.qjqq.cn/Playlist');
  upstream.searchParams.set('id', String(playlistId));

  const controller = new AbortController();
  const timeout = Math.min(10000, 2000 * attempt);
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(upstream.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    if (!response.ok) {
      if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(null, response.status)) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
        logRetry(`歌单 HTTP ${response.status}: ${playlistId}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchPlaylist(playlistId, startTime, { forceRefresh, attempt: attempt + 1 });
      }

      logError('歌单接口请求失败', {
        details: `Playlist: ${playlistId} | 状态码: ${response.status} | 耗时: ${duration}ms | 尝试: ${attempt}`
      });
      return getCachedPlaylistFallback(`status-${response.status}`);
    }

    const payload = await response.json().catch(() => null);
    const playlist = payload?.data?.playlist || payload?.result?.playlist || payload?.playlist || null;
    const tracks = Array.isArray(playlist?.tracks)
      ? playlist.tracks
      : Array.isArray(payload?.result?.songs)
        ? payload.result.songs
        : [];

    if (!playlist && tracks.length === 0) {
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateRetryDelay(attempt);
        cacheStats.retries++;
        logRetry(`歌单空响应: ${playlistId}`, {
          attempt,
          delay,
          nextAttempt: attempt + 1
        });
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchPlaylist(playlistId, startTime, { forceRefresh, attempt: attempt + 1 });
      }

      logError('歌单接口返回空数据', {
        details: `Playlist: ${playlistId} | 耗时: ${duration}ms | 尝试: ${attempt}`
      });
      return getCachedPlaylistFallback('empty-playlist');
    }

    if (attempt > 1) {
      logRetry(`歌单重试成功: ${playlistId}`, {
        attempt: attempt - 1,
        totalAttempts: attempt
      });
    }

    const playlistData = {
      playlist: {
        id: String(playlist?.id || playlistId),
        name: playlist?.name || '',
        cover: playlist?.coverImgUrl || '',
        creator: playlist?.creator || '',
        trackCount: Number(playlist?.trackCount || tracks.length || 0)
      },
      tracks,
      meta: {
        cacheSource: 'upstream',
        attemptCount: attempt
      }
    };

    await setCacheEntry(cache, playlistCacheKey, playlistData, {
      cachedAt: new Date().toISOString(),
      source: 'playlist-upstream',
      ttl: PLAYLIST_CACHE_TTL
    })

    return playlistData;
  } catch (error) {
    clearTimeout(timeoutId);

    if (attempt < RETRY_CONFIG.maxRetries && isRetryableError(error)) {
      const delay = calculateRetryDelay(attempt);
      cacheStats.retries++;
      logRetry(`歌单网络错误: ${playlistId}`, {
        attempt,
        delay,
        nextAttempt: attempt + 1,
        error: error.message
      });
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchPlaylist(playlistId, startTime, { forceRefresh, attempt: attempt + 1 });
    }

    const cachedPlaylist = await getCachedPlaylistFallback(error?.message || 'playlist-fetch-error')
    if (cachedPlaylist) {
      return cachedPlaylist
    }

    throw error
  }
}

async function cleanupExpiredIpLimitsLocal() {
  await cleanupExpiredIpLimits(rateLimits.ipLimits)
}

export default async function handler(req, res) {
  const requestId = createRequestId(6);
  const requestStart = Date.now();
  const { url, playlistId, level = 'standard', type = 'json', forceRefresh = '0', includeArchivePool = '1' } = req.query;
  const userAgent = req.headers['user-agent'] || '未知';
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   '未知';
  let requestCacheHits = 0;
  let requestRetries = 0;

  logProviderDiagnostics(requestId);
  setProviderDebugHeaders(res, requestId);
  await cleanupExpiredIpLimitsLocal();

  // 检查IP速率限制
  const ipLimit = await checkIPRateLimit(clientIP);
  if (!ipLimit.allowed) {
    logRateLimit('请求被拒绝', {
      ip: clientIP,
      limit: RATE_LIMIT_CONFIG.ip.maxRequests,
      window: RATE_LIMIT_CONFIG.ip.windowMs / 1000,
      reason: ipLimit.reason
    });
    
    setRateLimitHeaders(res, {
      retryAfter: Math.ceil(ipLimit.resetIn)
    });
    return sendApiError(res, 429, { 
      error: '请求过于频繁，请稍后重试',
      code: 'RATE_LIMITED',
      requestId,
      retryAfter: ipLimit.resetIn
    });
  }

  const normalizedPlaylistId = String(playlistId || '').trim();
  const isPlaylistMode = Boolean(normalizedPlaylistId);
  const forceRefreshEnabled = ['1', 'true', 'yes', 'on'].includes(String(forceRefresh || '').trim().toLowerCase());
  const includeArchivePoolEnabled = ['1', 'true', 'yes', 'on'].includes(String(includeArchivePool || '').trim().toLowerCase());
  
  if (!isPlaylistMode && !url) {
    logError('缺少必要参数', { 
      details: 'url / playlistId 参数为空',
      clientIP
    });
    return sendApiError(res, 400, {
      error: 'Missing required query param: url or playlistId',
      code: 'MISSING_URL',
      requestId
    });
  }

  let candidates = [];
  let playlistMeta = null;

  if (isPlaylistMode) {
    const playlistData = await fetchPlaylist(normalizedPlaylistId, requestStart, { forceRefresh: forceRefreshEnabled });
    if (!playlistData) {
      return sendApiError(res, 502, {
        error: '歌单数据获取失败',
        code: 'PLAYLIST_FETCH_FAILED',
        requestId
      });
    }

    playlistMeta = playlistData.playlist;
    requestRetries += Math.max(0, (playlistData?.meta?.attemptCount || 1) - 1);
    candidates = playlistData.tracks
      .map((item, index) => createPlaylistTrackFallback(item, index))
      .filter(item => item.id)
      .slice(0, PLAYLIST_MAX_TRACKS);


  } else {
    candidates = String(url)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .sort()
      .map(id => ({ id }));

    // 检查请求数量限制
    if (candidates.length > 20) {
      logWarning('请求歌曲数量超出限制', {
        clientIP,
        requested: candidates.length,
        maxAllowed: 20
      });
      candidates.length = 20;
    }
  }
  
  // 记录请求开始
  logRequest(`ID:${requestId} 歌曲:${candidates.length}首`, { 
    userAgent,
    clientIP,
    remaining: ipLimit.remaining
  });
  
  // 设置响应头
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200, stale-if-error=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  setRateLimitHeaders(res, {
    limit: RATE_LIMIT_CONFIG.ip.maxRequests,
    remaining: ipLimit.remaining,
    reset: Math.ceil(ipLimit.resetIn)
  });

  try {
    const audioMetaMaps = hasAudioMetaSourceConfigured()
      ? await getAudioMetaMaps({ strict: false })
      : null
    const archivePlaylistCandidates = isPlaylistMode && includeArchivePoolEnabled
      ? (audioMetaMaps?.archivePlaylist || [])
      : []

    if (isPlaylistMode && candidates.length === 0 && archivePlaylistCandidates.length === 0) {
      return sendApiError(res, 404, {
        error: '歌单中没有可用歌曲',
        code: 'EMPTY_PLAYLIST',
        requestId
      })
    }

    const results = await Promise.all(
      candidates.map(async candidate => {
        const id = candidate.id;
        const cacheKey = buildMetingCacheKey({ id, level, type });

        if (forceRefreshEnabled && typeof cache.delete === 'function') {
          await cache.delete(cacheKey);
        }

        const cachedData = forceRefreshEnabled ? null : await getCacheEntry(cache, cacheKey, CACHE_TTL);
        if (cachedData) {
          requestCacheHits++;
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logCacheHit(`${cachedData.data.name || id}`, { 
            hitRate,
            clientIP 
          });
          return applyAudioMetaToTrack(cachedData.data, candidate, audioMetaMaps);
        }
        
        if (pendingRequests.has(cacheKey)) {
          requestCacheHits++;
          cacheStats.hits++;
          const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
          logCacheHit(`${id} (并发合并)`, { 
            hitRate,
            clientIP
          });
          const pendingTrack = await pendingRequests.get(cacheKey);
          return pendingTrack ? applyAudioMetaToTrack(pendingTrack, candidate, audioMetaMaps) : null;
        }
        
        cacheStats.misses++;
        const fetchPromise = fetchTrack(id, level, type, requestStart);
        pendingRequests.set(cacheKey, fetchPromise);
        
        try {
          const track = await fetchPromise;
          if (track) {
            requestRetries += Math.max(0, (track?.meta?.attemptCount || 1) - 1);
            await setCacheEntry(cache, cacheKey, track, {
              cachedAt: new Date().toISOString(),
              source: 'upstream',
              clientIP,
              ttl: CACHE_TTL
            });
            return applyAudioMetaToTrack(track, candidate, audioMetaMaps);
          }
          return isPlaylistMode ? applyAudioMetaToTrack(null, candidate, audioMetaMaps) : null;
        } finally {
          pendingRequests.delete(cacheKey);
        }
      })
    );
    
    const playlistTracks = results.filter(track => track?.url || isPlaylistMode);
    const tracks = isPlaylistMode
      ? mergePlaylistTracksWithArchivePool(playlistTracks, archivePlaylistCandidates, audioMetaMaps)
      : playlistTracks;
    const totalDuration = Date.now() - requestStart;
    
    if (tracks.length === 0) {
      logError('所有请求均失败', { 
        details: `ID:${requestId} | 耗时: ${totalDuration}ms | 歌曲: ${candidates.length}首 | 客户端: ${clientIP}`,
        retries: requestRetries
      });
      return sendApiError(res, 502, { 
        error: '上游数据获取失败',
        code: 'UPSTREAM_FETCH_FAILED',
        requestId
      });
    }
    
    if (!isPlaylistMode) {
      tracks.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    logResponse(`ID:${requestId}`, {
      duration: totalDuration,
      trackCount: tracks.length,
      clientIP
    });
    
    const responseData = {
      tracks,
      meta: {
        requestId,
        duration: totalDuration,
        total: tracks.length,
        cacheHits: requestCacheHits,
        retries: requestRetries,
        forceRefresh: forceRefreshEnabled,
        audioArchiveEnabled: Boolean(audioMetaMaps),
        audioArchiveMatched: tracks.filter(track => track?.meta?.audioArchive?.matched).length,
        archivePoolEnabled: Boolean(isPlaylistMode && includeArchivePoolEnabled && archivePlaylistCandidates.length),
        archivePoolMerged: Math.max(0, tracks.length - playlistTracks.length),
        ...(playlistMeta ? { playlist: playlistMeta } : {})
      }
    };
    
    return sendApiSuccess(res, 200, responseData);
  } catch (error) {
    const errorDuration = Date.now() - requestStart;
    logError('处理异常', { 
      details: `ID:${requestId} | 耗时: ${errorDuration}ms | 错误: ${error.message} | 客户端: ${clientIP}`,
      stack: error.stack
    });
    logger.error('Unhandled meting handler error', {
      requestId,
      error: error?.message,
      duration: errorDuration,
      clientIP
    });
    return sendApiError(res, 500, { 
      error: '内部服务器错误',
      code: 'INTERNAL_SERVER_ERROR',
      requestId
    });
  }
}

