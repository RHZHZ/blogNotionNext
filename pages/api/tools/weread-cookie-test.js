import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { createRequestId } from '@/lib/server/logger'

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

const normalizeText = value => String(value || '').trim()
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

export default async function handler(req, res) {
  const requestId = createRequestId()

  if (req.method !== 'POST') {
    return sendApiError(res, 405, { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED', requestId })
  }

  const cookie = normalizeText(req.body?.cookie)
  const xWrpa0 = normalizeText(req.body?.xWrpa0)

  if (!cookie) {
    return sendApiError(res, 400, { error: 'Missing cookie', code: 'WEREAD_COOKIE_MISSING', requestId })
  }

  const cookieMap = parseCookieMap(cookie)
  const baseHeaders = {
    ...DEFAULT_HEADERS,
    Origin: 'https://weread.qq.com',
    'Content-Type': 'application/json;charset=UTF-8',
    Cookie: cookie,
    ...(xWrpa0 ? { 'x-wrpa-0': xWrpa0 } : {})
  }

  try {
    const getAttempt = await fetchJson(WEREAD_WEB_SHELF_SYNC_URL, {
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        Accept: 'application/json, text/plain, */*',
        Referer: process.env.WEREAD_REFERER || 'https://weread.qq.com/',
        Cookie: cookie,
        ...(xWrpa0 ? { 'x-wrpa-0': xWrpa0 } : {})
      }
    })

    let finalPayload = getAttempt.payload
    let finalStatus = getAttempt.response.status
    let upstreamMode = 'web-sync-get'

    if (!getAttempt.response.ok || getAttempt.payload?.errCode) {
      const postAttempt = await fetchJson(WEREAD_WEB_SHELF_SYNC_BOOK_URL, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify(DEFAULT_SHELF_SYNC_PAYLOAD)
      })
      finalPayload = postAttempt.payload
      finalStatus = postAttempt.response.status
      upstreamMode = 'web-syncBook-post'
    }

    const data = finalPayload?.data || finalPayload || {}
    const archive = Array.isArray(data?.archive) ? data.archive : []
    const books = Array.isArray(data?.books) ? data.books : []
    const lectureBooks = Array.isArray(data?.lectureBooks) ? data.lectureBooks : []

    if (finalStatus >= 400 || finalPayload?.errCode) {
      return sendApiError(res, 502, {
        error: finalPayload?.errMsg || `WeRead upstream failed with status ${finalStatus}`,
        code: 'WEREAD_UPSTREAM_TEST_FAILED',
        requestId,
        diagnostics: {
          upstreamMode,
          upstreamStatus: finalStatus,
          hasWrSkey: Boolean(cookieMap.wr_skey),
          hasWrVid: Boolean(cookieMap.wr_vid),
          hasXWrpa0: Boolean(xWrpa0),
          errCode: finalPayload?.errCode || '',
          errMsg: finalPayload?.errMsg || ''
        }
      })
    }

    return sendApiSuccess(res, 200, {
      requestId,
      ok: true,
      diagnostics: {
        upstreamMode,
        upstreamStatus: finalStatus,
        hasWrSkey: Boolean(cookieMap.wr_skey),
        hasWrVid: Boolean(cookieMap.wr_vid),
        hasXWrpa0: Boolean(xWrpa0),
        wrVid: normalizeText(cookieMap.wr_vid),
        archiveCount: archive.length,
        bookCount: books.length,
        lectureBookCount: lectureBooks.length
      }
    })
  } catch (error) {
    return sendApiError(res, 502, {
      error: error?.message || 'WeRead test request failed',
      code: 'WEREAD_TEST_REQUEST_FAILED',
      requestId
    })
  }
}
