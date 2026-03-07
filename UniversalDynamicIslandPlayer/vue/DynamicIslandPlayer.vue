<template>
  <div>
    <!-- 音乐引擎 -->
    <Player
      :audio="audio"
      :auto-play="autoPlay"
      @player-ready="handlePlayerReady"
    />

    <!-- 弹幕歌词层 -->
    <div
      v-if="lrcVisible"
      ref="danmakuHostRef"
      class="di-danmaku-host"
    >
      <div
        v-for="d in danmakus"
        :key="d.key"
        class="di-danmaku"
        :style="getDanmakuStyle(d)"
      >
        {{ d.text }}
      </div>
    </div>

    <!-- 主播放器 -->
    <div
      class="di-player-container"
      :class="[className, { 'di-mobile': mobile }]"
      :style="containerStyle"
      @mouseenter="expand"
      @mouseleave="collapse"
      @click="toggleExpand"
      :data-expanded="expanded"
      :data-playing="isPlaying"
      :data-loading="isLoading"
      :data-error="isError"
    >
      <div class="di-player-main">
        <!-- 封面/唱片 -->
        <div class="di-cover">
          <div
            class="di-cover-image"
            :style="{ backgroundImage: track.cover ? `url(${track.cover})` : 'none' }"
          ></div>

          <button
            class="di-play-btn"
            @click.stop="togglePlay"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
          >
            <svg v-if="isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5H10V19H7V5Z" />
              <path d="M14 5H17V19H14V5Z" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 1px;">
              <path d="M8 5V19L19 12L8 5Z" />
            </svg>
          </button>
        </div>

        <!-- 信息区 -->
        <div class="di-info">
          <div
            class="di-title"
            :title="track.name ? `${track.name} - ${track.artist}` : ''"
          >
            {{ isError ? '(资源加载失败)' : (track.name ? `${track.name} - ${track.artist}` : '🎵 灵动岛播放器') }}
          </div>
          <div class="di-progress">
            <div
              class="di-progress-bar"
              :style="{ width: `${progressPct}%` }"
            ></div>
          </div>
        </div>

        <!-- 控制按钮 -->
        <div class="di-controls" @click.stop>
          <button
            class="di-btn"
            :class="{ 'di-btn-active': lrcVisible }"
            @click="toggleLrc"
            aria-label="Lyrics"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M4 17H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button
            class="di-btn"
            @click="prev"
            aria-label="Previous"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            class="di-btn"
            @click="next"
            aria-label="Next"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Player from './Player.vue';

export default {
  name: 'DynamicIslandPlayer',
  components: {
    Player
  },
  props: {
    className: {
      type: String,
      default: ''
    },
    audio: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    showLrc: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'bottom-left'
    },
    mobile: {
      type: [Boolean, Object],
      default: false
    }
  },
  emits: ['player-ready'],
  setup(props, { emit }) {
    const ap = ref(null);
    const expanded = ref(false);
    const isPlaying = ref(false);
    const isLoading = ref(false);
    const isError = ref(false);
    const track = ref({
      name: '',
      artist: '',
      cover: ''
    });
    const progress = ref({ current: 0, duration: 0 });
    const isDark = ref(false);
    const lrcVisible = ref(props.showLrc);
    const danmakus = ref([]);

    const danmakuKeyRef = ref(0);
    const lastLrcIdxRef = ref(-1);
    const lastTrackKeyRef = ref('');
    const lrcListRef = ref([]);
    const danmakuLaneUntilRef = ref([]);
    const danmakuHostRef = ref(null);
    const mountedRef = ref(false);

    // 弹幕配置
    const DANMAKU_CONFIG = {
      lanes: 2,
      laneHeight: 40,
      durationMs: 8500,
      safeGapPx: 24,
      fontSize: 18,
      fontWeight: 600
    };

    const containerStyle = computed(() => ({
      position: 'fixed',
      left: props.position === 'bottom-left' ? '20px' : 'auto',
      right: props.position === 'bottom-right' ? '20px' : 'auto',
      bottom: '20px',
      zIndex: 200,
      pointerEvents: 'auto'
    }));

    const progressPct = computed(() => {
      if (progress.value.duration > 0) {
        return Math.min(100, Math.max(0, (progress.value.current / progress.value.duration) * 100));
      }
      return 0;
    });

    const getDanmakuStyle = (danmaku) => ({
      top: `${danmaku.lane * DANMAKU_CONFIG.laneHeight}px`,
      fontSize: `${DANMAKU_CONFIG.fontSize}px`,
      fontWeight: DANMAKU_CONFIG.fontWeight,
      color: isDark.value ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)',
      textShadow: isDark.value
        ? '0 0 12px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,1)'
        : '0 0 12px rgba(255,255,255,0.9), 0 0 4px rgba(255,255,255,1)',
      padding: '4px 15px',
      borderRadius: 12,
      background: isDark.value ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      border: isDark.value ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)'
    });

    const handlePlayerReady = (player) => {
      ap.value = player;
      emit('player-ready', player);
    };

    const expand = () => {
      expanded.value = true;
    };

    const collapse = () => {
      expanded.value = false;
    };

    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    const togglePlay = () => {
      if (!ap.value) return;
      try {
        if (ap.value.audio?.paused) {
          ap.value.play();
        } else {
          ap.value.pause();
        }
      } catch (e) {
        console.error('播放控制失败:', e);
      }
    };

    const next = () => {
      if (!ap.value) return;
      try {
        ap.value.skipForward();
      } catch (e) {
        console.error('下一首失败:', e);
      }
    };

    const prev = () => {
      if (!ap.value) return;
      try {
        ap.value.skipBack();
      } catch (e) {
        console.error('上一首失败:', e);
      }
    };

    const toggleLrc = () => {
      lrcVisible.value = !lrcVisible.value;
    };

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
      const hostW = danmakuHostRef.value?.getBoundingClientRect?.().width ||
                    (typeof window !== 'undefined' ? window.innerWidth : 0);
      const durationMs = DANMAKU_CONFIG.durationMs;
      const speedPxPerMs = hostW > 0 ? (hostW + textWidth) / durationMs : 0;
      const neededMs = speedPxPerMs > 0 ? (textWidth + DANMAKU_CONFIG.safeGapPx) / speedPxPerMs : durationMs;

      const laneUntil = danmakuLaneUntilRef.value;

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

    onMounted(() => {
      mountedRef.value = true;
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        isDark.value = e.matches;
      };
      mediaQuery.addEventListener('change', handleChange);

      // 监听APlayer实例
      const timer = setInterval(() => {
        const inst = window.__APLAYER__;
        if (inst && mountedRef.value) {
          ap.value = inst;
          clearInterval(timer);
        }
      }, 200);

      onUnmounted(() => {
        mountedRef.value = false;
        mediaQuery.removeEventListener('change', handleChange);
        clearInterval(timer);
      });
    });

    watch([ap, lrcVisible], ([newAp, newLrcVisible]) => {
      if (!newAp) return;

      const sync = () => {
        try {
          const list = newAp.list;
          const idx = list?.index;
          const aud = list?.audios?.[idx];

          track.value = {
            name: aud?.name || '',
            artist: aud?.artist || '',
            cover: aud?.cover || ''
          };

          const trackKey = `${aud?.name || ''}|${aud?.artist || ''}|${aud?.url || ''}`;
          if (trackKey && trackKey !== lastTrackKeyRef.value) {
            lastTrackKeyRef.value = trackKey;
            lastLrcIdxRef.value = -1;
            lrcListRef.value = parseLrc(aud?.lrc || '');
            isLoading.value = true;
            isError.value = false;
          }

          const audio = newAp.audio;
          const current = audio?.currentTime || 0;
          const duration = audio?.duration || 0;

          isPlaying.value = !audio?.paused;
          progress.value = { current, duration };

          if (audio?.readyState < 2 && !audio?.paused) {
            isLoading.value = true;
          } else if (audio?.readyState >= 2) {
            isLoading.value = false;
          }

          if (newLrcVisible && !audio?.paused && lrcListRef.value?.length) {
            const nextIdx = (() => {
              const lastIdx = lastLrcIdxRef.value;
              let i = Math.max(0, lastIdx);
              while (i + 1 < lrcListRef.value.length && current >= lrcListRef.value[i + 1].time) i++;
              while (i > 0 && current < lrcListRef.value[i].time) i--;
              return i;
            })();

            if (nextIdx !== lastLrcIdxRef.value) {
              lastLrcIdxRef.value = nextIdx;
              const text = lrcListRef.value[nextIdx]?.text;
              if (text) {
                const key = ++danmakuKeyRef.value;
                const w = measureDanmakuWidth(text);
                const lane = pickDanmakuLane(w);
                danmakus.value = [...danmakus.value, { key, text, lane }].slice(-(DANMAKU_CONFIG.lanes * 2));
                setTimeout(() => {
                  danmakus.value = danmakus.value.filter(d => d.key !== key);
                }, DANMAKU_CONFIG.durationMs + 1500);
              }
            }
          }
        } catch (e) {
          console.error('同步播放状态失败:', e);
        }
      };

      const handleWaiting = () => { isLoading.value = true; };
      const handleCanPlay = () => { isLoading.value = false; };
      const handleLoadStart = () => { isLoading.value = true; };
      const handleLoadedData = () => { isLoading.value = false; };
      const handleError = () => {
        isLoading.value = false;
        isError.value = true;
      };

      sync();

      newAp.on('play', sync);
      newAp.on('pause', sync);
      newAp.on('ended', sync);
      newAp.on('timeupdate', sync);
      newAp.on('listswitch', sync);
      newAp.on('waiting', handleWaiting);
      newAp.on('canplay', handleCanPlay);
      newAp.on('loadstart', handleLoadStart);
      newAp.on('loadeddata', handleLoadedData);
      newAp.on('error', handleError);

      return () => {
        try {
          newAp.off('play', sync);
          newAp.off('pause', sync);
          newAp.off('ended', sync);
          newAp.off('timeupdate', sync);
          newAp.off('listswitch', sync);
          newAp.off('waiting', handleWaiting);
          newAp.off('canplay', handleCanPlay);
          newAp.off('loadstart', handleLoadStart);
          newAp.off('loadeddata', handleLoadedData);
          newAp.off('error', handleError);
        } catch (e) {
          console.error('解绑事件失败:', e);
        }
      };
    });

    return {
      ap,
      expanded,
      isPlaying,
      isLoading,
      isError,
      track,
      progress,
      isDark,
      lrcVisible,
      danmakus,
      danmakuHostRef,
      containerStyle,
      progressPct,
      getDanmakuStyle,
      handlePlayerReady,
      expand,
      collapse,
      toggleExpand,
      togglePlay,
      next,
      prev,
      toggleLrc,
      parseLrc
    };
  }
};
</script>

<style scoped>
/* 这里可以添加组件特定的样式 */
</style>