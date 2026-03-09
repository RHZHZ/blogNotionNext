import Tabs from '@/components/Tabs'
import { siteConfig } from '@/lib/config'
import { isBrowser, isSearchEngineBot } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import Artalk from './Artalk'

const DefaultLoadingState = () => (
  <div className='text-center'>
    Loading...
    <i className='fas fa-spinner animate-spin text-3xl ' />
  </div>
)

const HeoLoadingState = () => (
  <div className='overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-700/60 dark:bg-slate-900/40 sm:p-5'>
    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
      <div className='max-w-2xl'>
        <div className='text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
          Discussion Loading
        </div>
        <div className='mt-2 flex items-center text-lg font-semibold text-slate-800 dark:text-slate-100'>
          <i className='fas fa-spinner mr-2 animate-spin text-sm text-amber-500' />
          讨论区正在准备中
        </div>
        <p className='mt-2 text-sm leading-7 text-slate-500 dark:text-slate-300'>
          正在按需加载评论模块，稍后即可进入阅读后的讨论内容。
        </p>
      </div>

      <div className='min-w-[12rem] rounded-[1.2rem] border border-white/70 bg-white/80 p-3 shadow-[0_12px_30px_rgba(15,23,42,0.04)] backdrop-blur dark:border-slate-700/60 dark:bg-slate-800/70'>
        <div className='h-2.5 w-20 rounded-full bg-slate-200 dark:bg-slate-700' />
        <div className='mt-3 space-y-2'>
          <div className='h-2.5 w-full rounded-full bg-slate-200/90 dark:bg-slate-700/80' />
          <div className='h-2.5 w-4/5 rounded-full bg-slate-200/80 dark:bg-slate-700/70' />
          <div className='h-2.5 w-3/5 rounded-full bg-slate-200/70 dark:bg-slate-700/60' />
        </div>
      </div>
    </div>
  </div>
)

/**
 * 评论组件
 * 只有当前组件在浏览器可见范围内才会加载内容
 * @param {*} param0
 * @returns
 */
const Comment = ({
  frontMatter,
  className,
  variant = 'default',
  loadingSlot,
  tabsClassName,
  tabsVariant = 'default'
}) => {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState(false)
  const commentRef = useRef(null)

  const COMMENT_ARTALK_SERVER = siteConfig('COMMENT_ARTALK_SERVER')
  const COMMENT_TWIKOO_ENV_ID = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const COMMENT_WALINE_SERVER_URL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const COMMENT_VALINE_APP_ID = siteConfig('COMMENT_VALINE_APP_ID')
  const COMMENT_GISCUS_REPO = siteConfig('COMMENT_GISCUS_REPO')
  const COMMENT_CUSDIS_APP_ID = siteConfig('COMMENT_CUSDIS_APP_ID')
  const COMMENT_UTTERRANCES_REPO = siteConfig('COMMENT_UTTERRANCES_REPO')
  const COMMENT_GITALK_CLIENT_ID = siteConfig('COMMENT_GITALK_CLIENT_ID')
  const COMMENT_WEBMENTION_ENABLE = siteConfig('COMMENT_WEBMENTION_ENABLE')

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.unobserve(entry.target)
        }
      })
    })

    if (commentRef.current) {
      observer.observe(commentRef.current)
    }

    return () => {
      if (commentRef.current) {
        observer.unobserve(commentRef.current)
      }
    }
  }, [frontMatter])

  if (
    isBrowser &&
    ('giscus' in router.query || router.query.target === 'comment')
  ) {
    setTimeout(() => {
      const url = router.asPath.replace('?target=comment', '')
      history.replaceState({}, '', url)
      document
        ?.getElementById('comment')
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }, 1000)
  }

  if (!frontMatter) {
    return null
  }

  if (isSearchEngineBot) {
    return null
  }

  if (frontMatter?.comment === 'Hide') {
    return null
  }

  const commentPanels = [
    COMMENT_ARTALK_SERVER && (
      <div key='Artalk'>
        <Artalk />
      </div>
    ),
    COMMENT_TWIKOO_ENV_ID && (
      <div key='Twikoo'>
        <TwikooCompenent />
      </div>
    ),
    COMMENT_WALINE_SERVER_URL && (
      <div key='Waline'>
        <WalineComponent />
      </div>
    ),
    COMMENT_VALINE_APP_ID && (
      <div key='Valine' name='reply'>
        <ValineComponent path={frontMatter.id} />
      </div>
    ),
    COMMENT_GISCUS_REPO && (
      <div key='Giscus'>
        <GiscusComponent className='px-2' />
      </div>
    ),
    COMMENT_CUSDIS_APP_ID && (
      <div key='Cusdis'>
        <CusdisComponent frontMatter={frontMatter} />
      </div>
    ),
    COMMENT_UTTERRANCES_REPO && (
      <div key='Utterance'>
        <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
      </div>
    ),
    COMMENT_GITALK_CLIENT_ID && (
      <div key='GitTalk'>
        <GitalkComponent frontMatter={frontMatter} />
      </div>
    ),
    COMMENT_WEBMENTION_ENABLE && (
      <div key='WebMention'>
        <WebMentionComponent frontMatter={frontMatter} className='px-2' />
      </div>
    )
  ].filter(Boolean)

  const loadingContent =
    loadingSlot || (variant === 'heo' ? <HeoLoadingState /> : <DefaultLoadingState />)

  return (
    <div
      key={frontMatter?.id}
      id='comment'
      ref={commentRef}
      className={`comment mt-5 text-gray-800 dark:text-gray-300 ${className || ''}`}>
      {!shouldLoad && loadingContent}

      {shouldLoad && (
        <Tabs
          className={variant === 'heo' ? 'mb-0' : ''}
          variant={tabsVariant}
          tabListClassName={tabsClassName}>
          {commentPanels}
        </Tabs>
      )}
    </div>
  )
}

const WalineComponent = dynamic(
  () => {
    return import('@/components/WalineComponent')
  },
  { ssr: false }
)

const CusdisComponent = dynamic(
  () => {
    return import('@/components/CusdisComponent')
  },
  { ssr: false }
)

const TwikooCompenent = dynamic(
  () => {
    return import('@/components/Twikoo')
  },
  { ssr: false }
)

const GitalkComponent = dynamic(
  () => {
    return import('@/components/Gitalk')
  },
  { ssr: false }
)
const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Utterances')
  },
  { ssr: false }
)
const GiscusComponent = dynamic(
  () => {
    return import('@/components/Giscus')
  },
  { ssr: false }
)
const WebMentionComponent = dynamic(
  () => {
    return import('@/components/WebMention')
  },
  { ssr: false }
)

const ValineComponent = dynamic(() => import('@/components/ValineComponent'), {
  ssr: false
})

export default Comment
