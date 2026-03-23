import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'
import path from 'path'
import { RateLimiter } from './RateLimiter'

// 限流配置，打包编译阶段避免接口频繁，限制频率
const useRateLimiter = process.env.BUILD_MODE || process.env.EXPORT
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(200, lockFilePath)

const DEFAULT_NOTION_API_BASE_URL = 'https://www.notion.so/api/v3'
const NOTION_REQUEST_TIMEOUT = Number(process.env.NOTION_REQUEST_TIMEOUT || 20000)
const NOTION_REQUEST_RETRY = Number(process.env.NOTION_REQUEST_RETRY || 2)

const globalStore = { notion: new Map(), inflight: new Map() }

function getApiBaseUrls() {
  const baseUrls = [BLOG.API_BASE_URL || DEFAULT_NOTION_API_BASE_URL, DEFAULT_NOTION_API_BASE_URL]
  return [...new Set(baseUrls.filter(Boolean))]
}

function isRetryableNetworkError(error) {
  const code = error?.cause?.cause?.code || error?.cause?.code || error?.code
  const message = String(error?.message || '').toLowerCase()
  return (
    code === 'UND_ERR_CONNECT_TIMEOUT' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNREFUSED' ||
    message.includes('fetch failed') ||
    message.includes('timeout')
  )
}

function createNotionClient(apiBaseUrl) {
  return new NotionLibrary({
    apiBaseUrl,
    activeUser: BLOG.NOTION_ACTIVE_USER || null,
    authToken: BLOG.NOTION_TOKEN_V2 || null,
    userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ofetchOptions: {
      timeout: NOTION_REQUEST_TIMEOUT,
      retry: NOTION_REQUEST_RETRY,
      retryDelay: 1000
    }
  })
}

function getRawNotion(apiBaseUrl) {
  if (!globalStore.notion.has(apiBaseUrl)) {
    globalStore.notion.set(apiBaseUrl, createNotionClient(apiBaseUrl))
  }
  return globalStore.notion.get(apiBaseUrl)
}

async function callWithClient(apiBaseUrl, methodName, args) {
  const notion = getRawNotion(apiBaseUrl)
  const original = notion[methodName]
  if (typeof original !== 'function') throw new Error(`${methodName} is not a function`)
  return original.apply(notion, args)
}

async function callNotion(methodName, ...args) {
  const key = `${methodName}-${JSON.stringify(args)}`

  if (globalStore.inflight.has(key)) return globalStore.inflight.get(key)

  const execute = async () => {
    const apiBaseUrls = getApiBaseUrls()
    let lastError = null

    for (let index = 0; index < apiBaseUrls.length; index++) {
      const apiBaseUrl = apiBaseUrls[index]
      try {
        if (index > 0) {
          console.warn(`[NotionAPI] 主域名请求失败，切换到备用域名: ${apiBaseUrl}`)
        }
        return await callWithClient(apiBaseUrl, methodName, args)
      } catch (error) {
        lastError = error
        const shouldTryNext = index < apiBaseUrls.length - 1 && isRetryableNetworkError(error)
        console.warn(`[NotionAPI] ${methodName} 请求失败: ${apiBaseUrl}`, error?.message || error)
        if (!shouldTryNext) {
          throw error
        }
      }
    }

    throw lastError
  }

  const promise = useRateLimiter
    ? rateLimiter.enqueue(key, execute)
    : execute()

  globalStore.inflight.set(key, promise)
  promise.finally(() => globalStore.inflight.delete(key))
  return promise
}

export const notionAPI = {
  getPage: (...args) => callNotion('getPage', ...args),
  getBlocks: (...args) => callNotion('getBlocks', ...args),
  getUsers: (...args) => callNotion('getUsers', ...args),
  __call: callNotion
}

export default notionAPI
