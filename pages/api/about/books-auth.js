import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { createRequestId } from '@/lib/server/logger'

const ADMIN_COOKIE_NAME = 'about_books_admin'
const ONE_MONTH_SECONDS = 60 * 60 * 24 * 30

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${value}`]
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  if (options.secure) parts.push('Secure')
  return parts.join('; ')
}

export default async function handler(req, res) {
  const requestId = createRequestId()

  if (req.method !== 'POST') {
    return sendApiError(res, 405, { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED', requestId })
  }

  const adminKey = String(process.env.ABOUT_BOOKS_ADMIN_KEY || '').trim()
  if (!adminKey) {
    return sendApiError(res, 503, {
      error: 'ABOUT_BOOKS_ADMIN_KEY is missing',
      code: 'ABOUT_BOOKS_ADMIN_KEY_MISSING',
      requestId
    })
  }

  const providedKey = String(req.body?.key || '').trim()
  if (!providedKey || providedKey !== adminKey) {
    return sendApiError(res, 401, {
      error: 'Invalid admin key',
      code: 'ABOUT_BOOKS_ADMIN_KEY_INVALID',
      requestId
    })
  }

  res.setHeader(
    'Set-Cookie',
    serializeCookie(ADMIN_COOKIE_NAME, adminKey, {
      maxAge: ONE_MONTH_SECONDS,
      path: '/',
      httpOnly: false,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production'
    })
  )

  return sendApiSuccess(res, 200, {
    requestId,
    ok: true,
    canManualRefresh: true
  })
}
