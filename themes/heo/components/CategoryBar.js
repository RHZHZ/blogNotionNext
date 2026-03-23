import { ChevronDoubleLeft, ChevronDoubleRight } from '@/components/HeroIcons'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

const normalizePath = path => {
  if (!path) return '/'
  const cleanPath = String(path).split('?')[0].split('#')[0]
  return cleanPath !== '/' && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath
}

const stripBasePath = (path, basePath) => {
  const normalizedPath = normalizePath(path)
  const normalizedBasePath = normalizePath(basePath)

  if (!normalizedBasePath || normalizedBasePath === '/') return normalizedPath
  if (normalizedPath === normalizedBasePath) return '/'
  if (normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath.slice(normalizedBasePath.length) || '/'
  }

  return normalizedPath
}

/**
 * 博客列表上方嵌入条
 * @param {*} props
 * @returns
 */
export default function CategoryBar(props) {
  const { categoryOptions, border = true } = props
  const { locale } = useGlobal()
  const [scrollRight, setScrollRight] = useState(false)
  const categoryBarItemsRef = useRef(null)

  const handleToggleScroll = () => {
    if (categoryBarItemsRef.current) {
      const { scrollWidth, clientWidth } = categoryBarItemsRef.current
      if (scrollRight) {
        categoryBarItemsRef.current.scrollLeft = 0
      } else {
        categoryBarItemsRef.current.scrollLeft = scrollWidth - clientWidth
      }
      setScrollRight(!scrollRight)
    }
  }

  return (
    <div
      id='category-bar'
      style={
        border
          ? undefined
          : {
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none'
            }
      }
      className={`wow fadeInUp mb-4 flex h-auto min-h-[3.5rem] w-full items-center justify-between gap-2 rounded-[1.75rem] py-2 transition-all duration-300 ${border ? 'px-2.5' : 'px-0'}`}>
      <div
        id='category-bar-items'
        ref={categoryBarItemsRef}
        className='scroll-hidden flex max-w-4xl flex-1 items-center gap-1 overflow-x-auto scroll-smooth'>
        <MenuItem href='/' name={locale.NAV.INDEX} />
        {categoryOptions?.map((c, index) => (
          <MenuItem key={index} href={`/category/${c.name}`} name={c.name} />
        ))}
      </div>

      <div id='category-bar-next' className='flex flex-shrink-0 items-center gap-1'>
        <button
          id='right'
          type='button'
          className='inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/35 dark:border-slate-700/40 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-slate-100 dark:focus-visible:ring-amber-400/30'
          onClick={handleToggleScroll}>
          {scrollRight ? (
            <ChevronDoubleLeft className='h-4 w-4' />
          ) : (
            <ChevronDoubleRight className='h-4 w-4' />
          )}
        </button>
        <SmartLink
          href='/category'
          style={{
            borderColor: 'var(--heo-category-action-border)',
            background: 'var(--heo-category-action-bg)',
            color: 'var(--heo-category-action-text)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
            backdropFilter: 'saturate(170%) blur(16px)',
            WebkitBackdropFilter: 'saturate(170%) blur(16px)'
          }}
          className='inline-flex h-9 items-center rounded-[1.1rem] border px-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-200'>

          {locale.MENU.CATEGORY}
        </SmartLink>
      </div>
    </div>
  )
}

/**
 * 按钮
 * @param {*} param0
 * @returns
 */
const MenuItem = ({ href, name }) => {
  const router = useRouter()
  const subPath = siteConfig('SUB_PATH', '')
  const pathname = normalizePath(router.pathname)
  const currentPath = stripBasePath(router.asPath || router.pathname, subPath)
  const targetPath = stripBasePath(href, subPath)
  const currentCategory = Array.isArray(router.query.category)
    ? router.query.category[0]
    : router.query.category

  const selected =
    targetPath === '/'
      ? pathname === '/' || currentPath === '/'
      : pathname === '/category/[category]' || pathname === '/category/[category]/page/[page]'
        ? decodeURIComponent(currentCategory || '') === name
        : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)

  return (
    <SmartLink
      href={href}
      style={{
        borderColor: selected
          ? 'var(--heo-category-chip-selected-border)'
          : 'var(--heo-category-chip-border)',
        background: selected
          ? 'var(--heo-category-chip-selected-bg)'
          : 'var(--heo-category-chip-bg)',
        color: selected
          ? 'var(--heo-category-chip-selected-text)'
          : 'var(--heo-category-chip-text)',
        boxShadow: selected
          ? 'var(--heo-category-chip-selected-shadow)'
          : 'inset 0 1px 0 rgba(255, 255, 255, 0.66)'
      }}
      className={`category-bar-item inline-flex flex-shrink-0 items-center rounded-xl border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 ${
        selected ? 'selected' : ''
      }`}>
      {name}
    </SmartLink>
  )
}
