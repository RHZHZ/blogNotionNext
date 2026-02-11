import { useEffect, useMemo, useRef, useState } from 'react'

const getIsDark = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark')

const DynamicIslandPlayer = ({ className }) => {
  const [ap, setAp] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState({
    name: '',
    artist: '',
    cover: ''
  })
  const [progress, setProgress] = useState({ current: 0, duration: 0 })
  const [isDark, setIsDark] = useState(false)
  const [showLrc, setShowLrc] = useState(false)
  const [danmakus, setDanmakus] = useState([]) // {key, text}
  const danmakuKeyRef = useRef(0)
  const lastLrcIdxRef = useRef(-1)
  const lastTrackKeyRef = useRef('')
  const lrcListRef = useRef([])

  const mountedRef = useRef(false)

  // 解析 LRC 格式
  const parseLrc = (lrcStr) => {
    if (!lrcStr) return []
    // 处理可能存在的字面量 \n 字符串
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
    const n = track?.name || ''
    const a = track?.artist || ''
    return a ? `${n} - ${a}` : n
  }, [track])

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
        }

        const audio = ap.audio
        const current = audio?.currentTime || 0
        const duration = audio?.duration || 0

        setIsPlaying(!audio?.paused)
        setProgress({ current, duration })

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
              setDanmakus(prev => {
                const next = [...prev, { key, text }]
                return next.slice(-3) // 最多保留3条正在跑的，避免内存泄漏
              })
              setTimeout(() => {
                setDanmakus(prev => prev.filter(d => d.key !== key))
              }, 10000) // 10秒后彻底移除
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }

    sync()

    ap.on('play', sync)
    ap.on('pause', sync)
    ap.on('ended', sync)
    ap.on('timeupdate', sync)
    ap.on('listswitch', sync)

    return () => {
      try {
        ap.off('play', sync)
        ap.off('pause', sync)
        ap.off('ended', sync)
        ap.off('timeupdate', sync)
        ap.off('listswitch', sync)
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
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 100,
            height: 40,
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
                top: 0,
                whiteSpace: 'nowrap',
                fontSize: 18,
                fontWeight: 600,
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
          border: isDark
            ? '1px solid rgba(255,255,255,0.10)'
            : '1px solid rgba(0,0,0,0.06)',
          background: isDark
            ? 'rgba(24, 23, 29, 0.72)'
            : 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: isDark
            ? 'rgba(0, 0, 0, 0.35) 0px 10px 28px, rgba(0, 0, 0, 0.2) 0px 1px 2px'
            : 'rgba(0, 0, 0, 0.08) 0px 6px 18px, rgba(0, 0, 0, 0.06) 0px 1px 2px',
          transition: 'width 420ms cubic-bezier(0.18, 0.89, 0.32, 1.28)'
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
            boxShadow: isDark
              ? '0 0 0 3px rgba(0, 0, 0, 0.35)'
              : '0 0 0 3px rgba(255, 255, 255, 0.85)'
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
                animation: isPlaying ? 'islandSpin 18s linear infinite' : 'none'
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
              color: 'white'
            }}
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
              color: isDark ? 'rgba(255,255,255,0.92)' : 'rgba(17,24,39,0.92)',
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

        @keyframes diDanmakuMove {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
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

