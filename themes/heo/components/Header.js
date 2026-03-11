import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import EyeCareButton from './EyeCareButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'

/**
 * 页头：顶部导航
 * @param {*} param0
 * @returns
 */
const Header = props => {
  const { post } = props
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [compactMobileReadingNav, setCompactMobileReadingNav] = useState(false)
  const [modeToast, setModeToast] = useState({ visible: false, message: '' })

  const { isDarkMode } = useGlobal()
  const router = useRouter()
  const slideOverRef = useRef()
  const isPostPage = Boolean(post)
  const isAboutPage = post?.slug === 'about'
  const hasPostBg = isPostPage && !isAboutPage

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }


  /**
   * 根据滚动条，切换导航栏样式
   */
  const scrollTrigger = useCallback(
    throttle(() => {
      const scrollS = window.scrollY
      // 导航栏设置 白色背景
      if (scrollS <= 1) {
        setFixedNav(false)
        setBgWhite(false)
        setTextWhite(false)

        // 文章详情页特殊处理
        if (hasPostBg) {
          setFixedNav(true)
          setTextWhite(true)
        }
      } else {

        // 向下滚动后的导航样式
        setFixedNav(true)
        setTextWhite(false)
        setBgWhite(true)
      }
    }, 100)
  )
  useEffect(() => {
    scrollTrigger()
  }, [router, scrollTrigger])

  // 监听滚动
  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [])

  // 导航栏根据滚动轮播菜单内容
  useEffect(() => {
    let prevScrollY = 0
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY > prevScrollY) {
            setActiveIndex(1)
          } else {
            setActiveIndex(0)
          }
          prevScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    const syncCompactMobileReadingNav = () => {
      if (!isBrowser) return
      const isSmallMobile = window.innerWidth <= 430
      const isPostBgPage = !!document.querySelector('#post-bg')
      setCompactMobileReadingNav(Boolean(isPostBgPage && isSmallMobile && window.scrollY > 48))
    }

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
      syncCompactMobileReadingNav()
      window.addEventListener('scroll', syncCompactMobileReadingNav)
      window.addEventListener('resize', syncCompactMobileReadingNav)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('scroll', syncCompactMobileReadingNav)
        window.removeEventListener('resize', syncCompactMobileReadingNav)
      }
    }
  }, [router.asPath])

  useEffect(() => {
    let timer = null

    const handleModeToast = event => {
      const message = event?.detail?.message
      if (!message) return
      setModeToast({ visible: true, message })
      if (timer) window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setModeToast(current => ({ ...current, visible: false }))
      }, 2200)
    }

    if (isBrowser) {
      window.addEventListener('heo-mode-toast', handleModeToast)
    }

    return () => {
      if (timer) window.clearTimeout(timer)
      if (isBrowser) {
        window.removeEventListener('heo-mode-toast', handleModeToast)
      }
    }
  }, [])

  const toastCardClassName = isDarkMode
    ? 'rounded-2xl border border-white/10 bg-slate-900/82 px-4 py-3 text-sm font-medium text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.34)] backdrop-blur-xl'
    : 'rounded-2xl border border-slate-200/80 bg-white/88 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_18px_45px_rgba(148,163,184,0.18)] backdrop-blur-xl'

  return (
    <>

      {/* fixed时留白高度 */}
      {fixedNav && !hasPostBg && (
        <div className='h-16'></div>
      )}

      {/* 顶部导航菜单栏 */}
      <nav
        id='nav'
        className={`heo-top-nav z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative bg-transparent'} 
            ${fixedNav ? 'fixed' : ''}
            ${hasPostBg ? 'heo-top-nav--post' : 'heo-top-nav--page'}
            ${navBgWhite ? 'heo-top-nav--floating' : 'heo-top-nav--flat'}
            ${compactMobileReadingNav ? 'heo-top-nav--mobile-compact' : ''}
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'} bg-transparent`}>
        <div className='heo-top-nav__inner flex h-full mx-auto items-center max-w-[86rem] px-6'>
          <div className='heo-top-nav__rail heo-top-nav__rail--brand flex items-center justify-start'>
            {/* 左侧logo */}
            <div className={`heo-top-nav__brand hidden lg:flex ${compactMobileReadingNav ? 'heo-top-nav__brand--compact-hidden' : ''}`}>
              <Logo {...props} />
            </div>
            <div className={`heo-top-nav__brand heo-top-nav__brand--mobile flex lg:hidden ${compactMobileReadingNav ? 'heo-top-nav__brand--compact-hidden' : 'heo-top-nav__brand--mobile-compact'}`}>
              <Logo {...props} />
            </div>
          </div>

          {/* 中间菜单 */}
          <div
            id='nav-bar-swipe'
            className='heo-top-nav__center hidden lg:flex flex-1 flex-col items-center justify-center h-full relative min-w-0'>
            <div
              className={`absolute transition-all duration-700 ${activeIndex === 0 ? 'opacity-100 mt-0' : '-mt-20 opacity-0 invisible'}`}>
              <MenuListTop {...props} />
            </div>
            <div
              className={`heo-top-nav__headline absolute transition-all duration-700 ${activeIndex === 1 ? 'opacity-100 mb-0' : '-mb-20 opacity-0 invisible'}`}>
              <div className='heo-top-nav__headline-pill' title={hasPostBg ? (post?.title || siteConfig('TITLE')) : undefined}>
                <h1 className='font-bold text-center text-light-400 dark:text-gray-400'>
                  {hasPostBg ? (post?.title || siteConfig('TITLE')) : (
                    <>
                      {siteConfig('AUTHOR') || siteConfig('TITLE')}{' '}
                      {siteConfig('BIO') && <>|</>} {siteConfig('BIO')}
                    </>
                  )}
                </h1>
              </div>
            </div>
          </div>

          <div className='heo-top-nav__rail heo-top-nav__rail--actions flex items-center justify-end'>
            {/* 右侧固定 */}
            <div className='heo-header-action-group heo-header-action-group--desktop hidden lg:flex'>
              <RandomPostButton {...props} />
              <SearchButton {...props} />
              <EyeCareButton />
              {!JSON.parse(siteConfig('THEME_SWITCH')) && <DarkModeButton {...props} />}
              <ReadingProgress />
            </div>

            <div className={`heo-header-action-group heo-header-action-group--mobile flex lg:hidden ${compactMobileReadingNav ? 'heo-header-action-group--mobile-compact' : ''}`}>
              {!compactMobileReadingNav && <RandomPostButton {...props} />}
              <SearchButton {...props} />
              {!compactMobileReadingNav && <ReadingProgress />}
              <button
                type='button'
                onClick={toggleMenuOpen}
                aria-label='打开菜单'
                title='打开菜单'
                className='heo-header-action-btn heo-header-action-btn--menu'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  aria-hidden='true'>
                  <path d='M4 7h16' />
                  <path d='M4 12h16' />
                  <path d='M4 17h16' />
                </svg>
              </button>
            </div>
          </div>

          {/* 右边侧拉抽屉 */}
          <SlideOver cRef={slideOverRef} {...props} />
        </div>
      </nav>

      <div
        className={`pointer-events-none fixed left-1/2 z-40 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-md ${modeToast.visible ? 'bottom-5 opacity-100 blur-0 sm:bottom-6' : 'bottom-3 opacity-0 blur-[6px]'}`}>
        <div className={`${toastCardClassName} transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${modeToast.visible ? 'translate-y-0 scale-100' : 'translate-y-2 scale-[0.985]'}`}>
          {modeToast.message}
        </div>
      </div>
    </>
  )
}

export default Header
