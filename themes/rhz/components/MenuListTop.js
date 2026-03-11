import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuListTop = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX,
      href: '/',
      show: siteConfig('RHZ_MENU_INDEX', null, CONFIG)
    },
    {
      id: 2,
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('RHZ_MENU_SEARCH', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('RHZ_MENU_ARCHIVE', null, CONFIG)
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav
      id='nav-mobile'
      aria-label='顶部导航'
      className='heo-nav-menu flex w-full items-center justify-center gap-2 leading-8 font-light'>
      {links?.map(
        (link, index) =>
          link && link.show && <MenuItemDrop key={link.id || index} link={link} />
      )}
    </nav>
  )
}
