# HEO About 页面内容填写模板

> 直接按下面字段替换 `themes/heo/config.js` 里的 `HEO_ABOUT_PROFILE` 即可。

## 1. Hero 首屏

| 字段 | 建议填写内容 | 你的内容 |
| --- | --- | --- |
| `hero.badge` | About Me |  |
| `hero.title` | ABOUT ME |  |
| `hero.subtitle` | 一句话介绍你是谁 |  |
| `hero.description` | 1~2 句更完整的页面说明 |  |
| `hero.tagline` | 例如：持续学习 / 持续输出 / 持续迭代 |  |
| `hero.avatar` | 头像图片地址 |  |

## 2. 个人简介

| 字段 | 建议填写内容 | 你的内容 |
| --- | --- | --- |
| `introduction` | 第一段简介：你现在在做什么、关注什么 |  |
| `introductionMore` | 第二段简介：你的做事方式、博客定位、长期目标 |  |

## 3. 数据统计

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `stats[0].label` | 核心主题 |  |
| `stats[0].value` | 3 |  |
| `stats[0].helper` | 阅读 / 音乐 / 代码 |  |
| `stats[1].label` | 博客定位 |  |
| `stats[1].value` | 1 |  |
| `stats[1].helper` | 技术复盘与生活感悟 |  |
| `stats[2].label` | 持续状态 |  |
| `stats[2].value` | 长期 |  |
| `stats[2].helper` | 沉淀 / 突破 / 超越 |  |

## 4. 个性与兴趣卡片

### Personality 卡

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `profileCards[0].eyebrow` | Personality |  |
| `profileCards[0].title` | 提倡者 |  |
| `profileCards[0].accent` | INFJ-A |  |
| `profileCards[0].description` | 性格说明 |  |
| `profileCards[0].image` | 人格插画地址 |  |

### Hobby 卡

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `profileCards[1].eyebrow` | Hobby |  |
| `profileCards[1].title` | CSGO |  |
| `profileCards[1].accent` | 战术协同 / 枪感 / 地图理解 |  |
| `profileCards[1].description` | 爱好说明 |  |
| `profileCards[1].image` | 背景图地址 |  |
| `profileCards[1].badge` | 段位 B+ |  |

## 5. 技能展示

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `skills[i].name` | Java / Python / Vue |  |
| `skills[i].symbol` | JV / Py / V |  |
| `skills[i].accent` | 后端 / 自动化 / 前端 |  |

> 当前页面已预置 12 个技能位：`Java`、`C`、`C++`、`Python`、`AI`、`PR`、`Vue`、`HTML`、`CSS`、`FL Studio`、`吉他`、`音乐人`。

## 6. 近期关注标签

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `highlights[]` | 独立博客 |  |
| `highlights[]` | 前端开发 |  |
| `highlights[]` | 自动化工作流 |  |
| `highlights[]` | AI 协作 |  |
| `highlights[]` | 音乐创作 |  |
| `highlights[]` | 长期主义 |  |

## 7. 右侧信息卡块

### 信息卡 1

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `featureCards[0].eyebrow` | Now Building |  |
| `featureCards[0].title` | 正在打磨的事情 |  |
| `featureCards[0].description` | 当前重点方向说明 |  |
| `featureCards[0].tags[]` | Blog Design / AI Workflow |  |

### 信息卡 2

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `featureCards[1].eyebrow` | Creative Style |  |
| `featureCards[1].title` | 偏爱的表达方式 |  |
| `featureCards[1].description` | 你的表达与做事方式 |  |
| `featureCards[1].tags[]` | 结构化表达 / 长期迭代 |  |

## 8. 经历时间轴

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `timeline[i].year` | Now / 2025 / 2024 |  |
| `timeline[i].title` | 阶段标题 |  |
| `timeline[i].description` | 阶段说明 |  |

## 9. 联系方式

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `contacts[0].label` | 博客 |  |
| `contacts[0].value` | https://rhzhz.cn |  |
| `contacts[0].href` | https://rhzhz.cn |  |
| `contacts[1].label` | GitHub |  |
| `contacts[1].value` | https://github.com/xxx |  |
| `contacts[1].href` | https://github.com/xxx |  |
| `contacts[2].label` | 邮箱 |  |
| `contacts[2].value` | your@email.com |  |

## 10. 我最爱的书

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `bookShelf.title` | 我最爱的书 |  |
| `bookShelf.description` | 为什么这些书重要 |  |
| `bookShelf.linkText` | 我的书架 |  |
| `bookShelf.link` | 外部书架链接 |  |

### 书卡字段

| 字段 | 示例 | 你的内容 |
| --- | --- | --- |
| `books[i].title` | 置身事内 |  |
| `books[i].author` | 兰小欢 |  |
| `books[i].cover` | 封面图 URL |  |
| `books[i].summary` | 这本书对你的影响 |  |
| `books[i].note` | 微信读书 ID：35177921 |  |
| `books[i].href` | 微信读书链接 |  |

## 11. 备注

- `/about` 底部 `更多介绍` 仍然来自 Notion 正文内容。
- 如果你后续只想改文案，优先修改 `themes/heo/config.js` 中的 `HEO_ABOUT_PROFILE`。
- 如果你想继续加模块，可以复用 `themes/heo/components/about/` 里的组件结构。
