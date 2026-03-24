import { useEffect, useRef, useState } from 'react'

import LazyImage from '@/components/LazyImage'

const DEFAULT_TITLE = '文章播客'
const DEFAULT_ARTIST = 'RHZ'
const DEFAULT_DESCRIPTION = '这篇文章提供了可直接收听的播客版本。'
const EMPTY_META = {
  url: '',
  title: '',
  artist: '',
  cover: '',
  description: '',
  lrc: '',
  isPodcast: false
}

const normalizeText = value => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const readBlockText = value => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value?.[0]
    if (Array.isArray(first)) return normalizeText(first?.[0])
  }
  return ''
}

const normalizeAudioKey = rawUrl => {
  const cleanUrl = normalizeText(rawUrl).split('?')[0]
  if (!cleanUrl) return ''

  try {
    const u = new URL(cleanUrl)
    return decodeURIComponent(u.pathname.split('/').pop() || '')
  } catch {
    return decodeURIComponent(cleanUrl.split('/').pop() || '')
  }
}

const buildAudioKeyVariants = rawValue => {
  const normalized = normalizeAudioKey(rawValue)
  if (!normalized) return []

  const variants = new Set([normalized])
  const withoutExt = normalized.replace(/\.[a-z0-9]{1,8}$/i, '')
  if (withoutExt && withoutExt !== normalized) {
    variants.add(withoutExt)
  }

  return Array.from(variants)
}


const formatDuration = durationSeconds => {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return ''

  const totalSeconds = Math.round(durationSeconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}小时 ${String(minutes).padStart(2, '0')}分`
  }

  return `${minutes || 0}分 ${String(seconds).padStart(2, '0')}秒`
}

const getPlayerCurrentUrl = ap => ap?.list?.audios?.[ap?.list?.index]?.url || ''

const collectPodcastCandidateUrlsFromBlockMap = post => {
  const blockMap = post?.blockMap?.block
  if (!blockMap) return []

  const urls = []
  const seen = new Set()

  Object.values(blockMap).forEach(blockWrapper => {
    const block = blockWrapper?.value
    if (!block || block.type !== 'audio') return

    const source =
      readBlockText(block?.properties?.source) ||
      normalizeText(block?.format?.display_source) ||
      normalizeText(block?.properties?.audio)

    if (!source || seen.has(source)) return

    seen.add(source)
    urls.push(source)
  })

  return urls
}

const collectPodcastCandidateUrlsFromDom = () => {
  if (typeof document === 'undefined') return []

  const urls = []
  const seen = new Set()
  const audioTags = document.querySelectorAll(
    '#article-wrapper .notion-audio audio, #notion-article .notion-audio audio'
  )

  audioTags.forEach(audioTag => {
    const candidates = [
      normalizeText(audioTag?.currentSrc || audioTag?.src),
      normalizeText(audioTag?.getAttribute?.('src')),
      normalizeText(audioTag?.querySelector?.('source')?.src),
      normalizeText(audioTag?.querySelector?.('source')?.getAttribute?.('src'))
    ]

    candidates.forEach(source => {
      if (!source || seen.has(source)) return
      seen.add(source)
      urls.push(source)
    })
  })

  return urls
}



export default function PostPodcastCard({ post }) {
  const [podcastMeta, setPodcastMeta] = useState(EMPTY_META)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [season, setSeason] = useState('none')
  const [candidateUrls, setCandidateUrls] = useState(() => collectPodcastCandidateUrlsFromBlockMap(post))
  const boundPlayerRef = useRef(null)
  const resolvedByEventRef = useRef(false)


  useEffect(() => {
    const fallbackUrls = collectPodcastCandidateUrlsFromBlockMap(post)
    if (fallbackUrls.length) {
      setCandidateUrls(Array.from(new Set(fallbackUrls)))
    }

    if (typeof document === 'undefined' || typeof window === 'undefined') return undefined

    const syncCandidateUrls = () => {
      const domUrls = collectPodcastCandidateUrlsFromDom()
      if (domUrls.length) {
        setCandidateUrls(Array.from(new Set(domUrls)))
        return
      }

      const blockMapUrls = collectPodcastCandidateUrlsFromBlockMap(post)
      setCandidateUrls(Array.from(new Set(blockMapUrls)))
    }

    const handlePodcastMetaReady = event => {
      const detail = event?.detail || {}
      if (!detail?.isPodcast || !(detail?.resolvedUrl || detail?.url)) return

      resolvedByEventRef.current = true
      setPodcastMeta({

        url: detail.resolvedUrl || detail.url,
        title: detail.title || post?.title || DEFAULT_TITLE,
        artist: detail.artist || DEFAULT_ARTIST,
        cover: detail.cover || post?.pageCover || '/avatar.png',
        description: detail.description || DEFAULT_DESCRIPTION,
        lrc: detail.lrc || '',
        isPodcast: true
      })
      setIsLoading(false)
    }

    syncCandidateUrls()

    const lastPodcastMeta = window.__HEO_LAST_PODCAST_META__
    if (lastPodcastMeta?.isPodcast) {
      handlePodcastMetaReady({ detail: lastPodcastMeta })
    }

    window.addEventListener('heo-podcast-meta-ready', handlePodcastMetaReady)
    const timer = window.setTimeout(syncCandidateUrls, 800)
    const article =
      document.getElementById('notion-article') ||
      document.getElementById('article-wrapper') ||
      document.body
    const observer = new MutationObserver(syncCandidateUrls)
    observer.observe(article, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('heo-podcast-meta-ready', handlePodcastMetaReady)
    }
  }, [post])




  useEffect(() => {
    let active = true

    const resolvePodcastMeta = async () => {
      if (!candidateUrls.length) {
        if (!resolvedByEventRef.current) {
          setPodcastMeta(EMPTY_META)
        }
        setIsLoading(false)
        return
      }

      if (!resolvedByEventRef.current) {
        setIsLoading(true)
      }


      try {
        const res = await fetch('/api/audio-meta')
        if (!res.ok) throw new Error(`audio-meta request failed: ${res.status}`)

        const metaMap = await res.json()
        const matched = candidateUrls
          .map(url => {
            const meta = buildAudioKeyVariants(url)
              .map(audioKey => metaMap?.[audioKey] || metaMap?.byAudioKey?.[audioKey] || null)
              .find(Boolean)
            return meta ? { url, meta } : null
          })
          .find(item => item?.meta?.isPodcast)

        if (!active) return

        if (!matched) {
          if (!resolvedByEventRef.current) {
            setPodcastMeta(EMPTY_META)
          }
          setIsLoading(false)
          return
        }


        setPodcastMeta({
          url: matched.meta.archivedAudioUrl || matched.meta.rawUrl || matched.url,
          title: matched.meta.name || post?.title || DEFAULT_TITLE,
          artist: matched.meta.artist || DEFAULT_ARTIST,
          cover: matched.meta.cover || post?.pageCover || '/avatar.png',
          description: matched.meta.pcDescription || DEFAULT_DESCRIPTION,
          lrc: matched.meta.lrc || '',
          isPodcast: Boolean(matched.meta.isPodcast)
        })
      } catch (error) {
        console.error('[PostPodcastCard] failed to resolve podcast meta', error)
        if (active && !resolvedByEventRef.current) {
          setPodcastMeta(EMPTY_META)
        }
      } finally {

        if (active) {
          setIsLoading(false)
        }
      }
    }

    resolvePodcastMeta()

    return () => {
      active = false
    }
  }, [candidateUrls, post?.pageCover, post?.title])

  useEffect(() => {
    if (!podcastMeta?.url || typeof window === 'undefined') {
      setDuration('')
      return undefined
    }

    const audio = new window.Audio()
    audio.preload = 'metadata'

    const handleLoadedMetadata = () => {
      setDuration(formatDuration(audio.duration))
    }

    const handleError = () => {
      setDuration('')
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('error', handleError)
    audio.src = podcastMeta.url

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('error', handleError)
      audio.src = ''
    }
  }, [podcastMeta?.url])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const htmlEl = document.documentElement
    const themeRoot = document.getElementById('theme-heo')

    const syncThemeState = () => {
      setIsDark(htmlEl.classList.contains('dark'))
      setSeason(themeRoot?.dataset?.heoSeason || 'none')
    }

    syncThemeState()

    const htmlObs = new MutationObserver(syncThemeState)
    htmlObs.observe(htmlEl, {
      attributes: true,
      attributeFilter: ['class']
    })

    let themeObs = null
    if (themeRoot) {
      themeObs = new MutationObserver(syncThemeState)
      themeObs.observe(themeRoot, {
        attributes: true,
        attributeFilter: ['data-heo-season']
      })
    }

    return () => {
      htmlObs.disconnect()
      themeObs?.disconnect()
    }
  }, [])


  useEffect(() => {
    if (typeof window === 'undefined' || !podcastMeta?.url) return undefined

    const syncStatus = () => {
      const ap = window.__APPLAYER__
      const currentUrl = getPlayerCurrentUrl(ap)
      setIsPlaying(Boolean(podcastMeta.url) && !ap?.audio?.paused && currentUrl === podcastMeta.url)
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

    const apTimer = window.setInterval(() => {
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
  }, [podcastMeta?.url])

  const handlePlay = () => {
    if (typeof window === 'undefined') return

    const ap = window.__APPLAYER__
    const source = podcastMeta?.url
    if (!ap || !source) return

    const audios = ap?.list?.audios || []
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
          name: podcastMeta.title,
          artist: podcastMeta.artist,
          url: source,
          cover: podcastMeta.cover,
          lrc: podcastMeta.lrc,
          theme: '#60a5fa',
          meta: {
            isPodcast: true,
            pcDescription: podcastMeta.description || '',
            sourceUrl: source
          }
        }
      ])
      ap.list.switch(audios.length)
    }

    ap.play()
  }

  if (isLoading || !podcastMeta?.isPodcast || !podcastMeta?.url) {
    return null
  }

  const seasonPalette = {
    spring: {
      glow: isDark ? 'rgba(244, 114, 182, 0.18)' : 'rgba(244, 114, 182, 0.16)',
      accent: isDark ? 'rgba(134, 239, 172, 0.18)' : 'rgba(134, 239, 172, 0.18)',
      badge: isDark ? 'rgba(244, 114, 182, 0.18)' : 'rgba(251, 207, 232, 0.72)',
      badgeText: isDark ? 'rgba(255,255,255,0.88)' : 'rgb(157 23 77)',
      button: 'linear-gradient(135deg, #f472b6, #fb7185)'
    },
    summer: {
      glow: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.18)',
      accent: isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(45, 212, 191, 0.2)',
      badge: isDark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(207, 250, 254, 0.8)',
      badgeText: isDark ? 'rgba(255,255,255,0.9)' : 'rgb(14 116 144)',
      button: 'linear-gradient(135deg, #0ea5e9, #14b8a6)'
    },
    autumn: {
      glow: isDark ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.16)',
      accent: isDark ? 'rgba(250, 204, 21, 0.16)' : 'rgba(250, 204, 21, 0.16)',
      badge: isDark ? 'rgba(251, 146, 60, 0.18)' : 'rgba(254, 215, 170, 0.82)',
      badgeText: isDark ? 'rgba(255,255,255,0.9)' : 'rgb(154 52 18)',
      button: 'linear-gradient(135deg, #f97316, #f59e0b)'
    },
    winter: {
      glow: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(96, 165, 250, 0.16)',
      accent: isDark ? 'rgba(167, 139, 250, 0.18)' : 'rgba(167, 139, 250, 0.16)',
      badge: isDark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(219, 234, 254, 0.82)',
      badgeText: isDark ? 'rgba(255,255,255,0.9)' : 'rgb(30 64 175)',
      button: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
    },
    none: {
      glow: isDark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(96, 165, 250, 0.14)',
      accent: isDark ? 'rgba(167, 139, 250, 0.16)' : 'rgba(167, 139, 250, 0.14)',
      badge: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(241, 245, 249, 0.96)',
      badgeText: isDark ? 'rgba(255,255,255,0.88)' : 'rgb(51 65 85)',
      button: 'linear-gradient(135deg, #0f172a, #334155)'
    }
  }

  const palette = seasonPalette[season] || seasonPalette.none

  return (
    <section className='post-podcast-card mt-5'>
      <div
        className={`group relative overflow-hidden rounded-[1.6rem] border transition-all duration-300 ${
          isDark
            ? 'border-white/10 bg-[linear-gradient(135deg,rgba(30,41,59,0.86),rgba(15,23,42,0.94))] shadow-[0_24px_56px_rgba(2,6,23,0.46)]'
            : 'border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] shadow-[0_22px_52px_rgba(15,23,42,0.12)]'
        }`}
        style={{
          boxShadow: isPlaying
            ? `0 26px 60px ${palette.glow}, ${isDark ? '0 12px 28px rgba(2,6,23,0.32)' : '0 12px 28px rgba(15,23,42,0.10)'}`
            : undefined
        }}
      >
        <div
          className='pointer-events-none absolute inset-0 opacity-90'
          style={{
            background: `radial-gradient(circle at 12% 18%, ${palette.glow}, transparent 34%), radial-gradient(circle at 88% 20%, ${palette.accent}, transparent 28%)`
          }}
        />

        <div className='relative flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-6 lg:p-6'>
          <div className='flex items-center gap-4 sm:gap-5'>
            <div className='relative h-24 w-24 overflow-hidden rounded-[1.25rem] ring-1 ring-white/20 sm:h-28 sm:w-28'>
              <LazyImage src={podcastMeta.cover} className={`h-full w-full object-cover transition duration-500 ${isPlaying ? 'scale-[1.05]' : 'scale-100'}`} />
              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.32))]' />
              <div className='absolute left-2.5 top-2.5 inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/92 backdrop-blur-md' style={{ background: 'rgba(2,6,23,0.45)' }}>
                PODCAST
              </div>
              {isPlaying ? (
                <div className='absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-md'>
                  {[1, 2, 3, 2].map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className='block w-0.5 rounded-full bg-white/90'
                      style={{
                        height: `${10 + item * 3}px`,
                        animation: 'podcastWave 0.72s ease-in-out infinite alternate',
                        animationDelay: `${index * 0.12}s`
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className='min-w-0 flex-1 lg:hidden'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold' style={{ background: palette.badge, color: palette.badgeText }}>
                  文章播客
                </span>
                {duration ? (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isDark ? 'bg-white/8 text-white/70' : 'bg-slate-100/90 text-slate-500'
                  }`}>
                    {duration}
                  </span>
                ) : null}
              </div>
              <h3 className={`mt-2 line-clamp-2 text-lg font-bold leading-7 ${isDark ? 'text-white/92' : 'text-slate-900'}`}>
                {podcastMeta.title || DEFAULT_TITLE}
              </h3>
              <p className={`mt-1 text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {podcastMeta.artist || DEFAULT_ARTIST}
              </p>
            </div>
          </div>

          <div className='hidden min-w-0 flex-1 lg:block'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold' style={{ background: palette.badge, color: palette.badgeText }}>
                文章播客版
              </span>
              {duration ? (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  isDark ? 'bg-white/8 text-white/70' : 'bg-slate-100/90 text-slate-500'
                }`}>
                  {duration}
                </span>
              ) : null}
              {isPlaying ? (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  isDark ? 'bg-emerald-400/12 text-emerald-200' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  正在播放中
                </span>
              ) : null}
            </div>

            <h3 className={`mt-3 text-xl font-bold tracking-tight sm:text-[1.35rem] ${isDark ? 'text-white/92' : 'text-slate-900'}`}>
              {podcastMeta.title || DEFAULT_TITLE}
            </h3>

            <p className={`mt-1 text-sm font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {podcastMeta.artist || DEFAULT_ARTIST}
            </p>

            <p className={`mt-3 line-clamp-2 text-sm leading-7 ${isDark ? 'text-white/72' : 'text-slate-600'}`}>
              {podcastMeta.description || DEFAULT_DESCRIPTION}
            </p>
          </div>

          <div className='lg:hidden'>
            <p className={`line-clamp-2 text-sm leading-7 ${isDark ? 'text-white/72' : 'text-slate-600'}`}>
              {podcastMeta.description || DEFAULT_DESCRIPTION}
            </p>
          </div>

          <div className='flex shrink-0 items-center lg:self-stretch'>
            <button
              type='button'
              onClick={handlePlay}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition duration-200 sm:w-auto ${
                isPlaying ? 'scale-[1.01]' : ''
              }`}
              style={{
                background: palette.button,
                boxShadow: isPlaying ? `0 18px 36px ${palette.glow}` : '0 12px 26px rgba(15,23,42,0.14)'
              }}
            >
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/18'>
                {isPlaying ? (
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M7 5H10V19H7V5Z' />
                    <path d='M14 5H17V19H14V5Z' />
                  </svg>
                ) : (
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor' style={{ marginLeft: '1px' }}>
                    <path d='M8 5V19L19 12L8 5Z' />
                  </svg>
                )}
              </span>
              <span>{isPlaying ? '暂停播客' : '立即收听'}</span>
            </button>
          </div>
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

