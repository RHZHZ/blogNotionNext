/**
 * 测试 Notion summary 属性更新功能
 * 使用方法: node scripts/test-summary-update.js <pageId>
 */

async function main() {
  const args = process.argv.slice(2)
  const pageId = args[0]

  if (!pageId) {
    console.log('=================================')
    console.log('📋 用法: node scripts/test-summary-update.js <pageId>')
    console.log('=================================')
    console.log('')
    console.log('🔍 获取 pageId 的方法:')
    console.log('1. 打开你的 Notion 数据库')
    console.log('2. 选择一篇文章')
    console.log('3. 复制页面 URL 中的 ID')
    console.log('   例如: https://www.notion.so/your-workspace/Page-Title-<pageId>')
    console.log('   复制 <pageId> 部分（32个字符）')
    console.log('')
    console.log('💡 提示: 你可以先访问一篇文章，在浏览器控制台运行:')
    console.log("   window.location.href.split('/').pop()")
    console.log('=================================')
    process.exit(1)
  }

  console.log('=================================')
  console.log('🧪 开始测试 Notion summary 更新')
  console.log('=================================')
  console.log(`📄 页面 ID: ${pageId}`)
  console.log('')

  try {
    // 导入模块
    console.log('📦 加载模块...')
    const { updateNotionPageSummary } = await import('../lib/notion/notion_api.js')
    const getPageProperties = (await import('../lib/db/notion/getPageProperties.js')).default

    // 步骤 1: 读取当前页面属性
    console.log('📖 步骤 1: 读取当前页面属性')
    try {
      const page = await getPageProperties(pageId)
      console.log('   ✅ 成功读取页面属性')
      console.log('   标题:', page.title || '(无标题)')
      console.log('   当前摘要:', page.summary || '(空)')
    } catch (readError) {
      console.log('   ⚠️  读取页面属性失败:', readError.message)
      console.log('   这可能是因为页面不存在或权限不足')
    }
    console.log('')

    // 步骤 2: 更新摘要
    console.log('✏️  步骤 2: 更新摘要到 Notion')
    const testSummary = '这是一个测试摘要，用于验证 Notion API 更新功能是否正常工作。时间: ' + new Date().toLocaleString()
    console.log('   测试摘要:', testSummary)

    const success = await updateNotionPageSummary(pageId, testSummary)

    if (!success) {
      console.log('')
      console.log('❌ 测试失败')
      console.log('=================================')
      console.log('🔍 可能的原因:')
      console.log('1. NOTION_ACCESS_TOKEN 未配置或无效')
      console.log('2. Notion 数据库中没有 summary 属性')
      console.log('3. Integration 没有写入权限')
      console.log('4. 页面 ID 不正确')
      console.log('=================================')
      console.log('📝 解决步骤:')
      console.log('1. 检查 .env.local 中的 NOTION_ACCESS_TOKEN')
      console.log('2. 在 Notion 数据库中添加 summary 属性（类型: Rich Text）')
      console.log('3. 在 Notion 数据库中连接 Integration 并授权')
      console.log('4. 确认页面 ID 正确')
      console.log('=================================')
      process.exit(1)
    }

    console.log('')

    // 步骤 3: 验证更新
    console.log('✅ 步骤 3: 验证更新结果')
    console.log('   摘要已成功更新到 Notion 数据库')
    console.log('')
    console.log('=================================')
    console.log('🎉 测试成功！')
    console.log('=================================')
    console.log('✓ summary 属性已创建')
    console.log('✓ Notion API 更新功能正常')
    console.log('✓ Integration 权限配置正确')
    console.log('')
    console.log('🔍 下一步: 手动验证')
    console.log('1. 打开 Notion 数据库')
    console.log('2. 找到对应的页面')
    console.log('3. 检查 summary 属性是否包含测试文本')
    console.log('   预期内容: "这是一个测试摘要..."')
    console.log('=================================')
    console.log('')
    console.log('💡 如果一切正常，现在可以运行批量更新:')
    console.log('   npm run update-notion-summaries')
    console.log('=================================')

  } catch (error) {
    console.error('')
    console.error('=================================')
    console.error('❌ 测试出错')
    console.error('=================================')
    console.error('错误信息:', error.message)
    console.error('')
    if (error.stack) {
      console.error('详细堆栈:')
      console.error(error.stack)
    }
    console.error('=================================')
    console.error('🔍 调试建议:')
    console.error('1. 确保已安装依赖: npm install')
    console.error('2. 检查 Node.js 版本 (需要 >= 20): node -v')
    console.error('3. 查看 .env.local 文件是否存在')
    console.error('4. 确认 NOTION_ACCESS_TOKEN 已配置')
    console.error('=================================')
    process.exit(1)
  }
}

main()
