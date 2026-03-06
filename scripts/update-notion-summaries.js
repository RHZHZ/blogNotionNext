/**
 * 批量更新 Notion 页面的 AI 摘要
 * 用法: npm run update-notion-summaries
 */

const path = require('path')
const { getAllPageIds } = require('../lib/db/notion/getAllPageIds')
const getPageProperties = require('../lib/db/notion/getPageProperties').default
const { getNotionPost } = require('../lib/db/notion/getNotionPost')
const { getPageAISummary } = require('../lib/plugins/aiSummary')
const { batchUpdateNotionSummaries } = require('../lib/notion/notion_api')

/**
 * 批量更新所有文章的摘要到 Notion
 */
async function updateAllSummaries() {
  console.log('开始批量更新文章摘要到 Notion...\n')

  try {
    // 获取所有页面 ID
    const allPageIds = await getAllPageIds({ includePages: true })
    console.log(`找到 ${allPageIds.length} 个页面\n`)

    const updates = []

    for (let i = 0; i < allPageIds.length; i++) {
      const pageId = allPageIds[i]

      try {
        console.log(`[${i + 1}/${allPageIds.length}] 处理页面: ${pageId}`)

        // 获取页面属性
        const page = await getPageProperties(pageId)

        // 检查是否是文章类型
        if (page.type !== 'Post' && page.type !== 'Page') {
          console.log(`  跳过: 非文章页面 (类型: ${page.type})\n`)
          continue
        }

        // 检查是否已经有摘要
        if (page.summary) {
          console.log(`  跳过: 已有摘要\n`)
          continue
        }

        // 获取完整文章数据
        const post = await getNotionPost(pageId)

        // 生成 AI 摘要
        await getPageAISummary(post, post.contentText)

        if (post.aiSummary) {
          console.log(`  ✅ 生成摘要成功: ${post.aiSummary.substring(0, 50)}...`)

          // 添加到批量更新列表
          updates.push({
            pageId: pageId,
            summary: post.aiSummary,
          })
        } else {
          console.log(`  ⚠️ 摘要生成失败\n`)
        }

        console.log('')
      } catch (error) {
        console.error(`  ❌ 处理页面失败: ${error.message}\n`)
      }
    }

    // 批量更新到 Notion
    if (updates.length > 0) {
      console.log(`\n开始批量更新 ${updates.length} 个页面的摘要到 Notion...`)
      const result = await batchUpdateNotionSummaries(updates)
      console.log(`\n批量更新完成: ✅ 成功 ${result.success}, ❌ 失败 ${result.failed}`)
    } else {
      console.log('\n没有需要更新的页面')
    }

  } catch (error) {
    console.error('批量更新失败:', error)
    process.exit(1)
  }

  console.log('\n✅ 任务完成')
}

// 运行更新
updateAllSummaries()
