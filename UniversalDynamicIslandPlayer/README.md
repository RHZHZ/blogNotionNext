# 🎵 灵动岛播放器

一套跨平台的macOS风格灵动岛音乐播放器，支持原生JavaScript、React、Vue等多种使用方式。

<p align="center">
  <img src="https://img.shields.io/npm/v/dynamic-island-player" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/dynamic-island-player" alt="npm downloads" />
  <img src="https://img.shields.io/github/license/yourusername/dynamic-island-player" alt="license" />
</p>

## ✨ 特性

- **跨平台** - 支持原生JS、React、Vue等多种技术栈
- **灵动岛设计** - macOS风格的悬浮岛设计
- **暗色模式** - 自动适配系统暗色/亮色模式
- **歌词弹幕** - 创新的弹幕式歌词显示效果
- **模块化** - 音频引擎与UI分离，易于定制
- **开箱即用** - 提供CDN版本，无需构建工具
- **响应式** - 完美适配各种屏幕尺寸

## 📦 文件结构

```
UniversalDynamicIslandPlayer/
├── vanilla/           # 原生JavaScript版本
│   ├── dynamic-island-player.js
│   └── dynamic-island-player.css
├── react/             # React版本
│   ├── DynamicIslandPlayer.jsx
│   ├── Player.jsx
│   └── InlineAudio.jsx
├── vue/               # Vue版本
│   ├── DynamicIslandPlayer.vue
│   ├── Player.vue
│   └── InlineAudio.vue
├── html/              # HTML示例
│   ├── index.html
│   └── player.html
├── api/               # API服务
│   └── meting.js
├── cdn/               # CDN版本
│   ├── dynamic-island-player.min.js
│   └── dynamic-island-player.min.css
├── docs/              # 文档
│   ├── INSTALLATION.md
│   ├── USAGE.md
│   ├── API_REFERENCE.md
│   ├── EXAMPLES.md
│   └── TROUBLESHOOTING.md
└── package.json
```

## 🚀 快速开始

### 原生JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dynamic-island-player.css">
</head>
<body>
  <script src="dynamic-island-player.js"></script>
  <script>
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

### React

```bash
npm install dynamic-island-player
```

```jsx
import React from 'react';
import DynamicIslandPlayer from 'dynamic-island-player/react';

function App() {
  return (
    <DynamicIslandPlayer
      audio={[
        {
          name: '示例歌曲',
          artist: '示例歌手',
          url: 'https://example.com/audio.mp3'
        }
      ]}
    />
  );
}
```

### Vue

```bash
npm install dynamic-island-player
```

```vue
<template>
  <DynamicIslandPlayer :audio="audioList" />
</template>

<script>
import DynamicIslandPlayer from 'dynamic-island-player/vue';

export default {
  components: { DynamicIslandPlayer },
  data() {
    return {
      audioList: [
        {
          name: '示例歌曲',
          artist: '示例歌手',
          url: 'https://example.com/audio.mp3'
        }
      ]
    };
  }
};
</script>
```

### CDN直接引入

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dynamic-island-player@latest/dist/dynamic-island-player.min.css">
<script src="https://cdn.jsdelivr.net/npm/dynamic-island-player@latest/dist/dynamic-island-player.min.js"></script>

<script>
  const player = new DynamicIslandPlayer({
    audio: [{
      name: '示例歌曲',
      artist: '示例歌手',
      url: 'https://example.com/audio.mp3'
    }]
  });
</script>
```

## 📖 文档

- [📥 安装指南](docs/INSTALLATION.md) - 详细的安装步骤
- [🎯 使用指南](docs/USAGE.md) - 完整的功能使用说明
- [🔧 API参考](docs/API_REFERENCE.md) - 完整的API文档
- [💡 示例代码](docs/EXAMPLES.md) - 各种使用场景示例
- [🔧 故障排除](docs/TROUBLESHOOTING.md) - 常见问题解决方案

## 🔧 配置选项

```javascript
const player = new DynamicIslandPlayer({
  // 音频列表
  audio: [],

  // 自动播放
  autoPlay: false,

  // 显示歌词
  showLrc: true,

  // 播放器位置
  position: 'bottom-left', // 'bottom-left' | 'bottom-right'

  // 自定义类名
  className: '',

  // 歌词类型
  lrcType: 3
});
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [GitHub仓库](https://github.com/RHZHZ/dynamic-island-player)
- [问题反馈](https://github.com/RHZHZ/dynamic-island-player/issues)
- [更新日志](CHANGELOG.md)