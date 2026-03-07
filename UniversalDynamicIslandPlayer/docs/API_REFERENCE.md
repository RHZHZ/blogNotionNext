# 📚 灵动岛播放器 API 参考手册

## 🔧 构造函数

### `DynamicIslandPlayer(options)`

创建一个新的灵动岛播放器实例。

**参数：**
```typescript
interface PlayerOptions {
  // 音频列表
  audio?: AudioItem[];

  // 自动播放
  autoPlay?: boolean;

  // 初始显示歌词
  showLrc?: boolean;

  // 播放器位置
  position?: 'bottom-left' | 'bottom-right';

  // 歌词类型
  lrcType?: number;

  // 自定义类名
  className?: string;
}

interface AudioItem {
  name: string;      // 歌曲名称
  artist: string;    // 歌手
  url: string;       // 音频URL
  cover?: string;    // 封面图片URL
  lrc?: string;      // 歌词内容
}
```

**示例：**
```javascript
const player = new DynamicIslandPlayer({
  audio: [
    {
      name: '夜曲',
      artist: '周杰伦',
      url: 'https://example.com/audio.mp3',
      cover: 'https://example.com/cover.jpg',
      lrc: '[00:00.00] 歌词内容...'
    }
  ],
  autoPlay: false,
  showLrc: true,
  position: 'bottom-left'
});
```

## 🎛️ 控制方法

### `expand()`
展开灵动岛播放器，显示完整控制界面。

**示例：**
```javascript
player.expand();
```

### `collapse()`
收起灵动岛播放器，回到紧凑模式。

**示例：**
```javascript
player.collapse();
```

### `toggleExpand()`
切换灵动岛的展开/收起状态。

**示例：**
```javascript
player.toggleExpand();
```

### `togglePlay()`
切换播放/暂停状态。

**示例：**
```javascript
player.togglePlay();
```

### `play()`
开始播放当前音频。

**示例：**
```javascript
player.play();
```

### `pause()`
暂停当前音频播放。

**示例：**
```javascript
player.pause();
```

### `next()`
播放下一首音频。

**示例：**
```javascript
player.next();
```

### `prev()`
播放上一首音频。

**示例：**
```javascript
player.prev();
```

### `toggleLrc()`
切换歌词显示状态。

**示例：**
```javascript
player.toggleLrc();
```

### `setVolume(volume)`
设置音量。

**参数：**
- `volume` (number): 音量值，范围 0-1

**示例：**
```javascript
player.setVolume(0.8); // 设置音量为80%
```

### `seek(time)`
跳转到指定播放时间。

**参数：**
- `time` (number): 时间点（秒）

**示例：**
```javascript
player.seek(60); // 跳转到第60秒
```

### `switchTrack(index)`
切换到指定索引的音频。

**参数：**
- `index` (number): 音频索引

**示例：**
```javascript
player.switchTrack(2); // 切换到第三首音频
```

### `addTrack(track, index)`
添加音频到播放列表。

**参数：**
- `track` (AudioItem): 音频对象
- `index` (number, optional): 插入位置，默认为末尾

**示例：**
```javascript
player.addTrack({
  name: '新歌曲',
  artist: '新歌手',
  url: 'https://example.com/new-audio.mp3'
});
```

### `removeTrack(index)`
从播放列表移除音频。

**参数：**
- `index` (number): 要移除的音频索引

**示例：**
```javascript
player.removeTrack(1); // 移除第二首音频
```

### `clearPlaylist()`
清空播放列表。

**示例：**
```javascript
player.clearPlaylist();
```

## 📊 获取方法

### `getCurrentTrack()`
获取当前播放的音频信息。

**返回值：** `AudioItem | null`

**示例：**
```javascript
const track = player.getCurrentTrack();
console.log(track.name); // 当前歌曲名称
```

### `getCurrentTime()`
获取当前播放时间。

**返回值：** `number` (秒)

**示例：**
```javascript
const time = player.getCurrentTime();
console.log(`当前播放时间: ${time}秒`);
```

### `getDuration()`
获取当前音频总时长。

**返回值：** `number` (秒)

**示例：**
```javascript
const duration = player.getDuration();
console.log(`音频总时长: ${duration}秒`);
```

### `getVolume()`
获取当前音量。

**返回值：** `number` (0-1)

**示例：**
```javascript
const volume = player.getVolume();
console.log(`当前音量: ${volume * 100}%`);
```

### `getPlaylist()`
获取播放列表。

**返回值：** `AudioItem[]`

**示例：**
```javascript
const playlist = player.getPlaylist();
console.log(`播放列表有 ${playlist.length} 首歌曲`);
```

### `isPlaying()`
检查是否正在播放。

**返回值：** `boolean`

**示例：**
```javascript
if (player.isPlaying()) {
  console.log('正在播放中...');
}
```

### `isDarkMode()`
检查是否处于暗色模式。

**返回值：** `boolean`

**示例：**
```javascript
if (player.isDarkMode()) {
  console.log('当前为暗色模式');
}
```

## 🎯 事件系统

### `on(event, callback)`
监听播放器事件。

**可用事件：**
- `play` - 开始播放时触发
- `pause` - 暂停播放时触发
- `ended` - 播放结束时触发
- `timeupdate` - 播放时间更新时触发
- `volumechange` - 音量改变时触发
- `trackchange` - 切换歌曲时触发
- `error` - 发生错误时触发
- `ready` - 播放器准备就绪时触发

**参数：**
- `event` (string): 事件名称
- `callback` (Function): 回调函数

**示例：**
```javascript
player.on('play', () => {
  console.log('开始播放');
});

player.on('timeupdate', (currentTime) => {
  console.log(`当前时间: ${currentTime}`);
});

player.on('error', (error) => {
  console.error('播放错误:', error);
});
```

### `off(event, callback)`
取消监听事件。

**参数：**
- `event` (string): 事件名称
- `callback` (Function): 回调函数

**示例：**
```javascript
const handlePlay = () => {
  console.log('开始播放');
};

player.on('play', handlePlay);
player.off('play', handlePlay); // 取消监听
```

### `once(event, callback)`
监听事件，但只触发一次。

**参数：**
- `event` (string): 事件名称
- `callback` (Function): 回调函数

**示例：**
```javascript
player.once('ready', () => {
  console.log('播放器首次准备就绪');
});
```

## 🎨 样式控制

### `setTheme(theme)`
设置主题。

**参数：**
- `theme` (string): 'light' | 'dark' | 'auto'

**示例：**
```javascript
player.setTheme('dark'); // 强制暗色模式
player.setTheme('light'); // 强制亮色模式
player.setTheme('auto'); // 自动模式（默认）
```

### `addCustomStyle(css)`
添加自定义CSS样式。

**参数：**
- `css` (string): CSS样式字符串

**示例：**
```javascript
player.addCustomStyle(`
  .di-player-main {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
`);
```

### `removeCustomStyle()`
移除所有自定义样式。

**示例：**
```javascript
player.removeCustomStyle();
```

## 🛠️ 工具方法

### `parseLrc(lrcString)`
解析LRC歌词字符串。

**参数：**
- `lrcString` (string): LRC格式的歌词字符串

**返回值：** `Array<{time: number, text: string}>`

**示例：**
```javascript
const lrc = `[00:00.00] 第一句歌词
[00:02.50] 第二句歌词`;

const parsed = player.parseLrc(lrc);
console.log(parsed);
// 输出: [{time: 0, text: '第一句歌词'}, {time: 2.5, text: '第二句歌词'}]
```

### `formatTime(seconds)`
格式化时间为 mm:ss 格式。

**参数：**
- `seconds` (number): 秒数

**返回值：** `string`

**示例：**
```javascript
const time = player.formatTime(125);
console.log(time); // 输出: "02:05"
```

### `destroy()`
销毁播放器实例，释放资源。

**示例：**
```javascript
player.destroy();
```

## 📡 全局访问

### `window.__APLAYER__`
APlayer引擎的原始实例，可用于访问底层功能。

**示例：**
```javascript
const ap = window.__APLAYER__;
if (ap) {
  console.log('APlayer版本:', ap.version);
}
```

## 🔌 静态方法

### `DynamicIslandPlayer.version`
获取播放器版本号。

**示例：**
```javascript
console.log('灵动岛播放器版本:', DynamicIslandPlayer.version);
```

### `DynamicIslandPlayer.defaultOptions`
获取默认配置选项。

**示例：**
```javascript
console.log('默认配置:', DynamicIslandPlayer.defaultOptions);
```

### `DynamicIslandPlayer.util`
工具函数集合。

**示例：**
```javascript
// 格式化时间
const time = DynamicIslandPlayer.util.formatTime(125);

// 生成唯一ID
const id = DynamicIslandPlayer.util.generateId();
```

## 📝 类型定义

### `PlayerEvents`
播放器事件类型定义：
```typescript
interface PlayerEvents {
  play: () => void;
  pause: () => void;
  ended: () => void;
  timeupdate: (currentTime: number) => void;
  volumechange: (volume: number) => void;
  trackchange: (track: AudioItem, index: number) => void;
  error: (error: Error) => void;
  ready: () => void;
}
```

### `AudioItem`
音频项类型定义：
```typescript
interface AudioItem {
  name: string;
  artist: string;
  url: string;
  cover?: string;
  lrc?: string;
  duration?: number;
  album?: string;
}
```

## 🚨 错误处理

### 错误码
- `INVALID_AUDIO_URL` - 音频URL无效
- `NETWORK_ERROR` - 网络请求失败
- `DECODE_ERROR` - 音频解码失败
- `TIMEOUT_ERROR` - 请求超时
- `UNKNOWN_ERROR` - 未知错误

### 错误处理示例
```javascript
player.on('error', (error) => {
  switch (error.code) {
    case 'INVALID_AUDIO_URL':
      console.error('音频URL无效，请检查地址');
      break;
    case 'NETWORK_ERROR':
      console.error('网络错误，请检查网络连接');
      break;
    default:
      console.error('播放错误:', error.message);
  }
});
```

## 📖 使用示例

### 完整功能示例
```javascript
// 创建播放器
const player = new DynamicIslandPlayer({
  audio: [
    {
      name: '示例歌曲',
      artist: '示例歌手',
      url: 'https://example.com/audio.mp3',
      cover: 'https://example.com/cover.jpg',
      lrc: '[00:00.00] 歌词内容...'
    }
  ]
});

// 监听事件
player.on('ready', () => {
  console.log('播放器准备就绪');
});

player.on('play', () => {
  console.log('开始播放');
});

player.on('timeupdate', (time) => {
  console.log(`当前播放时间: ${player.formatTime(time)}`);
});

// 控制播放器
document.getElementById('play-btn').addEventListener('click', () => {
  player.togglePlay();
});

document.getElementById('next-btn').addEventListener('click', () => {
  player.next();
});

// 添加新歌曲
document.getElementById('add-btn').addEventListener('click', () => {
  player.addTrack({
    name: '新歌曲',
    artist: '新歌手',
    url: 'https://example.com/new-audio.mp3'
  });
});
```

# 文档结束