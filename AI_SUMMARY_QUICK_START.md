# AI 摘要 Notion 同步 - 快速开始

## 🚀 5 分钟快速开始

### 步骤 1: 在 Notion 中添加 summary 属性

1. 打开你的 Notion 博客数据库
2. 点击右上角的 "Properties" 或在属性栏点击 "+ Add a property"
3. 添加新属性：
   - **Name**: `summary` (必须小写)
   - **Type**: `Rich Text` (富文本)
4. 保存

### 步骤 2: 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```bash
NOTION_ACCESS_TOKEN=your_notion_integration_token_here
```

获取 Token:
1. 访问 https://www.notion.so/my-integrations
2. 创建新的 Integration
3. 复制 "Internal Integration Token"

### 步骤 3: 授权 Integration

1. 返回你的 Notion 数据库
2. 点击右上角 "..." → "Add connections"
3. 选择你刚创建的 Integration
4. 确保允许读写权限

### 步骤 4: 测试功能

运行测试脚本：

```bash
node scripts/test-notion-summary-standalone.js <your_page_id>
```

如果看到 `✅ 测试成功！`，说明配置正确。

### 步骤 5: 批量更新现有文章

更新所有文章的摘要：

```bash
npm run update-notion-summaries
```

这个脚本会：
- 自动生成所有文章的 AI 摘要
- 保存到 Notion 数据库
- 跳过已有摘要的文章

## ✅ 完成！

现在系统会自动：
1. 优先使用 Notion 中的摘要（最快）
2. 如果没有，使用本地缓存
3. 如果都没有，才请求 AI 生成
4. 生成后自动保存到 Notion

## 常见问题

### Q: 摘要多久生成一次？
A: 只在首次访问时生成一次，之后永久使用 Notion 中的摘要。

### Q: 可以手动修改摘要吗？
A: 可以！直接在 Notion 数据库中编辑 `summary` 属性即可。

### Q: 如何更新某个文章的摘要？
A: 清除 Notion 中的 `summary` 属性，访问该文章会自动重新生成。

### Q: 批量更新需要多长时间？
A: 取决于文章数量，大约每篇文章需要 2-3 秒（包括 API 请求和延迟）。

## 进阶使用

### 只更新特定文章

如果只想更新几个文章，可以在 Notion 中手动清除这些文章的 `summary` 属性，然后访问这些文章页面即可自动重新生成。

### 调整缓存时间

在 `blog.config.js` 中修改：

```javascript
AI_SUMMARY_CACHE_TIME: 3600, // 缓存时间（秒）
```

### 修改摘要长度

在 `blog.config.js` 中修改：

```javascript
AI_SUMMARY_WORD_LIMIT: 1500, // 生成摘要时使用的文本字数
```

## 需要帮助？

查看完整文档: [AI_SUMMARY_NOTION_SYNC.md](./AI_SUMMARY_NOTION_SYNC.md)

或查看实现报告: [AI_SUMMARY_IMPLEMENTATION_REPORT.md](./AI_SUMMARY_IMPLEMENTATION_REPORT.md)
