import Collapse from '@/components/Collapse'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const menuCardClassName =
  'heo-card w-full rounded-[1.35rem] p-0.5 transition-all duration-300 hover:-translate-y-0.5'

const menuTriggerClassName =
  'group flex items-center justify-between rounded-[1.05rem] px-3 py-2.5 text-sm font-medium tracking-[0.02em] transition-colors duration-300'

const menuIconClassName =
  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-300'

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = ({ link, accentColor = '#2563EB', isDarkMode = false }) => {
  const router = useRouter()
  const hasSubMenu = link?.subMenus?.length > 0

  const [isOpen, changeIsOpen] = useState(false)

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen)
  }

  if (!link || !link.show) {
    return null
  }

  const normalizePath = value => {
    if (!value) return '/'
    const path = String(value).split('?')[0].split('#')[0]
    return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
  }

  const currentPath = normalizePath(router.asPath || router.pathname)
  const linkPath = normalizePath(link?.href)
  const isActive =
    !!linkPath &&
    (currentPath === linkPath ||
      (linkPath !== '/' && currentPath.startsWith(`${linkPath}/`)))
  const hasActiveSubMenu = hasSubMenu
    ? link.subMenus.some(sLink => normalizePath(sLink?.href) === currentPath)
    : false
  const isHighlighted = isActive || hasActiveSubMenu
  const isExpanded = hasSubMenu ? isOpen : false

  useEffect(() => {
    if (hasSubMenu && hasActiveSubMenu) {
      changeIsOpen(true)
    }
  }, [hasSubMenu, hasActiveSubMenu, currentPath])

  const cardStyle = {
    borderColor: isHighlighted
      ? isDarkMode
        ? 'rgba(148,163,184,0.46)'
        : `color-mix(in srgb, ${accentColor} 16%, rgba(148,163,184,0.34))`
      : isDarkMode
        ? 'rgba(100,116,139,0.32)'
        : 'rgba(226,232,240,0.96)',
    background: isDarkMode ? 'rgba(30,41,59,0.82)' : 'rgba(255,255,255,0.985)',
    boxShadow: isHighlighted
      ? isDarkMode
        ? '0 10px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03)'
        : '0 12px 26px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.92)'
      : isDarkMode
        ? '0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.02)'
        : '0 6px 16px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.9)'
  }
  const getIconStyle = highlighted => ({
    background: highlighted
      ? isDarkMode
        ? 'rgba(71,85,105,0.9)'
        : 'rgba(239,246,255,0.96)'
      : isDarkMode
        ? 'rgba(51,65,85,0.88)'
        : 'rgba(239,246,255,0.9)',
    color: highlighted
      ? isDarkMode
        ? '#F8FAFC'
        : '#2563EB'
      : isDarkMode
        ? '#CBD5E1'
        : '#6480B9'
  })
  const childWrapStyle = {
    borderLeftColor: isDarkMode
      ? 'rgba(100,116,139,0.16)'
      : 'color-mix(in srgb, ' + accentColor + ' 8%, rgba(203,213,225,0.32))'
  }
  const textClassName = isHighlighted
    ? 'text-slate-900 dark:text-slate-50'
    : 'text-slate-700 dark:text-slate-100'
  const arrowStyle = isExpanded || isHighlighted ? { color: accentColor } : undefined

  return (
    <>
      <div
        style={cardStyle}
        className={menuCardClassName}>
        {!hasSubMenu && (
          <SmartLink
            href={link?.href}
            target={link?.target}
            className={`${menuTriggerClassName} no-underline ${textClassName}`}>
            <span className='flex min-w-0 items-center gap-3'>
              {link?.icon && (
                <span
                  style={getIconStyle(isHighlighted)}
                  className={menuIconClassName}>
                  <i className={link.icon} />
                </span>
              )}
              <span className='truncate'>{link?.name}</span>
            </span>
            <i style={arrowStyle} className='fas fa-angle-right text-[11px] text-slate-400 transition-colors duration-300'></i>
          </SmartLink>
        )}
        {hasSubMenu && (
          <div
            onClick={toggleOpenSubMenu}
            className={`${menuTriggerClassName} cursor-pointer ${textClassName}`}>
            <span className='flex min-w-0 items-center gap-3'>
              {link?.icon && (
                <span
                  style={getIconStyle(isHighlighted)}
                  className={menuIconClassName}>
                  <i className={link.icon} />
                </span>
              )}
              <span className='truncate'>{link?.name}</span>
            </span>
            <i
              style={arrowStyle}
              className={`select-none px-0.5 fas fa-chevron-right text-[11px] text-slate-400 transition-all duration-300 ${isExpanded ? 'rotate-90' : ''}`}></i>
          </div>
        )}
      </div>

      {hasSubMenu && (
        <Collapse isOpen={isExpanded} className='rounded-2xl'>
          <div
            style={childWrapStyle}
            className='ml-2 mt-2 space-y-2 border-l pl-2.5'
>
            {link.subMenus.map((sLink, index) => {
              const subActive = normalizePath(sLink?.href) === currentPath
              return (
                <div
                  key={index}
                  style={{
                    ...cardStyle,
                    background: isDarkMode ? 'rgba(30,41,59,0.78)' : 'rgba(255,255,255,0.88)',
                    borderColor: subActive
                      ? isDarkMode
                        ? 'rgba(148,163,184,0.3)'
                        : `color-mix(in srgb, ${accentColor} 12%, rgba(203,213,225,0.34))`
                      : isDarkMode
                        ? 'rgba(100,116,139,0.2)'
                        : 'rgba(226,232,240,0.72)',
                    boxShadow: subActive
                      ? isDarkMode
                        ? '0 8px 18px rgba(0,0,0,0.14)'
                        : '0 8px 18px rgba(15,23,42,0.05)'
                      : isDarkMode
                        ? '0 2px 6px rgba(0,0,0,0.06)'
                        : '0 2px 6px rgba(15,23,42,0.025)'
                  }}
                  className='heo-card rounded-[1.05rem] px-3 py-2.5 text-left transition-all duration-300'
>
                  <SmartLink href={sLink.href} target={link?.target}>
                    <span className={`flex items-center gap-3 text-sm ${subActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-100'}`}>
                      {sLink.icon && (
                        <span
                          style={getIconStyle(subActive)}
                          className='flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300'>
                          <i className={sLink.icon}></i>
                        </span>
                      )}
                      <span className='whitespace-nowrap'>{sLink.title}</span>
                    </span>
                  </SmartLink>
                </div>
              )
            })}
          </div>
        </Collapse>
      )}
    </>
  )
}
