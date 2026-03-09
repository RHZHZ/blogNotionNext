---
name: heo-article-comment-shell-and-loading-ui
overview: 继续推进文章页 UI，优先完善评论区相关体验：保留未启用态的一致外壳，并将真实评论区加载态/壳层收敛为 HEO 风格，便于后续接入评论系统。
design:
  architecture:
    framework: react
  styleKeywords:
    - HEO
    - Glassmorphism
    - 中性色基底
    - 弱强调
    - 阅读收尾
    - 轻量动效
    - 暗色模式和浅色模式适配
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 28px
      weight: 600
    subheading:
      size: 16px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#F59E0B"
      - "#F97316"
      - "#EAB308"
    background:
      - "#FFFFFF"
      - "#F8FAFC"
      - "#1F2026"
    text:
      - "#0F172A"
      - "#475569"
      - "#E2E8F0"
    functional:
      - "#10B981"
      - "#F59E0B"
      - "#EF4444"
      - "#3B82F6"
todos:
  - id: audit-comment-scope
    content: 使用 [subagent:code-explorer] 复核 Comment、Tabs 与 HEO 评论区调用链
    status: completed
  - id: refactor-comment-state
    content: 使用 [mcp:Claude Text Editor MCP Server] 改造 components/Comment.js 的 HEO 占位态接口
    status: completed
    dependencies:
      - audit-comment-scope
  - id: soften-tabs-style
    content: 使用 [mcp:Claude Text Editor MCP Server] 增强 components/Tabs.js 的评论区弱化样式能力
    status: completed
    dependencies:
      - audit-comment-scope
  - id: wire-heo-discussion-shell
    content: 使用 [mcp:Claude Text Editor MCP Server] 统一 themes/heo/index.js 评论区三态外层结构
    status: completed
    dependencies:
      - refactor-comment-state
      - soften-tabs-style
  - id: add-heo-comment-style
    content: 使用 [mcp:Claude Text Editor MCP Server] 视需要收敛 themes/heo/style.js 评论区样式 token
    status: completed
    dependencies:
      - wire-heo-discussion-shell
  - id: verify-comment-regression
    content: 使用 [mcp:Claude Text Editor MCP Server] 新增 __tests__/components/Comment.test.js 与 Tabs.test.js
    status: completed
    dependencies:
      - add-heo-comment-style
---

## User Requirements

继续推进文章页 UI，但本轮仅聚焦评论区体验收口，不扩展真实评论接入范围，也不启用评论功能本身。

## Product Overview

将文章页评论区统一为“阅读结束后的讨论区”语义，覆盖未启用、懒加载中、已启用三种状态，让评论区不再像突兀插入的第三方容器，而是与文章尾部、推荐区和页脚形成连续的阅读收尾体验。

## Core Features

- 统一评论区外层容器的标题、说明文案、层级与间距节奏
- 将 `Loading...` 改为符合 HEO 风格的占位态，提供更自然的等待反馈
- 弱化多评论系统切换器存在感，避免标签栏抢过评论内容本身
- 保留未启用态卡片，并与加载态、已启用态形成一致的视觉语言
- 为后续优先接入 `Giscus` 预留稳定结构，尽量减少未来返工

功能表现上，评论区应更像文章结束后的讨论模块：标题明确、状态清晰、卡片层级统一；视觉上保持中性色基底、弱强调、圆角卡片和轻量动效，在亮色与暗色模式下都稳定可读。

## Tech Stack Selection

- 现有前端框架：Next.js 14 + React 18
- 现有语言形态：以 JavaScript 组件为主
- 现有样式体系：Tailwind CSS + `themes/heo/style.js` 主题样式
- 现有测试能力：Jest + Testing Library

## Implementation Approach

采用“HEO 主题外层统一 + 通用评论组件按需增强”的方式实现。核心做法是：保留 `themes/heo/index.js` 作为文章页评论区壳层，给 `components/Comment.js` 增加可选的 HEO 专用占位与标签样式入口，必要时同步增强 `components/Tabs.js` 的可配置能力，但默认行为保持不变，避免影响其他主题。

关键决策：

- `components/Comment.js` 当前被多个主题复用，不能直接把 HEO 样式硬编码为全局默认；应通过可选 `variant` / `className` / 占位插槽等轻量接口进行主题化接入。
- `components/Tabs.js` 也是通用组件，若要弱化评论系统切换器，优先增加可选样式钩子，而不是整体重写默认 Tabs 样式。
- 评论懒加载仍保留 `IntersectionObserver`，时间复杂度为 O(1) 观察单节点，性能成本低；只优化加载态展示，不改变现有延迟加载策略。

## Implementation Notes

- 复用 `themes/heo/index.js` 中已存在的评论区卡片外壳，避免新增并行容器。
- `components/Comment.js` 的增强必须是可选的，确保其他主题继续使用原有结构。
- 若修改 `components/Tabs.js`，应通过新增 props 控制 HEO 评论标签样式，默认分支保持现状。
- 加载态应避免频繁动画和大面积高亮，使用轻量骨架/说明文案即可，减少视觉噪音。
- 保持 `id='comment'`、锚点跳转和现有评论系统条件渲染逻辑不变，控制改动爆炸半径。
- 增加针对评论区状态渲染与可选样式接口的测试，优先覆盖未加载、已加载、单标签隐藏等关键回归点。

## Architecture Design

本次改动沿用现有文章页结构：

- `themes/heo/index.js`：负责文章页“讨论区”外层编排、标题与未启用态容器
- `components/Comment.js`：负责评论模块懒加载、状态切换、真实评论组件挂载
- `components/Tabs.js`：负责多评论系统标签切换
- 可选的 `themes/heo/style.js`：承接 HEO 评论区样式 token 或局部主题规则

数据/渲染关系：
文章页评论可用性判断 → HEO 外层容器渲染 → `Comment` 懒加载占位/真实评论切换 → `Tabs` 控制多评论系统展示

## Directory Structure

## Directory Structure Summary

本次实现以最小改动统一 HEO 评论区状态体验，主要修改文章页外层、评论组件和标签切换器，并补充针对状态渲染的测试。

```text
c:/Users/RHZ/Downloads/blogNext/
├── components/
│   ├── Comment.js                 # [MODIFY] 通用评论入口。保留现有懒加载与多评论系统挂载逻辑，新增 HEO 可选占位态/样式入口，统一未加载与已加载时的结构语言。
│   └── Tabs.js                    # [MODIFY] 通用标签切换组件。为评论区提供可选弱化样式能力，默认样式保持兼容，避免影响其他主题。
├── themes/
│   └── heo/
│       ├── index.js               # [MODIFY] HEO 文章页评论区外层。统一“未启用/加载中/已启用”标题与区块节奏，向 Comment 传递 HEO 专用展示参数。
│       └── style.js               # [MODIFY][可选] 若现有 Tailwind 类不足以稳定复用，则收敛评论区相关 token/局部样式到 HEO 主题样式层。
└── __tests__/
    └── components/
        ├── Comment.test.js        # [NEW] 覆盖懒加载前占位态、启用后评论容器渲染、可选 HEO 变体输出等关键状态。
        └── Tabs.test.js           # [NEW] 覆盖单标签隐藏、标签切换、评论区可选样式接口不破坏默认行为。
```

## Key Code Structures

建议仅在接口层增加可选参数，避免侵入式重构：

- `Comment({ frontMatter, className, variant, loadingSlot, tabsClassName })`
- `Tabs({ className, children, tabListClassName, tabItemClassName, activeTabItemClassName })`

以上签名仅表达实现方向；若执行时发现项目已有更合适的 props 组织方式，应优先复用现有约定。

## Design Approach

评论区延续 HEO 现有文章尾部卡片体系，采用“中性色基底 + 弱强调信息 + 统一圆角卡片”的设计。三种状态都保持同一外层骨架：上方为讨论区标题与简短说明，中部为状态内容或真实评论，下方自然衔接文章尾部节奏。

### 页面区块规划

#### 1. 讨论区外层卡片

顶部使用小号英文分类标识 + 中文主标题，保持与文章尾部其他模块同级但不过度抢眼。卡片边框、背景、阴影与未启用态一致。

#### 2. 加载中占位区

用 HEO 风格的说明文案、轻量图标/骨架行替代技术化 `Loading...`。强调“讨论区正在准备中”，减少第三方组件等待感。

#### 3. 评论系统切换区

若存在多评论系统，标签栏缩为弱对比、小体量、可横向滚动的切换器，视觉优先级低于评论内容主体。

#### 4. 评论内容区

真实评论挂载区域保持足够留白与稳定高度，避免外层切换时跳动。评论内容作为阅读收尾后的主视觉中心。

### 响应式与交互

- 桌面端保持卡片完整圆角和舒展留白
- 移动端优先纵向堆叠，标题、说明、状态信息之间间距更紧凑
- 动效仅用于淡入、微位移和轻旋转/骨架 shimmer，不做强跳动反馈
- 暗色模式下压低边框和发光感，保证正文结束后的氛围连贯

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 在执行前复核 `Comment`、`Tabs`、`themes/heo` 相关调用链与测试影响面
- Expected outcome: 输出精确的受影响文件与回归点，避免通用组件改动误伤其他主题

### MCP

- **Claude Text Editor MCP Server**
- Purpose: 持续编辑 `components/Comment.js`、`components/Tabs.js`、`themes/heo/index.js` 及测试文件
- Expected outcome: 以可追踪、可回退的方式完成多文件改动并保持结构一致