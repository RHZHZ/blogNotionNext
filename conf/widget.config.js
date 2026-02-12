/**
 * 悬浮在网页上的挂件
 */
module.exports = {
  THEME_SWITCH: process.env.NEXT_PUBLIC_THEME_SWITCH || false, // 是否显示切换主题按钮
  // Chatbase 是否显示chatbase机器人 https://www.chatbase.co/
  CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null,
  // WebwhizAI 机器人 @see https://github.com/webwhiz-ai/webwhiz
  WEB_WHIZ_ENABLED: process.env.NEXT_PUBLIC_WEB_WHIZ_ENABLED || false, // 是否显示
  WEB_WHIZ_BASE_URL:
    process.env.NEXT_PUBLIC_WEB_WHIZ_BASE_URL || 'https://api.webwhiz.ai', // 可以自建服务器
  WEB_WHIZ_CHAT_BOT_ID: process.env.NEXT_PUBLIC_WEB_WHIZ_CHAT_BOT_ID || null, // 在后台获取ID
  DIFY_CHATBOT_ENABLED: process.env.NEXT_PUBLIC_DIFY_CHATBOT_ENABLED || false,
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',

  // 悬浮挂件
  WIDGET_PET:
    process.env.NEXT_PUBLIC_WIDGET_PET === undefined
      ? false
      : process.env.NEXT_PUBLIC_WIDGET_PET, // 是否显示宠物挂件
  WIDGET_PET_LINK:
    process.env.NEXT_PUBLIC_WIDGET_PET_LINK ||
    'https://cdn.jsdelivr.net/npm/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json', // 挂件模型地址 @see https://github.com/xiazeyu/live2d-widget-models
  WIDGET_PET_SWITCH_THEME:
    process.env.NEXT_PUBLIC_WIDGET_PET_SWITCH_THEME || false, // 点击宠物挂件切换博客主题

  SPOILER_TEXT_TAG: process.env.NEXT_PUBLIC_SPOILER_TEXT_TAG || '', // Spoiler文本隐藏功能，如Notion中 [sp]希望被spoiler的文字[sp]，填入[sp] 即可

  // 音乐播放插件
  MUSIC_PLAYER: process.env.NEXT_PUBLIC_MUSIC_PLAYER || true, // 是否使用音乐播放插件
  MUSIC_PLAYER_VISIBLE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_VISIBLE || true, // 是否在左下角显示播放和切换
  MUSIC_PLAYER_AUTO_PLAY:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_AUTO_PLAY || false, // 是否自动播放
  MUSIC_PLAYER_LRC_TYPE: process.env.NEXT_PUBLIC_MUSIC_PLAYER_LRC_TYPE || '0', // 歌词显示类型
  
  // 站点全局播放器配置 - 优先读取环境变量，其次尝试从主配置读取，最后使用默认值
  MUSIC_PLAYER_METING_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_ID || 
    '2037842140,2037843139,2758268699,2845780,1933427867,2037843141,39324826,2708984802,1490402910', // 全局随机歌曲池
  MUSIC_PLAYER_METING_LRC_TYPE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_LRC_TYPE || '1', // 已废弃！！！可选值： 3 | 1 | 0（0：禁用 lrc 歌词，1：lrc 格式的字符串，3：lrc 文件 url）
  MUSIC_PLAYER_METING_API:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_API ||
    '/api/meting?url=:id',

  // 文章内音频卡片（Notion 音频块）配置
  MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_AUDIO_CONVERT || true, // 是否将 Notion 的音频块自动转换为内嵌灵动岛卡片
  MUSIC_PLAYER_ARTICLE_META_ENABLE:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_ENABLE || true, // 是否启用 AudioMeta 数据库补全封面/歌词等元数据
  MUSIC_PLAYER_ARTICLE_META_DB_ID:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID || '3049daca95bb806889ffe623a8e74e5c', // AudioMeta 数据库ID
  MUSIC_PLAYER_ARTICLE_DEFAULT_COVER:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_DEFAULT_COVER || '/avatar.png', // 元数据缺失时文章音频默认封面
  MUSIC_PLAYER_ARTICLE_DEFAULT_ARTIST:
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_DEFAULT_ARTIST || 'RHZ', // 元数据缺失时文章音频默认歌手

  // 一个小插件展示你的facebook fan page~ @see https://tw.andys.pro/article/add-facebook-fanpage-notionnext
  FACEBOOK_PAGE_TITLE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_TITLE || null, // 邊欄 Facebook Page widget 的標題欄，填''則無標題欄 e.g FACEBOOK 粉絲團'
  FACEBOOK_PAGE: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || null, // Facebook Page 的連結 e.g https://www.facebook.com/tw.andys.pro
  FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '', // Facebook Page ID 來啟用 messenger 聊天功能
  FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '' // Facebook App ID 來啟用 messenger 聊天功能 获取: https://developers.facebook.com/
}
