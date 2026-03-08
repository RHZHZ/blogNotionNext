import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import Announcement from './Announcement'
import Card from './Card'

/**
 * 社交信息卡
 * @param {*} props
 * @returns
 */
export function InfoCard(props) {
  const { siteInfo, notice, post, className } = props
  const { isDarkMode } = useGlobal()
  const router = useRouter()
  // 在文章详情页特殊处理
  const isSlugPage = router.pathname.indexOf('/[prefix]') === 0
  const url1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const icon1 = siteConfig('HEO_INFO_CARD_ICON1', null, CONFIG)
  const url2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const icon2 = siteConfig('HEO_INFO_CARD_ICON2', null, CONFIG)
  const statusIcon = siteConfig('HEO_INFO_CARD_STATUS_ICON', null, CONFIG)

  const fallbackColor = isDarkMode ? '#CA8A04' : '#0060e0'
  const [cardColor, setCardColor] = useState(fallbackColor)

  useEffect(() => {
    const applyGlobalColor = colorFromEvent => {
      if (!isSlugPage || !post?.pageCover) {
        setCardColor(fallbackColor)
        return
      }

      const rootColor =
        colorFromEvent ||
        (typeof window !== 'undefined'
          ? window
              .getComputedStyle(document.documentElement)
              .getPropertyValue('--heo-cover-color')
              .trim()
          : '')

      setCardColor(rootColor || fallbackColor)
    }

    applyGlobalColor()

    const onColorChange = event => {
      applyGlobalColor(event?.detail?.color)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('heo-cover-color-change', onColorChange)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('heo-cover-color-change', onColorChange)
      }
    }
  }, [isSlugPage, post?.pageCover, fallbackColor])

  return (
    <Card
      style={{ '--heo-infocard-bg': cardColor }}
      className={`${isDarkMode ? 'text-white' : 'text-slate-800'} flex flex-col w-72 overflow-hidden relative heo-infocard-v2 heo-card--interactive ${className || ''}`}
      bodyClassName='flex flex-1 flex-col'>
      <div className='heo-info-header'>
        <GreetingsWords />
      </div>

      <div className='heo-info-body'>
        <div className='heo-info-avatar-wrap'>
          <div className='cursor-pointer relative flex items-center justify-center transform transition-all duration-200 dark:text-gray-100'>
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={120}
              height={120}
              alt={siteConfig('AUTHOR')}
            />
            {statusIcon && (
              <div className='author-status'>
                <LazyImage
                  src={statusIcon}
                  width={32}
                  height={32}
                  alt='status'
                />
              </div>
            )}
          </div>
        </div>

        <div className='heo-info-announcement-wrap'>
          <Announcement post={notice} style={{ color: 'white !important' }} />
        </div>
      </div>

      <div className='heo-info-footer'>
        <div className='heo-info-footer-text'>
          <div className='author-info__name text-2xl font-bold'>{siteConfig('AUTHOR')}</div>
          <div className='author-info__desc mt-1 text-xs opacity-80'>{siteConfig('BIO')}</div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='flex space-x-2'>
            {url1 && (
              <div className='heo-info-social-btn heo-action-btn'>
                <SmartLink href={url1}>
                  <i className={icon1} />
                </SmartLink>
              </div>
            )}
            {url2 && (
              <div className='heo-info-social-btn heo-action-btn'>
                <SmartLink href={url2}>
                  <i className={icon2} />
                </SmartLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
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
