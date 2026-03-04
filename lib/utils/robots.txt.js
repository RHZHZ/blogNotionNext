import fs from 'fs'

export function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link
  const content = `
    # 百度蜘蛛
    User-agent: Baiduspider
    Allow: /
    Crawl-delay: 1
    
    # 百度移动端蜘蛛
    User-agent: Baiduspider-mobile
    Allow: /
    Crawl-delay: 1
    
    # 谷歌蜘蛛
    User-agent: Googlebot
    Allow: /
    
    # 必应蜘蛛
    User-agent: Bingbot
    Allow: /
    
    # 普通爬虫
    User-agent: *
    Allow: /
    Disallow: /api/
    Disallow: /_next/
    Disallow: /admin/
    Disallow: /private/
    
    # 禁止抓取搜索接口
    Disallow: */search*
    
    # 爬取延迟,避免服务器压力
    Crawl-delay: 1
  
    # 主域名 (百度专用)
    Host: ${LINK}
  
    # 站点地图
    Sitemap: ${LINK}/sitemap.xml
    Sitemap: ${LINK}/sitemap.xml
  
    `
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
