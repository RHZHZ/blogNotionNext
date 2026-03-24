const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_POST_LIST_SUMMARY: false, // 首页文章卡片是否展示摘要
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画
  HEO_AMBIENCE_EFFECTS: true, // 全局氛围特效总开关
  HEO_AMBIENCE_SAKURA: true, // 兼容旧配置：浅色模式樱花飘落
  HEO_AMBIENCE_METEOR: true, // 兼容旧配置：暗色模式低频流星
  HEO_AMBIENCE_SEASON_EFFECTS: true, // 季节氛围特效总开关
  HEO_AMBIENCE_SEASON_MODE: 'auto', // auto / spring / summer / autumn / winter / off
  HEO_AMBIENCE_SEASON_SPRING: true, // 春季花瓣与柔光
  HEO_AMBIENCE_SEASON_SUMMER: true, // 夏季萤火与流光
  HEO_AMBIENCE_SEASON_AUTUMN: true, // 秋季落叶与暖调粒子
  HEO_AMBIENCE_SEASON_WINTER: true, // 冬季飘雪与冷调粒子


  HEO_HOME_BANNER_ENABLE: true,


  HEO_SITE_CREATE_TIME: '2026-01-21', // 建站日期，用于计算网站运行的第几天

  // 首页顶部通知条滚动内容，如不需要可以留空 []
  HEO_NOTICE_BAR: [
    { title: '欢迎来到我的博客', url: 'https://rhzhz.cn' },
    // { title: '访问文档中心获取更多帮助', url: 'https://docs.tangly1024.com' }
  ],

  // 英雄区开关
  HEO_HERO_ENABLE: true,

  // 首页文章分类栏（英雄区下方）开关
  HEO_HOME_CATEGORY_BAR_ENABLE: true,

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区(首页顶部大卡)
  HEO_HERO_TITLE_1: '分享编程',
  HEO_HERO_TITLE_2: '与思维认知',
  HEO_HERO_TITLE_3: 'RHZHZ.CN',
  HEO_HERO_TITLE_4: 'THINKING',
  HEO_HERO_TITLE_5: '成长的无限可能 思维永无止境',
  HEO_HERO_TITLE_LINK: 'https://rhzhz.cn',
  // 英雄区遮罩文字
  HEO_HERO_COVER_TITLE: '随便逛逛',

  // 英雄区显示三个置顶分类
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用资源', url: '/tag/实用资源' },

  // 英雄区右侧推荐文章标签, 例如 [推荐] , 最多六篇文章; 若留空白''，则推荐最近更新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false, // 推荐文章排序，为`true`时将强制按最后修改时间倒序
  //   HERO_RECOMMEND_COVER: 'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712_1280.jpg', // 英雄区右侧图片

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '🔍 分享与热心帮助',
    '🏃 脚踏实地行动派',
    '🎸 指弹编曲爱好者',
    '🤖️ 数码科技爱好者',
    '🧱 爱国爱党好青年'
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https://rhzhz.cn',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_URL3: 'https://blog.csdn.net/qq_18837609',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 个人资料卡头像右下角状态图标
  HEO_INFO_CARD_STATUS_ICON: 'https://upload-bbs.miyoushe.com/upload/2025/08/04/125766904/e3433dc6f4f78a9257060115e339f018_1105042150723011388.png?x-oss-process=image/format,avif',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'AfterEffect',
      img_1: '/images/heo/20239df3f66615b532ce571eac6d14ff21cf072602.webp',
      color_1: '#989bf8',
      title_2: 'Sketch',
      img_2: '/images/heo/2023e0ded7b724a39f12d59c3dc8fbdc7cbe074202.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Docker',
      img_1: '/images/heo/20231108a540b2862d26f8850172e4ea58ed075102.webp',
      color_1: '#57b6e6',
      title_2: 'Photoshop',
      img_2: '/images/heo/2023e4058a91608ea41751c4f102b131f267075902.webp',
      color_2: '#4082c3'
    },
    {
      title_1: 'FinalCutPro',
      img_1: '/images/heo/20233e777652412247dd57fd9b48cf997c01070702.webp',
      color_1: '#ffffff',
      title_2: 'Python',
      img_2: '/images/heo/20235c0731cd4c0c95fc136a8db961fdf963071502.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swift',
      img_1: '/images/heo/202328bbee0b314297917b327df4a704db5c072402.webp',
      color_1: '#eb6840',
      title_2: 'Principle',
      img_2: '/images/heo/2023f76570d2770c8e84801f7e107cd911b5073202.webp',
      color_2: '#8f55ba'
    },
    {
      title_1: 'illustrator',
      img_1: '/images/heo/20237359d71b45ab77829cee5972e36f8c30073902.webp',
      color_1: '#f29e39',
      title_2: 'CSS3',
      img_2: '/images/heo/20237c548846044a20dad68a13c0f0e1502f074602.webp',
      color_2: '#2c51db'
    },
    {
      title_1: 'JS',
      img_1: '/images/heo/2023786e7fc488f453d5fb2be760c96185c0075502.webp',
      color_1: '#f7cb4f',
      title_2: 'HTML',
      img_2: '/images/heo/202372b4d760fd8a497d442140c295655426070302.webp',
      color_2: '#e9572b'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/2023ffa5707c4e25b6beb3e6a3d286ede4c6071102.webp',
      color_1: '#df5b40',
      title_2: 'Rhino',
      img_2: '/images/heo/20231ca53fa0b09a3ff1df89acd7515e9516173302.webp',
      color_2: '#1f1f1f'
    }
  ],

  // About 页面可自定义内容
  HEO_ABOUT_PROFILE: {
    hero: {
      badge: '关于我',
      title: '关于我',
      subtitle: '代码、音乐、阅读与长期主义，组成了我现在的表达方式',
      description:
        '',
      tagline: ''
    },
    introduction:
      '你好，我是 RHZ。喜欢把灵感变成页面、把经验写成文章，也喜欢把复杂问题拆解成可执行的路径。对我来说，博客不仅是展示窗口，更是一套持续生长的个人知识系统',
    introductionMore:
      '我喜欢折腾，经常是一抬头一个黑夜和一个白天。',
    highlights: ['页面体验', '自动化流程', 'AI 协作', '内容沉淀', '阅读输入'],
    featureCards: [
      {
        eyebrow: '最近在做',
        title: '正在打磨的事情',
        description: '最近主要在整理博客页面结构、内容表达和可持续维护方式',
        tags: ['Blog Design', 'Content Structure', 'Maintainability']
      },
      {
        eyebrow: '表达偏好',
        title: '偏爱的表达方式',
        description: '我倾向先拆清问题结构，再把过程沉淀成以后还能复用的内容',
        tags: ['结构化表达', '复盘沉淀', '长期迭代']
      }
    ],
    profileCards: [
      {
        type: 'personality',
        eyebrow: '性格倾向',
        title: '提倡者',
        accent: 'INFJ-A',
        description: '偏好长期主义、共情沟通与有秩序的表达，也习惯先理解全局再推进落地',
        image: 'https://www.16personalities.com/static/images/personality-types/avatars/infj-advocate.svg',
        imageAlt: 'INFJ-A 提倡者插画'
      },
      {
        type: 'hobby',
        eyebrow: '游戏偏好',
        title: 'CSGO',
        accent: '战术协同 / 枪感 / 地图理解',
        description: '喜欢竞技协作、残局博弈和稳定上分带来的节奏感',
        image: '/images/about/csgo-card-bg.png',
        imageAlt: 'CSGO 游戏封面',
        badge: '段位 B+'
      },
      {
        type: 'reading',
        eyebrow: '阅读输入',
        title: '微信读书',
        accent: '阅读时长 1300+',
        image: 'https://images.unsplash.com/photo-1579762593175-20226054cad0?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb',
        imageAlt: '微信读书氛围背景',
        description: '长期把微信读书当作日常输入入口，阅读、标注与整理已经成为稳定习惯',
        badge: '1300+ 小时'
      },
      {
        type: 'fandom-music',
        eyebrow: '偏爱内容',
        title: '热血番与华语流行',
        accent: '七龙珠 / 火影忍者 / 海贼王',
        description: '有时候后悔自己才20几岁就看完了这些动漫',
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
          description: '跟 Jay 一起反复循环旋律和故事感，也会继续往更宽的中文音乐世界里走',
          image: '/images/jay.png'
        }
      }
    ],
    stats: [
      { label: '核心主题', value: '3', helper: '阅读 / 音乐 / 代码' },
      { label: '博客定位', value: '概览页', helper: '摘要优先，正文承接' },
      { label: '持续状态', value: '长期', helper: '沉淀 / 突破 / 超越' }
    ],
    skills: [
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
    ],
    timelinePreviewLimit: 3,
    timeline: [
      {
        year: 'Now',
        title: '持续建设个人博客与数字花园',
        description: '围绕技术实践、学习复盘、生活感悟与认知成长，持续沉淀可复用的内容'
      },
      {
        year: '2025',
        title: '推进博客主题与交互体验升级',
        description: '基于 NotionNext ，彻底重构 HEO 主题，开发独创微信读书和灵动岛功能，打磨视觉表达、阅读体验与页面信息结构'
      },
      {
        year: '2024',
        title: '扩展自动化与 AI 协作能力',
        description: '将内容生产、工作流串联、数据整理与开发过程逐步自动化，提升持续创作效率'
      }
    ],
    contacts: [
      { label: '博客', value: 'https://rhzhz.cn', href: 'https://rhzhz.cn' },
      { label: 'GitHub', value: 'https://github.com/RHZHZ', href: 'https://github.com/RHZHZ' },
      { label: '邮箱', value: 'rhz@rhzhz.cn', href: '' }
    ],
    bookShelf: {
      title: '我最爱的书',
      description: '这些书我反复读多少遍都不会腻',
      linkText: '我的书单',
      link: '/booklist',
      previewLimit: 4
    },
    recentBookShelf: {
      title: '我最近在读的书',
      description: '最近在读这些书，感觉蛮有意思的',
      linkText: '我的书单',
      link: '/booklist',
      previewLimit: 3
    },
    bookList: {
      pagePath: '/booklist',
      navLabel: '我的书单',
      featuredShelfNames: ['我的最爱', '最近在读'],
      sectionOrder: ['我的最爱', '最近在读']
    },
    wereadSync: {
      enabled: true,
      refreshOnLoad: false,
      recentLimit: 0,
      favoriteLimit: 0,
      notionDbId: '',
      favoriteShelfNames: ['我的最爱'],
      recentShelfNames: ['最近在读']
    },
    books: [],
    recentBooks: []
  },


  HEO_SOCIAL_CARD: false, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '交流频道',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: 'https://docs.tangly1024.com/article/how-to-question',

  // 底部统计面板文案
  HEO_POST_COUNT_TITLE: '文章数:',
  HEO_SITE_TIME_TITLE: '建站天数:',
  HEO_SITE_VISIT_TITLE: '访问量:',
  HEO_SITE_VISITOR_TITLE: '访客数:',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览

  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 显示文章版权声明
  HEO_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_WIDGET_LATEST_POSTS: true, // 显示最新文章卡
  HEO_WIDGET_ANALYTICS: false, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG

