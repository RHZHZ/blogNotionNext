import { useEffect, useMemo, useRef, useState, useCallback, useReducer } from 'react'

// 防抖函数
const throttle = (func, wait) => {
  let timeout = null
  let previous = 0
  
  const throttled = function() {
    const now = Date.now()
    const remaining = wait - (now - previous)
    const context = this
    const args = arguments
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(context, args)
      }, remaining)
    }
  }
  
  throttled.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }
  
  return throttled
}

// 获取暗色主题状态
const getIsDark = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('dark')

// 状态reducer
const playerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, track: action.payload }
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    case 'SET_ERROR':
      return { ...state, isError: action.payload }
    case 'RESET_TRACK':
      return {
        ...state,
        track: { name: '', artist: '', cover: '' },
        progress: { current: 0, duration: 0 },
        isLoading: false,
        isError: false
      }
    default:
      return state
  }
}

// 初始状态
const initialState = {
  track: { name: '', artist: '', cover: '' },
  isPlaying: false,
  isLoading: false,
  isError: false,
  progress: { current: 0, duration: 0 }
}

const DynamicIslandPlayer = ({ className }) => {
  const [ap, setAp] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showLrc, setShowLrc] = useState(false)
  const [danmakus, setDanmakus] = useState([]) // {key, text, lane}
  
  // 使用reducer管理播放器状态
  const [playerState, dispatch] = useReducer(playerReducer, initialState)
  const { track, isPlaying, isLoading, isError, progress } = playerState
  
  const danmakuKeyRef = useRef(0)
  const lastLrcIdxRef = useRef(-1)
  const lastTrackKeyRef = useRef('')
  const lrcListRef = useRef([])
  const mountedRef = useRef(false)
  const measureElRef = useRef(null)
  
  // 弹幕防重叠：轨道占用时间戳
  const danmakuLaneUntilRef = useRef([])
  const danmakuHostRef = useRef(null)
  const syncThrottleRef = useRef(null)

  // 弹幕配置（使用useMemo缓存）
  const DANMAKU_CONFIG = useMemo(() => ({
    lanes: 2,
    laneHeight: 40,
    durationMs: 8500,
    safeGapPx: 24,
    fontSize: 18,
    fontWeight: 600
  }), [])

  // 测量弹幕宽度（使用useCallback缓存，避免重复创建DOM元素）
  const measureDanmakuWidth = useCallback((text) => {
    if (typeof document === 'undefined' || !text) return 0
    
    if (!measureElRef.current) {
      const el = document.createElement('span')
      el.style.position = 'fixed'
      el.style.left = '-99999px'
      el.style.top = '-99999px'
      el.style.whiteSpace = 'nowrap'
      el.style.padding = '4px 15px'
      el.style.border = '1px solid transparent'
      el.style.visibility = 'hidden'
      el.style.fontFamily = 'inherit'
      document.body.appendChild(el)
      measureElRef.current = el
    }
    
    const el = measureElRef.current
    el.style.fontSize = `${DANMAKU_CONFIG.fontSize}px`
    el.style.fontWeight = String(DANMAKU_CONFIG.fontWeight)
    el.textContent = String(text)
    
    return el.getBoundingClientRect().width
  }, [DANMAKU_CONFIG.fontSize, DANMAKU_CONFIG.fontWeight])

  // 选择弹幕轨道（优化版本，清理过期轨道）
  const pickDanmakuLane = useCallback((textWidth) => {
    const now = performance.now()
    const hostW = danmakuHostRef.current?.getBoundingClientRect?.().width || 0
    
    if (hostW <= 0) return 0
    
    const durationMs = DANMAKU_CONFIG.durationMs
    const speedPxPerMs = (hostW + textWidth) / durationMs
    const neededMs = speedPxPerMs > 0 ? (textWidth + DANMAKU_CONFIG.safeGapPx) / speedPxPerMs : durationMs
    
    const laneUntil = danmakuLaneUntilRef.current
    
    // 清理过期轨道（超过1秒未使用的轨道）
    const cleanupThreshold = now - 1000
    for (let i = 0; i < (laneUntil.length || 0); i++) {
      if (laneUntil[i] < cleanupThreshold) {
        laneUntil[i] = 0
      }
    }
    
    // 确保轨道数组长度
    while (laneUntil.length < DANMAKU_CONFIG.lanes) {
      laneUntil.push(0)
    }
    
    // 优先选择空闲轨道
    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      if ((laneUntil[lane] || 0) <= now) {
        laneUntil[lane] = now + neededMs
        return lane
      }
    }
    
    // 无空闲轨道，选择最早可用的
    let earliestTime = Infinity
    let bestLane = 0
    
    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      const availableAt = laneUntil[lane] || 0
      if (availableAt < earliestTime) {
        earliestTime = availableAt
        bestLane = lane
      }
    }
    
    laneUntil[bestLane] = earliestTime + neededMs
    return bestLane
  }, [DANMAKU_CONFIG.lanes, DANMAKU_CONFIG.durationMs, DANMAKU_CONFIG.safeGapPx])

  // 解析LRC歌词
  const parseLrc = useCallback((lrcStr) => {
    if (!lrcStr) return []
    
    const normalizedLrc = String(lrcStr).replace(/\\n/g, '\n')
    const lines = normalizedLrc.split('\n')
    const result = []
    const timeReg = /\[(\d+):(\d+)(?:\.(\d+))?\]/g
    
    lines.forEach(line => {
      const times = []
      let match
      
      // 匹配所有时间标签
      while ((match = timeReg.exec(line)) !== null) {
        const min = parseInt(match[1])
        const sec = parseInt(match[2])
        const frac = match[3] || '0'
        const ms = parseInt(frac)
        const time = min * 60 + sec + (frac.length >= 3 ? ms / 1000 : ms / 100)
        times.push(time)
      }
      
      if (times.length > 0) {
        const text = line.replace(/\[\d+:\d+(?:\.\d+)?\]/g, '').trim()
        if (text) {
          // 为每个时间标签创建条目
          times.forEach(time => {
            result.push({ time, text })
          })
        }
      }
    })
    
    return result.sort((a, b) => a.time - b.time)
  }, [])

  // 计算标题
  const title = useMemo(() => {
    if (isError) return '(资源加载失败)'
    const n = track?.name || ''
    const a = track?.artist || ''
    return a ? `${n} - ${a}` : n
  }, [track, isError])

  // 初始化
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
      
      // 清理测量元素
      if (measureElRef.current && document.body.contains(measureElRef.current)) {
        document.body.removeChild(measureElRef.current)
        measureElRef.current = null
      }
      
      // 清理防抖函数
      if (syncThrottleRef.current) {
        syncThrottleRef.current.cancel()
      }
    }
  }, [])

  // 获取AP实例
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

  // 同步播放器状态
  const syncPlayerState = useCallback(() => {
    if (!ap || !mountedRef.current) return
    
    try {
      const list = ap.list
      const idx = list?.index
      const aud = list?.audios?.[idx]

      // 更新歌曲信息
      const newTrack = {
        name: aud?.name || '',
        artist: aud?.artist || '',
        cover: aud?.cover || ''
      }
      
      dispatch({ type: 'SET_TRACK', payload: newTrack })

      // 检查歌曲是否切换
      const trackKey = `${aud?.name || ''}|${aud?.artist || ''}|${aud?.url || ''}`
      if (trackKey && trackKey !== lastTrackKeyRef.current) {
        lastTrackKeyRef.current = trackKey
        lastLrcIdxRef.current = -1
        lrcListRef.current = parseLrc(aud?.lrc || '')
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ERROR', payload: false })
        
        // 清空弹幕
        setDanmakus([])
        // 重置轨道占用
        danmakuLaneUntilRef.current = []
      }

      const audio = ap.audio
      if (!audio) return
      
      const current = audio.currentTime || 0
      const duration = audio.duration || 0
      
      // 更新播放状态
      dispatch({ type: 'SET_PLAYING', payload: !audio.paused })
      dispatch({ type: 'SET_PROGRESS', payload: { current, duration } })

      // 加载状态兜底判断
      if (audio.readyState < 2 && !audio.paused) {
        dispatch({ type: 'SET_LOADING', payload: true })
      } else if (isLoading && audio.readyState >= 2) {
        dispatch({ type: 'SET_LOADING', payload: false })
      }

      // 弹幕逻辑
      if (showLrc && !audio.paused && lrcListRef.current.length > 0) {
        const nextIdx = (() => {
          const lastIdx = lastLrcIdxRef.current
          let i = Math.max(0, lastIdx)
          
          // 向前查找
          while (i + 1 < lrcListRef.current.length && current >= lrcListRef.current[i + 1].time) {
            i++
          }
          
          // 向后查找
          while (i > 0 && current < lrcListRef.current[i].time) {
            i--
          }
          
          return i
        })()

        if (nextIdx !== lastLrcIdxRef.current) {
          lastLrcIdxRef.current = nextIdx
          const text = lrcListRef.current[nextIdx]?.text
          
          if (text && danmakuHostRef.current) {
            const key = ++danmakuKeyRef.current
            const width = measureDanmakuWidth(text)
            const lane = pickDanmakuLane(width)
            
            setDanmakus(prev => {
              const newDanmakus = [...prev, { key, text, lane }]
             // 根据弹幕密度动态调整数量限制
            const maxDanmakus = Math.min(20, Math.max(8, Math.floor(window.innerWidth / 100)))
            return newDanmakus.slice(-maxDanmakus)
            })
            
            // 自动移除弹幕
            setTimeout(() => {
              if (mountedRef.current) {
                setDanmakus(prev => prev.filter(d => d.key !== key))
              }
            }, DANMAKU_CONFIG.durationMs + 1500)
          }
        }
      }
    } catch (error) {
      console.error('Player sync error:', error)
    }
  }, [ap, showLrc, isLoading, DANMAKU_CONFIG.lanes, measureDanmakuWidth, pickDanmakuLane, parseLrc])

  // 监听AP事件
  useEffect(() => {
    if (!ap) return

    // 创建防抖的sync函数
    if (!syncThrottleRef.current) {
      syncThrottleRef.current = throttle(syncPlayerState, 100)
    }
    
    const throttledSync = syncThrottleRef.current
    
    const handleWaiting = () => dispatch({ type: 'SET_LOADING', payload: true })
    const handleCanPlay = () => dispatch({ type: 'SET_LOADING', payload: false })
    const handleError = () => {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_ERROR', payload: true })
    }

    // 初始同步
    syncPlayerState()

    // 绑定事件
    const events = {
      'timeupdate': throttledSync,
      'listswitch': throttledSync,
      'play': syncPlayerState,
      'pause': syncPlayerState,
      'ended': syncPlayerState,
      'waiting': handleWaiting,
      'canplay': handleCanPlay,
      'error': handleError
    }

    Object.entries(events).forEach(([event, handler]) => {
      ap.on(event, handler)
    })

    return () => {
      // 解绑事件
      Object.entries(events).forEach(([event, handler]) => {
        try {
          ap.off(event, handler)
        } catch (e) {
          // ignore
        }
      })
      
      if (syncThrottleRef.current) {
        syncThrottleRef.current.cancel()
      }
    }
  }, [ap, syncPlayerState])

  // 控制函数
  const togglePlay = useCallback(() => {
    if (!ap) return
    try {
      if (ap.audio?.paused) ap.play()
      else ap.pause()
    } catch (e) {
      console.error('Toggle play error:', e)
    }
  }, [ap])

  const next = useCallback(() => {
    if (!ap) return
    try {
      ap.skipForward()
    } catch (e) {
      console.error('Next track error:', e)
    }
  }, [ap])

  const prev = useCallback(() => {
    if (!ap) return
    try {
      ap.skipBack()
    } catch (e) {
      console.error('Previous track error:', e)
    }
  }, [ap])

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
