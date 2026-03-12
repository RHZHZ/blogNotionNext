import { createClientCacheResource } from '@/lib/utils/client-cache-resource'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import AboutSectionHeading from './AboutSectionHeading'

const normalizeSummary = book => book?.summary || book?.AISummary || book?.intro || ''
const normalizeText = value => String(value || '').trim()
const buildWereadHref = book => {
  const href = normalizeText(book?.href)
  if (/weread\.qq\.com\/book-detail\?/i.test(href)) return href
  return normalizeText(process.env.NEXT_PUBLIC_LINK) || '/booklist'
}
const isTruthy = value => ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase())
const formatCooldown = value => {
  const seconds = Math.max(0, Math.ceil(Number(value || 0) / 1000))
  if (!seconds) return ''
  if (seconds < 60) return `${seconds} 秒`
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = seconds % 60
  return remainSeconds ? `${minutes} 分 ${remainSeconds} 秒` : `${minutes} 分钟`
}
const formatCacheAge = value => {
  const seconds = Math.max(0, Math.floor(Number(value || 0) / 1000))
  if (seconds < 60) return `${seconds} 秒前`
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = seconds % 60
  return remainSeconds ? `${minutes} 分 ${remainSeconds} 秒前` : `${minutes} 分钟前`
}
const formatCacheTtl = value => {
  const seconds = Math.max(0, Math.ceil(Number(value || 0) / 1000))
  if (!seconds) return '即将过期'
  if (seconds < 60) return `${seconds} 秒`
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = seconds % 60
  return remainSeconds ? `${minutes} 分 ${remainSeconds} 秒` : `${minutes} 分钟`
}
const sourceLabelMap = {

  notion: '当前展示：Notion 持久化快照',
  'weread+notion': '当前展示：微信读书已刷新，并同步写入 Notion',
  weread: '当前展示：微信读书实时结果',
  config: '当前展示：本地配置回退'
}


const normalizeSnapshotPayload = payload => ({
  favoriteBooks: Array.isArray(payload?.favoriteBooks) ? payload.favoriteBooks.map(normalizeBook) : [],
  recentBooks: Array.isArray(payload?.recentBooks) ? payload.recentBooks.map(normalizeBook) : [],
  favoriteShelfNames: Array.isArray(payload?.favoriteShelfNames) ? payload.favoriteShelfNames : [],
  recentShelfNames: Array.isArray(payload?.recentShelfNames) ? payload.recentShelfNames : [],
  source: payload?.source || 'unknown',
  persisted: Boolean(payload?.persisted),
  refreshed: Boolean(payload?.refreshed),
  canManualRefresh: Boolean(payload?.canManualRefresh),
  isAdminAuthorized: Boolean(payload?.isAdminAuthorized),
  syncCooldownRemainingMs: Number(payload?.syncCooldownRemainingMs) || 0,
  fromCache: Boolean(payload?.fromCache),
  cacheTimestamp: Number(payload?.cacheTimestamp) || 0,
  cacheExpiresAt: Number(payload?.cacheExpiresAt) || 0,
  syncDebug: payload?.syncDebug || null
})

const aboutBooksCacheResource = createClientCacheResource({
  cacheKey: 'heo-about-books-cache',
  cacheTTL: 5 * 60 * 1000,
  memoryTTL: 8 * 1000,
  normalize: normalizeSnapshotPayload,
  onReadStorage: ({ parsed, timestamp, expiresAt }) => ({
    ...parsed?.payload,
    fromCache: true,
    cacheTimestamp: timestamp,
    cacheExpiresAt: expiresAt
  }),
  onWriteStorage: ({ value, timestamp, expiresAt }) => normalizeSnapshotPayload({
    ...value,
    cacheTimestamp: timestamp,
    cacheExpiresAt: expiresAt
  })
})

const requestAboutBooks = async ({ refresh = false, shouldForceRefreshOnLoad = false, signal } = {}) => {
  const query = refresh || shouldForceRefreshOnLoad ? '?refresh=1' : ''
  const response = await fetch(`/api/about/books${query}`, { signal })

  if (!response.ok) {
    let errorPayload = null
    try {
      errorPayload = await response.json()
    } catch {}

    const error = new Error(errorPayload?.error || '刷新失败，请稍后再试。')
    error.status = response.status
    error.payload = errorPayload
    throw error
  }

  const payload = await response.json()
  return normalizeSnapshotPayload(payload)
}

const fetchAboutBooks = async ({ refresh = false, shouldForceRefreshOnLoad = false, signal } = {}) => {
  if (refresh || shouldForceRefreshOnLoad || typeof window === 'undefined') {
    return aboutBooksCacheResource.fetch({
      request: () => requestAboutBooks({ refresh, shouldForceRefreshOnLoad, signal }),
      bypassMemory: true
    })
  }

  return aboutBooksCacheResource.fetch({
    request: () => requestAboutBooks({ signal })
  })
}

const normalizeBook = book => ({
  ...book,
  summary: normalizeSummary(book),
  note: book?.note || (book?.bookId ? `微信读书 ID：${book.bookId}` : ''),
  href: buildWereadHref(book)
})

const renderBookCard = (book, options = {}) => {
  const showProgress = Boolean(options?.showProgress)
  const progressValue = typeof book?.progress === 'number' && book.progress >= 0 ? Math.min(100, Math.round(book.progress)) : null
  const summary = normalizeSummary(book)
  const showSummary = Boolean(summary)
  const content = (
    <>
      <div className='heo-about-bookshelf__cover-wrap'>
        <LazyImage
          src={book.cover}
          alt={book.title}
          width={120}
          height={160}
          className='heo-about-bookshelf__cover'
        />
      </div>
      <div className='heo-about-bookshelf__meta'>
        <div className='heo-about-bookshelf__title'>{book.title}</div>
        <div className='heo-about-bookshelf__author'>{book.author}</div>
        {showSummary ? <div className='heo-about-bookshelf__summary'>{summary}</div> : null}
        <div className='heo-about-bookshelf__footer'>
          {showProgress && progressValue !== null ? <div className='heo-about-bookshelf__progress'>阅读进度 {progressValue}%</div> : null}
        </div>
      </div>
    </>
  )

  return book.href ? (
    <SmartLink
      key={`${book.bookId || book.title}-${book.author}`}
      href={book.href}
      className='heo-about-bookshelf__item heo-card--interactive'>
      {content}
    </SmartLink>
  ) : (
    <div key={`${book.bookId || book.title}-${book.author}`} className='heo-about-bookshelf__item'>
      {content}
    </div>
  )
}

const renderEmptyState = message => <div className='heo-about-bookshelf__empty'>{message}</div>

const AboutBooks = ({ bookShelf, recentBookShelf, books, recentBooks, wereadSync }) => {
  const fallbackFavoriteBooks = useMemo(() => (books || []).map(normalizeBook), [books])
  const fallbackRecentBooks = useMemo(() => (recentBooks || []).map(normalizeBook), [recentBooks])
  const [snapshot, setSnapshot] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [canManualRefresh, setCanManualRefresh] = useState(false)
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false)
  const [syncCooldownRemainingMs, setSyncCooldownRemainingMs] = useState(0)

  const [showAdminAuth, setShowAdminAuth] = useState(false)

  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const applySnapshot = useCallback(nextSnapshot => {
    if (!nextSnapshot) return
    setCanManualRefresh(Boolean(nextSnapshot.canManualRefresh))
    setIsAdminAuthorized(Boolean(nextSnapshot.isAdminAuthorized))
    setSyncCooldownRemainingMs(Number(nextSnapshot.syncCooldownRemainingMs) || 0)
    setSnapshot(nextSnapshot)
  }, [])

  const loadBooks = useCallback(
    async ({ refresh = false, signal } = {}) => {
      const shouldForceRefreshOnLoad = !refresh && Boolean(wereadSync?.refreshOnLoad)
      const shouldUseCache = !refresh && !shouldForceRefreshOnLoad

      try {
        if (refresh) {
          setIsRefreshing(true)
          setRefreshError('')
        }

        if (shouldUseCache) {
          const cached = aboutBooksCacheResource.readStorage()
          if (cached) {
            applySnapshot(cached)
          }
        }

        const nextSnapshot = await fetchAboutBooks({
          refresh,
          shouldForceRefreshOnLoad,
          signal
        })

        applySnapshot(nextSnapshot)
        if (!refresh && !shouldForceRefreshOnLoad) {
          aboutBooksCacheResource.writeStorage(nextSnapshot)
        }
      } catch (error) {
        if (error?.name === 'AbortError') return

        const cooldownRemainingMs = Number(error?.payload?.syncCooldownRemainingMs) || 0
        if (cooldownRemainingMs > 0) {
          setSyncCooldownRemainingMs(cooldownRemainingMs)
        }

        if (refresh) {
          const errorMessage = cooldownRemainingMs > 0
            ? `刷新冷却中，请 ${formatCooldown(cooldownRemainingMs)} 后再试。`
            : '刷新失败，已自动回退到最近可用快照。'
          setRefreshError(errorMessage)

          try {
            const fallbackSnapshot = await fetchAboutBooks({ signal })
            applySnapshot(fallbackSnapshot)
            aboutBooksCacheResource.writeStorage(fallbackSnapshot)
          } catch {}
        }
      } finally {
        if (refresh) setIsRefreshing(false)
      }
    },
    [applySnapshot, wereadSync?.refreshOnLoad]
  )

  useEffect(() => {
    const controller = new AbortController()
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setShowAdminAuth(isTruthy(params.get('aboutAdmin')))
    }
    loadBooks({ signal: controller.signal })
    return () => controller.abort()
  }, [loadBooks])

  const favoriteDisplayBooks = snapshot?.favoriteBooks?.length ? snapshot.favoriteBooks : fallbackFavoriteBooks
  const recentDisplayBooks = snapshot?.recentBooks?.length ? snapshot.recentBooks : fallbackRecentBooks
  const favoritePreviewBooks = favoriteDisplayBooks.slice(0, bookShelf?.previewLimit || 4)
  const recentPreviewBooks = recentDisplayBooks.slice(0, recentBookShelf?.previewLimit || 3)
  const sourceLabel = sourceLabelMap[snapshot?.source] || '当前读取：默认数据源'
  const favoriteShelfNames = snapshot?.favoriteShelfNames || []
  const recentShelfNames = snapshot?.recentShelfNames || []
  const totalBooks = favoriteDisplayBooks.length + recentDisplayBooks.length
  const totalPreviewBooks = favoritePreviewBooks.length + recentPreviewBooks.length
  const cooldownLabel = formatCooldown(syncCooldownRemainingMs)
  const cacheAgeLabel = snapshot?.fromCache && snapshot?.cacheTimestamp ? formatCacheAge(Date.now() - snapshot.cacheTimestamp) : ''
  const cacheTtlLabel = snapshot?.fromCache && snapshot?.cacheExpiresAt ? formatCacheTtl(snapshot.cacheExpiresAt - Date.now()) : ''
  const cacheDebugLabel = snapshot?.fromCache && (cacheAgeLabel || cacheTtlLabel)
    ? `缓存写入 ${cacheAgeLabel}${cacheTtlLabel ? ` · 剩余 ${cacheTtlLabel}` : ''}`
    : ''
  const enrichmentDebugLabel = snapshot?.syncDebug?.detailEnrichment
    ? [
        ['最爱', snapshot.syncDebug.detailEnrichment.favorite],
        ['在读', snapshot.syncDebug.detailEnrichment.recent],
        ['书单', snapshot.syncDebug.detailEnrichment.bookList]
      ]
        .map(([label, stats]) => {
          const requested = Number(stats?.requestedCount) || 0
          const enriched = Number(stats?.enrichedCount) || 0
          const skipped = Number(stats?.skippedCount) || 0
          if (!requested && !enriched && !skipped) return ''
          return `${label} ${enriched}/${requested}${skipped > 0 ? `，跳过 ${skipped}` : ''}`
        })
        .filter(Boolean)
        .join(' ｜ ')
    : ''
  const statusTags = [

    { label: sourceLabel, tone: 'neutral' },
    ...(snapshot?.fromCache ? [{ label: '本地缓存秒开', tone: 'warm' }] : []),
    ...(snapshot?.persisted ? [{ label: '已持久化', tone: 'success' }] : []),
    ...(snapshot?.refreshed ? [{ label: '本次已刷新', tone: 'brand' }] : []),
    ...favoriteShelfNames.map(name => ({ label: `最爱 · ${name}`, tone: 'brand' })),
    ...recentShelfNames.map(name => ({ label: `在读 · ${name}`, tone: 'warm' }))
  ]

  const handleRefresh = async () => {
    if (!canManualRefresh || isRefreshing) return
    await loadBooks({ refresh: true })
  }

  const handleAuthorize = async () => {
    const key = window.prompt('请输入 About 书单管理密钥')
    if (!key) return

    try {
      setIsAuthorizing(true)
      setRefreshError('')
      const response = await fetch('/api/about/books-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      })

      if (!response.ok) {
        setRefreshError('管理员授权失败，请检查密钥。')
        return
      }

      await loadBooks()
    } catch {
      setRefreshError('管理员授权失败，请稍后再试。')
    } finally {
      setIsAuthorizing(false)
    }
  }

  const overviewAction = isAdminAuthorized ? (

    <div className='heo-about-bookshelf__toolbar'>
      <button
        type='button'
        className='heo-about-bookshelf__action'
        onClick={handleRefresh}
        disabled={isRefreshing || syncCooldownRemainingMs > 0}>
        {isRefreshing ? '刷新中...' : syncCooldownRemainingMs > 0 ? `冷却中 · ${cooldownLabel}` : '手动刷新'}
      </button>
      <div className='heo-about-bookshelf__status'>
        <span>{syncCooldownRemainingMs > 0 ? `为降低接口风险，当前需等待 ${cooldownLabel} 后才能再次主动刷新。` : '仅本人可用，用于立即同步最新书单快照。'}</span>
        {cacheDebugLabel ? <span>{cacheDebugLabel}</span> : null}
        {enrichmentDebugLabel ? <span>{`补齐统计：${enrichmentDebugLabel}`}</span> : null}
        {refreshError ? <span className='heo-about-bookshelf__status-error'>{refreshError}</span> : null}
      </div>

    </div>
  ) : showAdminAuth ? (
    <div className='heo-about-bookshelf__toolbar'>
      <button
        type='button'
        className='heo-about-bookshelf__action'
        onClick={handleAuthorize}
        disabled={isAuthorizing}>
        {isAuthorizing ? '授权中...' : '管理员授权'}
      </button>
      <div className='heo-about-bookshelf__status'>
        <span>仅带 `?aboutAdmin=1` 的本人可见。</span>
        {cacheDebugLabel ? <span>{cacheDebugLabel}</span> : null}
        {enrichmentDebugLabel ? <span>{`补齐统计：${enrichmentDebugLabel}`}</span> : null}
        {refreshError ? <span className='heo-about-bookshelf__status-error'>{refreshError}</span> : null}
      </div>
    </div>
  ) : (
    <div className='heo-about-bookshelf__toolbar heo-about-bookshelf__toolbar--static'>
      <div className='heo-about-bookshelf__status heo-about-bookshelf__status--left'>
        <span>书单会随微信读书与持久化快照自动更新。</span>
      </div>
    </div>
  )

  return (
    <section className='heo-about-section heo-about-section--books-overview heo-card'>
      <div className='heo-card__body'>
        <div className='heo-about-bookshelf-overview'>
          <div className='heo-about-bookshelf-overview__top'>
            <div className='heo-about-bookshelf-overview__main'>
              <div className='heo-about-section-heading__eyebrow'>阅读空间</div>
              <h2 className='heo-about-bookshelf-overview__title'>阅读与书架</h2>
              <p className='heo-about-bookshelf-overview__desc'>首屏这里只放一小段阅读摘要：最常翻的和最近在读的分开展示，完整内容放到书单页继续看。</p>
            </div>
            <div className='heo-about-bookshelf-overview__action'>{overviewAction}</div>
          </div>

          <div className='heo-about-bookshelf-overview__meta'>
            {statusTags.slice(0, 4).map(tag => (
              <span key={tag.label} className={`heo-about-bookshelf-overview__tag heo-about-bookshelf-overview__tag--${tag.tone}`}>
                {tag.label}
              </span>
            ))}
          </div>

          <div className='heo-about-bookshelf-overview__stats'>
            <div className='heo-about-bookshelf-overview__stat'>
              <span className='heo-about-bookshelf-overview__stat-value'>{favoriteDisplayBooks.length}</span>
              <span className='heo-about-bookshelf-overview__stat-label'>最爱书籍</span>
            </div>
            <div className='heo-about-bookshelf-overview__stat'>
              <span className='heo-about-bookshelf-overview__stat-value'>{recentDisplayBooks.length}</span>
              <span className='heo-about-bookshelf-overview__stat-label'>最近在读</span>
            </div>
            <div className='heo-about-bookshelf-overview__stat'>
              <span className='heo-about-bookshelf-overview__stat-value'>{totalPreviewBooks}</span>
              <span className='heo-about-bookshelf-overview__stat-label'>首屏摘要</span>
            </div>
          </div>
        </div>

        <div className='heo-about-bookshelf-panel-grid'>
          <section className='heo-about-bookshelf-panel'>
            <AboutSectionHeading
              eyebrow='Favorite Books'
              title={bookShelf.title}
              description={bookShelf.description}
              extra={
                <div className='heo-about-bookshelf__heading-actions'>
                  <span className='heo-about-bookshelf__panel-count'>摘要 {favoritePreviewBooks.length} / 全部 {favoriteDisplayBooks.length}</span>
                  {bookShelf.link ? (
                    <SmartLink href={bookShelf.link} className='heo-about-bookshelf__more'>
                      {bookShelf.linkText}
                    </SmartLink>
                  ) : null}
                </div>
              }
            />
            <div className='heo-about-bookshelf'>
              {favoritePreviewBooks.length
                ? favoritePreviewBooks.map(book => renderBookCard(book))
                : renderEmptyState('这里还没有同步到最爱书籍，等你在微信读书书单里补充后就会显示。')}
            </div>
          </section>

          <section className='heo-about-bookshelf-panel'>
            <AboutSectionHeading
              eyebrow='Currently Reading'
              title={recentBookShelf.title}
              description={recentBookShelf.description}
              extra={
                <div className='heo-about-bookshelf__heading-actions'>
                  <span className='heo-about-bookshelf__panel-count'>摘要 {recentPreviewBooks.length} / 全部 {recentDisplayBooks.length}</span>
                  {recentBookShelf.link ? (
                    <SmartLink href={recentBookShelf.link} className='heo-about-bookshelf__more'>
                      {recentBookShelf.linkText}
                    </SmartLink>
                  ) : null}
                </div>
              }
            />
            <div className='heo-about-bookshelf'>
              {recentPreviewBooks.length
                ? recentPreviewBooks.map(book => renderBookCard(book, { showProgress: true }))
                : renderEmptyState('最近在读还没有同步结果，触发一次刷新或等待微信读书书单更新后会显示。')}
            </div>
          </section>
        </div>

        {totalBooks > totalPreviewBooks ? (
          <div className='heo-about-bookshelf__footnote'>当前首屏只展示摘要，完整书单可通过上方入口继续查看。</div>
        ) : null}
      </div>
    </section>
  )
}

export default AboutBooks



