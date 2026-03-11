import { ArrowRightCircle } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Swipe from './Swipe'

export function NoticeBar() {
  let notices = siteConfig('RHZ_NOTICE_BAR', null, CONFIG)
  const { locale } = useGlobal()
  if (typeof notices === 'string') {
    notices = JSON.parse(notices)
  }
  if (!notices || notices?.length === 0) {
    return <></>
  }

  return (
    <div className='max-w-[86rem] w-full mx-auto mb-4 px-5'>
      <div className='rhz-notice-card heo-notice-card rhz-card heo-card rhz-card--interactive heo-card--interactive animate__animated animate__fadeIn animate__fast group cursor-pointer w-full min-h-[3.25rem] flex items-center gap-4 px-5 py-3'>
        <div className='rhz-notice-card__label heo-notice-card__label shrink-0 whitespace-nowrap'>
          {locale.COMMON.NOW}
        </div>
        <div className='rhz-notice-card__content heo-notice-card__content flex-1 min-w-0 h-full flex items-center justify-center'>
          <Swipe items={notices} />
        </div>
        <div className='rhz-notice-card__icon heo-notice-card__icon shrink-0'>
          <ArrowRightCircle className='w-5 h-5' />
        </div>
      </div>
    </div>
  )
}
