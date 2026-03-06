import BLOG from '@/blog.config'

let RedisCtor
let redisClient
let redisUnavailableReason = null

function loadRedisCtor() {
  if (RedisCtor !== undefined) return RedisCtor

  if (typeof window !== 'undefined') {
    RedisCtor = null
    redisUnavailableReason = 'client-runtime'
    return RedisCtor
  }

  try {
    // eslint-disable-next-line global-require
    RedisCtor = require('ioredis')
  } catch (error) {
    RedisCtor = null
    redisUnavailableReason = error?.message || 'ioredis-unavailable'
  }

  return RedisCtor
}

function getRedisUrl() {
  return process.env.REDIS_URL || BLOG.REDIS_URL || ''
}

export function hasRedisConfig() {
  return Boolean(getRedisUrl())
}

export function getRedisClient() {
  const redisUrl = getRedisUrl()

  if (!redisUrl) {
    redisUnavailableReason = 'missing-redis-url'
    return null
  }

  if (redisClient) return redisClient

  const Redis = loadRedisCtor()
  if (!Redis) return null

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: true
  })

  redisClient.on('error', () => {})
  return redisClient
}

export function getRedisAvailability() {
  return {
    enabled: Boolean(getRedisClient()),
    reason: redisUnavailableReason
  }
}
