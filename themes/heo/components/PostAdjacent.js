import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

const adjacentFocusClassName =
  'focus:outline-none focus:ring-1 focus:ring-blue-300/45 focus:ring-offset-2 focus:ring-offset-white focus:border-blue-200/80 focus:bg-blue-50/[0.72] dark:focus:ring-orange-300/28 dark:focus:ring-offset-[#1f2026] dark:focus:border-orange-300/20 dark:focus:bg-orange-300/[0.06] focus-visible:ring-2 focus-visible:ring-blue-400/55 focus-visible:border-blue-300/85 focus-visible:bg-blue-50/[0.88] dark:focus-visible:ring-orange-300/45 dark:focus-visible:border-orange-300/35 dark:focus-visible:bg-orange-300/[0.1]'

const adjacentInlineCardClassName =
  'group flex min-w-0 flex-1 items-center justify-between rounded-[1.45rem] border border-slate-200/80 bg-white/96 px-4 py-4 text-slate-700 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/90 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/60 dark:bg-[#1f2026] dark:text-slate-100 dark:hover:border-slate-600/80'

const adjacentCardClassName =
  'heo-post-adjacent-card group relative flex min-h-[11.5rem] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/96 p-5 text-slate-700 shadow-[0_15px_36px_rgba(15,23,42,0.055)] transition-all duration-300 hover:-translate-y-0.5 dark:border-slate-700/55 dark:bg-[#1f2026] dark:text-slate-100'

const pcNextPostClassName =
  'group relative block w-80 overflow-hidden rounded-[1.55rem] border border-slate-200/75 bg-white/94 p-4 text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/75 hover:shadow-[0_18px_38px_rgba(15,23,42,0.13)] dark:border-slate-700/50 dark:bg-[#1f2026]/90 dark:text-slate-200 dark:hover:border-slate-600/65'

function AdjacentInlineCard({ href, label, title, align = 'left' }) {
  const isRight = align === 'right'

  return (
    <SmartLink
      href={href}
      passHref
      className={`${adjacentInlineCardClassName} ${adjacentFocusClassName} ${isRight ? 'text-right' : ''}`}>
      {!isRight && (
        <i className='fas fa-chevron-left mr-3 shrink-0 text-[0.7rem] text-slate-300 transition-colors duration-300 group-hover:text-slate-500 group-focus:text-blue-500 group-focus-visible:text-blue-500 group-active:text-blue-500 dark:text-slate-600 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 dark:group-active:text-orange-300 dark:group-hover:text-slate-400' />
      )}

      <div className='min-w-0 flex-1'>
        <div
          className={`flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400 transition-colors duration-300 group-focus:text-blue-500 group-focus-visible:text-blue-500 dark:text-slate-500 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 ${isRight ? 'justify-end' : ''}`}>
          {!isRight && <i className='fas fa-arrow-left text-[0.65rem]' />}
          <span>{label}</span>
          {isRight && <i className='fas fa-arrow-right text-[0.65rem]' />}
        </div>
        <div className='mt-2 truncate text-[0.95rem] font-semibold leading-6 text-slate-800 transition-colors duration-300 group-hover:text-slate-950 group-focus:text-blue-700 group-focus-visible:text-blue-700 group-active:text-blue-700 dark:text-slate-100 dark:group-hover:text-white dark:group-focus:text-orange-200 dark:group-focus-visible:text-orange-200 dark:group-active:text-orange-200'>
          {title}
        </div>
      </div>

      {isRight && (
        <i className='fas fa-chevron-right ml-3 shrink-0 text-[0.7rem] text-slate-300 transition-colors duration-300 group-hover:text-slate-500 group-focus:text-blue-500 group-focus-visible:text-blue-500 group-active:text-blue-500 dark:text-slate-600 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 dark:group-active:text-orange-300 dark:group-hover:text-slate-400' />
      )}
    </SmartLink>
  )
}

function AdjacentCard({ href, label, title, cover, align = 'left' }) {
  const isRight = align === 'right'

  return (
    <SmartLink
      href={href}
      passHref
      className={`${adjacentCardClassName} ${adjacentFocusClassName}`}>
      <div
        className={`relative z-10 flex min-w-0 flex-1 flex-col justify-between ${
          cover
            ? isRight
              ? 'text-right lg:pr-[7.5rem]'
              : 'lg:pl-[7.5rem]'
            : isRight
              ? 'text-right'
              : ''
        }`}>
        <div
          className={`flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 transition-colors duration-300 group-focus:text-blue-500 group-focus-visible:text-blue-500 dark:text-slate-500 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 ${isRight ? 'justify-end' : ''}`}>
          {!isRight && <i className='fas fa-arrow-left text-[0.7rem]' />}
          <span>{label}</span>
          {isRight && <i className='fas fa-arrow-right text-[0.7rem]' />}
        </div>
        <div className='space-y-3'>
          <div className='heo-post-adjacent-card__title line-clamp-2 text-xl font-semibold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-slate-900 group-focus:text-blue-700 group-focus-visible:text-blue-700 group-active:text-blue-700 dark:text-slate-100 dark:group-hover:text-white dark:group-focus:text-orange-200 dark:group-focus-visible:text-orange-200 dark:group-active:text-orange-200'>
            {title}
          </div>
          <div
            className={`heo-post-adjacent-card__cta flex items-center gap-2 text-sm text-slate-500 transition-all duration-300 group-hover:text-slate-700 group-focus:text-blue-600 group-focus-visible:text-blue-600 dark:text-slate-400 dark:group-hover:text-slate-300 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 ${isRight ? 'justify-end' : ''}`}>
            <span>继续阅读</span>
            <i
              className={`fas ${isRight ? 'fa-arrow-up-right-from-square' : 'fa-arrow-right'} text-xs`} />
          </div>
        </div>
      </div>

      {cover && (
        <div
          className={`pointer-events-none absolute top-4 z-0 hidden h-[5.5rem] w-[6rem] overflow-hidden rounded-[1.25rem] border border-white/22 bg-slate-100/58 backdrop-blur-[2px] dark:border-white/6 dark:bg-slate-800/30 lg:block ${isRight ? 'right-4' : 'left-4'}`}>
          <LazyImage
            src={cover}
            className='absolute inset-0 h-full w-full object-cover object-center opacity-62 saturate-[0.86] transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-white/52 via-white/24 to-white/34 dark:from-[#1f2026]/30 dark:via-transparent dark:to-[#1f2026]/26' />
        </div>
      )}
    </SmartLink>
  )
}

/**
 * 上一篇，下一篇文章
 * @param {prev,next} param0
 * @returns
 */
export default function PostAdjacent({ prev, next }) {
  const [isShow, setIsShow] = useState(false)
  const router = useRouter()
  const { locale } = useGlobal()

  useEffect(() => {
    setIsShow(false)
  }, [router])

  useEffect(() => {
    if (!next) {
      setIsShow(false)
      return
    }

    const articleEnd = document.getElementById('article-end')
    const footerBottom = document.getElementById('footer-bottom')

    const handleIntersect = entries => {
      entries.forEach(entry => {
        if (entry.target === articleEnd) {
          if (entry.isIntersecting) {
            setIsShow(true)
          }
        } else if (entry.target === footerBottom) {
          if (entry.isIntersecting) {
            setIsShow(false)
          }
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    })

    if (articleEnd) observer.observe(articleEnd)
    if (footerBottom) observer.observe(footerBottom)

    return () => {
      if (articleEnd) observer.unobserve(articleEnd)
      if (footerBottom) observer.unobserve(footerBottom)
      observer.disconnect()
    }
  }, [next])

  if (!siteConfig('HEO_ARTICLE_ADJACENT', null, CONFIG) || (!prev && !next)) {
    return <></>
  }

  const prevLabel = locale?.COMMON?.PREV_POST || '上一篇'
  const nextLabel = locale?.COMMON?.NEXT_POST || '下一篇'

  const adjacentItems = useMemo(
    () => [
      prev && {
        href: `/${prev.slug}`,
        label: prevLabel,
        title: prev.title,
        cover: prev?.pageCoverThumbnail || prev?.pageCover || null,
        align: 'left'
      },
      next && {
        href: `/${next.slug}`,
        label: nextLabel,
        title: next.title,
        cover: next?.pageCoverThumbnail || next?.pageCover || null,
        align: 'right'
      }
    ].filter(Boolean),
    [next, nextLabel, prev, prevLabel]
  )

  const sectionTitle =
    adjacentItems.length > 1
      ? '继续阅读下一篇内容'
      : next
        ? '继续阅读下一篇内容'
        : '回看上一篇内容'

  return (
    <section id='article-end' className='heo-post-footer__adjacent space-y-4'>
      <div className='px-1'>
        <div className='text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500'>
          Continue Reading
        </div>
        <div className='mt-1 text-[1.7rem] font-semibold leading-tight text-slate-800 dark:text-slate-100 sm:text-2xl'>
          {sectionTitle}
        </div>
      </div>

      <div className={`grid gap-3 lg:hidden ${adjacentItems.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {adjacentItems.map(item => (
          <AdjacentInlineCard
            key={item.href}
            href={item.href}
            label={item.label}
            title={item.title}
            align={item.align}
          />
        ))}
      </div>

      <div className={`hidden gap-4 lg:grid ${adjacentItems.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {adjacentItems.map(item => (
          <AdjacentCard
            key={item.href}
            href={item.href}
            label={item.label}
            title={item.title}
            cover={item.cover}
            align={item.align}
          />
        ))}
      </div>

      {next && (
        <div
          id='pc-next-post'
          className={`${isShow ? 'translate-y-0 opacity-[0.9]' : 'translate-y-8 opacity-0 pointer-events-none'} hidden xl:block fixed z-40 right-8 bottom-6 transition-all duration-300`}>
          <SmartLink
            href={`/${next.slug}`}
            className={`${pcNextPostClassName} ${adjacentFocusClassName}`}>
            {next?.pageCoverThumbnail || next?.pageCover ? (
              <div className='pointer-events-none absolute right-4 top-4 h-[4.5rem] w-[5rem] overflow-hidden rounded-[1.1rem] border border-white/22 bg-slate-100/58 backdrop-blur-[2px] dark:border-white/6 dark:bg-slate-800/30'>
                <LazyImage
                  src={next?.pageCoverThumbnail || next?.pageCover}
                  className='absolute inset-0 h-full w-full object-cover object-center opacity-56 saturate-[0.82] transition-transform duration-500 group-hover:scale-[1.03]'
                />
                <div className='absolute inset-0 bg-gradient-to-br from-white/52 via-white/24 to-white/34 dark:from-[#1f2026]/30 dark:via-transparent dark:to-[#1f2026]/26' />
              </div>
            ) : null}
            <div className='relative z-10 flex items-center justify-between pr-[5.75rem] text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-400 transition-colors duration-300 group-focus:text-blue-500 group-focus-visible:text-blue-500 group-active:text-blue-500 dark:text-slate-500 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 dark:group-active:text-orange-300'>
              <span>{nextLabel}</span>
              <i className='fas fa-arrow-right text-[0.7rem]' />
            </div>
            <div className='relative z-10 mt-3 line-clamp-2 pr-[5.75rem] text-base font-semibold leading-7 text-slate-800 transition-colors duration-300 group-hover:text-slate-950 group-focus:text-blue-700 group-focus-visible:text-blue-700 dark:text-slate-100 dark:group-hover:text-white dark:group-focus:text-orange-200 dark:group-focus-visible:text-orange-200'>
              {next?.title}
            </div>
            <div className='relative z-10 mt-3 flex items-center gap-2 text-sm text-slate-500 transition-colors duration-300 group-hover:text-slate-700 group-focus:text-blue-600 group-focus-visible:text-blue-600 group-active:text-blue-600 dark:text-slate-400 dark:group-hover:text-slate-300 dark:group-focus:text-orange-300 dark:group-focus-visible:text-orange-300 dark:group-active:text-orange-300'>
              <span>继续阅读</span>
              <i className='fas fa-arrow-up-right-from-square text-xs' />
            </div>
          </SmartLink>
        </div>
      )}
    </section>
  )
}
