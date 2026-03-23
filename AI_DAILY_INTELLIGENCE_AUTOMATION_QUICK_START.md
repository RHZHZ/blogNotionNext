# 每日 AI 情报自动化 - 快速落地说明

## 适用场景

本文档用于把 `AI_DAILY_INTELLIGENCE_AUTOMATION.md` 中的总体方案，进一步收口为当前博客可执行的落地步骤。

当前项目已经具备以下基础：

- 使用 Notion 作为内容源
- 已安装 `@notionhq/client`
- 已存在 Notion 写回脚本与 `NOTION_ACCESS_TOKEN` 使用方式
- 已有批量更新摘要脚本，可作为后续“日报入库”能力的参考实现

因此，后续实现“每日 AI 情报自动化发布”时，建议优先沿用当前项目的 Notion 写入模式，而不是另起一套发布链路。

---

## 推荐落地路径

建议分三步完成，而不是一次性做成全自动发布。

### 第一步：先完成自动生成日报正文

目标：

- 每天定时执行
- 拉取最近 24 小时的 AI 情报候选
- AI 生成一篇 Markdown 文章
- 先把结果保存到本地文件或临时产物中

这一阶段只验证两件事：

- 候选信息质量是否稳定
- 文章结构和提示词是否足够可用

推荐输出位置：

- 临时 Markdown 文件
- 或日志中输出最终正文

在这一步，不要急着直接公开发布。

---

### 第二步：接入 Notion 草稿入库

目标：

- 将第一步生成的标题、摘要、正文、标签、日期写入 Notion 数据库
- 默认先以可控方式入库，再根据需要切换到真实发布
- 在博客前台出现前，先留给作者快速检查

当前项目已按你现有数据库结构做默认映射：

- `title`：文章标题
- `type`：文章类型，默认 `Post`
- `status`：发布状态，默认 `Published`
- `date`：发布日期
- `slug`：文章路径标识
- `summary`：文章摘要
- `tags`：标签
- `category`：分类
- `icon`：默认 `🤖`
- `password`：默认空字符串
- `ai_summary`：默认 `true`

其中 `publish-ai-daily-to-notion.js` 会先读取数据库 schema，再按字段真实类型写入，因此可以适配你当前的 `select / status / date / rich_text / checkbox` 混合结构。


---

### 第三步：根据稳定性切换为自动发布

只有在以下条件都满足时，才建议切换到自动公开发布：

- 来源质量稳定
- 候选池不会经常混入旧闻与软文
- 标题与标签生成质量稳定
- Notion 写入逻辑已经跑过多轮验证

在这之前，默认都以“自动生成 + 草稿入库 + 人工复核”作为主工作流。

---

## 当前项目可复用的能力

从现有脚本和依赖看，至少有以下能力可以直接复用：

### 1. Notion Token 使用方式

项目已经使用：

```bash
NOTION_ACCESS_TOKEN=your_notion_integration_token
```

后续日报发布脚本也建议沿用同一环境变量，不再新建平行配置。

### 2. Notion 写回能力

现有脚本已证明项目中存在“把内容写回 Notion”的可行路径，后续日报入库脚本建议复用：

- `scripts/update-notion-summaries-standalone.js`
- `scripts/test-notion-summary-standalone.js`

这两份脚本虽然当前是为 `summary` 字段服务，但其组织方式、动态导入方式和错误处理方式，都适合作为日报入库脚本的参考模板。

### 3. Node 运行环境

当前 `package.json` 已要求：

- `node >= 20`

因此后续新增自动化脚本时，可以默认使用当前 Node 版本能力，不需要额外兼容低版本。

---

## 建议新增的脚本职责

为了让自动化更清晰，建议后续按职责拆成 3 个脚本，而不是把所有逻辑塞进一个文件里。

### 脚本 1：采集候选池

建议命名：

```text
scripts/generate-ai-daily-candidates.js
```

职责：

- 拉取最近 24 小时 AI 情报候选
- 清洗结构
- 去重
- 输出候选池 JSON 或 Markdown

推荐输出：

- `temp/ai-daily-candidates.json`
- 或直接打印结构化候选结果

### 脚本 2：生成日报正文

建议命名：

```text
scripts/generate-ai-daily-post.js
```

职责：

- 读取候选池
- 调用 AI 生成最终文章
- 输出标题、摘要、正文、标签、slug 等结果

推荐输出：

- `temp/ai-daily-post.json`
- `temp/ai-daily-post.md`

### 脚本 3：写入 Notion

建议命名：

```text
scripts/publish-ai-daily-to-notion.js
```

职责：

- 读取已生成的日报产物
- 映射到 Notion 数据库字段
- 创建页面或更新页面
- 默认写为草稿状态

---

## 推荐的最小数据结构

为了让脚本之间更容易串起来，建议在“候选池”和“最终文章”两阶段使用明确的数据结构。

### 候选池结构

```json
{
  "date": "2026-03-23",
  "items": [
    {
      "title": "事件标题",
      "url": "https://example.com",
      "source": "OpenAI Blog",
      "publishedAt": "2026-03-23T07:10:00Z",
      "category": "模型更新",
      "summary": "一句话摘要",
      "credibility": 5,
      "developerValue": 4,
      "industryImpact": 4
    }
  ]
}
```

### 最终文章结构

```json
{
  "title": "每日 AI 情报｜2026-03-23",
  "slug": "daily-ai-news-2026-03-23",
  "summary": "今日最值得关注的 AI 新动态摘要。",
  "tags": ["AI", "日报", "大模型"],
  "status": "draft",
  "date": "2026-03-23",
  "markdown": "# 每日 AI 情报｜2026-03-23\n..."
}
```

---

## 定时运行建议

如果通过调度器执行，建议先固定每天一次：

```text
FREQ=DAILY;BYHOUR=7;BYMINUTE=30
```

等跑稳定后，再考虑增加：

- 中午补跑
- 晚间汇总
- 热点快讯机制

不建议一开始就多频次执行，否则更难排查内容重复和质量波动。

---

## 适合自动化任务的 Prompt 草案

自动化任务的 prompt 最好只描述任务本身，不写调度信息。

推荐版本：

```text
收集最近 24 小时内的 AI 最新动态，筛选出最值得关注的 5-8 条，整理成适合中文个人技术博客发布的 Markdown 文章，并准备写入博客内容数据库；优先保留原始来源，去重合并同一事件，文风保持专业、克制、清晰，默认以草稿状态入库。
```

如果后续拆成两段执行，也可以使用：

### 候选池任务 Prompt

```text
收集最近 24 小时内值得关注的 AI 动态，生成结构化候选池，包含标题、来源、时间、类别、摘要、可信度、开发者价值，并删除重复事件、旧闻与低可信内容。
```

### 成文任务 Prompt

```text
根据提供的 AI 情报候选池，筛选出最值得写入日报的 5-8 条内容，整理成适合中文个人技术博客发布的 Markdown 文章，结构包括今日总览、重点情报、开发者特别关注、三个趋势与简评。
```

---

## CodeBuddy 自动化建议配置

如果后续直接使用 CodeBuddy 自动化能力，建议任务配置可按下面思路设置：

- **name**：`每日 AI 情报生成`
- **rrule**：`FREQ=DAILY;BYHOUR=7;BYMINUTE=30`
- **cwds**：当前博客项目根目录
- **status**：`ACTIVE`
- **prompt**：使用上面的“自动化任务 Prompt 草案”

建议工作目录：

```text
c:/Users/RHZ/Downloads/blogNext
```

---

## 实施顺序建议

为了避免一次改动过大，建议按下面顺序推进：

1. 先确定候选池格式
2. 再定最终 Markdown 模板
3. 再实现 Notion 入库脚本
4. 最后才开启定时自动运行

这样每一步都可以单独验证，出问题也更容易回滚。

---

## 推荐的下一步

从当前项目状态出发，最合理的下一步不是直接“自动发布”，而是：

**先新增日报生成脚本骨架与 Notion 草稿入库脚本骨架，再把它挂到每天定时任务上。**

如果后续继续推进，可以优先做以下其中一个：

- 新增 `scripts/generate-ai-daily-post.js` 脚本骨架
- 新增 `scripts/publish-ai-daily-to-notion.js` 脚本骨架
- 直接创建 CodeBuddy 自动化任务配置

---

## 总结

当前项目已经具备 Notion 写入基础，因此“每日 AI 情报自动化”完全可以沿着现有能力往前扩展。最稳的做法是：

**先自动生成，再自动入库草稿，最后视稳定性决定是否自动公开发布。**
