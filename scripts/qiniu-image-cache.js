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
  if (!hasQiniuImageStorageConfigured()) return imageUrl
  if (!/^https?:\/\//i.test(String(imageUrl || '').trim())) return imageUrl
  if (String(imageUrl).startsWith(`${QINIU_PUBLIC_BASE_URL}/`)) return imageUrl

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'RHZ-AI-Daily-Collector/1.0',
        Referer: item.url || imageUrl
      },
      redirect: 'follow'
    })

    if (!response.ok) return imageUrl
    const contentType = String(response.headers.get('content-type') || '').toLowerCase()
    if (!contentType.startsWith('image/')) return imageUrl

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    if (!buffer.length) return imageUrl

    const objectKey = buildQiniuImageObjectKey(item, imageUrl, contentType, date)
    return await uploadBufferToQiniu({ objectKey, buffer, contentType })
  } catch {
    return imageUrl
  }
}

module.exports = {
  hasQiniuImageStorageConfigured,
  cacheImageToQiniu
}
