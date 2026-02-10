import { ArrowRightCircle } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState, useRef, useLayoutEffect } from 'react'
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

  const [hoverHeight, setHoverHeight] = useState('20rem')
  const announcementRef = useRef(null)

  // 动态测量公告内容高度
  useLayoutEffect(() => {
    if (announcementRef.current) {
      const contentHeight = announcementRef.current.scrollHeight
      // 动态计算：顶部留白(80px) + 公告高度 + 底部固定区高度(100px)
      const totalHeight = contentHeight + 180 
      setHoverHeight(`${Math.max(320, totalHeight)}px`)
    }
  }, [notice])

  return (
    <Card 
      className='wow fadeInUp bg-[#4f65f0] dark:bg-yellow-600 text-white flex flex-col w-72 overflow-hidden relative heo-infocard'
      style={{ '--heo-infocard-hover-height': hoverHeight }}
    >
      {/* 1. 独立问候语层：始终置顶且可点击 */}
      <div className='heo-infocard-greetings-standalone'>
        <GreetingsWords />
      </div>

      {/* 2. 默认展示层：头像 */}
      <div className='heo-infocard-layer heo-infocard-default'>
        <div className='heo-infocard-avatar'>
          <div
            className={`${
              isSlugPage
                ? 'absolute right-0 -mt-8 -mr-6 hover:opacity-0 hover:scale-150 blur'
                : 'cursor-pointer'
            } justify-center items-center flex dark:text-gray-100 transform transitaion-all duration-200`}>
            <LazyImage
              src={siteInfo?.icon}
              className='rounded-full'
              width={100}
              height={100}
              alt={siteConfig('AUTHOR')}
            />
          </div>
        </div>
      </div>

      {/* 3. 悬停展示层：公告内容 */}
      <div className='heo-infocard-layer heo-infocard-hover'>
        // <div className='heo-infocard-hover-title'>
        //   <span className='heo-infocard-hover-emoji'>👋</span>
        //   <span>欢迎来访!</span>
        // </div>

        <div className='heo-infocard-hover-content' ref={announcementRef}>
          <Announcement post={notice} style={{ color: 'white !important' }} />
        </div>
      </div>

      {/* 4. 公用底部层：作者名与按钮 (位置绝对固定在底部) */}
      <div className='heo-infocard-bottom-fixed'>
        <h2 className='text-3xl font-extrabold'>{siteConfig('AUTHOR')}</h2>

        <div className='flex justify-between items-center mt-4'>
          <div className='flex space-x-3 hover:text-black dark:hover:text-white'>
            {url1 && (
              <div className='w-10 text-center bg-indigo-400 p-2 rounded-full transition-colors duration-200 dark:bg-yellow-500 dark:hover:bg-black hover:bg-white'>
                <SmartLink href={url1}>
                  <i className={icon1} />
                </SmartLink>
              </div>
            )}
            {url2 && (
              <div className='bg-indigo-400 p-2 rounded-full w-10 items-center flex justify-center transition-colors duration-200 dark:bg-yellow-500 dark:hover:bg-black hover:bg-white'>
                <SmartLink href={url2}>
                  <i className={icon2} />
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
      <div
        className={
          'group bg-indigo-400 dark:bg-yellow-500 hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white flex items-center transition-colors duration-200 py-2 px-3 rounded-full space-x-1'
        }>
        <ArrowRightCircle
          className={
            'group-hover:stroke-black dark:group-hover:stroke-white w-6 h-6 transition-all duration-100'
          }
        />
        <div className='font-bold'>{text3}</div>
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
  // 每次点击，随机获取greetings中的一个
  const handleChangeGreeting = () => {
    const randomIndex = Math.floor(Math.random() * greetings.length)
    setGreeting(greetings[randomIndex])
  }

  return (
    <div
      onClick={handleChangeGreeting}
      className='select-none cursor-pointer py-1 px-2 bg-indigo-400 hover:bg-indigo-50 hover:text-indigo-950 dark:bg-yellow-500 dark:hover:text-white dark:hover:bg-black text-sm rounded-lg duration-200 transition-colors'>
      {greeting}
    </div>
  )
}
