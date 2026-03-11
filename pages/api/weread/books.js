import BLOG from '@/blog.config'
import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { createLogger, createRequestId } from '@/lib/server/logger'
import { createCacheStore, getCacheEntry, setCacheEntry } from '@/lib/server/cache'

const logger = createLogger('weread-books')
const cacheProviderConfigured = String(process.env.WEREAD_CACHE_PROVIDER || BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const cacheStore = createCacheStore(cacheProviderConfigured)
const pendingRequests = new Map()
const CACHE_TTL = Number(process.env.WEREAD_CACHE_TTL || 12 * 60 * 60 * 1000)
const WEREAD_WEB_BOOK_INFO_URL = 'https://weread.qq.com/web/book/info'
const WEREAD_I_BOOK_INFO_URL = 'https://i.weread.qq.com/book/info'
const DEFAULT_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'User-Agent':
    process.env.WEREAD_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  Referer: process.env.WEREAD_REFERER || 'https://weread.qq.com/'
}
const WEB_HEADERS = {
  ...DEFAULT_HEADERS,
  'x-wrpa-0': process.env.WEREAD_X_WRPA_0 || ''
}
const I_HEADERS = {
  ...DEFAULT_HEADERS,
  Host: 'i.weread.qq.com',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
}

const getCookieHeader = () => process.env.WEREAD_COOKIE || ''

const normalizeBookId = value => String(value || '').trim()
const normalizeText = value => String(value || '').trim()
const buildHref = (bookId, infoId = '') => {
  const normalizedInfoId = normalizeText(infoId)
  if (normalizedInfoId) return `https://weread.qq.com/web/reader/${normalizedInfoId}`
  return bookId ? `https://weread.qq.com/web/book/info?bookId=${bookId}` : ''
}
const sanitizeSummary = value => String(value || '').replace(/\s+/g, ' ').trim()

const parseIds = rawIds =>
  Array.from(
    new Set(
      String(rawIds || '')
        .split(',')
        .map(normalizeBookId)
        .filter(Boolean)
    )
  )

const buildBookCacheKey = bookId => `weread:book:${bookId}`

const mapBookPayload = payload => {
  const reader = payload?.reader || {}
  const bookInfo = reader?.bookInfo || payload?.bookInfo || payload || {}
  const bookId = normalizeBookId(bookInfo?.bookId || reader?.bookId || payload?.bookId)
  const infoId = normalizeText(reader?.infoId || payload?.infoId || bookInfo?.infoId || bookInfo?.encodeId || payload?.encodeId)
  return {
    bookId,
    infoId,
    title: bookInfo?.title || payload?.title || '',
    author: bookInfo?.author || payload?.author || '',
    cover: bookInfo?.cover || payload?.cover || bookInfo?.coverBoxInfo?.custom_cover || payload?.coverBoxInfo?.custom_cover || '',
    summary: sanitizeSummary(bookInfo?.AISummary || payload?.AISummary || bookInfo?.intro || payload?.intro),
    intro: sanitizeSummary(bookInfo?.intro || payload?.intro),
    AISummary: sanitizeSummary(bookInfo?.AISummary || payload?.AISummary),
    category: bookInfo?.category || payload?.category || bookInfo?.categories?.[0]?.title || payload?.categories?.[0]?.title || '',
    publisher: bookInfo?.publisher || payload?.publisher || '',
    publishTime: bookInfo?.publishTime || payload?.publishTime || '',
    isbn: bookInfo?.isbn || payload?.isbn || '',
    totalWords: bookInfo?.totalWords || payload?.totalWords || 0,
    rating: bookInfo?.newRating || payload?.newRating || bookInfo?.star || payload?.star || 0,
    ratingCount: bookInfo?.newRatingCount || payload?.newRatingCount || bookInfo?.ratingCount || payload?.ratingCount || 0,
    accentColor: bookInfo?.coverBoxInfo?.dominate_color?.hex || payload?.coverBoxInfo?.dominate_color?.hex || '',
    note: bookId ? `微信读书 ID：${bookId}` : '',
    href: buildHref(bookId, infoId, payload?.href || bookInfo?.href || reader?.href)
  }
}

function createRequestError(message, status, code, extra = {}) {
  const error = new Error(message)
  error.status = status
  error.code = code
  Object.assign(error, extra)
  return error
}

async function fetchJson(url, headers) {
  const response = await fetch(url, { headers })
  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }
  return { response, payload }
}

async function fetchBookViaWeb(bookId, cookie, requestId) {
  const url = new URL(WEREAD_WEB_BOOK_INFO_URL)
  url.searchParams.set('bookId', bookId)

  const { response, payload } = await fetchJson(url.toString(), {
    ...WEB_HEADERS,
    Cookie: cookie
  })

  if (!response.ok) {
    throw createRequestError(`WeRead web upstream request failed with status ${response.status}`, response.status, 'WEREAD_WEB_UPSTREAM_FAILED')
  }

  if (payload?.errCode) {
    throw createRequestError(payload?.errMsg || 'WeRead web returned an error payload', 502, 'WEREAD_WEB_RESPONSE_ERROR', {
      upstreamPayload: payload,
      requestId,
      bookId
    })
  }

  return mapBookPayload(payload)
}

async function fetchBookViaI(bookId, cookie) {
  const url = new URL(WEREAD_I_BOOK_INFO_URL)
  url.searchParams.set('bookId', bookId)

  const { response, payload } = await fetchJson(url.toString(), {
    ...I_HEADERS,
    Cookie: cookie
  })

  if (!response.ok) {
    throw createRequestError(`WeRead i upstream request failed with status ${response.status}`, response.status, 'WEREAD_I_UPSTREAM_FAILED')
  }

  if (payload?.errCode) {
    throw createRequestError(payload?.errMsg || 'WeRead i returned an error payload', 502, 'WEREAD_I_RESPONSE_ERROR')
  }

  return mapBookPayload(payload)
}

async function fetchBookFromUpstream(bookId, requestId) {
  const cookie = getCookieHeader()
  if (!cookie) {
    throw createRequestError('WEREAD_COOKIE is missing', 500, 'WEREAD_COOKIE_MISSING')
  }

  try {
    return await fetchBookViaWeb(bookId, cookie, requestId)
  } catch (error) {
    logger.warn('WeRead web endpoint failed, fallback to i.weread', {
      requestId,
      bookId,
      error: error?.message,
      code: error?.code
    })
    return fetchBookViaI(bookId, cookie)
  }
}

async function getBook(bookId, requestId) {
  const cacheKey = buildBookCacheKey(bookId)
  const cached = await getCacheEntry(cacheStore, cacheKey, CACHE_TTL)
  if (cached?.data) return cached.data

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  const pending = fetchBookFromUpstream(bookId, requestId)
    .then(async data => {
      await setCacheEntry(cacheStore, cacheKey, data, { ttl: CACHE_TTL })
      return data
    })
    .finally(() => {
      pendingRequests.delete(cacheKey)
    })

  pendingRequests.set(cacheKey, pending)
  return pending
}

export default async function handler(req, res) {
  const requestId = createRequestId()

  if (req.method !== 'GET') {
    return sendApiError(res, 405, { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED', requestId })
  }

  const ids = parseIds(req.query?.ids || req.query?.bookIds || req.query?.bookId)
  if (!ids.length) {
    return sendApiError(res, 400, { error: 'Missing book ids', code: 'MISSING_BOOK_IDS', requestId })
  }

  try {
    const settled = await Promise.allSettled(ids.map(bookId => getBook(bookId, requestId)))
    const books = settled.filter(item => item.status === 'fulfilled').map(item => item.value)
    const errors = settled
      .filter(item => item.status === 'rejected')
      .map(item => ({ message: item.reason?.message || 'Unknown error', code: item.reason?.code || 'UNKNOWN' }))

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')

    return sendApiSuccess(res, 200, {
      requestId,
      books,
      partial: errors.length > 0,
      errors
    })
  } catch (error) {
    logger.error('Failed to fetch WeRead books', {
      requestId,
      error: error?.message,
      code: error?.code
    })

    return sendApiError(res, error?.status || 502, {
      error: error?.message || 'Failed to fetch WeRead books',
      code: error?.code || 'WEREAD_FETCH_FAILED',
      requestId
    })
  }
}
