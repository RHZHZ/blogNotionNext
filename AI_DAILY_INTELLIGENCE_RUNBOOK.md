# 每日 AI 情报自动化运行手册

## 本地首次验证建议

在正式接入真实数据源和定时任务前，建议先按下面顺序做一次完整 dry-run。

### 第 1 步：配置环境变量

至少准备以下变量：

```bash
NOTION_ACCESS_TOKEN=your_notion_integration_token
AI_DAILY_SOURCE_FILE=./temp/ai-daily-source-items.sample.json
AI_DAILY_CANDIDATES_FILE=./temp/ai-daily-candidates.json
AI_DAILY_POST_JSON=./temp/ai-daily-post.json
AI_DAILY_POST_MD=./temp/ai-daily-post.md
AI_DAILY_NOTION_DATABASE_ID=your_database_id
AI_DAILY_DRY_RUN=1
```

如果你希望生成更像正式文章的正文，再额外补：

```bash
AI_DAILY_API=your_openai_compatible_api
AI_DAILY_KEY=your_api_key
AI_DAILY_MODEL=gpt-5.4
```

如果不填这 3 项，`generate-ai-daily-post.js` 会自动回退到本地模板生成 Markdown 草稿。

---

## 第 2 步：抓取真实来源条目（可选）

如果你已经接入 `conf/ai-daily-sources.json` 中的真实 RSS / JSON 来源，可先运行：

```bash
npm run ai-daily:fetch
```

预期结果：

- 读取 `conf/ai-daily-sources.json`
- 抓取已启用来源
- 输出 `AI_DAILY_SOURCE_FILE` 指向的来源条目文件

如果你当前只是做本地验证，也可以跳过这一步，直接使用示例文件 `temp/ai-daily-source-items.sample.json`。

---

## 第 3 步：生成候选池

运行：

```bash
npm run ai-daily:candidates
```

预期结果：

- 读取 `AI_DAILY_SOURCE_FILE`
- 清洗与去重
- 输出 `temp/ai-daily-candidates.json`

---

## 第 4 步：生成日报正文


运行：

```bash
npm run ai-daily:post
```

预期结果：

- 读取 `temp/ai-daily-candidates.json`
- 生成 `temp/ai-daily-post.json`
- 生成 `temp/ai-daily-post.md`

如果已配置 `AI_DAILY_API` / `AI_DAILY_KEY`，会优先调用 AI 生成正式正文；否则回退到本地模板。

---

## 第 5 步：Dry Run 检查 Notion 入库 Payload

运行：

```bash
npm run ai-daily:publish
```

在 `AI_DAILY_DRY_RUN=1` 时，脚本不会真正创建 Notion 页面，而是：

- 先读取目标数据库 schema
- 根据字段真实类型生成 payload
- 在控制台打印最终入库内容

这一步的重点是确认：

- `title` 是否识别为标题字段
- `type` 是否按 `select` 写入
- `status` 是否按 `status` 写入
- `date` 是否按 `date` 写入
- `tags` 是否按 `multi_select` 或文本写入
- `ai_summary` 是否按 `checkbox` 写入

---

## 第 6 步：切换为真实写入


确认 payload 正确后，把：

```bash
AI_DAILY_DRY_RUN=1
```

改成：

```bash
AI_DAILY_DRY_RUN=0
```

或直接删除该变量，再次运行：

```bash
npm run ai-daily:publish
```

此时会真实创建一篇新的 Notion 页面。

---

## 一键串行执行

如果前面单步都验证通过，可以直接运行：

```bash
npm run ai-daily:run
```

它会顺序执行：

- `ai-daily:fetch`
- `ai-daily:candidates`
- `ai-daily:post`
- `ai-daily:publish`


建议第一次务必保持 `AI_DAILY_DRY_RUN=1`。

---

## 来源清单维护建议

当前默认来源配置文件为 `conf/ai-daily-sources.json`，现在采用 **精简长期版策略**，已按以下分层组织：

- **官方核心源**：长期建议默认启用，优先保留
- **开发者与开源辅助源**：补充 API、Agent、工具链动态
- **可选扩展源**：默认关闭，只有在想扩大覆盖面时再启用
- **本地调试与实验源**：仅用于本地验证或临时接入


建议维护原则：

- **优先启用官方源**：质量最高，重复率最低
- **默认保留精简集**：先用少量高质量来源跑稳定，再逐步扩展
- **扩展源默认关闭**：只有你明确需要更广覆盖时再打开
- **默认关闭实验源**：避免把不稳定来源混入长期流程
- **新增来源先小范围验证**：先单独抓取，再决定是否长期启用
- **默认偏向开发者价值**：候选池评分会额外提高开发者工具、官方核心源和较新条目的优先级



如果你要新增来源，建议至少填写：

- `name`
- `url`
- `type`
- `category`
- `sourceType`
- `tier`
- `credibility`
- `developerValue`
- `industryImpact`
- `enabled`

---

## 与当前数据库结构的默认对应


当前脚本默认按下面字段名映射：

- `title`
- `type`
- `status`
- `date`
- `slug`
- `summary`
- `tags`
- `category`
- `icon`
- `password`
- `ai_summary`

如果你后续调整了字段名，可通过环境变量覆盖：

- `AI_DAILY_NOTION_TITLE_PROPERTY`
- `AI_DAILY_NOTION_TYPE_PROPERTY`
- `AI_DAILY_NOTION_STATUS_PROPERTY`
- `AI_DAILY_NOTION_DATE_PROPERTY`
- `AI_DAILY_NOTION_SLUG_PROPERTY`
- `AI_DAILY_NOTION_SUMMARY_PROPERTY`
- `AI_DAILY_NOTION_TAGS_PROPERTY`
- `AI_DAILY_NOTION_CATEGORY_PROPERTY`
- `AI_DAILY_NOTION_ICON_PROPERTY`
- `AI_DAILY_NOTION_PASSWORD_PROPERTY`
- `AI_DAILY_NOTION_AI_SUMMARY_PROPERTY`

---

## 常见问题

### `title` 字段未找到

说明目标数据库里标题字段名不是 `title`，或未设置 `AI_DAILY_NOTION_TITLE_PROPERTY`。

### `status` / `type` 写入失败

通常是因为数据库里的可选值名称与你生成值不一致。当前默认值为：

- `type=Post`
- `status=Published`

如果你的选项名称不同，需要把生成产物中的值改成你库里的真实选项名。

### `tags` 没有按多选写入

如果数据库中的 `tags` 不是 `multi_select`，脚本会自动按文本字段降级写入。

### 生成正文风格太模板化

说明当前未配置 `AI_DAILY_API` / `AI_DAILY_KEY`，脚本使用的是本地回退模板。配置 AI 接口后即可生成更自然的正文。

---

## 推荐验证顺序

最稳妥的验证顺序是：

1. 先用示例来源文件或真实来源抓取产物跑通候选池
2. 再生成 Markdown 草稿
3. 再对 Notion 做 dry-run
4. 最后才开启真实写入
5. 稳定后再接入定时自动执行

---

## 首次执行建议

如果你准备第一次联调整条链路，最建议直接使用：

```bash
npm run ai-daily:dry-run
```

这个命令会串行执行抓取、候选池、正文生成和 Notion payload 构造，但不会真实写库。

如果你想按最短步骤操作，可直接看：

- `AI_DAILY_INTELLIGENCE_FIRST_RUN_CHECKLIST.md`

---

## 总结

当前这套骨架已经具备“真实来源 / 示例来源 → 候选池 → 正文 → Notion payload”完整闭环。下一步最适合做的是：

**先执行一次 `ai-daily:dry-run`，确认结果符合预期后，再切换到真实写入。**

