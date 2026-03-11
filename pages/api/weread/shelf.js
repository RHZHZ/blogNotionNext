import BLOG from '@/blog.config'
import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { createLogger, createRequestId } from '@/lib/server/logger'
import { createCacheStore, getCacheEntry, setCacheEntry } from '@/lib/server/cache'

const logger = createLogger('weread-shelf')
const cacheProviderConfigured = String(process.env.WEREAD_CACHE_PROVIDER || BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const cacheStore = createCacheStore(cacheProviderConfigured)
const CACHE_TTL = Number(process.env.WEREAD_SHELF_CACHE_TTL || process.env.WEREAD_CACHE_TTL || 12 * 60 * 60 * 1000)
const pendingRequests = new Map()
const WEREAD_WEB_SHELF_SYNC_URL = 'https://weread.qq.com/web/shelf/sync'
const WEREAD_WEB_SHELF_SYNC_BOOK_URL = 'https://weread.qq.com/web/shelf/syncBook'
const DEFAULT_SHELF_SYNC_PAYLOAD = {
  synckeys: [],
  lectureSynckeys: [],
  archiveOffset: 0,
  archiveCount: 0,
  count: Number(process.env.WEREAD_SHELF_COUNT || 100),
  isArchive: null,
  currentArchiveId: null,
  loadMore: true
}
const DEFAULT_HEADERS = {
  'User-Agent':
    process.env.WEREAD_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
}
const WEB_HEADERS = {
  ...DEFAULT_HEADERS,
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json;charset=UTF-8',
  Origin: 'https://weread.qq.com',
  Referer: process.env.WEREAD_REFERER || 'https://weread.qq.com/',
  'x-wrpa-0': process.env.WEREAD_X_WRPA_0 || ''
}

const getCookieHeader = () => process.env.WEREAD_COOKIE || ''
const normalizeBookId = value => String(value || '').trim()
const normalizeText = value => String(value || '').trim()
const normalizeName = value => String(value || '').trim().toLowerCase()
const buildHref = (bookId, infoId = '') => {
  const normalizedInfoId = normalizeText(infoId)
  if (normalizedInfoId) return `https://weread.qq.com/web/reader/${normalizedInfoId}`
  return bookId ? `https://weread.qq.com/web/book/info?bookId=${bookId}` : ''
}

const splitTextList = value =>
  String(value || '')
    .split(/[\n,，;；|/]+/)
    .map(item => String(item || '').trim())
    .filter(Boolean)
const dedupeTextList = values => Array.from(new Set((values || []).map(item => String(item || '').trim()).filter(Boolean)))
const buildCacheKey = (userVid, shelfNames = []) => `weread:shelf:v3:${userVid}:${dedupeTextList(shelfNames).join('|')}`

const isArchiveEntry = item => item?.role === 'archive' || (item?.archiveId && Array.isArray(item?.bookIds))

function normalizeArchiveItem(item = {}) {
  return {
    ...item,
    archiveId: Number(item?.archiveId) || item?.archiveId || null,
    name: String(item?.name || '').trim(),
    bookIds: Array.isArray(item?.bookIds) ? item.bookIds.map(normalizeBookId).filter(Boolean) : [],
    lectureBookIds: Array.isArray(item?.lectureBookIds) ? item.lectureBookIds.map(normalizeBookId).filter(Boolean) : [],
    removed: Array.isArray(item?.removed) ? item.removed : [],
    lectureRemoved: Array.isArray(item?.lectureRemoved) ? item.lectureRemoved : []
  }
}

function extractArchiveItems(data = {}) {
  const directArchive = Array.isArray(data?.archive) ? data.archive : []
  const mixedBooks = Array.isArray(data?.books) ? data.books.filter(isArchiveEntry) : []
  const mixedAllBooks = Array.isArray(data?.allBooks) ? data.allBooks.filter(isArchiveEntry) : []
  const merged = [...directArchive, ...mixedBooks, ...mixedAllBooks].map(normalizeArchiveItem)
  const archiveMap = new Map()
  for (const item of merged) {
    const key = String(item?.archiveId || '').trim() || normalizeName(item?.name)
    if (!key) continue
    if (!archiveMap.has(key)) archiveMap.set(key, item)
  }
  return Array.from(archiveMap.values())
}

const parseCookieMap = cookieHeader =>
  String(cookieHeader || '')
    .split(';')
    .map(item => item.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const separatorIndex = item.indexOf('=')
      if (separatorIndex <= 0) return acc
      const key = item.slice(0, separatorIndex).trim()
      const value = item.slice(separatorIndex + 1).trim()
      if (key) acc[key] = value
      return acc
    }, {})

const getUserVid = () => {
  const envVid = String(process.env.WEREAD_USER_VID || '').trim()
  if (envVid) return envVid
  const cookieMap = parseCookieMap(getCookieHeader())
  return String(cookieMap.wr_vid || '').trim()
}

const mapShelfBook = book => ({
  ...book,
  bookId: normalizeBookId(book?.bookId),
  infoId: normalizeText(book?.infoId || book?.encodeId),
  title: book?.title || '',
  author: book?.author || '',
  cover: book?.cover || '',
  category: book?.category || book?.categories?.[0]?.title || '',
  publishTime: book?.publishTime || '',
  totalWords: book?.totalWords || 0,
  rating: book?.newRating || book?.rating || 0,
  ratingCount: book?.newRatingCount || book?.ratingCount || 0,
  readUpdateTime: book?.readUpdateTime || 0,
  href: buildHref(normalizeBookId(book?.bookId), normalizeText(book?.infoId || book?.encodeId))
})

const mapLectureBook = book => ({
  ...book,
  bookId: normalizeBookId(book?.bookId),
  readUpdateTime: book?.lectureReadUpdateTime || book?.readUpdateTime || 0,
  isAudio: true
})

function mergeProgressIntoBooks(books = [], progress = []) {
  const progressMap = new Map(
    progress
      .map(item => [normalizeBookId(item?.bookId), item])
      .filter(([bookId]) => bookId)
  )

  return books.map(book => {
    const current = progressMap.get(normalizeBookId(book?.bookId))
    return {
      ...book,
      readUpdateTime: current?.readUpdateTime || book?.readUpdateTime || 0,
      progress: typeof current?.progress === 'number' ? current.progress : undefined,
      updateTime: current?.updateTime || book?.updateTime || 0
    }
  })
}

function collectArchiveBooks(archive = [], books = [], lectureBooks = []) {
  const bookMap = new Map(books.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))
  const lectureMap = new Map(lectureBooks.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))

  return archive.flatMap(item => {
    const archiveBooks = Array.isArray(item?.bookIds)
      ? item.bookIds.map(bookId => bookMap.get(normalizeBookId(bookId))).filter(Boolean)
      : []
    const archiveLectureBooks = Array.isArray(item?.lectureBookIds)
      ? item.lectureBookIds.map(bookId => lectureMap.get(normalizeBookId(bookId))).filter(Boolean)
      : []
    return [...archiveBooks, ...archiveLectureBooks]
  })
}

const findArchiveByName = (archive = [], shelfName = '') => {
  const normalizedTarget = normalizeName(shelfName)
  if (!normalizedTarget) return null
  return archive.find(item => normalizeName(item?.name) === normalizedTarget) || null
}

function collectBooksFromArchiveNames({ archive = [], books = [], lectureBooks = [], shelfNames = [] }) {
  const bookMap = new Map(books.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))
  const lectureMap = new Map(lectureBooks.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))

  return dedupeBooks(
    dedupeTextList(shelfNames).flatMap(shelfName => {
      const archiveItem = findArchiveByName(archive, shelfName)
      if (!archiveItem) return []
      const archiveBooks = Array.isArray(archiveItem?.bookIds)
        ? archiveItem.bookIds.map(bookId => bookMap.get(normalizeBookId(bookId))).filter(Boolean)
        : []
      const archiveLectureBooks = Array.isArray(archiveItem?.lectureBookIds)
        ? archiveItem.lectureBookIds.map(bookId => lectureMap.get(normalizeBookId(bookId))).filter(Boolean)
        : []
      return [...archiveBooks, ...archiveLectureBooks]
    })
  )
}


function dedupeBooks(books = []) {
  const map = new Map()
  for (const book of books) {
    const bookId = normalizeBookId(book?.bookId)
    if (!bookId) continue
    if (!map.has(bookId)) {
      map.set(bookId, mapShelfBook(book))
    }
  }
  return Array.from(map.values()).sort((a, b) => (b.readUpdateTime || 0) - (a.readUpdateTime || 0))
}

function createError(message, status, code) {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

async function fetchShelfViaWeb(cookie) {
  const getResponse = await fetch(WEREAD_WEB_SHELF_SYNC_URL, {
    method: 'GET',
    headers: {
      ...DEFAULT_HEADERS,
      Accept: 'application/json, text/plain, */*',
      Referer: process.env.WEREAD_REFERER || 'https://weread.qq.com/',
      Cookie: cookie,
      'x-wrpa-0': process.env.WEREAD_X_WRPA_0 || ''
    }
  })

  if (getResponse.ok) {
    const payload = await getResponse.json()
    if (!payload?.errCode) {
      const data = payload?.data || payload || {}
      const books = Array.isArray(data?.books) ? data.books : []
      const progress = Array.isArray(data?.bookProgress) ? data.bookProgress : []
      const lectureBooks = Array.isArray(data?.lectureBooks) ? data.lectureBooks.map(mapLectureBook) : []
      const archive = extractArchiveItems(data)

      const mergedBooks = mergeProgressIntoBooks(books, progress)
      const archiveBooks = collectArchiveBooks(archive, mergedBooks, lectureBooks)

      return {
        userVid: getUserVid(),
        archive,
        books: dedupeBooks([...mergedBooks, ...lectureBooks, ...archiveBooks])
      }

    }
  }

  const postResponse = await fetch(WEREAD_WEB_SHELF_SYNC_BOOK_URL, {
    method: 'POST',
    headers: {
      ...WEB_HEADERS,
      Cookie: cookie
    },
    body: JSON.stringify(DEFAULT_SHELF_SYNC_PAYLOAD)
  })

  if (!postResponse.ok) {
    throw createError(`WeRead shelf request failed with status ${getResponse.status}/${postResponse.status}`, postResponse.status === 401 || postResponse.status === 403 ? 502 : postResponse.status, 'WEREAD_SHELF_UPSTREAM_FAILED')
  }

  const payload = await postResponse.json()
  if (payload?.errCode) {
    throw createError(payload?.errMsg || 'WeRead syncBook response error', 502, 'WEREAD_SYNC_BOOK_RESPONSE_ERROR')
  }
  const data = payload?.data || payload || {}

  const books = Array.isArray(data?.books) ? data.books : []
  const progress = Array.isArray(data?.bookProgress) ? data.bookProgress : []
  const lectureBooks = Array.isArray(data?.lectureBooks) ? data.lectureBooks.map(mapLectureBook) : []
  const archive = extractArchiveItems(data)
  const mergedBooks = mergeProgressIntoBooks(books, progress)
  const archiveBooks = collectArchiveBooks(archive, mergedBooks, lectureBooks)

  return {
    userVid: getUserVid(),
    archive,
    books: dedupeBooks([...mergedBooks, ...lectureBooks, ...archiveBooks])
  }

}


async function fetchShelfFromUpstream() {
  const cookie = getCookieHeader()
  if (!cookie) {
    throw createError('WEREAD_COOKIE is missing', 500, 'WEREAD_COOKIE_MISSING')
  }

  return fetchShelfViaWeb(cookie)
}

function buildDebugInfo(data = {}, shelfNames = []) {
  const archive = Array.isArray(data?.archive) ? data.archive : []
  const matchedArchives = dedupeTextList(shelfNames)
    .map(shelfName => {
      const matched = findArchiveByName(archive, shelfName)
      return matched
        ? {
            shelfName,
            archiveId: matched.archiveId || null,
            archiveName: matched.name || '',
            bookCount: Array.isArray(matched.bookIds) ? matched.bookIds.length : 0,
            lectureBookCount: Array.isArray(matched.lectureBookIds) ? matched.lectureBookIds.length : 0
          }
        : {
            shelfName,
            archiveId: null,
            archiveName: '',
            bookCount: 0,
            lectureBookCount: 0
          }
    })

  return {
    archiveCount: archive.length,
    archiveNames: archive.map(item => String(item?.name || '').trim()).filter(Boolean),
    matchedArchives
  }
}

async function getShelf(userVid, shelfNames = [], options = {}) {
  const cacheKey = buildCacheKey(userVid || 'auto', shelfNames)


  try {
    const cached = await getCacheEntry(cacheStore, cacheKey, CACHE_TTL)
    if (cached?.data) return cached.data
  } catch (error) {
    logger.warn('Failed to read WeRead shelf cache, continue without cache', {
      cacheKey,
      provider: cacheStore?.provider,
      error: error?.message
    })
  }

  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)
  }

  const pending = fetchShelfFromUpstream(userVid)
    .then(async data => {
      const nextData = dedupeTextList(shelfNames).length
        ? {
            ...data,
            shelfNames: dedupeTextList(shelfNames),
            books: collectBooksFromArchiveNames({
              archive: Array.isArray(data?.archive) ? data.archive : [],
              books: Array.isArray(data?.books) ? data.books : [],
              lectureBooks: [],
              shelfNames: dedupeTextList(shelfNames)
            })
          }
        : data

      const result = options?.debug
        ? {
            ...nextData,
            debug: buildDebugInfo(data, dedupeTextList(shelfNames))
          }
        : nextData
      try {
        await setCacheEntry(cacheStore, cacheKey, result, { ttl: CACHE_TTL })
      } catch (error) {
        logger.warn('Failed to write WeRead shelf cache, continue without cache', {
          cacheKey,
          provider: cacheStore?.provider,
          error: error?.message
        })
      }
      return result
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

  const userVid = normalizeBookId(req.query?.userVid || getUserVid())
  const debug = ['1', 'true', 'yes', 'on'].includes(String(req.query?.debug || '').trim().toLowerCase())
  const shelfNames = dedupeTextList([
    ...splitTextList(req.query?.shelfName),
    ...splitTextList(req.query?.shelfNames)
  ])

  try {
    const data = await getShelf(userVid, shelfNames, { debug })
    res.setHeader('Cache-Control', shelfNames.length ? 'no-store' : 'public, s-maxage=600, stale-while-revalidate=3600')

    return sendApiSuccess(res, 200, {
      requestId,
      ...data
    })
  } catch (error) {
    logger.error('Failed to fetch WeRead shelf', {
      requestId,
      error: error?.message,
      code: error?.code,
      userVid
    })

    return sendApiError(res, error?.status || 502, {
      error: error?.message || 'Failed to fetch WeRead shelf',
      code: error?.code || 'WEREAD_SHELF_FETCH_FAILED',
      requestId
    })
  }
}
