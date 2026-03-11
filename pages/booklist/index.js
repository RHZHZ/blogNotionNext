import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { getBookListPageConfig, buildBookListSections } from '@/themes/heo/components/booklist/booklist.data'
import BookListPage from '@/themes/heo/components/booklist/BookListPage'
import { getPersistedAboutBooks } from '@/lib/server/wereadAboutBooks'
import { useEffect, useMemo, useState } from 'react'

const BOOKLIST_CACHE_KEY = 'heo-booklist-cache'
const BOOKLIST_CACHE_TTL = 5 * 60 * 1000
const BOOKLIST_SOURCE_LABELS = {
  notion: 'Notion 持久化快照',
  'weread+notion': '微信读书刷新并已写入 Notion',
  weread: '微信读书实时结果',
  config: '本地配置回退',
  unknown: '默认数据源'
}

const normalizeBookListPayload = payload => ({
  archive: Array.isArray(payload?.archive) ? payload.archive : [],
  books: Array.isArray(payload?.books) ? payload.books : []
})

const normalizeRuntimeStatus = status => ({
  source: String(status?.source || 'unknown'),
  sourceLabel: BOOKLIST_SOURCE_LABELS[String(status?.source || 'unknown')] || BOOKLIST_SOURCE_LABELS.unknown,
  persisted: Boolean(status?.persisted),
  refreshed: Boolean(status?.refreshed),
  fromCache: Boolean(status?.fromCache)
})

const hasBookListData = payload => Boolean((payload?.archive || []).length || (payload?.books || []).length)

const readBookListCache = () => {
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
      status: normalizeRuntimeStatus({ ...parsed.status, fromCache: true })
    }
  } catch {
    return null
  }
}

const writeBookListCache = (payload, status) => {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(
      BOOKLIST_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        payload: normalizeBookListPayload(payload),
        status: normalizeRuntimeStatus(status)
      })
    )
  } catch {}
}

const fetchBookListPayload = async () => {
  const response = await fetch('/api/booklist')
  if (!response.ok) throw new Error('书单数据读取失败')
  const result = await response.json()
  return {
    payload: normalizeBookListPayload({
      archive: Array.isArray(result?.bookList?.archive) ? result.bookList.archive : Array.isArray(result?.archive) ? result.archive : [],
      books: Array.isArray(result?.bookList?.books) ? result.bookList.books : Array.isArray(result?.books) ? result.books : []
    }),
    status: normalizeRuntimeStatus({
      source: result?.source,
      persisted: result?.persisted,
      refreshed: result?.refreshed,
      fromCache: false
    })
  }
}

const BookListIndex = props => {
  const pageConfig = getBookListPageConfig(props.siteInfo)
  const initialBookList = normalizeBookListPayload(props.initialBookList)
  const initialRuntimeStatus = normalizeRuntimeStatus(props.initialBookListStatus)
  const hasInitialData = hasBookListData(initialBookList)
  const [payload, setPayload] = useState(initialBookList)
  const [runtimeStatus, setRuntimeStatus] = useState(initialRuntimeStatus)
  const [loading, setLoading] = useState(!hasInitialData)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      const cached = readBookListCache()
      const cachedPayload = cached?.payload || null
      const hasCachedData = hasBookListData(cachedPayload)

      if (hasCachedData) {
        setPayload(cachedPayload)
        setRuntimeStatus(cached?.status || normalizeRuntimeStatus({ fromCache: true }))
        setLoading(false)
        setError('')
      }

      try {
        if (!hasInitialData && !hasCachedData) {
          setLoading(true)
        }
        setError('')
        const nextResult = await fetchBookListPayload()
        if (!active) return
        setPayload(nextResult.payload)
        setRuntimeStatus(nextResult.status)
        writeBookListCache(nextResult.payload, nextResult.status)
      } catch (err) {
        if (!active) return
        if (!hasInitialData && !hasCachedData) {
          setError(err?.message || '书单数据读取失败')
        }
      } finally {
        if (active && !hasInitialData && !hasCachedData) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [hasInitialData])

  const normalizedPayload = useMemo(() => {
    const nextPayload = {
      archive: Array.isArray(payload.archive) ? payload.archive : [],
      books: Array.isArray(payload.books)
        ? payload.books.map(book => ({ ...book }))
        : []
    }

    nextPayload.archive = nextPayload.archive.map(item => ({
      ...item,
      name: item?.name || item?.shelfName || '',
      bookIds: Array.isArray(item?.bookIds) ? item.bookIds : []
    }))

    return nextPayload
  }, [payload])

  const sectionData = useMemo(() => buildBookListSections({ shelfPayload: normalizedPayload, pageConfig }), [normalizedPayload, pageConfig])

  return (
    <div className='px-5 md:px-0'>
      {loading ? (
        <section className='heo-booklist-empty heo-card'>
          <div className='heo-card__body'>
            <div className='heo-booklist-empty__text'>正在读取书单数据...</div>
          </div>
        </section>
      ) : error ? (
        <section className='heo-booklist-empty heo-card'>
          <div className='heo-card__body'>
            <div className='heo-booklist-empty__text'>{error}</div>
          </div>
        </section>
      ) : (
        <BookListPage pageConfig={pageConfig} runtimeStatus={runtimeStatus} {...sectionData} />
      )}
    </div>
  )
}

export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'booklist-index', locale })
  const snapshot = await getPersistedAboutBooks().catch(() => null)
  return {
    props: {
      ...props,
      initialBookList: snapshot?.bookList || { archive: [], books: [] },
      initialBookListStatus: {
        source: snapshot?.source || 'unknown',
        persisted: Boolean(snapshot?.persisted),
        refreshed: Boolean(snapshot?.refreshed),
        fromCache: false
      }
    },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND, props.NOTION_CONFIG)
  }
}

export default BookListIndex
