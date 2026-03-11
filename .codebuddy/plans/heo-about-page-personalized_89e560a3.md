---
name: heo-about-page-personalized
overview: 为 `heo` 主题设计并实现一个个性化 `/about` 页面方案，基于现有通用 slug 页面机制梳理改造入口、布局结构、内容模块与样式承载方式，确保后续可在不破坏现有主题体系的前提下落地。
design:
  architecture:
    framework: react
  styleKeywords:
    - 玻璃拟态卡片
    - 高级感展示页
    - 柔和渐变背景
    - 信息分区清晰
    - 时间轴叙事
    - 响应式单列重排
    - 明暗主题统一
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 36px
      weight: 700
    subheading:
      size: 20px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#2563EB"
      - "#7C3AED"
      - "#F59E0B"
    background:
      - "#F7F9FE"
      - "#FFFFFF"
      - "#18171D"
    text:
      - "#0F172A"
      - "#334155"
      - "#F8FAFC"
    functional:
      - "#10B981"
      - "#EF4444"
      - "#F59E0B"
      - "#3B82F6"
todos:
  - id: audit-about-scope
    content: 使用 [subagent:code-explorer] 复核 heo about 落点、参考结构与回归影响面
    status: completed
  - id: build-about-components
    content: 新增 themes/heo/components/about 组件与 about.data.js 内容数据源
    status: completed
    dependencies:
      - audit-about-scope
  - id: wire-about-layout
    content: 改造 themes/heo/index.js，让 LayoutSlug 为 /about 渲染专属页面
    status: completed
    dependencies:
      - build-about-components
  - id: style-about-page
    content: 扩展 themes/heo/style.js，完成 About 页面样式、暗黑与响应式适配
    status: completed
    dependencies:
      - wire-about-layout
  - id: deliver-content-template
    content: 使用 [mcp:Claude Text Editor MCP Server] 生成 UIplan/heo-about-content-template.md 可填写表格
    status: completed
    dependencies:
      - style-about-page
  - id: verify-regression
    content: 校验 /about 与普通 slug 页显示、交互和移动端布局无回归
    status: completed
    dependencies:
      - deliver-content-template
---

## User Requirements

为 `heo` 主题创建一个个性化的 `/about` 页面，视觉风格参考 `c:/Users/RHZ/Downloads/blogNext/新主题/about` 下的参考文件。页面需包含个人简介、技能展示、经历时间轴等核心模块，并提供一份便于自行填写的个人信息内容模板。
页面需保持整体布局美观、层次清晰，适配桌面端与移动端，兼容明暗主题与现有主题导航/页脚结构。

## Product Overview

该页面是 `heo` 主题下的独立关于我展示页，不改变站点现有通用文章路由方式，但在访问 `/about` 时呈现更强定制化的专属内容区块。视觉上应比普通文章页更具展示感，形成封面式介绍、卡片式技能区、时间轴经历区与补充信息区的连续浏览体验。

## Core Features

- 专属 About 首屏：展示头像/标题/简介/核心标签或状态信息
- 技能展示模块：以卡片或标签矩阵呈现技能项、熟练度或方向
- 经历时间轴模块：按时间顺序展示学习、工作、项目或成长节点
- 信息补充模块：支持兴趣、联系方式、项目亮点或个人宣言等内容
- 可填写内容模板：提供表格/结构化占位内容，方便后续自行补全
- 响应式体验：在手机、平板、桌面下保持良好的排版、间距和阅读节奏

## Tech Stack Selection

- 现有项目为 **Next.js 14 + React 18**，主题实现以 `pages` 路由和主题布局分发为主
- 样式体系以 **Tailwind CSS** + `style jsx global` 为主，`themes/heo/style.js` 为主题样式总入口
- 当前 `/about` 走 `pages/[prefix]/index.js` → `DynamicLayout` → `themes/heo/index.js` 中的 `LayoutSlug`

## Implementation Approach

采用“**在现有 `LayoutSlug` 内为 `/about` 做精确分支渲染**”的方式实现，而不是新增独立路由体系。这样可以复用现有 slug 数据获取、主题分发、头部/页脚/暗黑模式能力，同时把改动控制在 `heo` 主题内部，避免影响其他主题与通用页面。

高层实现方式：

1. 在 `themes/heo/index.js` 中识别当前 `post.slug === 'about'`（或等价条件）；
2. `/about` 时切换到新的 About 专属组件树；
3. 普通 slug 页面继续走当前 `NotionPage` 文章渲染流程，保持兼容；
4. 将 About 内容拆为独立组件与数据文件，便于后续自行填写与维护；
5. 在 `themes/heo/style.js` 中补充 About 页面专属样式，并复用现有 `heo-card`、颜色变量、暗黑模式变量。

## Implementation Notes

- **路由与数据链路已确认**：`c:/Users/RHZ/Downloads/blogNext/pages/[prefix]/index.js` 会为一级 slug 页面注入 `post`，因此 `/about` 无需新增数据获取入口。
- **最小影响面**：优先只改 `themes/heo/index.js`、`themes/heo/style.js`，并新增 `themes/heo/components/about/` 目录承载专属 UI。
- **内容维护方式**：新增结构化数据文件承载简介、技能、时间轴、统计信息等；同时提供一份可填写模板，降低后续改文案成本。
- **性能**：About 页尽量使用静态数据与轻量组件，避免新增复杂运行时逻辑；图片/装饰资源优先复用现有能力，避免引入额外包与大体积依赖。
- **可靠性**：普通文章页、加锁文章、评论区、目录按钮等现有 `LayoutSlug` 行为需保持原样，不对非 about 页面做结构性回归。

## Architecture Design

当前确认的结构关系如下：

- `c:/Users/RHZ/Downloads/blogNext/pages/[prefix]/index.js`：一级 slug 路由入口，负责加载 `post`
- `c:/Users/RHZ/Downloads/blogNext/conf/layout-map.config.js`：将 `'/[prefix]'` 映射到 `LayoutSlug`
- `c:/Users/RHZ/Downloads/blogNext/themes/heo/index.js`：`heo` 主题的 `LayoutSlug`，是 About 页面改造核心入口
- `c:/Users/RHZ/Downloads/blogNext/components/NotionPage.js`：通用 Notion 内容渲染器，普通 slug 继续复用
- `c:/Users/RHZ/Downloads/blogNext/themes/heo/style.js`：About 页面专属样式与响应式细节的主要落点

About 页面建议结构：

- `LayoutSlug`
- 判断是否为 `/about`
- `HeoAboutPage`
    - Hero 简介区
    - 技能区
    - 时间轴区
    - 补充信息区
- 普通 slug 继续使用现有文章布局

## Directory Structure

## Directory Structure Summary

本次实现建议把 About 页面能力封装在 `heo` 主题内部，新增专属组件目录与内容数据文件，并只对主题入口和样式入口做必要改造。

```text
c:/Users/RHZ/Downloads/blogNext/
├── themes/
│   └── heo/
│       ├── index.js                       # [MODIFY] 主题 LayoutSlug 入口。识别 /about 并切换到专属 About 布局；普通 slug 保持现有文章页逻辑不变。
│       ├── style.js                       # [MODIFY] 补充 About 页面全局样式、响应式断点、暗黑模式与卡片/时间轴视觉规则，复用现有 heo 设计变量。
│       └── components/
│           └── about/
│               ├── AboutPage.js           # [NEW] About 页面容器组件。组装各模块并与 heo 页头/页脚/主题环境对齐。
│               ├── AboutHero.js           # [NEW] 首屏简介模块。展示头像、标题、副标题、状态标签、摘要信息。
│               ├── AboutSkills.js         # [NEW] 技能展示模块。渲染技能卡片/标签矩阵及可选熟练度信息。
│               ├── AboutTimeline.js       # [NEW] 经历时间轴模块。按时间顺序展示经历节点与说明。
│               ├── AboutExtras.js         # [NEW] 补充信息模块。承载兴趣、联系方式、项目亮点或个人宣言等内容。
│               └── about.data.js          # [NEW] About 页面结构化数据源。集中维护简介、技能、时间轴、补充信息，并留出清晰注释供自行填写。
└── UIplan/
    └── heo-about-content-template.md      # [NEW] 可填写信息表模板。用表格列出头像、简介、技能、经历、链接等字段，便于用户先填内容再落代码。
```

## Key Code Structures

建议新增一个结构化数据对象供 About 页面消费，避免把内容硬编码在 JSX 中：

```ts
type AboutPageData = {
  profile: {
    name: string
    title: string
    summary: string
    location?: string
    tags?: string[]
    stats?: Array<{ label: string; value: string }>
  }
  skills: Array<{
    group: string
    items: Array<{ name: string; level?: string; description?: string }>
  }>
  timeline: Array<{
    period: string
    title: string
    organization?: string
    description: string
  }>
  extras?: Array<{
    title: string
    content: string
    link?: string
  }>
}
```

## Design Approach

页面采用基于 `heo` 现有卡片语言的高级展示页方案，参考 `新主题/about` 的氛围感与信息编排方式，但不脱离当前主题整体视觉。桌面端强调首屏展示与分区层次，移动端改为单列流式卡片布局，保持阅读顺序自然。

## Page Planning

### 页面：About

- 顶部导航：延续现有 heo 导航，不单独重造
- 首屏简介区：大标题、个性签名、头像/主视觉、状态标签、关键数据
- 技能展示区：分组技能卡片，支持标签、熟练度、方向说明
- 经历时间轴区：纵向时间轴卡片，展示关键阶段与项目节点
- 补充信息区：兴趣、联系方式、个人说明、外链入口
- 底部页脚：延续现有 heo 页脚，保证全站一致性

## Interaction & Responsiveness

- 卡片 hover 轻微上浮与阴影增强，保持 heo 主题已有动态感
- 模块入场使用轻量渐进动画，不增加重脚本依赖
- 移动端缩减装饰背景、增大文字行距、改为单列卡片与紧凑时间轴

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 继续核对 `heo` 主题内部可复用组件、about 参考资源结构以及潜在影响点，避免遗漏普通 slug 页面回归风险
- Expected outcome: 输出更完整的落点清单与复用建议，确保 About 专属实现边界清晰

### MCP

- **Claude Text Editor MCP Server**
- Purpose: 在实施阶段持续编辑与整理新增组件、数据文件、样式和内容模板
- Expected outcome: 高效完成多文件改动，保持组件拆分、注释和文件组织清晰一致致