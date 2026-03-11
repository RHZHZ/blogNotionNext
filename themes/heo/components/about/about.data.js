import { siteConfig } from '@/lib/config'
import CONFIG from '../../config'

const FAVORITE_BOOKS_PREVIEW_LIMIT = 4
const RECENT_BOOKS_PREVIEW_LIMIT = 3
const TIMELINE_PREVIEW_LIMIT = 3

const defaultStats = [
  { label: '核心领域', value: '3', helper: '代码 / 音乐 / 阅读' },
  { label: '博客状态', value: '长期更新', helper: '持续记录实践与想法' },
  { label: '内容方向', value: '技术 + 生活', helper: '理性输出与感性表达并行' }
]

const defaultTimeline = [
  {
    year: 'Now',
    title: '持续建设个人博客与数字花园',
    description: '围绕技术实践、学习复盘、生活感悟与认知成长，持续沉淀可复用的内容。'
  },
  {
    year: '2025',
    title: '推进博客主题与交互体验升级',
    description: '基于 NotionNext 和 HEO 主题持续二次开发，打磨视觉表达、阅读体验与页面信息结构。'
  },
  {
    year: '2024',
    title: '扩展自动化与 AI 协作能力',
    description: '将内容生产、工作流串联、数据整理与开发过程逐步自动化，提升持续创作效率。'
  }
]

const defaultContacts = [
  {
    label: '博客',
    value: siteConfig('LINK', '', CONFIG) || 'https://rhzhz.cn',
    href: siteConfig('LINK', '', CONFIG) || 'https://github.com/RHZHZ/'
  },
  {
    label: 'GitHub',
    value: siteConfig('HEO_INFO_CARD_URL2', 'https://github.com', CONFIG),
    href: siteConfig('HEO_INFO_CARD_URL2', 'https://github.com', CONFIG)
  },
  {
    label: '邮箱',
    value: 'rhz@rhzhz.cn',
    href: ''
  }
]

const defaultProfileCards = [
  {
    type: 'personality',
    eyebrow: 'Personality',
    title: '提倡者',
    accent: 'INFJ-A',
    description: '偏好长期主义、共情沟通与有秩序的表达，也习惯先理解全局再推进落地。',
    image: 'https://www.16personalities.com/static/images/personality-types/avatars/infj-advocate.svg',
    imageAlt: 'INFJ-A 提倡者插画'
  },
  {
    type: 'hobby',
    eyebrow: 'Hobby',
    title: 'CSGO',
    accent: '战术协同 / 枪感 / 地图理解',
    description: '喜欢竞技协作、残局博弈和稳定上分带来的节奏感。',
    image: '/images/about/csgo-card-bg.png',
    imageAlt: 'CSGO 游戏封面',
    badge: '段位 B+'
  },
  {
    type: 'reading',
    eyebrow: 'Weread',
    title: '微信读书',
    accent: '阅读时长 1300+',
    description: '长期把微信读书当作日常输入入口，阅读、标注与整理已经成为稳定习惯。',
    image: 'https://images.unsplash.com/photo-1579762593175-20226054cad0?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb',
    imageAlt: '微信读书氛围背景',
    badge: '1300+ 小时'
  },
  {
    type: 'fandom-music',
    eyebrow: 'Favorites',
    title: '热血番与华语流行',
    accent: '七龙珠 / 火影忍者 / 海贼王 / 周杰伦',
    description: '一边是陪我长大的热血少年漫，一边是反复循环的华语流行与 Jay 式旋律审美。',
    animeTitle: '火影忍者 / 海贼王 / 七龙珠',
    animeCovers: [

      {
        title: '火影忍者',
        image: '/images/about/anime-naruto.jpg'
      },
      {
        title: '海贼王',
        image: '/images/about/anime-onepiece.jpg'
      },
      {
        title: '七龙珠',
        image: '/images/about/anime-dragonball.jpg'
      }
    ],
    musicPanel: {
      eyebrow: '音乐偏好',
      title: '周杰伦',
      subtitle: '许嵩、民谣、华语流行',
      description: '跟 Jay 一起反复循环旋律和故事感，也会继续往更宽的中文音乐世界里走。',
      image: 'https://file.notion.so/f/f/b61f84c4-f972-437a-8bf5-d1e0ef13b71d/6079b12b-1e1a-422b-bbdc-5d4a94db5239/image.png?table=block&id=3209daca-95bb-8049-acb6-e347350d208c&spaceId=b61f84c4-f972-437a-8bf5-d1e0ef13b71d&expirationTimestamp=1773259200000&signature=d2qtUYJy11CuN7LUoi4f5CyhYhYh4YToHHcnY-I-Lec&downloadName=image.png'
    }
  }
]



const defaultSkills = [
  { name: 'Java', symbol: 'JV', accent: '后端 / 工程化' },
  { name: 'C', symbol: 'C', accent: '基础 / 性能' },
  { name: 'C++', symbol: 'C+', accent: '算法 / 系统' },
  { name: 'Python', symbol: 'Py', accent: '自动化 / AI' },
  { name: 'AI', symbol: 'AI', accent: '协作 / 提效' },
  { name: 'PR', symbol: 'PR', accent: '剪辑 / 叙事' },
  { name: 'Vue', symbol: 'V', accent: '前端 / 组件化' },
  { name: 'HTML', symbol: 'H5', accent: '语义 / 结构' },
  { name: 'CSS', symbol: 'CSS', accent: '视觉 / 动效' },
  { name: 'FL Studio', symbol: 'FL', accent: '编曲 / 混音' },
  { name: '吉他', symbol: 'G', accent: '指弹 / 编配' },
  { name: '音乐人', symbol: '♪', accent: '创作 / 表达' }
]

const defaultHighlights = ['独立博客', '前端开发', '自动化工作流', 'AI 协作', '音乐创作', '长期主义']

const defaultFeatureCards = [
  {
    eyebrow: 'Now Building',
    title: '正在打磨的事情',
    description:
      '持续优化博客视觉、内容结构与交互体验，也把 AI 协作、自动化流程和创作系统逐步纳入自己的日常工作流。',
    tags: ['Blog Design', 'AI Workflow', 'Automation', 'UX', 'Content System']
  },
  {
    eyebrow: 'Creative Style',
    title: '偏爱的表达方式',
    description:
      '我更喜欢把复杂问题拆成可落地的模块，把抽象概念讲清楚，把每次实践整理成以后还能继续复用的内容资产。',
    tags: ['结构化表达', '复盘沉淀', '长期迭代', '结果导向']
  }
]

const defaultBooks = []

const limitItems = (items, fallbackLimit) => {
  if (!Array.isArray(items)) return []
  const filteredItems = items.filter(Boolean)
  return Number.isFinite(fallbackLimit) && fallbackLimit > 0 ? filteredItems.slice(0, fallbackLimit) : filteredItems
}

export const getAboutPageData = ({ post, siteInfo }) => {
  const profile = siteConfig('HEO_ABOUT_PROFILE', {}, CONFIG)
  const hero = profile.hero || {}
  const stats = profile.stats?.length ? profile.stats : defaultStats
  const timeline = profile.timeline?.length ? profile.timeline : defaultTimeline
  const favoritePreviewLimit = profile.bookShelf?.previewLimit || FAVORITE_BOOKS_PREVIEW_LIMIT
  const recentPreviewLimit = profile.recentBookShelf?.previewLimit || RECENT_BOOKS_PREVIEW_LIMIT
  const timelinePreviewLimit = profile.timelinePreviewLimit || TIMELINE_PREVIEW_LIMIT
  const books = profile.books?.length ? profile.books : defaultBooks
  const recentBooks = profile.recentBooks?.length ? profile.recentBooks : []

  return {
    profile,
    hero: {
      badge: hero.badge || 'About Me',
      title: hero.title || post?.title || 'ABOUT ME',
      subtitle:
        hero.subtitle ||
        siteConfig('BIO', '他山之石，可以攻玉', CONFIG),
      description:
        hero.description ||
        '有趣的灵魂在这里相遇了',
      tagline: hero.tagline || '持续学习 / 持续输出 / 持续迭代',
      avatar: hero.avatar || siteInfo?.icon
    },
    introduction:
      profile.introduction ||
      '你好，我是一个喜欢把想法落地成作品的人。关注前端工程、自动化流程、产品表达与效率工具，也会持续记录实践中的思考与踩坑经验。',
    introductionMore:
      profile.introductionMore ||
      '我希望这个博客不仅是内容展示窗口，也是一套不断进化的个人知识系统：既能沉淀长期价值，也能对当下项目产生直接帮助。',
    stats,
    profileCards: profile.profileCards?.length ? profile.profileCards : defaultProfileCards,
    skills: profile.skills?.length ? profile.skills : defaultSkills,
    highlights: profile.highlights?.length ? profile.highlights : defaultHighlights,
    featureCards: profile.featureCards?.length ? profile.featureCards : defaultFeatureCards,
    timeline,
    timelineSummary: limitItems(timeline, timelinePreviewLimit),
    contacts: profile.contacts?.length ? profile.contacts : defaultContacts,
    bookShelf: {
      title: profile.bookShelf?.title || '我最爱的书',
      description:
        profile.bookShelf?.description ||
        '这些书不只是阅读清单，更是影响我思考方式、行动节奏与表达习惯的长期参考。',
      linkText: profile.bookShelf?.linkText || '我的书单',
      link: profile.bookShelf?.link || profile.bookList?.pagePath || '',
      previewLimit: favoritePreviewLimit
    },
    recentBookShelf: {
      title: profile.recentBookShelf?.title || '我最近在读的书',
      description:
        profile.recentBookShelf?.description ||
        '我相信多读读书总比一直刷视频好的，但是读多了以后我才发现只读不实践也没用。',
      linkText: profile.recentBookShelf?.linkText || '我的书单',
      link: profile.recentBookShelf?.link || profile.bookList?.pagePath || '',
      previewLimit: recentPreviewLimit
    },
    books: limitItems(books, favoritePreviewLimit),
    recentBooks: limitItems(recentBooks, recentPreviewLimit),
    wereadSync: profile.wereadSync || {}
  }
}
