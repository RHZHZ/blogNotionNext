# 💡 灵动岛播放器示例代码

## 🚀 基础示例

### 1. 最简单的播放器

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dynamic-island-player.css">
</head>
<body>
  <script src="dynamic-island-player.js"></script>
  <script>
    // 单首歌曲
    const player = new DynamicIslandPlayer({
      audio: [{
        name: '示例歌曲',
        artist: '示例歌手',
        url: 'https://example.com/audio.mp3'
      }]
    });
  </script>
</body>
</html>
```

### 2. 多首歌曲播放列表

```javascript
const player = new DynamicIslandPlayer({
  audio: [
    {
      name: '夜曲',
      artist: '周杰伦',
      url: 'https://example.com/night.mp3',
      cover: 'https://example.com/night-cover.jpg',
      lrc: '[00:00.00] 为你弹奏萧邦的夜曲...'
    },
    {
      name: '晴天',
      artist: '周杰伦',
      url: 'https://example.com/sunny.mp3',
      cover: 'https://example.com/sunny-cover.jpg'
    },
    {
      name: '稻香',
      artist: '周杰伦',
      url: 'https://example.com/dao-xiang.mp3',
      cover: 'https://example.com/dao-xiang-cover.jpg'
    }
  ]
});
```

### 3. 自动播放

```javascript
const player = new DynamicIslandPlayer({
  audio: [{
    name: '背景音乐',
    artist: '轻音乐',
    url: 'https://example.com/bg-music.mp3'
  }],
  autoPlay: true,  // 自动播放
  showLrc: false   // 不显示歌词
});
```

## 🎨 样式定制示例

### 1. 自定义颜色主题

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList,
  className: 'custom-player'
});

// 添加自定义样式
player.addCustomStyle(`
  .custom-player .di-player-main {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .custom-player .di-title {
    color: white;
    font-weight: bold;
  }

  .custom-player .di-btn {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .custom-player .di-progress-bar {
    background: rgba(255, 255, 255, 0.7);
  }
`);
```

### 2. 暗色主题

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList,
  theme: 'dark'
});
```

### 3. 大尺寸播放器

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList,
  size: 'large',
  className: 'large-player'
});

player.addCustomStyle(`
  .large-player .di-player-main {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }

  .large-player .di-cover {
    width: 60px;
    height: 60px;
    border-radius: 30px;
  }

  .large-player[data-expanded="true"] .di-player-main {
    width: 400px;
  }

  .large-player .di-title {
    font-size: 16px;
  }
`);
```

## 📱 移动端示例

### 1. 移动端优化配置

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList,
  mobile: {
    position: 'bottom-left',  // 左下角
    size: 'small',            // 小尺寸
    autoHide: true,           // 自动隐藏
    hideDelay: 3000           // 3秒后隐藏
  }
});
```

### 2. 响应式设计

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="dynamic-island-player.css">
  <style>
    /* 移动端适配 */
    @media (max-width: 768px) {
      .di-player-container {
        left: 15px !important;
        bottom: 15px !important;
      }
    }
  </style>
</head>
<body>
  <script src="dynamic-island-player.js"></script>
  <script>
    const player = new DynamicIslandPlayer({
      audio: audioList,
      mobile: true
    });
  </script>
</body>
</html>
```

## 🎯 事件处理示例

### 1. 基本事件监听

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 播放事件
player.on('play', () => {
  console.log('开始播放:', player.getCurrentTrack().name);
  document.title = `🎵 ${player.getCurrentTrack().name}`;
});

// 暂停事件
player.on('pause', () => {
  console.log('暂停播放');
  document.title = '网站标题';
});

// 播放结束事件
player.on('ended', () => {
  console.log('播放结束，播放下一首');
  player.next();
});

// 时间更新事件
player.on('timeupdate', (currentTime) => {
  // 更新进度条
  const progress = (currentTime / player.getDuration()) * 100;
  document.getElementById('custom-progress').style.width = progress + '%';
});

// 错误处理
player.on('error', (error) => {
  console.error('播放错误:', error.message);
  alert('播放失败，请检查网络连接');
});
```

### 2. 播放统计

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 启用播放统计
player.enableStatistics();

// 记录播放历史
const playHistory = [];

player.on('trackchange', (track, index) => {
  playHistory.push({
    track: track.name,
    artist: track.artist,
    time: new Date().toISOString(),
    timestamp: Date.now()
  });

  console.log('播放历史:', playHistory);
  localStorage.setItem('playHistory', JSON.stringify(playHistory));
});

// 获取最常播放的歌曲
function getMostPlayedTrack() {
  const trackCount = {};
  playHistory.forEach(record => {
    trackCount[record.track] = (trackCount[record.track] || 0) + 1;
  });

  return Object.entries(trackCount)
    .sort((a, b) => b[1] - a[1])[0];
}
```

### 3. 键盘快捷键

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case ' ':
      e.preventDefault();
      player.togglePlay();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      player.prev();
      break;
    case 'ArrowRight':
      e.preventDefault();
      player.next();
      break;
    case 'ArrowUp':
      e.preventDefault();
      player.setVolume(Math.min(1, player.getVolume() + 0.1));
      break;
    case 'ArrowDown':
      e.preventDefault();
      player.setVolume(Math.max(0, player.getVolume() - 0.1));
      break;
    case 'l':
      e.preventDefault();
      player.toggleLrc();
      break;
  }
});

// 显示快捷键提示
player.on('ready', () => {
  console.log('🎮 键盘快捷键:');
  console.log('空格: 播放/暂停');
  console.log('← →: 上一首/下一首');
  console.log('↑ ↓: 音量调节');
  console.log('L: 显示/隐藏歌词');
});
```

## 🔧 工具集成示例

### 1. 与后端API集成

```javascript
// 从API获取播放列表
async function loadPlaylistFromAPI() {
  try {
    const response = await fetch('/api/playlist');
    const playlist = await response.json();

    return playlist.map(item => ({
      name: item.title,
      artist: item.artist,
      url: item.audio_url,
      cover: item.cover_url,
      lrc: item.lyrics
    }));
  } catch (error) {
    console.error('加载播放列表失败:', error);
    return [];
  }
}

// 初始化播放器
async function initPlayer() {
  const audioList = await loadPlaylistFromAPI();

  const player = new DynamicIslandPlayer({
    audio: audioList,
    autoPlay: false
  });

  // 记录播放数据
  player.on('play', async () => {
    const track = player.getCurrentTrack();
    await fetch('/api/play-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track: track.name,
        artist: track.artist,
        timestamp: Date.now()
      })
    });
  });
}

initPlayer();
```

### 2. 歌词同步显示

```javascript
const player = new DynamicIslandPlayer({
  audio: [{
    name: '夜曲',
    artist: '周杰伦',
    url: 'https://example.com/night.mp3',
    lrc: `[00:00.00] 为你弹奏萧邦的夜曲
[00:02.50] 纪念我逝去的爱情
[00:05.00] 而我为你隐姓埋名
[00:07.50] 在月光下等你
[00:10.00] 故事的小黄花
[00:12.50] 从出生那年就飘着`
  }]
});

// 自定义歌词显示
player.on('timeupdate', (currentTime) => {
  const lrcList = player.parseLrc(player.getCurrentTrack().lrc);
  const currentLrc = lrcList.find((lrc, index) => {
    const nextLrc = lrcList[index + 1];
    return currentTime >= lrc.time && (!nextLrc || currentTime < nextLrc.time);
  });

  if (currentLrc) {
    document.getElementById('custom-lyrics').textContent = currentLrc.text;
  }
});
```

### 3. 音频可视化

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 启用音频可视化
player.enableVisualization({
  type: 'waveform',
  canvas: document.getElementById('visualization-canvas'),
  style: {
    color: '#667eea',
    strokeWidth: 2,
    backgroundColor: '#f5f5f7'
  }
});

// 暗色模式适配
player.on('themechange', (theme) => {
  player.updateVisualization({
    style: {
      backgroundColor: theme === 'dark' ? '#0f1115' : '#f5f5f7'
    }
  });
});
```

## 🎮 游戏化示例

### 1. 音乐游戏

```javascript
const player = new DynamicIslandPlayer({
  audio: [{
    name: '游戏BGM',
    artist: '游戏音乐',
    url: 'https://example.com/game-bgm.mp3'
  }]
});

// 游戏状态管理
const gameState = {
  isPlaying: false,
  score: 0,
  combo: 0,
  maxCombo: 0
};

// 音乐同步游戏
player.on('timeupdate', (currentTime) => {
  if (!gameState.isPlaying) return;

  // 根据音乐节拍生成音符
  const beatInterval = 0.5; // 每0.5秒一个节拍
  const beatNumber = Math.floor(currentTime / beatInterval);

  if (beatNumber > gameState.lastBeat) {
    gameState.lastBeat = beatNumber;
    createNote(beatNumber * beatInterval);
  }
});

// 创建音符
function createNote(time) {
  const note = document.createElement('div');
  note.className = 'game-note';
  note.style.left = Math.random() * 100 + '%';
  document.getElementById('game-area').appendChild(note);

  // 音符移动
  const speed = 2000; // 2秒到底部
  let position = 0;

  const animate = setInterval(() => {
    position += 100 / speed * 16; // 60fps
    note.style.top = position + '%';

    if (position >= 100) {
      clearInterval(animate);
      note.remove();
    }
  }, 16);
}
```

### 2. 音乐排行榜

```javascript
const player = new DynamicIslandPlayer({
  audio: []
});

// 模拟排行榜数据
const chartData = [
  { rank: 1, name: '夜曲', artist: '周杰伦', plays: 15200 },
  { rank: 2, name: '晴天', artist: '周杰伦', plays: 14800 },
  { rank: 3, name: '稻香', artist: '周杰伦', plays: 13500 },
  { rank: 4, name: '七里香', artist: '周杰伦', plays: 12900 },
  { rank: 5, name: '青花瓷', artist: '周杰伦', plays: 11800 }
];

// 生成播放列表
async function loadChartPlaylist() {
  const playlist = await Promise.all(
    chartData.map(async (item) => {
      const audioInfo = await fetchAudioInfo(item.name, item.artist);
      return {
        ...audioInfo,
        rank: item.rank,
        plays: item.plays
      };
    })
  );

  player.setPlaylist(playlist);
}

// 显示排行榜
function displayChart() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = chartData.map(item => `
    <div class="chart-item" onclick="playChartItem(${item.rank})">
      <span class="rank">${item.rank}</span>
      <span class="info">
        <span class="name">${item.name}</span>
        <span class="artist">${item.artist}</span>
      </span>
      <span class="plays">${item.plays.toLocaleString()}次播放</span>
    </div>
  `).join('');
}

window.playChartItem = function(rank) {
  player.switchTrack(rank - 1);
};
```

## 🌟 创意示例

### 1. ASMR播放器

```javascript
const player = new DynamicIslandPlayer({
  audio: [
    {
      name: '雨声ASMR',
      artist: '自然声音',
      url: 'https://example.com/rain.mp3',
      cover: 'https://example.com/rain-cover.jpg'
    },
    {
      name: '海浪声',
      artist: '自然声音',
      url: 'https://example.com/wave.mp3',
      cover: 'https://example.com/wave-cover.jpg'
    },
    {
      name: '森林鸟鸣',
      artist: '自然声音',
      url: 'https://example.com/birds.mp3',
      cover: 'https://example.com/birds-cover.jpg'
    }
  ],
  autoPlay: false,
  showLrc: false
});

// ASMR模式控制
const asmrMode = {
  isActive: false,
  volume: 0.5,
  timer: null
};

// 白噪音混合
function enableASMRMode() {
  asmrMode.isActive = true;
  player.setVolume(0.3); // 降低主音量

  // 添加白噪音
  const whiteNoise = document.createElement('audio');
  whiteNoise.src = 'https://example.com/white-noise.mp3';
  whiteNoise.loop = true;
  whiteNoise.volume = 0.2;
  whiteNoise.play();

  asmrMode.whiteNoise = whiteNoise;
}

function disableASMRMode() {
  asmrMode.isActive = false;
  player.setVolume(1.0);

  if (asmrMode.whiteNoise) {
    asmrMode.whiteNoise.pause();
    asmrMode.whiteNoise.remove();
  }
}
```

### 2. 播客播放器

```javascript
const player = new DynamicIslandPlayer({
  audio: [],
  lrcType: 0 // 禁用歌词
});

// 播客章节管理
const podcastChapters = [
  { title: '开场介绍', start: 0, end: 30 },
  { title: '主题讨论', start: 30, end: 600 },
  { title: '嘉宾分享', start: 600, end: 1200 },
  { title: '问答环节', start: 1200, end: 1500 },
  { title: '结束语', start: 1500, end: 1600 }
];

// 章节跳转
function jumpToChapter(chapterIndex) {
  const chapter = podcastChapters[chapterIndex];
  player.seek(chapter.start);

  // 高亮当前章节
  document.querySelectorAll('.chapter-item').forEach((item, index) => {
    item.classList.toggle('active', index === chapterIndex);
  });
}

// 自动章节切换
player.on('timeupdate', (currentTime) => {
  const currentChapter = podcastChapters.findIndex(chapter =>
    currentTime >= chapter.start && currentTime < chapter.end
  );

  if (currentChapter !== player.currentChapter) {
    player.currentChapter = currentChapter;
    updateChapterDisplay(currentChapter);
  }
});

function updateChapterDisplay(chapterIndex) {
  const chapter = podcastChapters[chapterIndex];
  if (chapter) {
    document.getElementById('chapter-title').textContent = chapter.title;
    document.getElementById('chapter-progress').textContent =
      `${player.formatTime(player.getCurrentTime())} / ${player.formatTime(chapter.end - chapter.start)}`;
  }
}
```

### 3. 音乐可视化艺术

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 创建画布
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// 设置画布大小
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 音频可视化
player.enableVisualization({
  type: 'frequency',
  canvas: canvas,
  style: {
    color: '#667eea',
    strokeWidth: 2,
    fill: true,
    gradient: true
  }
});

// 动画循环
function animate() {
  requestAnimationFrame(animate);

  if (player.isPlaying()) {
    // 获取音频数据
    const audioData = player.getAudioData();

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制音频波形
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#667eea';
    ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';

    const sliceWidth = canvas.width * 0.005;
    let x = 0;

    for (let i = 0; i < audioData.length; i++) {
      const v = audioData[i] / 128.0;
      const y = v * canvas.height * 0.5;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

animate();

// 音乐响应背景
player.on('timeupdate', () => {
  const audioData = player.getAudioData();
  const average = audioData.reduce((a, b) => a + b) / audioData.length;

  // 根据音频强度改变背景
  const intensity = average / 255;
  document.body.style.background = `
    linear-gradient(135deg,
      rgba(102, 126, 234, ${0.3 + intensity * 0.4}) 0%,
      rgba(118, 75, 162, ${0.3 + intensity * 0.4}) 100%)
  `;
});
```

## 📚 更多资源

这些示例展示了灵动岛播放器的强大功能和灵活性。你可以根据自己的需求进行组合和扩展：

- 🎵 **音乐播放器** - 创建个人音乐播放器
- 🎤 **播客应用** - 构建播客订阅和播放
- 🎮 **游戏音乐** - 游戏中的背景音乐管理
- 🎨 **创意项目** - 音乐可视化和交互艺术

更多示例和详细API请参考：
- [API参考](API_REFERENCE.md)
- [故障排除](TROUBLESHOOTING.md)

祝你使用愉快！🎵