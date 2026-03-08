---
name: heo-post-footer-refactor
overview: 统一 HEO 文章页正文结束后到评论区前的页脚区域，先建立统一容器与节奏，再收口版权、相邻文章、分享区和推荐区组件。
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
  - id: sync-footer-plan
    content: 更新 `HEO_COMPONENT_REFACTOR_TODO.md`，固化文章页脚最新优先级与落地约束
    status: completed
  - id: build-footer-shell
    content: 使用 [subagent:code-explorer] 核对调用链后调整 `themes/heo/index.js` 与 `components/ShareBar.js`
    status: completed
    dependencies:
      - sync-footer-plan
  - id: refactor-copyright-card
    content: 收口 `themes/heo/components/PostCopyright.js` 为版权信息卡，弱化作者展示与主按钮
    status: completed
    dependencies:
      - build-footer-shell
  - id: align-adjacent-section
    content: 收口 `themes/heo/components/PostAdjacent.js`，支持单边场景并统一浮动入口语言
    status: completed
    dependencies:
      - build-footer-shell
  - id: align-recommend-section
    content: 收口 `themes/heo/components/PostRecommend.js`，统一推荐区节奏与移动端展示策略
    status: completed
    dependencies:
      - build-footer-shell
  - id: footer-regression
    content: 回归检查文章页脚亮暗色、移动端热区、评论区过渡与 lint
    status: completed
    dependencies:
      - refactor-copyright-card
      - align-adjacent-section
      - align-recommend-section
---

## User Requirements

继续推进 `HEO` 主题文章页脚区域的 UI 收口，更新相关计划后，按已确认顺序继续完成未完成任务。改造范围聚焦正文结束后到评论区前的区域，不扩散到导航、Hero 等已归档模块。

## Product Overview

文章页脚需要形成连续、统一的 section / card 视觉体系。页面效果应从正文自然过渡到分享、版权说明、上一篇/下一篇、相关文章和评论区，整体层级清晰、间距稳定、亮暗色一致，避免出现孤立模块和风格跳变。

## Core Features

- 统一 `themes/heo/index.js` 中正文结束后的外层容器、分区间距与评论区前过渡
- 在 `HEO` 文章页正式接入 `ShareBar`，让分享区成为轻量 section，而非游离模块
- 将 `PostCopyright.js` 从强视觉作者展示卡收口为版权 / 署名 / 协议信息卡
- 将 `PostAdjacent.js` 并入统一页脚体系，优化单边缺失场景与桌面端浮动入口风格
- 将 `PostRecommend.js` 作为页脚收尾推荐区，保持轻量推荐卡网格与统一节奏

## Tech Stack Selection

- 框架：Next.js（Pages Router）+ React
- 语言：JavaScript
- 样式体系：Tailwind 工具类 + `themes/heo/style.js` 中的主题样式基座
- 现有模式：组件化页面结构，`themes/heo/index.js` 负责文章页装配，具体 UI 分散在 `themes/heo/components/*` 与通用组件 `components/*`

## Implementation Approach

采用“先结构节奏、后组件收口”的方式推进：先在 `themes/heo/index.js` 中建立统一 article-footer 容器并接入 `ShareBar`，再依次收口版权卡、相邻文章、推荐区，确保所有页脚模块挂载到同一套外层语义和间距体系。

关键决策：

- 复用现有 `HEO` 卡片语言，不新开视觉体系；优先沿用当前圆角、边框、阴影、亮暗色映射
- `PostCopyright.js` 作为本轮主修对象，从“作者展示卡”降级为“信息说明卡”，避免抢占页脚主视觉
- `PostAdjacent.js` 保留现有双卡结构和浮动入口逻辑，只做语义收口与边界优化，减少返工
- `PostRecommend.js` 维持现有推荐卡网格方向，重点统一外层 section 节奏，避免过度重做
- `ShareBar.js` 改为由外层容器控制节奏，减少固定内边距造成的重复包裹

性能与可靠性：

- 主要变更为渲染结构与样式层，时间复杂度保持 O(n) 渲染，不引入额外数据请求
- `PostAdjacent.js` 的 `IntersectionObserver` 保留现有机制，仅收敛触发条件和展示逻辑，避免新增滚动监听开销
- 尽量不触碰正文渲染、评论系统和广告加载链，降低回归风险

## Implementation Notes

- 优先复用 `themes/heo/components/Card.js` 的 `heo-card / heo-card__body / heo-card--interactive` 语义，避免在页脚组件继续散写独立卡片语言
- `themes/heo/index.js` 已是页脚割裂的主要来源，所有 spacing、divider、section 顺序应先在这里收口
- `components/ShareBar.js` 已接入多主题，改动需保持向后兼容，新增能力应尽量通过可选 `className` 或轻量结构调整实现
- `PostAdjacent.js` 当前要求 `prev && next` 同时存在才显示，若改为单边显示需保留桌面/移动端布局稳定，不影响已有页面
- 避免修改评论区内部逻辑，只处理评论区前的过渡和容器节奏
- 完成每个文件后应做针对性 lint/回归，控制影响面在文章页脚链路内

## Architecture Design

当前改造链路：

- `themes/heo/index.js`：文章详情页装配入口，负责正文后区域的统一外层结构
- `components/ShareBar.js`：通用分享区组件，在 `HEO` 中作为文章页脚 section 使用
- `themes/heo/components/PostCopyright.js`：版权说明信息卡
- `themes/heo/components/PostAdjacent.js`：上一篇/下一篇导航区与桌面浮动入口
- `themes/heo/components/PostRecommend.js`：相关文章推荐区
- `themes/heo/components/Card.js` / `themes/heo/style.js`：现有卡片基座与主题样式参考

## Directory Structure

## Directory Structure Summary

本轮实现聚焦 `HEO` 文章页脚区域统一收口，优先修改已有装配入口与页脚相关组件，不新增无必要文件。

c:/Users/RHZ/Downloads/blogNext/
├── HEO_COMPONENT_REFACTOR_TODO.md  # [MODIFY] 更新文章页脚改造计划，记录当前代码现状、最新优先级与实施顺序，作为本轮执行依据。
├── components/
│   └── ShareBar.js  # [MODIFY] 通用分享栏组件。去除固定外层节奏，支持由 HEO 页脚外层统一控制间距；保持其他主题兼容。
└── themes/
└── heo/
├── index.js  # [MODIFY] 文章详情页装配入口。建立统一 article-footer 容器，串联分享、版权、相邻文章、推荐区与评论区前过渡。
├── style.js  # [MODIFY][按需] 若现有 Tailwind 类不足，补充少量页脚相关 token/语义样式；仅在确有重复值或难以表达时修改。
└── components/
├── Card.js  # [AFFECTED] 作为现有卡片基座参考文件，原则上优先复用，不建议无必要改动。
├── PostCopyright.js  # [MODIFY] 从强视觉作者卡收口为版权/署名/协议/原文链接信息卡，弱化主 CTA，保留必要作者入口。
├── PostAdjacent.js  # [MODIFY] 对齐新的页脚 section 语义，优化单边显示与桌面浮动入口的同体系表现。
└── PostRecommend.js  # [MODIFY] 保持推荐网格方向，统一外层 section 节奏、边界与移动端展示策略。

## Design Approach

延续当前 `HEO` 已建立的卡片基座，采用“中性色基底 + 弱强调 + 清晰分区”的页脚设计。正文结束后先进入轻量分享区，再过渡到版权说明卡、相邻文章导航卡、相关文章推荐区，最后以柔和分隔进入评论区，形成稳定的阅读收尾节奏。

### 页面区块关系

1. 分享区：轻量 section，标题弱化，操作区整齐排列，不抢正文余韵  
2. 版权信息卡：信息优先，作者与协议说明清晰，避免大头像和高饱和按钮主导视觉  
3. 相邻文章区：作为页脚主导航视觉中心，双卡结构明确，移动端优先热区与堆叠稳定  
4. 相关文章区：比相邻文章更轻，卡片网格保持整齐，封面遮罩克制  
5. 评论过渡：仅承担收尾和切换作用，用轻分隔与稳定留白衔接评论卡

### 视觉气质

- 亮色模式：浅底深字、柔和阴影、边界可感知但不过厚
- 暗色模式：深底浅字、边框更淡、强调色更柔和
- 强调色仅用于 hover / focus / 当前态细节，不用于整块页脚铺底

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 对文章页脚改造链路涉及的入口文件、组件文件与样式参考进行多文件关联核查，确认真实调用关系与影响范围
- Expected outcome: 产出基于真实文件路径和现有模式的可靠改造顺序，避免遗漏 `ShareBar` 接入链路、`PostAdjacent` 展示条件及页脚装配关系