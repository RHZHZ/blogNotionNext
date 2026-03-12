import { createClientCacheResource } from '@/lib/utils/client-cache-resource'

const BOOKLIST_CACHE_KEY = 'heo-booklist-cache'
const BOOKLIST_CACHE_TTL = 5 * 60 * 1000
const BOOKLIST_MEMORY_RESULT_TTL = 8 * 1000

const BOOKLIST_SOURCE_LABELS = {
  notion: 'Notion 持久化快照',
  'weread+notion': '微信读书刷新并已写入 Notion',
  weread: '微信读书实时结果',
  config: '本地配置回退',
  hero: '首页预览缓存',
  unknown: '默认数据源'
}

export const normalizeBookListPayload = payload => ({
  archive: Array.isArray(payload?.archive) ? payload.archive : [],
  books: Array.isArray(payload?.books) ? payload.books : []
})

export const normalizeBookListRuntimeStatus = status => ({
  source: String(status?.source || 'unknown'),
  sourceLabel: BOOKLIST_SOURCE_LABELS[String(status?.source || 'unknown')] || BOOKLIST_SOURCE_LABELS.unknown,
  persisted: Boolean(status?.persisted),
  refreshed: Boolean(status?.refreshed),
  fromCache: Boolean(status?.fromCache)
})

export const hasBookListData = payload => Boolean((payload?.archive || []).length || (payload?.books || []).length)

export const getBookListPayloadBooks = payload => normalizeBookListPayload(payload).books

const bookListCacheResource = createClientCacheResource({
  cacheKey: BOOKLIST_CACHE_KEY,
  cacheTTL: BOOKLIST_CACHE_TTL,
  memoryTTL: BOOKLIST_MEMORY_RESULT_TTL,
  normalize: result => ({
    payload: normalizeBookListPayload(result?.payload),
    status: normalizeBookListRuntimeStatus(result?.status)
  }),
  onReadStorage: ({ parsed, timestamp, expiresAt }) => ({
    payload: parsed?.payload,
    status: {
      ...(parsed?.status || {}),
      fromCache: true,
      cacheTimestamp: timestamp,
      cacheExpiresAt: expiresAt
    }
  }),
  onWriteStorage: ({ value, timestamp, expiresAt }) => ({
    payload: normalizeBookListPayload(value?.payload),
    status: normalizeBookListRuntimeStatus({
      ...value?.status,
      cacheTimestamp: timestamp,
      cacheExpiresAt: expiresAt
    })
  })
})

export const readBookListCache = () => bookListCacheResource.readStorage()

export const writeBookListCache = (payload, status) => {
  bookListCacheResource.writeStorage({ payload, status })
}

async function requestBookListPayload(cached) {

  const response = await fetch('/api/booklist', { cache: 'default' })

  if (response.status === 304) {
    if (cached?.payload && hasBookListData(cached.payload)) {
      return {
        payload: cached.payload,
        status: { ...(cached.status || {}), fromCache: true }
      }
    }
    throw new Error('书单数据未变化，但当前没有可用缓存')
  }

  if (!response.ok) throw new Error('书单数据读取失败')
  const result = await response.json()
  return {
    payload: {
      archive: Array.isArray(result?.bookList?.archive) ? result.bookList.archive : Array.isArray(result?.archive) ? result.archive : [],
      books: Array.isArray(result?.bookList?.books) ? result.bookList.books : Array.isArray(result?.books) ? result.books : []
    },
    status: {
      source: result?.source,
      persisted: result?.persisted,
      refreshed: result?.refreshed,
      fromCache: false
    }
  }
}

export const fetchBookListPayload = async cached => {
  if (typeof window === 'undefined') {
    return requestBookListPayload(cached)
  }

  return bookListCacheResource.fetch({
    request: () => requestBookListPayload(cached)
  })
}


