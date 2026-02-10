import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

/**
 * 社交信息卡
 * @param {*} props
 * @returns
 */
export function InfoCard(props) {
  const { siteInfo, notice } = props
  const router = useRouter()
  // 在文章详情页特殊处理
  const isSlugPage = router.pathname.indexOf('/[prefix]') === 0
  const url1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const icon1 = siteConfig('HEO_INFO_CARD_ICON1', null, CONFIG)
  const url2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const icon2 = siteConfig('HEO_INFO_CARD_ICON2', null, CONFIG)

  return (
    <Card className='wow fadeInUp bg-[#4f65f0] dark:bg-yellow-600 text-white flex flex-col w-72 overflow-hidden relative heo-infocard-v2'>
      
      {/* 1. Header 头部区域 - 固定问候语 */}
      <div className='heo-info-header'>
        <GreetingsWords />
      </div>

      {/* 2. Body 身体区域 - 切换头像与公告 */}
      <div className='heo-info-body'>
        {/* 默认显示的头像 */}
        <div className='heo-info-avatar-wrap'>
          <div
            className={`${
              isSlugPage
                ? 'absolute right-0 -mt-8 -mr-6 hover:opacity-0 hover:scale-150 blur'
                : 'cursor-pointer'
            } justify-center items-center flex dark:text-gray-100 transform transition-all duration-200`}>
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={400}
              height={400}
              alt={siteConfig('AUTHOR')}
            />
          </div>
        </div>

        {/* Hover显示的公告内容 */}
        <div className='heo-info-announcement-wrap'>
         
          <Announcement post={notice} style={{ color: 'white !important' }} />
        </div>
      </div>

      {/* 3. Footer 底部区域 - 固定作者名与按钮 */}
      <div className='heo-info-footer'>
        <div className='heo-info-footer-text'>
          <div className="author-info__name text-2xl font-bold">{siteConfig('AUTHOR')}</div>
          <div className="author-info__desc text-xs opacity-80 mt-1">{siteConfig('BIO')}</div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='flex space-x-2'>
            {url1 && (
              <div className='heo-info-social-btn'>
                <SmartLink href={url1}>
                  <i className={icon1} />
                </SmartLink>
              </div>
            )}
           
        
          
          </div>
          <MoreButton />
        </div>
      </div>

    </Card>
  )
}

/**
 * 了解更多按鈕
 * @returns
 */
function MoreButton() {
  const url3 = siteConfig('HEO_INFO_CARD_URL3', null, CONFIG)
  const text3 = siteConfig('HEO_INFO_CARD_TEXT3', null, CONFIG)
  if (!url3) {
    return <></>
  }
  return (
    <SmartLink href={url3}>
      <div className='heo-info-more-btn'>
        <ArrowRightCircle className={'w-6 h-6'} />
        <div className='font-bold hidden'>{text3}</div>
      </div>
    </SmartLink>
  )
}

/**
 * 欢迎语
 */
function GreetingsWords() {
  const greetings = siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  const [greeting, setGreeting] = useState(greetings[0])
  const handleChangeGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    setGreeting(greetings[randomIndex])
  }

  return (
    <div
      onClick={handleChangeGreeting}
      className='heo-info-greetings-pill select-none cursor-pointer'>
      {greeting}
    </div>
  )
}
