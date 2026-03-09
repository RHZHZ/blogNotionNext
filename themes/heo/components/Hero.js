// import Image from 'next/image'
import { ArrowSmallRight, PlusSmall } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * 顶部英雄区
 * 左右布局，
 * 左侧：banner组
 * 右侧：今日卡牌遮罩
 * @returns
 */
const Hero = props => {
  const HEO_HERO_ENABLE = siteConfig('HEO_HERO_ENABLE', true, CONFIG)
  const HEO_HERO_REVERSE = siteConfig('HEO_HERO_REVERSE', false, CONFIG)

  if (!HEO_HERO_ENABLE) {
    return null
  }

  return (
    <div
      id='hero-wrapper'
      className='recent-top-post-group w-full overflow-hidden select-none px-3 md:px-5 mb-4'>
      <MobileHero {...props} />

      <div
        id='hero'
        style={{ zIndex: 1 }}
        className={`${HEO_HERO_REVERSE ? 'xl:flex-row-reverse' : ''}
           recent-post-top rounded-[12px] 2xl:px-5 recent-top-post-group max-w-[86rem] overflow-x-scroll w-full mx-auto flex-row flex-nowrap hidden xl:flex relative`}>
        {/* 左侧banner组 */}
        <BannerGroup {...props} />

        {/* 中间留白 */}
        <div className='px-1.5 h-full'></div>

        {/* 右侧置顶文章组 */}
        <TopGroup {...props} />
      </div>
    </div>
  )
}

function MobileHero(props) {
  const { latestPosts, allNavPages, siteInfo } = props
  const topPosts = getTopPosts({ latestPosts, allNavPages })
  const heroPosts = (topPosts?.length ? topPosts : latestPosts || []).slice(0, 3)

  if (!heroPosts.length) {
    return null
  }

  return (
    <div className='heo-mobile-hero xl:hidden max-w-[86rem] mx-auto'>
      <div className='heo-mobile-hero__slider flex gap-3 overflow-x-auto pb-2'>
        {heroPosts.map((post, index) => {
          const cover = post?.pageCoverThumbnail || siteInfo?.pageCover
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
    </div>
  )
}



/**
 * 英雄区左侧banner组
 * @returns
 */
function BannerGroup(props) {
  return (
    // 左侧英雄区
    <div
      id='bannerGroup'
      className='flex flex-col justify-between flex-1 mr-2 max-w-[42rem]'>
      {/* 动图 */}
      <Banner {...props} />
      {/* 导航分类 */}
      <GroupMenu />
    </div>
  )
}

/**
 * 英雄区左上角banner动图
 * @returns
 */
function Banner(props) {
  const router = useRouter()
  const { allNavPages } = props
  /**
   * 随机跳转文章
   */
  function handleClickBanner() {
    const randomIndex = Math.floor(Math.random() * allNavPages.length)
    const randomPost = allNavPages[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  // 遮罩文字
  const coverTitle = siteConfig('HEO_HERO_COVER_TITLE')

  return (
    <div
      id='banners'
      onClick={handleClickBanner}
      className='heo-card heo-card--interactive hidden xl:flex xl:flex-col group h-full mb-3 relative overflow-hidden'>
      <div
        id='banner-title'
        className='heo-hero-banner__title z-10 flex flex-col absolute top-10 left-10'>
        <div className='heo-hero-banner__title-pill mb-4 w-fit'>
          <div className='heo-hero-banner__headline text-4xl font-bold dark:text-white'>
            {siteConfig('HEO_HERO_TITLE_1', null, CONFIG)}
            <br />
            {siteConfig('HEO_HERO_TITLE_2', null, CONFIG)}
          </div>
        </div>
        <div className='heo-hero-banner__subtitle-wrap'>
          <div className='heo-hero-banner__subtitle text-xs text-gray-600 dark:text-gray-200'>
            {siteConfig('HEO_HERO_TITLE_3', null, CONFIG)}
          </div>
        </div>
      </div>

      {/* 斜向滚动的图标 */}
      <TagsGroupBar />

      {/* 遮罩 */}
      <div
        id='banner-cover'
        style={{ backdropFilter: 'blur(15px)' }}
        className='heo-hero-banner__cover z-20 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 duration-300 transition-all cursor-pointer absolute w-full h-full top-0 flex justify-start items-center'>
        <div className='heo-hero-banner__cover-content ml-12 -translate-x-32 group-hover:translate-x-0 duration-300 transition-all ease-in'>
          <div className='heo-hero-banner__cover-title text-7xl text-white font-extrabold'>{coverTitle}</div>
          <div className='heo-hero-banner__cover-arrow -ml-3 text-gray-300'>
            <ArrowSmallRight className={'w-24 h-24 stroke-2'} />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 图标滚动标签组
 * 英雄区左上角banner条中斜向滚动的图标
 */
function TagsGroupBar() {
  let groupIcons = siteConfig('HEO_GROUP_ICONS', null, CONFIG)
  if (groupIcons) {
    groupIcons = groupIcons.concat(groupIcons)
  }
  return (
    <div className='tags-group-all flex -rotate-[30deg] h-full'>
      <div className='tags-group-wrapper flex flex-nowrap absolute top-16'>
        {groupIcons?.map((g, index) => {
          return (
            <div key={index} className='tags-group-icon-pair ml-6 select-none'>
              <div
                style={{ background: g.color_1 }}
                className={
                  'tags-group-icon w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={true}
                  src={g.img_1}
                  title={g.title_1}
                  className='w-2/3 hidden xl:block'
                />
              </div>
              <div
                style={{ background: g.color_2 }}
                className={
                  'tags-group-icon  mt-5 w-28 h-28 rounded-3xl flex items-center justify-center text-white text-lg font-bold shadow-md'
                }>
                <LazyImage
                  priority={true}
                  src={g.img_2}
                  title={g.title_2}
                  className='w-2/3 hidden xl:block'
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 英雄区左下角3个指定分类按钮
 * @returns
 */
function GroupMenu() {
  const url_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.url || ''
  const title_1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)?.title || ''
  const url_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.url || ''
  const title_2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)?.title || ''
  const url_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.url || ''
  const title_3 = siteConfig('HEO_HERO_CATEGORY_3', {}, CONFIG)?.title || ''

  return (
    <div className='h-[165px] select-none xl:h-20 flex flex-col justify-between xl:space-y-0 xl:flex-row w-28 lg:w-48 xl:w-full xl:flex-nowrap xl:space-x-3'>
      <SmartLink
        href={url_1}
        className='heo-hero-menu-card heo-hero-menu-card--blue heo-hero-menu-card--primary group relative overflow-hidden flex h-20 justify-start items-center text-white rounded-xl xl:w-[38%] transition-all duration-500 ease-in'>
        <div className='font-bold lg:text-lg pl-5 relative -mt-2'>
          {title_1}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='hidden lg:block absolute right-6 duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-star text-4xl'></i>
        </div>
      </SmartLink>
      <SmartLink
        href={url_2}
        className='heo-hero-menu-card heo-hero-menu-card--amber group relative overflow-hidden flex h-20 justify-start items-center text-white rounded-xl xl:hover:w-1/2 xl:w-1/3 transition-all duration-500 ease-in'>
        <div className='font-bold lg:text-lg pl-5 relative -mt-2'>
          {title_2}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='hidden lg:block absolute right-6 duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-fire-flame-curved text-4xl'></i>
        </div>
      </SmartLink>
      {/* 第三个标签在小屏上不显示 */}
      <SmartLink
        href={url_3}
        className='heo-hero-menu-card heo-hero-menu-card--teal heo-hero-menu-card--tertiary group relative overflow-hidden hidden h-20 xl:flex justify-start items-center text-white rounded-xl xl:w-[31%] transition-all duration-500 ease-in'>
        <div className='font-bold text-lg pl-5 relative -mt-2'>
          {title_3}
          <span className='absolute -bottom-0.5 left-5 w-5 h-0.5 bg-white rounded-full'></span>
        </div>
        <div className='absolute right-6 duration-700 ease-in-out transition-all scale-[2] translate-y-6 rotate-12 opacity-20 group-hover:opacity-80 group-hover:scale-100 group-hover:translate-y-0 group-hover:rotate-0'>
          <i className='fa-solid fa-book-bookmark text-4xl '></i>
        </div>
      </SmartLink>
    </div>
  )
}

/**
 * 置顶文章区域
 */
function TopGroup(props) {
  const { latestPosts, allNavPages, siteInfo } = props
  const { locale } = useGlobal()
  const todayCardRef = useRef()
  function handleMouseLeave() {
    todayCardRef.current.coverUp()
  }

  // 获取置顶推荐文章
  const topPosts = getTopPosts({ latestPosts, allNavPages })

  return (
    <div
      id='hero-right-wrapper'
      onMouseLeave={handleMouseLeave}
      className='flex-1 relative w-full'>
      {/* 置顶推荐文章 */}
      <div
        id='top-group'
        className='w-full flex space-x-3 xl:space-x-0 xl:grid xl:grid-cols-3 xl:gap-3 xl:h-[342px]'>
        {topPosts?.map((p, index) => {
          return (
            <SmartLink href={`${siteConfig('SUB_PATH', '')}/${p?.slug}`} key={index}>
              <div className={`heo-card heo-card--interactive heo-hero-top-card ${index === 0 ? 'heo-hero-top-card--primary' : 'heo-hero-top-card--secondary'} cursor-pointer h-[164px] group relative flex flex-col w-52 xl:w-full overflow-hidden dark:text-white`}>
                <LazyImage
                  priority={index === 0}
                  className='heo-hero-top-card__cover h-24 object-cover'
                  alt={p?.title}
                  src={p?.pageCoverThumbnail || siteInfo?.pageCover}
                />
                <div className='heo-hero-top-card__title group-hover:text-indigo-600 dark:group-hover:text-yellow-600 line-clamp-2 overflow-hidden m-2 font-semibold'>
                  {p?.title}
                </div>
                {/* hover 悬浮的 ‘荐’ 字 */}
                <div className='heo-hero-top-card__badge opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-200 transition-all absolute -top-2 -left-2 text-white rounded-xl overflow-hidden pr-2 pb-2 pl-4 pt-4 text-xs'>
                  {locale.COMMON.RECOMMEND_BADGES}
                </div>
              </div>
            </SmartLink>
          )
        })}
      </div>
      {/* 一个大的跳转文章卡片 */}
      <TodayCard cRef={todayCardRef} siteInfo={siteInfo} />
    </div>
  )
}

/**
 * 获取推荐置顶文章
 */
function getTopPosts({ latestPosts, allNavPages }) {
  // 默认展示最近更新
  if (
    !siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) ||
    siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG) === ''
  ) {
    return latestPosts
  }

  // 显示包含‘推荐’标签的文章
  let sortPosts = []

  // 排序方式
  if (
    JSON.parse(
      siteConfig('HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME', null, CONFIG)
    )
  ) {
    sortPosts = Object.create(allNavPages).sort((a, b) => {
      const dateA = new Date(a?.lastEditedDate)
      const dateB = new Date(b?.lastEditedDate)
      return dateB - dateA
    })
  } else {
    sortPosts = Object.create(allNavPages)
  }

  const topPosts = []
  for (const post of sortPosts) {
    if (topPosts.length === 6) {
      break
    }
    // 查找标签
    if (
      post?.tags?.indexOf(
        siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG)
      ) >= 0
    ) {
      topPosts.push(post)
    }
  }
  return topPosts
}

/**
 * 英雄区右侧，今日卡牌
 * @returns
 */
function TodayCard({ cRef, siteInfo }) {
  const router = useRouter()
  const link = siteConfig('HEO_HERO_TITLE_LINK', null, CONFIG)
  const { locale } = useGlobal()
  // 卡牌是否盖住下层
  const [isCoverUp, setIsCoverUp] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // 初始检查
    setIsDark(document.documentElement.classList.contains('dark'))

    // 监听暗色模式变化
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  /**
   * 外部可以调用此方法
   */
  useImperativeHandle(cRef, () => {
    return {
      coverUp: () => {
        setIsCoverUp(true)
      }
    }
  })

  /**
   * 查看更多
   * @param {*} e
   */
  function handleClickShowMore(e) {
    e.stopPropagation()
    setIsCoverUp(false)
  }

  /**
   * 点击卡片跳转的链接
   * @param {*} e
   */
  function handleCardClick() {
    router.push(link)
  }

  return (
    <div
      id='today-card'
      className={`${
        isCoverUp ? ' ' : 'pointer-events-none'
      } heo-today-card-shell overflow-hidden absolute hidden xl:flex flex-1 flex-col h-full top-0 w-full`}>
      <div
        id='card-body'
        onClick={handleCardClick}
        className={`${
          isCoverUp
            ? 'opacity-100 cursor-pointer'
            : 'opacity-0 transform scale-110 pointer-events-none'
        } heo-card heo-card--interactive heo-today-card shadow transition-all duration-200 today-card h-full relative flex items-end`}>
        <div className='heo-today-card__badge absolute right-8 top-7 z-20'>
          {locale.COMMON.RECOMMEND_BADGES}
        </div>

        <div
          id='today-card-info'
          className='heo-today-card__info flex justify-between w-full relative text-white p-10 items-end'>
          <div className='heo-today-card__copy flex flex-col'>
            <div className='heo-today-card__eyebrow text-xs font-light'>
              {siteConfig('HEO_HERO_TITLE_4', null, CONFIG)}
            </div>
            <div className='heo-today-card__title text-3xl font-bold'>
              {siteConfig('HEO_HERO_TITLE_5', null, CONFIG)}
            </div>
          </div>
          <div
            onClick={handleClickShowMore}
            className={`${isCoverUp ? '' : 'hidden pointer-events-none'} heo-today-card__more z-10 group flex items-center px-3 h-10 justify-center rounded-3xl transition-colors duration-100`}>
            <PlusSmall
              className={
                'heo-today-card__more-icon group-hover:rotate-180 duration-500 transition-all w-6 h-6 mr-2 bg-white rounded-full stroke-black'
              }
            />
            <div className='heo-today-card__more-label select-none'>
              {locale.COMMON.RECOMMEND_POSTS}
            </div>
          </div>
        </div>

        <LazyImage
          priority={true}
          src={isDark ? 'https://s41.ax1x.com/2026/03/06/peCucY6.webp' : 'https://s41.ax1x.com/2026/03/06/peCugfK.webp'}
          alt='Today card cover'
          id='today-card-cover'
          className={`${
            isCoverUp ? '' : ' pointer-events-none'
          } hover:scale-110 duration-1000 object-cover cursor-pointer today-card-cover absolute w-full h-full top-0`}
        />
      </div>
    </div>
  )
}

export default Hero
