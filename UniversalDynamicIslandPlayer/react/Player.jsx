import React, { useEffect, useRef, useState } from 'react';
import './Player.css';

const Player = ({ audio = [], autoPlay = false, onPlayerReady }) => {
  const [player, setPlayer] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      try {
        // 动态加载APlayer
        await loadAPlayerResources();

        if (!window.APlayer || !isMounted) return;

        const ap = new window.APlayer({
          container: containerRef.current,
          fixed: false,
          mini: false,
          autoplay: autoPlay,
          order: 'random',
          lrcType: 3,
          audio: audio
        });

        if (isMounted) {
          setPlayer(ap);
          window.__APLAYER__ = ap;
          onPlayerReady?.(ap);
        }

        return () => {
          try {
            ap.destroy();
            if (window.__APLAYER__ === ap) {
              window.__APLAYER__ = undefined;
            }
          } catch (e) {
            console.error('播放器销毁失败:', e);
          }
        };
      } catch (error) {
        console.error('播放器初始化失败:', error);
      }
    };

    const loadAPlayerResources = () => {
      if (window.APlayer) return Promise.resolve();

      return new Promise((resolve, reject) => {
        // 加载CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css';
        document.head.appendChild(link);

        // 加载JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const cleanup = initPlayer();

    return () => {
      isMounted = false;
      if (cleanup) {
        try {
          cleanup();
        } catch (e) {
          console.error('清理失败:', e);
        }
      }
    };
  }, [audio, autoPlay, onPlayerReady]);

  return (
    <div className="di-player-engine">
      <div ref={containerRef} />
    </div>
  );
};

export default Player;