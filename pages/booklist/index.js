import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  fetchBookListPayload,
  hasBookListData,
  normalizeBookListPayload,
  normalizeBookListRuntimeStatus,
  readBookListCache,
  writeBookListCache
} from '@/lib/utils/booklist-client'
import { getBookListPageConfig, buildBookListSections } from '@/themes/heo/components/booklist/booklist.data'
import BookListPage from '@/themes/heo/components/booklist/BookListPage'
import { getPersistedAboutBooks } from '@/lib/server/wereadAboutBooks'
import { useEffect, useMemo, useState } from 'react'

const BookListIndex = props => {
  const pageConfig = getBookListPageConfig(props.siteInfo)
  const initialBookList = normalizeBookListPayload(props.initialBookList)
  const initialRuntimeStatus = normalizeBookListRuntimeStatus(props.initialBookListStatus)
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
        setRuntimeStatus(cached?.status || normalizeBookListRuntimeStatus({ fromCache: true }))
        setLoading(false)
        setError('')
      }

      try {
        if (!hasInitialData && !hasCachedData) {
          setLoading(true)
        }
        setError('')
        const nextResult = await fetchBookListPayload(cached)
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
