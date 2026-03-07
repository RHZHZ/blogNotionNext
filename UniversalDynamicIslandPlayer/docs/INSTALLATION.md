# 📥 灵动岛播放器安装指南

## 🚀 快速安装

### 方法1：npm安装（推荐）

```bash
# 安装完整包
npm install dynamic-island-player

# 或按需安装特定版本
npm install dynamic-island-player-vanilla  # 原生JS版本
npm install dynamic-island-player-react    # React版本
npm install dynamic-island-player-vue      # Vue版本
```

### 方法2：CDN引入

```html
<!-- 最新稳定版 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dynamic-island-player@latest/dist/dynamic-island-player.min.css">
<script src="https://cdn.jsdelivr.net/npm/dynamic-island-player@latest/dist/dynamic-island-player.min.js"></script>

<!-- 指定版本 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dynamic-island-player@1.0.0/dist/dynamic-island-player.min.css">
<script src="https://cdn.jsdelivr.net/npm/dynamic-island-player@1.0.0/dist/dynamic-island-player.min.js"></script>
```

### 方法3：下载源码

```bash
# 克隆仓库
git clone https://github.com/yourusername/dynamic-island-player.git

# 进入目录
cd dynamic-island-player

# 安装依赖
npm install

# 构建
npm run build
```

## 📦 各版本安装说明

### 原生JavaScript版本

#### 方法1：直接引入

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="path/to/dynamic-island-player.css">
</head>
<body>
  <script src="path/to/dynamic-island-player.js"></script>
  <script>
    // 初始化播放器
    const player = new DynamicIslandPlayer({
      audio: [{ name: '歌曲', url: '音频地址' }]
    });
  </script>
</body>
</html>
```

#### 方法2：模块化引入

```javascript
// ES6模块
import DynamicIslandPlayer from './dynamic-island-player.js';

// CommonJS
const DynamicIslandPlayer = require('./dynamic-island-player.js');
```

### React版本

#### 方法1：npm安装

```bash
npm install dynamic-island-player-react aplayer
```

#### 方法2：在组件中使用

```jsx
import React from 'react';
import DynamicIslandPlayer from 'dynamic-island-player-react';
import 'dynamic-island-player-react/dist/dynamic-island-player.css';

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

export default App;
```

#### 方法3：按需引入

```jsx
import { DynamicIslandPlayer, Player, InlineAudio } from 'dynamic-island-player-react';
```

### Vue版本

#### 方法1：npm安装

```bash
npm install dynamic-island-player-vue aplayer
```

#### 方法2：在组件中使用

```vue
<template>
  <div id="app">
    <DynamicIslandPlayer :audio="audioList" />
  </div>
</template>

<script>
import DynamicIslandPlayer from 'dynamic-island-player-vue';
import 'dynamic-island-player-vue/dist/dynamic-island-player.css';

export default {
  name: 'App',
  components: {
    DynamicIslandPlayer
  },
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

## 🔧 依赖说明

### 核心依赖

- **APlayer** - 音频播放引擎
  - 版本要求：^1.10.1
  - 安装命令：`npm install aplayer`

### 可选依赖

- **React** - 仅React版本需要
  - 版本要求：^16.8.0 或 ^17.0.0 或 ^18.0.0

- **Vue** - 仅Vue版本需要
  - 版本要求：^3.0.0

### 自动加载

当使用npm安装时，APlayer会自动作为依赖安装，无需手动安装。

## 🌐 浏览器支持

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | 60+ | 完全支持 |
| Firefox | 55+ | 完全支持 |
| Safari | 12+ | 完全支持 |
| Edge | 79+ | 完全支持 |
| Opera | 47+ | 完全支持 |

### 移动端支持

- iOS Safari 12+
- Chrome Mobile 60+
- Samsung Internet 8.0+

## 📱 移动端适配

### 响应式设计

灵动岛播放器自动适配移动设备：

```javascript
const player = new DynamicIslandPlayer({
  // 移动端配置
  mobile: {
    position: 'bottom-left',  // 移动端位置
    size: 'small'             // 移动端大小
  }
});
```

### 触摸优化

- 自动优化触摸事件
- 支持手势操作
- 适应小屏幕布局

## 🎯 框架集成

### Next.js

```jsx
// pages/_app.js
import 'dynamic-island-player-react/dist/dynamic-island-player.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

// pages/index.js
import { useEffect } from 'react';
import DynamicIslandPlayer from 'dynamic-island-player-react';

export default function Home() {
  return (
    <div>
      <DynamicIslandPlayer audio={audioList} />
    </div>
  );
}
```

### Nuxt.js

```vue
<!-- plugins/dynamic-island-player.js -->
import 'dynamic-island-player-vue/dist/dynamic-island-player.css';
import DynamicIslandPlayer from 'dynamic-island-player-vue';

export default defineNuxtPlugin(() => {
  // 全局注册组件
  app.vueApp.component('DynamicIslandPlayer', DynamicIslandPlayer);
});
```

### Vite

```jsx
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['dynamic-island-player-react']
  }
});
```

## 🔐 安全配置

### CSP配置

如果使用Content Security Policy，需要添加以下配置：

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  img-src 'self' data: https:;
">
```

### HTTPS要求

建议使用HTTPS环境，以确保音频加载的安全性。

## 📊 版本管理

### 版本说明

- **主版本号**：重大更新，可能不兼容旧版本
- **次版本号**：新增功能，向下兼容
- **修订号**：Bug修复，完全兼容

### 更新命令

```bash
# 检查更新
npm outdated dynamic-island-player

# 更新到最新版本
npm update dynamic-island-player

# 更新到指定版本
npm install dynamic-island-player@1.2.3
```

## 🔍 验证安装

### 检查安装是否成功

```javascript
// 检查全局对象
console.log('DynamicIslandPlayer:', typeof DynamicIslandPlayer);

// 创建测试实例
try {
  const player = new DynamicIslandPlayer({
    audio: [{ name: '测试', url: 'https://example.com/audio.mp3' }]
  });
  console.log('播放器创建成功:', player);
} catch (error) {
  console.error('播放器创建失败:', error);
}
```

### 常见问题检查

1. **依赖是否正确安装**
2. **CSS是否正确引入**
3. **APlayer是否加载成功**
4. **浏览器控制台是否有错误**

## 🚀 下一步

安装完成后，请参考：
- [使用指南](USAGE.md) - 了解如何使用播放器
- [API参考](API_REFERENCE.md) - 完整的API文档
- [示例代码](EXAMPLES.md) - 各种使用场景

# 文档结束