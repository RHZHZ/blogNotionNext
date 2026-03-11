import Comment from '@/components/Comment'
import { AdSlot } from '@/components/GoogleAdsense'
import { HashTag } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import LoadingCover from '@/components/LoadingCover'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import WWAds from '@/components/WWAds'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadWowJS } from '@/lib/plugins/wow'
import { isBrowser, isAiSummaryEnabled } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import CategoryBar from './components/CategoryBar'
import FloatTocButton from './components/FloatTocButton'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import LatestPostsGroup from './components/LatestPostsGroup'
import { NoticeBar } from './components/NoticeBar'
import PostAdjacent from './components/PostAdjacent'
import PostCopyright from './components/PostCopyright'
import PostHeader from './components/PostHeader'
import { PostLock } from './components/PostLock'
import PostRecommend from './components/PostRecommend'
import SearchNav from './components/SearchNav'
import SideRight from './components/SideRight'
import ShareBar from '@/components/ShareBar'
import CONFIG from './config'
import { Style } from './style'
import AISummary from '@/components/AISummary'
import ArticleExpirationNotice from '@/components/ArticleExpirationNotice'

export const THEME_METADATA = {
  key: 'rhz',
  name: 'RHZ',
  sourceTheme: 'rhz',
  status: 'localized'
}

const addFontLinks = () => {
  if (typeof window !== 'undefined') {
    const head = document.head || document.getElementsByTagName('head')[0]

    const regularLink = document.createElement('link')
    regularLink.rel = 'stylesheet'
    regularLink.href = 'https://cdn.jsdelivr.net/gh/satouriko/LxgwWenKai_Webfonts@latest/dist/LXGWWenKaiMono-Regular.css'
    head.appendChild(regularLink)

    const boldLink = document.createElement('link')
    boldLink.rel = 'stylesheet'
    boldLink.href = 'https://cdn.jsdelivr.net/gh/satouriko/LxgwWenKai_Webfonts@latest/dist/LXGWWenKaiMono-Bold.css'
    head.appendChild(boldLink)

    const lightLink = document.createElement('link')
    lightLink.rel = 'stylesheet'
    lightLink.href = 'https://cdn.jsdelivr.net/gh/satouriko/LxgwWenKai_Webfonts@latest/dist/LXGWWenKaiMono-Light.css'
    head.appendChild(lightLink)
  }
}

const LayoutBase = props => {
  const { children, slotTop, className } = props
  const { fullWidth, isDarkMode, isEyeCareMode, eyeCareIntensity } = useGlobal()
  const router = useRouter()

  const headerSlot = (
    <header>
      <Header {...props} />
      {router.route === '/' ? (
        <>
          <NoticeBar />
          <Hero {...props} />
        </>
      ) : null}
      {fullWidth ? null : <PostHeader {...props} isDarkMode={isDarkMode} />}
    </header>
  )

  const slotRight =
    router.route === '/404' || fullWidth ? null : <SideRight {...props} />

  const maxWidth = fullWidth ? 'max-w-[96rem] mx-auto' : 'max-w-[86rem]'

  const RHZ_HERO_BODY_REVERSE = siteConfig(
    'RHZ_HERO_BODY_REVERSE',
    false,
    CONFIG
  )
  const RHZ_LOADING_COVER = siteConfig('RHZ_LOADING_COVER', true, CONFIG)

  useEffect(() => {
    loadWowJS()
  }, [])

  useEffect(() => {
    addFontLinks()
  }, [])

  return (
    <div
      id='theme-rhz'
      style={{ '--heo-eye-care-intensity': `${eyeCareIntensity / 100}` }}
      className={`${siteConfig('FONT_STYLE')} ${isEyeCareMode ? 'heo-eye-care' : ''} bg-[#f7f9fe] dark:bg-[#18171d] h-full min-h-screen flex flex-col scroll-smooth`}>
      <Style />
      <div className='heo-eye-care-mask' aria-hidden='true' />
      {headerSlot}
      <main
        id='wrapper-outer'
        className={`flex-grow w-full ${maxWidth} mx-auto relative md:px-5`}>
        <div
          id='container-inner'
          className={`${RHZ_HERO_BODY_REVERSE ? 'flex-row-reverse' : ''} w-full mx-auto lg:flex justify-center relative z-10`}>
          <div className={`w-full h-auto ${className || ''}`}>
            {slotTop}
            {children}
          </div>

          <div className='lg:px-2'></div>

          <div className='hidden xl:block'>
            {slotRight}
          </div>
        </div>
      </main>
      <Footer />
      {RHZ_LOADING_COVER && <LoadingCover />}
    </div>
  )
}

const LayoutIndex = props => {
  const RHZ_HOME_CATEGORY_BAR_ENABLE = siteConfig(
    'RHZ_HOME_CATEGORY_BAR_ENABLE',
    true,
    CONFIG
  )

  return (
    <div id='post-outer-wrapper' className='px-5 md:px-0'>
      {RHZ_HOME_CATEGORY_BAR_ENABLE && <CategoryBar {...props} />}
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

const LayoutPostList = props => {
  return (
    <div id='post-outer-wrapper' className='px-5  md:px-0'>
      <CategoryBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    if (currentSearch) {
      setTimeout(() => {
        replaceSearchResult({
          doms: document.getElementsByClassName('replace'),
          search: currentSearch,
          target: {
            element: 'span',
            className: 'text-red-500 border-b border-dashed'
          }
        })
      }, 100)
    }
  }, [])
  return (
    <div currentSearch={currentSearch}>
      <div id='post-outer-wrapper' className='px-5  md:px-0'>
        {!currentSearch ? (
          <SearchNav {...props} />
        ) : (
          <div id='posts-wrapper'>
            {siteConfig('POST_LIST_STYLE') === 'page' ? (
              <BlogPostListPage {...props} />
            ) : (
              <BlogPostListScroll {...props} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const LayoutArchive = props => {
  const { archivePosts, siteInfo } = props

  return (
    <section className='heo-archive-shell max-w-6xl w-full rounded-[1.75rem] border p-5 md:p-6'>
      <CategoryBar {...props} border={false} />

      <div className='heo-archive-list px-1 md:px-2'>
        {Object.keys(archivePosts).map(archiveTitle => (
          <BlogPostArchive
            key={archiveTitle}
            posts={archivePosts[archiveTitle]}
            archiveTitle={archiveTitle}
            siteInfo={siteInfo}
          />
        ))}
      </div>
    </section>
  )
}

const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const { locale, fullWidth } = useGlobal()

  const [hasCode, setHasCode] = useState(false)
  const hasWWAds = Boolean(siteConfig('AD_WWADS_ID'))

  useEffect(() => {
    const hasCode = document.querySelectorAll('[class^="language-"]').length > 0
    setHasCode(hasCode)
  }, [])

  const commentEnable =
    siteConfig('COMMENT_ARTALK_SERVER') ||
    siteConfig('COMMENT_TWIKOO_ENV_ID') ||
    siteConfig('COMMENT_WALINE_SERVER_URL') ||
    siteConfig('COMMENT_VALINE_APP_ID') ||
    siteConfig('COMMENT_GISCUS_REPO') ||
    siteConfig('COMMENT_CUSDIS_APP_ID') ||
    siteConfig('COMMENT_UTTERRANCES_REPO') ||
    siteConfig('COMMENT_GITALK_CLIENT_ID') ||
    siteConfig('COMMENT_WEBMENTION_ENABLE')

  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    if (router.isFallback || post) {
      return
    }

    const timeoutId = setTimeout(() => {
      if (!isBrowser || router.isFallback) {
        return
      }

      const article = document.querySelector('#article-wrapper #notion-article')
      if (!article) {
        router.push('/404').then(() => {
          console.warn('找不到页面', router.asPath)
        })
      }
    }, waiting404)

    return () => clearTimeout(timeoutId)
  }, [post, router, waiting404])

  return (
    <>
      <div
        className={`article heo-post-shell h-full w-full ${fullWidth ? '' : 'xl:max-w-5xl'} ${hasCode ? 'xl:w-[73.15vw]' : ''}  bg-white dark:bg-[#18171d] dark:border-gray-600 lg:hover:shadow lg:border rounded-2xl lg:px-2 lg:py-4 `}>
        {lock && <PostLock validPassword={validPassword} />}

        {!lock && post && (
          <div className='mx-auto heo-post-shell__inner md:w-full md:px-5'>
            <article
              id='article-wrapper'
              className='heo-article-layout'
              itemScope
              itemType='https://schema.org/Movie'>
              <section
                className='heo-article-section wow fadeInUp p-5 justify-center mx-auto'
                data-wow-delay='.2s'>
                <ArticleExpirationNotice post={post} />
                {isAiSummaryEnabled(post) && (
                  <div className='heo-article-content-width'>
                    <AISummary aiSummary={post.aiSummary} post={post} />
                  </div>
                )}
                {hasWWAds && (
                  <div className='heo-article-inline-ad'>
                    <WWAds orientation='horizontal' className='w-full' />
                  </div>
                )}
                <div className='heo-article-reading-shell'>
                  {post && <NotionPage post={post} className='heo-article-body' />}
                  <div className='heo-article-end-marker' aria-label='正文已结束'>
                    <span className='heo-article-end-marker__line' aria-hidden='true' />
                    <span className='heo-article-end-marker__label'>正文到这里</span>
                    <span className='heo-article-end-marker__line' aria-hidden='true' />
                  </div>
                </div>
                {hasWWAds && (
                  <div className='heo-article-inline-ad'>
                    <WWAds orientation='horizontal' className='w-full' />
                  </div>
                )}
              </section>

              {post?.type === 'Post' && (
                <div className='heo-post-footer px-5 pb-4 pt-6'>
                  <div className='heo-post-footer__inner space-y-6'>
                    <div className='heo-post-footer__share'>
                      <ShareBar post={post} />
                    </div>
                    <PostCopyright {...props} />
                    <PostAdjacent {...props} />
                    <div className='heo-post-footer__divider h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent dark:via-slate-700/70' />
                    <PostRecommend {...props} />
                  </div>
                </div>
              )}
            </article>

            {fullWidth ? null : (
              <div className='px-5 pb-4 pt-4'>
                <div className='mb-5 h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent dark:via-slate-700/70' />
                {commentEnable && post ? (
                  <>
                    <div className='py-2'>
                      <AdSlot />
                    </div>
                    <section className='overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.05)] transition-all duration-200 dark:border-slate-700/60 dark:bg-[#1f2026] sm:p-6'>
                      <div className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
                        <div className='max-w-2xl'>
                          <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
                            Discussion
                          </div>
                          <div className='mt-1 flex items-center text-2xl font-semibold text-slate-800 dark:text-slate-100'>
                            <i className='fas fa-comment mr-2 text-base text-slate-400 dark:text-slate-500' />
                            {locale.COMMON.COMMENTS}
                          </div>
                          <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>
                            评论模块会在进入可视区域后按需加载，保持文章收尾区的阅读节奏更轻、更稳定。
                          </p>
                        </div>

                        <div className='rounded-[1.4rem] border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-300'>
                          <div className='font-medium text-slate-700 dark:text-slate-100'>
                            讨论区状态
                          </div>
                          <div className='mt-1'>
                            已接入评论能力，进入视口后再懒加载具体评论内核。
                          </div>
                        </div>
                      </div>
                      <Comment
                        frontMatter={post}
                        className='mt-6'
                        variant='rhz'
                        tabsVariant='comment-rhz'
                      />
                    </section>
                  </>
                ) : (
                  <section
                    id='comment'
                    className='overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/96 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.05)] transition-all duration-200 dark:border-slate-700/60 dark:bg-[#1f2026] sm:p-6'>
                    <div className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='max-w-2xl'>
                        <div className='text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
                          Discussion Reserved
                        </div>
                        <div className='mt-1 flex items-center text-2xl font-semibold text-slate-800 dark:text-slate-100'>
                          <i className='fas fa-comment-slash mr-2 text-base text-slate-400 dark:text-slate-500' />
                          评论区暂未启用
                        </div>
                        <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>
                          当前文章页先保留讨论区位置，后续会结合整体主题样式与部署方案统一接入评论系统。
                        </p>
                        <p className='mt-3 text-sm leading-7 text-slate-500 dark:text-slate-300'>
                          注：绝对不是因为懒~~~(～￣(OO)￣)ブ。
                        </p>
                      </div>

                      <div className='rounded-[1.4rem] border border-slate-200/80 bg-slate-50/90 px-4 py-3 text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-300'>
                        <div className='font-medium text-slate-700 dark:text-slate-100'>
                          备案状态
                        </div>
                        <div className='mt-1'>
                          已预留入口，后续按 `Giscus` 方向接入。
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <FloatTocButton {...props} />
    </>
  )
}

const Layout404 = props => {
  const { onLoading, fullWidth } = useGlobal()
  return (
    <>
      <main
        id='wrapper-outer'
        className={`flex-grow ${fullWidth ? '' : 'max-w-4xl'} w-screen mx-auto px-5`}>
        <div id='error-wrapper' className={'w-full mx-auto justify-center'}>
          <Transition
            show={!onLoading}
            appear={true}
            enter='transition ease-in-out duration-700 transform order-first'
            enterFrom='opacity-0 translate-y-16'
            enterTo='opacity-100'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-16'
            unmount={false}>
            <div className='error-content flex flex-col md:flex-row w-full mt-12 h-[30rem] md:h-96 justify-center items-center bg-white dark:bg-[#1B1C20] border dark:border-gray-800 rounded-3xl'>
              <LazyImage
                className='error-img h-60 md:h-full p-4'
                src={
                  'https://bu.dusays.com/2023/03/03/6401a7906aa4a.gif'
                }></LazyImage>

              <div className='error-info flex-1 flex flex-col justify-center items-center space-y-4'>
                <h1 className='error-title font-extrabold md:text-9xl text-7xl dark:text-white'>
                  404
                </h1>
                <div className='dark:text-white'>请尝试站内搜索寻找文章</div>
                <SmartLink href='/'>
                  <button className='bg-blue-500 py-2 px-4 text-white shadow rounded-lg hover:bg-blue-600 hover:shadow-md duration-200 transition-all'>
                    回到主页
                  </button>
                </SmartLink>
              </div>
            </div>

            <div className='mt-12'>
              <LatestPostsGroup {...props} />
            </div>
          </Transition>
        </div>
      </main>
    </>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()

  return (
    <section id='category-outer-wrapper' className='heo-category-index mt-8 px-5 md:px-0'>
      <div className='heo-category-index__header mb-6 flex flex-col gap-2'>
        <div className='heo-category-index__eyebrow text-xs font-semibold uppercase tracking-[0.24em]'>
          Discover
        </div>
        <div className='heo-category-index__title text-4xl font-extrabold'>
          {locale.COMMON.CATEGORY}
        </div>
        <div className='heo-category-index__subtitle text-sm md:text-base'>
          按主题快速浏览全部文章分类
        </div>
      </div>
      <div
        id='category-list'
        className='heo-category-index__grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {categoryOptions?.map(category => {
          return (
            <SmartLink
              key={category.name}
              href={`/category/${category.name}`}
              passHref
              className='heo-category-index__item group'>
              <span className='heo-category-index__item-icon'>
                <HashTag className='h-4 w-4 stroke-2' />
              </span>
              <span className='heo-category-index__item-main'>
                <span className='heo-category-index__item-name'>{category.name}</span>
                <span className='heo-category-index__item-desc'>进入分类页查看相关文章</span>
              </span>
              <span className='heo-category-index__item-count'>{category.count}</span>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()

  return (
    <section id='tag-outer-wrapper' className='heo-tag-index px-5 mt-8 md:px-0'>
      <div className='heo-tag-index__header mb-6 flex flex-col gap-2'>
        <div className='heo-tag-index__eyebrow text-xs font-semibold uppercase tracking-[0.24em]'>
          Explore
        </div>
        <div className='heo-tag-index__title text-4xl font-extrabold'>
          {locale.COMMON.TAGS}
        </div>
        <div className='heo-tag-index__subtitle text-sm md:text-base'>
          从标签维度快速筛选你感兴趣的内容
        </div>
      </div>
      <div
        id='tag-list'
        className='heo-tag-index__grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {tagOptions.map(tag => {
          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${tag.name}`}
              passHref
              className='heo-tag-index__item group'>
              <span className='heo-tag-index__item-icon'>
                <HashTag className='h-4 w-4 stroke-2' />
              </span>
              <span className='heo-tag-index__item-main'>
                <span className='heo-tag-index__item-name'>{tag.name}</span>
                <span className='heo-tag-index__item-desc'>查看该标签下的全部文章</span>
              </span>
              <span className='heo-tag-index__item-count'>{tag.count}</span>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
