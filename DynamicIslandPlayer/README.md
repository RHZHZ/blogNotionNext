# DynamicIslandPlayer

给 NotionNext/Next.js 博客使用的灵动岛播放器安装包。

## 最小可运行接入

默认推荐先走最小接入，只启用：

- 全局 `APlayer` 引擎
- 悬浮式 `DynamicIslandPlayer` UI
- `/api/meting` 音频代理

### 文件清单

```text
DynamicIslandPlayer/
├── components/
│   ├── DynamicIslandPlayer.js
│   ├── InlineIslandAudio.js
│   └── Player.js
├── pages/
│   └── api/
│       └── meting.js
├── guide.md
├── install.ps1
├── install.sh
└── README.md
```

### 复制文件

最小接入只需要复制：

- `DynamicIslandPlayer/components/Player.js` -> `components/Player.js`
- `DynamicIslandPlayer/components/DynamicIslandPlayer.js` -> `components/DynamicIslandPlayer.js`
- `DynamicIslandPlayer/pages/api/meting.js` -> `pages/api/meting.js`

Windows 可执行：

```powershell
./DynamicIslandPlayer/install.ps1
```

macOS / Linux 可执行：

```bash
bash ./DynamicIslandPlayer/install.sh
```

### 挂载入口

在 `components/ExternalPlugins.js` 中保持和主项目一致的挂载方式：

- 动态引入 `MusicPlayer`
- 动态引入 `DynamicIslandPlayer`
- 在 `MUSIC_PLAYER` 开启时同时渲染它们

如果你就是基于当前主项目仓库使用这套安装包，那么这一步通常已经就位：`components/ExternalPlugins.js` 已包含这两个动态导入，并且已在 `MUSIC_PLAYER` 条件下同时挂载；安装脚本不会改动该文件。

### 配置项

在 `blog.config.js` 或 `conf/widget.config.js` 中配置：

```javascript
MUSIC_PLAYER: true,
MUSIC_PLAYER_METING: true,
MUSIC_PLAYER_METING_ID: '你的音乐ID,多个可逗号分隔',
MUSIC_PLAYER_METING_API: '/api/meting?url=:id',
MUSIC_PLAYER_AUTO_PLAY: false,
MUSIC_PLAYER_VISIBLE: true,
```

可选配置：

```javascript
MUSIC_PLAYER_ORDER: 'list',
MUSIC_PLAYER_LRC_TYPE: 0,
MUSIC_PLAYER_CDN_URL: 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.js',
MUSIC_PLAYER_STYLE_CDN_URL: 'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css',
MUSIC_PLAYER_AUDIO_LIST: [
  {
    name: '本地回退歌曲',
    artist: 'Unknown',
    url: 'https://example.com/demo.mp3',
    cover: '/avatar.png',
    lrc: ''
  }
]
```

## meting 上游接口配置

不要把上游地址写死在 `pages/api/meting.js` 里，统一通过环境变量配置：

```bash
MUSIC_PLAYER_METING_UPSTREAM=https://你的-meting-服务地址
```

如果你的上游不是默认参数名 `url / level / type`，继续配置：

```bash
MUSIC_PLAYER_METING_UPSTREAM_URL_PARAM=id
MUSIC_PLAYER_METING_UPSTREAM_LEVEL_PARAM=br
MUSIC_PLAYER_METING_UPSTREAM_TYPE_PARAM=format
```

例如前端请求：

```text
/api/meting?url=123456
```

可转发成：

```text
https://你的-meting-服务地址?id=123456&br=jyeffect&format=json
```

## 增强接入

如果你还想把文章中的音频块也转换成统一卡片，再继续接入：

- `DynamicIslandPlayer/components/InlineIslandAudio.js`
- `components/NotionPage.js` 中的 Audio 映射/DOM 转换逻辑
- `pages/api/audio-meta.js`
- `lib/server/audioMeta.js`

增强模式还需要：

- `MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT`
- `MUSIC_PLAYER_ARTICLE_META_ENABLE`
- `MUSIC_PLAYER_ARTICLE_META_DB_ID`
- `NOTION_ACCESS_TOKEN`

## 接入原则

- 最小接入不要求 `npm install aplayer`
- `Player.js` 已去掉对 `@/lib/config`、`@/lib/utils` 的硬依赖
- `DynamicIslandPlayer.js` 只依赖浏览器侧的 `window.__APPLAYER__`，不要求额外主项目私有上下文
- `InlineIslandAudio.js` 不是最小接入必需文件
- 最小接入链路只包含 `Player.js`、`DynamicIslandPlayer.js`、`pages/api/meting.js`
- 文章音频增强失败时，应允许回退到普通音频块/普通卡片

## 验证方式

1. 浏览器打开页面后确认 `window.__APPLAYER__` 已创建
2. 访问 `/api/meting?url=你的歌曲ID`，确认能返回音频数组
3. 播放/暂停时灵动岛 UI 能同步状态
4. 断开上游后，确认仍可回退到 `MUSIC_PLAYER_AUDIO_LIST`

更多细节见 `DynamicIslandPlayer/guide.md`。
