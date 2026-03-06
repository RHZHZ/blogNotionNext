import { getRedisAvailability, getRedisClient } from '@/lib/server/redis'
import { getKvClient, getRestAvailability, getUpstashClient } from '@/lib/server/restStore'

const normalizeProvider = provider => String(provider ?? '').trim().toLowerCase() || 'memory'

const parseRedisValue = value => {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const createRestIpRateLimitStore = (provider, client, options = {}) => {
  if (!client) {
    return createMemoryIpRateLimitStore(options.seedEntries)
  }

  const prefix = options.keyPrefix || `blognext:${provider}:ratelimit:ip`

  return {
    async get(key) {
      return parseRedisValue(await client.get(`${prefix}:${key}`))
    },
    async set(key, value) {
      await client.set(`${prefix}:${key}`, JSON.stringify(value))
      return value
    },
    async delete(key) {
      return client.del(`${prefix}:${key}`)
    },
    async expireAt(key, timestampMs) {
      if (!timestampMs) return
      await client.pexpireat(`${prefix}:${key}`, timestampMs)
    },
    raw: client,
    provider
  }
}

const createRestUpstreamRateLimitStore = (provider, client, options = {}) => {
  if (!client) {
    return createMemoryUpstreamRateLimitStore(options.initialState)
  }

  const key = options.key || `blognext:${provider}:ratelimit:upstream:meting`
  const fallbackState = {
    count: 0,
    resetTime: Date.now(),
    isLimited: false,
    ...(options.initialState || {})
  }

  return {
    async getState() {
      return parseRedisValue(await client.get(key)) || { ...fallbackState }
    },
    async setState(state) {
      const nextState = { ...fallbackState, ...state }
      const ttl = Math.max(1000, Number(nextState.resetTime || Date.now()) - Date.now() + 60000)
      await client.set(key, JSON.stringify(nextState), 'PX', ttl)
      return nextState
    },
    raw: client,
    provider
  }
}

const createRedisIpRateLimitStore = (options = {}) => createRestIpRateLimitStore('redis', getRedisClient(), options)
const createUpstashIpRateLimitStore = (options = {}) => createRestIpRateLimitStore('upstash', getUpstashClient(), options)
const createKvIpRateLimitStore = (options = {}) => createRestIpRateLimitStore('kv', getKvClient(), options)

const createRedisUpstreamRateLimitStore = (options = {}) => createRestUpstreamRateLimitStore('redis', getRedisClient(), options)
const createUpstashUpstreamRateLimitStore = (options = {}) => createRestUpstreamRateLimitStore('upstash', getUpstashClient(), options)
const createKvUpstreamRateLimitStore = (options = {}) => createRestUpstreamRateLimitStore('kv', getKvClient(), options)

export function createMemoryIpRateLimitStore(seedEntries = []) {
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
    entries() {
      return map.entries()
    },
    raw: map,
    provider: 'memory'
  }
}

export function createMemoryUpstreamRateLimitStore(initialState = {}) {
  return {
    count: initialState.count || 0,
    resetTime: initialState.resetTime || Date.now(),
    isLimited: initialState.isLimited || false,
    provider: 'memory'
  }
}

export function createIpRateLimitStore(provider = 'memory', options = {}) {
  switch (normalizeProvider(provider)) {
    case 'memory':
      return createMemoryIpRateLimitStore(options.seedEntries)
    case 'redis':
      return createRedisIpRateLimitStore(options)
    case 'upstash':
      return createUpstashIpRateLimitStore(options)
    case 'kv':
      return createKvIpRateLimitStore(options)
    default:
      return createMemoryIpRateLimitStore(options.seedEntries)
  }
}

export function createUpstreamRateLimitStore(provider = 'memory', options = {}) {
  switch (normalizeProvider(provider)) {
    case 'memory':
      return createMemoryUpstreamRateLimitStore(options.initialState)
    case 'redis':
      return createRedisUpstreamRateLimitStore(options)
    case 'upstash':
      return createUpstashUpstreamRateLimitStore(options)
    case 'kv':
      return createKvUpstreamRateLimitStore(options)
    default:
      return createMemoryUpstreamRateLimitStore(options.initialState)
  }
}

const resolveEntryStore = store => {
  if (!store || typeof store.get !== 'function' || typeof store.delete !== 'function') {
    throw new Error('A rate limit entry store with get/delete methods is required')
  }

  return store
}

const resolveStateStore = store => {
  if (!store || typeof store !== 'object') {
    throw new Error('A rate limit state store is required')
  }

  return store
}

const loadState = async store => {
  if (typeof store.getState === 'function') {
    return store.getState()
  }

  return store
}

const saveState = async (store, state) => {
  if (typeof store.setState === 'function') {
    return store.setState(state)
  }

  Object.assign(store, state)
  return store
}

export async function cleanupExpiredIpLimits(ipLimits, graceMs = 60000) {
  const store = resolveEntryStore(ipLimits)
  if (typeof store.entries !== 'function') return

  const now = Date.now()
  for (const [ip, limit] of store.entries()) {
    if (now > limit.resetTime + graceMs) {
      await store.delete(ip)
    }
  }
}

export function setRateLimitHeaders(res, headers = {}) {
  if (!res?.setHeader) return

  const entries = {
    ...(headers.limit !== undefined ? { 'X-RateLimit-Limit': headers.limit } : {}),
    ...(headers.remaining !== undefined ? { 'X-RateLimit-Remaining': headers.remaining } : {}),
    ...(headers.reset !== undefined ? { 'X-RateLimit-Reset': headers.reset } : {}),
    ...(headers.retryAfter !== undefined ? { 'Retry-After': headers.retryAfter } : {})
  }

  for (const [key, value] of Object.entries(entries)) {
    res.setHeader(key, value)
  }
}

export async function checkIpRateLimit(ipLimits, config, ip, onRateLimited) {
  const store = resolveEntryStore(ipLimits)
  const now = Date.now()
  let limit = await store.get(ip)

  if (limit && now > limit.resetTime) {
    await store.delete(ip)
    limit = null
  }

  if (!limit) {
    limit = {
      count: 1,
      resetTime: now + config.windowMs,
      burstCount: config.burstLimit,
      firstRequestTime: now
    }
    await store.set(ip, limit)
    if (typeof store.expireAt === 'function') {
      await store.expireAt(ip, limit.resetTime + 60000)
    }
    return { allowed: true, remaining: config.maxRequests - 1, resetIn: config.windowMs }
  }

  if (now - limit.firstRequestTime < 1000 && limit.count > config.burstLimit) {
    onRateLimited?.()
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((limit.resetTime - now) / 1000),
      reason: '突发请求限制'
    }
  }

  if (limit.count >= config.maxRequests) {
    onRateLimited?.()
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil((limit.resetTime - now) / 1000),
      reason: '请求频率限制'
    }
  }

  limit.count++
  await store.set(ip, limit)
  if (typeof store.expireAt === 'function') {
    await store.expireAt(ip, limit.resetTime + 60000)
  }
  return {
    allowed: true,
    remaining: config.maxRequests - limit.count,
    resetIn: Math.ceil((limit.resetTime - now) / 1000)
  }
}

export async function checkUpstreamRateLimit(upstreamLimits, config, onRateLimited) {
  const store = resolveStateStore(upstreamLimits)
  const now = Date.now()
  const state = { ...(await loadState(store)) }

  if (now > state.resetTime) {
    state.count = 0
    state.resetTime = now + config.windowMs
    state.isLimited = false
  }

  if (state.isLimited) {
    const retryAfter = Math.ceil((state.resetTime - now) / 1000)
    if (retryAfter > 0) {
      await saveState(store, state)
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.max(config.retryAfterMs, retryAfter * 1000)
      }
    }
    state.isLimited = false
  }

  if (state.count >= config.maxRequests) {
    state.isLimited = true
    await saveState(store, state)
    onRateLimited?.()
    return {
      allowed: false,
      remaining: 0,
      retryAfter: config.retryAfterMs
    }
  }

  state.count++
  await saveState(store, state)
  return {
    allowed: true,
    remaining: config.maxRequests - state.count
  }
}

export const __internal = {
  normalizeProvider,
  parseRedisValue,
  resolveEntryStore,
  resolveStateStore,
  loadState,
  saveState,
  getRedisAvailability,
  getRestAvailability
}
