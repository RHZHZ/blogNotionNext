---
name: dynamic-island-player-onboarding-upgrade
overview: 分析当前项目中的灵动岛实现，基于现有博客完整能力更新 `DynamicIslandPlayer` 安装包/接入方案，降低新用户接入门槛并提供可直接上手的最小集成路径。
todos:
  - id: audit-implementation
    content: 用[subagent:code-explorer]核对主项目与安装包差异
    status: completed
  - id: refactor-minimal-runtime
    content: 用[mcp:Claude Text Editor MCP Server]重构最小接入链路文件
    status: completed
    dependencies:
      - audit-implementation
  - id: fix-installers-and-docs
    content: 用[mcp:Claude Text Editor MCP Server]补齐README、guide与安装脚本
    status: completed
    dependencies:
      - refactor-minimal-runtime
  - id: document-enhanced-path
    content: 补充文章音频增强接入、可选API与排障说明
    status: completed
    dependencies:
      - fix-installers-and-docs
---

## User Requirements

基于现有博客中的灵动岛播放器实现，更新 `DynamicIslandPlayer` 安装包，使新用户能按清晰步骤快速接入，并减少因隐藏依赖、占位配置、平台差异导致的接入失败。

## Product Overview

对外提供一个更易上手的灵动岛播放器接入包。接入后可呈现悬浮式灵动岛播放器，支持播放状态、歌曲信息、进度与歌词弹幕；在增强模式下，还可把文章音频块转换为统一风格的内嵌音频卡片，形成一致的播放体验。

## Core Features

- 提供“最小可运行接入”方案：仅接入全局播放器与灵动岛悬浮界面，用户复制文件、配置歌单后即可运行
- 提供“完整增强接入”方案：补充文章内音频卡片、音频元数据补全、可选数据库配置说明
- 更新安装包内容与说明文档，保证目录结构、文件清单、步骤说明与实际内容一致
- 降低私有依赖与占位配置暴露，明确哪些为必需项、哪些为可选项、哪些场景需要额外配置
- 优化安装引导，兼顾 Windows 与 macOS/Linux 用户，确保首次接入路径直观、可验证、可排障

## Tech Stack Selection

- 现有主项目：Next.js 14（Pages Router）+ React 18 + JavaScript
- 现有播放器链路：APlayer 运行时 CDN 加载、全局实例 `window.__APPLAYER__`
- 现有服务端能力：`pages/api` 路由、内存缓存、限流、Notion 音频元数据补全
- 本次改造原则：优先复用主项目已验证实现与配置约定，不引入新的架构模式

## Implementation Approach

### 方法概述

采用“双层交付”方案：先把 `DynamicIslandPlayer` 重构为可独立落地的最小接入包，再把主项目中的文章音频增强能力整理为可选增强文档与配套文件边界。这样新用户可以先跑通，再按需升级。

### 关键决策

- 以“最小可运行”为默认主路径：仅保留播放器初始化、灵动岛 UI、可工作的 `/api/meting`、必要配置说明
- 将“文章音频卡片 + `/api/audio-meta` + Notion 元数据库”定义为增强路径，避免首次接入被非必要依赖阻塞
- 去除安装包中对主项目私有模块的硬依赖，例如当前 `DynamicIslandPlayer/components/Player.js` 直接依赖 `@/lib/config`、`@/lib/utils`
- 文档与脚本统一以主项目真实实现为准，纠正当前 README 中与实际目录不一致、脚本引用不存在文件、API 含占位地址等问题
- 保留主项目已验证的全局实例约定 `window.__APPLAYER__`，降低 UI 组件与播放器引擎之间的耦合改造成本

### 性能与可靠性

- `/api/meting` 优先复用主项目已有缓存、限流、fallback 思路，避免新用户直接命中高频上游请求
- 前端继续使用单实例播放器，避免重复初始化 APlayer 带来的内存与事件监听泄漏
- 文章音频增强路径保持按需开启，默认不引入额外元数据请求，减少首次接入时的网络与配置负担
- 对外说明中明确失败回退顺序：远程歌单失败时回退本地音频列表，元数据失败时回退普通内嵌卡片

## Implementation Notes

- 保持 `components/ExternalPlugins.js` 中“`MusicPlayer` + `DynamicIslandPlayer`”的挂载模式，不改动主项目插件入口习惯
- `DynamicIslandPlayer/pages/api/meting.js` 不能再保留“这里填写你的音乐接口”占位值，必须变成可直接运行或可配置的实现
- 文档中不要再要求 `npm install aplayer`，因为主项目真实实现使用 CDN 动态加载 APlayer
- 安装脚本不能只依赖 Bash；当前用户环境为 Windows，需补充 PowerShell 方案或将脚本降级为辅助复制脚本
- README 中引用的文件必须真实存在；若继续引用 `guide.md`，则必须补齐该文件
- 避免把完整主项目的 Notion 元数据库链路强塞进最小安装包，控制改动面与维护成本

## Architecture Design

### 当前已验证链路

- 配置来源：`blog.config.js` 与 `conf/widget.config.js`
- 全局挂载入口：`components/ExternalPlugins.js`
- 播放器引擎：`components/Player.js`
- 灵动岛 UI：`components/DynamicIslandPlayer.js`
- 文章音频卡片：`components/InlineIslandAudio.js`
- 数据接口：`pages/api/meting.js`
- 可选增强：`pages/api/audio-meta.js` + `lib/server/audioMeta.js` + `components/NotionPage.js`

### 改造后交付结构

- 最小接入链路：配置 → `Player.js` → `window.__APPLAYER__` → `DynamicIslandPlayer.js`
- 增强接入链路：最小接入链路 + `InlineIslandAudio.js` + `NotionPage.js` 音频转换 + `/api/audio-meta`

## Directory Structure

### Directory Structure Summary

本次改造聚焦 `DynamicIslandPlayer` 安装包本身，同时以主项目真实实现作为对照源，输出一个“可直接跑通”的最小接入包，并补充可选增强接入说明。

- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/README.md`  [MODIFY] 安装包主说明文档。重写快速开始、最小接入、增强接入、配置项、文件清单、验证步骤与排障说明，确保与实际内容一致。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/install.sh`  [MODIFY] macOS/Linux 辅助安装脚本。只做安全的复制与提示，不再输出失效文件引用，不再误导安装无用依赖。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/install.ps1`  [NEW] Windows PowerShell 安装辅助脚本。适配当前用户环境，提供与 `install.sh` 对齐的复制与提示流程。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/guide.md`  [NEW] 详细接入指南。拆分最小接入与完整增强两条路径，补充入口文件修改点与验证顺序。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/components/Player.js`  [MODIFY] 最小接入核心引擎。去除对主项目私有工具的强绑定，保留单实例、CDN 加载、远程歌单失败回退能力。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/components/DynamicIslandPlayer.js`  [MODIFY] 灵动岛 UI 组件。保持与全局播放器实例的协作，补强新手接入时的容错与状态说明。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/components/InlineIslandAudio.js`  [MODIFY] 文章内嵌音频卡片。明确其依赖前提与可选接入方式，避免被误认为最小接入必需文件。
- `c:/Users/RHZ/Downloads/blogNext/DynamicIslandPlayer/pages/api/meting.js`  [MODIFY] 安装包内可运行的音频代理 API。去除占位实现，补齐默认配置、错误返回、缓存头与最小 fallback。
- `c:/Users/RHZ/Downloads/blogNext/components/ExternalPlugins.js`  [REFERENCE] 对照真实挂载入口，保证安装包文档中的接入步骤与主项目一致。
- `c:/Users/RHZ/Downloads/blogNext/components/NotionPage.js`  [REFERENCE] 对照文章音频增强入口，用于编写增强接入说明。
- `c:/Users/RHZ/Downloads/blogNext/pages/api/audio-meta.js`  [REFERENCE] 对照可选元数据接口边界，供增强文档引用。
- `c:/Users/RHZ/Downloads/blogNext/lib/server/audioMeta.js`  [REFERENCE] 对照 Notion 音频元数据库实现，用于说明增强模式的前置条件。

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 继续核对主项目灵动岛真实实现、安装包现状与可复用差异点
- Expected outcome: 产出准确的修改边界、依赖链与落地文件清单，避免文档或方案脱离代码事实

### MCP

- **Claude Text Editor MCP Server**
- Purpose: 在执行阶段持续编辑 `DynamicIslandPlayer` 文档、脚本与组件文件，并保持跨步骤修改一致
- Expected outcome: 高效完成多文件重构，保证 README、脚本、组件与 API 文件内容同步更新