import { siteConfig } from '@/lib/config'
import LazyImage from '@/components/LazyImage'
import { useRouter } from 'next/router'
import MenuGroupCard from './MenuGroupCard'
import { MenuListSide } from './MenuListSide'

/**
 * 侧边抽屉
 * @param tags
 * @param currentTag
 * @returns {JSX.Element}
 * @constructor
 */
const SideBar = (props) => {
  const { siteInfo } = props
  const router = useRouter()
  return (
    <div id='side-bar' className='heo-sidebar-panel'>
      <div className='heo-sidebar-panel__brand-wrap'>
        <button
          type='button'
          onClick={() => { router.push('/') }}
          aria-label='返回首页'
          title='返回首页'
          className='heo-sidebar-brand-card heo-card heo-card--interactive w-full'>
          <div className='heo-card__body heo-sidebar-brand-card__body flex flex-col items-center justify-center'>
            <span className='heo-sidebar-brand-card__avatar'>
              <LazyImage src={siteInfo?.icon} className='rounded-full' width={80} alt={siteConfig('AUTHOR')} />
            </span>
            <span className='heo-sidebar-brand-card__title'>{siteConfig('AUTHOR')}</span>
            <span className='heo-sidebar-brand-card__subtitle'>{siteConfig('DESCRIPTION')}</span>
          </div>
        </button>
        <MenuGroupCard {...props} />
      </div>
      <MenuListSide {...props} />
    </div>
  )
}

export default SideBar
