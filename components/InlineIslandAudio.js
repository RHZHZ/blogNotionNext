import { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_TITLE = '文章音频'
const DEFAULT_ARTIST = 'RHZ'
const DEFAULT_COVER = '/avatar.png'
const DEFAULT_PODCAST_DESCRIPTION = '这篇文章提供了可直接收听的播客版本。'

const normalizeText = value => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const resolveBlockText = value => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value?.[0]
    if (Array.isArray(first)) {
      return normalizeText(first?.[0])
    }
  }
  return ''
}

const getPlayerCurrentUrl = ap => ap?.list?.audios?.[ap?.list?.index]?.url || ''

/**
 * 文章内嵌的灵动岛音频卡片
 */
const InlineIslandAudio = (props) => {
  const {
    block,
    url: propsUrl,
    title: propsTitle,
    artist: propsArtist,
    cover: propsCover,
    lrc: propsLrc,
    isPodcast = false,
    description: propsDescription = ''
  } = props

  const [isPlaying, setIsPlaying] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const boundPlayerRef = useRef(null)

  const source = useMemo(
    () => normalizeText(propsUrl || resolveBlockText(block?.properties?.source)),
    [block, propsUrl]
  )
  const title = useMemo(
    () => normalizeText(propsTitle || resolveBlockText(block?.properties?.title)) || DEFAULT_TITLE,
    [block, propsTitle]
  )
  const artist = useMemo(
    () => normalizeText(propsArtist) || DEFAULT_ARTIST,
    [propsArtist]
  )
  const cover = useMemo(
    () => normalizeText(propsCover) || DEFAULT_COVER,
    [propsCover]
  )
  const lrc = useMemo(() => normalizeText(propsLrc), [propsLrc])
  const description = useMemo(
    () => normalizeText(propsDescription) || DEFAULT_PODCAST_DESCRIPTION,
    [propsDescription]
  )
  const isAvailable = Boolean(source)

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    checkDark()
    const obs = new MutationObserver(checkDark)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => {
      obs.disconnect()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncStatus = () => {
      const ap = window.__APPLAYER__
      const currentUrl = getPlayerCurrentUrl(ap)
      setIsPlaying(Boolean(source) && !ap?.audio?.paused && currentUrl === source)
    }

    const bindPlayerEvents = ap => {
      if (!ap || boundPlayerRef.current === ap) {
        syncStatus()
        return
      }

      if (boundPlayerRef.current) {
        boundPlayerRef.current.off?.('play', syncStatus)
        boundPlayerRef.current.off?.('pause', syncStatus)
        boundPlayerRef.current.off?.('listswitch', syncStatus)
        boundPlayerRef.current.off?.('ended', syncStatus)
      }

      ap.on?.('play', syncStatus)
      ap.on?.('pause', syncStatus)
      ap.on?.('listswitch', syncStatus)
      ap.on?.('ended', syncStatus)
      boundPlayerRef.current = ap
      syncStatus()
    }

    syncStatus()
    bindPlayerEvents(window.__APPLAYER__)

    const apTimer = setInterval(() => {
      if (window.__APPLAYER__) {
        bindPlayerEvents(window.__APPLAYER__)
        clearInterval(apTimer)
      }
    }, 500)

    return () => {
      clearInterval(apTimer)
      if (boundPlayerRef.current) {
        boundPlayerRef.current.off?.('play', syncStatus)
        boundPlayerRef.current.off?.('pause', syncStatus)
        boundPlayerRef.current.off?.('listswitch', syncStatus)
        boundPlayerRef.current.off?.('ended', syncStatus)
        boundPlayerRef.current = null
      }
    }
  }, [source])

  const handlePlay = e => {
    e?.preventDefault?.()
    const ap = window.__APPLAYER__
    const audios = ap?.list?.audios || []

    if (!ap || !source) return

    const currentIndex = ap?.list?.index ?? -1
    const isCurrent = audios[currentIndex]?.url === source

    if (isCurrent) {
      if (ap.audio?.paused) ap.play()
      else ap.pause()
      return
    }

    const existIndex = audios.findIndex(audio => audio?.url === source)
    if (existIndex > -1) {
      ap.list.switch(existIndex)
    } else {
      ap.list.add([
        {
          name: title,
          artist,
          url: source,
          cover,
          lrc,
          meta: {
            isPodcast,
            pcDescription: description || '',
            sourceUrl: source
          }
        }
      ])
      ap.list.switch(audios.length)
    }

    ap.play()
  }

  if (isPodcast) {
    return (
      <section className='my-4 px-1 sm:px-0'>
        <div
          className={`group relative rounded-[1.35rem] border backdrop-blur-sm transition-all duration-300 ${
            isDark
              ? 'border-white/12 bg-[rgba(15,23,42,0.56)] shadow-[0_8px_22px_rgba(2,6,23,0.18)] ring-1 ring-inset ring-white/6'
              : 'border-slate-200/90 bg-[rgba(255,255,255,0.9)] shadow-[0_6px_18px_rgba(15,23,42,0.05)] ring-1 ring-inset ring-white/70'
          } ${isAvailable ? 'cursor-pointer hover:-translate-y-[1px]' : 'cursor-not-allowed opacity-70'}`}
          onClick={handlePlay}
          role='button'
          tabIndex={isAvailable ? 0 : -1}
          aria-disabled={!isAvailable}
          onKeyDown={e => {
            if (!isAvailable) return
            if (e.key === 'Enter' || e.key === ' ') {
              handlePlay(e)
            }
          }}
        >
          <div className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-70 ${isDark ? 'bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.08),transparent_42%)]' : 'bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.05),transparent_42%)]'}`} />

          <div className='relative flex items-center gap-3 px-3.5 py-3 sm:gap-4 sm:px-4'>
            <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 sm:h-16 sm:w-16'>
              <div
                className={`h-full w-full bg-cover bg-center transition duration-500 ${isPlaying ? 'scale-[1.04]' : 'scale-100'}`}
                style={{ backgroundImage: `url(${cover})` }}
              />
              <div className='absolute inset-0 bg-black/10' />
              {isPlaying ? (
                <div className='absolute inset-x-0 bottom-1.5 flex justify-center gap-0.5'>
                  {[1, 2, 3].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className='block w-0.5 rounded-full bg-white/90'
                      style={{
                        height: `${7 + item * 2}px`,
                        animation: 'podcastWave 0.72s ease-in-out infinite alternate',
                        animationDelay: `${index * 0.12}s`
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] ${isDark ? 'border-white/10 bg-white/6 text-white/72' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                  PODCAST
                </span>
                {isPlaying ? (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${isDark ? 'bg-emerald-400/10 text-emerald-200' : 'bg-emerald-50 text-emerald-700'}`}>
                    播放中
                  </span>
                ) : null}
              </div>

              <div className={`mt-1 truncate text-[1.05rem] font-semibold ${isDark ? 'text-white/92' : 'text-slate-800'}`}>
                {title}
              </div>
              <div className={`mt-0.5 truncate text-xs ${isDark ? 'text-white/48' : 'text-slate-500'}`}>
                {artist}
              </div>
              <p className={`mt-1 line-clamp-1 text-[13px] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {description}
              </p>
            </div>

            <button
              type='button'
              onClick={e => {
                e.stopPropagation()
                handlePlay(e)
              }}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition duration-200 sm:px-4 ${
                isDark
                  ? 'border-white/14 bg-white/7 text-white/88 hover:bg-white/12'
                  : 'border-slate-300 bg-white/92 text-slate-700 hover:bg-white'
              }`}
            >
              {isPlaying ? '暂停' : '收听'}
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes podcastWave {
            from { transform: scaleY(0.4); opacity: 0.72; }
            to { transform: scaleY(1); opacity: 1; }
          }
        `}</style>
      </section>
    )
  }

  return (
    <div className='my-4 flex justify-center'>
      <div
        onClick={handlePlay}
        className={`group relative flex w-auto min-w-[16rem] max-w-[22rem] items-center gap-3 rounded-full border px-4 py-3 transition-all duration-500
          ${isDark
            ? 'border-white/8 bg-[linear-gradient(135deg,rgba(255,244,214,0.14)_0%,rgba(15,23,42,0.88)_42%,rgba(30,41,59,0.82)_100%)] shadow-[0_16px_34px_rgba(0,0,0,0.34)] ring-1 ring-inset ring-white/6'
            : 'border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(241,245,249,0.98)_46%,rgba(226,232,240,0.92)_100%)] shadow-[0_14px_30px_rgba(15,23,42,0.10)] ring-1 ring-inset ring-white/75'}
          ${isAvailable
            ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.985]'
            : 'cursor-not-allowed opacity-70'}`}
        role='button'
        tabIndex={isAvailable ? 0 : -1}
        aria-disabled={!isAvailable}
        onKeyDown={e => {
          if (!isAvailable) return
          if (e.key === 'Enter' || e.key === ' ') {
            handlePlay(e)
          }
        }}
      >
        <div className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0
          ${isDark ? 'shadow-[0_0_0_2px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_0_2px_rgba(255,255,255,0.8)]'}`}>
          <div
            className={`absolute inset-0 bg-cover bg-center ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ backgroundImage: `url(${cover})` }}
          />
          <div className='absolute inset-0 bg-black/20 flex items-center justify-center z-10'>
            <div className='text-white opacity-90'>
              {isPlaying ? (
                <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M7 5H10V19H7V5Z' />
                  <path d='M14 5H17V19H14V5Z' />
                </svg>
              ) : (
                <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' style={{ marginLeft: '1px' }}>
                  <path d='M8 5V19L19 12L8 5Z' />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1 min-width-0 overflow-hidden'>
          <div className={`text-sm font-bold truncate ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
            {title}
          </div>
          <div className={`text-[10px] font-medium opacity-50 ${isDark ? 'text-white' : 'text-slate-600'}`}>
            {!isAvailable
              ? '音频地址缺失'
              : isPlaying
                ? '正在同步播放...'
                : artist}
          </div>
        </div>

        {isPlaying && (
          <div className='flex gap-0.5 items-center pr-4 h-4 overflow-hidden self-center'>
            {[1, 2, 3, 2, 1].map((_, i) => (
              <div
                key={i}
                className='w-0.5 bg-blue-400'
                style={{
                  height: '100%',
                  animation: 'islandWaveform 0.6s ease-in-out infinite alternate',
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
