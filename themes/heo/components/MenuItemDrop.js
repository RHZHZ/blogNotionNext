import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0
  const router = useRouter()

  const normalizePath = p => {
    if (!p) return ''
    const path = p.split('?')[0].split('#')[0]
    return path.length > 1 ? path.replace(/\/+$/, '') : path
  }

  const isActive = href => {
    if (!href || typeof href !== 'string') return false
    if (href.startsWith('http')) return false
    const current = normalizePath(router.asPath || router.pathname || '')
    const target = normalizePath(href)
    if (target === '/') return current === '/'
    return current === target || current.startsWith(target + '/')
  }

  const active = isActive(link?.href)

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {/* 不含子菜单 */}
      {!hasSubMenu && (
        <SmartLink
          target={link?.target}
          href={link?.href}
          className={`hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest ${active ? 'active' : ''}`}
          aria-current={active ? 'page' : undefined}>
          {link?.icon && <i className={link?.icon} />} {link?.name}
        </SmartLink>
      )}
      {/* 含子菜单的按钮 */}
      {hasSubMenu && (
        <>
          <div className={`cursor-pointer hover:bg-black hover:bg-opacity-10 rounded-2xl flex justify-center items-center px-3 py-1 no-underline tracking-widest relative ${active ? 'active' : ''}`}
               aria-current={active ? 'page' : undefined}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
            {/* 主菜单下方的安全区域 */}
            {show && (
              <div className='absolute w-full h-8 -bottom-8 left-0 bg-transparent z-30'></div>
            )}
          </div>
        </>
      )}
      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
          style={{ backdropFilter: 'blur(3px)' }}
          className={`${show ? 'visible opacity-100 top-14 pointer-events-auto' : 'invisible opacity-0 top-20 pointer-events-none'} drop-shadow-md overflow-hidden rounded-xl bg-white dark:bg-[#1e1e1e] transition-all duration-300 z-20 absolute`}>
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='cursor-pointer hover:bg-blue-600 dark:hover:bg-yellow-600 hover:text-white text-gray-900 dark:text-gray-100  tracking-widest transition-all duration-200 py-1 pr-6 pl-3'>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
