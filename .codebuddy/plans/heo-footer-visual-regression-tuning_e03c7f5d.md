---
name: heo-footer-visual-regression-tuning
overview: 继续完成 `HEO` 文章页脚的视觉回归收口，聚焦移动端、暗色模式与悬浮相邻文章入口的层级微调，并在确认后实施最小范围样式调整。
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - 中性色卡片体系
    - 层级清晰
    - 轻玻璃感
    - 弱强调色
    - 文章阅读收尾
    - 暗色模式
    - 显色模式
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 28px
      weight: 600
    subheading:
      size: 18px
      weight: 600
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#3B82F6"
      - "#F59E0B"
    background:
      - "#FFFFFF"
      - "#F8FAFC"
      - "#1F2026"
    text:
      - "#0F172A"
      - "#475569"
      - "#F8FAFC"
    functional:
      - "#22C55E"
      - "#EF4444"
      - "#F59E0B"
      - "#3B82F6"
todos:
  - id: audit-footer-visual-rules
    content: 使用 [subagent:code-explorer] 复核页脚相关样式命中范围与断点规则
    status: completed
  - id: lighten-mobile-recommend
    content: 微调 `themes/heo/components/PostRecommend.js` 与 `themes/heo/style.js`，降低移动端推荐区厚重感
    status: completed
    dependencies:
      - audit-footer-visual-rules
  - id: tone-down-dark-copyright
    content: 微调 `themes/heo/components/PostCopyright.js` 暗色背景、边框与内层信息块层级
    status: completed
    dependencies:
      - audit-footer-visual-rules
  - id: soften-floating-next-entry
    content: 微调 `themes/heo/components/PostAdjacent.js` 与 `themes/heo/style.js`，弱化悬浮下一篇入口
    status: completed
    dependencies:
      - audit-footer-visual-rules
  - id: verify-footer-regression
    content: 回归检查 `themes/heo/index.js`、`components/ShareBar.js` 与评论区过渡并做必要收口
    status: completed
    dependencies:
      - lighten-mobile-recommend
      - tone-down-dark-copyright
      - soften-floating-next-entry
  - id: ecf85735
    content: 如果有必要放弃在移动端展示默写组件为了降低厚重感
    status: completed
---

## 用户需求

继续推进未完成的 `HEO` 文章页脚视觉回归细调，范围限定在正文结束后到评论区前的页脚区域，不新增功能、不重做结构，只做小范围样式优化。

## Product Overview

当前文章页脚已经完成统一容器与模块接入，本轮重点是压低局部视觉噪音，让分享区、版权区、相邻文章区、推荐区在移动端与暗色模式下更轻、更稳、更连续；桌面端悬浮“下一篇”入口保留，但不应抢主内容。

## Core Features

- 调轻 `PostRecommend` 在移动端的厚重感，收窄卡片体量、阴影与图片区压迫感
- 压暗 `PostCopyright` 在暗色模式下的背景、边框和内层信息块层级
- 弱化 `PostAdjacent` 的桌面悬浮下一篇入口，降低存在感但保留可见性与可点击性
- 保持现有页脚结构、交互逻辑、单边相邻文章显示能力与评论区过渡不变

## Tech Stack Selection

- 现有项目为 Next.js + React 体系
- 样式主要通过 Tailwind 原子类与 `themes/heo/style.js` 的全局主题样式共同完成
- 本轮应复用现有 `HEO` 页脚组件拆分与主题样式方式，不引入新框架或新状态层

## Implementation Approach

采用“结构不动、样式微调、优先局部覆盖”的方式完成视觉回归：组件文件只调整必要的 className，主题级统一视觉约束优先落在 `themes/heo/style.js`，避免把细碎视觉规则散落到多个组件中。
关键决策是保留现有 `themes/heo/index.js` 的 `heo-post-footer` 组合顺序，以及 `PostAdjacent` 的单边显示/悬浮入口逻辑，只压缩移动端体量、降低暗色亮度和悬浮卡强调度，减少回归风险。

### Performance & Reliability

- 本次修改主要为静态样式调整，运行时复杂度不变，几乎无额外计算成本
- 不改动 `IntersectionObserver`、分享按钮动态加载、推荐列表渲染链路，避免引入重渲染或交互回归
- 风险点集中在暗色对比度、移动端热区和悬浮卡可读性，需逐项做亮暗色与断点回归

## Implementation Notes

- `themes/heo/index.js` 已确认使用 `heo-post-footer` + `space-y-6` 组织页脚，除非必要，不调整模块顺序
- `themes/heo/components/PostAdjacent.js` 已有 `pc-next-post` 悬浮入口与单边显示逻辑，优先调其卡片类名与主题 hover/focus 样式，不改观察器逻辑
- `themes/heo/components/PostRecommend.js` 已在移动端隐藏，以避免页脚区域霸屏；`md` 及以上继续保留推荐区
- `themes/heo/components/PostCopyright.js` 已压暗暗色模式背景与内层信息块层级，并将协议区缩为关键协议词，减少移动端重复信息
- `components/ShareBar.js` 当前已是轻量 section，经回归确认可继续沿用，无需额外补丁

## Archive Summary

本轮 `HEO` 文章页脚视觉回归已完成归档，最终落地结论如下：

- `PostRecommend`：完成移动端减重后，进一步在移动端直接隐藏相关文章区，避免页脚区域霸屏；`md` 及以上断点保留推荐区
- `PostCopyright`：暗色背景、边框、内层信息块和头像卡层级已压暗；协议区从重复说明文案收缩为关键协议名称，减小移动端高度
- `PostAdjacent`：桌面相邻文章卡与悬浮 `next post` 入口的 hover / shadow / border / opacity 已整体减弱，保留可见性与可点击性但不再抢主内容
- `ShareBar` / 评论区过渡：结构与顺序保持不变，当前节奏可稳定沿用
- 本轮修改均为局部样式收口，无新增 lint 问题
