import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { getAboutBooksRuntimeConfig, getPersistedAboutBooks, syncWereadAboutBooks } from '@/lib/server/wereadAboutBooks'
import { createLogger, createRequestId } from '@/lib/server/logger'

const logger = createLogger('about-books')
const ADMIN_COOKIE_NAME = 'about_books_admin'

const isTruthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase())
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

const isAdminRequest = req => {
  const adminKey = String(process.env.ABOUT_BOOKS_ADMIN_KEY || '').trim()
  if (!adminKey) return false
  const cookieMap = parseCookieMap(req.headers?.cookie)
  return cookieMap[ADMIN_COOKIE_NAME] === adminKey
}

export default async function handler(req, res) {
  const requestId = createRequestId()

  if (req.method !== 'GET') {
    return sendApiError(res, 405, { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED', requestId })
  }

  try {
    const runtime = await getAboutBooksRuntimeConfig()
    const wantsRefresh = isTruthy(req.query?.refresh)
    const isAdmin = isAdminRequest(req)
    const shouldRefresh = runtime.enabled && (wantsRefresh ? isAdmin : runtime.refreshRequested)

    if (wantsRefresh && !isAdmin) {
      return sendApiError(res, 403, {
        error: 'Forbidden',
        code: 'ABOUT_BOOKS_ADMIN_REQUIRED',
        requestId
      })
    }

    if (wantsRefresh && runtime.syncCooldownRemainingMs > 0) {
      return sendApiError(res, 429, {
        error: 'Refresh cooldown is active',
        code: 'ABOUT_BOOKS_REFRESH_COOLDOWN',
        requestId,
        syncCooldownMs: runtime.syncCooldownMs,
        syncCooldownRemainingMs: runtime.syncCooldownRemainingMs
      })
    }

    const data = shouldRefresh ? await syncWereadAboutBooks() : await getPersistedAboutBooks()
    const responseRuntime = shouldRefresh ? await getAboutBooksRuntimeConfig() : runtime

    res.setHeader('Cache-Control', 'no-store')

    return sendApiSuccess(res, 200, {
      requestId,
      ...responseRuntime,
      isAdminAuthorized: isAdmin,
      canManualRefresh: isAdmin && responseRuntime.enabled && responseRuntime.syncCooldownRemainingMs <= 0,
      ...data
    })

  } catch (error) {
    logger.error('Failed to fetch about books snapshot', {
      requestId,
      error: error?.message,
      code: error?.code
    })

    return sendApiError(res, error?.status || 502, {
      error: error?.message || 'Failed to fetch about books snapshot',
      code: error?.code || 'ABOUT_BOOKS_FETCH_FAILED',
      requestId
    })
  }
}
