import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { MenuItemCollapse } from './MenuItemCollapse'

export const MenuListSide = props => {
  const { customNav, customMenu, accentColor, isDarkMode } = props
  const { locale } = useGlobal()

  let links = [
    {
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('RHZ_MENU_ARCHIVE', null, CONFIG)
    },
    {
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('RHZ_MENU_SEARCH', null, CONFIG)
    },
    {
      icon: 'fas fa-folder',
      name: locale.COMMON.CATEGORY,
      href: '/category',
      show: siteConfig('RHZ_MENU_CATEGORY', null, CONFIG)
    },
    {
      icon: 'fas fa-tag',
      name: locale.COMMON.TAGS,
      href: '/tag',
      show: siteConfig('RHZ_MENU_TAG', null, CONFIG)
    }
  ]

  if (customNav) {
    links = customNav.concat(links)
  }

  if (siteConfig('CUSTOM_MENU')) {
    links = customMenu
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav className='flex flex-col gap-1.5'>
      {links?.map((link, index) => (
        <MenuItemCollapse
          key={index}
          link={link}
          accentColor={accentColor}
          isDarkMode={isDarkMode}
        />
      ))}
    </nav>
  )
}
