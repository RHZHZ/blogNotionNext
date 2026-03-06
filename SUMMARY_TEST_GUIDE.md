# Notion Summary 更新测试指南

## 🚀 快速测试（3 步完成）

### 方法 1: 使用测试脚本（推荐）

#### 步骤 1: 获取页面 ID

**方式 A: 从浏览器获取**
1. 打开你的 Notion 数据库
2. 点击打开任意一篇文章
3. 复制浏览器地址栏中的 ID
4. URL 格式: `https://www.notion.so/workspace/Page-Title-<pageId>`
5. 复制 `<pageId>` 部分（32个字符的字母数字组合）

**方式 B: 从页面获取**
1. 访问你的博客文章页面
2. 打开浏览器开发者工具 (F12)
3. 在 Console 中运行:
   ```javascript
   window.location.href
   ```
4. URL 最后一部分就是页面 ID

#### 步骤 2: 运行测试脚本

```bash
node scripts/test-summary-update.js <pageId>
```

例如:
```bash
node scripts/test-summary-update.js abc123def456789012345678901234ab
```

**预期输出:**
```
=================================
🧪 开始测试 Notion summary 更新
=================================
📄 页面 ID: abc123def456...

📦 加载模块...
📖 步骤 1: 读取当前页面属性
   ✅ 成功读取页面属性
   标题: 你的文章标题
   当前摘要: (空)

✏️  步骤 2: 更新摘要到 Notion
   测试摘要: 这是一个测试摘要...

✅ 步骤 3: 验证更新结果
   摘要已成功更新到 Notion 数据库

=================================
🎉 测试成功！
=================================
✓ summary 属性已创建
✓ Notion API 更新功能正常
✓ Integration 权限配置正确
```

#### 步骤 3: 手动验证

1. 打开 Notion 数据库
2. 找到测试的页面
3. 查看 `summary` 属性
4. 确认包含测试文本: "这是一个测试摘要..."

### 方法 2: 验证现有摘要

如果页面已有摘要，可以使用验证脚本:

```bash
node scripts/verify-summary-updated.js <pageId>
```

**预期输出:**
```
=================================
🔍 验证 Notion summary 属性
=================================
页面 ID: abc123def456...

📖 读取页面属性...
=================================
📄 页面信息
=================================
标题: 你的文章标题
类型: Post
状态: Published
摘要: 这是已保存的 AI 摘要内容...
=================================

✅ 摘要属性已存在且有内容
   长度: 120 字符
   内容预览: 这是已保存的 AI 摘要内容...

✓ 系统会优先使用此摘要，无需请求 AI
✓ 此摘要已永久保存在 Notion 数据库中
```

### 方法 3: 通过博客页面测试（最直观）

1. 清除缓存:
   ```bash
   rm -rf .next
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```

3. 访问一篇没有摘要的文章

4. 打开浏览器开发者工具 (F12) → Console 标签

5. 查看日志输出，应该看到:
   ```
   ✅ 使用 Notion 数据库中的摘要: 文章标题
   ```
   或
   ```
   成功生成 AI 摘要: 文章标题
   ✅ 已同步摘要到 Notion 页面: abc123...
   ```

6. 刷新页面，应该看到:
   ```
   ✅ 使用 Notion 数据库中的摘要: 文章标题
   ```

## 🔍 故障排查

### 问题 1: NOTION_ACCESS_TOKEN 未配置

**错误信息:**
```
NOTION_ACCESS_TOKEN 未配置，无法使用 Notion API 更新页面属性
```

**解决方案:**
1. 创建 `.env.local` 文件（如果不存在）
2. 添加以下内容:
   ```bash
   NOTION_ACCESS_TOKEN=your_notion_integration_token_here
   ```
3. 重启开发服务器

**获取 Token:**
1. 访问 https://www.notion.so/my-integrations
2. 点击 "+ New integration"
3. 填写名称，选择工作空间
4. 复制 "Internal Integration Token"

### 问题 2: summary 属性不存在

**错误信息:**
```
⚠️ Notion 页面可能没有 "summary" 属性，请在 Notion 中创建该属性
属性类型应为: Rich Text
```

**解决方案:**
1. 打开 Notion 数据库
2. 点击右上角的 "Properties" 或属性栏的 "+"
3. 添加新属性:
   - **Name**: `summary` (必须小写)
   - **Type**: `Rich Text` (富文本)
4. 保存数据库

### 问题 3: Integration 权限不足

**错误信息:**
```
401 Unauthorized 或 403 Forbidden
```

**解决方案:**
1. 返回 Notion 数据库
2. 点击右上角 "..." → "Add connections"
3. 选择你创建的 Integration
4. 确保显示为 "Connected"

### 问题 4: 页面 ID 不正确

**错误信息:**
```
读取页面属性失败
```

**解决方案:**
1. 确认页面 ID 是 32 个字符的字母数字
2. 尝试从 Notion URL 中重新复制
3. 确保页面在正确的数据库中

## 📊 测试检查清单

测试完成后，请确认以下项目:

- [ ] 测试脚本运行成功
- [ ] Notion 数据库中有 `summary` 属性
- [ ] 属性类型为 `Rich Text`
- [ ] 测试摘要成功写入 Notion
- [ ] 访问文章页面时使用 Notion 摘要
- [ ] 控制台显示 "使用 Notion 数据库中的摘要"
- [ ] 刷新页面不再请求 AI
- [ ] 多次访问性能提升明显

## 🎯 完整测试流程示例

```bash
# 1. 清除缓存
rm -rf .next

# 2. 获取页面 ID (假设: abc123def456789012345678901234ab)

# 3. 运行测试脚本
node scripts/test-summary-update.js abc123def456789012345678901234ab

# 4. 验证摘要已更新
node scripts/verify-summary-updated.js abc123def456789012345678901234ab

# 5. 启动开发服务器
npm run dev

# 6. 访问文章页面
# http://localhost:3000/post/your-slug

# 7. 打开浏览器控制台，查看日志

# 8. 刷新页面，确认使用 Notion 摘要

# 9. 批量更新所有文章
npm run update-notion-summaries
```

## 📈 性能对比测试

### Before (未使用 Notion 缓存)
```
首次访问: 请求 AI → 2-3秒
再次访问: 使用缓存 → 50-100ms
清除缓存后: 请求 AI → 2-3秒
```

### After (使用 Notion 缓存)
```
首次访问: 请求 AI + 保存到 Notion → 2-3秒
再次访问: 使用 Notion 摘要 → 50-100ms
清除缓存后: 使用 Notion 摘要 → 50-100ms
其他环境访问: 使用 Notion 摘要 → 50-100ms
```

## 🆘 需要帮助？

如果测试遇到问题，请提供以下信息:

1. Node.js 版本: `node -v`
2. 测试脚本的完整输出
3. Notion 数据库截图（显示 summary 属性）
4. 浏览器控制台错误信息
5. `.env.local` 文件内容（隐藏 Token）

## 📚 相关文档

- [AI_SUMMARY_QUICK_START.md](./AI_SUMMARY_QUICK_START.md) - 快速开始
- [AI_SUMMARY_NOTION_SYNC.md](./AI_SUMMARY_NOTION_SYNC.md) - 完整文档
- [AI_SUMMARY_IMPLEMENTATION_REPORT.md](./AI_SUMMARY_IMPLEMENTATION_REPORT.md) - 实现报告
