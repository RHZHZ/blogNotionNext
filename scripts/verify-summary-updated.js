/**
 * 验证 Notion summary 属性是否已正确更新
 * 使用方法: node scripts/verify-summary-updated.js <pageId>
 */

async function main() {
  const args = process.argv.slice(2)
  const pageId = args[0]

  if (!pageId) {
    console.log('用法: node scripts/verify-summary-updated.js <pageId>')
    console.log('示例: node scripts/verify-summary-updated.js abc123def456...')
    process.exit(1)
  }

  console.log('=================================')
  console.log('🔍 验证 Notion summary 属性')
  console.log('=================================')
  console.log(`页面 ID: ${pageId}`)
  console.log('')

  try {
    // 导入模块
    const getPageProperties = (await import('../lib/db/notion/getPageProperties.js')).default

    // 读取页面属性
    console.log('📖 读取页面属性...')
    const page = await getPageProperties(pageId)

    console.log('=================================')
    console.log('📄 页面信息')
    console.log('=================================')
    console.log('标题:', page.title || '(无标题)')
    console.log('类型:', page.type || '(未知)')
    console.log('状态:', page.status || '(未知)')
    console.log('摘要:', page.summary || '(空)')
    console.log('=================================')
    console.log('')

    // 判断摘要状态
    if (page.summary && typeof page.summary === 'string' && page.summary.trim()) {
      console.log('✅ 摘要属性已存在且有内容')
      console.log('   长度:', page.summary.length, '字符')
      console.log('   内容预览:', page.summary.substring(0, 100) + (page.summary.length > 100 ? '...' : ''))
      console.log('')
      console.log('✓ 系统会优先使用此摘要，无需请求 AI')
      console.log('✓ 此摘要已永久保存在 Notion 数据库中')
    } else {
      console.log('⚠️  摘要属性为空或不存在')
      console.log('')
      console.log('💡 解决方案:')
      console.log('1. 运行测试脚本添加摘要:')
      console.log('   node scripts/test-summary-update.js <pageId>')
      console.log('')
      console.log('2. 或者访问文章页面自动生成:')
      console.log('   打开文章页面 → 等待 AI 生成 → 自动保存到 Notion')
      console.log('')
      console.log('3. 或者批量更新所有文章:')
      console.log('   npm run update-notion-summaries')
    }

    console.log('')
    console.log('=================================')
    console.log('🎯 优先级说明')
    console.log('=================================')
    console.log('1️⃣  Notion summary 属性 (最高优先级)')
    console.log('2️⃣  本地缓存')
    console.log('3️⃣  AI 生成 (最低优先级)')
    console.log('=================================')

  } catch (error) {
    console.error('❌ 读取失败:', error.message)
    console.error('')
    console.error('可能的原因:')
    console.error('1. 页面 ID 不正确')
    console.error('2. 页面不在数据库中')
    console.error('3. 权限不足')
    process.exit(1)
  }
}

main()
