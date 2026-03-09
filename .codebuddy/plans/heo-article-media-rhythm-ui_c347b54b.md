---
name: heo-article-media-rhythm-ui
overview: 继续推进 HEO 文章页 UI，聚焦正文媒体与段落节奏体验，梳理文章正文、图片/嵌入媒体、目录与文章头图之间的视觉连贯性，并在尽量不改动渲染链路的前提下收敛到主题样式层和文章页壳层。
design:
  architecture:
    framework: react
  styleKeywords:
    - Glassmorphism
    - Editorial Reading
    - Premium
    - Soft Layering
    - Calm Rhythm
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 30px
      weight: 700
    subheading:
      size: 18px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#2563EB"
      - "#0EA5E9"
      - "#F59E0B"
    background:
      - "#FFFFFF"
      - "#F8FAFC"
      - "#0F172A"
    text:
      - "#0F172A"
      - "#334155"
      - "#E2E8F0"
    functional:
      - "#22C55E"
      - "#F59E0B"
      - "#EF4444"
      - "#3B82F6"
todos:
  - id: audit-article-media-chain
    content: 使用 [subagent:code-explorer] 复核 NotionPage 与 HEO 正文媒体选择器和影响面
    status: completed
  - id: refine-heo-reading-shell
    content: 使用 [mcp:Claude Text Editor MCP Server] 微调 themes/heo/index.js 正文容器层级与承接结构
    status: completed
    dependencies:
      - audit-article-media-chain
  - id: enhance-notion-media-markup
    content: 使用 [mcp:Claude Text Editor MCP Server] 在 components/NotionPage.js 补充必要媒体语义标记
    status: completed
    dependencies:
      - audit-article-media-chain
  - id: unify-heo-article-rhythm
    content: 使用 [mcp:Claude Text Editor MCP Server] 收敛 themes/heo/style.js 的正文媒体节奏样式
    status: completed
    dependencies:
      - refine-heo-reading-shell
      - enhance-notion-media-markup
  - id: sync-global-notion-baseline
    content: 使用 [mcp:Claude Text Editor MCP Server] 仅在必要时补充 styles/notion.css 基础规则
    status: completed
    dependencies:
      - unify-heo-article-rhythm
  - id: verify-media-regression
    content: 使用 [subagent:code-explorer] 与 [mcp:Claude Text Editor MCP Server] 补测试并校验正文媒体回归
    status: completed
    dependencies:
      - enhance-notion-media-markup
      - sync-global-notion-baseline
---

## User Requirements

继续推进文章页 UI，本轮聚焦正文阅读区的“媒体节奏”优化，重点统一图片、引用、代码块、音频等内容在正文中的层级、留白、分组感与阅读连续性。范围限定在 HEO 主题文章详情页，不处理部署、评论系统接入或与本轮目标无关的功能扩散。

## Product Overview

当前文章详情页主链已明确为 `pages/[prefix]/index.js` → `themes/heo/index.js` → `components/NotionPage.js`。本次需要在保留现有 Notion 渲染能力、图片放大、gallery 识别、文章音频转换等能力的前提下，让正文媒体块更像统一的阅读系统，而不是零散插入的原始块内容。

## Core Features

- 优化正文中图片、多图画廊、音频卡、代码块、引用块的节奏与层级
- 统一正文块间距、段落与媒体之间的过渡关系，减少突兀感
- 保持现有 Notion 渲染、自定义 block、懒处理逻辑和主题结构兼容
- 在 HEO 主题下增强视觉一致性，并兼顾桌面与移动端阅读效果

## Tech Stack Selection

- 现有前端框架：Next.js + React
- 现有正文渲染：`react-notion-x`
- 现有主题样式体系：HEO 主题内联全局样式 `themes/heo/style.js`
- 全站 Notion 基础样式：`styles/notion.css`

## Implementation Approach

采用“主题样式增强为主、正文渲染轻量补充为辅”的方案：优先复用 `themes/heo/style.js` 中已存在的正文节奏变量与 HEO 文章壳层，在 `components/NotionPage.js` 仅补充必要的语义 class 或轻量 DOM 标记，避免重写 `NotionRenderer` 主逻辑。这样可以最小化对现有图片放大、gallery 识别、音频转换、自定义 block 注入链路的影响，并保持后续扩展更多媒体块时的可维护性。

关键决策：

- **样式优先**：正文节奏问题主要属于表现层，优先落在 `themes/heo/style.js`，减少 JS 侧重复遍历与逻辑耦合。
- **保留全站基础样式边界**：`styles/notion.css` 仅处理确实属于通用 Notion 基础层的规则；HEO 专属强化放在主题文件，避免波及其他主题。
- **轻量语义增强**：若现有 `NotionPage.js` 无法稳定选中某些媒体块，再增补局部 class/容器标记，而不是替换整段渲染结构。
- **性能控制**：复用现有 `MutationObserver`/`resize` 处理链，避免新增高频遍历；新增 DOM 处理应限定在 `#notion-article` 范围内，复杂度保持在与当前遍历同级的 O(n) 范围。

## Implementation Notes

- 复用 `themes/heo/style.js` 中现有变量：`--heo-article-font-size`、`--heo-article-line-height`、`--heo-article-paragraph-gap`、`--heo-article-block-gap`，避免引入平行 token。
- `components/NotionPage.js` 已包含图片 gallery 行识别、音频转换、高清图替换与自定义 block 挂载；本轮改动应避免破坏这些 effect 的触发时机。
- 若新增 class，请限定到 HEO 阅读场景所需的最小集合，避免给所有 Notion block 增加无差别标记。
- 保持 `themes/heo/index.js` 的页面装配职责，不把大段正文渲染逻辑上移到主题层。

## Architecture Design

### System Structure

- `pages/[prefix]/index.js`：文章详情路由入口，传递文章数据
- `themes/heo/index.js`：文章详情页总装配，控制正文区与收尾区布局
- `components/NotionPage.js`：Notion 正文与媒体 block 渲染核心
- `themes/heo/style.js`：HEO 主题下的正文节奏、卡片感、媒体层级样式
- `styles/notion.css`：全站 Notion 基础样式兜底

### Component Relationship

正文媒体节奏优化应沿现有链路完成：

- 路由层提供文章数据
- 主题层控制文章主体容器与阅读区边界
- 正文渲染层输出稳定 DOM
- 主题样式层负责最终的阅读节奏与视觉统一

## Directory Structure

### Directory Structure Summary

本次改造以 HEO 主题正文体验增强为主，优先修改主题样式与正文渲染细节，必要时补充测试覆盖。

```text
c:/Users/RHZ/Downloads/blogNext/
├── components/
│   └── NotionPage.js                # [MODIFY] 正文渲染核心。必要时补充媒体块语义 class、分组标记或更稳定的选择器挂点；不得破坏现有图片放大、gallery、自定义 block、音频转换逻辑。
├── themes/
│   └── heo/
│       ├── index.js                 # [MODIFY] HEO 文章页正文外层壳层。仅做阅读区容器或区段级别的小幅衔接，保持总装配职责不扩散。
│       └── style.js                 # [MODIFY] HEO 正文节奏主战场。统一图片、画廊、引用、代码块、音频卡、嵌入块的留白、边框、圆角、背景与层级。
├── styles/
│   └── notion.css                   # [MODIFY] 仅在确属全站 Notion 基础层时补充最小通用规则，避免把 HEO 专属设计放进全局。
└── __tests__/
    └── components/
        └── NotionPage.test.js       # [NEW/OPTIONAL] 若本轮新增语义 class 或 DOM 标记，补充渲染与副作用回归测试，验证媒体增强不会破坏现有输出。
```

## Design Style

采用 HEO 现有阅读审美延展的高级阅读界面风格：浅色下强调通透白卡与柔和阴影，深色下强调低对比分层与稳定留白。正文媒体不做过度装饰，而是通过节奏、卡片边界、标题前后呼吸感和内容分组感，让阅读过程更顺滑。

## Page Planning

本轮只改文章详情页正文区，不新增页面。

### 文章详情页正文区

- 顶部承接 PostHeader，下接正文内容，维持现有页面结构
- 图片与多图区采用更明确的组块感，避免与普通段落混在一起
- 引用与代码块视觉上弱分隔、强可读，不抢正文主线
- 音频卡与嵌入块作为“阅读中的插入媒体”，强调完整容器感与上下文过渡

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 继续精查正文媒体相关 block、样式选择器与可能受影响的测试覆盖点
- Expected outcome: 输出精确修改边界、可复用选择器与最小影响面清单

### MCP

- **Claude Text Editor MCP Server**
- Purpose: 按既有结构修改正文渲染与 HEO 样式文件，并保留可追踪的编辑状态
- Expected outcome: 完成文件级增量改动与必要测试补充，避免无关重构