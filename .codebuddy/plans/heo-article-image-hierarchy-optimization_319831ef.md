---
name: heo-article-image-hierarchy-optimization
overview: 基于已写入 UI 文档的正文单图规范，先以最小范围优化桌面端正文单图的视觉强度与阅读节奏，优先通过 `style.js` 收敛普通单图，并保留 `gallery` 的适度展示差异。
todos:
  - id: verify-boundary
    content: 使用[subagent:code-explorer]复核 NotionPage.js 与 style.js 的单图分级边界
    status: completed
  - id: tune-single-image-style
    content: 调整 themes/heo/style.js 中正文普通单图宽度高度留白与阴影
    status: completed
    dependencies:
      - verify-boundary
  - id: rebalance-caption-gallery
    content: 微调 caption 与 gallery 强弱关系，保持正文主阅读优先
    status: completed
    dependencies:
      - tune-single-image-style
  - id: evaluate-semantic-gap
    content: 评估 components/NotionPage.js 是否仍需最小语义补充
    status: completed
    dependencies:
      - rebalance-caption-gallery
  - id: ux-review
    content: 使用[skill:ui-ux-pro-max]复核封面单图gallery主次与阅读节奏
    status: completed
    dependencies:
      - evaluate-semantic-gap
  - id: lint-and-regression
    content: 检查相关文件 lint，并回归桌面端暗色模式与专注阅读态
    status: completed
    dependencies:
      - ux-review
---

## User Requirements

- 基于现有 `heo` 主题 UI 文档与代码实现，继续推进“正文普通单图过强”的问题处理方案，但当前阶段仍以**先规划、后执行**为主。
- 将已确认的设计结论落实为可执行方案：正文普通单图应回归正文媒体块身份，避免形成“第二主视觉”。
- 优先面向**桌面端正文普通单图**做最小范围优化，不扩大到整套媒体系统重构。
- 以现有文档为准，保持 `UIplan/UI_DEVELOPMENT_GUIDE.md` 中 `16.8.3.6` 系列章节与后续实施一致。

## Product Overview

- 当前调整对象是文章页正文中的普通图片展示方式。
- 目标视觉效果是：图片仍有质感与卡片边界，但明显服从正文阅读节奏，不再过满、过重、过像海报。
- 页面层级应重新稳定为：页头封面负责开场，正文负责主阅读，gallery 负责局部展示。

## Core Features

- 统一正文普通单图、gallery、caption 的层级关系与阅读角色。
- 收敛正文普通单图的宽度、高度、留白、阴影与 hover 强度。
- 保持现有 gallery 组合展示能力，但避免与普通单图共享同级展示势能。
- 在不必要时不改正文渲染结构，仅在确有需要时补充最小语义标识。

## Tech Stack Selection

- 现有项目基于 **Next.js / React** 前端架构运行，正文渲染由 `react-notion-x` 驱动。
- 正文媒体语义增强集中在 `c:/Users/RHZ/Downloads/blogNext/components/NotionPage.js`。
- `heo` 主题视觉规则集中在 `c:/Users/RHZ/Downloads/blogNext/themes/heo/style.js`。
- UI 规范文档集中在 `c:/Users/RHZ/Downloads/blogNext/UIplan/UI_DEVELOPMENT_GUIDE.md`。

## Implementation Approach

- 采用“**先最小样式收敛，后再评估语义补充**”的策略：先复用现有 `heo-article-block--image`、`heo-image-gallery-row`、`heo-article-caption` 语义基础，优先在 `themes/heo/style.js` 中完成桌面端正文普通单图的第一轮降级。
- 高层做法是将普通单图从当前偏展示型卡片样式，调整为更克制的正文媒体块；gallery 保持轻度更强的组合展示感；caption 继续作为语义补充层强化归属。
- 关键决策：
- **优先不改 DOM 结构**：`components/NotionPage.js` 已具备基础分流能力，直接修改结构会扩大影响面。
- **优先最小 blast radius**：只处理桌面端普通单图核心问题，不同步重构所有媒体块。
- **保留扩展口**：若未来需要“展示型大图”语义，再在 `NotionPage.js` 增补更细粒度标识。
- 性能与可靠性：
- 当前方案以 CSS 收敛为主，时间复杂度与现状一致，不新增运行时遍历成本。
- 若后续需要补语义，仅复用已有 `MutationObserver + applyArticleReadingEnhancements` 链路，避免再引入重复扫描。
- 风险点主要在样式回归：需重点检查桌面端正文、gallery、caption、暗色模式、专注阅读态是否被误伤。

## Implementation Notes

- 复用现有正文 token：如 `--heo-article-surface-max-width`、`--heo-article-block-gap`、`--heo-article-media-radius`，避免散写新常量。
- 普通单图优先通过**宽度上限、最大高度、边界强度、hover 弱化**解决，不先引入新交互。
- 保持 `gallery` 独立容器逻辑不变，避免第一轮把多图编排一起重做。
- 如需修改 `components/NotionPage.js`，仅允许补最小语义，不改渲染主链、不改图片缩放与现有媒体增强顺序。
- 执行后仅检查并修复本次改动涉及文件的 lint 问题，不做无关重构。

## Architecture Design

- `components/NotionPage.js`
- 负责正文媒体语义增强入口
- 现有职责包括：单图识别、gallery 行识别、caption 语义补齐
- `themes/heo/style.js`
- 负责文章页阅读系统与正文媒体视觉样式
- 本轮优先承接普通单图最小可用优化
- `UIplan/UI_DEVELOPMENT_GUIDE.md`
- 作为本轮设计依据与验收标准来源
- 已包含 `16.8.3.6` 规范、实施计划与 TODO 清单

## Directory Structure

## Directory Structure Summary

本次计划以桌面端正文普通单图最小优化为核心，优先复用现有正文媒体语义，不扩大到整套媒体系统重构。

c:/Users/RHZ/Downloads/blogNext/
├── UIplan/
│   └── UI_DEVELOPMENT_GUIDE.md  # [MODIFY/已完成规划基线] 正文单图设计规范、实施计划与 TODO 已归档。后续实现需严格对齐 `16.8.3.6` 系列章节，作为验收依据。
├── components/
│   └── NotionPage.js  # [POTENTIAL MODIFY] 正文媒体语义增强入口。仅当样式层无法满足单图/展示型图片进一步分级时，才补最小语义标识；不应重写正文渲染结构。
└── themes/
└── heo/
└── style.js  # [MODIFY] 本轮主要落地文件。负责收窄正文普通单图默认宽度、控制最大高度、调整留白、减轻阴影与 hover，并保持 gallery 相对更强但不过度的展示感。

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 在真正执行前再次核对 `NotionPage.js` 与 `style.js` 的影响面、选择器命中和潜在回归点
- Expected outcome: 输出可靠的修改边界，避免误伤 gallery、caption 与其他正文媒体块

### Skill

- **ui-ux-pro-max**
- Purpose: 复核正文单图、gallery、caption 与页头封面的层级关系是否符合既定阅读系统
- Expected outcome: 确认样式调整后视觉主次清晰，普通单图回归正文媒体块身份