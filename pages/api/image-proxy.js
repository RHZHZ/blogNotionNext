import axios from 'axios'

/**
 * 图片代理 API，用于绕过跨域限制（CORS）以获取图片主色
 */
export default async function handler(req, res) {
  const { url } = req.query

  if (!url) {
    return res.status(400).send('Missing url parameter')
  }

  
  // 安全检查：限制仅代理允许的域名，防止 SSRF
  // 允许列表可在 blog.config.js 中通过 IMAGE_PROXY_ALLOW_HOSTS 配置
  const BLOG = require('../../blog.config')
  const allowedHosts = Array.isArray(BLOG?.IMAGE_PROXY_ALLOW_HOSTS)
    ? BLOG.IMAGE_PROXY_ALLOW_HOSTS
    : []

  try {
    const targetUrl = new URL(url)
    const isAllowed = allowedHosts.some(host => targetUrl.hostname.endsWith(host))

    if (!isAllowed) {
      return res.status(403).send('Forbidden host')
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const contentType = response.headers['content-type']
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400') // 缓存一天
    res.setHeader('Access-Control-Allow-Origin', '*') // 允许跨域访问代理后的图片
    
    return res.send(response.data)
  } catch (error) {
    console.error('Image proxy error:', error.message)
    return res.status(500).send('Error fetching image')
  }
}


