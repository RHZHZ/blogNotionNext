# HEO 组件改造 TODO 单

> `UIplan/` 目录中的本文件用于保留当前阶段的组件改造规划镜像，方便集中讨论与阶段推进；正式完成状态、长期待办和最终归档以项目根目录下的同名文件为准。若出现差异，应优先以主目录版本校正。

> 本文件只保留组件推进顺序、完成状态与改造清单；移动端面板 / 抽屉 / 目录 / 搜索弹层 / 小屏阅读态的设计规范、归档结论与验收标准，统一以 `UI_DEVELOPMENT_GUIDE.md` 的 `16.*` 章节为准。

## 1. 目标
基于本次移动端抽屉菜单优化成果，逐步统一 `HEO` 主题中所有“移动端面板型组件”的结构、层级、色彩与交互语言，减少重复实现与风格分裂。

---

## 2. 已完成基线
以下组件已可视为当前基线，不作为本轮优先改造对象：

- [x] `themes/heo/components/SlideOver.js`
- [x] `themes/heo/components/MenuItemCollapse.js`
- [x] `themes/heo/components/TagGroups.js`
- [x] `themes/heo/components/MenuListSide.js`
- [x] `themes/heo/components/Header.js` 移动端菜单入口
- [x] `themes/heo/components/SideBarDrawer.js` 已完成受控抽屉化与路由切换自动关闭
- [x] `themes/heo/components/FloatTocButton.js` 已完成移动端目录面板统一与亮暗模式收敛
- [x] `themes/heo/components/Catalog.js` 已完成 `showHeader` / `variant='drawer'` 支持及目录高亮收敛
- [x] `themes/heo/components/CategoryBar.js` 已完成 chip / pill 化与移动端间距调整
- [x] `themes/heo/components/SearchNav.js` 已完成搜索页 hero + section + chip 体系统一
- [x] `themes/heo/components/SideRight.js` 已完成桌面右栏 section 化与面板语言统一
- [x] `themes/heo/components/LatestPostsGroupMini.js` 已完成从密集小卡片收敛为“纯列表文字 + 小缩略图角标”
- [x] `themes/heo/components/AnalyticsCard.js` 已完成统计信息小面板化

---

## 3. 高优先级

### 3.1 `themes/heo/components/SideBarDrawer.js`
**原因**：职责与移动抽屉高度重合，统一后收益大。

改造目标：
- [x] 对齐 `SlideOver` 的抽屉容器语义
- [x] 清理旧式侧滑样式差异
- [x] 统一 section 容器和内部内容卡片语言
- [x] 与移动端导航入口形成统一交互感受

### 3.2 `themes/heo/components/FloatTocButton.js`
**原因**：移动端目录是典型面板型交互，现有风格应并入同体系。

改造目标：
- [x] 浮动按钮与 `Header` 移动按钮统一入口语言
- [x] 目录面板统一为轻分区、轻边框、轻高亮
- [x] 当前阅读位置高亮改成克制样式
- [x] 避免目录项在暗色模式下出现硬描边

### 3.3 `themes/heo/components/CategoryBar.js`
**原因**：承担筛选导航职责，与标签/筛选 chip 高度相关。

改造目标：
- [x] 从旧式横向条带过渡到统一 chip / pill 风格
- [x] 支持更稳定的移动端换行或滚动策略
- [x] 统一选中态与计数信息样式
- [x] 与 `TagGroups` 共享相近状态逻辑

### 3.4 `themes/heo/components/SearchNav.js`
**原因**：仅在它仍承担本地筛选 UI 时，才需要向抽屉语言靠拢。

改造目标：
- [x] 分类/标签区域改为 section + chip 体系
- [x] 选中态与 hover 态向 `TagGroups` 靠拢
- [x] 收敛颜色与边框强度
- [x] 保证移动端换行与点击热区

### 3.5 `themes/heo/components/SideRight.js`
**原因**：桌面侧栏内容未来可作为移动端抽屉内容源复用。
- [x] 梳理内部模块哪些可抽成 section
- [x] 对齐标签、目录、信息块的风格基线
- [x] 为移动端抽屉复用做结构准备

---

## 4. 中优先级

### 4.1 `themes/heo/components/LatestPostsGroupMini.js`
**原因**：适合作为抽屉内二级列表模块复用。
- [x] 收敛卡片样式
- [x] 统一标题、辅助信息、点击态
- [x] 收敛为“纯列表文字 + 小缩略图角标”模式，降低右栏信息密度

### 4.2 `themes/heo/components/Header.js` 顶部操作组
**原因**：桌面 / 移动双态都高频出现，且当前已出现“按钮组容器、普通图标按钮、阅读进度 badge”三套语言并存的问题。
- [x] 统一右上角按钮组外层胶囊容器
- [x] 对齐 `SearchButton` / `RandomPostButton` / `DarkModeButton` / 移动端菜单按钮的圆角、边框、阴影与 focus 态
- [x] 保留 `hidden lg:flex` 与 `flex lg:hidden` 的双结构策略，移除样式层对响应式显隐的误覆盖

### 4.3 `themes/heo/components/MenuListTop.js`
**原因**：与导航域强相关，应逐步统一状态语言。
- [x] 对齐当前态高亮逻辑
- [x] 对齐图标 / 文字 / 箭头节奏
- [x] 与 `MenuItemDrop.js` 一并完成顶部导航 hover / focus-visible / current 状态语言统一

### 4.4 `themes/heo/components/TocDrawerButton.js`
**原因**：作为目录抽屉入口，应与移动端入口按钮体系统一。
- [x] 对齐按钮圆角、边框、阴影
- [x] 对齐 hover / active 微反馈
- [x] 避免与其他浮动按钮风格割裂

### 4.5 `themes/heo/components/MenuGroupCard.js`
**原因**：命名与职责都适合并入 section/card 体系。
- [x] 判断是否可复用 section 容器语义
- [x] 压缩多余边框与装饰
- [x] 统一标题与内容层级

### 4.6 `themes/heo/components/TouchMeCard.js`
**原因**：目前仍偏旧式翻转卡风格，是右栏中最明显未统一的一块。
- [x] 判断是否保留翻转交互
- [x] 收敛背景、边框、按钮与 badge 语言
- [x] 与 `SideRight` 新 section/card 体系对齐

### 4.7 `themes/heo/components/InfoCard.js`
**原因**：承担作者信息主卡职责，需确认是否继续作为独立视觉中心存在。
- [x] 梳理与右栏其他 section 的主次关系
- [x] 收敛 hover / 公告切换 / 社交按钮节奏
- [x] 评估是否继续保留当前强视觉 hero 形式
- [x] 完成亮色模式“浅蓝玻璃 + 深字”适配
- [x] 完成暗色模式“深蓝黑玻璃 + 亮字”适配

### 4.8 `themes/heo/components/Card.js` + `themes/heo/style.js`
**原因**：需要建立首页卡片与侧栏卡片统一基座，解决“导航新、正文旧”的主要割裂点。
- [x] 补齐卡片基础 token
- [x] 建立 `heo-card / heo-card__body / heo-card--interactive` 基座
- [x] 收敛首页与右栏卡片的基础圆角、边框、背景、阴影

### 4.9 `themes/heo/components/BlogPostCard.js`
**原因**：首页文章主卡片是最显眼的旧样式来源之一。
- [x] 接入统一卡片基座
- [x] 补齐 `heo-post-card` 语义 class
- [x] 把文章卡外层边界与封面分隔线补回半档

### 4.10 `themes/heo/components/Hero.js`
**原因**：Hero 是首页视觉中心，若仍保留旧式局部色块，会持续破坏首页统一感。
- [x] Banner / 推荐小卡 / TodayCard 主容器接入统一卡片基座
- [x] 清理 `Banner` hover 遮罩的旧式高饱和整块铺底
- [x] 清理 `GroupMenu` 三入口独立重色渐变语言
- [x] 统一 `TodayCard` 更多按钮与 Hero 内部局部交互节奏
- [x] 完成 Hero 最终收口：左右气质统一、去死板化、TodayCard 排版复位

### 4.11 `themes/heo/components/SideRight.js`
**原因**：右栏是卡片体系与信息密度最集中的区域，需要作为统一样板保持稳定。
- [x] 主 section 接入卡片基座
- [x] 补强右栏外层主卡边界感
- [x] 拉开主卡与内部列表项层级差

### 4.12 `themes/heo/components/TouchMeCard.js`
**原因**：需要保留个性，但不能脱离整体卡片语言。
- [x] 接入卡片基座
- [x] 保留翻转交互
- [x] 收敛到“个性卡但同体系”的实现方式

### 4.13 `themes/heo/components/SideBar.js`
**原因**：侧栏首页入口仍保留旧式头像 hover 语言，需要并入统一品牌卡与卡片基座体系。
- [x] 将首页入口改为统一品牌卡
- [x] 清理旋转 / 放大型旧 hover 动效
- [x] 接入 `heo-sidebar-brand-card` 相关语义类与卡片基座

### 4.14 `themes/heo/components/NavButtonGroup.js`
**原因**：首页分类入口按钮仍保留旧式大按钮玻璃皮肤，需要纳入统一入口卡语言。
- [x] 接入首页导航入口卡语义类
- [x] 清理旧式 `glassmorphism` / `border-2` / 放大 hover 语言
- [x] 保留分类入口逻辑，仅统一视觉与交互节奏

---

## 5. 低优先级

### 5.1 `themes/heo/components/MenuItemDrop.js`
- [ ] 仅在需要统一桌面导航语言时再处理

### 5.2 `themes/heo/components/LatestPostsGroup.js`
- [ ] 仅做卡片风格轻量收敛，不作为抽屉体系主任务

### 5.3 `themes/heo/components/SearchButton.js`
- [ ] 仅做入口按钮样式跟随

### 5.4 `themes/heo/components/RandomPostButton.js`
- [ ] 仅做按钮层级统一，不优先深改

## 5.5 `components/NotionPage.js` + `themes/heo/style.js`（正文阅读系统第一轮）
**原因**：文章页已完成头部、导航、目录与页脚等外围基线后，正文阅读系统需要先建立统一底座，否则文章页长期体验仍会停留在“外围新、正文旧”的割裂状态。
- [x] 建立正文阅读增强统一入口 `applyArticleReadingEnhancements`
- [x] 补齐正文 surface 语义：`data-heo-reading-surface` / `data-heo-article-surface` / `heo-article-surface`
- [x] 为 gallery 补齐 `data-heo-gallery` 与统一 block 语义标记
- [x] 补入正文基础阅读 token 与媒体块统一边界语言
- [x] 让 `AISummary` 与正文阅读壳共享同一阅读宽度约束
- [x] 修正文章首屏标题过早换行与小屏正文卡轻微重叠问题
- [x] 再收紧桌面端正文区与文章卡边框之间的横向距离半档
- [x] 将文章首屏信息区收口为头部区 / 标题区 / Meta 区三段式，并继续微调标题区上下节奏与字号比例
- [x] 第二轮继续细化 code / quote / callout / bookmark / embed / pdf 的层级节奏与块间关系

---

## 6. 推荐改造顺序
建议按以下顺序推进：

1. `SideBarDrawer.js`（已完成）
2. `FloatTocButton.js`（已完成）
3. `CategoryBar.js`（已完成）
4. `SearchNav.js`（已完成）
5. `SideRight.js`（已完成）
6. `LatestPostsGroupMini.js`（已完成）
7. `Card.js`（首页卡片与侧栏卡片统一基座）
8. `BlogPostCard.js`
9. `SideRight.js`（卡片基座复用补充）
10. `InfoCard.js`
11. `Hero.js`
12. `TouchMeCard.js`
13. `MenuListTop.js`
14. `TocDrawerButton.js`

---

## 7. 每个组件的统一验收标准
每完成一个组件，都要确认：
- [ ] 默认态清晰
- [ ] 当前态不突兀
- [ ] 暗色模式无套娃框
- [ ] accentColor 仅作点缀
- [ ] 图标、文字、箭头是同一体系
- [ ] 移动端点击热区足够
- [ ] 长文案和多数据情况下不拥挤

---

## 8. 本轮建议立即开始的对象
如果现在继续做代码改造，建议从以下一个开始：

### 首选：`themes/heo/components/Card.js` + `themes/heo/style.js`
原因：
- 当前最主要的问题已经不是单个按钮或单个右栏组件，而是首页卡片与侧栏卡片缺少统一基座。
- `Card.js` 当前实现较薄，最适合作为首页文章卡片、右栏 section 卡片、信息卡共同复用的入口。
- 先建立卡片 token 和通用容器语言，再改 `BlogPostCard.js`、`SideRight.js`、`Hero.js`，可以避免重复返工。
- 这一轮的目标应是先解决“导航新、正文旧”的整体割裂，再处理局部增强。

### 15.19 第四轮统一归档（移动端抽屉菜单 / 二级菜单 / 标签与快捷入口收口）
本轮继续围绕移动端抽屉菜单做最终收口，目标不是重做结构，而是把 `SlideOver` 及其内部导航、标签、快捷入口真正收进当前 `HEO` 的按钮 / 卡片 / 抽屉三类基座，作为后续移动面板类组件的稳定样板。

当前已完成的阶段结论如下：
- `SlideOver.js` 已完成顶部品牌卡、关闭按钮、暗黑模式入口、`Quick Access`、`Navigation`、`标签` 三个区块的层级统一，抽屉内部不再存在明显割裂的独立按钮皮肤或多套容器语言。
- `DarkModeBlockButton` 已去除外层多余包裹卡片，恢复为单层功能卡，解决了顶部“一个小按钮坐在一大片空白里”的问题。
- `Quick Access` 已与抽屉按钮基座对齐，按钮体量、图标底块、圆角与阴影节奏已完成最后一轮减重。
- `MenuListSide.js` 已作为抽屉导航列表容器稳定接入，不再承担额外视觉职责。
- `MenuItemCollapse.js` 已完成主菜单项、展开态、子菜单项的多轮收口：父项与子项形成明确承接关系，展开子项不再像说明区或输入框，而是稳定的次级菜单卡。
- `TagGroups.js` 已作为抽屉标签区内容项完成边框、背景、阴影和选中态减重，当前方向为“托盘里的轻标签项”，而不是独立高存在感模块。
- 当前移动端抽屉菜单可视为后续移动面板型组件的样板基线，后续若继续优化，应优先做整体回归或扩散到其它面板，不再高频重开 `SlideOver` 结构。

### 15.20 第四轮落地约束补充
- 移动端抽屉内部优先采用“标题 + 托盘 + 内容项”的三级层级，不再在同一功能块内叠加多层空容器。
- 抽屉中的功能入口、快捷入口、菜单项、标签项，应优先复用现有按钮 / 卡片基座，只保留极少量依赖运行时颜色的内联样式。
- 展开态子菜单必须体现“父项下挂的一组次级菜单项”，不能做成说明面板、空白块或输入框感容器。
- 强调色继续只用于箭头、图标弱底色、当前态轻强调与 focus 态，不用于整块抽屉面板硬铺背景。
- 已完成收口的 `SlideOver.js`、`MenuItemCollapse.js`、`MenuListSide.js`、`TagGroups.js` 当前应视为已归档基线；后续仅建议做毫米级微调或回归修正，不再作为下一步优先改造对象。

### 15.21 下一步建议修正
- `MenuListTop.js` 已在前序阶段完成归档，不应再作为“下一步优先对象”重复安排。
- 若继续推进，建议优先从低优先级但尚未归档完成的对象中选择，例如：
  1. `themes/heo/components/MenuItemDrop.js`
  2. `themes/heo/components/LatestPostsGroup.js`
  3. `themes/heo/components/SearchButton.js`
  4. `themes/heo/components/RandomPostButton.js`

### 15.22 文章页脚区域 UI 改造计划（已归档）
本轮已完成文章页脚区域的统一收口，范围覆盖正文结束后到评论区前的分享区、版权区、相邻文章区与推荐区；本次不新增功能、不重做结构，仅通过小范围样式调整完成层级统一与移动端减重。

涉及范围：
- `themes/heo/index.js`
- `themes/heo/components/PostAdjacent.js`
- `themes/heo/components/PostCopyright.js`
- `themes/heo/components/PostRecommend.js`
- `components/ShareBar.js`

本轮归档结论：
- `themes/heo/index.js` 已作为稳定的 `heo-post-footer` 组合容器保留，无需再调整模块顺序。
- `components/ShareBar.js` 已保持轻量 section 角色，本轮回归确认其与页脚容器、评论区过渡节奏可继续沿用，无需额外补丁。
- `themes/heo/components/PostCopyright.js` 已从偏强视觉的信息展示卡进一步收口为更克制的版权信息卡；暗色模式底色、边框与信息块层级已压暗，协议区改为只保留关键协议名，减少移动端重复信息与占高。
- `themes/heo/components/PostAdjacent.js` 已继续收敛为统一页脚卡片语言；桌面端悬浮 `next post` 入口的边框、阴影、封面图存在感与显隐强度均已下调。
- `themes/heo/components/PostRecommend.js` 已完成移动端减重，并进一步在移动端直接隐藏相关文章区，避免页脚区域霸屏；`md` 及以上断点继续保留推荐区。

本轮最新实施顺序：
1. `themes/heo/index.js`：建立文章页脚统一外层容器、统一间距节奏，并接入 `ShareBar`（已完成）。
2. `themes/heo/components/PostCopyright.js`：从强视觉作者卡收口为版权 / 署名 / 协议 / 原文链接信息卡（已完成，并追加移动端协议区压缩）。
3. `themes/heo/components/PostAdjacent.js`：接入新的页脚 section 语义，校正单边缺失场景与桌面端浮动入口语言（已完成）。
4. `components/ShareBar.js`：对齐 `HEO` 页脚 section 体系，避免成为孤立按钮块（已完成）。
5. `themes/heo/components/PostRecommend.js`：作为页脚收尾区与推荐网格模块做统一节奏收口，并在移动端隐藏（已完成）。

计划目标：
- [x] 统一正文结束后区域的整体容器、间距与分区节奏
- [x] 在 `HEO` 文章页正式接入分享区，并将其收口为轻量 section
- [x] 将版权声明从强视觉作者卡收口为信息卡片
- [x] 将上一篇 / 下一篇导航并入统一页脚体系，必要时支持单边显示
- [x] 将相关文章保持为更轻、更稳的推荐卡网格，并与页脚容器节奏统一
- [x] 处理评论区前的过渡层级，避免正文结束后直接跳入另一套视觉语言

落地约束：
- 不大改调用关系，优先在现有组件边界内收口样式与层级。
- 强调色只作点缀，不对整块文章页脚做大面积铺底。
- 保持移动端与桌面端都具备清晰的信息层级和可点击热区。
- 若桌面端保留悬浮“下一篇”入口，应同步并入新的卡片语言，不再沿用旧式浮层样式。
- 本轮已完成结构节奏与主次关系收口；后续仅建议做肉眼回归级微调，不再作为优先大项。

### 15.23 文章头部区域 UI 收口计划（已完成）
本轮新增文章头部区域的收口任务，目标是把 `HEO` 文章页当前偏旧式的“大封面 + 绝对定位文字层 + 波浪装饰”收成更稳定的阅读起始区；不新增功能、不重做调用链，优先通过 `PostHeader.js` 内部结构整理与视觉减重完成统一。

涉及范围：
- `themes/heo/index.js`
- `themes/heo/components/PostHeader.js`
- `themes/heo/components/WavesArea.js`
- `themes/heo/components/InfoCard.js`
- `themes/heo/style.js`

当前代码现状判断：
- `themes/heo/index.js` 中文章页头部由 `PostHeader` 直接挂在 `Header` 后方，调用链简单稳定，不应优先调整挂载位置。
- `themes/heo/components/PostHeader.js` 当前主要依赖组件内部 Tailwind 与内联样式实现：固定高大头图、模糊背景图、绝对定位信息层、强存在感分类按钮、标签文本和整条 meta 信息共存，已明显落后于当前 `HEO` 其余区域的 section / card 语言。
- `themes/heo/components/PostHeader.js` 同时承担封面主色提取与 `--heo-cover-color` / `heo-cover-color-change` 分发，已与 `InfoCard.js` 建立颜色联动；这部分机制应保留，避免牵出右栏回归。
- `themes/heo/components/InfoCard.js` 在文章详情页应继续保留对取色系统的联动，但仅建议作为弱背景氛围联动，不应让作者卡完整跟随文章头图主色变化，避免右栏变成第二个头图主视觉。
- 移动端由于默认看不到 `InfoCard`，后续若需要延续文章取色系统，优先考虑“极简移动端作者块”或局部弱细节联动，而不是让 `PostCopyright.js` 这类底部版权信息卡承担主取色承接角色。
- `themes/heo/components/WavesArea.js` 当前更像旧式 hero 装饰，不适合作为文章阅读起始区的主视觉语言；是否保留，应放在头部主体层级稳定后再决定。
- `themes/heo/style.js` 当前对文章头部的直接约束较少，后续如需统一细节，可补少量主题级规则，但主战场仍应是 `PostHeader.js`。

本轮建议实施顺序：
1. `themes/heo/components/PostHeader.js`：先把标题、分类、标签、meta 从“漂浮信息层”收成更稳定的容器内自然排布（最高优先级）。
2. `themes/heo/components/PostHeader.js`：同步压低背景模糊、旋转、位移和阴影强度，降低头图对正文的压迫感。
3. `themes/heo/components/PostHeader.js` + `themes/heo/style.js`：统一分类 / 标签 / meta 的信息层级，避免按钮、文本、说明三套语言并存。
4. `themes/heo/components/WavesArea.js`：待主体收稳后再判断保留、弱化或移除。
5. `themes/heo/components/InfoCard.js`：仅做联动回归确认；若后续出现色彩过重问题，优先压弱取色强度，而不是直接移除联动。

计划目标：
- [ ] 将文章头部从旧式大 Hero 收口为更稳定的阅读起始区
- [ ] 降低头图背景、模糊和装饰的存在感，避免压正文
- [ ] 统一分类、标签、标题与 meta 的层级和语言
- [ ] 保留封面主色提取与右栏联动，不破坏现有逻辑
- [ ] 明确 `WavesArea` 在文章页中的去留策略
- [ ] 明确 `InfoCard` 在文章页中“保留弱联动、不做强跟色”的实现边界

落地约束：
- 不调整 `themes/heo/index.js` 中头部插入顺序，优先改 `PostHeader.js` 内部结构。
- 不破坏 `--heo-cover-color` 与 `heo-cover-color-change` 事件分发。
- 不把文章头部误并入首页 `Hero` 视觉体系，避免引入新的风格串扰。
- 强调色继续只作点缀，不再使用高饱和整块分类按钮作为视觉中心。
- `InfoCard` 若跟随文章页取色，只允许作为弱氛围色参与，不允许反客为主。
- 移动端不将底部版权信息窗口作为文章取色系统的主承接对象；若需要补足移动端联动，应优先采用极简作者块，或将取色控制在边框、图标、链接等弱细节层级。
- 本轮优先解决结构层级与第一屏压迫感，再处理细节 hover 或装饰。

当前完成情况：
- `themes/heo/components/PostHeader.js` 已完成头部主容器收口：弱化背景模糊、旋转与位移，标题信息改为卡片化承载，分类 / 标签 / meta 统一为同一套轻量胶囊语言。
- `themes/heo/style.js` 已补充文章头部主题级规则，统一 `#post-info` 的玻璃卡片边框、阴影与深浅色表现，并保留 `busuanzi` 统计在新布局中的稳定显示。
- `themes/heo/components/WavesArea.js` 已改为仅桌面大屏显示，并同步下调高度、透明度与交互存在感，作为弱装饰保留而非主视觉元素。
- `themes/heo/components/InfoCard.js` 保持现有 `heo-cover-color-change` 联动机制；同时通过 `themes/heo/style.js` 下调联动混色比例，明确其只承担弱氛围背景，不做整卡强跟色。
- 当前阶段已完成计划内实施项，后续仅建议做页面肉眼回归与小幅视觉微调。




