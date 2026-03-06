import { getRedisAvailability, getRedisClient } from '@/lib/server/redis'
import { getKvClient, getRestAvailability, getUpstashClient } from '@/lib/server/restStore'

const createEntry = (data, metadata = {}, timestamp = Date.now()) => ({
  data,
  timestamp,
  metadata
})

const normalizeCacheSegment = value =>
  String(value ?? '')
    .trim()
    .toLowerCase()

const normalizeProvider = provider => normalizeCacheSegment(provider) || 'memory'

const parseCacheEntry = value => {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const createRestCacheStore = (provider, client, options = {}) => {
  if (!client) {
    return createMemoryCacheStore(options.seedEntries)
  }

  const prefix = options.keyPrefix || `blognext:${provider}:cache`

  return {
    async get(key) {
      const value = await client.get(`${prefix}:${key}`)
      return parseCacheEntry(value)
    },
    async set(key, value) {
      const storeKey = `${prefix}:${key}`
      const ttl = Number(value?.metadata?.ttl ?? options.defaultTtl ?? 0)

      if (ttl > 0) {
        await client.set(storeKey, JSON.stringify(value), 'PX', ttl)
      } else {
        await client.set(storeKey, JSON.stringify(value))
      }

      return value
    },
    async delete(key) {
      return client.del(`${prefix}:${key}`)
    },
    async clear() {
      const keys = (await client.keys(`${prefix}:*`)) || []
      if (keys.length > 0) {
        await client.del(...keys)
      }
    },
    raw: client,
    provider
  }
}

const createRedisCacheStore = (options = {}) => createRestCacheStore('redis', getRedisClient(), options)
const createUpstashCacheStore = (options = {}) => createRestCacheStore('upstash', getUpstashClient(), options)
const createKvCacheStore = (options = {}) => createRestCacheStore('kv', getKvClient(), options)

export function buildMetingCacheKey({ id, level = 'standard', type = 'json' }) {
  return ['meting', normalizeCacheSegment(id), normalizeCacheSegment(level), normalizeCacheSegment(type)].join(':')
}

export function createMemoryCacheStore(seedEntries = []) {
  const map = new Map(seedEntries)
  return {
    get(key) {
      return map.get(key)
    },
    set(key, value) {
      map.set(key, value)
      return value
    },
    delete(key) {
      return map.delete(key)
    },
    clear() {
      map.clear()
    },
    entries() {
      return map.entries()
    },
    raw: map,
    provider: 'memory'
  }
}

export function createCacheStore(provider = 'memory', options = {}) {
  switch (normalizeProvider(provider)) {
    case 'memory':
      return createMemoryCacheStore(options.seedEntries)
    case 'redis':
      return createRedisCacheStore(options)
    case 'upstash':
      return createUpstashCacheStore(options)
    case 'kv':
      return createKvCacheStore(options)
    default:
      return createMemoryCacheStore(options.seedEntries)
  }
}

const resolveCacheStore = cache => {
  if (!cache || typeof cache.get !== 'function' || typeof cache.set !== 'function') {
    throw new Error('A cache store with get/set methods is required')
  }

  return cache
}

export async function getCacheEntry(cache, key, ttl) {
  const store = resolveCacheStore(cache)
  const entry = await store.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp >= ttl) {
    if (typeof store.delete === 'function') {
      await store.delete(key)
    }
    return null
  }
  return entry
}

export async function setCacheEntry(cache, key, data, metadata = {}) {
  const store = resolveCacheStore(cache)
  const ttl = Number(metadata.ttl ?? 0)
  const entry = createEntry(data, ttl > 0 ? { ...metadata, ttl } : metadata)
  await store.set(key, entry)
  return entry
}

export const __internal = {
  createEntry,
  normalizeCacheSegment,
  normalizeProvider,
  parseCacheEntry,
  resolveCacheStore,
  getRedisAvailability,
  getRestAvailability
}
