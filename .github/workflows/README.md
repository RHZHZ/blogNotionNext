# 百度自动推送配置指南

## 功能说明

此工作流会自动将你网站的URL推送到百度站长平台，提高收录速度。

## 配置步骤

### 1. 获取百度推送Token
1. 登录 [百度站长平台](https://ziyuan.baidu.com)
2. 选择你的网站
3. 进入「网站支持」→「链接提交」→「主动推送」
4. 复制 `token=` 后面的值（如：`bM823h1yaiRmuDrA`）

### 2. 配置GitHub Secrets
在GitHub仓库中设置以下Secrets：

| Secret名称 | 值 | 说明 |
|-----------|-----|------|
| `SITE_URL` | `https://rhzhz.cn` | 你的网站URL（必须HTTPS） |
| `BAIDU_TOKEN` | 你的百度推送Token | 从百度站长平台获取 |
| `BING_API_KEY` | (可选) | 如需推送到Bing，配置此项 |

**配置方法：**
1. 进入GitHub仓库页面
2. 点击「Settings」→「Secrets and variables」→「Actions」
3. 点击「New repository secret」添加上述Secrets

### 3. 触发工作流

#### 自动触发
- **每天自动运行**：每天北京时间10点自动推送
- **代码更新时**：当文章或配置文件更新时自动推送

#### 手动触发
1. 进入GitHub仓库的「Actions」标签页
2. 选择「Baidu URL Push」工作流
3. 点击「Run workflow」手动触发

## 推送频率说明

- **每日限额**：百度每日推送上限为2000条URL
- **智能限流**：脚本会自动限制每次推送100条（可修改`pushUrl.py`中的`QUOTA`变量）
- **重复推送**：同一URL重复推送无影响

## 监控推送效果

1. **GitHub Actions日志**：
   - 查看每次推送的执行日志
   - 确认推送是否成功

2. **百度站长平台**：
   - 进入「链接提交」→「主动推送」
   - 查看「昨日数据」和「累计数据」
   - 通常在推送后1-2小时可看到数据更新

## 故障排除

### ❌ 错误：Missing required secrets
**原因**：未配置GitHub Secrets
**解决**：按照步骤2配置SITE_URL和BAIDU_TOKEN

### ❌ 错误：HTTP 403 Forbidden
**原因**：百度Token无效或过期
**解决**：重新获取百度推送Token并更新Secrets

### ❌ 错误：SSL证书验证失败
**原因**：网站未启用HTTPS
**解决**：确保网站使用HTTPS协议

### ❌ 错误：No URLs found in sitemap
**原因**：sitemap.xml文件为空或无法访问
**解决**：
1. 访问 `https://rhzhz.cn/sitemap.xml` 确认可访问
2. 检查sitemap.xml是否包含有效URL

## 高级配置

### 修改推送频率
编辑 `.github/workflows/baidu-push.yml` 中的 `cron` 设置：

```yaml
schedule:
  # 每天上午10点（北京时间）
  - cron: '0 2 * * *'  # UTC时间2点
  
  # 每天2次：上午10点和晚上10点
  # - cron: '0 2,14 * * *'
  
  # 每小时推送（谨慎使用）
  # - cron: '0 * * * *'
```

### 增加Bing推送
1. 获取Bing API Key：
   - 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - 进入「配置」→「API访问」
2. 在GitHub Secrets中添加 `BING_API_KEY`
3. 工作流会自动启用Bing推送

### 自定义推送URL数量
编辑 `pushUrl.py` 文件中的 `QUOTA` 变量：

```python
# 每日推送限额，可根据实际情况修改
QUOTA = 200  # 默认100，可调整为200（百度每日上限2000）
```

## 效果验证

推送成功后，可以通过以下方式验证收录效果：

1. **百度搜索**：`site:rhzhz.cn`
2. **站长平台工具**：使用「URL收录」查询工具
3. **流量统计**：观察百度搜索流量的变化

## 注意事项

1. **HTTPS必须**：百度只收录HTTPS网站
2. **内容原创**：高质量原创内容更容易被收录
3. **持续更新**：定期更新内容有助于提高收录率
4. **耐心等待**：新站收录通常需要1-3个月

## 技术支持

如有问题，请参考：
- [百度站长平台帮助中心](https://ziyuan.baidu.com/college/courseinfo?id=267&page=1)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [NotionNext官方文档](https://docs.tangly1024.com/)