import { siteConfig } from '@/lib/config'
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

  const router = useRouter()
  const slideOverRef = useRef()
  const isPostPage = Boolean(post)

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
        if (isPostPage) {
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
            setActiveIndex(1) // 向下滚动时设置activeIndex为1
          } else {
            setActiveIndex(0) // 向上滚动时设置activeIndex为0
          }
          prevScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])
  const hasPostBg = isPostPage

  useEffect(() => {
    const syncCompactMobileReadingNav = () => {
      if (!isBrowser) return
      const isSmallMobile = window.innerWidth <= 430
      const isPostPage = !!document.querySelector('#post-bg')
      setCompactMobileReadingNav(Boolean(isPostPage && isSmallMobile && window.scrollY > 48))
    }

    syncCompactMobileReadingNav()

    if (isBrowser) {
      window.addEventListener('scroll', syncCompactMobileReadingNav)
      window.addEventListener('resize', syncCompactMobileReadingNav)
    }

    return () => {
      if (isBrowser) {
        window.removeEventListener('scroll', syncCompactMobileReadingNav)
        window.removeEventListener('resize', syncCompactMobileReadingNav)
      }
    }
  }, [router.asPath])

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
                <i className='fas fa-bars' />
              </button>
            </div>
          </div>

          {/* 右边侧拉抽屉 */}
          <SlideOver cRef={slideOverRef} {...props} />
        </div>
      </nav>
    </>
  )
}

export default Header
