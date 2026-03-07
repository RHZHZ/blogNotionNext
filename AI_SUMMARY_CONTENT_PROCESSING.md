# AI 摘要内容处理说明

## 📏 长度限制配置

### 当前配置

- **输入限制**: 3000 字符
- **输出限制**: 300 tokens (约 200-250 中文字符)

### 自定义配置

在 `.env.local` 中添加：
```bash
AI_SUMMARY_WORD_LIMIT=3000
```

## 🧹 内容清理规则

### 过滤的内容

发送给 AI 的文本会经过以下清理：

1. **移除 URL**
   ```
   输入: 请访问 https://example.com 了解更多
   输出: 请访问 了解更多
   ```

2. **移除图片**
   - Markdown 图片: `![alt](url)` → (删除)
   - HTML 图片: `<img src="...">` → (删除)
   - 图片描述: `图片1`、`截图2` → (删除)

3. **移除代码**
   - 代码块: ```code``` → (删除)
   - 行内代码: `code` → (删除)
   - HTML 代码: `<code>...</code>` → (删除)

4. **移除公式**
   - LaTeX 公式块: `$$...$$` → (删除)
   - LaTeX 行内公式: `$...$` → (删除)
   - LaTeX 命令: `\command{...}` → (删除)

5. **移除 HTML 标签**
   ```
   输入: <p>这是<b>加粗</b>文本</p>
   输出: 这是加粗文本
   ```

6. **移除特殊符号**
   - 只保留：中文、英文、数字、空格、中文标点
   - 删除其他所有特殊符号

7. **压缩空白**
   - 多个空行 → 两个空行
   - 多个空格 → 一个空格

### 保留的内容

✅ 中文文本
✅ 英文文本
✅ 数字
✅ 中文标点（，。；：？！、）
✅ 英文标点（,.:?!）
✅ 空格

## 📝 文章结构处理

### 目录处理

```javascript
// 只取前 8 个标题
文章结构:
- 第一章：简介
- 1.1 背景
- 1.2 目的
- 第二章：方法
- 2.1 实验设计
- 2.2 数据收集
- 第三章：结果
- 第四章：讨论
```

### 内容组织

```
文章标题: [标题]

文章结构:
[目录]

文章内容:
[清理后的正文]
```

## 🎯 示例对比

### 原始内容

```markdown
# 文章标题

## 第一章：简介

请访问 https://example.com 了解更多信息。

![图片1](https://example.com/image.png)

这是一段关于**重要**概念的说明。

```javascript
const code = 'example'
```

数学公式: $E = mc^2$
```

### 清理后

```
文章标题: 文章标题

文章结构:
- 第一章：简介

文章内容:
请访问 了解更多信息。这是一段关于重要概念的说明。
```

## ⚡ 性能优化

### 为什么需要清理？

1. **节省 Token**:
   - URL、代码、公式占用大量 token
   - 清理后可以发送更多有效内容

2. **提高质量**:
   - AI 专注于文章核心内容
   - 避免被无关信息干扰

3. **加快生成**:
   - 输入更短 → 生成更快
   - 减少处理时间

### 清理效果

假设一篇文章包含：
- 正文: 2000 字符
- URL: 500 字符
- 代码: 1000 字符
- 公式: 300 字符
- **总计**: 3800 字符

清理后：
- 有效文本: 2000 字符
- **减少**: 47%
- **可以发送**: 1000 字符额外内容

## 🔧 自定义清理规则

### 修改清理函数

编辑 `lib/plugins/aiSummary.js` 中的 `cleanContent` 函数：

```javascript
const cleanContent = (text) => {
  if (!text) return ''

  // 添加你的自定义规则
  // ...

  return text.trim()
}
```

### 示例：保留某些内容

如果想保留代码：

```javascript
// 注释掉代码清理
// text = text.replace(/```[\s\S]*?```/g, '') // 代码块
// text = text.replace(/`[^`]+`/g, '') // 行内代码
```

## 📊 配置建议

### 短文（<1000字）

```javascript
AI_SUMMARY_WORD_LIMIT: 1000
max_tokens: 200
```

### 中等篇幅（1000-3000字）

```javascript
AI_SUMMARY_WORD_LIMIT: 2000
max_tokens: 250
```

### 长文（3000-10000字）

```javascript
AI_SUMMARY_WORD_LIMIT: 3000  // 当前配置 ✅
max_tokens: 300  // 当前配置 ✅
```

### 超长文（>10000字）

```javascript
AI_SUMMARY_WORD_LIMIT: 5000
max_tokens: 400
```

## ✅ 验证清理效果

### 查看日志

访问文章时，控制台会显示：

```
请求 OpenAI 生成摘要: [文章标题]
文本预览: [清理后的前 100 个字符]
```

### 手动测试

```bash
# 清除缓存
rm -rf .next

# 访问文章
# 查看日志中的 "文本预览"
```

如果预览中没有 URL、代码、公式，说明清理成功！

## 🆕 最新优化（2026-03-07）

### 预处理策略升级

当前 `lib/plugins/aiSummary.js` 已从“激进删除”调整为“保守去噪”：

1. **保留更多技术表达**
   - 会尽量保留 `Next.js`、`Node.js`、`C++`、`A/B`、`token-based` 等常见技术词
   - 不再简单粗暴删除所有特殊字符

2. **Markdown 链接保留文本**
   ```
   输入: [官方文档](https://example.com)
   输出: 官方文档
   ```

3. **行内代码尽量保留内容本身**
   ```
   输入: 使用 `useEffect` 监听状态变化
   输出: 使用 useEffect 监听状态变化
   ```

4. **公式改为弱化处理**
   - 公式块会替换为 `公式推导`
   - 行内公式会尽量保留可读文本

### 正文采样策略升级

当前不再只做简单 `slice(0, wordLimit)`，而是：

- 优先保留标题
- 保留目录前 N 项
- 对正文按 **开头 + 中间 + 结尾** 分段采样
- 去重后再截断

这样长文的后半部分重点也更容易进入摘要输入。

### 新增可配置项

可在环境变量中配置：

```bash
AI_SUMMARY_WORD_LIMIT=1000
AI_SUMMARY_SEGMENT_LIMIT=9
AI_SUMMARY_TOC_LIMIT=8
AI_SUMMARY_MIN_LENGTH=24
AI_SUMMARY_LENGTH_SHORT=60-100字
AI_SUMMARY_LENGTH_MEDIUM=90-140字
AI_SUMMARY_LENGTH_LONG=120-180字
AI_SUMMARY_LENGTH_XLONG=150-220字
```

含义：

- `AI_SUMMARY_WORD_LIMIT`: 送给 AI 的最大文本长度
- `AI_SUMMARY_SEGMENT_LIMIT`: 正文采样的最大段数
- `AI_SUMMARY_TOC_LIMIT`: 目录最多取多少项
- `AI_SUMMARY_MIN_LENGTH`: 判定摘要是否过短的最小长度
- `AI_SUMMARY_LENGTH_*`: 不同篇幅下的目标摘要字数范围

### 响应提取与清洗升级

当前已兼容更多 AI 返回结构：

- `choices[0].message.content` 字符串
- `choices[0].message.content` 数组
- `choices[0].text`
- `content`
- `result`
- `text`

摘要清洗也做了增强：

- 去除 `<think>`、`<analysis>` 等内部标签
- 去掉常见 Markdown 包裹
- 去掉“本文介绍了”“文章主要讲了”等模板句
- 合并重复标点
- 自动补句号


当前配置针对长文优化：
- ✅ 输入 3000 字符（包含更多内容）
- ✅ 输出 300 tokens（更详细的摘要）
- ✅ 自动清理无关内容（URL、代码、公式等）
- ✅ 只保留有效文本（中文、英文、数字）
- ✅ 保留文章结构（前 8 个标题）

这样的配置既保证了摘要的准确性，又提高了生成效率！
