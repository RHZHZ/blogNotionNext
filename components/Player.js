import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

/**
 * 音乐播放器（音频引擎）
 * - 不再使用 <meting-js>
 * - 通过 /api/meting 获取 APlayer audio 列表
 * - 初始化 APlayer 实例并暴露到 window.__APPLAYER__
 */
const Player = () => {
  const [player, setPlayer] = useState()
  const ref = useRef(null)
  const refreshInFlightRef = useRef(false)
  const scheduledArchiveKeysRef = useRef(new Set())

  const playerVisible = JSON.parse(siteConfig('MUSIC_PLAYER_VISIBLE'))
  const autoPlay = JSON.parse(siteConfig('MUSIC_PLAYER_AUTO_PLAY'))
  const order = siteConfig('MUSIC_PLAYER_ORDER')
  const lrcType = JSON.parse(siteConfig('MUSIC_PLAYER_LRC_TYPE'))

  const musicPlayerEnable = siteConfig('MUSIC_PLAYER')
  const musicPlayerCDN = siteConfig('MUSIC_PLAYER_CDN_URL', 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js')
  const musicPlayerStyleCDN = siteConfig('MUSIC_PLAYER_STYLE_CDN_URL', 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css')
  const metingEnable = JSON.parse(siteConfig('MUSIC_PLAYER_METING'))
  const metingApi = siteConfig('MUSIC_PLAYER_METING_API', '/api/meting?url=:id')
  const metingId = siteConfig('MUSIC_PLAYER_METING_ID')
  const metingPlaylistId = siteConfig('MUSIC_PLAYER_METING_PLAYLIST_ID', '')
  const audioFallback = siteConfig('MUSIC_PLAYER_AUDIO_LIST')

  const setPlayerMeta = (meta) => {
    window.__APPLAYER_META__ = {
      source: meta?.source || 'unknown',
      requestId: meta?.requestId || null,
      duration: meta?.duration || null,
      total: meta?.total || null,
      code: meta?.code || null,
      cacheProviderConfigured: meta?.cacheProviderConfigured || null,
      cacheProviderActive: meta?.cacheProviderActive || null,
      cacheProviderFallback: meta?.cacheProviderFallback ?? null,
      cacheProviderReason: meta?.cacheProviderReason || null,
      rateLimitProviderConfigured: meta?.rateLimitProviderConfigured || null,
      ipRateLimitProviderActive: meta?.ipRateLimitProviderActive || null,
      upstreamRateLimitProviderActive: meta?.upstreamRateLimitProviderActive || null,
      rateLimitProviderFallback: meta?.rateLimitProviderFallback ?? null,
      rateLimitProviderReason: meta?.rateLimitProviderReason || null,
      forceRefresh: meta?.forceRefresh ?? null,
      updatedAt: new Date().toISOString()
    }
  }

  const readProviderMetaFromHeaders = (headers) => {
    if (!headers?.get) return {}

    const read = key => headers.get(key)
    const readBoolean = key => {
      const value = read(key)
      return value == null ? null : value === 'true'
    }

    return {
      requestId: read('X-Request-Id'),
      cacheProviderConfigured: read('X-Cache-Provider-Configured'),
      cacheProviderActive: read('X-Cache-Provider-Active'),
      cacheProviderFallback: readBoolean('X-Cache-Provider-Fallback'),
      cacheProviderReason: read('X-Cache-Provider-Reason'),
      rateLimitProviderConfigured: read('X-RateLimit-Provider-Configured') || read('X-Ratelimit-Provider-Configured'),
      ipRateLimitProviderActive: read('X-Ip-RateLimit-Provider-Active') || read('X-Ip-Ratelimit-Provider-Active'),
      upstreamRateLimitProviderActive:
        read('X-Upstream-RateLimit-Provider-Active') || read('X-Upstream-Ratelimit-Provider-Active'),
      rateLimitProviderFallback:
        readBoolean('X-RateLimit-Provider-Fallback') ?? readBoolean('X-Ratelimit-Provider-Fallback'),
      rateLimitProviderReason: read('X-RateLimit-Provider-Reason') || read('X-Ratelimit-Provider-Reason')
    }
  }

  const resolveMetingApiUrl = (options = {}) => {
    const apiTemplate = String(metingApi || '').trim()
    const playlistId = String(metingPlaylistId || '').trim()
    const songIds = String(metingId || '').trim()
    const querySuffix = options.forceRefresh
      ? `${apiTemplate.includes('?') || playlistId ? '&' : '?'}forceRefresh=1`
      : ''

    if (playlistId) {
      if (apiTemplate.includes(':playlistId')) {
        return `${apiTemplate.replace(':playlistId', encodeURIComponent(playlistId))}${options.forceRefresh ? '&forceRefresh=1' : ''}`
      }
      return `/api/meting?playlistId=${encodeURIComponent(playlistId)}${options.forceRefresh ? '&forceRefresh=1' : ''}`
    }

    if (!songIds) return null

    if (apiTemplate.includes(':id')) {
      return `${apiTemplate.replace(':id', encodeURIComponent(songIds))}${querySuffix}`
    }

    return `${apiTemplate || `/api/meting?url=${encodeURIComponent(songIds)}`}${querySuffix}`
  }

  const attachAudioErrorListener = (apInstance, handler) => {
    apInstance.audio?.addEventListener?.('error', handler)
    apInstance.__handleAudioError__ = handler
  }

  const detachAudioErrorListener = (apInstance) => {
    if (apInstance?.audio && apInstance?.__handleAudioError__) {
      apInstance.audio.removeEventListener('error', apInstance.__handleAudioError__)
    }
  }

  const createPlayerInstance = (audio, handleAudioError) => {
    const ap = new window.APlayer({
      container: ref.current,
      fixed: false,
      mini: false,
      autoplay: autoPlay,
      order: order,
      lrcType: lrcType,
      audio
    })

    attachAudioErrorListener(ap, handleAudioError)
    window.__APPLAYER__ = ap
    setPlayer(ap)
    return ap
  }

  const fetchRemoteAudio = async (options = {}) => {
    const apiUrl = resolveMetingApiUrl(options)
    if (!apiUrl) return null

    const res = await fetch(apiUrl, { cache: 'no-store' })
    const providerMeta = readProviderMetaFromHeaders(res.headers)
    const result = await res.json().catch(() => null)

    if (res.ok && result?.tracks && Array.isArray(result.tracks) && result.tracks.length > 0) {
      return {
        audio: result.tracks,
        source: 'remote',
        remoteMeta: {
          ...(result.meta || null),
          ...providerMeta
        }
      }
    }

    console.warn('远程歌单不可用，回退到本地列表', {
      status: res.status,
      code: result?.code,
      error: result?.error,
      forceRefresh: options.forceRefresh || false
    })

    return null
  }

  const scheduleArchive = async ({ reason, trackId = '', songUrl = '', playlistId = '' }) => {
    const normalizedReason = String(reason || 'manual').trim() || 'manual'
    const normalizedPlaylistId = String(playlistId || '').trim()
    const normalizedTrackId = String(trackId || '').trim()
    const normalizedSongUrl = String(songUrl || '').trim()

    if (!normalizedPlaylistId && !normalizedTrackId && !normalizedSongUrl) return

    const key = [normalizedReason, normalizedPlaylistId, normalizedTrackId, normalizedSongUrl].join('::')
    if (scheduledArchiveKeysRef.current.has(key)) return

    scheduledArchiveKeysRef.current.add(key)

    try {
      await fetch('/api/archive/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: normalizedReason,
          playlistId: normalizedPlaylistId,
          trackId: normalizedTrackId,
          songUrl: normalizedSongUrl
        })
      })
    } catch (error) {
      console.warn('归档调度上报失败', {
        reason: normalizedReason,
        playlistId: normalizedPlaylistId || null,
        trackId: normalizedTrackId || null,
        songUrl: normalizedSongUrl || null,
        error
      })
    }
  }

  const maybeSchedulePlaylistArchive = async (remoteMeta) => {
    const playlistId = String(remoteMeta?.playlist?.id || metingPlaylistId || '').trim()
    if (!playlistId) return

    const matched = Number(remoteMeta?.audioArchiveMatched || 0)
    const total = Number(remoteMeta?.total || 0)
    if (!total || matched >= total) return

    await scheduleArchive({
      reason: 'playlist-low-coverage',
      playlistId
    })
  }

  const applyPlayerMeta = (source, remoteMeta) => {
    setPlayerMeta({
      source,
      requestId: remoteMeta?.requestId,
      duration: remoteMeta?.duration,
      total: remoteMeta?.total,
      code: remoteMeta?.code || null,
      cacheProviderConfigured: remoteMeta?.cacheProviderConfigured,
      cacheProviderActive: remoteMeta?.cacheProviderActive,
      cacheProviderFallback: remoteMeta?.cacheProviderFallback,
      cacheProviderReason: remoteMeta?.cacheProviderReason,
      rateLimitProviderConfigured: remoteMeta?.rateLimitProviderConfigured,
      ipRateLimitProviderActive: remoteMeta?.ipRateLimitProviderActive,
      upstreamRateLimitProviderActive: remoteMeta?.upstreamRateLimitProviderActive,
      rateLimitProviderFallback: remoteMeta?.rateLimitProviderFallback,
      rateLimitProviderReason: remoteMeta?.rateLimitProviderReason,
      forceRefresh: remoteMeta?.forceRefresh
    })
  }

  const resolveCurrentTrackPayload = (currentPlayer = window.__APPLAYER__) => {
    const index = currentPlayer?.list?.index || 0
    const currentAudio = currentPlayer?.list?.audios?.[index] || currentPlayer?.list?.audio?.[index] || null

    return {
      currentAudio,
      trackId: String(currentAudio?.meta?.trackId || '').trim(),
      songUrl: String(currentAudio?.meta?.sourceUrl || currentAudio?.url || '').trim()
    }
  }

  const shouldSkipAudioErrorRefresh = currentAudio => {
    const source = String(currentAudio?.meta?.source || '').trim()
    const archived = Boolean(currentAudio?.meta?.audioArchive?.archived)
    return source === 'archive-playlist' || archived
  }

  const shouldThrottleAudioErrorRefresh = refreshTarget => {
    const cooldownMs = 30 * 1000
    const key = [refreshTarget.trackId, refreshTarget.songUrl].filter(Boolean).join('::')
    if (!key) return false

    const now = Date.now()
    const lastTriggeredAt = Number(audioRefreshCooldownRef.current.get(key) || 0)
    if (lastTriggeredAt && now - lastTriggeredAt < cooldownMs) {
      return true
    }

    audioRefreshCooldownRef.current.set(key, now)
    return false
  }

  const refreshRemoteAudioOn403 = async () => {
    if (refreshInFlightRef.current || !metingEnable || !ref.current || !window.APlayer) return
    refreshInFlightRef.current = true

    try {
      const currentPlayer = window.__APPLAYER__
      const currentIndex = currentPlayer?.list?.index || 0
      const shouldResume = !(currentPlayer?.audio?.paused ?? true)

      const refreshTarget = resolveCurrentTrackPayload(currentPlayer)
      if (shouldSkipAudioErrorRefresh(refreshTarget.currentAudio)) {
        return
      }
      if (shouldThrottleAudioErrorRefresh(refreshTarget)) {
        return
      }
      if (refreshTarget.trackId || refreshTarget.songUrl) {
        await scheduleArchive({
          reason: 'audio-error-refresh',
          trackId: refreshTarget.trackId,
          songUrl: refreshTarget.songUrl
        })
      }

      const refreshed = await fetchRemoteAudio({ forceRefresh: true })
      if (!refreshed?.audio?.length) return

      detachAudioErrorListener(currentPlayer)
      currentPlayer?.destroy?.()
      if (window.__APPLAYER__ === currentPlayer) {
        window.__APPLAYER__ = undefined
      }

      applyPlayerMeta('remote', refreshed.remoteMeta)

      const handleAudioError = async () => {
        const mediaError = window.__APPLAYER__?.audio?.error
        if (mediaError?.code === 4 || mediaError?.code === 2 || mediaError) {
          await refreshRemoteAudioOn403()
        }
      }

      const nextPlayer = createPlayerInstance(refreshed.audio, handleAudioError)
      if (currentIndex > 0 && currentIndex < refreshed.audio.length) {
        nextPlayer.list?.switch?.(currentIndex)
      }
      if (shouldResume) {
        nextPlayer.play()
      }

      if (process.env.NODE_ENV !== 'production') {
        console.info('[Player] refreshed remote audio after 403', refreshed.remoteMeta)
      }
    } catch (error) {
      console.error('403 后刷新远程音频失败', error)
    } finally {
      refreshInFlightRef.current = false
    }
  }

  const initMusicPlayer = async () => {
    if (!musicPlayerEnable) return

    try {
      await loadExternalResource(musicPlayerCDN, 'js')
    } catch (error) {
      console.error('音乐组件异常', error)
      return
    }

    if (!window.APlayer) return

    let audio = audioFallback
    let source = 'fallback'
    let remoteMeta = null

    if (metingEnable) {
      const remoteResult = await fetchRemoteAudio()
      if (remoteResult) {
        audio = remoteResult.audio
        source = remoteResult.source
        remoteMeta = remoteResult.remoteMeta
        await maybeSchedulePlaylistArchive(remoteMeta)
      } else if (!resolveMetingApiUrl()) {
        console.warn('远程歌单未配置有效的歌曲池或歌单 ID，回退到本地列表')
      }
    }

    if (!ref.current) return

    applyPlayerMeta(source, remoteMeta)

    if (process.env.NODE_ENV !== 'production') {
      console.info('[Player] playlist source:', source, window.__APPLAYER_META__)
    }

    const handleAudioError = async () => {
      const mediaError = window.__APPLAYER__?.audio?.error
      if (mediaError?.code === 4 || mediaError?.code === 2 || mediaError) {
        await refreshRemoteAudioOn403()
      }
    }

    createPlayerInstance(audio, handleAudioError)
  }

  useEffect(() => {
    initMusicPlayer()

    return () => {
      try {
        detachAudioErrorListener(window.__APPLAYER__)
        if (window.__APPLAYER__ && window.__APPLAYER__ === player) {
          window.__APPLAYER__ = undefined
        }
        if (window.__APPLAYER_META__) {
          window.__APPLAYER_META__ = undefined
        }
        player?.destroy?.()
      } catch (e) {
        // ignore
      }
      setPlayer(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={playerVisible ? 'visible' : 'invisible'}>
      <link
        rel='stylesheet'
        type='text/css'
        href={musicPlayerStyleCDN}
      />
      <style jsx global>{`
        /* 彻底禁闭 APlayer 原生 UI，确保只有自定义的灵动岛可见 */
        .aplayer, 
        .aplayer-fixed, 
        .aplayer-body, 
        .aplayer-pic, 
        .aplayer-info, 
        .aplayer-lrc, 
        .aplayer-controller,
        .aplayer-miniswitcher {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          position: fixed !important;
          top: -9999px !important;
          left: -9999px !important;
          width: 0 !important;
          height: 0 !important;
          z-index: -999 !important;
        }
      `}</style>
      <div ref={ref} data-player={player} />
    </div>
  )
}

export default Player
