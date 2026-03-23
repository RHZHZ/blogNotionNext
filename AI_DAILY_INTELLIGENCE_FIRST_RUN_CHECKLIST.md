# 每日 AI 情报首次联调最短操作单

## 你第一次跑，只做这 5 步

### 1. 在 `.env.local` 里至少补这几个变量

```bash
NOTION_ACCESS_TOKEN=你的_Notion_Integration_Token
AI_DAILY_NOTION_DATABASE_ID=你的_Notion_数据库_ID
AI_DAILY_SOURCE_FILE=./temp/ai-daily-source-items.json
AI_DAILY_CANDIDATES_FILE=./temp/ai-daily-candidates.json
AI_DAILY_POST_JSON=./temp/ai-daily-post.json
AI_DAILY_POST_MD=./temp/ai-daily-post.md
```

如果你希望正文不是模板草稿，而是直接由 AI 写成文章，再补：

```bash
AI_DAILY_API=你的_OpenAI_兼容接口地址
AI_DAILY_KEY=你的_API_Key
AI_DAILY_MODEL=gpt-5.4
```

---

### 2. 确认 `conf/ai-daily-sources.json` 里启用的来源就是你想要的

当前默认已经是精简长期版，适合直接首次联调。

---

### 3. 先跑一遍 dry-run

```bash
npm run ai-daily:dry-run
```

这个命令会自动执行：

- 抓取来源
- 生成候选池
- 生成日报正文
- 构造 Notion 入库 payload

但**不会真正写入 Notion**。

---

### 4. 重点看这几处输出

你只要确认：

- `temp/ai-daily-source-items.json` 是否成功生成
- `temp/ai-daily-candidates.json` 里的候选是否合理
- `temp/ai-daily-post.md` 的文风是否可接受
- 控制台打印的 Notion payload 是否字段齐全
- `type / status / date / tags / ai_summary` 是否按预期映射

---

### 5. 没问题后再真实写入

如果 dry-run 结果正常，再执行：

```bash
npm run ai-daily:run
```

这时才会真正创建 Notion 页面。

---

## 首次联调建议

- **先不要加太多来源**：默认精简版最适合首跑
- **先接受模板正文也没关系**：先验证链路通，再优化文风
- **第一次务必 dry-run**：不要直接真写库
- **如果字段选项不一致，先修数据库选项名**：尤其是 `type=Post` 与 `status=Published`

---

## 如果首次失败，优先检查这 4 项

- `NOTION_ACCESS_TOKEN` 是否正确
- `AI_DAILY_NOTION_DATABASE_ID` 是否正确
- 数据库字段名是否与当前默认映射一致
- 你的数据库 `type/status` 选项值是否包含 `Post` / `Published`

---

## 一句话建议

**第一次只做 dry-run，确认候选池、正文和 payload 都顺眼，再执行真实写入。**
