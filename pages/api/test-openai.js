import { getAiSummary } from '@/lib/plugins/aiSummary'
import { isValidAiSummary } from '@/lib/utils'

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { content, model = 'gpt-3.5-turbo' } = req.body

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      })
    }

    const aiSummaryAPI = process.env.AI_SUMMARY_API
    const aiSummaryKey = process.env.AI_SUMMARY_KEY

    if (!aiSummaryAPI || !aiSummaryKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API not configured',
        details: {
          hasAPI: !!aiSummaryAPI,
          hasKey: !!aiSummaryKey
        }
      })
    }

    // 使用现有的 getAiSummary 函数
    const summary = await getAiSummary(aiSummaryAPI, aiSummaryKey, content)

    if (isValidAiSummary(summary)) {
      res.status(200).json({
        success: true,
        summary,
        model,
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate summary',
        summary
      })
    }
  } catch (error) {
    console.error('OpenAI test error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        stack: error.stack
      }
    })
  }
}