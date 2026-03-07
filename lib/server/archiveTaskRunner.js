const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const { ARCHIVE_TASK_STATUS } = require('./archiveCore')

const loadEnvFile = async filePath => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const separatorIndex = line.indexOf('=')
      if (separatorIndex < 0) continue
      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && process.env[key] === undefined) {
        process.env[key] = value
      }
    }
  } catch {
    // ignore missing env file
  }
}

let BLOG = null
let NOTION_TOKEN = ''
let AUDIO_META_DB_ID = ''
let ARCHIVE_DB_ID = ''
let SITE_LINK = ''
let ARCHIVE_DIR = ''
let PUBLIC_BASE_URL = ''
let REQUEST_TIMEOUT_MS = 30000
let METING_API_BASE_URL = ''
let METING_API_BASE_CANDIDATES = []
let COS_SECRET_ID = ''

let COS_SECRET_KEY = ''
let COS_BUCKET = ''
let COS_REGION = ''
let COS_KEY_PREFIX = 'music-archive'
let COS_PUBLIC_BASE_URL = ''
let AUDIO_STORAGE_PROVIDER = ''
let QINIU_ACCESS_KEY = ''
let QINIU_SECRET_KEY = ''
let QINIU_BUCKET = ''
let QINIU_UPLOAD_URL = ''
let QINIU_KEY_PREFIX = 'music-archive'
let QINIU_PUBLIC_BASE_URL = ''
let R2_ACCOUNT_ID = ''
let R2_ACCESS_KEY_ID = ''
let R2_SECRET_ACCESS_KEY = ''
let R2_BUCKET = ''
let R2_ENDPOINT = ''
let R2_KEY_PREFIX = 'music-archive'
let R2_PUBLIC_BASE_URL = ''

const NOTION_VERSION = '2022-06-28'
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 RHZ-AudioArchive/1.0'

const initializeRuntimeConfig = async () => {
  await loadEnvFile(path.join(process.cwd(), '.env.local'))
  BLOG = require('../../blog.config')
  NOTION_TOKEN = String(process.env.NOTION_ACCESS_TOKEN || BLOG.NOTION_ACCESS_TOKEN || '').trim()
  AUDIO_META_DB_ID = String(
    process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID || BLOG.MUSIC_PLAYER_ARTICLE_META_DB_ID || ''
  ).trim()
  ARCHIVE_DB_ID = String(
    process.env.MUSIC_PLAYER_ARCHIVE_DB_ID ||
      process.env.NOTION_AUDIO_ARCHIVE_DB_ID ||
      process.env.NEXT_PUBLIC_MUSIC_PLAYER_ARCHIVE_DB_ID ||
      ''
  ).trim()
  SITE_LINK = String(process.env.NEXT_PUBLIC_LINK || BLOG.LINK || '').trim().replace(/\/$/, '')
  ARCHIVE_DIR = path.resolve(
    process.cwd(),
    String(process.env.MUSIC_PLAYER_AUDIO_ARCHIVE_DIR || 'public/music-archive').trim() || 'public/music-archive'
  )
  REQUEST_TIMEOUT_MS = Number(process.env.MUSIC_PLAYER_AUDIO_ARCHIVE_TIMEOUT_MS || 30000)
  METING_API_BASE_URL = String(
    process.env.MUSIC_PLAYER_AUDIO_ARCHIVE_METING_API_URL ||
      process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_API ||
      (SITE_LINK ? `${SITE_LINK}/api/meting` : '')
  )
    .trim()
    .replace(/\/$/, '')
  METING_API_BASE_CANDIDATES = Array.from(new Set([
    String(process.env.MUSIC_PLAYER_AUDIO_ARCHIVE_METING_API_URL || '').trim().replace(/\/$/, ''),
    'http://127.0.0.1:3000/api/meting',
    'http://localhost:3000/api/meting',
    String(process.env.NEXT_PUBLIC_MUSIC_PLAYER_METING_API || '').trim().replace(/\/$/, ''),
    (SITE_LINK ? `${SITE_LINK}/api/meting` : '').trim().replace(/\/$/, '')
  ].filter(Boolean)))

  COS_SECRET_ID = String(process.env.TENCENT_COS_SECRET_ID || process.env.COS_SECRET_ID || '').trim()
  COS_SECRET_KEY = String(process.env.TENCENT_COS_SECRET_KEY || process.env.COS_SECRET_KEY || '').trim()
  COS_BUCKET = String(process.env.TENCENT_COS_BUCKET || process.env.COS_BUCKET || '').trim()
  COS_REGION = String(process.env.TENCENT_COS_REGION || process.env.COS_REGION || '').trim()
  COS_KEY_PREFIX = String(process.env.TENCENT_COS_KEY_PREFIX || process.env.COS_KEY_PREFIX || 'music-archive')
    .trim()
    .replace(/^\/+|\/+$/g, '') || 'music-archive'

  const cosDefaultHost =
    COS_BUCKET && COS_REGION ? `${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com` : ''
  COS_PUBLIC_BASE_URL = String(
    process.env.TENCENT_COS_PUBLIC_BASE_URL ||
      process.env.COS_PUBLIC_BASE_URL ||
      (cosDefaultHost ? `https://${cosDefaultHost}` : '')
  )
    .trim()
    .replace(/\/$/, '')

  AUDIO_STORAGE_PROVIDER = String(
    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER || process.env.ARCHIVE_AUDIO_STORAGE_PROVIDER || ''
  )
    .trim()
    .toLowerCase()

  const qiniuRegion = String(process.env.QINIU_REGION || '').trim().toLowerCase()
  const qiniuRegionUploadMap = {
    z0: 'https://upload.qiniup.com',
    z1: 'https://up-z1.qiniup.com',
    z2: 'https://up-z2.qiniup.com',
    na0: 'https://up-na0.qiniup.com',
    as0: 'https://up-as0.qiniup.com',
    'cn-east-2': 'https://up-cn-east-2.qiniup.com'
  }

  QINIU_ACCESS_KEY = String(process.env.QINIU_ACCESS_KEY || '').trim()
  QINIU_SECRET_KEY = String(process.env.QINIU_SECRET_KEY || '').trim()
  QINIU_BUCKET = String(process.env.QINIU_BUCKET || '').trim()
  QINIU_UPLOAD_URL = String(process.env.QINIU_UPLOAD_URL || qiniuRegionUploadMap[qiniuRegion] || '')
    .trim()
    .replace(/\/$/, '')
  QINIU_KEY_PREFIX = String(process.env.QINIU_KEY_PREFIX || 'music-archive')
    .trim()
    .replace(/^\/+|\/+$/g, '') || 'music-archive'
  QINIU_PUBLIC_BASE_URL = String(process.env.QINIU_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')

  R2_ACCOUNT_ID = String(process.env.R2_ACCOUNT_ID || '').trim()
  R2_ACCESS_KEY_ID = String(process.env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY || '').trim()
  R2_SECRET_ACCESS_KEY = String(process.env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_KEY || '').trim()
  R2_BUCKET = String(process.env.R2_BUCKET || '').trim()
  R2_ENDPOINT = String(
    process.env.R2_ENDPOINT ||
      (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : '')
  )
    .trim()
    .replace(/\/$/, '')
  R2_KEY_PREFIX = String(process.env.R2_KEY_PREFIX || 'music-archive')
    .trim()
    .replace(/^\/+|\/+$/g, '') || 'music-archive'
  R2_PUBLIC_BASE_URL = String(process.env.R2_PUBLIC_BASE_URL || '').trim().replace(/\/$/, '')

  PUBLIC_BASE_URL = String(
    process.env.MUSIC_PLAYER_AUDIO_ARCHIVE_PUBLIC_BASE_URL ||
      (AUDIO_STORAGE_PROVIDER === 'qiniu' ? QINIU_PUBLIC_BASE_URL : '') ||
      (AUDIO_STORAGE_PROVIDER === 'r2' ? R2_PUBLIC_BASE_URL : '') ||
      QINIU_PUBLIC_BASE_URL ||
      COS_PUBLIC_BASE_URL ||
      (SITE_LINK ? `${SITE_LINK}/music-archive` : '/music-archive')
  )

    .trim()
    .replace(/\/$/, '')
}

const parseArgs = argv => {
  const options = {
    force: false,
    dryRun: false,
    limit: 0,
    pageId: '',
    sourceUrl: '',
    trackId: '',
    songUrl: '',
    playlistId: ''
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--force') options.force = true
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--pageId') options.pageId = String(argv[index + 1] || '').trim()
    else if (arg === '--limit') options.limit = Number(argv[index + 1] || 0) || 0
    else if (arg === '--sourceUrl') options.sourceUrl = String(argv[index + 1] || '').trim()
    else if (arg === '--trackId') options.trackId = String(argv[index + 1] || '').trim()
    else if (arg === '--songUrl') options.songUrl = String(argv[index + 1] || '').trim()
    else if (arg === '--playlistId') options.playlistId = String(argv[index + 1] || '').trim()
  }

  return options
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const withTimeout = async (fn, timeoutMs) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fn(controller.signal)
  } finally {
    clearTimeout(timeoutId)
  }
}

const notionRequest = async (url, init = {}, timeoutMs = REQUEST_TIMEOUT_MS) => {
  if (!NOTION_TOKEN) {
    throw new Error('NOTION_ACCESS_TOKEN 未配置')
  }

  return withTimeout(
    signal =>
      fetch(url, {
        ...init,
        signal,
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
          ...(init.headers || {})
        }
      }),
    timeoutMs
  )
}

const readPlainText = property => {
  if (!property) return ''
  if (typeof property.plain_text === 'string') return property.plain_text
  if (typeof property.url === 'string') return property.url
  if (typeof property.email === 'string') return property.email
  if (typeof property.phone_number === 'string') return property.phone_number
  if (typeof property.number === 'number') return String(property.number)
  if (typeof property.checkbox === 'boolean') return String(property.checkbox)
  if (typeof property.formula?.string === 'string') return property.formula.string
  if (typeof property.formula?.number === 'number') return String(property.formula.number)
  if (typeof property.formula?.boolean === 'boolean') return String(property.formula.boolean)
  if (typeof property.rollup?.number === 'number') return String(property.rollup.number)
  if (typeof property.select?.name === 'string') return property.select.name
  if (typeof property.status?.name === 'string') return property.status.name
  if (Array.isArray(property.title)) {
    return property.title.map(item => item?.plain_text || '').join('').trim()
  }
  if (Array.isArray(property.rich_text)) {
    return property.rich_text.map(item => item?.plain_text || '').join('').trim()
  }
  return ''
}

const readUrl = property => {
  if (!property) return ''
  return (
    property.url ||
    property.files?.[0]?.file?.url ||
    property.files?.[0]?.external?.url ||
    property.formula?.string ||
    readPlainText(property) ||
    ''
  )
}

const pickProperty = (properties = {}, names = []) => {
  for (const name of names) {
    if (properties?.[name]) return { name, property: properties[name] }
  }
  return { name: '', property: null }
}

const pickValue = (properties = {}, names = [], reader = readPlainText) => {
  const { property } = pickProperty(properties, names)
  return reader(property)
}

const isDirectoryLikeAudioValue = value => {
  const normalized = String(value || '').trim().split('?')[0]
  return Boolean(normalized && /\/$/.test(normalized))
}

const normalizeAudioKey = rawUrl => {
  if (!rawUrl) return ''
  const cleanUrl = String(rawUrl).trim().split('?')[0]
  if (!cleanUrl || isDirectoryLikeAudioValue(cleanUrl)) return ''

  try {
    const u = new URL(cleanUrl)
    const filename = u.pathname.split('/').pop()
    return filename ? decodeURIComponent(filename) : ''
  } catch {
    const filename = cleanUrl.split('/').pop()
    return filename ? decodeURIComponent(filename) : ''
  }
}

const normalizeTrackId = rawId => String(rawId || '').trim()

const extractTrackId = rawValue => {
  const value = String(rawValue || '').trim()
  if (!value) return ''
  if (/^\d+$/.test(value)) return value

  try {
    const parsedUrl = new URL(value)
    const urlTrackId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('songId')
    if (urlTrackId && /^\d+$/.test(urlTrackId)) {
      return urlTrackId
    }
  } catch {
    const matched = value.match(/(?:id=|song\/)(\d{5,})/i)
    if (matched?.[1]) {
      return matched[1]
    }
  }

  return ''
}

const extractPlaylistId = rawValue => {
  const value = String(rawValue || '').trim()
  if (!value) return ''
  if (/^\d+$/.test(value)) return value

  try {
    const parsedUrl = new URL(value)
    const playlistId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('playlistId')
    if (playlistId && /^\d+$/.test(playlistId)) {
      return playlistId
    }
  } catch {
    const matched = value.match(/(?:playlist\?id=|playlistId=)(\d{5,})/i)
    if (matched?.[1]) {
      return matched[1]
    }
  }

  return ''
}

const isLikelyNotionSignedUrl = rawUrl => {
  const value = String(rawUrl || '').trim()
  return /notion\.so/i.test(value) || /notion-static\.com/i.test(value)
}

const hasRealTrackId = rawTrackId => {
  const value = normalizeTrackId(rawTrackId)
  return Boolean(value && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
}

const normalizeTrackLookupPart = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_()[\]{}'"`·,，。！？!?:：；/\\]+/g, '')

const MANUAL_TRACK_ID_MAP = new Map(
  [
    { album: '幸福永不落幕', artist: '终极暴龙兽', trackId: '2710156169', name: '幸福永不落幕' },
    { album: '末日', artist: '终极暴龙兽', trackId: '2108983544', name: '末日' },
    { album: 'NEVER ENOUGH (Bonus Version)', artist: 'Daniel Caesar', trackId: '2037842140', name: 'Let Me Go' },
    { album: '路灯下的拥吻', artist: '终极暴龙兽', trackId: '2025984252', name: '路灯下的拥吻' },
    { album: '一抽屉的忧愁', artist: '终极暴龙兽', trackId: '2056956729', name: '一抽屉的忧愁' },
    { album: 'NEVER ENOUGH (Bonus Version)', artist: 'Daniel Caesar', trackId: '2037843140', name: 'Always' },
    { album: 'NEVER ENOUGH (Bonus Version)', artist: 'Daniel Caesar', trackId: '2037843139', name: 'Do You Like Me?' },
    { album: 'Son Of Spergy', artist: 'Daniel Caesar', trackId: '2758268699', name: 'Who Knows' }
  ].map(item => [[item.name, item.artist, item.album].map(normalizeTrackLookupPart).join('::'), item.trackId])
)

const resolveTrackId = ({ rawTrackId, title, artist, album }) => {
  const normalizedTrackId = normalizeTrackId(rawTrackId)
  if (hasRealTrackId(normalizedTrackId)) {
    return { trackId: normalizedTrackId, source: 'notion' }
  }

  const mappedTrackId = MANUAL_TRACK_ID_MAP.get(
    [title, artist, album].map(normalizeTrackLookupPart).join('::')
  )

  if (mappedTrackId) {
    return { trackId: mappedTrackId, source: 'manual-map' }
  }

  return { trackId: '', source: normalizedTrackId ? 'invalid' : 'missing' }
}

const hasCosStorageConfigured = () =>
  Boolean(COS_SECRET_ID && COS_SECRET_KEY && COS_BUCKET && COS_REGION && COS_PUBLIC_BASE_URL)

const hasQiniuStorageConfigured = () =>
  Boolean(QINIU_ACCESS_KEY && QINIU_SECRET_KEY && QINIU_BUCKET && QINIU_UPLOAD_URL && QINIU_PUBLIC_BASE_URL)

const hasR2StorageConfigured = () =>
  Boolean(R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET && R2_ENDPOINT && R2_PUBLIC_BASE_URL)

const getConfiguredStorageProvider = () => {
  if (AUDIO_STORAGE_PROVIDER === 'qiniu' && hasQiniuStorageConfigured()) return 'qiniu'
  if (AUDIO_STORAGE_PROVIDER === 'r2' && hasR2StorageConfigured()) return 'r2'
  if (AUDIO_STORAGE_PROVIDER === 'cos' && hasCosStorageConfigured()) return 'cos'
  if (AUDIO_STORAGE_PROVIDER === 'local') return 'local'
  if (hasQiniuStorageConfigured()) return 'qiniu'
  if (hasR2StorageConfigured()) return 'r2'
  if (hasCosStorageConfigured()) return 'cos'
  return 'local'
}

const getStorageProviderLabel = () => {
  const provider = getConfiguredStorageProvider()
  if (provider === 'qiniu') return 'qiniu-kodo'
  if (provider === 'r2') return 'cloudflare-r2'
  if (provider === 'cos') return 'tencent-cos'
  return 'local'
}

const getStorageProviderDiagnostics = () => {
  const cosAvailable = hasCosStorageConfigured()
  const qiniuAvailable = hasQiniuStorageConfigured()
  const r2Available = hasR2StorageConfigured()

  return {
    configuredProvider: AUDIO_STORAGE_PROVIDER || 'auto',
    activeProvider: getConfiguredStorageProvider(),
    providers: {
      local: {
        available: true,
        reason: 'local storage is always available'
      },
      cos: {
        available: cosAvailable,
        reason: cosAvailable
          ? 'configured'
          : 'missing TENCENT_COS_SECRET_ID/TENCENT_COS_SECRET_KEY/TENCENT_COS_BUCKET/TENCENT_COS_REGION/TENCENT_COS_PUBLIC_BASE_URL'
      },
      qiniu: {
        available: qiniuAvailable,
        reason: qiniuAvailable
          ? 'configured'
          : 'missing QINIU_ACCESS_KEY/QINIU_SECRET_KEY/QINIU_BUCKET/QINIU_UPLOAD_URL(or QINIU_REGION)/QINIU_PUBLIC_BASE_URL'
      },
      r2: {
        available: r2Available,
        reason: r2Available
          ? 'configured'
          : 'missing R2_ACCESS_KEY_ID/R2_SECRET_ACCESS_KEY/R2_BUCKET/R2_ENDPOINT/R2_PUBLIC_BASE_URL'
      }
    }
  }
}

const buildStorageObjectKey = filename => {
  const provider = getConfiguredStorageProvider()
  const keyPrefix = provider === 'r2' ? R2_KEY_PREFIX : provider === 'qiniu' ? QINIU_KEY_PREFIX : COS_KEY_PREFIX
  return `${keyPrefix}/${filename}`.replace(/^\/+/, '')
}

const buildStorageArchivePath = ({ provider, objectKey, filename }) => {
  if (provider === 'qiniu') return `qiniu://${QINIU_BUCKET}/${objectKey}`
  if (provider === 'r2') return `r2://${R2_BUCKET}/${objectKey}`
  if (provider === 'cos') return `cos://${COS_BUCKET}/${objectKey}`
  return path.join(ARCHIVE_DIR, filename)
}

const buildStoragePublicUrl = ({ provider, objectKey, filename }) => {
  if (provider === 'qiniu') return `${QINIU_PUBLIC_BASE_URL}/${objectKey}`
  if (provider === 'r2') return `${R2_PUBLIC_BASE_URL}/${objectKey}`
  if (provider === 'cos') return `${COS_PUBLIC_BASE_URL}/${objectKey}`
  return `${PUBLIC_BASE_URL}/${filename}`
}


const sha1 = value => crypto.createHash('sha1').update(value).digest('hex')

const hmacSha1 = (key, value, encoding) => crypto.createHmac('sha1', key).update(value).digest(encoding)

const hmacSha256 = (key, value, encoding) => crypto.createHmac('sha256', key).update(value).digest(encoding)

const uploadBufferToCos = async ({ objectKey, buffer, contentType }) => {
  if (!hasCosStorageConfigured()) {
    throw new Error('腾讯云 COS 未配置完整，无法上传')
  }

  const host = `${COS_BUCKET}.cos.${COS_REGION}.myqcloud.com`
  const encodedObjectKey = objectKey
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/')
  const pathname = `/${encodedObjectKey}`
  const url = `https://${host}${pathname}`
  const keyTimeStart = Math.floor(Date.now() / 1000) - 60
  const keyTimeEnd = keyTimeStart + 3600
  const keyTime = `${keyTimeStart};${keyTimeEnd}`
  const signKey = hmacSha1(COS_SECRET_KEY, keyTime, 'hex')
  const httpString = `put\n${decodeURIComponent(pathname)}\n\ncontent-length=${buffer.length}&content-type=${encodeURIComponent(
    contentType
  )}&host=${host}\n`
  const httpStringHash = sha1(httpString)
  const stringToSign = `sha1\n${keyTime}\n${httpStringHash}\n`
  const signature = hmacSha1(signKey, stringToSign, 'hex')
  const authorization =
    `q-sign-algorithm=sha1&q-ak=${COS_SECRET_ID}&q-sign-time=${keyTime}&q-key-time=${keyTime}` +
    `&q-header-list=content-length;content-type;host&q-url-param-list=&q-signature=${signature}`

  const response = await withTimeout(
    signal =>
      fetch(url, {
        method: 'PUT',
        headers: {
          Host: host,
          'Content-Type': contentType,
          'Content-Length': String(buffer.length),
          Authorization: authorization
        },
        body: buffer,
        signal
      }),
    REQUEST_TIMEOUT_MS
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`COS 上传失败: ${response.status} ${body.slice(0, 200)}`.trim())
  }
}

const uploadBufferToR2 = async ({ objectKey, buffer, contentType }) => {
  if (!hasR2StorageConfigured()) {
    throw new Error('Cloudflare R2 未配置完整，无法上传')
  }

  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`
  const urlObject = new URL(url)
  const isoDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const amzDate = isoDate.slice(0, 15) + 'Z'
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex')
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders = `host:${urlObject.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
  const canonicalRequest = [
    'PUT',
    urlObject.pathname,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join('\n')
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex')
  ].join('\n')
  const kDate = hmacSha256(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp)
  const kRegion = hmacSha256(kDate, 'auto')
  const kService = hmacSha256(kRegion, 's3')
  const kSigning = hmacSha256(kService, 'aws4_request')
  const signature = hmacSha256(kSigning, stringToSign, 'hex')
  const authorization = `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  const response = await withTimeout(
    signal =>
      fetch(url, {
        method: 'PUT',
        headers: {
          Host: urlObject.host,
          'Content-Type': contentType,
          'Content-Length': String(buffer.length),
          'x-amz-content-sha256': payloadHash,
          'x-amz-date': amzDate,
          Authorization: authorization
        },
        body: buffer,
        signal
      }),
    REQUEST_TIMEOUT_MS
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`R2 上传失败: ${response.status} ${body.slice(0, 200)}`.trim())
  }
}

const uploadBufferToQiniu = async ({ objectKey, buffer, contentType }) => {
  if (!hasQiniuStorageConfigured()) {
    throw new Error('七牛云 Kodo 未配置完整，无法上传')
  }

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
  formData.append('file', new Blob([buffer], { type: contentType || 'application/octet-stream' }), objectKey)

  const response = await withTimeout(
    signal =>
      fetch(QINIU_UPLOAD_URL, {
        method: 'POST',
        headers: {
          Authorization: `UpToken ${uploadToken}`
        },
        body: formData,
        signal
      }),
    REQUEST_TIMEOUT_MS
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`七牛云上传失败: ${response.status} ${body.slice(0, 200)}`.trim())
  }
}

const writeArchiveTarget = async ({ filename, buffer, contentType }) => {
  const provider = getConfiguredStorageProvider()

  if (provider === 'cos' || provider === 'r2' || provider === 'qiniu') {
    const objectKey = buildStorageObjectKey(filename)
    if (provider === 'cos') {
      await uploadBufferToCos({ objectKey, buffer, contentType })
    } else if (provider === 'r2') {
      await uploadBufferToR2({ objectKey, buffer, contentType })
    } else {
      await uploadBufferToQiniu({ objectKey, buffer, contentType })
    }
    return {
      archivedAudioUrl: buildStoragePublicUrl({ provider, objectKey, filename }),
      archivePath: buildStorageArchivePath({ provider, objectKey, filename }),
      storageType: provider
    }
  }


  const archivePath = path.join(ARCHIVE_DIR, filename)
  await fs.mkdir(ARCHIVE_DIR, { recursive: true })
  await fs.writeFile(archivePath, buffer)

  return {
    archivedAudioUrl: buildStoragePublicUrl({ provider, objectKey: '', filename }),
    archivePath,
    storageType: provider
  }
}

const sanitizeFileSegment = value =>
  String(value || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

const inferExtension = (sourceUrl, contentType = '') => {
  const lowerContentType = String(contentType || '').toLowerCase()
  const contentTypeMap = {
    'audio/mpeg': '.mp3',
    'audio/mp3': '.mp3',
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/flac': '.flac',
    'audio/x-flac': '.flac',
    'audio/aac': '.aac',
    'audio/mp4': '.m4a',
    'audio/x-m4a': '.m4a',
    'audio/ogg': '.ogg',
    'audio/webm': '.webm'
  }

  if (contentTypeMap[lowerContentType]) {
    return contentTypeMap[lowerContentType]
  }

  try {
    const pathname = new URL(sourceUrl).pathname
    const ext = path.extname(pathname)
    if (ext) return ext.toLowerCase()
  } catch {
    const ext = path.extname(String(sourceUrl || ''))
    if (ext) return ext.toLowerCase()
  }

  return '.mp3'
}

const formatUrlOrigin = rawUrl => {
  try {
    return new URL(rawUrl).origin
  } catch {
    return SITE_LINK || ''
  }
}

const buildMetingApiCandidates = query =>
  METING_API_BASE_CANDIDATES.map(baseUrl => ({
    baseUrl,
    url: `${baseUrl}?${query}`
  }))

const requestMetingJson = async query => {
  const candidates = buildMetingApiCandidates(query)
  let lastError = null

  for (const candidate of candidates) {
    try {
      const response = await withTimeout(
        signal =>
          fetch(candidate.url, {
            headers: {
              'User-Agent': USER_AGENT,
              Accept: 'application/json'
            },
            signal
          }),
        REQUEST_TIMEOUT_MS
      )

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        const error = new Error(`Meting 请求失败: ${response.status} ${payload?.error || ''}`.trim())
        error.status = response.status
        error.payload = payload
        error.baseUrl = candidate.baseUrl
        throw error
      }

      return {
        baseUrl: candidate.baseUrl,
        payload
      }
    } catch (error) {
      lastError = error
      if (error?.status && error.status < 500 && error.status !== 404) {
        throw error
      }
    }
  }

  throw lastError || new Error('Meting 请求失败')
}

const buildDownloadAttemptProfiles = sourceUrl => {

  const referer = SITE_LINK || formatUrlOrigin(sourceUrl)
  const origin = formatUrlOrigin(sourceUrl)

  return [
    {
      name: 'browser-basic',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: referer,
        Origin: origin,
        Connection: 'keep-alive'
      }
    },
    {
      name: 'browser-range',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: referer,
        Origin: origin,
        Range: 'bytes=0-',
        Connection: 'keep-alive'
      }
    },
    {
      name: 'audio-focused',
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'audio/*,*/*;q=0.9',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        Referer: referer,
        Origin: origin,
        Range: 'bytes=0-',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
      }
    }
  ]
}

const refreshAudioSourceViaMeting = async ({ trackId }) => {
  const normalizedTrackId = normalizeTrackId(trackId)
  if (!normalizedTrackId || METING_API_BASE_CANDIDATES.length === 0) {
    return null
  }

  const { payload } = await requestMetingJson(
    `url=${encodeURIComponent(normalizedTrackId)}&forceRefresh=1`
  )

  const refreshedTrack = Array.isArray(payload?.tracks) ? payload.tracks[0] : null

  const refreshedUrl = String(refreshedTrack?.meta?.sourceUrl || refreshedTrack?.url || '').trim()
  if (!refreshedUrl) {
    return null
  }

  return {
    sourceAudioUrl: refreshedUrl,
    metingTrackUrl: String(refreshedTrack?.url || '').trim(),
    requestId: payload?.meta?.requestId || null
  }
}

const fetchTrackMetaViaMeting = async ({ trackId }) => {
  const normalizedTrackId = normalizeTrackId(trackId)
  if (!normalizedTrackId || METING_API_BASE_CANDIDATES.length === 0) {
    return null
  }

  const { payload } = await requestMetingJson(
    `url=${encodeURIComponent(normalizedTrackId)}&forceRefresh=1`
  )

  const track = Array.isArray(payload?.tracks) ? payload.tracks[0] : null
  if (!track) {
    return null
  }

  return {
    trackId: normalizedTrackId,
    title: String(track?.name || '').trim(),
    artist: String(track?.artist || '').trim(),
    album: String(track?.album || '').trim(),
    sourceAudioUrl: String(track?.meta?.sourceUrl || track?.url || '').trim(),
    metingTrackUrl: String(track?.url || '').trim(),
    cover: String(track?.cover || '').trim(),
    lrc: String(track?.lrc || '').trim(),
    requestId: payload?.meta?.requestId || null
  }
}


const fetchPlaylistTracksViaMeting = async ({ playlistId, limit = 0 }) => {
  const normalizedPlaylistId = String(playlistId || '').trim()
  if (!normalizedPlaylistId || METING_API_BASE_CANDIDATES.length === 0) {
    return null
  }

  const { payload } = await requestMetingJson(
    `playlistId=${encodeURIComponent(normalizedPlaylistId)}&forceRefresh=1&includeArchivePool=0`
  )


  const tracks = Array.isArray(payload?.tracks) ? payload.tracks : []

  return {
    playlist: payload?.meta?.playlist || null,
    tracks: limit > 0 ? tracks.slice(0, limit) : tracks
  }
}

const queryDatabasePages = async ({ databaseId, filter }) => {
  if (!databaseId) {
    throw new Error('数据库 ID 未配置')
  }

  const results = []
  let nextCursor

  while (true) {
    const response = await notionRequest(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        ...(filter ? { filter } : {}),
        ...(nextCursor ? { start_cursor: nextCursor } : {})
      })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(`查询数据库失败: ${response.status} ${data?.message || ''}`.trim())
    }

    results.push(...(data.results || []))
    if (!data.has_more || !data.next_cursor) {
      break
    }
    nextCursor = data.next_cursor
  }

  return results
}

const queryAudioMetaPages = async () => queryDatabasePages({ databaseId: AUDIO_META_DB_ID })

const queryArchivePages = async () => queryDatabasePages({ databaseId: ARCHIVE_DB_ID })

const getDatabaseInfo = async databaseId => {
  const response = await notionRequest(`https://api.notion.com/v1/databases/${databaseId}`, {
    method: 'GET'
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`读取数据库结构失败: ${response.status} ${data?.message || ''}`.trim())
  }

  return data
}

const pickSchemaEntry = (schema = {}, names = []) => {
  for (const name of names) {
    if (schema?.[name]) {
      return { name, property: schema[name] }
    }
  }
  return { name: '', property: null }
}

const getTitlePropertyName = schema => {
  for (const [name, property] of Object.entries(schema || {})) {
    if (property?.type === 'title') return name
  }
  return 'Name'
}

const buildArchiveIndex = pages => {
  const byPageId = {}
  const byAudioKey = {}
  const byName = {}
  const byTrackId = {}

  for (const page of pages || []) {
    const properties = page?.properties || {}
    const audioKey = normalizeAudioKey(
      pickValue(properties, ['AudioKey', '音频Key'], readPlainText) ||
        pickValue(properties, ['OriginalSourceUrl', 'SourceAudioUrl', 'OriginAudioUrl'], readUrl) ||
        pickValue(properties, ['ArchivedAudioUrl', 'StableAudioUrl'], readUrl)
    )
    const name = String(pickValue(properties, ['Name', 'Title']) || '')
      .trim()
      .toLowerCase()
    const sourcePageId = String(pickValue(properties, ['SourcePageId', 'AudioMetaPageId', 'ArticleAudioPageId']) || '').trim()
    const trackId = normalizeTrackId(
      pickValue(properties, ['TrackId', 'SourceTrackId', 'SongId', 'MetingId'])
    )

    if (sourcePageId) byPageId[sourcePageId] = page
    if (audioKey) byAudioKey[audioKey] = page
    if (name) byName[name] = page
    if (trackId) byTrackId[trackId] = page
  }

  return { byPageId, byAudioKey, byName, byTrackId }
}

const resolveArchiveIdentity = ({ page, title, sourceAudioUrl, sourcePageId = '', trackId = '' }) => {
  const name = String(title || '').trim() || `audio-${String(sourcePageId || page?.id || trackId).slice(0, 8)}`
  const audioKey = normalizeAudioKey(sourceAudioUrl)
  return {
    name,
    audioKey,
    sourcePageId: String(sourcePageId || page?.id || '').trim(),
    trackId: normalizeTrackId(trackId)
  }
}

const isArchivePageCompleted = archivePage => {
  const properties = archivePage?.properties || {}
  const archiveStatus = String(pickValue(properties, ['ArchiveStatus', 'Status']) || '').trim().toLowerCase()
  const archivedAudioUrl = String(
    pickValue(properties, ['ArchivedAudioUrl', 'StableAudioUrl'], readUrl) || ''
  ).trim()

  return archiveStatus === ARCHIVE_TASK_STATUS.archived && Boolean(archivedAudioUrl)
}

const buildArchivePayload = ({ schema, identity, values }) => {
  const payload = {}
  const titlePropertyName = getTitlePropertyName(schema)

  const assignValue = (names, value) => {
    const { name, property } = pickSchemaEntry(schema, names)
    if (!name || !property) return
    const propertyValue = buildNotionPropertyValue(property, value)
    if (propertyValue) payload[name] = propertyValue
  }

  assignValue([titlePropertyName, 'Name', 'Title'], identity.name)
  assignValue(['AudioKey', '音频Key'], identity.audioKey)
  assignValue(['SourcePageId', 'AudioMetaPageId', 'ArticleAudioPageId'], identity.sourcePageId)
  assignValue(['OriginalSourceUrl', 'SourceAudioUrl', 'OriginAudioUrl'], values.originalSourceUrl)
  assignValue(['ArchivedAudioUrl', 'StableAudioUrl'], values.archivedAudioUrl)
  assignValue(['ArchiveStatus', 'Status'], values.archiveStatus)
  assignValue(['LastError', 'Error', 'ArchiveError'], values.lastError)
  assignValue(['Artist'], values.artist)
  assignValue(['Album'], values.album)
  assignValue(['TrackId', 'SourceTrackId', 'SongId', 'MetingId'], values.trackId)
  assignValue(['StorageProvider', 'StorageType'], values.storageProvider)
  assignValue(['StorageKey', 'ArchivePath'], values.storageKey)
  assignValue(['FileSize', 'Size'], values.fileSize)
  assignValue(['SourceType', 'AudioSourceType'], values.sourceType)

  return payload
}

const createArchivePage = async ({ archiveDbSchema, identity, values }) => {
  const properties = buildArchivePayload({ schema: archiveDbSchema, identity, values })
  const response = await notionRequest('https://api.notion.com/v1/pages', {
    method: 'POST',
    body: JSON.stringify({
      parent: { database_id: ARCHIVE_DB_ID },
      properties
    })
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`创建归档记录失败: ${response.status} ${data?.message || ''}`.trim())
  }

  return data
}

const updateArchivePage = async ({ archivePage, archiveDbSchema, identity, values }) => {
  if (!ARCHIVE_DB_ID) {
    return { success: false, skipped: true, error: '缺少 ArchiveDB 配置' }
  }

  const properties = buildArchivePayload({ schema: archiveDbSchema, identity, values })
  if (Object.keys(properties).length === 0) {
    return { success: false, skipped: true, error: 'ArchiveDB 中没有可写入的匹配字段' }
  }

  if (!archivePage?.id) {
    const created = await createArchivePage({ archiveDbSchema, identity, values })
    return { success: true, created: true, data: created }
  }

  const response = await notionRequest(`https://api.notion.com/v1/pages/${archivePage.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties })
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return {
      success: false,
      error: `更新归档记录失败: ${response.status} ${data?.message || ''}`.trim()
    }
  }

  return { success: true, created: false, data }
}

const buildNotionPropertyValue = (property, value) => {
  const type = property?.type || ''
  if (!type) return null

  if (type === 'url') {
    return { url: value || null }
  }
  if (type === 'rich_text' || type === 'title') {
    return {
      [type]: value
        ? [{ text: { content: String(value).slice(0, 1900) } }]
        : []
    }
  }
  if (type === 'select') {
    return { select: value ? { name: String(value).slice(0, 100) } : null }
  }
  if (type === 'status') {
    return { status: value ? { name: String(value).slice(0, 100) } : null }
  }
  if (type === 'checkbox') {
    return { checkbox: Boolean(value) }
  }
  if (type === 'number') {
    const numericValue = value === '' || value === null || value === undefined ? null : Number(value)
    return { number: Number.isFinite(numericValue) ? numericValue : null }
  }
  if (type === 'files') {
    return value
      ? {
          files: [
            {
              name: path.basename(String(value)),
              external: { url: String(value) }
            }
          ]
        }
      : { files: [] }
  }

  return {
    rich_text: value
      ? [{ text: { content: String(value).slice(0, 1900) } }]
      : []
  }
}

const downloadAudio = async sourceUrl => {
  const profiles = buildDownloadAttemptProfiles(sourceUrl)
  const errors = []

  for (const profile of profiles) {
    const response = await withTimeout(
      signal =>
        fetch(sourceUrl, {
          headers: profile.headers,
          redirect: 'follow',
          signal
        }),
      REQUEST_TIMEOUT_MS
    )

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (!buffer.length) {
        throw new Error('下载结果为空文件')
      }

      return {
        buffer,
        contentType: response.headers.get('content-type') || '',
        finalUrl: response.url || sourceUrl,
        profileName: profile.name
      }
    }

    const location = response.headers.get('location') || ''
    const contentType = response.headers.get('content-type') || ''
    errors.push(
      `${profile.name}:${response.status}${response.statusText ? ` ${response.statusText}` : ''}${
        location ? ` -> ${location}` : ''
      }${contentType ? ` [${contentType}]` : ''}`
    )

    if (![401, 403, 409, 419, 429].includes(response.status)) {
      break
    }
  }

  throw new Error(`下载失败: ${errors.join(', ') || 'unknown'}`)
}

const archiveAudioFile = async ({ page, sourceUrl, title, trackId, dryRun }) => {
  const hash = crypto.createHash('md5').update(String(page.id || sourceUrl)).digest('hex').slice(0, 8)
  const fileTitle = sanitizeFileSegment(title) || sanitizeFileSegment(trackId) || 'audio'
  const prefix = sanitizeFileSegment(trackId) || hash

  if (dryRun) {
    const fakeExt = inferExtension(sourceUrl)
    const filename = `${prefix}-${fileTitle}${fakeExt}`
    const provider = getConfiguredStorageProvider()
    const objectKey = provider === 'local' ? '' : buildStorageObjectKey(filename)
    return {
      archivedAudioUrl: buildStoragePublicUrl({ provider, objectKey, filename }),
      archivePath: buildStorageArchivePath({ provider, objectKey, filename }),
      finalUrl: sourceUrl,
      size: 0,
      downloadedFrom: sourceUrl,
      downloadProfile: 'dry-run',
      storageType: provider
    }
  }

  let effectiveSourceUrl = sourceUrl
  let downloadResult = null
  let refreshedByMeting = false

  try {
    downloadResult = await downloadAudio(effectiveSourceUrl)
  } catch (initialError) {
    if (!trackId) {
      throw initialError
    }

    const refreshedSource = await refreshAudioSourceViaMeting({ trackId }).catch(() => null)
    const refreshedUrl = refreshedSource?.sourceAudioUrl || refreshedSource?.metingTrackUrl || ''

    if (!refreshedUrl || refreshedUrl === effectiveSourceUrl) {
      throw initialError
    }

    effectiveSourceUrl = refreshedUrl
    refreshedByMeting = true
    downloadResult = await downloadAudio(effectiveSourceUrl)
  }

  const { buffer, contentType, finalUrl, profileName } = downloadResult
  const extension = inferExtension(finalUrl || effectiveSourceUrl, contentType)
  const filename = `${prefix}-${fileTitle}${extension}`
  const target = await writeArchiveTarget({
    filename,
    buffer,
    contentType: contentType || 'application/octet-stream'
  })

  return {
    archivedAudioUrl: target.archivedAudioUrl,
    archivePath: target.archivePath,
    finalUrl,
    size: buffer.length,
    downloadedFrom: effectiveSourceUrl,
    downloadProfile: profileName,
    refreshedByMeting,
    storageProvider: target.storageType,
    storageType: target.storageType
  }
}

async function runArchiveTask(customOptions = null) {
  await initializeRuntimeConfig()

  const options = customOptions || parseArgs(process.argv.slice(2))

  if (!NOTION_TOKEN) {
    throw new Error('缺少 NOTION_ACCESS_TOKEN')
  }
  if (!AUDIO_META_DB_ID) {
    throw new Error('缺少 NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID')
  }
  if (!ARCHIVE_DB_ID) {
    throw new Error('缺少 MUSIC_PLAYER_ARCHIVE_DB_ID')
  }

  console.log('开始执行音频归档任务...')
  console.log(`AudioMeta DB: ${AUDIO_META_DB_ID}`)
  console.log(`Archive DB: ${ARCHIVE_DB_ID}`)
  console.log(`Archive Dir: ${ARCHIVE_DIR}`)
  console.log(`Public Base URL: ${PUBLIC_BASE_URL}`)
  console.log(`Archive Storage: ${getStorageProviderLabel()}`)
  console.log(`Meting API: ${METING_API_BASE_URL || 'disabled'}`)
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'write'}${options.force ? ' + force' : ''}`)

  const [pages, archiveDbInfo, archivePages] = await Promise.all([
    queryAudioMetaPages(),
    getDatabaseInfo(ARCHIVE_DB_ID),
    queryArchivePages()
  ])
  const archiveDbSchema = archiveDbInfo?.properties || {}
  const archiveIndex = buildArchiveIndex(archivePages)
  const inputTrackId = extractTrackId(options.trackId || options.songUrl)
  const inputPlaylistId = extractPlaylistId(options.playlistId)

  if (inputPlaylistId) {
    const playlistData = await fetchPlaylistTracksViaMeting({ playlistId: inputPlaylistId, limit: options.limit })
    const playlistTracks = Array.isArray(playlistData?.tracks) ? playlistData.tracks : []
    const playlistMeta = playlistData?.playlist || null

    if (!playlistTracks.length) {
      throw new Error(`歌单无可归档歌曲: ${inputPlaylistId}`)
    }

    console.log(`待处理记录数: ${playlistTracks.length}`)
    if (playlistMeta?.name) {
      console.log(`歌单: ${playlistMeta.name} (${inputPlaylistId})`)
    }

    let success = 0
    let failed = 0
    let skipped = 0

    for (const [index, trackMeta] of playlistTracks.entries()) {
      const trackId = normalizeTrackId(
        trackMeta?.trackId || trackMeta?.id || trackMeta?.meta?.trackId || trackMeta?.songId || ''
      )

      const title = String(trackMeta?.title || trackMeta?.name || `track-${index + 1}`).trim()
      const artist = String(trackMeta?.artist || '').trim()
      const album = String(trackMeta?.album || trackMeta?.meta?.album || '').trim()
      const sourceAudioUrl = String(
        trackMeta?.sourceAudioUrl || trackMeta?.meta?.sourceUrl || trackMeta?.url || trackMeta?.meta?.url || ''
      ).trim()

      const syntheticPage = { id: `playlist:${inputPlaylistId}:${trackId || index}`, properties: {} }
      const identity = resolveArchiveIdentity({
        page: syntheticPage,
        title,
        sourceAudioUrl,
        sourcePageId: '',
        trackId
      })
      const archivePage =
        archiveIndex.byTrackId[identity.trackId] ||
        archiveIndex.byAudioKey[identity.audioKey] ||
        archiveIndex.byName[String(identity.name || '').trim().toLowerCase()] ||
        null

      console.log(`\n[${index + 1}/${playlistTracks.length}] ${title} (${trackId || syntheticPage.id})`)
      console.log('  来源类型: meting-playlist')
      if (artist) console.log(`  歌手: ${artist}`)
      if (album) console.log(`  专辑: ${album}`)

      if (!sourceAudioUrl) {
        skipped += 1
        console.warn('  跳过：API 未返回可用音源地址')
        continue
      }

      if (!options.force && isArchivePageCompleted(archivePage)) {
        skipped += 1
        console.log('  跳过：已存在成功归档记录')
        continue
      }

      try {
        const archiveResult = await archiveAudioFile({
          page: syntheticPage,
          sourceUrl: sourceAudioUrl,
          title,
          trackId,
          dryRun: options.dryRun
        })

        console.log(`  归档地址: ${archiveResult.archivedAudioUrl}`)
        console.log(`  下载来源: ${archiveResult.downloadedFrom}`)
        console.log(`  下载策略: ${archiveResult.downloadProfile}`)
        console.log(`  存储提供方: ${archiveResult.storageProvider}`)
        if (!options.dryRun) {
          console.log(`  存储键: ${archiveResult.archivePath}`)
          console.log(`  文件大小: ${archiveResult.size} bytes`)
        }

        if (options.dryRun) {
          success += 1
          continue
        }

        const updateResult = await updateArchivePage({
          archivePage,
          archiveDbSchema,
          identity,
          values: {
            originalSourceUrl: sourceAudioUrl,
            archivedAudioUrl: archiveResult.archivedAudioUrl,
            archiveStatus: ARCHIVE_TASK_STATUS.archived,
            lastError: '',
            artist,
            album,
            trackId,
            storageProvider: archiveResult.storageType,
            storageKey: archiveResult.archivePath,
            fileSize: archiveResult.size,
            sourceType: 'meting-playlist'
          }
        })

        if (!updateResult.success) {
          failed += 1
          console.warn(`  回写失败: ${updateResult.error}`)
          continue
        }

        const persistedPage = updateResult?.data || archivePage
        if (persistedPage?.id) {
          if (identity.trackId) archiveIndex.byTrackId[identity.trackId] = persistedPage
          if (identity.audioKey) archiveIndex.byAudioKey[identity.audioKey] = persistedPage
          archiveIndex.byName[String(identity.name || '').trim().toLowerCase()] = persistedPage
        }

        success += 1
        console.log(`  ✅ 已${updateResult.created ? '创建' : '更新'} ArchiveDB 记录`)
        await sleep(500)
      } catch (error) {
        failed += 1
        console.error(`  ❌ 归档失败: ${error.message}`)
        if (!options.dryRun) {
          await updateArchivePage({
            archivePage,
            archiveDbSchema,
            identity,
            values: {
              originalSourceUrl: sourceAudioUrl,
              archivedAudioUrl: '',
              archiveStatus: ARCHIVE_TASK_STATUS.failed,
              lastError: String(error.message).slice(0, 1900),
              artist,
              album,
              trackId,
              storageProvider: getConfiguredStorageProvider(),
              storageKey: '',
              fileSize: '',
              sourceType: 'meting-playlist'
            }
          }).catch(() => null)
        }
      }
    }

    console.log('\n任务完成')
    console.log(`成功: ${success}`)
    console.log(`失败: ${failed}`)
    console.log(`跳过: ${skipped}`)
    return
  }

  if (inputTrackId) {
    const trackMeta = await fetchTrackMetaViaMeting({ trackId: inputTrackId })
    if (!trackMeta?.sourceAudioUrl) {
      throw new Error(`无法通过 Meting 获取歌曲音源: ${inputTrackId}`)
    }

    const syntheticPage = { id: `track:${inputTrackId}`, properties: {} }
    const identity = resolveArchiveIdentity({
      page: syntheticPage,
      title: trackMeta.title || `track-${inputTrackId}`,
      sourceAudioUrl: trackMeta.sourceAudioUrl,
      sourcePageId: '',
      trackId: inputTrackId
    })
    const archivePage =
      archiveIndex.byTrackId[inputTrackId] ||
      archiveIndex.byAudioKey[identity.audioKey] ||
      archiveIndex.byName[String(identity.name || '').trim().toLowerCase()] ||
      null

    console.log('待处理记录数: 1')
    console.log(`\n[1/1] ${trackMeta.title || inputTrackId} (${inputTrackId})`)
    console.log('  来源类型: meting-track')
    if (trackMeta.artist) console.log(`  歌手: ${trackMeta.artist}`)
    if (trackMeta.album) console.log(`  专辑: ${trackMeta.album}`)

    if (!options.force && isArchivePageCompleted(archivePage)) {
      console.log('  跳过：已存在成功归档记录')
      console.log('\n任务完成')
      console.log('成功: 0')
      console.log('失败: 0')
      console.log('跳过: 1')
      return
    }

    try {
      const archiveResult = await archiveAudioFile({
        page: syntheticPage,
        sourceUrl: trackMeta.sourceAudioUrl,
        title: trackMeta.title || `track-${inputTrackId}`,
        trackId: inputTrackId,
        dryRun: options.dryRun
      })

      console.log(`  归档地址: ${archiveResult.archivedAudioUrl}`)
      console.log(`  下载来源: ${archiveResult.downloadedFrom}`)
      console.log(`  下载策略: ${archiveResult.downloadProfile}`)
      console.log(`  存储提供方: ${archiveResult.storageProvider}`)
      if (!options.dryRun) {
        console.log(`  存储键: ${archiveResult.archivePath}`)
        console.log(`  文件大小: ${archiveResult.size} bytes`)
      }

      if (!options.dryRun) {
        const updateResult = await updateArchivePage({
          archivePage,
          archiveDbSchema,
          identity,
          values: {
            originalSourceUrl: trackMeta.sourceAudioUrl,
            archivedAudioUrl: archiveResult.archivedAudioUrl,
            archiveStatus: ARCHIVE_TASK_STATUS.archived,
            lastError: '',
            artist: trackMeta.artist,
            album: trackMeta.album,
            trackId: inputTrackId,
            storageProvider: archiveResult.storageType,
            storageKey: archiveResult.archivePath,
            fileSize: archiveResult.size,
            sourceType: 'meting-track'
          }
        })

        if (!updateResult.success) {
          throw new Error(updateResult.error || 'ArchiveDB 写入失败')
        }
        console.log(`  ✅ 已${updateResult.created ? '创建' : '更新'} ArchiveDB 记录`)
      }

      console.log('\n任务完成')
      console.log('成功: 1')
      console.log('失败: 0')
      console.log('跳过: 0')
      return
    } catch (error) {
      if (!options.dryRun) {
        await updateArchivePage({
          archivePage,
          archiveDbSchema,
          identity,
          values: {
            originalSourceUrl: trackMeta.sourceAudioUrl,
            archivedAudioUrl: '',
            archiveStatus: ARCHIVE_TASK_STATUS.failed,
            lastError: String(error.message).slice(0, 1900),
            artist: trackMeta.artist,
            album: trackMeta.album,
            trackId: inputTrackId,
            storageProvider: getConfiguredStorageProvider(),
            storageKey: '',
            fileSize: '',
            sourceType: 'meting-track'
          }
        }).catch(() => null)
      }
      throw error
    }
  }

  const filteredPages = pages
    .filter(page => !options.pageId || page.id === options.pageId)
    .filter(page => {
      if (options.force) return true
      const properties = page.properties || {}
      const title = pickValue(properties, ['Name', 'Title']) || ''
      const rawTrackId = pickValue(properties, ['TrackId', 'SourceTrackId', 'SongId', 'MetingId'])
      const trackId = resolveTrackId({
        rawTrackId,
        title,
        artist: pickValue(properties, ['Artist']),
        album: pickValue(properties, ['Album'])
      }).trackId
      const sourceAudioUrl =
        options.sourceUrl ||
        pickValue(properties, ['SourceAudioUrl', 'OriginAudioUrl'], readUrl) ||
        pickValue(properties, ['AudioUrl'], readUrl)
      const identity = resolveArchiveIdentity({ page, title, sourceAudioUrl, trackId })
      return !(
        archiveIndex.byPageId[identity.sourcePageId] ||
        archiveIndex.byTrackId[identity.trackId] ||
        archiveIndex.byAudioKey[identity.audioKey] ||
        archiveIndex.byName[String(identity.name || '').trim().toLowerCase()]
      )
    })

  const targetPages = options.limit > 0 ? filteredPages.slice(0, options.limit) : filteredPages
  console.log(`待处理记录数: ${targetPages.length}`)

  let success = 0
  let failed = 0
  let skipped = 0

  for (const [index, page] of targetPages.entries()) {
    const properties = page.properties || {}
    const title = pickValue(properties, ['Name', 'Title']) || `audio-${index + 1}`
    const artist = pickValue(properties, ['Artist'])
    const album = pickValue(properties, ['Album'])
    const rawTrackId = pickValue(properties, ['TrackId', 'SourceTrackId', 'SongId', 'MetingId'])
    const resolvedTrack = resolveTrackId({ rawTrackId, title, artist, album })
    const trackId = resolvedTrack.trackId
    const sourceAudioUrl =
      options.sourceUrl ||
      pickValue(properties, ['SourceAudioUrl', 'OriginAudioUrl'], readUrl) ||
      pickValue(properties, ['AudioUrl'], readUrl)
    const sourceKind = options.sourceUrl
      ? 'manual-override'
      : isLikelyNotionSignedUrl(sourceAudioUrl)
        ? 'notion-temp'
        : 'direct'
    const identity = resolveArchiveIdentity({ page, title, sourceAudioUrl, trackId })
    const archivePage =
      archiveIndex.byPageId[identity.sourcePageId] ||
      archiveIndex.byTrackId[identity.trackId] ||
      archiveIndex.byAudioKey[identity.audioKey] ||
      archiveIndex.byName[String(identity.name || '').trim().toLowerCase()] ||
      null

    console.log(`\n[${index + 1}/${targetPages.length}] ${title} (${trackId || page.id})`)

    if (!sourceAudioUrl) {
      skipped += 1
      console.warn('  跳过：缺少源音频地址')
      continue
    }

    if (options.sourceUrl) {
      console.log('  已使用命令行 sourceUrl 覆盖数据库源地址')
    }
    console.log(`  来源类型: ${sourceKind}`)
    if (artist) {
      console.log(`  歌手: ${artist}`)
    }
    if (album) {
      console.log(`  专辑: ${album}`)
    }
    if (resolvedTrack.source === 'manual-map') {
      console.log(`  TrackId 已通过手动映射补全: ${trackId}`)
    }
    if (sourceKind === 'notion-temp' && !trackId) {
      console.warn('  警告：当前仅有 Notion 临时文件地址，且缺少可用于 /api/meting 刷新的真实 TrackId')
    }

    try {
      const archiveResult = await archiveAudioFile({
        page,
        sourceUrl: sourceAudioUrl,
        title,
        trackId,
        dryRun: options.dryRun
      })

      console.log(`  归档地址: ${archiveResult.archivedAudioUrl}`)
      console.log(`  下载来源: ${archiveResult.downloadedFrom}`)
      console.log(`  下载策略: ${archiveResult.downloadProfile}`)
      console.log(`  存储提供方: ${archiveResult.storageProvider}`)
      if (archiveResult.refreshedByMeting) {
        console.log('  已通过 /api/meting 刷新源直链')
      }
      if (!options.dryRun) {
        console.log(`  存储键: ${archiveResult.archivePath}`)
        console.log(`  文件大小: ${archiveResult.size} bytes`)
      }

      if (options.dryRun) {
        success += 1
        continue
      }

      const updateResult = await updateArchivePage({
        archivePage,
        archiveDbSchema,
        identity,
        values: {
          originalSourceUrl: sourceAudioUrl,
          archivedAudioUrl: archiveResult.archivedAudioUrl,
          archiveStatus: ARCHIVE_TASK_STATUS.archived,
          lastError: '',
          artist,
          album,
          trackId,
          storageProvider: archiveResult.storageProvider,
          storageKey: archiveResult.archivePath,
          fileSize: archiveResult.size,
          sourceType: sourceKind
        }
      })

      if (!updateResult.success) {
        failed += 1
        console.warn(`  回写失败: ${updateResult.error}`)
        continue
      }

      const persistedPage = updateResult?.data || archivePage
      if (persistedPage?.id) {
        if (identity.sourcePageId) archiveIndex.byPageId[identity.sourcePageId] = persistedPage
        if (identity.trackId) archiveIndex.byTrackId[identity.trackId] = persistedPage
        if (identity.audioKey) archiveIndex.byAudioKey[identity.audioKey] = persistedPage
        archiveIndex.byName[String(identity.name || '').trim().toLowerCase()] = persistedPage
      }

      success += 1
      console.log(`  ✅ 已${updateResult.created ? '创建' : '更新'} ArchiveDB 记录`)
      await sleep(500)
    } catch (error) {
      failed += 1
      console.error(`  ❌ 归档失败: ${error.message}`)
      if (!options.dryRun) {
        await updateArchivePage({
          archivePage,
          archiveDbSchema,
          identity,
          values: {
            originalSourceUrl: sourceAudioUrl,
            archivedAudioUrl: '',
            archiveStatus: ARCHIVE_TASK_STATUS.failed,
            lastError: String(error.message).slice(0, 1900),
            artist,
            album,
            trackId,
            storageProvider: getConfiguredStorageProvider(),
            storageKey: '',
            fileSize: '',
            sourceType: sourceKind
          }
        }).catch(() => null)
      }
    }
  }

  console.log('\n任务完成')
  console.log(`成功: ${success}`)
  console.log(`失败: ${failed}`)
  console.log(`跳过: ${skipped}`)
}

module.exports = {
  runArchiveTask,
  parseArgs,
  __internal: {
    initializeRuntimeConfig,
    extractTrackId,
    extractPlaylistId,
    resolveTrackId,
    archiveAudioFile,
    buildArchiveIndex,
    resolveArchiveIdentity,
    isArchivePageCompleted,
    buildArchivePayload,
    updateArchivePage,
    fetchTrackMetaViaMeting,
    fetchPlaylistTracksViaMeting,
    queryAudioMetaPages,
    queryArchivePages,
    hasQiniuStorageConfigured,
    hasR2StorageConfigured,
    getConfiguredStorageProvider,
    getStorageProviderLabel,
    getStorageProviderDiagnostics,
    getDatabaseInfo
  }
}

