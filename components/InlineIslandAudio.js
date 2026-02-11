import { useState, useEffect } from 'react'

/**
 * 文章内嵌的灵动岛音频卡片
 */
const InlineIslandAudio = (props) => {
  const { block, url: propsUrl, title: propsTitle, artist: propsArtist, cover: propsCover, lrc: propsLrc } = props
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // 兼容两种模式：1. Notion渲染器传入的 block；2. DOM扫描传入的 url/title/meta
  const source = propsUrl || block?.properties?.source?.[0]?.[0]
  const title = propsTitle || block?.properties?.title?.[0]?.[0] || '文章音频'
  const artist = propsArtist || '文章音频'
  const cover = propsCover || '/avatar.png'
  const lrc = propsLrc || ''

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'))
    checkDark()
    const obs = new MutationObserver(checkDark)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // 监听全局播放器状态
    const syncStatus = () => {
      const ap = window.__APPLAYER__
      if (ap && ap.audio) {
        setIsPlaying(!ap.audio.paused && ap.list.audios[ap.list.index]?.url === source)
      }
    }

    const apTimer = setInterval(() => {
      if (window.__APPLAYER__) {
        window.__APPLAYER__.on('play', syncStatus)
        window.__APPLAYER__.on('pause', syncStatus)
        window.__APPLAYER__.on('listswitch', syncStatus)
        clearInterval(apTimer)
      }
    }, 500)

    return () => {
      obs.disconnect()
      clearInterval(apTimer)
      if (window.__APPLAYER__) {
        window.__APPLAYER__.off('play', syncStatus)
        window.__APPLAYER__.off('pause', syncStatus)
        window.__APPLAYER__.off('listswitch', syncStatus)
      }
    }
  }, [source])

  const handlePlay = (e) => {
    e.preventDefault()
    const ap = window.__APPLAYER__
    if (!ap || !source) return

    const currentIndex = ap.list.index
    const isCurrent = ap.list.audios[currentIndex]?.url === source

    if (isCurrent) {
      if (ap.audio.paused) ap.play()
      else ap.pause()
    } else {
      // 检查是否在列表中
      const existIndex = ap.list.audios.findIndex(a => a.url === source)
      if (existIndex > -1) {
        ap.list.switch(existIndex)
      } else {
        ap.list.add([{
          name: title,
          artist: artist,
          url: source,
          cover: cover,
          lrc: lrc
        }])
        ap.list.switch(ap.list.audios.length - 1)
      }
      ap.play()
    }
  }

  return (
    <div className='my-4 flex justify-center'>
      <div
        onClick={handlePlay}
        className={`group relative flex items-center gap-4 p-3 rounded-full cursor-pointer transition-all duration-500
          ${isDark
            ? 'bg-white/10 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-white/70 border-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]'}
          border backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98] w-full max-w-[400px]`}
      >
        {/* 封面/唱片 - 修正旋转逻辑：仅背景旋转 */}
        <div className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0
          ${isDark ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_0_2px_rgba(255,255,255,0.8)]'}`}>
          <div
            className={`absolute inset-0 bg-cover bg-center ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ backgroundImage: `url(${cover})` }}
          />
          {/* 中间播放按钮 - 不随封面旋转 */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
             <div className="text-white opacity-90">
               {isPlaying ? (
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M7 5H10V19H7V5Z" /><path d="M14 5H17V19H14V5Z" />
                 </svg>
               ) : (
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
                   <path d="M8 5V19L19 12L8 5Z" />
                 </svg>
               )}
             </div>
          </div>
        </div>

        {/* 文字信息 */}
        <div className="flex-1 min-width-0 overflow-hidden">
          <div className={`text-sm font-bold truncate ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
            {title}
          </div>
          <div className={`text-[10px] font-medium opacity-50 ${isDark ? 'text-white' : 'text-slate-600'}`}>
            {isPlaying ? '正在同步播放...' : artist || '文章音频'}
          </div>
        </div>

        {/* 装饰波形 (仅播放时) */}
        {isPlaying && (
          <div className="flex gap-0.5 items-center pr-4 h-4 overflow-hidden self-center">
            {[1, 2, 3, 2, 1].map((h, i) => (
              <div
                key={i}
                className="w-0.5 bg-blue-400"
                style={{
                  height: '100%',
                  animation: `islandWaveform 0.6s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                  transformOrigin: 'bottom'
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes islandWaveform {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default InlineIslandAudio
