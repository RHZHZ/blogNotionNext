import { ArrowSmallRight, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const DESKTOP_READING_LIMIT = 3
const MOBILE_READING_LIMIT = 2

const Hero = props => {
  const HEO_HERO_ENABLE = siteConfig('HEO_HERO_ENABLE', true, CONFIG)

  if (!HEO_HERO_ENABLE) {
    return null
  }

  return (
    <div
      id='hero-wrapper'
      className='recent-top-post-group w-full overflow-hidden select-none px-3 md:px-5 mb-4'>
      <MobileHero {...props} />
      <DesktopHero {...props} />
    </div>
  )
}

function getHeroReadingPreviewConfig() {
  const profile = siteConfig('HEO_ABOUT_PROFILE', {}, CONFIG) || {}
  const bookList = profile?.bookList || {}
  const recentBookShelf = profile?.recentBookShelf || {}
  const recentBooks = Array.isArray(profile?.recentBooks) ? profile.recentBooks.filter(Boolean) : []
  const favoriteBooks = Array.isArray(profile?.books) ? profile.books.filter(Boolean) : []
  const fallbackBooks = (recentBooks.length ? recentBooks : favoriteBooks).slice(0, DESKTOP_READING_LIMIT)

  return {
    title: recentBookShelf?.title || '我最近在读的书',
    description: recentBookShelf?.description || '最近在这些书里来回切换，完整书单继续展开看。',
    link: recentBookShelf?.link || bookList?.pagePath || '/booklist',
    linkText: recentBookShelf?.linkText || '我的书单',
    shelfName: Array.isArray(profile?.wereadSync?.recentShelfNames)
      ? profile.wereadSync.recentShelfNames[0] || '最近在读'
      : '最近在读',
    fallbackBooks
  }
}

function normalizeHeroReadingBook(book, index) {
  if (!book) return null
  return {
    id: book?.bookId || book?.id || book?.infoId || `${book?.title || 'book'}-${index}`,
    title: book?.title || '未命名书籍',
    author: book?.author || '',
    cover: book?.cover || '',
    href: book?.href || '',
    shelfName: book?.shelfName || ''
  }
}

function useHeroReadingBooks(limit) {
  const previewConfig = useMemo(() => getHeroReadingPreviewConfig(), [])
  const [books, setBooks] = useState(previewConfig.fallbackBooks.map(normalizeHeroReadingBook).filter(Boolean).slice(0, limit))

  useEffect(() => {
    let active = true

    async function loadBooks() {
      try {
        const response = await fetch('/api/booklist')
        if (!response.ok) throw new Error('booklist fetch failed')
        const result = await response.json()
        if (!active) return

        const payloadBooks = Array.isArray(result?.bookList?.books) ? result.bookList.books : []
        const filtered = payloadBooks
          .filter(book => {
            if (!previewConfig.shelfName) return true
            return String(book?.shelfName || '').trim() === previewConfig.shelfName
          })
          .slice(0, limit)
          .map(normalizeHeroReadingBook)
          .filter(Boolean)

        if (filtered.length) {
          setBooks(filtered)
          return
        }
      } catch (error) {}

      if (!active) return
      setBooks(previewConfig.fallbackBooks.map(normalizeHeroReadingBook).filter(Boolean).slice(0, limit))
    }

    loadBooks()
    return () => {
      active = false
    }
  }, [limit, previewConfig])

  return {
    books,
    config: previewConfig
  }
}

function getHeroPosts({ latestPosts, allNavPages }) {
  const sourcePosts = Array.isArray(allNavPages) && allNavPages.length ? allNavPages : latestPosts || []

  if (
    !siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) ||
    siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) === ''
  ) {
    return (latestPosts || sourcePosts).slice(0, 4)
  }

  const sortPosts = JSON.parse(siteConfig('HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME', false, CONFIG))
    ? [...sourcePosts].sort((a, b) => new Date(b?.lastEditedDate) - new Date(a?.lastEditedDate))
    : [...sourcePosts]

  const topPosts = []
  for (const post of sortPosts) {
    if (topPosts.length === 4) break
    if (post?.tags?.indexOf(siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG)) >= 0) {
      topPosts.push(post)
    }
  }

  return topPosts.length ? topPosts : (latestPosts || sourcePosts).slice(0, 4)
}

function DesktopHero(props) {
  const heroPosts = getHeroPosts(props)
  if (!heroPosts.length) return null

  return (
    <section className='heo-hero-shell hidden xl:grid max-w-[86rem] mx-auto'>
      <DesktopHeroSlider posts={heroPosts} siteInfo={props.siteInfo} />
      <DesktopHeroBooks />
    </section>
  )
}

function DesktopHeroSlider({ posts, siteInfo }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePost = posts[activeIndex] || posts[0]
  const activeCover = activePost?.pageCoverThumbnail || siteInfo?.pageCover

  const handlePrev = event => {
    event.preventDefault()
    event.stopPropagation()
    setActiveIndex(prev => (prev - 1 + posts.length) % posts.length)
  }

  const handleNext = event => {
    event.preventDefault()
    event.stopPropagation()
    setActiveIndex(prev => (prev + 1) % posts.length)
  }

  return (
    <div className='heo-hero-slider heo-card overflow-hidden'>
      {posts.length > 1 ? (
        <div className='heo-hero-slider__nav'>
          <button type='button' onClick={handlePrev} className='heo-hero-slider__nav-btn' aria-label='上一张'>
            <ChevronLeft className='w-5 h-5 stroke-2' />
          </button>
          <button type='button' onClick={handleNext} className='heo-hero-slider__nav-btn' aria-label='下一张'>
            <ChevronRight className='w-5 h-5 stroke-2' />
          </button>
        </div>
      ) : null}

      <SmartLink href={`${siteConfig('SUB_PATH', '')}/${activePost?.slug}`} className='heo-hero-slider__stage group'>
        <LazyImage
          priority
          src={activeCover}
          alt={activePost?.title}
          className='heo-hero-slider__cover absolute inset-0 h-full w-full object-cover'
        />
        <div className='heo-hero-slider__overlay absolute inset-0' />
        <div className='heo-hero-slider__content relative z-10 flex h-full flex-col justify-between'>
          <div className='heo-hero-slider__top'>
            <div className='heo-hero-slider__badge'>精选文章</div>
          </div>
          <div className='heo-hero-slider__copy'>
            <div className='heo-hero-slider__eyebrow'>
              {siteConfig('HEO_HERO_TITLE_4', 'THINKING', CONFIG)}
            </div>
            <h2 className='heo-hero-slider__title line-clamp-2'>
              {activePost?.title || siteConfig('HEO_HERO_TITLE_5', null, CONFIG)}
            </h2>
            <p className='heo-hero-slider__summary line-clamp-2'>
              {activePost?.summary || siteConfig('HEO_HERO_TITLE_3', null, CONFIG)}
            </p>
          </div>
        </div>
      </SmartLink>


      {posts.length > 1 ? (
        <div className='heo-hero-slider__thumbs'>
          {posts.map((post, index) => (
            <button
              key={post?.id || post?.slug || index}
              type='button'
              onClick={() => setActiveIndex(index)}
              className={`heo-hero-slider__thumb ${index === activeIndex ? 'is-active' : ''}`}>
              <span className='heo-hero-slider__thumb-index'>0{index + 1}</span>
              <span className='heo-hero-slider__thumb-title line-clamp-1'>{post?.title}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function DesktopHeroBooks() {
  const { books, config } = useHeroReadingBooks(DESKTOP_READING_LIMIT)

  if (!books.length) return null

  return (
    <aside className='heo-hero-books heo-card'>
      <div className='heo-hero-books__head'>
        <div>
          <div className='heo-hero-books__eyebrow'>Reading</div>
          <h3 className='heo-hero-books__title'>{config.title}</h3>
        </div>
        <SmartLink href={config.link} className='heo-hero-books__link'>
          <span>{config.linkText}</span>
          <ArrowSmallRight className='w-4 h-4 stroke-2' />
        </SmartLink>
      </div>

      <p className='heo-hero-books__desc'>{config.description}</p>

      <div className='heo-hero-books__list'>
        {books.map((book, index) => (
          <SmartLink key={book.id || index} href={config.link} className='heo-hero-books__item'>
            <div className='heo-hero-books__cover-wrap'>
              {book.cover ? (
                <LazyImage src={book.cover} alt={book.title} className='heo-hero-books__cover' />
              ) : (
                <div className='heo-hero-books__cover heo-hero-books__cover--placeholder'>
                  {String(book.title || '').slice(0, 1) || '读'}
                </div>
              )}
            </div>
            <div className='heo-hero-books__meta'>
              <div className='heo-hero-books__book-title line-clamp-2'>{book.title}</div>
              <div className='heo-hero-books__book-author line-clamp-1'>{book.author || '微信读书'}</div>
            </div>
          </SmartLink>
        ))}
      </div>
    </aside>
  )
}

function MobileHero(props) {
  const heroPosts = getHeroPosts(props).slice(0, 3)
  const { books, config } = useHeroReadingBooks(MOBILE_READING_LIMIT)

  if (!heroPosts.length) return null

  return (
    <div className='heo-mobile-hero xl:hidden max-w-[86rem] mx-auto'>
      <div className='heo-mobile-hero__slider flex gap-3 overflow-x-auto pb-2'>
        {heroPosts.map((post, index) => {
          const cover = post?.pageCoverThumbnail || props.siteInfo?.pageCover
          return (
            <SmartLink
              key={post?.id || post?.slug || index}
              href={`${siteConfig('SUB_PATH', '')}/${post?.slug}`}
              className='heo-mobile-hero__slide group relative flex-shrink-0 overflow-hidden'>
              <LazyImage
                priority={index === 0}
                src={cover}
                alt={post?.title}
                className='heo-mobile-hero__slide-cover absolute inset-0 h-full w-full object-cover'
              />
              <div className='heo-mobile-hero__slide-overlay absolute inset-0' />
              <div className='heo-mobile-hero__slide-content relative z-10 flex h-full flex-col justify-between p-5 text-white'>
                <div className='heo-mobile-hero__slide-badge'>精选推荐</div>
                <div>
                  <div className='heo-mobile-hero__slide-title line-clamp-2 text-2xl font-bold'>
                    {post?.title}
                  </div>
                  <div className='heo-mobile-hero__slide-meta mt-3 flex items-center justify-between text-sm gap-3'>
                    <span className='line-clamp-2 opacity-90'>
                      {post?.summary || siteConfig('HEO_HERO_TITLE_3', null, CONFIG)}
                    </span>
                    <ArrowSmallRight className='w-5 h-5 flex-shrink-0 stroke-2' />
                  </div>
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>

      {books.length ? (
        <section className='heo-mobile-reading-entry heo-card'>
          <div className='heo-mobile-reading-entry__head'>
            <div className='heo-mobile-reading-entry__head-main'>
              <div className='heo-mobile-reading-entry__eyebrow'>Reading</div>
              <div className='heo-mobile-reading-entry__title line-clamp-2'>{config.title}</div>
            </div>
            <SmartLink href={config.link} className='heo-mobile-reading-entry__link'>
              <span>{config.linkText}</span>
              <ArrowSmallRight className='w-4 h-4 stroke-2' />
            </SmartLink>
          </div>
          <div className='heo-mobile-reading-entry__covers'>
            {books[0] ? (
              <SmartLink
                href={config.link}
                className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--primary'>
                {books[0].cover ? (
                  <LazyImage src={books[0].cover} alt={books[0].title} className='heo-mobile-reading-entry__cover' />
                ) : (
                  <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--placeholder'>
                    {String(books[0].title || '').slice(0, 1) || '读'}
                  </div>
                )}
              </SmartLink>
            ) : null}
            {books[1] ? (
              <SmartLink
                href={config.link}
                className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--peek'>
                {books[1].cover ? (
                  <LazyImage src={books[1].cover} alt={books[1].title} className='heo-mobile-reading-entry__cover' />
                ) : (
                  <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--placeholder'>
                    {String(books[1].title || '').slice(0, 1) || '读'}
                  </div>
                )}
              </SmartLink>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default Hero
