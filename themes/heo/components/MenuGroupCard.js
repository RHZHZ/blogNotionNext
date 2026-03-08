import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const MenuGroupCard = props => {
  const { postCount, categoryOptions, tagOptions } = props
  const { locale } = useGlobal()
  const archiveSlot = <div className='text-center'>{postCount}</div>
  const categorySlot = (
    <div className='text-center'>{categoryOptions?.length}</div>
  )
  const tagSlot = <div className='text-center'>{tagOptions?.length}</div>

  const links = [
    {
      name: locale.COMMON.ARTICLE,
      href: '/archive',
      slot: archiveSlot,
      show: siteConfig('HEO_MENU_ARCHIVE', null, CONFIG)
    },
    {
      name: locale.COMMON.CATEGORY,
      href: '/category',
      slot: categorySlot,
      show: siteConfig('HEO_MENU_CATEGORY', null, CONFIG)
    },
    {
      name: locale.COMMON.TAGS,
      href: '/tag',
      slot: tagSlot,
      show: siteConfig('HEO_MENU_TAG', null, CONFIG)
    }
  ]

  return (
    <nav className='heo-menu-group-card heo-card w-full px-3 py-3'>
      <div className='heo-menu-group-card__list flex flex-col gap-2'>
        {links.map((link, index) => {
          if (link.show) {
            return (
              <SmartLink
                key={index}
                title={link.href}
                href={link.href}
                target={link?.target}
                className='heo-menu-group-card__link w-full flex items-center justify-between px-3 py-2'>
                <span className='heo-menu-group-card__label'>{link.name}</span>
                <span className='heo-menu-group-card__count font-semibold'>{link.slot}</span>
              </SmartLink>
            )
          }
          return null
        })}
      </div>
    </nav>
  )
}
export default MenuGroupCard
