import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 交流频道
 * @returns
 */
export default function TouchMeCard() {
  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }
  return (
    <div className='relative flex h-28 flex-col'>
      <FlipCard
        className='heo-touch-card heo-card heo-card--interactive cursor-pointer lg:p-6 p-4'
        frontContent={
          <div className='heo-touch-card__face heo-touch-card__face--front h-full'>
            <div className='heo-touch-card__eyebrow'>交流频道</div>
            <h2 className='heo-touch-card__title text-3xl font-[1000]'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
            </h2>
            <h3 className='heo-touch-card__desc pt-2'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG)}
            </h3>
            <div
              className='heo-touch-card__pattern absolute left-0 top-0 h-full w-full opacity-25'
              style={{
                background:
                  'url(https://bu.dusays.com/2023/05/16/64633c4cd36a9.png) center center no-repeat'
              }}></div>
          </div>
        }
        backContent={
          <SmartLink href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            <div className='heo-touch-card__face heo-touch-card__face--back flex h-full items-center justify-between'>
              <div>
                <div className='heo-touch-card__eyebrow'>加入讨论</div>
                <div className='heo-touch-card__cta text-xl font-[1000]'>
                  {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
                </div>
              </div>
              <div className='heo-touch-card__arrow'>↗</div>
            </div>
          </SmartLink>
        }
      />
    </div>
  )
}
