import { useEffect, useMemo, useRef, useState } from 'react'

const getIsDark = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark')

const DynamicIslandPlayer = ({ className }) => {
  const [ap, setAp] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [track, setTrack] = useState({
    name: '',
    artist: '',
    cover: ''
  })
  const [progress, setProgress] = useState({ current: 0, duration: 0 })
  const [isDark, setIsDark] = useState(false)
  const [showLrc, setShowLrc] = useState(false)
  const [danmakus, setDanmakus] = useState([]) // {key, text, lane}
  const danmakuKeyRef = useRef(0)
  const lastLrcIdxRef = useRef(-1)
  const lastTrackKeyRef = useRef('')
  const lrcListRef = useRef([])

  // 弹幕防重叠：轨道占用时间戳（基于同速移动，需等前一条“头部”领先安全距离后再放入同轨）
  const danmakuLaneUntilRef = useRef([])
  const danmakuHostRef = useRef(null)

  const mountedRef = useRef(false)

  // 弹幕参数（可按需调整）
  const DANMAKU_CONFIG = {
    lanes: 2,
    laneHeight: 40,
    durationMs: 8500,
    safeGapPx: 24,
    fontSize: 18,
    fontWeight: 600
  }

  const measureDanmakuWidth = (text) => {
    if (typeof document === 'undefined') return 0
    const el = document.createElement('span')
    el.style.position = 'fixed'
    el.style.left = '-99999px'
    el.style.top = '-99999px'
    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = `${DANMAKU_CONFIG.fontSize}px`
    el.style.fontWeight = String(DANMAKU_CONFIG.fontWeight)
    el.style.padding = '4px 15px'
    el.style.border = '1px solid transparent'
    el.textContent = String(text || '')
    document.body.appendChild(el)
    const w = el.getBoundingClientRect().width
    document.body.removeChild(el)
    return w
  }

  const pickDanmakuLane = (textWidth) => {
    const now = Date.now()
    const hostW = danmakuHostRef.current?.getBoundingClientRect?.().width || (typeof window !== 'undefined' ? window.innerWidth : 0)
    const durationMs = DANMAKU_CONFIG.durationMs
    const speedPxPerMs = hostW > 0 ? (hostW + textWidth) / durationMs : 0
    const neededMs = speedPxPerMs > 0 ? (textWidth + DANMAKU_CONFIG.safeGapPx) / speedPxPerMs : durationMs

    const laneUntil = danmakuLaneUntilRef.current

    // 优先找当前空闲轨道
    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      if ((laneUntil[lane] || 0) <= now) {
        laneUntil[lane] = now + neededMs
        return lane
      }
    }

    // 都不空闲时：为了保证“看起来是多轨道”而不是永远挤在同一轨道，
    // 选择到期时间最早的轨道；如果多个轨道相同，则用时间做一个轮询打散。
    let bestUntil = Infinity
    let bestLanes = []
    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      const until = laneUntil[lane] || 0
      if (until < bestUntil) {
        bestUntil = until
        bestLanes = [lane]
      } else if (until === bestUntil) {
        bestLanes.push(lane)
      }
    }

    const pick = bestLanes.length
      ? bestLanes[Math.floor(now / 50) % bestLanes.length]
      : 0

    laneUntil[pick] = bestUntil + neededMs
    return pick
  }

  // 解析 LRC 格式
  const parseLrc = (lrcStr) => {
    if (!lrcStr) return []
    const normalizedLrc = String(lrcStr).replace(/\\n/g, '\n')
    const lines = normalizedLrc.split('\n')
    const result = []
    const timeReg = /\[(\d+):(\d+)(?:\.(\d+))?\]/

    lines.forEach(line => {
      const match = timeReg.exec(line)
      if (!match) return

      const min = parseInt(match[1])
      const sec = parseInt(match[2])
      const frac = match[3] ? match[3] : '0'
      const ms = parseInt(frac)
      const time = min * 60 + sec + (frac.length >= 3 ? ms / 1000 : ms / 100)

      const text = line.replace(timeReg, '').trim()
      if (text) result.push({ time, text })
    })

    return result.sort((a, b) => a.time - b.time)
  }

  const title = useMemo(() => {
    if (isError) return '(资源加载失败)'
    const n = track?.name || ''
    const a = track?.artist || ''
    return a ? `${n} - ${a}` : n
  }, [track, isError])

  useEffect(() => {
    mountedRef.current = true

    try {
      const savedLrc = localStorage.getItem('di-show-lrc')
      if (savedLrc !== null) setShowLrc(savedLrc === 'true')
    } catch (e) {
      // ignore
    }

    const updateDark = () => setIsDark(getIsDark())
    updateDark()

    const obs = new MutationObserver(updateDark)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      mountedRef.current = false
      obs.disconnect()
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const inst = window.__APPLAYER__
      if (inst && mountedRef.current) {
        setAp(inst)
        clearInterval(timer)
      }
    }, 200)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!ap) return

    const sync = () => {
      try {
        const list = ap.list
        const idx = list?.index
        const aud = list?.audios?.[idx]

        setTrack({
          name: aud?.name || '',
          artist: aud?.artist || '',
          cover: aud?.cover || ''
        })

        const trackKey = `${aud?.name || ''}|${aud?.artist || ''}|${aud?.url || ''}`
        if (trackKey && trackKey !== lastTrackKeyRef.current) {
          lastTrackKeyRef.current = trackKey
          lastLrcIdxRef.current = -1
          lrcListRef.current = parseLrc(aud?.lrc || '')
          setIsLoading(true)
          setIsError(false)
        }

        const audio = ap.audio
        const current = audio?.currentTime || 0
        const duration = audio?.duration || 0

        setIsPlaying(!audio?.paused)
        setProgress({ current, duration })

        // 加载态兜底判断
        if (audio?.readyState < 2 && !audio?.paused) {
          setIsLoading(true)
        }

        if (showLrc && !audio?.paused && lrcListRef.current?.length) {
          const nextIdx = (() => {
            const lastIdx = lastLrcIdxRef.current
            let i = Math.max(0, lastIdx)
            while (i + 1 < lrcListRef.current.length && current >= lrcListRef.current[i + 1].time) i++
            while (i > 0 && current < lrcListRef.current[i].time) i--
            return i
          })()

          if (nextIdx !== lastLrcIdxRef.current) {
            lastLrcIdxRef.current = nextIdx
            const text = lrcListRef.current[nextIdx]?.text
            if (text) {
              const key = ++danmakuKeyRef.current
              const w = measureDanmakuWidth(text)
              const lane = pickDanmakuLane(w)
              setDanmakus(prev => {
                const next = [...prev, { key, text, lane }]
                return next.slice(-(DANMAKU_CONFIG.lanes * 2))
              })
              setTimeout(() => {
                setDanmakus(prev => prev.filter(d => d.key !== key))
              }, DANMAKU_CONFIG.durationMs + 1500)
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      setIsLoading(false)
      setIsError(true)
    }

    sync()

    ap.on('play', sync)
    ap.on('pause', sync)
    ap.on('ended', sync)
    ap.on('timeupdate', sync)
    ap.on('listswitch', sync)
    ap.on('waiting', handleWaiting)
    ap.on('canplay', handleCanPlay)
    ap.on('error', handleError)

    return () => {
      try {
        ap.off('play', sync)
        ap.off('pause', sync)
        ap.off('ended', sync)
        ap.off('timeupdate', sync)
        ap.off('listswitch', sync)
        ap.off('waiting', handleWaiting)
        ap.off('canplay', handleCanPlay)
        ap.off('error', handleError)
      } catch (e) {
        // ignore
      }
    }
  }, [ap, showLrc])

  const togglePlay = () => {
    if (!ap) return
    try {
      if (ap.audio?.paused) ap.play()
      else ap.pause()
    } catch (e) {
      // ignore
    }
  }

  const next = () => {
    if (!ap) return
    try {
      ap.skipForward()
    } catch (e) {
      // ignore
    }
  }

  const prev = () => {
    if (!ap) return
    try {
      ap.skipBack()
    } catch (e) {
      // ignore
    }
  }

  const progressPct =
    progress.duration > 0
      ? Math.min(100, Math.max(0, (progress.current / progress.duration) * 100))
      : 0

  return (
    <>
      {/* 弹幕歌词渲染层 */}
      {showLrc && (
        <div
          ref={danmakuHostRef}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 100,
            height: DANMAKU_CONFIG.lanes * DANMAKU_CONFIG.laneHeight,
            pointerEvents: 'none',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {danmakus.map((d) => (
            <div
              key={d.key}
              className="di-danmaku"
              style={{
                position: 'absolute',
                left: 0,
                top: (d.lane || 0) * DANMAKU_CONFIG.laneHeight,
                whiteSpace: 'nowrap',
                fontSize: DANMAKU_CONFIG.fontSize,
                fontWeight: DANMAKU_CONFIG.fontWeight,
                color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
                textShadow: isDark 
                  ? '0 0 12px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,1)' 
                  : '0 0 12px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,1)',
                padding: '4px 15px',
                borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              {d.text}
            </div>
          ))}
        </div>
      )}

      <div
        className={className || ''}
        style={{
          position: 'fixed',
          left: 20,
          bottom: 20,
          zIndex: 200,
          pointerEvents: 'auto'
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onClick={() => setExpanded(v => !v)}
      >
      <div
        style={{
          width: expanded ? 320 : 64,
          height: 64,
          borderRadius: 9999,
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          overflow: 'hidden',
          border: isError 
            ? '1.5px solid rgba(239, 68, 68, 0.6)' 
            : (isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.06)'),
          background: isDark
            ? 'rgba(24, 23, 29, 0.72)'
            : 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isError
            ? '0 0 15px rgba(239, 68, 68, 0.25)'
            : (isDark
                ? 'rgba(0, 0, 0, 0.35) 0px 10px 28px, rgba(0, 0, 0, 0.2) 0px 1px 2px'
                : 'rgba(0, 0, 0, 0.08) 0px 6px 18px, rgba(0, 0, 0, 0.06) 0px 1px 2px'),
          transition: 'all 420ms cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 9999,
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
            opacity: isLoading ? 0.6 : 1,
            boxShadow: isDark
              ? '0 0 0 3px rgba(0, 0, 0, 0.35)'
              : '0 0 0 3px rgba(255, 255, 255, 0.85)',
            transition: 'opacity 300ms ease'
          }}
        >
          {track.cover ? (
            <img
              src={track.cover}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transformOrigin: '50% 50%',
                animation: isLoading 
                  ? 'islandPulse 1.5s ease-in-out infinite' 
                  : (isPlaying ? 'islandSpin 18s linear infinite' : 'none')
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: isDark ? '#222' : '#eee'
              }}
            />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.18)',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
              transition: 'transform 150ms ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.85)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ opacity: 0.95 }}
              >
                <path d="M7 5H10V19H7V5Z" fill="currentColor" />
                <path d="M14 5H17V19H14V5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginLeft: 1, opacity: 0.95 }}
              >
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        <div
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'opacity 220ms ease, transform 220ms ease'
          }}
        >
          <div
            title={title}
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: isError 
                ? 'rgba(239, 68, 68, 0.9)' 
                : (isDark ? 'rgba(255,255,255,0.92)' : 'rgba(17,24,39,0.92)'),
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title || ' '}
          </div>
          <div
            style={{
              marginTop: 6,
              height: 3,
              borderRadius: 9999,
              background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                borderRadius: 9999,
                background: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)',
                transition: 'width 160ms linear'
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: expanded ? 'flex' : 'none',
            alignItems: 'center',
            gap: 8
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`${isDark ? 'di-btn di-btn-dark' : 'di-btn'} ${showLrc ? 'di-btn-active' : ''}`}
            style={iconButtonStyle(isDark)}
            aria-label={showLrc ? 'Hide Lyrics Danmaku' : 'Show Lyrics Danmaku'}
            onClick={(e) => {
              e.stopPropagation()
              setShowLrc(v => {
                const next = !v
                try {
                  localStorage.setItem('di-show-lrc', String(next))
                } catch (err) {
                  // ignore
                }
                return next
              })
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={prev}
            className={isDark ? 'di-btn di-btn-dark' : 'di-btn'}
            style={iconButtonStyle(isDark)}
            aria-label="Previous"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className={isDark ? 'di-btn di-btn-dark' : 'di-btn'}
            style={iconButtonStyle(isDark)}
            aria-label="Next"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes islandSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes islandPulse {
          0%, 100% { opacity: 0.5; filter: blur(1px); }
          50% { opacity: 1; filter: blur(0px); }
        }

        @keyframes diDanmakuMove {
          from { transform: translateX(100vw); }
          to { transform: translateX(-120%); }
        }

        .di-danmaku {
          animation: diDanmakuMove 8.5s linear forwards;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .di-danmaku {
            animation: none !important;
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
          }
        }

        .di-btn {
          opacity: 0.92;
        }

        .di-btn:hover {
          opacity: 1;
          transform: translateY(-0.5px);
          background: rgba(255, 255, 255, 0.62) !important;
          box-shadow:
            0 6px 18px rgba(0, 0, 0, 0.08),
            inset 0 1px 1px rgba(255, 255, 255, 0.85) !important;
        }

        .di-btn:active {
          transform: translateY(1px) scale(0.97);
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 1px 1px rgba(255, 255, 255, 0.7) !important;
        }

        .di-btn.di-btn-dark:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.12) !important;
        }

        .di-btn.di-btn-dark:active {
          box-shadow:
            0 4px 10px rgba(0, 0, 0, 0.28),
            inset 0 1px 1px rgba(255, 255, 255, 0.1) !important;
        }

        .di-btn-active {
          background: rgba(0, 0, 0, 0.06) !important;
          border: 1px solid rgba(0, 0, 0, 0.10) !important;
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.10),
            inset 0 1px 1px rgba(255, 255, 255, 0.85) !important;
        }

        .di-btn-active.di-btn-dark {
          background: rgba(255, 255, 255, 0.14) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          box-shadow:
            0 10px 22px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.14) !important;
        }
      `}</style>
    </div>
    </>
  )
}

const iconButtonStyle = (isDark) => ({
  width: 34,
  height: 34,
  borderRadius: 9999,
  border: isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(0,0,0,0.06)',
  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  fontSize: 0,
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: isDark 
    ? '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)'
    : '0 2px 8px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)',
  opacity: 1
})

export default DynamicIslandPlayer
