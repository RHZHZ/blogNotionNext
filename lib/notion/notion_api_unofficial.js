/**
 * 使用 unofficial Notion API 更新页面属性
 * 不需要 Integration Token，使用 NOTION_TOKEN_V2
 */

import BLOG from '@/blog.config'
import { RateLimiter } from '../db/notion/RateLimiter'
import path from 'path'

// 限流配置
const useRateLimiter = process.env.BUILD_MODE || process.env.EXPORT
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(200, lockFilePath)

/**
 * 使用 unofficial Notion API 更新页面属性
 * @param {string} pageId - Notion 页面 ID
 * @param {object} properties - 要更新的属性
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updatePagePropertiesUnofficial(pageId, properties) {
  try {
    const token = BLOG.NOTION_TOKEN_V2 || process.env.NOTION_TOKEN_V2

    if (!token) {
      return { success: false, error: 'NOTION_TOKEN_V2 未配置' }
    }

    console.log(`使用 unofficial Notion API 更新页面 ${pageId}`)
    console.log(`Token 长度: ${token.length}`)

    // 构建请求数据（尽量兼容不同 pageId 格式）
    const normalizedPageId = String(pageId || '').replace(/-/g, '')
    const requestData = {
      pointer: {
        id: normalizedPageId || pageId,
        table: 'block'
      },
      version: 1,
      requests: [
        {
          command: 'set',
          path: [],
          args: {
            properties: properties
          }
        }
      ]
    }

    // 构建请求
    const apiUrl = `${BLOG.API_BASE_URL || 'https://www.notion.so/api/v3'}/submitTransaction`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token_v2=${token}`
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 请求失败: ${response.status} - ${errorText}`)
    }

    await response.json()

    console.log(`✅ 页面 ${pageId} 更新成功`)
    return { success: true }

  } catch (error) {
    console.error('Unofficial API 更新失败:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 更新 Notion 页面的 summary 属性（使用 unofficial API）
 * @param {string} pageId - Notion 页面 ID
 * @param {string} summary - AI 摘要内容
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function updateNotionPageSummaryUnofficial(pageId, summary) {
  return updatePagePropertiesUnofficial(pageId, {
    summary: [[summary]]
  })
}

export default {
  updatePagePropertiesUnofficial,
  updateNotionPageSummaryUnofficial
}
