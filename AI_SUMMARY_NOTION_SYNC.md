# AI 摘要 Notion 同步功能说明

## 功能概述

现在 AI 摘要会自动保存到 Notion 数据库的 `summary` 属性中，避免每次访问文章都请求 AI 接口，提升性能并节省 API 成本。

## 工作原理

系统会按照以下优先级获取文章摘要：

1. **Notion 数据库中的 summary 属性**（最高优先级）
2. **本地缓存**（Redis/Memory Cache）
3. **AI 生成**（当缓存和 Notion 中都没有时）

## 使用前准备

### 1. 在 Notion 数据库中创建 summary 属性

在你的 Notion 数据库中，需要添加一个名为 `summary` 的属性：

- **属性名称**: `summary`
- **属性类型**: `Rich Text`（富文本）

### 2. 配置环境变量

确保在 `.env.local` 或环境变量中配置了 Notion API 密钥：

```bash
NOTION_ACCESS_TOKEN=your_notion_integration_token
```

## 批量更新现有文章摘要

如果你已有大量文章，可以批量生成并更新摘要到 Notion：

```bash
npm run update-notion-summaries-standalone
```

或手动运行：

```bash
node scripts/update-notion-summaries-standalone.js
```

这个脚本会：

1. 遍历所有文章和页面
2. 跳过已有摘要的文章
3. 生成 AI 摘要
4. 自动保存到 Notion 数据库的 `summary` 属性

## 自动同步机制

当访问文章页面时：

1. 首先检查 Notion 数据库中是否已有 `summary` 属性
2. 如果有，直接使用（无需请求 AI）
3. 如果没有，则请求 AI 生成摘要
4. 生成成功后，自动同步保存到 Notion 数据库
5. 同时更新本地缓存

## 🆕 本次补充说明（2026年3月8日）

### 失败摘要不会写回 Notion

现在仅当摘要内容被判定为有效时，才会写入缓存并同步到 Notion。
以下失败文案会被视为无效摘要，不会写回数据库：

- `摘要生成暂时不可用`
- `AI 摘要服务暂时繁忙`
- `AI 摘要 API 配置错误`

### `ai_summary` 与 `summary` 的最终协作规则

- `ai_summary`：控制该文章是否启用 AI 摘要生成与展示
- `summary`：摘要正文内容来源，可由 AI 生成，也可手动填写

最终规则如下：

1. 当 `ai_summary` 明确关闭时：
   - 不生成 AI 摘要
   - 不展示 AI 摘要卡片
   - 即使手动填写了 `summary`，也不会回填成 `post.aiSummary`

2. 当文章显式存在 `ai_summary` 字段且其值为开启时：
   - 允许将手动 `summary` 作为 AI 摘要卡片的展示内容

3. 当文章没有 `ai_summary` 字段时：
   - 仍按默认行为允许 AI 摘要能力
   - 但不会仅因手动 `summary` 就自动渲染 AI 摘要卡片

### Notion Checkbox 解析说明

本次还修正了 `ai_summary` 的 checkbox 解析策略：

- 不再简单把缺失的 checkbox 字段补成 `false`
- 仅在读取到明确值时才按 `true / false / yes / no / 1 / 0 / on / off` 解析
- 字段缺失时保持默认语义，避免误伤正常文章

## 🆕 按文章关闭 AI 摘要

现在支持通过 Notion 数据库中的 `ai_summary` 属性控制单篇文章是否启用 AI 摘要。

### 属性配置

在 Notion 数据库中新增：

- **属性名称**: `ai_summary`
- **推荐类型**: `Checkbox`

### 行为说明

当 `ai_summary` 为关闭状态时：

1. 不会自动请求 AI 生成摘要
2. 前端不会展示 AI 摘要卡片
3. 页面正文与其他内容不受影响

### 关闭判定值

以下值会被视为“关闭 AI 摘要”：

- `false`
- `0`
- `off`
- `no`

以及它们常见的字符串形式。

### 推荐用法

如果使用 `Checkbox`：

- 勾选 = 启用 AI 摘要
- 不勾选 = 关闭 AI 摘要

### 与 `summary` 的关系

- `summary`：用于存储或手动维护摘要正文
- `ai_summary`：用于控制该文章是否启用摘要生成与展示

建议两者配合使用：

- 需要自动摘要的文章：开启 `ai_summary`
- 不希望显示摘要卡片的文章：关闭 `ai_summary`


### AI 摘要相关配置

在 `blog.config.js` 中可以配置：

```javascript
AI_SUMMARY_API: 'https://api.openai.com/v1/chat/completions',
AI_SUMMARY_KEY: 'your_api_key',
AI_SUMMARY_CACHE_TIME: 1800, // 本地缓存时间（秒），默认 30 分钟
AI_SUMMARY_WORD_LIMIT: 1000, // 生成摘要时的文本截断字数
```

## 故障排查

### 问题 1: Notion 属性不存在

如果看到错误：`Notion 页面可能没有 "summary" 属性`

**解决方案**：
- 在 Notion 数据库中添加 `summary` 属性（类型为 Rich Text）
- 确保属性名称完全一致（区分大小写）

### 问题 2: API 权限不足

如果看到错误：`401` 或 `403`

**解决方案**：
- 检查 `NOTION_ACCESS_TOKEN` 是否正确
- 确保该 Integration 对你的数据库有写入权限
- 在 Notion 中重新连接 Integration

### 问题 3: 摘要不更新

如果发现摘要没有更新到 Notion：

**解决方案**：
- 检查 API 日志确认更新是否成功
- 手动运行批量更新脚本
- 清除本地缓存后重新访问文章

## 性能优势

使用 Notion 存储摘要的好处：

1. **持久化存储**: 摘要永久保存在 Notion 数据库
2. **跨环境同步**: 在任何环境下都会读取相同的摘要
3. **减少 API 调用**: 避免每次访问都请求 AI 接口
4. **降低成本**: 节省 AI API 使用费用
5. **可编辑性**: 可以手动在 Notion 中编辑或修正摘要

## 注意事项

1. **属性类型**: `summary` 属性必须是 `Rich Text` 类型
2. **属性名称**: 属性名必须是小写的 `summary`（Notion API 要求）
3. **API 限流**: 批量更新时会自动添加延迟以避免触发 Notion API 限流
4. **错误处理**: 同步失败不会影响本地缓存，文章仍可正常显示

## 更新日志

- ✅ 自动保存摘要到 Notion 数据库
- ✅ 优先从 Notion 读取已保存的摘要
- ✅ 批量更新脚本支持
- ✅ 完善的错误处理和日志输出
