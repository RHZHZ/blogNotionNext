/**
 * 灵动岛播放器 - 原生JavaScript版本
 * 适用于任何网站或框架
 */

class DynamicIslandPlayer {
  constructor(options = {}) {
    this.options = {
      position: options.position || 'bottom-left',
      autoPlay: options.autoPlay || false,
      lrcType: options.lrcType || 3,
      ...options
    };

    this.player = null;
    this.isPlaying = false;
    this.isExpanded = false;
    this.currentTrack = null;
    this.isDark = false;
    this.showLrc = false;
    this.danmakus = [];

    this.init();
  }

  async init() {
    // 检测暗色模式
    this.checkDarkMode();

    // 创建播放器容器
    this.createPlayerContainer();

    // 加载APlayer
    await this.loadAPlayer();

    // 初始化APlayer实例
    this.initAPlayer();

    // 绑定事件
    this.bindEvents();

    console.log('🎵 灵动岛播放器初始化完成');
  }

  checkDarkMode() {
    this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.isDark = e.matches;
      this.updateTheme();
    });
  }

  createPlayerContainer() {
    // 移除已存在的播放器
    const existing = document.getElementById('dynamic-island-player');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.id = 'dynamic-island-player';
    container.innerHTML = `
      <!-- 弹幕歌词层 -->
      <div id="di-danmaku-host" style="display: none;">
        ${this.renderDanmakus()}
      </div>

      <!-- 主播放器 -->
      <div class="di-player-container" data-expanded="false">
        <div class="di-player-main">
          <!-- 封面 -->
          <div class="di-cover">
            <div class="di-cover-image"></div>
            <button class="di-play-btn">
              <svg class="di-play-icon" viewBox="0 0 24 24">
                <path d="M8 5V19L19 12L8 5Z"/>
              </svg>
              <svg class="di-pause-icon" viewBox="0 0 24 24" style="display: none;">
                <path d="M7 5H10V19H7V5Z"/>
                <path d="M14 5H17V19H14V5Z"/>
              </svg>
            </button>
          </div>

          <!-- 信息区 -->
          <div class="di-info">
            <div class="di-title">🎵 灵动岛播放器</div>
            <div class="di-progress">
              <div class="di-progress-bar"></div>
            </div>
          </div>

          <!-- 控制按钮 -->
          <div class="di-controls">
            <button class="di-btn di-lrc-btn" title="歌词">
              <svg viewBox="0 0 24 24">
                <path d="M4 7H20M4 12H16M4 17H20" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="di-btn di-prev-btn" title="上一首">
              <svg viewBox="0 0 24 24">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="di-btn di-next-btn" title="下一首">
              <svg viewBox="0 0 24 24">
                <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 隐藏的APlayer -->
        <div id="aplayer-engine" style="display: none;"></div>
      </div>
    `;

    // 添加样式
    this.addStyles();

    document.body.appendChild(container);
  }

  renderDanmakus() {
    return this.danmakus.map(d => `
      <div class="di-danmaku" data-key="${d.key}" style="top: ${d.lane * 40}px">
        ${d.text}
      </div>
    `).join('');
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .di-player-container {
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 200;
        pointer-events: auto;
        transition: all 0.3s ease;
      }

      .di-player-main {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        overflow: hidden;
        border: 1px solid rgba(0,0,0,0.06);
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(16px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        transition: all 420ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
      }

      .di-player-container[data-expanded="true"] .di-player-main {
        width: 320px;
      }

      .di-cover {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
      }

      .di-cover-image {
        width: 100%;
        height: 100%;
        background: #eee;
        background-size: cover;
        animation: none;
      }

      .di-player-container[data-playing="true"] .di-cover-image {
        animation: islandSpin 18s linear infinite;
      }

      .di-play-btn {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.18);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .di-info {
        flex: 1;
        min-width: 0;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 220ms ease;
      }

      .di-player-container[data-expanded="true"] .di-info {
        opacity: 1;
        transform: translateX(0);
      }

      .di-title {
        font-size: 14px;
        font-weight: 700;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .di-progress {
        margin-top: 6px;
        height: 3px;
        border-radius: 2px;
        background: rgba(0,0,0,0.08);
        overflow: hidden;
      }

      .di-progress-bar {
        height: 100%;
        background: rgba(0,0,0,0.45);
        transition: width 160ms linear;
      }

      .di-controls {
        display: none;
        align-items: center;
        gap: 8px;
      }

      .di-player-container[data-expanded="true"] .di-controls {
        display: flex;
      }

      .di-btn {
        width: 34px;
        height: 34px;
        border-radius: 17px;
        border: 1px solid rgba(0,0,0,0.06);
        background: rgba(255,255,255,0.4);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* 暗色模式 */
      @media (prefers-color-scheme: dark) {
        .di-player-main {
          border-color: rgba(255,255,255,0.10);
          background: rgba(24, 23, 29, 0.72);
          box-shadow: 0 10px 28px rgba(0,0,0,0.35);
        }

        .di-progress {
          background: rgba(255,255,255,0.12);
        }

        .di-progress-bar {
          background: rgba(255,255,255,0.55);
        }

        .di-btn {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08);
        }
      }

      @keyframes islandSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* 弹幕样式 */
      #di-danmaku-host {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 100px;
        height: 80px;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
      }

      .di-danmaku {
        position: absolute;
        left: 100%;
        white-space: nowrap;
        font-size: 18px;
        font-weight: 600;
        color: rgba(0,0,0,0.85);
        text-shadow: 0 0 12px rgba(255,255,255,0.9);
        padding: 4px 15px;
        animation: diDanmakuMove 8.5s linear forwards;
      }

      @media (prefers-color-scheme: dark) {
        .di-danmaku {
          color: rgba(255,255,255,0.95);
          text-shadow: 0 0 12px rgba(0,0,0,0.8);
        }
      }

      @keyframes diDanmakuMove {
        from { transform: translateX(0); }
        to { transform: translateX(-120vw); }
      }
    `;

    document.head.appendChild(style);
  }

  async loadAPlayer() {
    if (window.APlayer) return;

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
  }

  initAPlayer() {
    const container = document.getElementById('aplayer-engine');
    if (!container) return;

    this.player = new window.APlayer({
      container: container,
      fixed: false,
      mini: false,
      autoplay: this.options.autoPlay,
      order: 'random',
      lrcType: this.options.lrcType,
      audio: this.options.audio || []
    });

    // 暴露到全局
    window.__APPLAYER__ = this.player;

    // 绑定APlayer事件
    this.bindAPlayerEvents();
  }

  bindAPlayerEvents() {
    if (!this.player) return;

    this.player.on('play', () => this.updatePlayState(true));
    this.player.on('pause', () => this.updatePlayState(false));
    this.player.on('timeupdate', () => this.updateProgress());
    this.player.on('listswitch', () => this.updateTrackInfo());
  }

  bindEvents() {
    const container = document.querySelector('.di-player-container');
    const playBtn = document.querySelector('.di-play-btn');
    const lrcBtn = document.querySelector('.di-lrc-btn');
    const prevBtn = document.querySelector('.di-prev-btn');
    const nextBtn = document.querySelector('.di-next-btn');

    // 鼠标悬停展开
    container.addEventListener('mouseenter', () => this.expand());
    container.addEventListener('mouseleave', () => this.collapse());
    container.addEventListener('click', () => this.toggleExpand());

    // 播放控制
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlay();
    });

    lrcBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLrc();
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });
  }

  // 公共API方法
  expand() {
    const container = document.querySelector('.di-player-container');
    container.setAttribute('data-expanded', 'true');
  }

  collapse() {
    const container = document.querySelector('.di-player-container');
    container.setAttribute('data-expanded', 'false');
  }

  toggleExpand() {
    const container = document.querySelector('.di-player-container');
    const expanded = container.getAttribute('data-expanded') === 'true';
    container.setAttribute('data-expanded', !expanded);
  }

  togglePlay() {
    if (!this.player) return;
    this.player.toggle();
  }

  updatePlayState(playing) {
    this.isPlaying = playing;
    const container = document.querySelector('.di-player-container');
    container.setAttribute('data-playing', playing);

    const playIcon = document.querySelector('.di-play-icon');
    const pauseIcon = document.querySelector('.di-pause-icon');

    if (playing) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  updateProgress() {
    if (!this.player) return;

    const progress = this.player.audio.currentTime / this.player.audio.duration;
    const progressBar = document.querySelector('.di-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
    }
  }

  updateTrackInfo() {
    if (!this.player) return;

    const track = this.player.list.audios[this.player.list.index];
    if (!track) return;

    this.currentTrack = track;

    // 更新封面
    const coverImage = document.querySelector('.di-cover-image');
    if (coverImage && track.cover) {
      coverImage.style.backgroundImage = `url(${track.cover})`;
    }

    // 更新标题
    const titleEl = document.querySelector('.di-title');
    if (titleEl) {
      titleEl.textContent = `${track.name} - ${track.artist}`.trim();
    }
  }

  updateTheme() {
    // 主题更新逻辑
    const danmakuHost = document.getElementById('di-danmaku-host');
    if (danmakuHost) {
      danmakuHost.style.display = this.showLrc ? 'block' : 'none';
    }
  }

  toggleLrc() {
    this.showLrc = !this.showLrc;
    const danmakuHost = document.getElementById('di-danmaku-host');
    if (danmakuHost) {
      danmakuHost.style.display = this.showLrc ? 'block' : 'none';
    }
  }

  prev() {
    if (!this.player) return;
    this.player.skipBack();
  }

  next() {
    if (!this.player) return;
    this.player.skipForward();
  }

  // 歌词处理
  parseLrc(lrcStr) {
    if (!lrcStr) return [];

    const lines = lrcStr.split('\n');
    const result = [];
    const timeReg = /\[(\d+):(\d+)(?:\.(\d+))?\]/;

    lines.forEach(line => {
      const match = timeReg.exec(line);
      if (!match) return;

      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const frac = match[3] ? match[3] : '0';
      const time = min * 60 + sec + (frac.length >= 3 ? parseInt(frac) / 1000 : parseInt(frac) / 100);

      const text = line.replace(timeReg, '').trim();
      if (text) result.push({ time, text });
    });

    return result.sort((a, b) => a.time - b.time);
  }

  // 弹幕处理
  addDanmaku(text, lane) {
    const key = Date.now() + Math.random();
    this.danmakus.push({ key, text, lane });

    setTimeout(() => {
      this.danmakus = this.danmakus.filter(d => d.key !== key);
    }, 10000);

    this.renderDanmakus();
  }

  renderDanmakus() {
    const host = document.getElementById('di-danmaku-host');
    if (!host) return;

    host.innerHTML = this.renderDanmakus();
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicIslandPlayer;
} else if (typeof window !== 'undefined') {
  window.DynamicIslandPlayer = DynamicIslandPlayer;
}