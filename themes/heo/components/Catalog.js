import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 目录导航组件
 * @param toc
 * @returns {JSX.Element}
 * @constructor
 */
const Catalog = ({ toc, showHeader = true, variant = 'default' }) => {
  const { locale, isDarkMode } = useGlobal()
  // 监听滚动事件
  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy)
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
    }
  }, [])

  // 目录自动滚动
  const tRef = useRef(null)
  const tocIds = []

  // 同步选中目录事件
  const [activeSection, setActiveSection] = useState(null)

  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = activeSection
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        // GetBoundingClientRect returns values relative to viewport
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        // No need to continue loop, if last element has been detected
        break
      }
      setActiveSection(currentSectionId)
      const index = tocIds.indexOf(currentSectionId) || 0
      tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
    }, 200)
  )

  // 无目录就直接返回空
  if (!toc || toc.length < 1) {
    return <></>
  }

  const isDrawerVariant = variant === 'drawer'

  return (
    <div className={`heo-catalog ${isDrawerVariant ? 'heo-catalog--drawer' : ''} px-3 py-1 dark:text-white text-black`}>
      {showHeader && (
        <div className='w-full'>
          <i className='mr-1 fas fa-stream' />
          {locale.COMMON.TABLE_OF_CONTENTS}
        </div>
      )}
      <div
        className={`heo-catalog__scroll overflow-y-auto overscroll-none scroll-hidden ${isDrawerVariant ? 'heo-catalog__scroll--drawer max-h-[min(50vh,24rem)] pr-1' : 'max-h-36 lg:max-h-96 pr-1'}`}
        ref={tRef}>
        <nav className={isDrawerVariant ? 'flex flex-col gap-1.5' : 'h-full'}>
          {toc?.map(tocItem => {
            const id = uuidToId(tocItem.id)
            const isActive = activeSection === id
            tocIds.push(id)
            const itemStyle = isDrawerVariant
              ? {
                  marginLeft: `${tocItem.indentLevel * 14}px`,
                  width: `calc(100% - ${tocItem.indentLevel * 14}px - 0.4rem)`,
                  boxSizing: 'border-box',
                  borderColor: isActive
                    ? isDarkMode
                      ? 'rgba(96,165,250,0.26)'
                      : 'rgba(191,219,254,0.9)'
                    : isDarkMode
                      ? 'rgba(71,85,105,0.18)'
                      : 'rgba(226,232,240,0.92)',
                  background: isActive
                    ? isDarkMode
                      ? 'rgba(30,58,138,0.22)'
                      : 'rgba(239,246,255,0.92)'
                    : isDarkMode
                      ? 'rgba(15,23,42,0.18)'
                      : 'rgba(255,255,255,0.82)',
                  boxShadow: isActive
                    ? isDarkMode
                      ? '0 10px 24px rgba(0,0,0,0.14)'
                      : '0 10px 24px rgba(59,130,246,0.08)'
                    : 'none'
                }
              : undefined
            const textStyle = isDrawerVariant
              ? {
                  color: isActive
                    ? isDarkMode
                      ? '#93C5FD'
                      : '#6366F1'
                    : isDarkMode
                      ? '#E2E8F0'
                      : '#334155'
                }
              : {
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 16
                }

            return (
              <a
                key={id}
                href={`#${id}`}
                style={itemStyle}
                className={`notion-table-of-contents-item notion-table-of-contents-item-indent-level-${tocItem.indentLevel} duration-300 transform ${isDrawerVariant ? 'block rounded-2xl border px-3 py-2.5 no-underline' : 'catalog-item dark:text-gray-200'}`}>
                <span
                  style={textStyle}
                  className={`truncate ${isDrawerVariant ? 'block text-[15px] leading-7 font-medium' : activeSection === id ? 'font-bold text-indigo-600' : ''}`}>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
