/**
 * 通过文章 slug 测试 Notion summary 更新
 * 使用方法: node scripts/test-summary-by-slug.js <slug>
 * 例如: node scripts/test-summary-by-slug.js heopro
 */

async function main() {
  const args = process.argv.slice(2)
  const slug = args[0]

  if (!slug) {
    console.log('=================================')
    console.log('📋 用法: node scripts/test-summary-by-slug.js <slug>')
    console.log('=================================')
    console.log('')
    console.log('📌 当前 URL:', 'http://localhost:3000/article/heopro')
    console.log('   其中 slug 就是: heopro')
    console.log('')
    console.log('🔍 其他示例:')
    console.log('   node scripts/test-summary-by-slug.js heopro')
    console.log('   node scripts/test-summary-by-slug.js another-article')
    console.log('=================================')
    process.exit(1)
  }

  console.log('=================================')
  console.log('🧪 通过 Slug 测试 Summary 更新')
  console.log('=================================')
  console.log(`📄 文章 Slug: ${slug}`)
  console.log('')

  try {
    // 导入模块
    console.log('📦 加载模块...')
    const { getAllPageIds } = await import('../lib/db/notion/getAllPageIds.js')
    const getPageProperties = (await import('../lib/db/notion/getPageProperties.js')).default
    const { updateNotionPageSummary } = await import('../lib/notion/notion_api.js')
    const { getPageAISummary } = await import('../lib/plugins/aiSummary.js')
    const { getNotionPost } = await import('../lib/db/notion/getNotionPost.js')

    // 获取所有页面
    console.log('📖 获取所有文章...')
    const allPageIds = await getAllPageIds({ includePages: true })
    console.log(`   找到 ${allPageIds.length} 个页面\n`)

    // 查找匹配 slug 的页面
    console.log(`🔍 查找 slug: ${slug}`)
    let targetPage = null
    let targetPageId = null

    for (let i = 0; i < allPageIds.length; i++) {
      const pageId = allPageIds[i]
      try {
        const page = await getPageProperties(pageId)

        // 检查 slug 是否匹配（去除特殊字符和大小写）
        const pageSlug = page.slug || ''
        const normalizedPageSlug = pageSlug.toLowerCase().replace(/[^a-z0-9-]/g, '')
        const normalizedInputSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

        if (normalizedPageSlug === normalizedInputSlug || pageSlug === slug) {
          targetPage = page
          targetPageId = pageId
          console.log(`   ✅ 找到匹配页面 (索引 ${i + 1}/${allPageIds.length})`)
          break
        }
      } catch (error) {
        // 跳过读取失败的页面
        continue
      }
    }

    if (!targetPage) {
      console.log('   ❌ 未找到匹配的文章')
      console.log('')
      console.log('💡 提示:')
      console.log('1. 确认 slug 是否正确')
      console.log('2. 尝试使用完整的 pageId 测试')
      console.log('3. 检查文章是否已发布')
      console.log('')
      console.log('🔍 可用的 slug 列表:')
      let slugCount = 0
      for (let i = 0; i < Math.min(allPageIds.length, 10); i++) {
        try {
          const page = await getPageProperties(allPageIds[i])
          if (page.slug && page.type === 'Post') {
            console.log(`   - ${page.slug} (ID: ${allPageIds[i]})`)
            slugCount++
          }
        } catch (error) {
          continue
        }
      }
      if (slugCount === 0) {
        console.log('   (未找到可显示的 slug)')
      }
      console.log('=================================')
      process.exit(1)
    }

    console.log('')
    console.log('📄 页面信息:')
    console.log(`   ID: ${targetPageId}`)
    console.log(`   标题: ${targetPage.title || '(无标题)'}`)
    console.log(`   类型: ${targetPage.type}`)
    console.log(`   状态: ${targetPage.status}`)
    console.log(`   当前摘要: ${targetPage.summary || '(空)'}`)
    console.log('')

    // 询问是否更新
    console.log('🤔 要更新这个页面的摘要吗?')
    console.log('   [Y] 是 - 更新测试摘要')
    console.log('   [N] 否 - 仅验证')
    console.log('')
    console.log('💡 或者直接运行自动生成:')
    console.log(`   node scripts/test-summary-update.js ${targetPageId}`)
    console.log('=================================')

    // 注意: 这里需要用户确认，但在脚本中无法交互
    // 所以我们直接进行验证
    console.log('✅ 找到页面 ID:', targetPageId)
    console.log('')
    console.log('📋 现在可以使用以下命令:')
    console.log('')
    console.log('1️⃣  测试更新:')
    console.log(`   node scripts/test-summary-update.js ${targetPageId}`)
    console.log('')
    console.log('2️⃣  验证当前状态:')
    console.log(`   node scripts/verify-summary-updated.js ${targetPageId}`)
    console.log('')
    console.log('3️⃣  访问文章页面自动生成:')
    console.log(`   http://localhost:3000/article/${slug}`)
    console.log('=================================')

  } catch (error) {
    console.error('')
    console.error('❌ 测试出错:', error.message)
    console.error('')
    if (error.stack) {
      console.error('详细堆栈:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()
