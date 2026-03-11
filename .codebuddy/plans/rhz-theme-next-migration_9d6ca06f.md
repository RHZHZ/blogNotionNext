---
name: rhz-theme-next-migration
overview: 继续推进 `themes/rhz/` 从 `heo` 过渡桥接到真正本地化，优先处理 `style.js` 与 `config.js`，并梳理后续核心组件迁移顺序。
todos:
  - id: scan-rhz-dependencies
    content: 使用[subagent:code-explorer]梳理themes/rhz剩余heo组件、HEO配置键与样式依赖
    status: completed
  - id: localize-rhz-style
    content: 本地化themes/rhz/style.js，替换#theme-heo作用域并保持当前视觉表现
    status: completed
    dependencies:
      - scan-rhz-dependencies
  - id: build-rhz-config
    content: 用[MCP:Claude Text Editor MCP Server]重构themes/rhz/config.js为独立配置与双前缀兼容层
    status: completed
    dependencies:
      - scan-rhz-dependencies
  - id: align-rhz-entry
    content: 调整themes/rhz/index.js及已迁移组件的配置读取，稳定THEME_CONFIG导出
    status: completed
    dependencies:
      - localize-rhz-style
      - build-rhz-config
  - id: verify-rhz-pages
    content: 验证首页、文章页、分类栏与主题切换，并产出下一批组件迁移优先级
    status: completed
    dependencies:
      - align-rhz-entry
---

## User Requirements

继续推进 `themes/rhz/` 主题的实际迁移工作，主题名称固定为 `RHZ`。本轮重点不是继续讨论命名或文档，而是把当前仍依赖 `heo` 的主题壳层进一步本地化，优先处理 `themes/rhz/style.js` 与 `themes/rhz/config.js`，并为后续组件迁移打好基础。

## Product Overview

现有 `RHZ` 主题已经接入本地 `Header`、`Hero`、`CategoryBar`、`PostHeader`，并使用独立根容器 `#theme-rhz`。接下来需要把主题样式与配置从“直接转发 heo”升级为“RHZ 本地可维护版本”，同时保持当前页面展示效果、主题切换能力和现有页面可正常渲染。

## Core Features

- 将 `themes/rhz/style.js` 从简单转发改为本地样式入口，确保样式作用域正确绑定到 `#theme-rhz`
- 将 `themes/rhz/config.js` 从整体继承 `heo` 改为 `RHZ` 主题独立配置，并制定 `HEO_*` 向 `RHZ_*` 的兼容迁移方案
- 保持 `themes/rhz/index.js` 与现有本地组件协作正常，避免主题切换、首页、文章页、分类栏等核心界面回退
- 梳理仍引用 `@/themes/heo/components/...` 的模块，明确下一批组件迁移顺序，保证后续迁移可持续推进

## Tech Stack Selection

- 项目类型：Next.js 主题系统
- 语言与模块形态：JavaScript / ES Modules
- UI 组织方式：主题目录下 `index.js + config.js + style.js + components/`
- 主题加载机制：`themes/theme.js` 通过 `import('@/themes/${theme}')` 动态加载布局与 `THEME_CONFIG`

## Implementation Approach

本轮采用“去桥接但保兼容”的渐进迁移策略：先把 `themes/rhz/style.js` 和 `themes/rhz/config.js` 本地化，再最小范围调整 `themes/rhz/index.js` 与已迁移组件的配置读取方式。这样能在不打断现有主题输出的前提下，把 RHZ 从 `heo` 的透明别名，升级为真正独立主题。

关键决策：

- **样式优先本地化**：`themes/rhz/style.js` 当前仅 `export { Style } from '@/themes/heo/style'`，而 `themes/heo/style.js` 已大量写死 `#theme-heo` 作用域；若不先本地化，`#theme-rhz` 下会长期依赖错误作用域或未来修改难以控制。
- **配置采用双前缀兼容期**：当前 `themes/rhz/index.js` 与已迁移组件仍大量读取 `HEO_*`，如果一次性全改成 `RHZ_*`，回归面过大。更稳妥的做法是先在 `themes/rhz/config.js` 建立 RHZ 默认值，并兼容旧键，随后分批把本地组件切换到 `RHZ_*`。
- **限制改动爆炸半径**：暂不大规模改 `themes/theme.js`，因为它已确认只依赖主题目录导出的 `Layout*` 与 `THEME_CONFIG`，现有动态加载机制可继续复用。

性能与可靠性：

- 样式本地化本质为静态样式复制/替换，不引入运行时复杂度；主要风险是作用域替换不完整，需重点检查 `#theme-heo`、全局变量、事件颜色变量等选择器。
- 配置兼容建议采用一次归一化或显式别名映射，避免在组件内到处重复判断前缀，减少维护成本和不必要的多次读取。
- 不做无关重构，避免影响 `themes/theme.js` 的动态 import、SSR 输出和现有已上线页面。

## Implementation Notes

- 复用现有主题导出规范：`themes/rhz/index.js` 已验证导出 `CONFIG as THEME_CONFIG`，应继续保持。
- `themes/heo/style.js` 体量很大，迁移时优先做“可运行的完整本地副本 + 选择器替换”，再分批 RHZ 品牌化，避免半迁移状态导致样式缺失。
- `themes/rhz/index.js`、`themes/rhz/components/Hero.js` 已稳定依赖 `CONFIG`，配置兼容层应放在 `themes/rhz/config.js`，不要把前缀兼容逻辑散落到多个组件。
- 保持向后兼容：未迁完的 `@/themes/heo/components/...` 仍可继续工作，不要求本轮全部本地化。
- 若修改本地组件配置键名，需成组更新 `themes/rhz/index.js`、`themes/rhz/components/Hero.js` 等已迁移文件，避免出现部分读 `HEO_*`、部分读 `RHZ_*` 的混用失控。

## Architecture Design

当前已确认的 RHZ 主题结构与关系：

- `themes/rhz/index.js`：主题布局入口，已挂载 `#theme-rhz`，并导出 `THEME_CONFIG`
- `themes/rhz/style.js`：主题样式入口，本轮应从 heo 转发改为本地实现
- `themes/rhz/config.js`：主题配置入口，本轮应建立 RHZ 独立配置与兼容映射
- `themes/rhz/components/*`：已本地迁移的核心组件，继续消费 RHZ 配置
- `themes/theme.js`：主题动态加载入口，无需重构，只需保持 RHZ 导出契约稳定

本轮后应形成：
`themes/theme.js` → 动态加载 `themes/rhz/index.js` → 使用本地 `CONFIG/Style/部分本地组件` → 未迁移部分仍暂时复用 `heo` 组件。

## Directory Structure

## Directory Structure Summary

本次变更聚焦 RHZ 主题的配置与样式去桥接，并校准相关入口文件，控制在主题目录内完成。

```text
c:/Users/RHZ/Downloads/blogNext/
├── themes/
│   ├── rhz/
│   │   ├── index.js              # [MODIFY] RHZ 主题主入口。必要时同步调整本地配置键读取与注释/元数据，保证 Layout 导出和 THEME_CONFIG 契约稳定。
│   │   ├── style.js              # [MODIFY] RHZ 本地样式入口。基于 themes/heo/style.js 复制并替换作用域到 #theme-rhz，保留当前视觉效果。
│   │   ├── config.js             # [MODIFY] RHZ 独立主题配置。由整体继承 heo 改为本地配置对象，并加入 HEO_* / RHZ_* 兼容策略。
│   │   └── components/
│   │       ├── Hero.js           # [MODIFY] 如切换到 RHZ_* 键名，需同步调整已迁移英雄区配置读取。
│   │       ├── CategoryBar.js    # [AFFECTED] 主要验证样式与交互是否保持，不一定需要代码改动。
│   │       └── PostHeader.js     # [AFFECTED] 主要验证样式变量、封面色变量和头图区域是否仍正确。
│   ├── heo/
│   │   ├── style.js              # [REFERENCE] RHZ 样式迁移来源，不直接修改，作为选择器与变量迁移参照。
│   │   └── config.js             # [REFERENCE] RHZ 配置拆分来源，不直接修改，作为首批默认配置来源。
│   └── theme.js                  # [AFFECTED] 已确认动态加载契约，通常无需修改，仅作为兼容性验证对象。
```

## Key Code Structures

建议在 `themes/rhz/config.js` 内部采用“默认配置 + 兼容别名”的结构，而不是简单扩散旧配置对象。若实现时签名不完全确定，可按以下意图落地：

- RHZ 默认配置对象：定义 RHZ 主题当前需要维护的键
- 兼容层：让历史 `HEO_*` 读取在过渡期仍能命中对应值
- 对外导出：继续默认导出单一 `CONFIG` 对象，供 `siteConfig(key, defaultValue, CONFIG)` 使用

## Agent Extensions

### SubAgent

- **code-explorer**
- Purpose: 深入搜索 RHZ 与 HEO 主题中剩余的组件引用、配置键和样式作用域使用点
- Expected outcome: 输出可靠的迁移范围与下一批组件迁移清单，避免遗漏依赖

### MCP

- **Claude Text Editor MCP Server**
- Purpose: 在确认迁移范围后，持续编辑 `themes/rhz/` 下配置、样式与入口文件
- Expected outcome: 稳定完成多文件连续修改，保持文件状态一致并便于分步校正