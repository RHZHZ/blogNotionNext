import BLOG from '@/blog.config'
import { RateLimiter } from '../db/notion/RateLimiter'
import path from 'path'

// 限流配置
const useRateLimiter = process.env.BUILD_MODE || process.env.EXPORT
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(200, lockFilePath)

/**
 * 使用 Official Notion API 更新页面属性
 * 需要 NOTION_ACCESS_TOKEN (Integration Token)
 * @param {string} pageId - Notion 页面 ID
 * @param {object} properties - 要更新的属性
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function updatePagePropertiesOfficial(pageId, properties) {
  const token = (BLOG.NOTION_ACCESS_TOKEN || process.env.NOTION_ACCESS_TOKEN || '').trim()

  if (!token) {
    return { success: false, error: 'NOTION_ACCESS_TOKEN 未配置' }
  }

  // 兼容 Notion 不同阶段的 token 前缀（常见为 secret_ 或 ntn_）
  // 不做强拦截，避免误判导致无法请求
  if (!token.startsWith('secret_') && !token.startsWith('ntn_')) {
    console.warn('⚠️ NOTION_ACCESS_TOKEN 前缀非常见（secret_ / ntn_），将继续尝试请求 Official API')
  }


  // 转换属性格式为 Official API 格式
  const officialProperties = {}
  for (const [key, value] of Object.entries(properties)) {
    if (key === 'summary') {
      officialProperties[key] = {
        rich_text: Array.isArray(value) && value[0]
          ? [{ text: { content: value[0][0] || '' } }]
          : [{ text: { content: String(value) } }]
      }
    } else {
      officialProperties[key] = {
        rich_text: Array.isArray(value) && value[0]
          ? [{ text: { content: value[0][0] || '' } }]
          : [{ text: { content: String(value) } }]
      }
    }
  }

  console.log(`使用 Official Notion API 更新页面 ${pageId}`)
  console.log(`Token 长度: ${token.length}`)

  const apiUrl = `https://api.notion.com/v1/pages/${pageId}`
  const maxRetries = 3

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ properties: officialProperties }),
        signal: AbortSignal.timeout(12000)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: `Official API 请求失败: ${response.status} - ${errorData.message || response.statusText}`
        }
      }

      const result = await response.json()
      console.log(`✅ Official API 页面 ${pageId} 更新成功`)
      return { success: true, data: result }
    } catch (error) {
      const errorCode = error?.cause?.code || error?.code || ''
      const isNetworkError = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'].includes(errorCode) ||
        String(error?.message || '').includes('fetch failed')

      if (!isNetworkError || attempt === maxRetries) {
        console.error('Official API 更新失败:', error)
        return { success: false, error: error?.message || '未知错误' }
      }

      const wait = attempt * 1000
      console.warn(`Official API 网络异常，${wait}ms 后重试（${attempt}/${maxRetries}）`, errorCode || error?.message)
      await new Promise(resolve => setTimeout(resolve, wait))
    }
  }

  return { success: false, error: 'Official API 重试后仍失败' }
}

/**
 * 使用 Official API 更新 Notion 页面的 summary 属性
 * @param {string} pageId - Notion 页面 ID
 * @param {string} summary - AI 摘要内容
 * @returns {Promise<{success: boolean, error?: string}>} 更新结果
 */
export async function updateNotionPageSummary(pageId, summary) {
  return updatePagePropertiesOfficial(pageId, {
    summary: [[summary]]
  })
}

/**
 * 批量更新多个页面的摘要（使用 Official API）
 * @param {Array<{pageId: string, summary: string}>} updates - 更新列表
 * @returns {Promise<{success: number, failed: number}>} 更新结果统计
 */
export async function batchUpdateNotionSummaries(updates) {
  if (!updates || updates.length === 0) {
    return { success: 0, failed: 0 }
  }

  console.log(`开始批量更新 ${updates.length} 个 Notion 页面摘要...`)

  let successCount = 0
  let failedCount = 0

  for (const update of updates) {
    const result = await updateNotionPageSummary(update.pageId, update.summary)
    if (result.success) {
      successCount++
    } else {
      failedCount++
      console.log(`   失败: ${update.pageId} - ${result.error}`)
    }

    // 添加延迟以避免触发 API 限流
    if (updates.indexOf(update) < updates.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  console.log(`批量更新完成: 成功 ${successCount}, 失败 ${failedCount}`)
  return { success: successCount, failed: failedCount }
}

export default {
  updateNotionPageSummary,
  batchUpdateNotionSummaries,
}
