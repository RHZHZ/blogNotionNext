# 🎵 灵动岛播放器一键安装包

专为 NotionNext 项目设计的 macOS 风格灵动岛音乐播放器

## ✨ 特性

- **灵动岛设计** - macOS 风格的悬浮岛设计，完美适配暗色/亮色模式
- **歌词弹幕** - 创新的弹幕式歌词显示效果
- **文章内嵌** - 支持在文章内嵌入音频卡片
- **智能加载** - 优雅的资源加载状态处理
- **无缝集成** - 与 APlayer 音频引擎深度集成

## 📦 文件结构

```
DynamicIslandPlayer/
├── components/
│   ├── DynamicIslandPlayer.js    # 灵动岛悬浮播放器
│   ├── Player.js                 # 音频引擎
│   └── InlineIslandAudio.js      # 文章内嵌播放器
├── pages/
│   └── api/
│       └── meting.js             # 音频代理API
├── install.sh                    # 一键安装脚本
├── package.json                  # 依赖配置
└── guide.md                      # 详细指南
```

## 🚀 快速开始

### 一键安装

```bash
# 下载并运行安装脚本
./install.sh
```

### 手动安装

1. **安装依赖**
```bash
npm install aplayer
```

2. **复制文件**
- 将 `components/` 下的文件复制到项目的 `components/` 目录
- 将 `pages/api/meting.js` 复制到项目的 `pages/api/` 目录

3. **配置项目**

在 `blog.config.js` 中添加配置：
```javascript
// 音乐播放器配置
MUSIC_PLAYER: true,
MUSIC_PLAYER_METING_ID: '你的音乐ID',
MUSIC_PLAYER_AUTO_PLAY: false,
MUSIC_PLAYER_VISIBLE: true,
```

## 🔧 配置选项

### 全局配置 (blog.config.js)

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| MUSIC_PLAYER | boolean | true | 启用音乐播放器 |
| MUSIC_PLAYER_METING_ID | string | '' | 音乐歌单ID |
| MUSIC_PLAYER_AUTO_PLAY | boolean | false | 自动播放 |
| MUSIC_PLAYER_VISIBLE | boolean | true | 显示播放器 |

### 环境变量

- `NOTION_ACCESS_TOKEN` - Notion API 访问令牌（用于读取元数据）

## 📖 使用指南

### 1. 在文章中使用音频

在 Notion 文章中插入音频块，系统会自动转换为内嵌播放器。

### 2. 自定义歌单

编辑 `MUSIC_PLAYER_METING_ID` 配置，支持多个ID用逗号分隔。

### 3. 歌词显示

灵动岛播放器会自动显示当前播放歌曲的歌词，以弹幕形式从右向左滚动。

## 🎨 自定义样式

所有样式都支持自动暗色模式切换，你也可以通过修改 CSS 变量来自定义外观。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关项目

- [NotionNext](https://github.com/tangly1024/NotionNext)
- [APlayer](https://github.com/DIYgod/APlayer)