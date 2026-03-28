const crypto = require('crypto')

const QINIU_REGION_UPLOAD_MAP = {
  z0: 'https://upload.qiniup.com',
  z1: 'https://up-z1.qiniup.com',
  z2: 'https://up-z2.qiniup.com',
  na0: 'https://up-na0.qiniup.com',
  as0: 'https://up-as0.qiniup.com',
  'cn-east-2': 'https://up-cn-east-2.qiniup.com'
}

const QINIU_ACCESS_KEY = String(process.env.QINIU_ACCESS_KEY || '').trim()
const QINIU_SECRET_KEY = String(process.env.QINIU_SECRET_KEY || '').trim()
const QINIU_BUCKET = String(process.env.QINIU_BUCKET || '').trim()
const QINIU_REGION = String(process.env.QINIU_REGION || '').trim().toLowerCase()
const QINIU_UPLOAD_URL = String(process.env.QINIU_UPLOAD_URL || QINIU_REGION_UPLOAD_MAP[QINIU_REGION] || '').trim().replace(/\/$/, '')
const QINIU_PUBLIC_BASE_URL = String(process.env.QINIU_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')
const AI_DAILY_IMAGE_QINIU_KEY_PREFIX = String(process.env.AI_DAILY_IMAGE_QINIU_KEY_PREFIX || process.env.QINIU_KEY_PREFIX || 'ai-daily-images')
  .trim()
  .replace(/^\/+|\/+$/g, '') || 'ai-daily-images'

function hasQiniuImageStorageConfigured() {
  return Boolean(QINIU_ACCESS_KEY && QINIU_SECRET_KEY && QINIU_BUCKET && QINIU_UPLOAD_URL && QINIU_PUBLIC_BASE_URL)
}

function inferImageExtension(imageUrl = '', contentType = '') {
  const normalizedType = String(contentType || '').toLowerCase()
  if (normalizedType.includes('image/webp')) return 'webp'
  if (normalizedType.includes('image/png')) return 'png'
  if (normalizedType.includes('image/jpeg')) return 'jpg'
  if (normalizedType.includes('image/gif')) return 'gif'
  if (normalizedType.includes('image/svg+xml')) return 'svg'

  if (String(imageUrl || '').startsWith('data:image/svg+xml')) return 'svg'

  try {
    const pathname = new URL(imageUrl).pathname || ''
    const matched = pathname.match(/\.([a-z0-9]{2,5})$/i)
    return matched?.[1]?.toLowerCase() || 'jpg'
  } catch {
    return 'jpg'
  }
}


function buildQiniuImageObjectKey(item = {}, imageUrl = '', contentType = '', date = '') {
  const datePart = String(date || '').trim() || new Date().toISOString().slice(0, 10)
  const titleHash = crypto
    .createHash('md5')
    .update(`${item.title || ''}|${item.url || ''}|${imageUrl}`)
    .digest('hex')
    .slice(0, 16)
  const ext = inferImageExtension(imageUrl, contentType)
  return `${AI_DAILY_IMAGE_QINIU_KEY_PREFIX}/${datePart}/${titleHash}.${ext}`
}

function base64UrlEncode(value = '') {
  return Buffer.from(String(value || ''))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function signQiniuValue(value = '') {
  return crypto
    .createHmac('sha1', QINIU_SECRET_KEY)
    .update(value)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function buildQiniuManagementToken(requestPath = '', requestBody = '') {
  const signingStr = `${requestPath}\n${requestBody || ''}`
  return `${QINIU_ACCESS_KEY}:${signQiniuValue(signingStr)}`
}


function buildQiniuPublicUrl(objectKey = '') {
  return `${QINIU_PUBLIC_BASE_URL}/${String(objectKey || '').replace(/^\/+/, '')}`
}

function escapeXml(value = '') {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildWatermarkedSvgImage(dataUrl = '') {
  const safeDataUrl = escapeXml(dataUrl)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" rx="32" fill="#0f172a"/>
  <image href="${safeDataUrl}" x="0" y="0" width="1200" height="630" preserveAspectRatio="xMidYMid slice"/>
  <rect x="44" y="548" width="1112" height="52" rx="18" fill="rgba(15,23,42,0.72)" stroke="rgba(255,255,255,0.16)"/>
  <text x="72" y="581" fill="#F8FAFC" font-size="22" font-weight="700">blog: rhzhz.cn</text>
  <text x="370" y="581" fill="#BFDBFE" font-size="22" font-weight="600">公众号 RHZZZ</text>
  <text x="646" y="581" fill="#E5E7EB" font-size="20">关注 RHZZZ，持续获取每日 AI 情报</text>
</svg>`
}

async function doesQiniuObjectExist(objectKey = '') {

  const encodedEntryUri = base64UrlEncode(`${QINIU_BUCKET}:${objectKey}`)
  const requestPath = `/stat/${encodedEntryUri}`
  const accessToken = buildQiniuManagementToken(requestPath)
  const response = await fetch(`https://rs.qiniuapi.com${requestPath}`, {
    method: 'GET',
    headers: {
      Authorization: `QBox ${accessToken}`
    }
  })

  if (response.ok) return true
  if (response.status === 612) return false

  const body = await response.text().catch(() => '')
  throw new Error(`七牛云资源检查失败: ${response.status} ${body.slice(0, 200)}`.trim())
}


async function uploadBufferToQiniu({ objectKey, buffer, contentType }) {

  const putPolicy = Buffer.from(
    JSON.stringify({
      scope: `${QINIU_BUCKET}:${objectKey}`,
      deadline: Math.floor(Date.now() / 1000) + 3600
    })
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const encodedSign = crypto
    .createHmac('sha1', QINIU_SECRET_KEY)
    .update(putPolicy)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const uploadToken = `${QINIU_ACCESS_KEY}:${encodedSign}:${putPolicy}`
  const formData = new FormData()
  formData.append('token', uploadToken)
  formData.append('key', objectKey)
  formData.append('file', new Blob([buffer], { type: contentType || 'application/octet-stream' }), objectKey.split('/').pop() || 'image')

  const response = await fetch(QINIU_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `UpToken ${uploadToken}`
    },
    body: formData
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`七牛云上传失败: ${response.status} ${body.slice(0, 200)}`.trim())
  }

  return `${QINIU_PUBLIC_BASE_URL}/${objectKey}`
}

async function cacheImageToQiniu(item = {}, imageUrl = '', date = '') {
  const title = String(item?.title || '未命名条目').trim()

  if (!hasQiniuImageStorageConfigured()) {
    console.log(`🟡 七牛云未配置，正文图片保留原图：${title}`)
    return imageUrl
  }
  if (String(imageUrl).startsWith(`${QINIU_PUBLIC_BASE_URL}/`)) return imageUrl

  try {
    let contentType = ''
    let buffer = Buffer.alloc(0)

    if (String(imageUrl || '').startsWith('data:image/svg+xml')) {
      const raw = String(imageUrl).slice('data:image/svg+xml;charset=utf-8,'.length)
      contentType = 'image/svg+xml'
      buffer = Buffer.from(decodeURIComponent(raw), 'utf8')
    } else {
      if (!/^https?:\/\//i.test(String(imageUrl || '').trim())) return imageUrl

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'RHZ-AI-Daily-Collector/1.0',
          Referer: item.url || imageUrl
        },
        redirect: 'follow'
      })

      if (!response.ok) {
        console.warn(`🟠 图片抓取失败，保留原图：${title} (${response.status})`)
        return imageUrl
      }
      contentType = String(response.headers.get('content-type') || '').toLowerCase()
      if (!contentType.startsWith('image/')) {
        console.warn(`🟠 图片内容类型异常，保留原图：${title} (${contentType || 'unknown'})`)
        return imageUrl
      }

      const arrayBuffer = await response.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      if (contentType.startsWith('image/')) {
        const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`
        const watermarkedSvg = buildWatermarkedSvgImage(dataUrl)
        buffer = Buffer.from(watermarkedSvg, 'utf8')
        contentType = 'image/svg+xml'
      }
    }

    if (!buffer.length) {

      console.warn(`🟠 图片内容为空，保留原图：${title}`)
      return imageUrl
    }

    const objectKey = buildQiniuImageObjectKey(item, imageUrl, contentType, date)
    const publicUrl = buildQiniuPublicUrl(objectKey)
    let alreadyExists = false

    try {
      alreadyExists = await doesQiniuObjectExist(objectKey)
    } catch (error) {
      console.warn(`🟠 七牛云资源检查失败，转为继续上传：${title} (${String(error?.message || error || 'unknown error')})`)
    }

    if (alreadyExists) {
      console.log(`🔁 七牛云已存在，跳过上传：${title} -> ${publicUrl}`)
      return publicUrl
    }

    const cachedUrl = await uploadBufferToQiniu({ objectKey, buffer, contentType })

    console.log(`🟢 七牛云缓存成功：${title} -> ${cachedUrl}`)
    return cachedUrl

  } catch (error) {
    console.warn(`🟠 七牛云缓存失败，保留原图：${title} (${String(error?.message || error || 'unknown error')})`)
    return imageUrl
  }
}



module.exports = {
  hasQiniuImageStorageConfigured,
  cacheImageToQiniu
}
