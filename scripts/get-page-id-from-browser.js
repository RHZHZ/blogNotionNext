/**
 * 在浏览器控制台运行此代码，获取当前文章的 Notion 页面 ID
 *
 * 使用方法:
 * 1. 访问你的文章页面（如 http://localhost:3000/article/heopro）
 * 2. 打开开发者工具 (F12)
 * 3. 切换到 Console 标签
 * 4. 粘贴并运行此代码
 */

(function getPageId() {
  console.log('=================================')
  console.log('🔍 查找 Notion 页面 ID')
  console.log('=================================')

  // 方法 1: 从页面数据中查找
  const scriptTags = document.querySelectorAll('script')
  for (let script of scriptTags) {
    const content = script.textContent
    if (content && content.includes('notion')) {
      // 尝试匹配 32 字符的 Notion 页面 ID
      const matches = content.match(/[a-f0-9]{32}/gi)
      if (matches && matches.length > 0) {
        const pageId = matches[0]
        console.log('✅ 找到页面 ID:', pageId)
        console.log('')
        console.log('📋 复制下面的命令测试:')
        console.log(`node scripts/test-summary-update.js ${pageId}`)
        console.log('=================================')
        return pageId
      }
    }
  }

  // 方法 2: 从 URL 中尝试
  const urlPath = window.location.pathname
  console.log('当前 URL 路径:', urlPath)
  console.log('')
  console.log('⚠️  URL 中没有包含页面 ID')
  console.log('')
  console.log('💡 其他方法:')
  console.log('1. 在 Notion 数据库中直接复制页面 URL')
  console.log('2. 查看 Next.js 构建的数据文件')
  console.log('=================================')
})()
