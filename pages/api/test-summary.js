/**
 * API 路由：测试 Notion summary 更新
 * 使用方法: 访问 http://localhost:3000/api/test-summary?pageId=<pageId>
 * 例如: http://localhost:3000/api/test-summary?pageId=d29c88a2bd1f06fcc58605a0261679a7
 */

import { updateNotionPageSummary } from '@/lib/notion/notion_api'

export default async function handler(req, res) {
  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { pageId } = req.query

  if (!pageId) {
    return res.status(400).json({
      error: '缺少 pageId 参数',
      usage: '?pageId=<pageId>',
      example: '?pageId=d29c88a2bd1f06fcc58605a0261679a7'
    })
  }

  console.log('=================================')
  console.log('🧪 开始测试 Notion summary 更新')
  console.log('=================================')
  console.log(`📄 页面 ID: ${pageId}`)
  console.log('')

  try {
    // 直接更新摘要
    console.log('✏️  更新摘要到 Notion')
    const testSummary = '这是一个测试摘要，用于验证 Notion API 更新功能是否正常工作。时间: ' + new Date().toLocaleString()
    console.log('   测试摘要:', testSummary)

    const result = await updateNotionPageSummary(pageId, testSummary)

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: '测试失败',
        message: result.error || '未知错误',
        details: {
          specificError: result.error,
          pageId,
          testSummary
        }
      })
    }

    console.log('')
    console.log('✅ 摘要已成功更新到 Notion 数据库')

    return res.status(200).json({
      success: true,
      message: '测试成功！',
      data: {
        pageId,
        testSummary,
        timestamp: new Date().toISOString()
      },
      instructions: {
        nextSteps: [
          '打开 Notion 数据库',
          '找到对应的页面',
          '检查 summary 属性是否包含测试文本',
          '预期内容: "这是一个测试摘要..."'
        ],
        followUp: '如果一切正常，可以运行: npm run update-notion-summaries'
      }
    })

  } catch (error) {
    console.error('❌ 测试出错:', error.message)
    console.error('详细堆栈:', error.stack)

    return res.status(500).json({
      success: false,
      error: '测试出错',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
