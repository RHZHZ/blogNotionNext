<template>
  <div class="di-player-engine">
    <div ref="containerRef"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';

export default {
  name: 'Player',
  props: {
    audio: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    onPlayerReady: {
      type: Function,
      default: () => {}
    }
  },
  emits: ['player-ready'],
  setup(props, { emit }) {
    const containerRef = ref(null);
    const player = ref(null);
    const isMounted = ref(false);

    const initPlayer = async () => {
      if (!isMounted.value) return;

      try {
        await loadAPlayerResources();

        if (!window.APlayer) {
          console.error('APlayer加载失败');
          return;
        }

        const ap = new window.APlayer({
          container: containerRef.value,
          fixed: false,
          mini: false,
          autoplay: props.autoPlay,
          order: 'random',
          lrcType: 3,
          audio: props.audio
        });

        player.value = ap;
        window.__APLAYER__ = ap;
        emit('player-ready', ap);

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

    onMounted(() => {
      isMounted.value = true;
      initPlayer();
    });

    onUnmounted(() => {
      isMounted.value = false;
      if (player.value) {
        try {
          player.value.destroy();
          if (window.__APLAYER__ === player.value) {
            window.__APLAYER__ = undefined;
          }
        } catch (e) {
          console.error('播放器销毁失败:', e);
        }
      }
    });

    watch(() => props.audio, (newAudio) => {
      if (player.value && Array.isArray(newAudio)) {
        player.value.list.clear();
        player.value.list.add(newAudio);
      }
    }, { deep: true });

    return {
      containerRef
    };
  }
};
</script>

<style scoped>
.di-player-engine {
  display: none;
}
</style>