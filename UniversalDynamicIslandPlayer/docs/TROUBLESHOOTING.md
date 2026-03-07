# 🔧 灵动岛播放器故障排除

## 🚨 常见问题及解决方案

### 1. 播放器无法初始化

**问题现象：**
- 播放器不显示
- 控制台报错：`DynamicIslandPlayer is not defined`
- 控制台报错：`APlayer is not defined`

**可能原因：**
1. 文件未正确引入
2. 依赖未正确加载
3. 初始化代码位置错误

**解决方案：**

```html
<!-- 检查文件引入顺序 -->
<!DOCTYPE html>
<html>
<head>
  <!-- CSS必须先引入 -->
  <link rel="stylesheet" href="dynamic-island-player.css">
</head>
<body>
  <!-- 确保DOM加载完成后再初始化 -->
  <script src="dynamic-island-player.js"></script>
  <script>
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
      const player = new DynamicIslandPlayer({
        audio: [{ name: '测试', url: '音频地址' }]
      });
    });
  </script>
</body>
</html>
```

**检查清单：**
- [ ] 确认CSS文件路径正确
- [ ] 确认JS文件路径正确
- [ ] 检查浏览器控制台是否有404错误
- [ ] 确保初始化代码在DOM加载后执行

### 2. 无法播放音频

**问题现象：**
- 点击播放按钮无反应
- 控制台报错：`Failed to load audio`
- 显示错误状态

**可能原因：**
1. 音频URL无效或不可访问
2. 跨域问题
3. 音频格式不支持
4. 网络问题

**解决方案：**

```javascript
// 检查音频URL
const player = new DynamicIslandPlayer({
  audio: [{
    name: '测试',
    url: 'https://example.com/audio.mp3', // 确保URL可访问
    cover: 'cover.jpg'
  }]
});

// 错误处理
player.on('error', (error) => {
  console.error('播放错误:', error);

  switch(error.code) {
    case 'INVALID_AUDIO_URL':
      console.log('解决方案：检查音频URL是否正确');
      break;
    case 'NETWORK_ERROR':
      console.log('解决方案：检查网络连接');
      break;
    case 'DECODE_ERROR':
      console.log('解决方案：检查音频格式，支持的格式：MP3, WAV, OGG');
      break;
  }
});

// 测试音频URL
async function testAudioUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      console.log('音频URL可访问');
    } else {
      console.error('音频URL不可访问:', response.status);
    }
  } catch (error) {
    console.error('网络错误:', error);
  }
}
```

**检查清单：**
- [ ] 确认音频URL正确且可访问
- [ ] 检查浏览器是否支持音频格式
- [ ] 确认没有跨域问题
- [ ] 检查网络连接

### 3. 样式问题

**问题现象：**
- 播放器样式异常
- 布局错乱
- 颜色不正确
- 暗色模式不工作

**可能原因：**
1. CSS文件未正确加载
2. 样式冲突
3. 自定义样式覆盖失败

**解决方案：**

```javascript
// 检查样式加载
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 检查主题
console.log('当前主题:', player.getTheme());

// 强制设置主题
player.setTheme('light');  // 强制亮色模式
player.setTheme('dark');   // 强制暗色模式
player.setTheme('auto');   // 自动模式

// 检查样式元素
console.log('播放器元素:', document.querySelector('.di-player-container'));

// 重置样式
player.removeCustomStyle(); // 移除所有自定义样式
```

**CSS冲突检查：**
```css
/* 在你的CSS中添加以下代码检查冲突 */
.di-player-container {
  all: initial; /* 重置所有样式 */
  * {
    all: unset; /* 重置子元素样式 */
  }
}
```

### 4. 事件不触发

**问题现象：**
- 点击按钮无反应
- 事件监听器不工作
- 控制台报错

**可能原因：**
1. 事件绑定时机错误
2. 播放器实例未正确创建
3. 事件名称错误

**解决方案：**

```javascript
// 确保在播放器初始化后绑定事件
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 正确的事件绑定
player.on('ready', () => {
  console.log('播放器准备就绪，可以绑定事件');

  // 现在可以安全地绑定事件
  player.on('play', () => console.log('播放'));
  player.on('pause', () => console.log('暂停'));
});

// 事件名称检查
// 正确的事件名称：
// play, pause, ended, timeupdate, volumechange, trackchange, error, ready

// 错误示例（事件名称错误）：
// player.on('playing', () => {});  // 错误，应该是'play'
// player.on('stop', () => {});     // 错误，应该是'pause'或'ended'
```

### 5. 歌词不显示

**问题现象：**
- 歌词功能已开启但不显示
- 歌词格式错误
- 歌词滚动不同步

**可能原因：**
1. 歌词格式不正确
2. 歌词文件路径错误
3. 时间格式解析错误

**解决方案：**

```javascript
// 检查歌词格式
const lrc = `[00:00.00] 第一句歌词
[00:02.50] 第二句歌词
[00:05.00] 第三句歌词`;

// LRC格式要求：
// 1. 时间格式：[分:秒.毫秒]
// 2. 每行一个时间戳和对应的歌词
// 3. 时间必须递增

// 测试歌词解析
const player = new DynamicIslandPlayer({
  audio: [{
    name: '测试',
    url: 'audio.mp3',
    lrc: lrc
  }]
});

// 手动解析歌词测试
const parsed = player.parseLrc(lrc);
console.log('解析结果:', parsed);

// 检查歌词是否有效
if (parsed.length === 0) {
  console.error('歌词解析失败，请检查格式');
}

// 歌词同步问题
player.on('timeupdate', (time) => {
  console.log('当前时间:', time, '歌词索引:', player.getCurrentLrcIndex());
});
```

### 6. 移动端问题

**问题现象：**
- 移动端显示异常
- 触摸事件不工作
- 自动播放失败

**可能原因：**
1. 移动端浏览器限制
2. 触摸事件配置错误
3. 自动播放策略限制

**解决方案：**

```javascript
// 移动端配置
const player = new DynamicIslandPlayer({
  audio: audioList,
  mobile: {
    position: 'bottom-left',
    size: 'small',
    autoHide: true
  }
});

// 触摸事件测试
player.on('touchstart', (e) => {
  console.log('触摸开始:', e);
});

player.on('touchend', (e) => {
  console.log('触摸结束:', e);
});

// 自动播放处理（移动端需要用户交互）
document.addEventListener('click', () => {
  if (!player.isPlaying()) {
    player.play().catch(error => {
      console.log('自动播放失败，需要用户交互:', error);
    });
  }
}, { once: true });
```

## 🔍 调试技巧

### 1. 启用调试模式

```javascript
// 启用调试模式
const player = new DynamicIslandPlayer({
  audio: audioList,
  debug: true  // 启用调试
});

// 或者动态启用
player.enableDebug();
```

### 2. 获取播放器信息

```javascript
// 获取播放器状态
console.log('播放器状态:', player.getPlayerInfo());

// 获取系统信息
console.log('系统信息:', player.getSystemInfo());

// 获取错误信息
player.on('error', (error) => {
  console.error('完整错误信息:', error);
});
```

### 3. 日志记录

```javascript
// 启用详细日志
const originalLog = console.log;
console.log = function(...args) {
  originalLog.apply(console, ['[DynamicIslandPlayer]', ...args]);
};

// 创建播放器
const player = new DynamicIslandPlayer({
  audio: audioList
});

// 恢复原始log
console.log = originalLog;
```

## 📊 性能优化

### 1. 内存泄漏

**问题：**
- 长时间使用后内存占用增加
- 页面卡顿

**解决方案：**

```javascript
// 正确销毁播放器
beforeUnmount() {
  if (this.player) {
    this.player.destroy();
    this.player = null;
  }
}

// 移除事件监听
player.off('play');
player.off('pause');
player.off('timeupdate');
```

### 2. 加载优化

```javascript
// 懒加载
const player = new DynamicIslandPlayer({
  audio: [],
  lazyLoad: true  // 启用懒加载
});

// 动态添加音频
function loadAudioOnDemand(url) {
  player.addTrack({
    name: '新歌曲',
    url: url
  });
}
```

## 🌐 浏览器兼容性问题

### 1. 旧版浏览器

**问题：**
- IE浏览器不兼容
- 旧版Safari问题

**解决方案：**

```html
<!-- 添加polyfill -->
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.js"></script>

<!-- 检查浏览器兼容性 -->
<script>
if (!window.Promise || !window.fetch) {
  alert('您的浏览器版本过低，请升级浏览器');
}
</script>
```

### 2. 移动端浏览器

```javascript
// 移动端浏览器检测
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  // 移动端特定配置
  const player = new DynamicIslandPlayer({
    audio: audioList,
    mobile: true,
    autoPlay: false // 移动端禁用自动播放
  });
}
```

## 📞 获取帮助

### 1. 收集信息

在提交问题前，请收集以下信息：

```javascript
// 运行此代码获取诊断信息
const diagnostics = {
  version: player.version,
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  cookieEnabled: navigator.cookieEnabled,
  online: navigator.onLine,
  screen: {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth
  },
  window: {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
  },
  player: player.getPlayerInfo(),
  system: player.getSystemInfo()
};

console.log('诊断信息:', JSON.stringify(diagnostics, null, 2));
```

### 2. 提交问题

在GitHub提交问题时，请包含：
- 问题描述
- 重现步骤
- 期望行为
- 实际行为
- 截图（如果有）
- 诊断信息

### 3. 社区支持

- GitHub Issues: https://github.com/RHZHZ/dynamic-island-player/issues
- Discussions: https://github.com/RHZHZ/dynamic-island-player/discussions
- Stack Overflow: 使用标签 [dynamic-island-player]

## 🔄 更新和升级

### 1. 检查更新

```bash
npm outdated dynamic-island-player
```

### 2. 更新到最新版本

```bash
npm update dynamic-island-player
```

### 3. 版本迁移指南

从旧版本升级时，请注意：
- 1.0.0 版本后API有重大变更
- 请查看[迁移指南](MIGRATION.md)
- 备份配置文件

# 文档结束