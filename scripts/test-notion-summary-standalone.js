/**
 * 测试 Notion 摘要同步功能
 * 使用方法: node scripts/test-notion-summary-standalone.js <pageId>
 */

async function main() {
  const args = process.argv.slice(2)
  const pageId = args[0]

  if (!pageId) {
    console.log('用法: node scripts/test-notion-summary-standalone.js <pageId>')
    console.log('示例: node scripts/test-notion-summary-standalone.js 1234567890abcdef')
    process.exit(1)
  }

  try {
    console.log(`测试页面: ${pageId}\n`)

    // 导入模块
    const { updateNotionPageSummary } = await import('../lib/notion/notion_api.js')

    // 测试更新摘要
    const testSummary = '这是一个测试摘要，用于验证 Notion 同步功能是否正常工作。'
    console.log('测试摘要:', testSummary)
    console.log('\n尝试更新到 Notion...\n')

    const success = await updateNotionPageSummary(pageId, testSummary)

    if (success) {
      console.log('\n✅ 测试成功！摘要已更新到 Notion 数据库')
      console.log('请检查 Notion 数据库中的 summary 属性')
    } else {
      console.log('\n❌ 测试失败')
      console.log('请检查:')
      console.log('1. NOTION_ACCESS_TOKEN 是否已配置')
      console.log('2. Notion 数据库是否有 summary 属性（Rich Text 类型）')
      console.log('3. Integration 是否有写入权限')
    }

  } catch (error) {
    console.error('\n测试出错:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
