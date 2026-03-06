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
      updatedAt: new Date().toISOString()
    }
  }

  const resolveMetingApiUrl = () => {
    const apiTemplate = String(metingApi || '').trim()
    const playlistId = String(metingPlaylistId || '').trim()
    const songIds = String(metingId || '').trim()

    if (playlistId) {
      if (apiTemplate.includes(':playlistId')) {
        return apiTemplate.replace(':playlistId', encodeURIComponent(playlistId))
      }
      return `/api/meting?playlistId=${encodeURIComponent(playlistId)}`
    }

    if (!songIds) return null

    if (apiTemplate.includes(':id')) {
      return apiTemplate.replace(':id', encodeURIComponent(songIds))
    }

    return apiTemplate || `/api/meting?url=${encodeURIComponent(songIds)}`
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
      const apiUrl = resolveMetingApiUrl()
      if (!apiUrl) {
        console.warn('远程歌单未配置有效的歌曲池或歌单 ID，回退到本地列表')
      } else {
        try {
          const res = await fetch(apiUrl)
          const result = await res.json().catch(() => null)

          if (res.ok && result?.tracks && Array.isArray(result.tracks) && result.tracks.length > 0) {
            audio = result.tracks
            source = 'remote'
            remoteMeta = result.meta || null
          } else {
            console.warn('远程歌单不可用，回退到本地列表', {
              status: res.status,
              code: result?.code,
              error: result?.error
            })
          }
        } catch (e) {
          console.error('音乐列表获取失败，将回退到本地列表', e)
        }
      }
    }

    if (!ref.current) return

    setPlayerMeta({
      source,
      requestId: remoteMeta?.requestId,
      duration: remoteMeta?.duration,
      total: remoteMeta?.total,
      code: remoteMeta?.code || null
    })

    if (process.env.NODE_ENV !== 'production') {
      console.info('[Player] playlist source:', source, window.__APPLAYER_META__)
    }

    const ap = new window.APlayer({
      container: ref.current,
      fixed: false,
      mini: false,
      autoplay: autoPlay,
      order: order,
      lrcType: lrcType,
      audio: audio
    })

    window.__APPLAYER__ = ap
    setPlayer(ap)
  }

  useEffect(() => {
    initMusicPlayer()

    return () => {
      try {
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
