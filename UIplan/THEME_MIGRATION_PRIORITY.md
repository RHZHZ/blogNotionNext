# RHZ 新主题迁移优先级表

> 目标：将当前基于 `themes/heo/` 深度定制的实现，逐步独立为新的主题目录 `themes/rhz/`。本表按“必须迁移 / 建议迁移 / 暂不迁移”三档列出，并优先从工程独立性、主题身份识别、后续维护成本三个维度排序。

## 1. 迁移结论摘要

当前状态判断：
- UI 与产品层面，这套实现已经具备独立主题雏形。
- 工程与命名层面，仍大量保留 `heo` 痕迹。
- 若要正式独立为新主题，优先级最高的不是继续微调样式，而是先把主题入口、样式根作用域、配置文件和首页/导航/文章页核心组件迁出。

建议采用两阶段策略：
1. **先独立挂载**：让 `themes/rhz/` 可以作为一个独立主题被系统识别和切换。
2. **再独立命名**：逐步从 `#theme-heo`、`HEO_*`、`heo-*` 迁移到新主题命名体系。

---

## 2. 必须迁移

这些文件不迁移，新主题在工程上仍会被视为 `heo` 的衍生版。

| 优先级 | 文件路径 | 原因 | 迁移动作 |
|---|---|---|---|
| P0 | `themes/heo/index.js` | 主题主入口，决定布局装配与页面级结构 | 复制为 `themes/rhz/index.js`，改内部引用到 `rhz` 目录 |
| P0 | `themes/heo/style.js` | 主题视觉系统核心，承载 token、根作用域与全局样式 | 复制为 `themes/rhz/style.js`，优先替换 `#theme-heo` 为新根选择器 |
| P0 | `themes/heo/config.js` | 主题配置入口，决定主题专属参数读取方式 | 复制为 `themes/rhz/config.js`，逐步兼容并迁移 `HEO_*` 配置 |
| P0 | `themes/theme.js` | 主题动态装载与切换入口 | 确认 `rhz` 目录可被动态 import 正常识别 |
| P0 | `blog.config.js` | 默认主题声明入口 | 后续切换默认主题时，将 `THEME` 从 `heo` 切到 `rhz` |
| P0 | `next.config.js` 或扫描主题清单逻辑 | 主题列表由运行时配置注入 | 确认 `themes/rhz/` 能被扫描进入 `THEMES` 列表 |

### 必须迁移补充说明
- `themes/theme.js` 本身不是 `heo` 文件，但它是新主题能否被正确挂载的关键链路。
- `blog.config.js` 当前默认主题仍是 `heo`，如果未来要正式切换品牌身份，这个文件必须一并调整。
- 本阶段不要求一次性清空全部 `heo-*` 命名，但必须先让新目录可独立运行。

---

## 3. 建议迁移

这些文件建议在主题目录独立后优先迁出。它们决定用户最容易感知的主题身份。

### 3.1 首页 / 导航 / 首屏核心区

| 优先级 | 文件路径 | 原因 | 迁移建议 |
|---|---|---|---|
| P1 | `themes/heo/components/Header.js` | 顶部导航三栏、胶囊、阅读态收缩是主题身份核心 | 优先迁移，保留结构逻辑，后续再清理命名 |
| P1 | `themes/heo/components/Hero.js` | 首页首屏与 `MobileHero` 已明显不是原始 `heo` 结构 | 优先迁移，作为新主题首页主视觉核心 |
| P1 | `themes/heo/components/CategoryBar.js` | 首页承接层已进入你的独立视觉体系 | 迁移并和新根作用域联动验收亮/暗色状态 |
| P1 | `themes/heo/components/NavButtonGroup.js` | 首页入口组已改成统一新风格 | 作为首页承接区一并迁移 |
| P1 | `themes/heo/components/SearchButton.js` | 顶部操作入口的一部分 | 与 `Header.js` 联动迁移 |
| P1 | `themes/heo/components/RandomPostButton.js` | 顶部操作区一部分 | 与阅读态/导航体系一起迁移 |
| P1 | `themes/heo/components/ReadingProgress.js` | 文章页导航阅读态相关 | 和 `Header.js` 联动检查 |

### 3.2 文章页核心区

| 优先级 | 文件路径 | 原因 | 迁移建议 |
|---|---|---|---|
| P1 | `themes/heo/components/PostHeader.js` | 文章首屏玻璃卡、标题区和元信息编排已主题化 | 优先迁移 |
| P1 | `themes/heo/components/FloatTocButton.js` | 阅读页浮动目录入口已接入统一体系 | 和阅读页一起迁移 |
| P1 | `themes/heo/components/Catalog.js` | 目录能力影响文章页整体体验 | 与阅读系统联动迁移 |
| P1 | `themes/heo/components/TocDrawerButton.js` | 小屏目录承接 | 如保留同样导航体系，建议一起迁移 |

### 3.3 卡片体系 / 首页列表区

| 优先级 | 文件路径 | 原因 | 迁移建议 |
|---|---|---|---|
| P2 | `themes/heo/components/Card.js` | 基础卡片壳，后续是新主题卡片体系基座 | 早迁比晚迁更省成本 |
| P2 | `themes/heo/components/BlogPostCard.js` | 首页文章卡已进入统一卡片语言 | 建议和 `Card.js` 同时迁移 |
| P2 | `themes/heo/components/LatestPostsGroupMini.js` | 小列表项视觉已重新整理 | 与列表卡统一处理 |
| P2 | `themes/heo/components/LatestPostsGroup.js` | 列表区重要容器 | 与文章卡一起迁移 |
| P2 | `themes/heo/components/SideRight.js` | 右栏主容器，视觉语言已收口 | 迁移后统一右栏体系 |
| P2 | `themes/heo/components/InfoCard.js` | 强视觉卡片，已明显有独立表达 | 建议迁移 |
| P2 | `themes/heo/components/TouchMeCard.js` | 入口卡片的一部分 | 若保留当前右栏体系，建议迁移 |
| P2 | `themes/heo/components/AnalyticsCard.js` | 右栏信息面板 | 可与右栏统一处理 |

### 3.4 移动端面板 / 抽屉体系

| 优先级 | 文件路径 | 原因 | 迁移建议 |
|---|---|---|---|
| P2 | `themes/heo/components/SlideOver.js` | 抽屉/面板基础能力 | 若保留当前移动端抽屉体系，建议迁移 |
| P2 | `themes/heo/components/SideBarDrawer.js` | 移动端主抽屉 | 与 `Header.js`、`MenuListSide.js` 配套迁移 |
| P2 | `themes/heo/components/MenuListSide.js` | 抽屉侧边导航结构 | 与抽屉整体一并迁移 |
| P2 | `themes/heo/components/MenuItemCollapse.js` | 折叠菜单交互规则 | 与移动端面板一起迁移 |
| P2 | `themes/heo/components/MenuListTop.js` | 顶部菜单组 | 若仍复用当前导航结构，建议迁移 |
| P2 | `themes/heo/components/MenuItemDrop.js` | 顶部下拉菜单项 | 与导航体系一并迁移 |
| P2 | `themes/heo/components/SearchDrawer.js` | 移动端搜索抽屉承接 | 若继续保留当前搜索行为，建议迁移 |
| P2 | `themes/heo/components/SearchInput.js` | 搜索输入组件 | 可与搜索入口一同迁移 |

### 3.5 辅助能力与主题入口小组件

| 优先级 | 文件路径 | 原因 | 迁移建议 |
|---|---|---|---|
| P3 | `themes/heo/components/EyeCareButton.js` | 已进入你自己的常驻入口体系 | 可在导航迁移稳定后处理 |
| P3 | `themes/heo/components/DarkModeButton.js` | 主题级常用操作 | 建议跟随导航体系迁移 |
| P3 | `themes/heo/components/FloatDarkModeButton.js` | 浮动主题操作 | 视是否保留而定 |
| P3 | `themes/heo/components/Footer.js` | 页脚属于主题身份的一部分 | 中后期迁移即可 |
| P3 | `themes/heo/components/Logo.js` | 品牌识别组件 | 如果要彻底品牌化，建议迁移 |
| P3 | `themes/heo/components/SocialButton.js` | 主题化按钮样式 | 若页脚/作者区仍沿用，建议迁移 |

---

## 4. 暂不迁移

这些文件短期不影响新主题先独立运行，可在后续重构时再判断。

### 4.1 通用基础设施

| 文件路径 | 暂不迁移原因 |
|---|---|
| `components/LoadingCover.js` | 虽然已具备你的品牌感，但它当前位于全局组件层，更适合作为“受主题控制的全局组件”先保留不动 |
| `lib/global.js` | 是全局状态层，不应为了主题独立而提前塞入主题细节 |
| `components/SmartLink.js` | 明显属于全站通用能力 |
| `components/LazyImage.js` | 通用图片能力，不属于主题身份本体 |
| `components/HeroIcons.js` | 通用图标资源层，可暂不移动 |
| `conf/*.js` | 大多数是全站配置拆分，不必为主题迁移提前拆开 |
| `components/ThemeSwitch.js` | 主题切换器属于全站能力，不应迁入单主题目录 |
| `components/DebugPanel.js` | 调试能力，不属于单主题内部 |

### 4.2 暂缓迁移的 `heo` 局部文件

| 文件路径 | 暂缓原因 |
|---|---|
| `themes/heo/components/Announcement.js` | 影响小，可后续再看是否复用 |
| `themes/heo/components/NoticeBar.js` | 非主题身份核心 |
| `themes/heo/components/TagGroups.js` | 可先保留，等 Hero/抽屉稳定后再决定 |
| `themes/heo/components/TagItemMini.js` | 次级显示组件 |
| `themes/heo/components/WavesArea.js` | 装饰组件，可后移 |
| `themes/heo/components/FadeInUp.js` | 过渡动画辅助，不是主题主干 |
| `themes/heo/components/Swipe.js` | 交互辅助层，不必优先处理 |
| `themes/heo/components/NotionIcon.js` | 通用渲染辅助 |
| `themes/heo/components/BlogPostListEmpty.js` | 次级状态页面 |
| `themes/heo/components/BlogPostListPage.js` | 可等列表主组件稳定后再迁 |
| `themes/heo/components/BlogPostListScroll.js` | 依赖列表区整体节奏，后置即可 |
| `themes/heo/components/BlogPostArchive.js` | 归档页优先级低于首页/文章页 |
| `themes/heo/components/CategoryGroup.js` | 分类页次级组件，可后置 |
| `themes/heo/components/PaginationNumber.js` | 分页样式可后续统一 |
| `themes/heo/components/PostAdjacent.js` | 文章尾部承接组件，优先级低于 `PostHeader` |
| `themes/heo/components/PostRecommend.js` | 推荐区次于正文系统 |
| `themes/heo/components/PostCopyright.js` | 文章尾部说明区，可后续统一 |
| `themes/heo/components/PostLock.js` | 特殊状态组件，优先级低 |
| `themes/heo/components/JumpToTopButton.js` | 辅助入口，后置即可 |
| `themes/heo/components/JumpToCommentButton.js` | 评论区当前不作为主线，优先级低 |
| `themes/heo/components/HexoRecentComments.js` | 评论承接暂未作为当前主线 |
| `themes/heo/components/SideBar.js` | 如果抽屉与导航重做后保留形式变化，可后置 |
| `themes/heo/components/MenuGroupCard.js` | 次级入口卡，可等导航体系稳定后判断 |

---

## 5. 推荐执行顺序

### 阶段 A：先让 `themes/rhz/` 能独立存在
1. 建立 `themes/rhz/`
2. 复制并接通：
   - `themes/heo/index.js`
   - `themes/heo/style.js`
   - `themes/heo/config.js`
3. 确认 `themes/theme.js` 动态加载链路可识别 `rhz`
4. 视需要切换 `blog.config.js` 默认主题

### 阶段 B：迁移主题身份最强的页面
1. `Header.js`
2. `Hero.js`
3. `CategoryBar.js`
4. `PostHeader.js`

### 阶段 C：迁移卡片与右栏体系
1. `Card.js`
2. `BlogPostCard.js`
3. `LatestPostsGroupMini.js`
4. `SideRight.js`
5. `InfoCard.js`

### 阶段 D：迁移移动端抽屉与辅助入口
1. `SlideOver.js`
2. `SideBarDrawer.js`
3. `MenuListSide.js`
4. `MenuItemCollapse.js`
5. `EyeCareButton.js` 等主题级操作组件

### 阶段 E：最后做命名清理
- `#theme-heo` -> `#theme-rhz`
- `HEO_*` -> `RHZ_*`（建议先兼容、后替换）
- 高频 `heo-*` class -> 新主题前缀 class

---

## 6. 最小可行独立集

如果只想先做到“工程上可以称为独立主题”，最少先迁移这批：

- `themes/heo/index.js`
- `themes/heo/style.js`
- `themes/heo/config.js`
- `themes/heo/components/Header.js`
- `themes/heo/components/Hero.js`
- `themes/heo/components/CategoryBar.js`
- `themes/heo/components/PostHeader.js`
- `blog.config.js`（默认主题切换时）
- `themes/theme.js`（确认动态加载链路）

---

## 8. 当前迁移进度归档（2026-03-10）

> 归档目的：记录当前 `themes/rhz/` 内部低风险、本地 `heo-*` -> `rhz-*` 渐进迁移的实际完成度，后续继续时按此状态往下推进。

### 8.1 当前迁移策略

- 只处理 `themes/rhz/` 内部低风险、本地、局部组件。
- 采用“组件先补 `rhz-*`，样式再补 `rhz/heo` 双兼容 selector”的方式推进。
- 保留旧 `heo-*` 类名兼容，不做一次性清除。
- 暂不触碰高风险共享接口，尤其包括：
  - `heo-eye-care*`
  - `heo-search-modal*`
  - `heo-search*`
  - `heo-article-*`
  - `heo-header-action-btn`
  - gallery / inline-audio 相关类

### 8.2 已完成批次

#### batch2：右栏/卡片局部双命名收口

已完成组件与样式双兼容补齐：
- `NoticeBar.js`
- `BlogPostCard.js`
- `SideRight.js`
- `TouchMeCard.js`
- `LatestPostsGroupMini.js`
- `TagItemMini.js`
- `PostAdjacent.js`
- `PostRecommend.js`
- `PostCopyright.js`

本批已落地的 RHZ 类名前缀包括但不限于：
- `rhz-notice-card*`
- `rhz-post-card*`
- `rhz-side-right-sticky`
- `rhz-toc-card*`
- `rhz-touch-card*`
- `rhz-mini-post-card*`
- `rhz-tag-mini*`
- `rhz-post-adjacent-card*`
- `rhz-post-footer__recommend`
- `rhz-post-footer__copyright`

#### batch4：Hero 局部双命名收口

已完成 `themes/rhz/components/Hero.js` 与 `themes/rhz/style.js` 的局部收口，覆盖：
- `MobileHero`
- `Hero top card`
- `TodayCard`
- `Hero banner`
- `Hero menu card`

本批已落地的 RHZ 类名前缀包括但不限于：
- `rhz-mobile-hero*`
- `rhz-hero-top-card*`
- `rhz-today-card*`
- `rhz-hero-banner*`
- `rhz-hero-menu-card*`

同时已完成：
- `Hero.js` 定向 lint：`0`
- `style.js` 定向 lint：`0`
- `Hero.js` 内未再保留仅旧命名的 `className='heo-hero-banner...` / `className='heo-hero-menu-card...` 写法
- 清理 `TodayCard` 中未使用参数，消除 `siteInfo` 未使用提示

### 8.3 当前建议继续点

后续继续时，按以下顺序推进：
1. 继续扫描 `themes/rhz/components/` 内下一批低风险、本地 `heo-*` 残留
2. 优先选择结构边界清晰、只在 RHZ 内部消费的组件
3. 仍采用双命名兼容方式，不直接移除旧类名
4. 每完成一批，补齐 `style.js` 对应双兼容后再做定向 lint / 残留搜索

### 8.4 当前不做

以下范围继续暂缓：
- 高风险共享接口重命名
- 全量移除 `heo-*`
- `#theme-heo` / `HEO_*` 的一次性清理
- 评论区相关接入与 UI 设计

