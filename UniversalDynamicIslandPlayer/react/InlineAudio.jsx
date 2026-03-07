import React, { useEffect, useState } from 'react';
import './InlineAudio.css';

/**
 * 文章内嵌音频播放器 - React版本
 * 可以在文章内容中嵌入音频卡片
 */
const InlineAudio = ({
  url,
  title = '文章音频',
  artist = '文章音频',
  cover = '/avatar.png',
  lrc = '',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    checkDark();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // 监听全局播放器状态
    const syncStatus = () => {
      const ap = window.__APLAYER__;
      if (ap && ap.audio) {
        setIsPlaying(!ap.audio.paused && ap.list.audios[ap.list.index]?.url === url);
      }
    };

    const apTimer = setInterval(() => {
      if (window.__APLAYER__) {
        window.__APLAYER__.on('play', syncStatus);
        window.__APLAYER__.on('pause', syncStatus);
        window.__APLAYER__.on('listswitch', syncStatus);
        clearInterval(apTimer);
        syncStatus();
      }
    }, 500);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearInterval(apTimer);
      if (window.__APLAYER__) {
        window.__APLAYER__.off('play', syncStatus);
        window.__APLAYER__.off('pause', syncStatus);
        window.__APLAYER__.off('listswitch', syncStatus);
      }
    };
  }, [url]);

  const handlePlay = (e) => {
    e.preventDefault();
    const ap = window.__APLAYER__;
    if (!ap || !url) return;

    const currentIndex = ap.list.index;
    const isCurrent = ap.list.audios[currentIndex]?.url === url;

    if (isCurrent) {
      if (ap.audio.paused) ap.play();
      else ap.pause();
    } else {
      // 检查是否在列表中
      const existIndex = ap.list.audios.findIndex(a => a.url === url);
      if (existIndex > -1) {
        ap.list.switch(existIndex);
      } else {
        ap.list.add([{
          name: title,
          artist: artist,
          url: url,
          cover: cover,
          lrc: lrc
        }]);
        ap.list.switch(ap.list.audios.length - 1);
      }
      ap.play();
    }
  };

  return (
    <div className={`di-inline-audio ${className}`}>
      <div
        className={`di-audio-card ${isDark ? 'di-dark' : ''}`}
        onClick={handlePlay}
      >
        {/* 封面/唱片 */}
        <div className="di-audio-cover">
          <div
            className={`di-cover-bg ${isPlaying ? 'di-playing' : ''}`}
            style={{ backgroundImage: `url(${cover})` }}
          />
          <div className="di-play-center">
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5H10V19H7V5Z" />
                <path d="M14 5H17V19H14V5Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
                <path d="M8 5V19L19 12L8 5Z" />
              </svg>
            )}
          </div>
        </div>

        {/* 文字信息 */}
        <div className="di-audio-info">
          <div className="di-audio-title">
            {title}
          </div>
          <div className="di-audio-artist">
            {isPlaying ? '🎵 正在播放...' : (artist || '🎵 点击播放')}
          </div>
        </div>

        {/* 装饰波形 */}
        {isPlaying && (
          <div className="di-waveform">
            {[1, 2, 3, 2, 1].map((h, i) => (
              <div
                key={i}
                className="di-wave-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineAudio;