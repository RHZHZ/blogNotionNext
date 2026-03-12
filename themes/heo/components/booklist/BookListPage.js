import { memo, useEffect, useState } from 'react'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import AboutSectionHeading from '../about/AboutSectionHeading'

const normalizeSummary = book => book?.summary || book?.AISummary || book?.intro || ''
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
const buildRuntimeTags = runtimeStatus => {
  if (!runtimeStatus) return []

  const cacheAgeLabel = runtimeStatus?.fromCache && runtimeStatus?.cacheTimestamp
    ? formatCacheAge(Date.now() - runtimeStatus.cacheTimestamp)
    : ''
  const cacheTtlLabel = runtimeStatus?.fromCache && runtimeStatus?.cacheExpiresAt
    ? formatCacheTtl(runtimeStatus.cacheExpiresAt - Date.now())
    : ''
  const cacheDebugLabel = runtimeStatus?.fromCache && (cacheAgeLabel || cacheTtlLabel)
    ? `缓存写入 ${cacheAgeLabel}${cacheTtlLabel ? ` · 剩余 ${cacheTtlLabel}` : ''}`
    : ''

  return [
    runtimeStatus?.sourceLabel ? { label: `当前来源：${runtimeStatus.sourceLabel}`, tone: 'neutral' } : null,
    runtimeStatus?.persisted ? { label: '已持久化', tone: 'success' } : null,
    runtimeStatus?.refreshed ? { label: '本次已刷新', tone: 'brand' } : null,
    runtimeStatus?.fromCache ? { label: '本地缓存秒开', tone: 'warm' } : null,
    cacheDebugLabel ? { label: cacheDebugLabel, tone: 'neutral' } : null
  ].filter(Boolean)
}

const BookListCard = memo(function BookListCard({ book }) {
  const summary = normalizeSummary(book)
  const progressValue = typeof book?.progress === 'number' ? Math.max(0, Math.round(book.progress)) : null

  const content = (
    <>
      <div className='heo-booklist-card__cover-wrap'>
        <LazyImage
          src={book.cover}
          alt={book.title}
          width={120}
          height={160}
          className='heo-booklist-card__cover'
        />
        {progressValue !== null ? <span className='heo-booklist-card__progress-badge'>进度 {progressValue}%</span> : null}
      </div>
      <div className='heo-booklist-card__mobile-title'>{book.title}</div>
      <div className='heo-booklist-card__meta'>
        <div className='heo-booklist-card__title'>{book.title}</div>
        <div className='heo-booklist-card__author'>{book.author || '作者暂未标注'}</div>
        {summary ? <div className='heo-booklist-card__summary'>{summary}</div> : null}
        <div className='heo-booklist-card__footer'>
          <span className='heo-booklist-card__cta'>查看详情</span>
        </div>
      </div>
    </>
  )

  return book.href ? (
    <SmartLink href={book.href} className='heo-booklist-card heo-card--interactive'>
      {content}
    </SmartLink>
  ) : (
    <div className='heo-booklist-card'>{content}</div>
  )
})

const BookListSection = memo(function BookListSection({ section }) {
  return (
    <section id={section.anchorId} className='heo-booklist-section heo-card'>
      <div className='heo-card__body'>
        <div className='heo-booklist-section__head'>
          <AboutSectionHeading
            eyebrow='Shelf'
            title={section.title}
            description={section.description}
          />
          <div className='heo-booklist-section__meta'>
            <div className='heo-booklist-section__count'>{section.count} 本</div>
            <a href={`#${section.anchorId}`} className='heo-booklist-section__anchor'>定位本组</a>
          </div>
        </div>
        <div className='heo-booklist-section__grid'>
          {section.books.map(book => (
            <BookListCard key={`${book.bookId || book.title}-${section.shelfName}`} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
})

const BookListPage = ({ pageConfig, sections = [], featuredSections = [], otherSections = [], totalBooks = 0, runtimeStatus = null }) => {
  const primarySections = featuredSections.length ? featuredSections : sections.slice(0, 2)
  const navSummary = `${sections.length} 个分组 · ${totalBooks} 本书`
  const runtimeTags = buildRuntimeTags(runtimeStatus)
  const [activeAnchorId, setActiveAnchorId] = useState('')

  useEffect(() => {
    if (!sections.length) {
      setActiveAnchorId('')
      return
    }

    const syncHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
      setActiveAnchorId(hash || sections[0]?.anchorId || '')
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)

    return () => window.removeEventListener('hashchange', syncHash)
  }, [sections])

  return (
    <div className='heo-booklist'>
      <section className='heo-booklist-hero heo-card'>
        <div className='heo-card__body'>
          <div className='heo-booklist-hero__grid'>
              <div className='heo-booklist-hero__intro'>
                <div className='heo-booklist-hero__badge'>{pageConfig.hero.badge}</div>
                <h1 className='heo-booklist-hero__title'>{pageConfig.hero.title}</h1>
                <div className='heo-booklist-hero__subtitle'>{pageConfig.hero.subtitle}</div>
                <p className='heo-booklist-hero__description'>{pageConfig.hero.description}</p>
                <div className='heo-booklist-hero__intro-note'>按微信读书分组整理，先看精选，再顺着 section 慢慢逛。</div>
                {runtimeTags.length ? (
                  <div className='heo-booklist-hero__runtime-tags'>
                    {runtimeTags.map(tag => (
                      <span key={tag.label} className={`heo-booklist-hero__runtime-tag heo-booklist-hero__runtime-tag--${tag.tone}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>


            <div className='heo-booklist-hero__aside'>
              <div className='heo-booklist-hero__stats'>
                <div className='heo-booklist-hero__stat'>
                  <span className='heo-booklist-hero__stat-value'>{sections.length}</span>
                  <span className='heo-booklist-hero__stat-label'>已展示分组</span>
                </div>
                <div className='heo-booklist-hero__stat'>
                  <span className='heo-booklist-hero__stat-value'>{totalBooks}</span>
                  <span className='heo-booklist-hero__stat-label'>当前书籍</span>
                </div>
                <div className='heo-booklist-hero__stat'>
                  <span className='heo-booklist-hero__stat-value'>{featuredSections.length}</span>
                  <span className='heo-booklist-hero__stat-label'>精选分组</span>
                </div>
              </div>

              {primarySections.length ? (
                <>
                  <div className='heo-booklist-scroll-hint'>左右滑动查看更多重点分组</div>
                  <div className='heo-booklist-hero__highlights'>
                    {primarySections.map(section => (
                      <a key={section.shelfName} href={`#${section.anchorId}`} className='heo-booklist-hero__highlight heo-card--interactive'>
                        <div className='heo-booklist-hero__highlight-name'>{section.shelfName}</div>
                        <div className='heo-booklist-hero__highlight-meta'>{section.count} 本</div>
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {sections.length ? (
        <>
          <section className='heo-booklist-nav heo-card'>
            <div className='heo-card__body'>
              <div className='heo-booklist-nav__header'>
                <AboutSectionHeading
                  eyebrow='Browse'
                  title='分组浏览'
                  description='分组名称直接来自微信读书书架，点一下就能跳到对应内容。'
                />
                <div className='heo-booklist-nav__summary'>
                  <span className='heo-booklist-nav__summary-value'>{sections.length}</span>
                  <span className='heo-booklist-nav__summary-text'>{navSummary}</span>
                </div>
              </div>
              {sections.length > 4 ? <div className='heo-booklist-scroll-hint'>左右滑动查看更多分组</div> : null}
              <div className='heo-booklist-nav__chips'>
                {sections.map(section => {
                  const isActive = activeAnchorId === section.anchorId

                  return (
                    <a
                      key={section.shelfName}
                      href={`#${section.anchorId}`}
                      className={`heo-booklist-nav__chip${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span>{section.shelfName}</span>
                      <span className='heo-booklist-nav__chip-count'>{section.count}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>

          {featuredSections.length ? (
            <section className='heo-booklist-featured'>
              <AboutSectionHeading
                eyebrow='Featured Shelves'
                title='精选分组'
                description='先看我希望你优先浏览的几组书单，再继续往下翻全部内容。'
              />
              <div className='heo-booklist-featured__lead'>这里只留少量重点入口，先帮你收个焦；每张卡都可以直接跳到对应分组。</div>
              {featuredSections.length > 1 ? <div className='heo-booklist-scroll-hint'>左右滑动查看精选分组</div> : null}
              <div className='heo-booklist-featured__grid'>
                {featuredSections.map((section, index) => (
                  <a key={section.shelfName} href={`#${section.anchorId}`} className='heo-booklist-featured__item heo-card--interactive'>
                    <div className='heo-booklist-featured__eyebrow'>精选 0{index + 1}</div>
                    <div className='heo-booklist-featured__name'>{section.shelfName}</div>
                    <div className='heo-booklist-featured__desc'>{section.description || '从这一组开始，快速进入对应主题的阅读 section。'}</div>
                    <div className='heo-booklist-featured__footer'>
                      <div className='heo-booklist-featured__meta'>{section.count} 本</div>
                      <div className='heo-booklist-featured__cta'>进入分组</div>
                    </div>
                  </a>
                ))}
              </div>

            </section>
          ) : null}

          <div className='heo-booklist-section-stack'>
            {(featuredSections.length ? [...featuredSections, ...otherSections] : sections).map(section => (
              <BookListSection key={section.shelfName} section={section} />
            ))}
          </div>
        </>
      ) : (
        <section className='heo-booklist-empty heo-card'>
          <div className='heo-card__body'>
            <AboutSectionHeading
              eyebrow='暂时为空'
              title={pageConfig.emptyTitle}
              description={pageConfig.emptyDescription}
            />
          </div>
        </section>
      )}
    </div>
  )
}

export default BookListPage
