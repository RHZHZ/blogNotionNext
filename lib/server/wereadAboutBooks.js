import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { createLogger } from '@/lib/server/logger'
import { createCacheStore, getCacheEntry, setCacheEntry } from '@/lib/server/cache'
import CONFIG from '@/themes/heo/config'



const logger = createLogger('weread-about-books')
const wereadAboutCacheProvider = String(process.env.WEREAD_CACHE_PROVIDER || BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory')
const wereadAboutCacheStore = createCacheStore(wereadAboutCacheProvider, {
  keyPrefix: 'blognext:weread-about-books'
})
const WEREAD_ABOUT_SYNC_COOLDOWN_KEY = 'weread:about:sync:cooldown'
const WEREAD_ABOUT_SYNC_COOLDOWN_MS = Math.max(0, Number(process.env.WEREAD_ABOUT_SYNC_COOLDOWN_MS || 10 * 60 * 1000) || 10 * 60 * 1000)
const NOTION_VERSION = '2022-06-28'
const WEREAD_WEB_BOOK_INFO_URL = 'https://weread.qq.com/web/book/info'
const WEREAD_I_BOOK_INFO_URL = 'https://i.weread.qq.com/book/info'
const WEREAD_WEB_SHELF_SYNC_URL = 'https://weread.qq.com/web/shelf/sync'
const WEREAD_WEB_SHELF_SYNC_BOOK_URL = 'https://weread.qq.com/web/shelf/syncBook'

const DEFAULT_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'User-Agent':
    process.env.WEREAD_USER_AGENT ||
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
  Referer: process.env.WEREAD_REFERER || 'https://weread.qq.com/'
}

const WEB_HEADERS = {
  ...DEFAULT_HEADERS,
  Origin: 'https://weread.qq.com',
  'Content-Type': 'application/json;charset=UTF-8',
  'x-wrpa-0': process.env.WEREAD_X_WRPA_0 || ''
}

const I_HEADERS = {
  ...DEFAULT_HEADERS,
  Host: 'i.weread.qq.com',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
}

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

const PROPERTY_CANDIDATES = {
  title: ['Name', 'Title'],
  group: ['ShelfGroup', 'Shelf', 'Group', 'Type'],
  shelfName: ['ShelfName', 'Shelf Name', 'shelfName', 'ArchiveName', 'Archive', 'ListName', 'Booklist'],
  bookId: ['BookId', 'Book ID', 'ID'],
  infoId: ['InfoId', 'Info ID', 'EncodeId', 'Encode ID'],
  author: ['Author'],
  cover: ['Cover'],
  summary: ['Summary', 'Description', 'Intro'],
  note: ['Note'],
  href: ['Href', 'Link', 'URL'],
  readUpdateTime: ['ReadUpdateTime', 'Read Update Time', 'UpdatedAt', 'LastReadTime'],
  progress: ['Progress'],
  sort: ['Sort', 'Order'],
  enabled: ['Enabled'],
  source: ['Source'],
  wereadCookie: ['WeReadCookie', 'WereadCookie', 'WEREAD_COOKIE', 'Cookie'],
  refreshRequested: ['NeedRefresh', 'ShouldRefresh', 'RefreshRequested', 'UpdateNow', 'Update', '更新'],
  favoriteShelfNames: ['FavoriteShelfNames', 'FavoriteShelfName', 'FavoriteShelf', 'FavoriteArchive', 'FavoriteArchiveName'],
  recentShelfNames: ['RecentShelfNames', 'RecentShelfName', 'RecentShelf', 'RecentArchive', 'RecentArchiveName']
}

const normalizeText = value => String(value || '').trim()
const normalizeName = value => normalizeText(value).toLowerCase()
const normalizeBookId = value => normalizeText(value)
const dedupeTextList = values => {
  const result = []
  const seen = new Set()

  for (const value of Array.isArray(values) ? values : []) {
    const text = normalizeText(value)
    const key = normalizeName(text)
    if (!text || seen.has(key)) continue
    seen.add(key)
    result.push(text)
  }

  return result
}


const buildHref = rawHref => {
  const normalizedRawHref = normalizeText(rawHref)
  if (/weread\.qq\.com\/book-detail\?/i.test(normalizedRawHref)) return normalizedRawHref
  return normalizeText(BLOG.LINK)
}
const sanitizeSummary = value => String(value || '').replace(/\s+/g, ' ').trim()
const WEREAD_DETAIL_CONCURRENCY = Math.max(1, Number(process.env.WEREAD_DETAIL_CONCURRENCY || 1) || 1)
const WEREAD_DETAIL_DELAY_MS = Math.max(0, Number(process.env.WEREAD_DETAIL_DELAY_MS || 1000) || 1000)
const WEREAD_DETAIL_MAX_ENRICH_COUNT = Math.max(0, Number(process.env.WEREAD_DETAIL_MAX_ENRICH_COUNT || 10) || 10)



const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const getCookieHeader = () => normalizeText(process.env.WEREAD_COOKIE)
const getAboutProfile = () => siteConfig('HEO_ABOUT_PROFILE', {}, CONFIG) || {}


const parseInfoIdFromHref = href => {
  const normalizedHref = normalizeText(href)
  const readerMatch = normalizedHref.match(/\/web\/reader\/([^/?#]+)/i)
  if (readerMatch?.[1]) return normalizeText(readerMatch[1])
  const infoIdMatch = normalizedHref.match(/[?&](?:infoId|encodeId)=([^&#]+)/i)
  if (infoIdMatch?.[1]) return normalizeText(infoIdMatch[1])
  return ''
}

const parseBookIdFromConfig = book => {
  if (book?.bookId) return normalizeBookId(book.bookId)

  const href = normalizeText(book?.href)
  const hrefMatch = href.match(/[?&]bookId=([^&]+)/i)
  if (hrefMatch?.[1]) return normalizeBookId(hrefMatch[1])

  const note = normalizeText(book?.note)
  const noteMatch = note.match(/微信读书\s*ID[:：]\s*([^\s]+)/i) || note.match(/(\d{4,}|CB_[A-Za-z0-9_]+|MP_WXS_[A-Za-z0-9_]+)/)
  if (noteMatch?.[1]) return normalizeBookId(noteMatch[1])

  return ''
}

const uniqueByBookId = (books = []) => {
  const map = new Map()
  for (const book of books) {
    const derivedBookId = normalizeBookId(book?.bookId || parseBookIdFromConfig(book))
    if (!derivedBookId || map.has(derivedBookId)) continue
    const derivedInfoId = normalizeText(book?.infoId || parseInfoIdFromHref(book?.href))
    map.set(derivedBookId, {
      ...book,
      bookId: derivedBookId,
      infoId: derivedInfoId,
      summary: sanitizeSummary(book?.summary || book?.AISummary || book?.intro || ''),
      note: book?.note || (derivedBookId ? `微信读书 ID：${derivedBookId}` : ''),
      href: book?.href || buildHref(derivedBookId, derivedInfoId)
    })
  }
  return Array.from(map.values())
}

const uniqueByBooklistEntry = (books = []) => {
  const map = new Map()
  for (const book of books) {
    const derivedBookId = normalizeBookId(book?.bookId || parseBookIdFromConfig(book))
    const normalizedShelfName = normalizeText(book?.shelfName).toLowerCase()
    if (!derivedBookId || !normalizedShelfName) continue
    const derivedInfoId = normalizeText(book?.infoId || parseInfoIdFromHref(book?.href))
    const key = `${normalizedShelfName}:${derivedBookId}`
    if (map.has(key)) continue
    map.set(key, {
      ...book,
      bookId: derivedBookId,
      infoId: derivedInfoId,
      shelfName: normalizeText(book?.shelfName),
      summary: sanitizeSummary(book?.summary || book?.AISummary || book?.intro || ''),
      note: book?.note || (derivedBookId ? `微信读书 ID：${derivedBookId}` : ''),
      href: book?.href || buildHref(derivedBookId, derivedInfoId)
    })
  }
  return Array.from(map.values())
}


const isArchiveEntry = item => item?.role === 'archive' || (item?.archiveId && Array.isArray(item?.bookIds))

function normalizeArchiveItem(item = {}) {
  return {
    ...item,
    archiveId: Number(item?.archiveId) || item?.archiveId || null,
    name: normalizeText(item?.name),
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

function buildShelfDebug({ shelfSnapshot, favoriteShelfNames = [], recentShelfNames = [], bookListShelfNames = [] }) {
  const archive = Array.isArray(shelfSnapshot?.archive) ? shelfSnapshot.archive : []
  const buildMatched = shelfNames =>
    dedupeTextList(shelfNames).map(shelfName => {
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
    archiveNames: archive.map(item => normalizeText(item?.name)).filter(Boolean),
    favoriteMatchedArchives: buildMatched(favoriteShelfNames),
    recentMatchedArchives: buildMatched(recentShelfNames),
    bookListMatchedArchives: buildMatched(bookListShelfNames),
    mergedBookCount: Array.isArray(shelfSnapshot?.mergedBooks) ? shelfSnapshot.mergedBooks.length : 0,
    lectureBookCount: Array.isArray(shelfSnapshot?.lectureBooks) ? shelfSnapshot.lectureBooks.length : 0
  }
}

const getAboutBooksConfig = () => {
  const profile = getAboutProfile()
  const syncConfig = profile?.wereadSync || {}
  const bookListConfig = profile?.bookList || {}
  const favoriteBooks = Array.isArray(profile?.books) ? profile.books : []
  const recentBooks = Array.isArray(profile?.recentBooks) ? profile.recentBooks : []
  const featuredShelfNames = dedupeTextList(Array.isArray(bookListConfig?.featuredShelfNames) ? bookListConfig.featuredShelfNames : [])
  const sectionOrder = dedupeTextList(Array.isArray(bookListConfig?.sectionOrder) ? bookListConfig.sectionOrder : [])
  const bookListShelfNames = dedupeTextList(sectionOrder.length ? sectionOrder : featuredShelfNames)

  return {
    notionDbId: normalizeText(process.env.WEREAD_ABOUT_BOOKS_DB_ID || syncConfig.notionDbId),
    enabled: syncConfig.enabled !== false,
    refreshOnLoad: Boolean(syncConfig.refreshOnLoad),
    recentLimit: Number.isFinite(Number(syncConfig.recentLimit)) ? Math.max(0, Number(syncConfig.recentLimit)) : 0,
    favoriteLimit: Number.isFinite(Number(syncConfig.favoriteLimit)) ? Math.max(0, Number(syncConfig.favoriteLimit)) : 0,
    favoriteShelfNames: dedupeTextList(Array.isArray(syncConfig.favoriteShelfNames) ? syncConfig.favoriteShelfNames : []),
    recentShelfNames: dedupeTextList(Array.isArray(syncConfig.recentShelfNames) ? syncConfig.recentShelfNames : []),
    featuredShelfNames,
    sectionOrder,
    bookListShelfNames,
    fallbackFavoriteBooks: uniqueByBookId(favoriteBooks),
    fallbackRecentBooks: uniqueByBookId(recentBooks)
  }
}

const buildFallbackSnapshot = () => {
  const config = getAboutBooksConfig()
  return {
    favoriteBooks: config.fallbackFavoriteBooks,
    recentBooks: config.fallbackRecentBooks,
    bookList: { archive: [], books: [] },
    source: 'config',
    persisted: false,
    refreshed: false,
    syncEnabled: config.enabled,
    refreshOnLoad: config.refreshOnLoad,
    notionConfigured: Boolean(config.notionDbId && process.env.NOTION_ACCESS_TOKEN)
  }
}


async function fetchJson(url, init = {}) {
  const response = await fetch(url, init)
  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }
  return { response, payload }
}

function createError(message, status = 500, code = 'UNKNOWN') {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

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
    href: buildHref(payload?.href || bookInfo?.href || reader?.href)
  }
}

async function fetchWereadBookViaWeb(bookId, cookie) {
  const url = new URL(WEREAD_WEB_BOOK_INFO_URL)
  url.searchParams.set('bookId', bookId)
  const { response, payload } = await fetchJson(url.toString(), {
    headers: {
      ...WEB_HEADERS,
      Cookie: cookie
    }
  })

  if (!response.ok) {
    throw createError(`WeRead web book request failed with status ${response.status}`, response.status, 'WEREAD_WEB_BOOK_FAILED')
  }

  if (payload?.errCode) {
    throw createError(payload?.errMsg || 'WeRead web book response error', 502, 'WEREAD_WEB_BOOK_RESPONSE_ERROR')
  }

  return mapBookPayload(payload)
}

async function fetchWereadBookViaI(bookId, cookie) {
  const url = new URL(WEREAD_I_BOOK_INFO_URL)
  url.searchParams.set('bookId', bookId)
  const { response, payload } = await fetchJson(url.toString(), {
    headers: {
      ...I_HEADERS,
      Cookie: cookie
    }
  })

  if (!response.ok) {
    throw createError(`WeRead i book request failed with status ${response.status}`, response.status, 'WEREAD_I_BOOK_FAILED')
  }

  if (payload?.errCode) {
    throw createError(payload?.errMsg || 'WeRead i book response error', 502, 'WEREAD_I_BOOK_RESPONSE_ERROR')
  }

  return mapBookPayload(payload)
}

async function fetchWereadBook(bookId, cookie) {
  try {
    return await fetchWereadBookViaWeb(bookId, cookie)
  } catch (error) {
    logger.warn('WeRead web book endpoint failed, fallback to i.weread', {
      bookId,
      error: error?.message,
      code: error?.code
    })
    return fetchWereadBookViaI(bookId, cookie)
  }
}

async function enrichBooksWithDetails(books = [], cookie, context = 'unknown') {
  const normalizedBooks = uniqueByBookId(books.map(mapShelfBook))
  const needsDetail = normalizedBooks.filter(book => !normalizeText(book?.summary))
  if (!needsDetail.length) {
    return {
      books: normalizedBooks,
      stats: {
        context,
        totalCount: normalizedBooks.length,
        requestedCount: 0,
        enrichedCount: 0,
        skippedCount: 0,
        maxEnrichCount: WEREAD_DETAIL_MAX_ENRICH_COUNT
      }
    }
  }

  const detailMap = new Map()
  const booksToEnrich = WEREAD_DETAIL_MAX_ENRICH_COUNT > 0 ? needsDetail.slice(0, WEREAD_DETAIL_MAX_ENRICH_COUNT) : []

  if (needsDetail.length > booksToEnrich.length) {
    logger.info('Skip part of WeRead detail enrichment because max enrich count is reached', {
      context,
      requestedCount: needsDetail.length,
      enrichedCount: booksToEnrich.length,
      skippedCount: needsDetail.length - booksToEnrich.length,
      maxEnrichCount: WEREAD_DETAIL_MAX_ENRICH_COUNT
    })
  }

  for (let index = 0; index < booksToEnrich.length; index += WEREAD_DETAIL_CONCURRENCY) {
    const batch = booksToEnrich.slice(index, index + WEREAD_DETAIL_CONCURRENCY)

    await Promise.all(
      batch.map(async book => {
        const bookId = normalizeBookId(book?.bookId)
        if (!bookId) return
        try {
          const detail = await fetchWereadBook(bookId, cookie)
          detailMap.set(bookId, detail)
        } catch (error) {
          logger.warn('Failed to enrich WeRead book detail for summary', {
            context,
            bookId,
            error: error?.message,
            code: error?.code
          })
        }
      })
    )

    if (index + WEREAD_DETAIL_CONCURRENCY < booksToEnrich.length && WEREAD_DETAIL_DELAY_MS > 0) {
      await wait(WEREAD_DETAIL_DELAY_MS)
    }
  }

  const enrichedBooks = normalizedBooks.map(book => {
    const bookId = normalizeBookId(book?.bookId)
    const detail = detailMap.get(bookId)
    return detail
      ? {
          ...book,
          ...detail,
          bookId,
          infoId: detail?.infoId || book?.infoId || '',
          title: book?.title || detail?.title || '',
          author: book?.author || detail?.author || '',
          cover: book?.cover || detail?.cover || '',
          summary: sanitizeSummary(book?.summary || detail?.summary || detail?.AISummary || detail?.intro || ''),
          intro: sanitizeSummary(book?.intro || detail?.intro || ''),
          AISummary: sanitizeSummary(book?.AISummary || detail?.AISummary || ''),
          note: book?.note || detail?.note || '',
          href: book?.href || detail?.href || buildHref(book?.href || detail?.href)
        }
      : book
  })

  return {
    books: enrichedBooks,
    stats: {
      context,
      totalCount: normalizedBooks.length,
      requestedCount: needsDetail.length,
      enrichedCount: detailMap.size,
      skippedCount: Math.max(0, needsDetail.length - booksToEnrich.length),
      maxEnrichCount: WEREAD_DETAIL_MAX_ENRICH_COUNT
    }
  }
}



const mapShelfBook = book => {
  const bookId = normalizeBookId(book?.bookId)
  const infoId = normalizeText(book?.infoId || book?.encodeId || parseInfoIdFromHref(book?.href))
  return {
    ...book,
    bookId,
    infoId,
    title: book?.title || '',
    author: book?.author || '',
    cover: book?.cover || '',
    summary: sanitizeSummary(book?.summary || book?.AISummary || book?.intro || ''),
    category: book?.category || book?.categories?.[0]?.title || '',
    publishTime: book?.publishTime || '',
    totalWords: book?.totalWords || 0,
    rating: book?.newRating || book?.rating || 0,
    ratingCount: book?.newRatingCount || book?.ratingCount || 0,
    readUpdateTime: book?.readUpdateTime || 0,
    note: bookId ? `微信读书 ID：${bookId}` : '',
    href: buildHref(book?.href) || normalizeText(book?.href) || normalizeText(BLOG.LINK)
  }
}

const mapLectureBook = book => ({
  ...book,
  bookId: normalizeBookId(book?.bookId),
  readUpdateTime: book?.lectureReadUpdateTime || book?.readUpdateTime || 0,
  isAudio: true
})

function mergeProgressIntoBooks(books = [], progress = []) {
  const progressMap = new Map(
    progress.map(item => [normalizeBookId(item?.bookId), item]).filter(([bookId]) => bookId)
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

const findArchiveByName = (archive = [], shelfName = '') => {
  const normalizedTarget = normalizeName(shelfName)
  if (!normalizedTarget) return null
  return archive.find(item => normalizeName(item?.name) === normalizedTarget) || null
}

function collectBooksFromArchive(archiveItem, books = [], lectureBooks = []) {
  if (!archiveItem) return []
  const shelfName = normalizeText(archiveItem?.name)
  const bookMap = new Map(books.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))
  const lectureMap = new Map(lectureBooks.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))
  const archiveBooks = Array.isArray(archiveItem?.bookIds)
    ? archiveItem.bookIds
        .map(bookId => bookMap.get(normalizeBookId(bookId)))
        .filter(Boolean)
        .map(book => ({ ...book, shelfName: book?.shelfName || shelfName }))
    : []
  const archiveLectureBooks = Array.isArray(archiveItem?.lectureBookIds)
    ? archiveItem.lectureBookIds
        .map(bookId => lectureMap.get(normalizeBookId(bookId)))
        .filter(Boolean)
        .map(book => ({ ...book, shelfName: book?.shelfName || shelfName }))
    : []
  return uniqueByBookId([...archiveBooks, ...archiveLectureBooks].map(mapShelfBook))
}

function collectBooksFromArchiveNames({ archive = [], books = [], lectureBooks = [], shelfNames = [], limit = 0 }) {
  const matchedBooks = shelfNames.flatMap(shelfName => collectBooksFromArchive(findArchiveByName(archive, shelfName), books, lectureBooks))
  const deduped = uniqueByBookId(matchedBooks).sort((a, b) => (b.readUpdateTime || 0) - (a.readUpdateTime || 0))
  return limit > 0 ? deduped.slice(0, limit) : deduped
}

async function fetchWereadShelfSnapshot(cookie) {
  const parseShelfPayload = payload => {
    const data = payload?.data || payload || {}
    const books = Array.isArray(data?.books) ? data.books : []
    const progress = Array.isArray(data?.bookProgress) ? data.bookProgress : []
    const lectureBooks = Array.isArray(data?.lectureBooks) ? data.lectureBooks.map(mapLectureBook) : []
    const archive = extractArchiveItems(data)

    const mergedBooks = mergeProgressIntoBooks(books, progress)
    const archiveBooks = collectArchiveBooks(archive, mergedBooks, lectureBooks)
    return {
      archive,
      books: uniqueByBookId([...mergedBooks, ...lectureBooks, ...archiveBooks].map(mapShelfBook)).sort(
        (a, b) => (b.readUpdateTime || 0) - (a.readUpdateTime || 0)
      ),
      mergedBooks,
      lectureBooks
    }
  }

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
      return parseShelfPayload(payload)
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
    throw createError(
      `WeRead shelf request failed with status ${getResponse.status}/${postResponse.status}`,
      postResponse.status || 502,
      'WEREAD_SHELF_FAILED'
    )
  }

  const payload = await postResponse.json()
  if (payload?.errCode) {
    throw createError(payload?.errMsg || 'WeRead syncBook response error', 502, 'WEREAD_SYNC_BOOK_RESPONSE_ERROR')
  }

  return parseShelfPayload(payload)
}

function buildShelfSelection({ shelfSnapshot, config }) {
  return {
    favoriteBooks: collectBooksFromArchiveNames({
      archive: shelfSnapshot.archive,
      books: shelfSnapshot.mergedBooks,
      lectureBooks: shelfSnapshot.lectureBooks,
      shelfNames: config.favoriteShelfNames,
      limit: config.favoriteLimit
    }),
    recentBooks: collectBooksFromArchiveNames({
      archive: shelfSnapshot.archive,
      books: shelfSnapshot.mergedBooks,
      lectureBooks: shelfSnapshot.lectureBooks,
      shelfNames: config.recentShelfNames,
      limit: config.recentLimit
    })
  }
}

function buildBookListSelection({ shelfSnapshot, config }) {
  const archive = Array.isArray(shelfSnapshot?.archive) ? shelfSnapshot.archive : []
  const mergedBooks = Array.isArray(shelfSnapshot?.mergedBooks) ? shelfSnapshot.mergedBooks : []
  const lectureBooks = Array.isArray(shelfSnapshot?.lectureBooks) ? shelfSnapshot.lectureBooks : []
  const selectedArchive = dedupeTextList(config?.bookListShelfNames || [])
    .map(shelfName => findArchiveByName(archive, shelfName))
    .filter(Boolean)

  return buildBookListSnapshot({
    archive: selectedArchive,
    mergedBooks,
    lectureBooks
  })
}

async function getNotionControlState(databaseId) {
  if (!databaseId || !process.env.NOTION_ACCESS_TOKEN) {
    return {
      cookie: '',
      refreshRequested: false,
      favoriteShelfNames: [],
      recentShelfNames: [],
      controlPageId: '',
      refreshPropertyName: ''
    }
  }

  const schemaPayload = await notionRequest(`https://api.notion.com/v1/databases/${databaseId}`, { method: 'GET' })
  const schema = schemaPayload?.properties || {}
  const pages = await queryNotionDatabase(databaseId)
  const controlPage = pages.find(page => normalizeName(readPlainText(pickProperty(page?.properties || {}, PROPERTY_CANDIDATES.group))) === 'control')
  const properties = controlPage?.properties || {}

  return {
    cookie: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.wereadCookie)),
    refreshRequested: readCheckbox(pickProperty(properties, PROPERTY_CANDIDATES.refreshRequested), false),
    favoriteShelfNames: dedupeTextList(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.favoriteShelfNames)).split(/[\n,，;；|/]+/)),
    recentShelfNames: dedupeTextList(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.recentShelfNames)).split(/[\n,，;；|/]+/)),
    controlPageId: controlPage?.id || '',
    refreshPropertyName: pickPropertyName(schema, PROPERTY_CANDIDATES.refreshRequested),
    schema
  }
}

async function clearNotionRefreshRequested(databaseId, notionControl = {}) {
  const controlPageId = normalizeText(notionControl.controlPageId)
  const refreshPropertyName = normalizeText(notionControl.refreshPropertyName)
  if (!databaseId || !controlPageId || !refreshPropertyName || !process.env.NOTION_ACCESS_TOKEN) return

  await notionRequest(`https://api.notion.com/v1/pages/${controlPageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      properties: {
        [refreshPropertyName]: { checkbox: false }
      }
    })
  })
}

async function resolveAboutBooksState() {

  const config = getAboutBooksConfig()
  const fallback = buildFallbackSnapshot()
  const envCookie = normalizeText(getCookieHeader())

  if (!config.notionDbId || !process.env.NOTION_ACCESS_TOKEN) {
    return {
      config,
      fallback,
      notionControl: {
        cookie: envCookie,
        refreshRequested: false,
        favoriteShelfNames: [],
        recentShelfNames: []
      },
      notionConfigured: false,
      cookieDiagnostics: {
        hasEnvCookie: Boolean(envCookie),
        hasNotionCookie: false,
        resolvedCookieSource: envCookie ? 'env' : 'none'
      },
      selectedFavoriteShelfNames: config.favoriteShelfNames,
      selectedRecentShelfNames: config.recentShelfNames
    }
  }

  try {
    const notionControl = await getNotionControlState(config.notionDbId)
    const notionCookie = normalizeText(notionControl.cookie)
    return {
      config,
      fallback,
      notionControl: {
        ...notionControl,
        cookie: notionCookie
      },
      notionConfigured: true,
      cookieDiagnostics: {
        hasEnvCookie: Boolean(envCookie),
        hasNotionCookie: Boolean(notionCookie),
        resolvedCookieSource: notionCookie ? 'notion' : 'none'
      },
      selectedFavoriteShelfNames: notionControl.favoriteShelfNames.length ? notionControl.favoriteShelfNames : config.favoriteShelfNames,
      selectedRecentShelfNames: notionControl.recentShelfNames.length ? notionControl.recentShelfNames : config.recentShelfNames
    }
  } catch (error) {
    logger.warn('Failed to read Notion about books control state, fallback to config/env', {
      error: error?.message,
      code: error?.code
    })
    return {
      config,
      fallback,
      notionControl: {
        cookie: envCookie,
        refreshRequested: false,
        favoriteShelfNames: [],
        recentShelfNames: []
      },
      notionConfigured: Boolean(config.notionDbId && process.env.NOTION_ACCESS_TOKEN),
      cookieDiagnostics: {
        hasEnvCookie: Boolean(envCookie),
        hasNotionCookie: false,
        resolvedCookieSource: envCookie ? 'env' : 'none'
      },
      selectedFavoriteShelfNames: config.favoriteShelfNames,
      selectedRecentShelfNames: config.recentShelfNames
    }
  }
}


function collectArchiveBooks(archive = [], books = [], lectureBooks = []) {
  return archive.flatMap(item => collectBooksFromArchive(item, books, lectureBooks))
}

function buildBookListSnapshot(shelfSnapshot = {}) {
  const archive = Array.isArray(shelfSnapshot?.archive) ? shelfSnapshot.archive : []
  const mergedBooks = Array.isArray(shelfSnapshot?.mergedBooks) ? shelfSnapshot.mergedBooks : []
  const lectureBooks = Array.isArray(shelfSnapshot?.lectureBooks) ? shelfSnapshot.lectureBooks : []

  const sections = archive
    .map(item => {
      const shelfName = normalizeText(item?.name)
      const sectionBooks = collectBooksFromArchive(item, mergedBooks, lectureBooks)
      if (!shelfName || !sectionBooks.length) return null
      return {
        shelfName,
        archiveId: item?.archiveId || null,
        books: sectionBooks
      }
    })
    .filter(Boolean)

  const bookListBooks = uniqueByBooklistEntry(
    sections.flatMap(section => section.books.map(book => ({ ...book, shelfName: section.shelfName })))
  )

  return {
    archive: sections.map(section => ({
      archiveId: section.archiveId,
      name: section.shelfName,
      bookIds: section.books.map(book => normalizeBookId(book?.bookId)).filter(Boolean)
    })),
    books: bookListBooks
  }
}


async function notionRequest(url, init = {}) {
  const token = normalizeText(process.env.NOTION_ACCESS_TOKEN)
  if (!token) {
    throw createError('NOTION_ACCESS_TOKEN is missing', 503, 'NOTION_TOKEN_MISSING')
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  })

  const payload = await response.json()
  if (!response.ok) {
    throw createError(
      payload?.message || `Notion request failed with status ${response.status}`,
      502,
      'NOTION_REQUEST_FAILED'
    )
  }

  return payload
}


async function queryNotionDatabase(databaseId) {
  const results = []
  let cursor = ''

  while (true) {
    const payload = await notionRequest(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(cursor ? { start_cursor: cursor } : {})
    })

    results.push(...(payload?.results || []))
    if (!payload?.has_more || !payload?.next_cursor) break
    cursor = payload.next_cursor
  }

  return results
}

const readPlainText = property => {
  if (!property) return ''
  if (typeof property.plain_text === 'string') return property.plain_text
  if (typeof property.url === 'string') return property.url
  if (typeof property.number === 'number') return String(property.number)
  if (typeof property.checkbox === 'boolean') return String(property.checkbox)
  if (typeof property.select?.name === 'string') return property.select.name
  if (typeof property.status?.name === 'string') return property.status.name
  if (Array.isArray(property.title)) return property.title.map(item => item?.plain_text || '').join('').trim()
  if (Array.isArray(property.rich_text)) return property.rich_text.map(item => item?.plain_text || '').join('').trim()
  if (Array.isArray(property.files)) {
    return property.files?.[0]?.file?.url || property.files?.[0]?.external?.url || ''
  }
  return ''
}

const readNumber = property => {
  if (!property) return 0
  if (typeof property.number === 'number') return property.number
  const value = Number(readPlainText(property) || 0)
  return Number.isFinite(value) ? value : 0
}

const readCheckbox = (property, defaultValue = true) => {
  if (!property) return defaultValue
  if (typeof property.checkbox === 'boolean') return property.checkbox
  return !['false', '0', ''].includes(readPlainText(property).toLowerCase())
}


const pickPropertyName = (schema = {}, candidates = []) => candidates.find(name => schema?.[name]) || ''
const pickProperty = (properties = {}, candidates = []) => {
  const name = candidates.find(item => properties?.[item]) || ''
  return name ? properties[name] : null
}

const buildTextObjects = value => {
  const content = normalizeText(value)
  if (!content) return []
  return [{ type: 'text', text: { content: content.slice(0, 2000) } }]
}

const buildPropertyValue = (type, value) => {
  if (type === 'title') return { title: buildTextObjects(value) }
  if (type === 'rich_text') return { rich_text: buildTextObjects(value) }
  if (type === 'url') return { url: normalizeText(value) || null }
  if (type === 'number') return { number: Number(value || 0) || 0 }
  if (type === 'checkbox') return { checkbox: Boolean(value) }
  if (type === 'select') return normalizeText(value) ? { select: { name: normalizeText(value) } } : { select: null }
  return null
}

function buildNotionBookProperties({ schema, group, book, sort, source, shelfName = '' }) {
  const titleName = pickPropertyName(schema, PROPERTY_CANDIDATES.title)
  const groupName = pickPropertyName(schema, PROPERTY_CANDIDATES.group)
  const bookIdName = pickPropertyName(schema, PROPERTY_CANDIDATES.bookId)

  if (!titleName || !groupName || !bookIdName) {
    throw createError('Notion about books database is missing required properties: Name/Group/BookId', 500, 'NOTION_DB_SCHEMA_INVALID')
  }

  const mapping = {
    [titleName]: book.title,
    [groupName]: group,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.shelfName)]: shelfName || book?.shelfName || '',
    [bookIdName]: book.bookId,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.infoId)]: book.infoId,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.author)]: book.author,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.cover)]: book.cover,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.summary)]: book.summary || book.AISummary || book.intro || '',
    [pickPropertyName(schema, PROPERTY_CANDIDATES.note)]: book.note,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.href)]: book.href,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.readUpdateTime)]: book.readUpdateTime || 0,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.progress)]: typeof book.progress === 'number' ? book.progress : 0,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.sort)]: sort,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.enabled)]: true,
    [pickPropertyName(schema, PROPERTY_CANDIDATES.source)]: source
  }

  return Object.entries(mapping).reduce((acc, [name, rawValue]) => {
    if (!name) return acc
    const type = schema?.[name]?.type
    const propertyValue = buildPropertyValue(type, rawValue)
    if (propertyValue) acc[name] = propertyValue
    return acc
  }, {})
}

function buildNotionIndex(pages = []) {
  const primary = new Map()
  const duplicates = new Map()

  for (const page of pages) {
    const properties = page?.properties || {}
    const group = normalizeText(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.group))).toLowerCase()
    const bookId = normalizeBookId(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.bookId)))
    const shelfName = normalizeText(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.shelfName))).toLowerCase()
    if (!group || !bookId) continue

    const key = group === 'booklist' ? `${group}:${shelfName}:${bookId}` : `${group}:${bookId}`

    if (!primary.has(key)) {
      primary.set(key, page)
      continue
    }

    const currentDuplicates = duplicates.get(key) || []
    currentDuplicates.push(page)
    duplicates.set(key, currentDuplicates)
  }

  return { primary, duplicates }
}

function parseNotionSnapshotPages(pages = []) {
  const favoriteBooks = []
  const recentBooks = []
  const bookListBooks = []

  for (const page of pages) {
    const properties = page?.properties || {}
    const enabled = readCheckbox(pickProperty(properties, PROPERTY_CANDIDATES.enabled))
    if (!enabled) continue

    const group = normalizeText(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.group))).toLowerCase()
    const book = {
      bookId: normalizeBookId(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.bookId))),
      infoId: normalizeText(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.infoId))),
      title: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.title)),
      author: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.author)),
      cover: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.cover)),
      summary: sanitizeSummary(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.summary))),
      note: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.note)),
      href: readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.href)),
      readUpdateTime: readNumber(pickProperty(properties, PROPERTY_CANDIDATES.readUpdateTime)),
      progress: readNumber(pickProperty(properties, PROPERTY_CANDIDATES.progress)),
      sort: readNumber(pickProperty(properties, PROPERTY_CANDIDATES.sort)),
      shelfName: normalizeText(readPlainText(pickProperty(properties, PROPERTY_CANDIDATES.shelfName)))
    }

    if (!book.bookId || !book.title) continue
    if (group === 'favorite') favoriteBooks.push(book)
    if (group === 'recent') recentBooks.push(book)
    if (group === 'booklist' && book.shelfName) bookListBooks.push(book)
  }

  const sorter = (a, b) => {
    const sortDiff = (a.sort || 0) - (b.sort || 0)
    if (sortDiff !== 0) return sortDiff
    return (b.readUpdateTime || 0) - (a.readUpdateTime || 0)
  }

  const dedupedBookListBooks = uniqueByBooklistEntry(bookListBooks).sort(sorter)
  const archiveMap = new Map()
  for (const book of dedupedBookListBooks) {
    const shelfName = normalizeText(book?.shelfName)
    if (!shelfName) continue
    const current = archiveMap.get(shelfName) || { name: shelfName, bookIds: [] }
    current.bookIds.push(book.bookId)
    archiveMap.set(shelfName, current)
  }

  return {
    favoriteBooks: favoriteBooks.sort(sorter),
    recentBooks: recentBooks.sort(sorter),
    bookList: {
      archive: Array.from(archiveMap.values()),
      books: dedupedBookListBooks
    }
  }
}

async function upsertNotionSnapshot(snapshot, databaseId) {
  const schemaPayload = await notionRequest(`https://api.notion.com/v1/databases/${databaseId}`, { method: 'GET' })
  const schema = schemaPayload?.properties || {}
  const pages = await queryNotionDatabase(databaseId)
  const { primary: pageIndex, duplicates: duplicateIndex } = buildNotionIndex(pages)
  const keepKeys = new Set()

  const groups = [
    ['favorite', uniqueByBookId(snapshot.favoriteBooks || [])],
    ['recent', uniqueByBookId(snapshot.recentBooks || [])],
    ['booklist', uniqueByBooklistEntry(snapshot.bookList?.books || []), true]
  ]

  for (const [group, books, shouldKeepShelfName = false] of groups) {
    for (const [index, book] of books.entries()) {
      const normalizedBookId = normalizeBookId(book?.bookId)
      const normalizedShelfName = normalizeText(book?.shelfName)
      const key = group === 'booklist' ? `${group}:${normalizedShelfName.toLowerCase()}:${normalizedBookId}` : `${group}:${normalizedBookId}`
      if (!normalizedBookId || (group === 'booklist' && !normalizedShelfName)) continue
      keepKeys.add(key)
      const properties = buildNotionBookProperties({
        schema,
        group,
        book,
        sort: index + 1,
        source: 'weread-sync',
        shelfName: shouldKeepShelfName ? normalizedShelfName : ''
      })
      const existingPage = pageIndex.get(key)


      if (existingPage?.id) {
        await notionRequest(`https://api.notion.com/v1/pages/${existingPage.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ properties })
        })
      } else {
        await notionRequest('https://api.notion.com/v1/pages', {
          method: 'POST',
          body: JSON.stringify({
            parent: { database_id: databaseId },
            properties
          })
        })
      }
    }
  }

  const enabledName = pickPropertyName(schema, PROPERTY_CANDIDATES.enabled)
  if (enabledName) {
    for (const [key, page] of pageIndex.entries()) {
      if (keepKeys.has(key)) continue
      await notionRequest(`https://api.notion.com/v1/pages/${page.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          properties: {
            [enabledName]: { checkbox: false }
          }
        })
      })
    }

    for (const pagesOfSameKey of duplicateIndex.values()) {
      for (const duplicatePage of pagesOfSameKey) {
        if (!duplicatePage?.id) continue
        await notionRequest(`https://api.notion.com/v1/pages/${duplicatePage.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            properties: {
              [enabledName]: { checkbox: false }
            }
          })
        })
      }
    }
  }
}

export async function getPersistedAboutBooks() {
  const state = await resolveAboutBooksState()
  const { config, fallback, notionConfigured, selectedFavoriteShelfNames, selectedRecentShelfNames } = state

  if (!config.notionDbId || !process.env.NOTION_ACCESS_TOKEN) {
    return {
      ...fallback,
      favoriteShelfNames: selectedFavoriteShelfNames,
      recentShelfNames: selectedRecentShelfNames
    }
  }

  try {
    const pages = await queryNotionDatabase(config.notionDbId)
    const parsed = parseNotionSnapshotPages(pages)
    return {
      favoriteBooks: parsed.favoriteBooks.length ? parsed.favoriteBooks : fallback.favoriteBooks,
      recentBooks: parsed.recentBooks.length ? parsed.recentBooks : fallback.recentBooks,
      bookList: parsed.bookList,
      favoriteShelfNames: selectedFavoriteShelfNames,
      recentShelfNames: selectedRecentShelfNames,
      bookListShelfNames: config.bookListShelfNames,
      source: 'notion',
      persisted: true,
      refreshed: false,
      syncEnabled: config.enabled,
      refreshOnLoad: config.refreshOnLoad,
      notionConfigured
    }
  } catch (error) {
    logger.warn('Failed to read persisted about books from Notion, fallback to config', {
      error: error?.message,
      code: error?.code
    })
    return {
      ...fallback,
      favoriteShelfNames: selectedFavoriteShelfNames,
      recentShelfNames: selectedRecentShelfNames,
      bookListShelfNames: config.bookListShelfNames
    }
  }
}

export async function syncWereadAboutBooks(options = {}) {
  const bypassCooldown = Boolean(options?.bypassCooldown)
  if (WEREAD_ABOUT_SYNC_COOLDOWN_MS > 0 && !bypassCooldown) {
    const cooldownEntry = await getCacheEntry(wereadAboutCacheStore, WEREAD_ABOUT_SYNC_COOLDOWN_KEY, WEREAD_ABOUT_SYNC_COOLDOWN_MS)
    if (cooldownEntry?.data?.expiresAt && cooldownEntry.data.expiresAt > Date.now()) {
      logger.info('Skip WeRead about books sync because cooldown is active', {
        remainingMs: cooldownEntry.data.expiresAt - Date.now()
      })
      return getPersistedAboutBooks()
    }
  }

  const state = await resolveAboutBooksState()
  const {
    config,
    fallback,
    notionControl,
    notionConfigured,
    selectedFavoriteShelfNames,
    selectedRecentShelfNames
  } = state
  const persistedSnapshot = await getPersistedAboutBooks()
  const cookie = normalizeText(options.cookie || notionControl.cookie || (notionConfigured ? '' : getCookieHeader()))

  let favoriteBooks = persistedSnapshot?.favoriteBooks?.length ? persistedSnapshot.favoriteBooks : fallback.favoriteBooks
  let recentBooks = persistedSnapshot?.recentBooks?.length ? persistedSnapshot.recentBooks : fallback.recentBooks
  let bookList = persistedSnapshot?.bookList || { archive: [], books: [] }
  let snapshotSource = persistedSnapshot?.persisted ? 'notion' : 'config'
  let syncDebug = null

  try {
    if (!cookie) {
      throw createError('WEREAD_COOKIE is missing', 500, 'WEREAD_COOKIE_MISSING')
    }

    const shelfSnapshot = await fetchWereadShelfSnapshot(cookie)
    let selected = buildShelfSelection({
      shelfSnapshot,
      config: {
        ...config,
        favoriteShelfNames: selectedFavoriteShelfNames,
        recentShelfNames: selectedRecentShelfNames
      }
    })
    const favoriteEnrichment = await enrichBooksWithDetails(selected.favoriteBooks, cookie, 'about-favorite')
    const recentEnrichment = await enrichBooksWithDetails(selected.recentBooks, cookie, 'about-recent')
    selected = {
      favoriteBooks: favoriteEnrichment.books,
      recentBooks: recentEnrichment.books
    }
    let selectedBookList = buildBookListSelection({
      shelfSnapshot,
      config: {
        ...config,
        bookListShelfNames: config.bookListShelfNames
      }
    })
    const bookListEnrichment = await enrichBooksWithDetails(selectedBookList.books, cookie, 'booklist-selected')
    const bookListDetailMap = new Map(bookListEnrichment.books.map(book => [normalizeBookId(book?.bookId), book]).filter(([bookId]) => bookId))
    selectedBookList = {
      ...selectedBookList,
      books: uniqueByBooklistEntry(
        selectedBookList.books.map(book => {
          const bookId = normalizeBookId(book?.bookId)
          const detailBook = bookListDetailMap.get(bookId)
          return detailBook
            ? {
                ...book,
                ...detailBook,
                bookId,
                shelfName: normalizeText(book?.shelfName),
                infoId: detailBook?.infoId || book?.infoId || '',
                title: book?.title || detailBook?.title || '',
                author: book?.author || detailBook?.author || '',
                cover: book?.cover || detailBook?.cover || '',
                summary: sanitizeSummary(book?.summary || detailBook?.summary || detailBook?.AISummary || detailBook?.intro || ''),
                intro: sanitizeSummary(book?.intro || detailBook?.intro || ''),
                AISummary: sanitizeSummary(book?.AISummary || detailBook?.AISummary || ''),
                note: book?.note || detailBook?.note || '',
                href: book?.href || detailBook?.href || buildHref(book?.href || detailBook?.href)
              }
            : book
        })
      )
    }

    bookList = selectedBookList
    syncDebug = {
      ...buildShelfDebug({
        shelfSnapshot,
        favoriteShelfNames: selectedFavoriteShelfNames,
        recentShelfNames: selectedRecentShelfNames,
        bookListShelfNames: config.bookListShelfNames
      }),
      detailEnrichment: {
        favorite: favoriteEnrichment.stats,
        recent: recentEnrichment.stats,
        bookList: bookListEnrichment.stats
      }
    }

    if (selected.favoriteBooks.length) favoriteBooks = selected.favoriteBooks
    if (selected.recentBooks.length) recentBooks = selected.recentBooks
    if (selected.favoriteBooks.length || selected.recentBooks.length || bookList.books.length) {
      snapshotSource = 'weread'
    }
  } catch (error) {
    logger.warn('Failed to sync WeRead about shelf groups, keep persisted snapshot', {
      error: error?.message,
      code: error?.code
    })
    syncDebug = {
      error: error?.message || 'Failed to sync WeRead about shelf groups',
      code: error?.code || 'WEREAD_ABOUT_BOOKS_SYNC_FAILED'
    }
  }

  const snapshot = {
    favoriteBooks,
    recentBooks,
    bookList,
    favoriteShelfNames: selectedFavoriteShelfNames,
    recentShelfNames: selectedRecentShelfNames,
    bookListShelfNames: config.bookListShelfNames,
    source: snapshotSource,
    persisted: false,
    refreshed: snapshotSource === 'weread',
    syncEnabled: config.enabled,
    refreshOnLoad: config.refreshOnLoad,
    notionConfigured,
    ...(process.env.NODE_ENV !== 'production' ? { syncDebug } : {})
  }

  if (snapshotSource === 'weread' && WEREAD_ABOUT_SYNC_COOLDOWN_MS > 0) {
    await setCacheEntry(
      wereadAboutCacheStore,
      WEREAD_ABOUT_SYNC_COOLDOWN_KEY,
      { expiresAt: Date.now() + WEREAD_ABOUT_SYNC_COOLDOWN_MS },
      { ttl: WEREAD_ABOUT_SYNC_COOLDOWN_MS }
    )
  }

  if (config.notionDbId && process.env.NOTION_ACCESS_TOKEN && (favoriteBooks.length || recentBooks.length || bookList.books.length)) {
    try {
      await upsertNotionSnapshot(snapshot, config.notionDbId)
      snapshot.persisted = true
      snapshot.source = snapshot.source === 'weread' ? 'weread+notion' : 'notion'
    } catch (error) {
      logger.warn('Failed to persist about books snapshot to Notion, keep current snapshot', {
        error: error?.message,
        code: error?.code
      })
      if (!syncDebug) {
        syncDebug = {
          error: error?.message || 'Failed to persist about books snapshot to Notion',
          code: error?.code || 'WEREAD_ABOUT_BOOKS_PERSIST_FAILED'
        }
      }
      snapshot.persisted = Boolean(persistedSnapshot?.persisted)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    snapshot.syncDebug = syncDebug
  }

  if (notionControl.refreshRequested) {
    try {
      await clearNotionRefreshRequested(config.notionDbId, notionControl)
    } catch (error) {
      logger.warn('Failed to clear Notion about books refresh flag', {
        error: error?.message,
        code: error?.code
      })
    }
  }

  return snapshot
}



export async function getAboutBooksRuntimeConfig() {
  const state = await resolveAboutBooksState()
  const { config, notionConfigured, notionControl, selectedFavoriteShelfNames, selectedRecentShelfNames, cookieDiagnostics } = state
  const syncCooldownEntry = await getCacheEntry(wereadAboutCacheStore, WEREAD_ABOUT_SYNC_COOLDOWN_KEY, WEREAD_ABOUT_SYNC_COOLDOWN_MS)
  const syncCooldownUntil = syncCooldownEntry?.data?.expiresAt || 0
  const syncCooldownRemainingMs = syncCooldownUntil > Date.now() ? syncCooldownUntil - Date.now() : 0
  return {
    enabled: config.enabled,
    refreshOnLoad: config.refreshOnLoad,
    notionConfigured,
    favoriteLimit: config.favoriteLimit,
    recentLimit: config.recentLimit,
    refreshRequested: Boolean(notionControl.refreshRequested),
    favoriteShelfNames: selectedFavoriteShelfNames,
    recentShelfNames: selectedRecentShelfNames,
    cacheProviderConfigured: String(process.env.WEREAD_CACHE_PROVIDER || BLOG.MUSIC_PLAYER_METING_CACHE_PROVIDER || 'memory'),
    syncCooldownMs: WEREAD_ABOUT_SYNC_COOLDOWN_MS,
    syncCooldownRemainingMs,
    cookieDiagnostics
  }
}


