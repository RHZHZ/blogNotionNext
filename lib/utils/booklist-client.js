const BOOKLIST_CACHE_KEY = 'heo-booklist-cache'
const BOOKLIST_CACHE_TTL = 5 * 60 * 1000
const BOOKLIST_MEMORY_RESULT_TTL = 8 * 1000
let inflightBookListPayloadPromise = null
let latestBookListPayloadResult = null
let latestBookListPayloadTimestamp = 0



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

export const readBookListCache = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(BOOKLIST_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || Date.now() - parsed.timestamp > BOOKLIST_CACHE_TTL) {
      window.sessionStorage.removeItem(BOOKLIST_CACHE_KEY)
      return null
    }
    return {
      payload: normalizeBookListPayload(parsed.payload),
      status: normalizeBookListRuntimeStatus({ ...parsed.status, fromCache: true })
    }
  } catch {
    return null
  }
}

export const writeBookListCache = (payload, status) => {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      BOOKLIST_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        payload: normalizeBookListPayload(payload),
        status: normalizeBookListRuntimeStatus(status)
      })
    )
  } catch {}
}

function normalizeBookListResult(result) {
  return {
    payload: normalizeBookListPayload(result?.payload),
    status: normalizeBookListRuntimeStatus(result?.status)
  }
}

function getFreshBookListMemoryResult() {
  if (!latestBookListPayloadResult) return null
  if (Date.now() - latestBookListPayloadTimestamp > BOOKLIST_MEMORY_RESULT_TTL) {
    latestBookListPayloadResult = null
    latestBookListPayloadTimestamp = 0
    return null
  }
  return normalizeBookListResult(latestBookListPayloadResult)
}

function setBookListMemoryResult(result) {
  latestBookListPayloadResult = normalizeBookListResult(result)
  latestBookListPayloadTimestamp = Date.now()
  return latestBookListPayloadResult
}

async function requestBookListPayload(cached) {

  const response = await fetch('/api/booklist', { cache: 'default' })

  if (response.status === 304) {
    if (cached?.payload && hasBookListData(cached.payload)) {
      return normalizeBookListResult({
        payload: cached.payload,
        status: { ...(cached.status || {}), fromCache: true }
      })
    }
    throw new Error('书单数据未变化，但当前没有可用缓存')
  }

  if (!response.ok) throw new Error('书单数据读取失败')
  const result = await response.json()
  return normalizeBookListResult({
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
  })
}

export const fetchBookListPayload = async cached => {
  if (typeof window === 'undefined') {
    return requestBookListPayload(cached)
  }

  const memoryResult = getFreshBookListMemoryResult()
  if (memoryResult) {
    return memoryResult
  }

  if (!inflightBookListPayloadPromise) {
    inflightBookListPayloadPromise = requestBookListPayload(cached)
      .then(result => setBookListMemoryResult(result))
      .finally(() => {
        inflightBookListPayloadPromise = null
      })
  }

  const result = await inflightBookListPayloadPromise
  return normalizeBookListResult(result)
}


