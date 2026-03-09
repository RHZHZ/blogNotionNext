# DynamicIslandPlayer 接入指南

## 最小接入路径

适合只想先跑通全局播放器与灵动岛悬浮 UI 的场景。

### 需要复制的文件

- `DynamicIslandPlayer/components/Player.js` -> `components/Player.js`
- `DynamicIslandPlayer/components/DynamicIslandPlayer.js` -> `components/DynamicIslandPlayer.js`
- `DynamicIslandPlayer/pages/api/meting.js` -> `pages/api/meting.js`

### 需要修改的入口

在 `components/ExternalPlugins.js` 中，保持和主项目一致的挂载方式：

- 动态引入 `MusicPlayer`
- 动态引入 `DynamicIslandPlayer`
- 在 `MUSIC_PLAYER` 开启时同时渲染这两个组件

如果你就是当前主项目仓库用户，这一步通常已经存在；最小安装脚本不会自动改写 `components/ExternalPlugins.js`。

### 需要配置的项目项

建议至少配置：

- `MUSIC_PLAYER`
- `MUSIC_PLAYER_METING`
- `MUSIC_PLAYER_METING_ID`
- `MUSIC_PLAYER_METING_API`
- `MUSIC_PLAYER_VISIBLE`
- `MUSIC_PLAYER_AUTO_PLAY`

可选补充：

- `MUSIC_PLAYER_ORDER`
- `MUSIC_PLAYER_LRC_TYPE`
- `MUSIC_PLAYER_CDN_URL`
- `MUSIC_PLAYER_STYLE_CDN_URL`
- `MUSIC_PLAYER_AUDIO_LIST`

### 需要配置的环境变量

必填：

- `MUSIC_PLAYER_METING_UPSTREAM`

按需配置：

- `MUSIC_PLAYER_METING_UPSTREAM_URL_PARAM`
- `MUSIC_PLAYER_METING_UPSTREAM_LEVEL_PARAM`
- `MUSIC_PLAYER_METING_UPSTREAM_TYPE_PARAM`

### 验证顺序

1. 打开页面后确认 `window.__APPLAYER__` 已存在
2. 请求 `/api/meting?url=你的ID`，确认能返回音频数组
3. 页面右上角/悬浮区能看到灵动岛播放器状态变化
4. 上游异常时，确认能回退到 `MUSIC_PLAYER_AUDIO_LIST`

## 增强接入路径

适合希望把文章中的 Notion 音频块也统一改造成灵动岛风格卡片的场景。

### 额外文件

增强模式才需要继续复制：

- `DynamicIslandPlayer/components/InlineIslandAudio.js`

最小接入路径不依赖 `InlineIslandAudio.js`、`pages/api/audio-meta.js`、`lib/server/audioMeta.js`。

### 真实接入点

主项目增强模式依赖以下入口：

- `components/NotionPage.js`
  - `NotionRenderer` 的 `Audio` 组件映射到 `InlineIslandAudio`
  - 页面渲染后还会扫描 `.notion-audio`，并尝试把原生音频块转换成统一卡片
- `pages/api/audio-meta.js`
  - 为文章音频卡片补充封面、歌词、歌手等元数据
- `lib/server/audioMeta.js`
  - 从 Notion 音频元数据库读取并缓存元数据

### 增强配置项

- `MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT`
- `MUSIC_PLAYER_ARTICLE_META_ENABLE`
- `MUSIC_PLAYER_ARTICLE_META_DB_ID`
- `NOTION_ACCESS_TOKEN`

## 常见问题

### 1. 为什么不再要求 `npm install aplayer`

因为当前实现走的是 APlayer CDN 动态加载，不依赖本地 npm 包。

### 2. 为什么 `Player.js` 不再依赖 `@/lib/config` 和 `@/lib/utils`

为了让安装包更接近“复制即用”，避免新用户还要一起拷贝主项目私有工具函数。

### 3. 什么时候才需要 `InlineIslandAudio.js`

只有你要改造文章内音频块时才需要；最小接入路径不依赖它。
