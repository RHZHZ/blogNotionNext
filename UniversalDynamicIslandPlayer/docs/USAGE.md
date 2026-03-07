# 🎯 灵动岛播放器使用指南

## 📖 基本使用

### 1. 创建播放器实例

```javascript
// 创建播放器
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
    }
  ],
  autoPlay: false,
  showLrc: true,
  position: 'bottom-left'
});
```

### 2. 基本控制

```javascript
// 播放/暂停
player.togglePlay();

// 播放下一首
player.next();

// 播放上一首
player.prev();

// 跳转到指定时间（秒）
player.seek(60);

// 设置音量（0-1）
player.setVolume(0.8);
```

### 3. 歌词显示

```javascript
// 切换歌词显示
player.toggleLrc();

// 检查歌词是否显示
if (player.isLrcVisible()) {
  console.log('歌词正在显示');
}
```

## 🎨 高级功能

### 1. 播放列表管理

```javascript
// 获取当前播放列表
const playlist = player.getPlaylist();
console.log('播放列表:', playlist);

// 添加新歌曲
player.addTrack({
  name: '七里香',
  artist: '周杰伦',
  url: 'https://example.com/qi-li-xiang.mp3'
});

// 在指定位置插入歌曲
player.addTrack({
  name: '稻香',
  artist: '周杰伦',
  url: 'https://example.com/dao-xiang.mp3'
}, 1); // 插入到第二首

// 删除歌曲
player.removeTrack(2); // 删除第三首

// 清空播放列表
player.clearPlaylist();
```

### 2. 歌曲切换

```javascript
// 切换到指定索引的歌曲
player.switchTrack(1); // 切换到第二首

// 获取当前播放的歌曲
const currentTrack = player.getCurrentTrack();
console.log('当前歌曲:', currentTrack.name);

// 获取当前播放索引
const currentIndex = player.getCurrentIndex();
console.log('当前索引:', currentIndex);
```

### 3. 播放信息获取

```javascript
// 获取当前播放时间
const currentTime = player.getCurrentTime();
console.log('当前时间:', player.formatTime(currentTime));

// 获取音频总时长
const duration = player.getDuration();
console.log('总时长:', player.formatTime(duration));

// 获取播放进度百分比
const progress = (currentTime / duration) * 100;
console.log('播放进度:', progress + '%');

// 获取音量
const volume = player.getVolume();
console.log('当前音量:', volume * 100 + '%');
```

## 🎛️ 播放器控制

### 1. 展开/收起

```javascript
// 展开播放器
player.expand();

// 收起播放器
player.collapse();

// 切换展开状态
player.toggleExpand();

// 检查是否展开
if (player.isExpanded()) {
  console.log('播放器已展开');
}
```

### 2. 主题控制

```javascript
// 设置主题
player.setTheme('dark');      // 强制暗色模式
player.setTheme('light');     // 强制亮色模式
player.setTheme('auto');      // 自动模式（默认）

// 检查当前主题
const theme = player.getTheme();
console.log('当前主题:', theme);

// 监听主题变化
player.on('themechange', (theme) => {
  console.log('主题变化:', theme);
});
```

### 3. 位置控制

```javascript
// 设置播放器位置
player.setPosition('bottom-left');   // 左下角（默认）
player.setPosition('bottom-right');  // 右下角

// 获取当前位置
const position = player.getPosition();
console.log('播放器位置:', position);
```

## 🎯 事件系统

### 1. 基本事件监听

```javascript
// 监听播放事件
player.on('play', () => {
  console.log('开始播放');
  console.log('当前歌曲:', player.getCurrentTrack().name);
});

// 监听暂停事件
player.on('pause', () => {
  console.log('暂停播放');
});

// 监听播放结束事件
player.on('ended', () => {
  console.log('播放结束');
});

// 监听时间更新
player.on('timeupdate', (currentTime) => {
  console.log('当前时间:', player.formatTime(currentTime));
});

// 监听音量变化
player.on('volumechange', (volume) => {
  console.log('音量变化:', volume * 100 + '%');
});

// 监听歌曲切换
player.on('trackchange', (track, index) => {
  console.log('切换到歌曲:', track.name, '索引:', index);
});

// 监听错误
player.on('error', (error) => {
  console.error('播放错误:', error.message);
});
```

### 2. 事件取消

```javascript
// 定义事件处理函数
const handlePlay = () => {
  console.log('开始播放');
};

// 添加事件监听
player.on('play', handlePlay);

// 取消事件监听
player.off('play', handlePlay);
```

### 3. 一次性事件

```javascript
// 只触发一次的事件
player.once('ready', () => {
  console.log('播放器首次准备就绪');
});

// 常用于初始化
player.once('ready', () => {
  player.play(); // 自动播放
});
```

## 🎵 歌词功能

### 1. LRC歌词格式

```javascript
// LRC格式示例
const lrc = `
[00:00.00] 为你弹奏萧邦的夜曲
[00:02.50] 纪念我逝去的爱情
[00:05.00] 而我为你隐姓埋名
[00:07.50] 在月光下等你
`;

// 使用LRC歌词
const player = new DynamicIslandPlayer({
  audio: [{
    name: '夜曲',
    artist: '周杰伦',
    url: 'https://example.com/night.mp3',
    lrc: lrc
  }]
});
```

### 2. 歌词解析

```javascript
// 手动解析歌词
const parsedLrc = player.parseLrc(lrc);
console.log('解析后的歌词:', parsedLrc);

// 结果格式:
// [
//   { time: 0, text: '为你弹奏萧邦的夜曲' },
//   { time: 2.5, text: '纪念我逝去的爱情' },
//   ...
// ]
```

### 3. 歌词显示控制

```javascript
// 显示歌词
player.showLrc();

// 隐藏歌词
player.hideLrc();

// 切换歌词显示
player.toggleLrc();

// 检查歌词是否显示
if (player.isLrcVisible()) {
  console.log('歌词正在显示');
}
```

## 🎨 自定义样式

### 1. 自定义CSS

```javascript
// 添加自定义样式
player.addCustomStyle(`
  .di-player-main {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .di-title {
    color: white;
  }

  .di-btn {
    background: rgba(255, 255, 255, 0.2);
  }
`);

// 移除自定义样式
player.removeCustomStyle();
```

### 2. 自定义类名

```javascript
// 添加自定义类名
player.addClass('custom-player');

// 移除自定义类名
player.removeClass('custom-player');

// 检查是否有类名
if (player.hasClass('custom-player')) {
  console.log('包含custom-player类名');
}
```

### 3. 主题变量

```css
/* 自定义主题变量 */
:root {
  --di-primary-color: #667eea;
  --di-secondary-color: #764ba2;
  --di-text-color: #333;
  --di-bg-color: #fff;
  --di-border-radius: 18px;
  --di-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --di-text-color: #fff;
    --di-bg-color: #1a1a1a;
    --di-shadow: 0 10px 28px rgba(0,0,0,0.35);
  }
}
```

## 📱 移动端优化

### 1. 响应式配置

```javascript
const player = new DynamicIslandPlayer({
  audio: audioList,

  // 移动端配置
  mobile: {
    position: 'bottom-left',
    size: 'small',
    autoHide: true,
    hideDelay: 3000
  }
});
```

### 2. 触摸事件

```javascript
// 监听触摸事件
player.on('touchstart', (e) => {
  console.log('触摸开始:', e);
});

player.on('touchmove', (e) => {
  console.log('触摸移动:', e);
});

player.on('touchend', (e) => {
  console.log('触摸结束:', e);
});
```

### 3. 手势控制

```javascript
// 启用手势控制
player.enableGestures();

// 禁用手势控制
player.disableGestures();

// 配置手势
player.configureGestures({
  swipeLeft: () => player.next(),
  swipeRight: () => player.prev(),
  tap: () => player.togglePlay(),
  doubleTap: () => player.toggleLrc()
});
```

## 🔧 工具方法

### 1. 时间格式化

```javascript
// 格式化时间（秒 -> mm:ss）
const formatted = player.formatTime(125);
console.log(formatted); // 输出: "02:05"

// 格式化长时间（秒 -> hh:mm:ss）
const longFormatted = player.formatTimeLong(3725);
console.log(longFormatted); // 输出: "01:02:05"
```

### 2. ID生成

```javascript
// 生成唯一ID
const id = player.generateId();
console.log('生成ID:', id); // 输出: "di-player-xxxxxx"
```

### 3. 设备检测

```javascript
// 检测设备类型
const device = player.detectDevice();
console.log('设备类型:', device);
// 输出: { isMobile: true, isTablet: false, isDesktop: false }

// 检测浏览器
const browser = player.detectBrowser();
console.log('浏览器:', browser);
```

## 🌐 国际化

### 1. 设置语言

```javascript
// 设置中文
player.setLanguage('zh-CN');

// 设置英文
player.setLanguage('en-US');

// 设置繁体中文
player.setLanguage('zh-TW');

// 自动检测语言
player.setLanguage('auto');
```

### 2. 自定义语言包

```javascript
// 添加自定义语言
player.addLanguage('custom', {
  play: '播放',
  pause: '暂停',
  previous: '上一首',
  next: '下一首',
  lyrics: '歌词',
  volume: '音量',
  loading: '加载中...',
  error: '播放错误'
});

// 使用自定义语言
player.setLanguage('custom');
```

## 📊 调试和日志

### 1. 启用调试模式

```javascript
// 启用调试模式
player.enableDebug();

// 禁用调试模式
player.disableDebug();

// 检查调试模式
if (player.isDebugEnabled()) {
  console.log('调试模式已启用');
}
```

### 2. 获取播放器信息

```javascript
// 获取播放器版本
console.log('版本:', player.version);

// 获取播放器信息
const info = player.getPlayerInfo();
console.log('播放器信息:', info);

// 获取系统信息
const system = player.getSystemInfo();
console.log('系统信息:', system);
```

### 3. 性能监控

```javascript
// 开始性能监控
player.startPerformanceMonitoring();

// 停止性能监控
player.stopPerformanceMonitoring();

// 获取性能指标
const metrics = player.getPerformanceMetrics();
console.log('性能指标:', metrics);
```

## 🔄 与其他库集成

### 1. 与jQuery集成

```javascript
$(document).ready(function() {
  const player = new DynamicIslandPlayer({
    audio: audioList
  });

  // jQuery控制
  $('#play-btn').click(() => player.togglePlay());
  $('#next-btn').click(() => player.next());
  $('#prev-btn').click(() => player.prev());
});
```

### 2. 与React集成

```jsx
import React, { useState, useEffect } from 'react';
import { DynamicIslandPlayer } from 'dynamic-island-player-react';

function MusicApp() {
  const [audioList, setAudioList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // 加载音频列表
    fetchAudioList().then(setAudioList);
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <DynamicIslandPlayer
        audio={audioList}
        autoPlay={isPlaying}
      />
    </div>
  );
}
```

### 3. 与Vue集成

```vue
<template>
  <div>
    <DynamicIslandPlayer
      :audio="audioList"
      :auto-play="isPlaying"
    />
  </div>
</template>

<script>
import DynamicIslandPlayer from 'dynamic-island-player-vue';

export default {
  components: { DynamicIslandPlayer },
  data() {
    return {
      audioList: [],
      isPlaying: false
    };
  },
  mounted() {
    this.loadAudioList();
  },
  methods: {
    loadAudioList() {
      fetch('/api/audio').then(res => res.json()).then(data => {
        this.audioList = data;
      });
    }
  }
};
</script>
```

## 🚀 高级用法

### 1. 多播放器实例

```javascript
// 创建多个播放器实例
const player1 = new DynamicIslandPlayer({
  audio: playlist1,
  position: 'bottom-left'
});

const player2 = new DynamicIslandPlayer({
  audio: playlist2,
  position: 'bottom-right'
});

// 同步两个播放器
player1.on('play', () => {
  player2.pause(); // 暂停另一个播放器
});

player2.on('play', () => {
  player1.pause(); // 暂停另一个播放器
});
```

### 2. 音频可视化

```javascript
// 启用音频可视化
player.enableVisualization({
  type: 'waveform',  // waveform | frequency | oscilloscope
  canvas: document.getElementById('visualization-canvas'),
  style: {
    color: '#667eea',
    strokeWidth: 2
  }
});

// 更新可视化样式
player.updateVisualization({
  color: '#764ba2',
  strokeWidth: 3
});

// 禁用可视化
player.disableVisualization();
```

### 3. 播放统计

```javascript
// 启用播放统计
player.enableStatistics();

// 获取播放统计
const stats = player.getStatistics();
console.log('播放统计:', stats);
/*
输出:
{
  totalPlays: 150,
  totalTime: 3600,
  favoriteTrack: '夜曲',
  mostPlayedHour: 20,
  averageSession: 240
}
*/

// 导出统计数据
player.exportStatistics('json');    // JSON格式
player.exportStatistics('csv');     // CSV格式
player.exportStatistics('excel');   // Excel格式
```

## 📚 下一步学习

现在你已经掌握了灵动岛播放器的基本使用方法。建议继续学习：

- [API参考](API_REFERENCE.md) - 完整的API文档
- [示例代码](EXAMPLES.md) - 各种使用场景示例
- [故障排除](TROUBLESHOOTING.md) - 常见问题和解决方案

# 文档结束