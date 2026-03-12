import { Children, useState } from 'react'
import { siteConfig } from '@/lib/config'

/**
 * Tabs切换标签
 * @param {*} param0
 * @returns
 */
const Tabs = ({
  className,
  children,
  variant = 'default',
  tabListClassName = '',
  tabItemClassName = '',
  activeTabItemClassName = '',
  panelClassName = ''
}) => {
  const [currentTab, setCurrentTab] = useState(0)
  const validChildren = Children.toArray(children).filter(Boolean)

  if (validChildren.length === 0) {
    return <></>
  }

  const isHeoComment = variant === 'comment-heo'
  const tabListBaseClass = isHeoComment
    ? 'mb-4 flex w-full flex-wrap items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2 dark:border-slate-700/60 dark:bg-slate-900/40'
    : 'flex justify-center space-x-5 overflow-auto pb-4 text-gray-600 dark:text-gray-400'
  const tabItemBaseClass = isHeoComment
    ? 'cursor-pointer rounded-xl border border-transparent px-3 py-2 text-xs font-medium tracking-[0.08em] text-slate-500 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800/80 dark:hover:text-slate-200'
    : 'cursor-pointer text-sm font-sans font-extralight'
  const activeTabBaseClass = isHeoComment
    ? 'border-slate-200 bg-white text-slate-800 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
    : 'animate__animated animate__jello border-b-2 border-red-600 font-black text-red-600'
  const panelBaseClass = isHeoComment ? 'duration-200' : ''

  const getTabLabel = item => {
    const explicitLabel = item?.props?.['data-tab-title']
    if (explicitLabel) return explicitLabel
    if (typeof item?.key === 'string') {
      return item.key.replace(/^\.?\$+/, '')
    }
    return item?.key ?? ''
  }

  return (
    <div className={`mb-5 duration-200 ${className || ''}`}>
      {!(validChildren.length === 1 && siteConfig('COMMENT_HIDE_SINGLE_TAB')) && (
        <ul className={`${tabListBaseClass} ${tabListClassName}`.trim()}>
          {validChildren.map((item, index) => {
            const isActive = currentTab === index
            return (
              <li key={index}>
                <button
                  type='button'
                  className={`${tabItemBaseClass} ${tabItemClassName} ${isActive ? `${activeTabBaseClass} ${activeTabItemClassName}` : ''}`.trim()}
                  onClick={() => setCurrentTab(index)}>
                  {getTabLabel(item)}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <div>
        {validChildren.map((item, index) => (
          <section
            key={index}
            className={`${panelBaseClass} ${panelClassName} ${currentTab === index ? 'static h-auto opacity-100' : 'pointer-events-none absolute h-0 overflow-hidden opacity-0'}`.trim()}>
            {item}
          </section>
        ))}
      </div>
    </div>
  )
}

export default Tabs
