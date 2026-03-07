<template>
  <div class="di-inline-audio" :class="className">
    <div
      class="di-audio-card"
      :class="{ 'di-dark': isDark }"
      @click="handlePlay"
    >
      <!-- 封面/唱片 -->
      <div class="di-audio-cover">
        <div
          class="di-cover-bg"
          :class="{ 'di-playing': isPlaying }"
          :style="{ backgroundImage: `url(${cover})` }"
        ></div>
        <div class="di-play-center">
          <svg v-if="isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5H10V19H7V5Z" />
            <path d="M14 5H17V19H14V5Z" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 1px;">
            <path d="M8 5V19L19 12L8 5Z" />
          </svg>
        </div>
      </div>

      <!-- 文字信息 -->
      <div class="di-audio-info">
        <div class="di-audio-title">
          {{ title }}
        </div>
        <div class="di-audio-artist">
          {{ isPlaying ? '🎵 正在播放...' : (artist || '🎵 点击播放') }}
        </div>
      </div>

      <!-- 装饰波形 -->
      <div v-if="isPlaying" class="di-waveform">
        <div
          v-for="(h, i) in [1, 2, 3, 2, 1]"
          :key="i"
          class="di-wave-bar"
          :style="{ animationDelay: `${i * 0.1}s` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'InlineAudio',
  props: {
    className: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: '文章音频'
    },
    artist: {
      type: String,
      default: '文章音频'
    },
    cover: {
      type: String,
      default: '/avatar.png'
    },
    lrc: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isPlaying = ref(false);
    const isDark = ref(false);
    let syncInterval = null;

    const handlePlay = (e) => {
      e.preventDefault();
      const ap = window.__APLAYER__;
      if (!ap || !props.url) return;

      const currentIndex = ap.list.index;
      const isCurrent = ap.list.audios[currentIndex]?.url === props.url;

      if (isCurrent) {
        if (ap.audio.paused) {
          ap.play();
        } else {
          ap.pause();
        }
      } else {
        const existIndex = ap.list.audios.findIndex(a => a.url === props.url);
        if (existIndex > -1) {
          ap.list.switch(existIndex);
        } else {
          ap.list.add([{
            name: props.title,
            artist: props.artist,
            url: props.url,
            cover: props.cover,
            lrc: props.lrc
          }]);
          ap.list.switch(ap.list.audios.length - 1);
        }
        ap.play();
      }
    };

    const syncStatus = () => {
      const ap = window.__APLAYER__;
      if (ap && ap.audio) {
        isPlaying.value = !ap.audio.paused && ap.list.audios[ap.list.index]?.url === props.url;
      }
    };

    onMounted(() => {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        isDark.value = e.matches;
      };
      mediaQuery.addEventListener('change', handleChange);

      // 监听全局播放器状态
      syncInterval = setInterval(() => {
        if (window.__APLAYER__) {
          window.__APLAYER__.on('play', syncStatus);
          window.__APLAYER__.on('pause', syncStatus);
          window.__APLAYER__.on('listswitch', syncStatus);
          clearInterval(syncInterval);
          syncStatus();
        }
      }, 500);

      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange);
        if (syncInterval) {
          clearInterval(syncInterval);
        }
        if (window.__APLAYER__) {
          window.__APLAYER__.off('play', syncStatus);
          window.__APLAYER__.off('pause', syncStatus);
          window.__APLAYER__.off('listswitch', syncStatus);
        }
      });
    });

    return {
      isPlaying,
      isDark,
      handlePlay,
      syncStatus
    };
  }
};
</script>

<style scoped>
.di-inline-audio {
  margin: 16px 0;
}

.di-audio-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  margin: 0 auto;
}

.di-audio-card:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.di-audio-card:active {
  transform: scale(0.98);
}

.di-audio-card.di-dark {
  border-color: rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.di-audio-card.di-dark:hover {
  background: rgba(255, 255, 255, 0.15);
}

.di-audio-cover {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

.di-cover-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  animation: none;
}

.di-cover-bg.di-playing {
  animation: spin-slow 12s linear infinite;
}

.di-play-center {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
}

.di-audio-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.di-audio-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.di-dark .di-audio-title {
  color: white;
}

.di-audio-artist {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.di-dark .di-audio-artist {
  color: rgba(255, 255, 255, 0.7);
}

.di-waveform {
  display: flex;
  gap: 2px;
  align-items: center;
  padding-right: 16px;
  height: 20px;
}

.di-wave-bar {
  width: 3px;
  background: #3b82f6;
  animation: islandWaveform 0.6s ease-in-out infinite alternate;
  transform-origin: bottom;
}

.di-wave-bar:nth-child(1) { height: 30%; }
.di-wave-bar:nth-child(2) { height: 60%; }
.di-wave-bar:nth-child(3) { height: 100%; }
.di-wave-bar:nth-child(4) { height: 60%; }
.di-wave-bar:nth-child(5) { height: 30%; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes islandWaveform {
  from { transform: scaleY(0.3); }
  to { transform: scaleY(1); }
}

@media (max-width: 768px) {
  .di-audio-card {
    padding: 10px;
    gap: 12px;
  }

  .di-audio-cover {
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }

  .di-audio-title {
    font-size: 14px;
  }

  .di-audio-artist {
    font-size: 12px;
  }
}
</style>