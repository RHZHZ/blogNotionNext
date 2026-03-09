import BLOG from '@/blog.config'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_CONFIG = {
  MUSIC_PLAYER: true,
  MUSIC_PLAYER_VISIBLE: true,
  MUSIC_PLAYER_AUTO_PLAY: false,
  MUSIC_PLAYER_ORDER: 'list',
  MUSIC_PLAYER_LRC_TYPE: 0,
  MUSIC_PLAYER_CDN_URL: 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js',
  MUSIC_PLAYER_STYLE_CDN_URL: 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css',
  MUSIC_PLAYER_METING: true,
  MUSIC_PLAYER_METING_API: '/api/meting?url=:id',
  MUSIC_PLAYER_METING_ID: '',
  MUSIC_PLAYER_AUDIO_LIST: []
}

const readConfig = (key, fallback) => {
  const value = BLOG?.[key]
  return value === undefined || value === null || value === '' ? fallback : value
}

const parseBoolean = value => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true
    if (['false', '0', 'no', 'off'].includes(normalized)) return false
  }
  return Boolean(value)
}

const parseNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

const ensureArray = value => {
  if (Array.isArray(value)) return value
  return []
}

const loadExternalResource = (url, type) => {
  if (typeof document === 'undefined' || !url) return Promise.resolve()

  const attr = type === 'css' ? 'href' : 'src'
  const tagName = type === 'css' ? 'link' : 'script'
  const existing = document.querySelector(`${tagName}[${attr}="${url}"]`)
  if (existing) {
    if (existing.dataset.loaded === 'true') return Promise.resolve(existing)
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(existing), { once: true })
      existing.addEventListener('error', reject, { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const el = document.createElement(tagName)
    if (type === 'css') {
      el.rel = 'stylesheet'
      el.href = url
    } else {
      el.src = url
      el.async = true
    }

    el.addEventListener('load', () => {
      el.dataset.loaded = 'true'
      resolve(el)
    }, { once: true })
    el.addEventListener('error', reject, { once: true })
    document.head.appendChild(el)
  })
}

const resolveAudioList = async ({ metingEnable, metingApi, metingId, audioFallback }) => {
  let audio = ensureArray(audioFallback)

  if (!metingEnable) return audio
  if (!String(metingId || '').trim()) return audio

  const apiUrl = String(metingApi || DEFAULT_CONFIG.MUSIC_PLAYER_METING_API)
    .replace(':id', encodeURIComponent(String(metingId).trim()))

  try {
    const res = await fetch(apiUrl, { cache: 'no-store' })
    const data = await res.json().catch(() => null)

    if (Array.isArray(data) && data.length > 0) {
      return data
    }

    if (Array.isArray(data?.tracks) && data.tracks.length > 0) {
      return data.tracks
    }
  } catch (error) {
    console.error('音乐列表获取失败，将回退到本地列表', error)
  }

  return audio
}

const Player = () => {
  const [player, setPlayer] = useState(null)
  const ref = useRef(null)

  const playerVisible = parseBoolean(readConfig('MUSIC_PLAYER_VISIBLE', DEFAULT_CONFIG.MUSIC_PLAYER_VISIBLE))
  const autoPlay = parseBoolean(readConfig('MUSIC_PLAYER_AUTO_PLAY', DEFAULT_CONFIG.MUSIC_PLAYER_AUTO_PLAY))
  const order = readConfig('MUSIC_PLAYER_ORDER', DEFAULT_CONFIG.MUSIC_PLAYER_ORDER)
  const lrcType = parseNumber(readConfig('MUSIC_PLAYER_LRC_TYPE', DEFAULT_CONFIG.MUSIC_PLAYER_LRC_TYPE), 0)
  const musicPlayerEnable = parseBoolean(readConfig('MUSIC_PLAYER', DEFAULT_CONFIG.MUSIC_PLAYER))
  const musicPlayerCDN = readConfig('MUSIC_PLAYER_CDN_URL', DEFAULT_CONFIG.MUSIC_PLAYER_CDN_URL)
  const musicPlayerStyleCDN = readConfig('MUSIC_PLAYER_STYLE_CDN_URL', DEFAULT_CONFIG.MUSIC_PLAYER_STYLE_CDN_URL)
  const metingEnable = parseBoolean(readConfig('MUSIC_PLAYER_METING', DEFAULT_CONFIG.MUSIC_PLAYER_METING))
  const metingApi = readConfig('MUSIC_PLAYER_METING_API', DEFAULT_CONFIG.MUSIC_PLAYER_METING_API)
  const metingId = readConfig('MUSIC_PLAYER_METING_ID', DEFAULT_CONFIG.MUSIC_PLAYER_METING_ID)
  const audioFallback = readConfig('MUSIC_PLAYER_AUDIO_LIST', DEFAULT_CONFIG.MUSIC_PLAYER_AUDIO_LIST)

  useEffect(() => {
    let disposed = false
    let apInstance = null

    const initMusicPlayer = async () => {
      if (!musicPlayerEnable || !ref.current) return

      try {
        await loadExternalResource(musicPlayerStyleCDN, 'css')
        await loadExternalResource(musicPlayerCDN, 'js')
      } catch (error) {
        console.error('APlayer 资源加载失败', error)
        return
      }

      if (disposed || !window.APlayer || !ref.current) return

      const audio = await resolveAudioList({
        metingEnable,
        metingApi,
        metingId,
        audioFallback
      })

      if (disposed || !Array.isArray(audio) || audio.length === 0 || !ref.current) return

      apInstance = new window.APlayer({
        container: ref.current,
        fixed: false,
        mini: false,
        autoplay: autoPlay,
        order,
        lrcType,
        audio
      })

      window.__APPLAYER__ = apInstance
      setPlayer(apInstance)
    }

    initMusicPlayer()

    return () => {
      disposed = true
      try {
        if (window.__APPLAYER__ === apInstance) {
          window.__APPLAYER__ = undefined
        }
        apInstance?.destroy?.()
      } catch (error) {
        console.warn('销毁播放器实例失败', error)
      }
      setPlayer(null)
    }
  }, [audioFallback, autoPlay, lrcType, metingApi, metingEnable, metingId, musicPlayerCDN, musicPlayerEnable, musicPlayerStyleCDN, order])

  return (
    <div className={playerVisible ? 'visible' : 'invisible'}>
      <style jsx global>{`
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
      <div ref={ref} data-player-ready={Boolean(player)} />
    </div>
  )
}

export default Player
