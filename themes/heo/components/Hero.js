// import Image from 'next/image'
import { ArrowSmallRight, PlusSmall } from '@/components/HeroIcons'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/utils/config'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 顶部英雄区 - Bento Grid 枢纽版
 * 采用不规则网格布局，整合动态信息与文章推荐
 */
const Hero = props => {
  const HEO_HERO_ENABLE = siteConfig('HEO_HERO_ENABLE', true, CONFIG)
  if (!HEO_HERO_ENABLE) return null

  return (
    <div id='hero-wrapper' className='w-full select-none px-5 mb-8'>
      <div id='hero-bento' className='max-w-[86rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-none auto-rows-min gap-4'>
        
        {/* 1. 欢迎/动态时间卡片 (占据 2x1) */}
        <WelcomeCard />

        {/* 2. 灵感/微语卡片 (1x1) */}
        <InspirationCard />

        {/* 3. 快捷入口方块 (1x1) */}
        <QuickLinkCard />

        {/* 4. 主要推荐文章 - 原 TodayCard 逻辑 (2x2) */}
        <MainFeatureCard {...props} />

        {/* 5. 次要推荐文章列表 (2x1) */}
        <SubPostGrid {...props} />

      </div>
    </div>
  )
}

/**
 * 欢迎/动态时间卡片
 */
function WelcomeCard() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hour = time.getHours()
  let greeting = 'Good Morning'
  if (hour >= 12 && hour < 18) greeting = 'Good Afternoon'
  if (hour >= 18 || hour < 5) greeting = 'Good Evening'

  return (
    <div className='bento-card welcome-card col-span-1 md:col-span-2 p-8 flex flex-col justify-between overflow-hidden relative group'>
      <div className='z-10'>
        <div className='text-sm font-medium opacity-70 mb-2 flex items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <h2 className='text-3xl md:text-4xl font-bold leading-tight'>
          {greeting}, <br/>
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-yellow-400 dark:to-orange-500'>
            {siteConfig('HEO_HERO_TITLE_1', 'Welcome to my blog', CONFIG)}
          </span>
        </h2>
      </div>
      <div className='mt-4 text-sm opacity-60 flex items-center gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
        </svg>
        {siteConfig('HEO_HERO_TITLE_3', 'Location Unknown', CONFIG)}
      </div>
      {/* 背景点缀图标 */}
      <div className='absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-48 h-48 rotate-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
    </div>
  )
}

/**
 * 灵感/微语卡片
 */
function InspirationCard() {
  return (
    <div className='bento-card inspiration-card col-span-1 p-6 flex flex-col justify-center items-center text-center relative group cursor-pointer'>
      <div className='mb-4 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-500'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.455L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.455zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </div>
      <p className='text-sm font-medium line-clamp-3 opacity-80'>
        "{siteConfig('HEO_HERO_TITLE_2', 'Keep thinking, keep growing.', CONFIG)}"
      </p>
      <div className='absolute bottom-4 text-[10px] uppercase tracking-widest opacity-40'>Daily Inspiration</div>
    </div>
  )
}

/**
 * 快捷入口卡片 (由原来的三个分类按钮进化而来)
 */
function QuickLinkCard() {
  const cat1 = siteConfig('HEO_HERO_CATEGORY_1', {}, CONFIG)
  const cat2 = siteConfig('HEO_HERO_CATEGORY_2', {}, CONFIG)
  
  return (
    <div className='bento-card col-span-1 p-4 grid grid-cols-2 grid-rows-2 gap-3'>
      <SmartLink href={cat1?.url || '/'} className='col-span-2 row-span-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-between px-4 text-white hover:scale-[1.03] transition-transform'>
        <span className='font-bold text-sm'>{cat1?.title}</span>
        <PlusSmall className='w-5 h-5' />
      </SmartLink>
      <SmartLink href={cat2?.url || '/'} className='col-span-2 row-span-1 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-between px-4 text-white hover:scale-[1.03] transition-transform'>
        <span className='font-bold text-sm'>{cat2?.title}</span>
        <PlusSmall className='w-5 h-5' />
      </SmartLink>
    </div>
  )
}

/**
 * 主推荐卡片 (2x2)
 */
function MainFeatureCard({ siteInfo }) {
  const router = useRouter()
  const link = siteConfig('HEO_HERO_TITLE_LINK', '#', CONFIG)
  const title = siteConfig('HEO_HERO_TITLE_5', 'Featured Post', CONFIG)
  const subTitle = siteConfig('HEO_HERO_TITLE_4', 'MUST READ', CONFIG)

  return (
    <div 
      onClick={() => router.push(link)}
      className='bento-card main-feature col-span-1 md:col-span-2 row-span-2 min-h-[300px] relative overflow-hidden group cursor-pointer'
    >
      <LazyImage 
        src={siteInfo?.pageCover} 
        className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10' />
      <div className='absolute bottom-0 left-0 p-8 z-20 w-full'>
        <div className='text-xs font-bold text-white/70 mb-2 tracking-[0.2em] uppercase'>{subTitle}</div>
        <h3 className='text-2xl md:text-3xl font-extrabold text-white mb-4 line-clamp-2'>{title}</h3>
        <div className='flex items-center gap-2 text-white/90 text-sm font-medium bg-white/20 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/30 group-hover:bg-white/30 transition-colors'>
          Explore More <ArrowSmallRight className='w-4 h-4' />
        </div>
      </div>
    </div>
  )
}

/**
 * 次要文章展示 (2x1)
 */
function SubPostGrid(props) {
  const { latestPosts } = props
  // 仅取前两个
  const posts = latestPosts?.slice(0, 2) || []

  return (
    <div className='col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
      {posts.map((post, index) => (
        <SmartLink href={`${siteConfig('SUB_PATH', '')}/${post?.slug}`} key={index}>
          <div className='bento-card sub-post p-4 flex gap-4 items-center group cursor-pointer'>
            <div className='w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden relative'>
              <LazyImage src={post?.pageCoverThumbnail} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
            </div>
            <div className='flex-1 min-w-0'>
              <h4 className='font-bold text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-yellow-500 transition-colors'>
                {post.title}
              </h4>
              <div className='text-[10px] opacity-50 mt-2 uppercase tracking-wider font-semibold'>Latest Article</div>
            </div>
          </div>
        </SmartLink>
      ))}
    </div>
  )
}

export default Hero
