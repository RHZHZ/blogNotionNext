import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'

// 只在服务端导入 Redis
let Redis
if (typeof window === 'undefined') {
  try {
    Redis = require('ioredis')
  } catch (e) {
    console.warn('ioredis not available:', e.message)
  }
}

export const redisClient = BLOG.REDIS_URL && Redis ? new Redis(BLOG.REDIS_URL) : {}

const cacheTime = Math.trunc(
  siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND) * 1.5
)

export async function getCache(key) {
  try {
    if (!redisClient.get) return null
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error(`redisClient读取失败 ${String(e)}`)
  }
}

export async function setCache(key, data, customCacheTime) {
  try {
    if (!redisClient.set) return
    await redisClient.set(
      key,
      JSON.stringify(data),
      'EX',
      customCacheTime || cacheTime
    )
  } catch (e) {
    console.error(`redisClient写入失败 ${String(e)}`)
  }
}

export async function delCache(key) {
  try {
    if (!redisClient.del) return
    await redisClient.del(key)
  } catch (e) {
    console.error(`redisClient删除失败 ${String(e)}`)
  }
}

export default { getCache, setCache, delCache }
