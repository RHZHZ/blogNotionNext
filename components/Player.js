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
  const audioFallback = siteConfig('MUSIC_PLAYER_AUDIO_LIST')

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

    if (metingEnable) {
      const apiUrl = String(metingApi).replace(':id', encodeURIComponent(String(metingId)))
      try {
        const res = await fetch(apiUrl)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            audio = data
          }
        }
      } catch (e) {
        console.error('音乐列表获取失败，将回退到本地列表', e)
      }
    }

    if (!ref.current) return

    const ap = new window.APlayer({
      container: ref.current,
      fixed: false,
      mini: false,
      autoplay: autoPlay,
      order: order,
      lrcType: lrcType,
      audio: audio
    })

    // 暴露实例给自定义 UI 使用
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
      {/* APlayer 引擎容器：UI 已在 globals.css 中被隐藏 */}
      <div ref={ref} data-player={player} />
    </div>
  )
}

export default Player
