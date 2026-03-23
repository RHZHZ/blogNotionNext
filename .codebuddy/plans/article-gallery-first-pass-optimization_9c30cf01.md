---
name: article-gallery-first-pass-optimization
overview: 针对正文 `gallery` 制定第一轮最小优化方案，重点减轻外层卡片感、加强组内秩序，并保持其作为正文局部展陈的定位。
design:
  architecture:
    framework: react
    component: shadcn
  styleKeywords:
    - Minimalism
    - Editorial
    - Quiet hierarchy
    - Soft card reduction
    - Reading-first
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 30px
      weight: 600
    subheading:
      size: 18px
      weight: 500
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#94A3B8"
      - "#CBD5E1"
    background:
      - "#FFFFFF"
      - "#F8FAFC"
      - "#0F172A"
    text:
      - "#1E293B"
      - "#64748B"
      - "#E2E8F0"
    functional:
      - "#10B981"
      - "#F59E0B"
      - "#EF4444"
      - "#3B82F6"
todos:
  - id: verify-gallery-boundary
    content: 使用[subagent:code-explorer]复核 style.js 与 NotionPage.js 的 gallery 命中边界
    status: completed
  - id: tune-gallery-container
    content: 调整 themes/heo/style.js 的 gallery 容器背景边框阴影与留白
    status: completed
    dependencies:
      - verify-gallery-boundary
  - id: refine-gallery-internal-order
    content: 优化 style.js 中 gallery 列布局、图片圆角裁切与 caption 节奏
    status: completed
    dependencies:
      - tune-gallery-container
  - id: review-gallery-hierarchy
    content: 使用[skill:ui-ux-pro-max]复核封面单图gallery主次与阅读节奏
    status: completed
    dependencies:
      - refine-gallery-internal-order
  - id: regression-check-gallery
    content: 检查 style.js lint 并回归桌面端移动端与暗色模式效果
    status: completed
    dependencies:
      - review-gallery-hierarchy
---

## User Requirements

继续推进正文 `gallery` 的第一轮最小优化，先不改 DOM 结构，优先通过样式策略让 `gallery` 从“偏强卡片组件”收回到“正文中的局部展陈单元”。本轮重点是减轻外层容器的背景、边框、阴影与整体包裹感，同时增强组内图片的秩序感、间距稳定性和说明文案归属感。

## Product Overview

优化后的正文 `gallery` 仍然会保留比普通单图略强的展示感，但不会像独立模块或第二封面那样抢正文主阅读。视觉上应更安静、更有编辑感，读者首先感知到的是“一组相关图片”，而不是一个很重的卡片壳。

## Core Features

- 收敛正文 `gallery` 外层容器卡片感，降低背景、边框、阴影存在感
- 优化组内列布局、图片圆角、裁切与间距，提升整组一致性
- 调整 `gallery` 内 caption 的归属与节奏，使其更像整组说明
- 回归检查普通单图、`gallery`、页头封面的强弱层级，以及暗色模式和移动端稳定性

## Tech Stack Selection

- 现有项目：Next.js / React 体系
- 现有实现入口：`c:/Users/RHZ/Downloads/blogNext/themes/heo/style.js`
- 现有语义入口：`c:/Users/RHZ/Downloads/blogNext/components/NotionPage.js`

## Implementation Approach

采用“只调样式、不扩语义”的最小可用方案：复用现有 `.notion-row.heo-image-gallery-row` 与列内图片规则，优先把 `gallery` 的强度从外层容器转移到内部编排。高层做法是同步收敛容器背景/阴影/边框，微调列间距、列内节奏、图片圆角与 caption 关系，避免引入新的 DOM 依赖和数量分流逻辑。

关键决策：

- 不先改 `NotionPage.js`，因为已确认 `markBlocks('.notion-row.heo-image-gallery-row', 'gallery', ...)` 足以提供稳定命中边界。
- 不引入 2/3/4+ 数量分级，先稳定通用规则，降低回归面。
- 保持普通单图现有规则不被误伤，所有选择器尽量限定在 `heo-image-gallery-row` 容器内。

性能与可靠性：

- 本轮仅修改样式，运行时复杂度不变，无新增 JS 遍历或监听。
- 风险主要是选择器覆盖范围，需重点控制普通单图与移动端覆盖链。
- 避免新增大面积阴影、复杂滤镜，减少绘制负担。

## Implementation Notes

- 复用现有 `gallery` 容器、列、列内图片、caption 规则，不做无关重构。
- 暗色模式需同步收敛容器阴影，避免比亮色模式更像独立卡片。
- 移动端以稳定压缩和触屏阅读为先，不机械套用桌面端增强效果。
- 仅检查本次涉及文件的 lint 与样式回归，控制 blast radius。

## Architecture Design

现有结构已满足本轮需求：

- `components/NotionPage.js`：提供 `gallery` 语义标记与阅读增强入口
- `themes/heo/style.js`：统一承接正文媒体样式分级
本轮仅在样式层调整 `gallery` 呈现，不改变组件关系与数据流。

## Directory Structure

## Directory Structure Summary

本次实现以现有样式体系为核心，仅做小范围正文 `gallery` 视觉层级优化。

c:/Users/RHZ/Downloads/blogNext/
├── themes/
│   └── heo/
│       └── style.js  # [MODIFY] 正文 gallery 样式主入口。收敛外层容器卡片感，微调组内列布局、图片圆角/裁切/间距、caption 归属，并兼顾桌面端、移动端、暗色模式回归。
└── components/
└── NotionPage.js  # [AFFECTED] 已有 gallery 语义入口的依赖文件。本轮原则上不改，仅作为边界确认与后续扩展保底。

## Design Approach

延续当前博客的克制阅读气质，把正文 `gallery` 设计为“安静、整洁、带编辑感的局部图组”。外层容器弱化存在感，视觉重点转向组内图片关系、节奏和秩序；整组与正文保持连续，不制造独立舞台感。

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 复核 `gallery` 相关选择器、覆盖链与潜在误伤范围
- Expected outcome: 输出可靠的样式命中边界，确保只优化 `gallery` 不误伤普通单图

### Skill

- **ui-ux-pro-max**
- Purpose: 从阅读层级与视觉秩序角度复核 `gallery` 的强弱关系
- Expected outcome: 确认外层收敛、组内增强后的视觉方案符合博客正文气质

## 本次 UI 调整总结（追加归档）

### 调整目标演进

本次正文 `gallery` 调整已经从最初的“第一轮最小优化”扩展为一组连续的 UI 收敛工作，核心目标始终保持一致：**让 `gallery` 更像正文中的局部图组，而不是独立卡片或第二封面。**

在执行过程中，目标从“先减轻外层卡片感”逐步演进为三层结构：

- **第一层**：收敛 `gallery` 外层容器的背景、边框、阴影与整体包裹感。
- **第二层**：把视觉强度从外壳转移到组内秩序，包括列布局、图片圆角、裁切、caption 节奏。
- **第三层**：根据图组真实结构做分型，而不是让所有多图共用同一套样式逻辑。

### 已完成的实现结论

#### 1. 容器层级收敛

`themes/heo/style.js` 中正文 `gallery` 的基础容器已经完成收敛：

- 亮色与暗色模式下的背景、边框、阴影都比原先更轻。
- `gallery` 保留局部展陈感，但不再像单独浮起的大卡片。
- 移动端继续以稳定、紧凑、触屏友好为主，不强行复制桌面端强化效果。

结论：**`gallery` 的存在感已经从“壳体显眼”转为“内部编排显眼”。**

#### 2. 作用域与选择器安全性提升

早期 `gallery` 相关图片与 caption 规则曾借助更泛的 `.notion-column` 命中。后续已全部收口到 `heo-image-gallery-row` 范围内：

- `gallery` 列内图片规则只作用于 `gallery`
- `gallery` caption 规则只作用于 `gallery`
- 普通单图、普通列布局、其他 Notion 媒体块的误伤风险明显下降

结论：**本次调整不仅是视觉优化，也是一次样式边界治理。**

#### 3. 数量分型已建立

`components/NotionPage.js` 已从只识别 `gallery` 行，扩展为给正文图组写入更稳定的结构信号：

- `data-heo-gallery-count`
- `data-heo-gallery-cols`
- `data-heo-gallery-image-count`
- `data-heo-gallery-pattern`
- `data-heo-gallery-mixed`
- `data-heo-gallery-stacked-column`

这使 `style.js` 可以区分：

- **普通双图**：更舒展、成组感更强
- **三图**：更均衡
- **四图及以上**：更整齐、更像规则图阵
- **混排双列**：一侧堆叠、一侧单图，采用编辑式主次关系

结论：**正文 `gallery` 已经从“统一样式”进入“按图组结构分型”的阶段。**

#### 4. 混排型 gallery 已纳入正式规则

针对实际截图验证出的典型案例——**双列结构中一侧为堆叠图，另一侧为单张主图**——已完成专门识别与样式处理：

- 桌面端允许左右不完全等高
- 强调主次关系，而非机械齐平
- 通过左右宽比、堆叠间距、单图高度与圆角差异，让图组更像编辑排版

并且已经确认：

- **左右高度不完全一致是正常的**
- 关键不在于绝对等高，而在于整体重心是否稳定、落差是否舒服

结论：**混排型 `gallery` 不再被误当作普通双图，而是被视为正文中的“主次型图组”。**

#### 5. 规则图阵与混排图组已经概念分离

在后续截图中又确认了一类新的边界：有些双列多图实际上更接近 `2 × 2` 阵列，而不是混排主次图组。对此已明确新的设计判断：

- **混排型**：一侧堆叠、一侧单图，强调主次
- **规则阵列型**：整体更接近均匀网格，强调整齐与一致性

当前代码层已经具备继续往这两个方向分化的基础，后续若继续优化，应避免把所有双列多图都归到“混排型”。

结论：**本次迭代已经建立了正文图组的结构判断框架，后续可以继续细化，而不需要推翻。**

### 桌面端与移动端策略结论

#### 桌面端

桌面端允许更明显的结构表达：

- 普通双图偏舒展
- 混排图组允许主次、高差与轻微不对称
- 四图阵列更接近规则网格

桌面端的核心目标是：**让图组具备编辑感，而不是只有可用性。**

#### 移动端

移动端不追求机械继承桌面混排关系，而以“稳定阅读”和“单张可看性优先”为准：

- 保持更朴素、更安全的排法是合理的
- 不强行做复杂主次关系
- 即使出现“前两张一行、第三张换行”的情况，也属于可接受且合理的移动端表达

移动端的核心目标是：**保证滚动节奏自然，不为设计感牺牲阅读感。**

### 当前阶段判断

综合多轮实际截图验证，目前正文 `gallery` 的状态可以定义为：

- **已完成从重卡片到轻图组的转型**
- **已完成从统一样式到结构分型的升级**
- **已把典型混排图组纳入设计系统**
- **已明确桌面端与移动端采取不同策略是合理的**

当前阶段已经不属于“返工期”，而是进入了**精修与边界细化期**。

### 后续建议

若继续演进，建议按以下顺序推进：

1. **规则四图阵列单独分型**
   - 将接近 `2 × 2` 的图组从混排型中进一步分离。
2. **正文图组与上下段落呼吸感继续统一**
   - 把注意力从图组内部转向图组与段落之间的节奏关系。
3. **仅在出现新样本时继续加类型**
   - 避免过早做过细分型，保持当前体系克制可维护。

### 最终归档结论

本次正文 `gallery` UI 调整的最终方向已经明确：**`gallery` 不是第二封面，也不是普通单图的简单复制，而是正文阅读系统中的局部图组模块。**

它的视觉价值不再来自更重的背景、边框、阴影，而来自：

- 更轻的外层容器
- 更稳的组内秩序
- 更准确的结构分型
- 更符合设备场景的桌面 / 移动双策略

这套调整已经具备继续迭代的稳定基础，可作为后续正文媒体系统设计的正式参考。