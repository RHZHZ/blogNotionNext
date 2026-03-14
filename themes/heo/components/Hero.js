import { ArrowSmallRight, ChevronLeft, ChevronRight } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import {
  fetchBookListPayload,
  getBookListPayloadBooks,
  readBookListCache,
  writeBookListCache
} from '@/lib/utils/booklist-client'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const DESKTOP_READING_LIMIT = 3

const resolveHeroSeason = seasonMode => {
  if (seasonMode === 'off') return 'none'
  if (['spring', 'summer', 'autumn', 'winter'].includes(seasonMode)) return seasonMode

  const month = new Date().getMonth() + 1
  if ([3, 4, 5].includes(month)) return 'spring'
  if ([6, 7, 8].includes(month)) return 'summer'
  if ([9, 10, 11].includes(month)) return 'autumn'
  return 'winter'
}

const HERO_SEASON_COPY = {
  spring: {
    sliderBadge: '春日讯号',
    sliderEyebrow: 'SPRING NOTES',
    readingEyebrow: 'Spring Reading',
    readingTitleFallback: '春日书页',
    readingDescriptionFallback: '适合把读到的句子慢慢摊开，也适合把新的灵感轻轻记下。'
  },
  summer: {
    sliderBadge: '夏日精选',
    sliderEyebrow: 'SUMMER WAVES',
    readingEyebrow: 'Summer Reading',
    readingTitleFallback: '夏日书架',
    readingDescriptionFallback: '让阅读和思考保持流动，像风、像光，也像还没停下的好奇心。'
  },
  autumn: {
    sliderBadge: '秋日精选',
    sliderEyebrow: 'AUTUMN DIGEST',
    readingEyebrow: 'Autumn Reading',
    readingTitleFallback: '秋日读札',
    readingDescriptionFallback: '更适合沉下来读点扎实的内容，把零散感受慢慢收束成判断。'
  },
  winter: {
    sliderBadge: '冬日精选',
    sliderEyebrow: 'WINTER LOG',
    readingEyebrow: 'Winter Reading',
    readingTitleFallback: '冬日夜读',
    readingDescriptionFallback: '把外界的噪音调低一点，留一块安静区域给阅读、整理和复盘。'
  },
  none: {
    sliderBadge: '精选文章',
    sliderEyebrow: siteConfig('HEO_HERO_TITLE_4', 'THINKING', CONFIG),
    readingEyebrow: 'Reading',
    readingTitleFallback: '我最近在读',
    readingDescriptionFallback: '这里会放我最近在翻的书，想看完整清单就继续点进去。'
  }
}

const getHeroSeasonCopy = season => HERO_SEASON_COPY[season] || HERO_SEASON_COPY.none



const Hero = props => {
  const HEO_HERO_ENABLE = siteConfig('HEO_HERO_ENABLE', true, CONFIG)
  const HEO_AMBIENCE_SEASON_EFFECTS = siteConfig('HEO_AMBIENCE_SEASON_EFFECTS', true, CONFIG)
  const HEO_AMBIENCE_SEASON_MODE = siteConfig('HEO_AMBIENCE_SEASON_MODE', 'auto', CONFIG)
  const heroSeason = HEO_AMBIENCE_SEASON_EFFECTS ? resolveHeroSeason(HEO_AMBIENCE_SEASON_MODE) : 'none'
  const seasonCopy = getHeroSeasonCopy(heroSeason)
  const heroReading = useHeroReadingBooks(DESKTOP_READING_LIMIT, seasonCopy)

  if (!HEO_HERO_ENABLE) {
    return null
  }

  return (
    <div
      id='hero-wrapper'
      className='recent-top-post-group w-full overflow-hidden select-none px-3 md:px-5 mb-4'>
      <MobileHero {...props} heroReading={heroReading} seasonCopy={seasonCopy} />
      <DesktopHero {...props} heroReading={heroReading} seasonCopy={seasonCopy} />
    </div>
  )
}



function getHeroReadingPreviewConfig(seasonCopy) {
  const profile = siteConfig('HEO_ABOUT_PROFILE', {}, CONFIG) || {}
  const bookList = profile?.bookList || {}
  const recentBookShelf = profile?.recentBookShelf || {}
  const recentBooks = Array.isArray(profile?.recentBooks) ? profile.recentBooks.filter(Boolean) : []
  const favoriteBooks = Array.isArray(profile?.books) ? profile.books.filter(Boolean) : []
  const fallbackBooks = (recentBooks.length ? recentBooks : favoriteBooks).slice(0, DESKTOP_READING_LIMIT)

  return {
    title: recentBookShelf?.title || seasonCopy.readingTitleFallback || '我最近在读',
    description: recentBookShelf?.description || seasonCopy.readingDescriptionFallback || '这里会放我最近在翻的书，想看完整清单就继续点进去。',
    link: recentBookShelf?.link || bookList?.pagePath || '/booklist',
    linkText: recentBookShelf?.linkText || '去看完整书单',
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


function useHeroReadingBooks(limit, seasonCopy) {
  const previewConfig = useMemo(() => getHeroReadingPreviewConfig(seasonCopy), [seasonCopy])

  const initialBooks = useMemo(
    () => previewConfig.fallbackBooks.map(normalizeHeroReadingBook).filter(Boolean).slice(0, limit),
    [limit, previewConfig]
  )
  const [books, setBooks] = useState(initialBooks)
  const [isLoading, setIsLoading] = useState(!initialBooks.length)

  useEffect(() => {
    let active = true

    async function loadBooks() {
      const cached = readBookListCache()
      const cachedBooks = getBookListPayloadBooks(cached?.payload)
        .filter(book => {
          if (!previewConfig.shelfName) return true
          return String(book?.shelfName || '').trim() === previewConfig.shelfName
        })
        .map(normalizeHeroReadingBook)
        .filter(Boolean)
      if (cachedBooks?.length) {
        setBooks(cachedBooks.slice(0, limit))
        setIsLoading(false)
      } else if (active) {
        setIsLoading(true)
      }

      try {
        const nextResult = await fetchBookListPayload(cached)
        if (!active) return

        const payloadBooks = getBookListPayloadBooks(nextResult?.payload)
        const filtered = payloadBooks
          .filter(book => {
            if (!previewConfig.shelfName) return true
            return String(book?.shelfName || '').trim() === previewConfig.shelfName
          })
          .map(normalizeHeroReadingBook)
          .filter(Boolean)

        writeBookListCache(nextResult.payload, nextResult.status)

        if (filtered.length) {
          setBooks(filtered.slice(0, limit))
          setIsLoading(false)
          return
        }
      } catch (error) {}

      if (!active) return
      setBooks(cachedBooks?.length ? cachedBooks.slice(0, limit) : initialBooks)
      setIsLoading(false)
    }

    loadBooks()
    return () => {
      active = false
    }
  }, [initialBooks, limit, previewConfig])

  return {
    books,
    config: previewConfig,
    isLoading
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

function DesktopHero({ heroReading, seasonCopy, ...props }) {
  const heroPosts = getHeroPosts(props)
  if (!heroPosts.length) return null

  return (
    <section className='heo-hero-shell hidden xl:grid max-w-[86rem] mx-auto'>
      <DesktopHeroSlider posts={heroPosts} siteInfo={props.siteInfo} seasonCopy={seasonCopy} />
      <DesktopHeroBooks heroReading={heroReading} seasonCopy={seasonCopy} />
    </section>
  )
}


function DesktopHeroSlider({ posts, siteInfo, seasonCopy }) {

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
            <div className='heo-hero-slider__badge'>{seasonCopy.sliderBadge}</div>
          </div>
          <div className='heo-hero-slider__copy'>
            <div className='heo-hero-slider__eyebrow'>
              {seasonCopy.sliderEyebrow}
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

function DesktopHeroBooks({ heroReading, seasonCopy }) {
  const { books, config, isLoading } = heroReading

  const shouldRenderSkeleton = !books.length && isLoading
  const shouldRenderEmpty = !books.length && !isLoading

  return (
    <aside className='heo-hero-books heo-card'>
      <div className='heo-hero-books__head'>
        <div>
          <div className='heo-hero-books__eyebrow'>{seasonCopy.readingEyebrow}</div>
          <h3 className='heo-hero-books__title'>{config.title}</h3>
        </div>

        <SmartLink href={config.link} className='heo-hero-books__link'>
          <span>{config.linkText}</span>
          <ArrowSmallRight className='w-4 h-4 stroke-2' />
        </SmartLink>
      </div>

      <p className='heo-hero-books__desc'>{config.description}</p>

      <div className='heo-hero-books__list'>
        {shouldRenderSkeleton
          ? Array.from({ length: DESKTOP_READING_LIMIT }).map((_, index) => (
              <div key={`skeleton-${index}`} className='heo-hero-books__item heo-hero-books__item--skeleton'>
                <div className='heo-hero-books__cover-wrap'>
                  <div className='heo-hero-books__cover heo-hero-books__cover--skeleton' />
                </div>
                <div className='heo-hero-books__meta'>
                  <div className='heo-hero-books__line heo-hero-books__line--title' />
                  <div className='heo-hero-books__line heo-hero-books__line--author' />
                </div>
              </div>
            ))
          : shouldRenderEmpty
            ? (
              <SmartLink href={config.link} className='heo-hero-books__empty'>
                <div className='heo-hero-books__empty-icon'>阅</div>
                <div className='heo-hero-books__empty-copy'>
                  <div className='heo-hero-books__empty-title'>书单还在整理中</div>
                  <div className='heo-hero-books__empty-text'>先去书单页看看，后续这里会展示最近在读。</div>
                </div>
                <div className='heo-hero-books__empty-action'>打开书单</div>
              </SmartLink>
            )
            : books.map((book, index) => (
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


function MobileHero({ heroReading, seasonCopy, ...props }) {
  const heroPosts = getHeroPosts(props).slice(0, 3)
  const { books, config, isLoading } = heroReading



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
                <div className='heo-mobile-hero__slide-badge'>{seasonCopy.sliderBadge}</div>
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

      <section className='heo-mobile-reading-entry heo-card'>

          <div className='heo-mobile-reading-entry__head'>
            <div className='heo-mobile-reading-entry__head-main'>
              <div className='heo-mobile-reading-entry__eyebrow'>{seasonCopy.readingEyebrow}</div>
              <div className='heo-mobile-reading-entry__title line-clamp-2'>{config.title}</div>

              {!books.length && !isLoading ? (
                <div className='heo-mobile-reading-entry__empty-text line-clamp-2'>
                  书单还在整理中，先去书单页看看最近阅读计划。
                </div>
              ) : null}
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
            ) : isLoading ? (
              <div className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--primary heo-mobile-reading-entry__cover-link--skeleton'>
                <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--skeleton' />
              </div>
            ) : (
              <SmartLink
                href={config.link}
                className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--primary heo-mobile-reading-entry__cover-link--empty'>
                <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--empty'>阅</div>
              </SmartLink>
            )}
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
            ) : isLoading ? (
              <div className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--peek heo-mobile-reading-entry__cover-link--skeleton'>
                <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--skeleton' />
              </div>
            ) : (
              <SmartLink
                href={config.link}
                className='heo-mobile-reading-entry__cover-link heo-mobile-reading-entry__cover-link--peek heo-mobile-reading-entry__cover-link--empty'>
                <div className='heo-mobile-reading-entry__cover heo-mobile-reading-entry__cover--empty'>读</div>
              </SmartLink>
            )}

          </div>
        </section>
    </div>
  )
}

export default Hero
