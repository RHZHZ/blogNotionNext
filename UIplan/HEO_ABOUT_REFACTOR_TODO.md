# HEO About 改版 TODO 清单

> 本清单从 `UIplan/HEO_ABOUT_PAGE_UI_DESIGN.md` 的 `18. About 改版执行清单` 抽出，并结合当前实现进度持续维护。
>
> 当前状态：`P0 已完成`、`P1 已完成大部分结构与职责收口`、`P2 已完成基础样式收口`、`P3 已完成默认配置与文案第一轮同步`。

---

## 当前已完成

### 已落地改动
- [x] `阅读与书架` 与 `更多介绍` 已从长期并排改为上下独立区块
- [x] `Persona + Skills` 双栏保留
- [x] `Focus + Feature Cards` 双栏保留
- [x] `Timeline` 已改为摘要展示，并预留后续独立抽离空间
- [x] `Hero` 已压缩重复介绍字段，首屏只保留一套主介绍表达
- [x] `introductionMore` 已下沉为 `More Details` 区块说明文案承接
- [x] `Books` 已改为首屏摘要展示：最爱 `4` 本、最近在读 `3` 本
- [x] `Books` 超出数量已通过“查看更多/书架入口”承接
- [x] 书卡摘要已限制为 `3~4` 行展示
- [x] `summary / AISummary / intro` 已统一取一套主摘要
- [x] `Timeline` 已改为 `timelineSummary` 驱动
- [x] `HEO_ABOUT_PROFILE` 已补充 `timelinePreviewLimit / previewLimit`
- [x] 已完成一轮卡片层级、暗色模式、长文本容错的基础收口

### 本轮实际涉及文件
- `themes/heo/components/about/AboutPage.js`
- `themes/heo/components/about/AboutHero.js`
- `themes/heo/components/about/AboutBooks.js`
- `themes/heo/components/about/AboutFeatureRow.js`
- `themes/heo/components/about/about.data.js`
- `themes/heo/config.js`
- `themes/heo/style.js`

---

## P0：必须优先处理

### P0-1 页面结构拆分
- [x] 将 `阅读与书架` 与 `更多介绍` 从长期并排改为上下独立区块
- [x] 保留 `Persona + Skills` 双栏
- [x] 保留 `Focus + Feature Cards` 双栏
- [x] 为 `Timeline` 预留“条目变多后独立抽离”的结构空间
- 涉及：`themes/heo/components/about/AboutPage.js`、`themes/heo/style.js`
- 验收：长书单不再和正文形成高低失衡双栏，正文自然向下延展，页面保持单一主滚动
- 状态备注：已完成

### P0-2 Hero 信息去重
- [x] 压缩 `Hero` 内重复介绍字段
- [x] 在 `description` 与 `introduction` 中保留一套主介绍表达
- [x] 将 `introductionMore` 下沉到 `More Details` 或正文承接区
- [x] 检查 `tagline` 是否有明确增量，没有则删除默认展示
- 涉及：`themes/heo/components/about/AboutHero.js`、`themes/heo/components/about/about.data.js`、`themes/heo/config.js`
- 验收：首屏不再出现多段连续自我介绍型文案，标题/简介/统计主次清晰
- 状态备注：已完成，`tagline` 默认值已清空，仅在存在有效内容时才渲染

### P0-3 Books 首屏摘要化
- [x] 将“最爱书籍”首屏展示控制在 `4` 本左右
- [x] 将“最近在读”首屏展示控制在 `3` 本左右
- [x] 超出数量通过“查看更多 / 我的书架 / 最近在读”承接
- [x] 书卡摘要行数限制在 `3~4` 行
- [x] 保证 `summary / AISummary / intro` 只取一套主摘要
- 涉及：`themes/heo/components/about/AboutBooks.js`、`themes/heo/style.js`
- 验收：About 页书架只做精选展示，不承担完整书库职责
- 状态备注：已完成

---

## P1：高优先级优化

### P1-1 Highlights 与 Skills 去重
- [x] 重新区分 `Skills` 与 `Highlights` 的职责
- [x] `Skills` 只保留长期能力画像
- [x] `Highlights` 只保留当前阶段关注点
- [ ] 删除与 `Skills`、`Feature Cards` 高度重复的弱标签
- 涉及：`themes/heo/components/about/about.data.js`、`themes/heo/components/about/AboutSkills.js`、`themes/heo/components/about/AboutFeatureRow.js`
- 状态备注：组件职责已拆清，默认文案仍可继续做第二轮去重

### P1-2 Feature Cards 与 Timeline 边界拆分
- [x] `Feature Card 1` 只讲“当前在做什么”
- [x] `Feature Card 2` 只讲“我怎么做 / 长期风格”
- [x] `Timeline` 只讲“阶段变化”
- [ ] 删除三者之间重复的“博客优化 / AI 工作流 / 长期主义”同构表达
- 涉及：`themes/heo/components/about/about.data.js`、`themes/heo/components/about/AboutFeatureRow.js`
- 状态备注：结构边界已清晰，默认内容还可继续压缩重复语义

### P1-3 About 卡片头部信息密度收敛
- [x] 统一 section 标题、说明、extra 区密度
- [x] 缩减 `Books` 头部状态 tag 数量
- [x] 避免每块卡片都出现“标题 + 长说明 + tags + stats + 操作”全套组合
- 涉及：`themes/heo/components/about/AboutBooks.js`、`themes/heo/components/about/AboutSectionHeading.js`、`themes/heo/style.js`
- 状态备注：已完成基础收敛

---

## P2：样式系统收口

### P2-1 卡片层级统一
- [x] 统一 About 页所有卡片圆角体系
- [x] 统一边框强度、阴影强度、背景透明度
- [x] 统一卡片内部 padding、gap、标题间距
- [x] 清理卡片套卡片的套娃感
- 涉及：`themes/heo/style.js`
- 状态备注：已完成第一轮统一，后续可在视觉走查时继续微调

### P2-2 暗色模式专项收口
- [x] 校正 `personality` 插画亮度
- [x] 校正 `hobby` 背景图蒙层强度
- [x] 统一暗色模式下主文、次文、弱提示色阶
- [x] 统一 tag / badge / 按钮在暗色模式下的边框和背景逻辑
- 涉及：`themes/heo/style.js`
- 状态备注：已完成基础收口，建议后续再结合真实页面截图做一次目测校准

### P2-3 长文本与高数据量容错
- [x] 标题统一做 `1~2` 行截断策略
- [x] 摘要统一做 `3~4` 行截断策略
- [x] 联系方式值保持换行而不是硬截断
- [x] 技能、标签、联系信息在数据增加时优先换列换行
- 涉及：`themes/heo/style.js`
- 状态备注：已完成第一轮容错收口，后续仅需结合真实页面继续做视觉走查

---

## P3：文案与配置层清理

### P3-1 默认文案重写
- [x] 精简默认 Hero 文案
- [x] 精简 Feature Cards 默认 description
- [x] 精简书架总说明和分组说明
- [x] 为 Highlights 改成更偏“当前关注”的表达
- 涉及：`themes/heo/components/about/about.data.js`、`themes/heo/config.js`
- 状态备注：已完成第一轮同步，后续仅保留更细粒度的文案打磨

### P3-2 字段使用规则固化
- [x] 明确哪些字段属于摘要区
- [x] 明确哪些字段属于正文承接区
- [ ] 避免未来继续把长文案塞回 Hero / Feature / Books 头部
- 涉及：`UIplan/HEO_ABOUT_PAGE_UI_DESIGN.md`、`UIplan/HEO_ABOUT_REFACTOR_TODO.md`
- 状态备注：规则已体现在当前 TODO 与配置使用方式中，后续可继续同步到设计文档对应章节

---

## 今日开发补充记录（2026-03-12）

### 已完成
- [x] 实测 About 书单手动刷新链路、管理员鉴权、刷新冷却逻辑
- [x] 修复 `/api/about/books` 与 `/api/booklist` 运行时缺失工具函数导致的报错
- [x] 后端新增 `isAdminAuthorized`，前端将“是否展示刷新控制区”和“是否允许点击刷新”解耦
- [x] 修复冷却期间 About 页刷新按钮消失、回退成“管理员授权”入口的问题
- [x] 确认当前 summary 补全策略为“下次只补缺失 summary”，不是严格意义上的断点续传游标
- [x] 调整 `booklist hero` 副标题与描述可读性
- [x] 修复 `heo-booklist-featured__eyebrow` 在暗色模式下的样式缺失
- [x] 放大 About persona 第三张动漫图，提升与左侧角色的视觉对称感
- [x] 将 `skills` 区从文字技能卡升级为图标卡片版，并接入 `react-icons` 作为现成图标来源
- [x] 将 `skills` 区继续收口到“更像参考图、但仍兼容当前 About 页 UI 系统”的折中方案

### 本次实际涉及文件
- `lib/server/wereadAboutBooks.js`
- `pages/api/about/books.js`
- `themes/heo/components/about/AboutBooks.js`
- `themes/heo/components/about/AboutSkills.js`
- `themes/heo/components/booklist/BookListPage.js`
- `themes/heo/style.js`
- `package.json`

### 当前结论
- About 页书单刷新链路当前可用，管理员鉴权与冷却逻辑已通过实测
- summary 补全已支持“按缺失字段增量补全”，但暂未实现真正的断点续传
- `skills` 区目前停留在安全平衡点：比原版更接近参考图，但未做成会破坏页面整体性的纯 logo 墙

---

## 下一轮建议继续处理

### 文案精修
- [ ] 继续微调 `featureCards` 默认 description，减少残余语义重叠
- [ ] 继续按真实内容增长校验 `highlights` 的阶段性表达是否稳定

### 展示精修
- [ ] 视 `timeline` 条目增长情况，决定是否从 `Feature` 右列独立抽出为单独 section
- [ ] 基于真实页面截图再做一次暗色模式和移动端视觉走查

### 文档同步
- [x] 将本清单的完成状态同步回 `UIplan/HEO_ABOUT_PAGE_UI_DESIGN.md` 的执行清单章节
- [x] 在设计文档中补一句：`About` 页默认承担“概览 + 引导”，不是完整信息全集展示页

---

## 推荐实施顺序（更新后）

1. [x] 先改 `AboutPage.js` 结构，把 `Books` 和 `More Details` 拆开
2. [x] 再改 `AboutHero.js` / `about.data.js`，压缩 Hero 文案
3. [x] 再改 `AboutBooks.js`，把书架改成真正的精选展示
4. [x] 再改 `AboutFeatureRow.js` / `about.data.js`，拆清 `Highlights / Feature / Timeline`
5. [x] 最后统一 `themes/heo/style.js` 做样式收口
6. [x] 已完成默认文案精修、标题截断和设计文档同步，下一轮聚焦视觉走查与�