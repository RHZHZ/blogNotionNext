import React, { useEffect, useMemo, useRef, useState } from 'react';
import Player from './Player';
import './DynamicIslandPlayer.css';

const DynamicIslandPlayer = ({
  className,
  audio = [],
  autoPlay = false,
  showLrc = false,
  position = 'bottom-left'
}) => {
  const [ap, setAp] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [track, setTrack] = useState({
    name: '',
    artist: '',
    cover: ''
  });
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [isDark, setIsDark] = useState(false);
  const [lrcVisible, setLrcVisible] = useState(showLrc);
  const [danmakus, setDanmakus] = useState([]);

  const danmakuKeyRef = useRef(0);
  const lastLrcIdxRef = useRef(-1);
  const lastTrackKeyRef = useRef('');
  const lrcListRef = useRef([]);
  const danmakuLaneUntilRef = useRef([]);
  const danmakuHostRef = useRef(null);
  const mountedRef = useRef(false);

  // 弹幕配置
  const DANMAKU_CONFIG = {
    lanes: 2,
    laneHeight: 40,
    durationMs: 8500,
    safeGapPx: 24,
    fontSize: 18,
    fontWeight: 600
  };

  useEffect(() => {
    mountedRef.current = true;
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mountedRef.current = false;
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 监听APlayer实例
  useEffect(() => {
    const timer = setInterval(() => {
      const inst = window.__APLAYER__;
      if (inst && mountedRef.current) {
        setAp(inst);
        clearInterval(timer);
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // 同步播放状态
  useEffect(() => {
    if (!ap) return;

    const sync = () => {
      try {
        const list = ap.list;
        const idx = list?.index;
        const aud = list?.audios?.[idx];

        setTrack({
          name: aud?.name || '',
          artist: aud?.artist || '',
          cover: aud?.cover || ''
        });

        const trackKey = `${aud?.name || ''}|${aud?.artist || ''}|${aud?.url || ''}`;
        if (trackKey && trackKey !== lastTrackKeyRef.current) {
          lastTrackKeyRef.current = trackKey;
          lastLrcIdxRef.current = -1;
          lrcListRef.current = parseLrc(aud?.lrc || '');
          setIsLoading(true);
          setIsError(false);
        }

        const audio = ap.audio;
        const current = audio?.currentTime || 0;
        const duration = audio?.duration || 0;

        setIsPlaying(!audio?.paused);
        setProgress({ current, duration });

        if (audio?.readyState < 2 && !audio?.paused) {
          setIsLoading(true);
        } else if (audio?.readyState >= 2) {
          setIsLoading(false);
        }

        // 歌词弹幕处理
        if (lrcVisible && !audio?.paused && lrcListRef.current?.length) {
          const nextIdx = (() => {
            const lastIdx = lastLrcIdxRef.current;
            let i = Math.max(0, lastIdx);
            while (i + 1 < lrcListRef.current.length && current >= lrcListRef.current[i + 1].time) i++;
            while (i > 0 && current < lrcListRef.current[i].time) i--;
            return i;
          })();

          if (nextIdx !== lastLrcIdxRef.current) {
            lastLrcIdxRef.current = nextIdx;
            const text = lrcListRef.current[nextIdx]?.text;
            if (text) {
              const key = ++danmakuKeyRef.current;
              const w = measureDanmakuWidth(text);
              const lane = pickDanmakuLane(w);
              setDanmakus(prev => {
                const next = [...prev, { key, text, lane }];
                return next.slice(-(DANMAKU_CONFIG.lanes * 2));
              });
              setTimeout(() => {
                setDanmakus(prev => prev.filter(d => d.key !== key));
              }, DANMAKU_CONFIG.durationMs + 1500);
            }
          }
        }
      } catch (e) {
        console.error('同步播放状态失败:', e);
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleLoadedData = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      setIsError(true);
    };

    sync();

    ap.on('play', sync);
    ap.on('pause', sync);
    ap.on('ended', sync);
    ap.on('timeupdate', sync);
    ap.on('listswitch', sync);
    ap.on('waiting', handleWaiting);
    ap.on('canplay', handleCanPlay);
    ap.on('loadstart', handleLoadStart);
    ap.on('loadeddata', handleLoadedData);
    ap.on('error', handleError);

    return () => {
      try {
        ap.off('play', sync);
        ap.off('pause', sync);
        ap.off('ended', sync);
        ap.off('timeupdate', sync);
        ap.off('listswitch', sync);
        ap.off('waiting', handleWaiting);
        ap.off('canplay', handleCanPlay);
        ap.off('loadstart', handleLoadStart);
        ap.off('loadeddata', handleLoadedData);
        ap.off('error', handleError);
      } catch (e) {
        console.error('解绑事件失败:', e);
      }
    };
  }, [ap, lrcVisible]);

  const parseLrc = (lrcStr) => {
    if (!lrcStr) return [];
    const normalizedLrc = String(lrcStr).replace(/\\n/g, '\n');
    const lines = normalizedLrc.split('\n');
    const result = [];
    const timeReg = /\[(\d+):(\d+)(?:\.(\d+))?\]/;

    lines.forEach(line => {
      const match = timeReg.exec(line);
      if (!match) return;

      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const frac = match[3] ? match[3] : '0';
      const ms = parseInt(frac);
      const time = min * 60 + sec + (frac.length >= 3 ? ms / 1000 : ms / 100);

      const text = line.replace(timeReg, '').trim();
      if (text) result.push({ time, text });
    });

    return result.sort((a, b) => a.time - b.time);
  };

  const measureDanmakuWidth = (text) => {
    if (typeof document === 'undefined') return 0;
    const el = document.createElement('span');
    el.style.position = 'fixed';
    el.style.left = '-99999px';
    el.style.top = '-99999px';
    el.style.whiteSpace = 'nowrap';
    el.style.fontSize = `${DANMAKU_CONFIG.fontSize}px`;
    el.style.fontWeight = String(DANMAKU_CONFIG.fontWeight);
    el.style.padding = '4px 15px';
    el.style.border = '1px solid transparent';
    el.textContent = String(text || '');
    document.body.appendChild(el);
    const w = el.getBoundingClientRect().width;
    document.body.removeChild(el);
    return w;
  };

  const pickDanmakuLane = (textWidth) => {
    const now = Date.now();
    const hostW = danmakuHostRef.current?.getBoundingClientRect?.().width ||
                  (typeof window !== 'undefined' ? window.innerWidth : 0);
    const durationMs = DANMAKU_CONFIG.durationMs;
    const speedPxPerMs = hostW > 0 ? (hostW + textWidth) / durationMs : 0;
    const neededMs = speedPxPerMs > 0 ? (textWidth + DANMAKU_CONFIG.safeGapPx) / speedPxPerMs : durationMs;

    const laneUntil = danmakuLaneUntilRef.current;

    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      if ((laneUntil[lane] || 0) <= now) {
        laneUntil[lane] = now + neededMs;
        return lane;
      }
    }

    let bestUntil = Infinity;
    let bestLanes = [];
    for (let lane = 0; lane < DANMAKU_CONFIG.lanes; lane++) {
      const until = laneUntil[lane] || 0;
      if (until < bestUntil) {
        bestUntil = until;
        bestLanes = [lane];
      } else if (until === bestUntil) {
        bestLanes.push(lane);
      }
    }

    const pick = bestLanes.length
      ? bestLanes[Math.floor(now / 50) % bestLanes.length]
      : 0;

    laneUntil[pick] = bestUntil + neededMs;
    return pick;
  };

  const togglePlay = () => {
    if (!ap) return;
    try {
      if (ap.audio?.paused) ap.play();
      else ap.pause();
    } catch (e) {
      console.error('播放控制失败:', e);
    }
  };

  const next = () => {
    if (!ap) return;
    try {
      ap.skipForward();
    } catch (e) {
      console.error('下一首失败:', e);
    }
  };

  const prev = () => {
    if (!ap) return;
    try {
      ap.skipBack();
    } catch (e) {
      console.error('上一首失败:', e);
    }
  };

  const toggleLrc = () => {
    setLrcVisible(v => !v);
  };

  const progressPct = progress.duration > 0
    ? Math.min(100, Math.max(0, (progress.current / progress.duration) * 100))
    : 0;

  const containerStyle = {
    position: 'fixed',
    left: position === 'bottom-left' ? '20px' : 'auto',
    right: position === 'bottom-right' ? '20px' : 'auto',
    bottom: '20px',
    zIndex: 200,
    pointerEvents: 'auto'
  };

  return (
    <>
      {/* 音乐引擎 */}
      <Player
        audio={audio}
        autoPlay={autoPlay}
        onPlayerReady={(player) => {
          window.__APLAYER__ = player;
          setAp(player);
        }}
      />

      {/* 弹幕歌词层 */}
      {lrcVisible && (
        <div
          ref={danmakuHostRef}
          className="di-danmaku-host"
        >
          {danmakus.map((d) => (
            <div
              key={d.key}
              className="di-danmaku"
              style={{
                top: `${d.lane * DANMAKU_CONFIG.laneHeight}px`,
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

      {/* 主播放器 */}
      <div
        className={`di-player-container ${className || ''}`}
        style={containerStyle}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onClick={() => setExpanded(v => !v)}
        data-expanded={expanded}
        data-playing={isPlaying}
        data-loading={isLoading}
        data-error={isError}
      >
        <div className="di-player-main">
          {/* 封面/唱片 */}
          <div className="di-cover">
            {track.cover ? (
              <div
                className="di-cover-image"
                style={{ backgroundImage: `url(${track.cover})` }}
              />
            ) : (
              <div className="di-cover-image" />
            )}

            <button
              className="di-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5H10V19H7V5Z" fill="currentColor" />
                  <path d="M14 5H17V19H14V5Z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 1 }}>
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>

          {/* 信息区 */}
          <div className="di-info">
            <div
              className="di-title"
              title={track.name ? `${track.name} - ${track.artist}` : ''}
            >
              {isError ? '(资源加载失败)' : (track.name ? `${track.name} - ${track.artist}` : '🎵 灵动岛播放器')}
            </div>
            <div className="di-progress">
              <div
                className="di-progress-bar"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* 控制按钮 */}
          <div
            className="di-controls"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`di-btn ${lrcVisible ? 'di-btn-active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLrc();
              }}
              aria-label={lrcVisible ? 'Hide Lyrics' : 'Show Lyrics'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className="di-btn"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="di-btn"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicIslandPlayer;