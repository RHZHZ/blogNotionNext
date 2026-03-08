import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

const normalizePath = value => {
  if (!value) return '/'
  const path = String(value).split('?')[0].split('#')[0]
  return path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path
}

const isPathMatch = (currentPath, targetPath) => {
  if (!targetPath) return false
  if (targetPath === '/') return currentPath === '/'
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
}

export const MenuItemDrop = ({ link }) => {
  const router = useRouter()
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const currentPath = normalizePath(router.asPath || router.pathname)
  const linkPath = normalizePath(link?.href)
  const isHomePage = currentPath === '/'
  const isActive = hasSubMenu
    ? false
    : !isHomePage && isPathMatch(currentPath, linkPath)
  const hasActiveSubMenu = hasSubMenu
    ? link.subMenus.some(sLink => {
      const subPath = normalizePath(sLink?.href)
      return subPath !== '/' && !isHomePage && isPathMatch(currentPath, subPath)
    })
    : false
  const isHighlighted = hasSubMenu ? hasActiveSubMenu : isActive

  const subMenuId = useMemo(
    () => `heo-nav-submenu-${String(link?.id || link?.name || 'item').replace(/\s+/g, '-').toLowerCase()}`,
    [link?.id, link?.name]
  )

  if (!link || !link.show) {
    return null
  }

  const handleOpen = () => changeShow(true)
  const handleClose = () => changeShow(false)

  return (
    <div
      className='heo-nav-menu__item relative flex items-center'
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}>
      {!hasSubMenu && (
        <SmartLink
          target={link?.target}
          href={link?.href}
          aria-current={isHighlighted ? 'page' : undefined}
          className={`heo-nav-menu__link ${isHighlighted ? 'active' : ''}`}>
          {link?.icon && <i className={`${link.icon} heo-nav-menu__icon`} />}
          <span className='heo-nav-menu__label'>{link?.name}</span>
        </SmartLink>
      )}

      {hasSubMenu && (
        <>
          <button
            type='button'
            aria-haspopup='menu'
            aria-expanded={show}
            aria-controls={subMenuId}
            aria-current={isHighlighted ? 'page' : undefined}
            className={`heo-nav-menu__trigger ${isHighlighted ? 'active' : ''}`}
            onClick={() => changeShow(prev => !prev)}
            onFocus={handleOpen}
            onBlur={() => setTimeout(handleClose, 120)}>
            {link?.icon && <i className={`${link.icon} heo-nav-menu__icon`} />}
            <span className='heo-nav-menu__label'>{link?.name}</span>
            <i className={`fas fa-chevron-down heo-nav-menu__chevron ${show ? 'is-open' : ''}`} />
          </button>

          <ul
            id={subMenuId}
            role='menu'
            className={`heo-nav-submenu ${show ? 'is-open' : ''}`}>
            {link.subMenus.map((sLink, index) => {
              const subPath = normalizePath(sLink?.href)
              const subActive = subPath !== '/' && !isHomePage && isPathMatch(currentPath, subPath)

              return (
                <li key={index} role='none' className='heo-nav-submenu__item'>
                  <SmartLink
                    href={sLink.href}
                    target={link?.target}
                    role='menuitem'
                    aria-current={subActive ? 'page' : undefined}
                    className={`heo-nav-submenu__link ${subActive ? 'active' : ''}`}>
                    {sLink?.icon && <i className={`${sLink.icon} heo-nav-submenu__icon`} />}
                    <span className='heo-nav-submenu__label'>{sLink.title}</span>
                  </SmartLink>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
