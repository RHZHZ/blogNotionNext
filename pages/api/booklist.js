import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { getPersistedAboutBooks, syncWereadAboutBooks } from '@/lib/server/wereadAboutBooks'
import { createLogger, createRequestId } from '@/lib/server/logger'

const logger = createLogger('booklist-api')
const isTruthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase())

const buildDebugPayload = (snapshot, bookList) => {
  const archive = Array.isArray(bookList?.archive) ? bookList.archive : []
  const books = Array.isArray(bookList?.books) ? bookList.books : []
  const shelfNames = archive.map(item => String(item?.name || '').trim()).filter(Boolean)
  const booksWithEmptyShelfName = books.filter(book => !String(book?.shelfName || '').trim())

  return {
    source: snapshot?.source || 'unknown',
    persisted: Boolean(snapshot?.persisted),
    refreshed: Boolean(snapshot?.refreshed),
    archiveCount: archive.length,
    bookCount: books.length,
    shelfNames,
    favoriteShelfNames: Array.isArray(snapshot?.favoriteShelfNames) ? snapshot.favoriteShelfNames : [],
    recentShelfNames: Array.isArray(snapshot?.recentShelfNames) ? snapshot.recentShelfNames : [],
    booksWithEmptyShelfNameCount: booksWithEmptyShelfName.length,
    emptyShelfNameBookIds: booksWithEmptyShelfName.slice(0, 20).map(book => book?.bookId).filter(Boolean),
    syncDebug: snapshot?.syncDebug || null
  }
}


export default async function handler(req, res) {
  const requestId = createRequestId()

  if (req.method !== 'GET') {
    return sendApiError(res, 405, { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED', requestId })
  }

  try {
    const shouldRefresh = isTruthy(req.query?.refresh)
    const debug = isTruthy(req.query?.debug)
    const snapshot = shouldRefresh ? await syncWereadAboutBooks() : await getPersistedAboutBooks()
    const bookList = snapshot?.bookList || { archive: [], books: [] }

    res.setHeader('Cache-Control', shouldRefresh ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=1800')

    return sendApiSuccess(res, 200, {
      requestId,
      source: snapshot?.source || 'unknown',
      persisted: Boolean(snapshot?.persisted),
      refreshed: Boolean(snapshot?.refreshed),
      bookList,
      ...(debug ? { debug: buildDebugPayload(snapshot, bookList) } : {})
    })
  } catch (error) {
    logger.error('Failed to fetch booklist snapshot', {
      requestId,
      error: error?.message,
      code: error?.code
    })

    return sendApiError(res, error?.status || 502, {
      error: error?.message || 'Failed to fetch booklist snapshot',
      code: error?.code || 'BOOKLIST_FETCH_FAILED',
      requestId
    })
  }
}


