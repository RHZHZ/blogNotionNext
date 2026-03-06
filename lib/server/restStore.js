import BLOG from '@/blog.config'

const getMissingReason = ({ baseUrl, token }, provider) => {
  if (!baseUrl && !token) return `missing-${provider}-config`
  if (!baseUrl) return `missing-${provider}-url`
  if (!token) return `missing-${provider}-token`
  return null
}

const createRestClient = ({ baseUrl, token, label }) => {
  if (!baseUrl || !token || typeof fetch !== 'function') {
    return null
  }

  const request = async (command, ...args) => {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/${[command, ...args].map(v => encodeURIComponent(String(v))).join('/')}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`${label} request failed: ${response.status}`)
    }

    const payload = await response.json()
    return payload?.result
  }

  return {
    get: key => request('get', key),
    set: async (key, value, mode, ttl) => {
      if (mode && ttl !== undefined) {
        return request('set', key, value, mode, ttl)
      }
      return request('set', key, value)
    },
    del: (...keys) => request('del', ...keys),
    keys: pattern => request('keys', pattern),
    pexpireat: (key, timestampMs) => request('pexpireat', key, timestampMs)
  }
}

const getUpstashConfig = () => ({
  baseUrl: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})

const getKvConfig = () => ({
  baseUrl: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || ''
})

let upstashClient
let kvClient

export function getUpstashClient() {
  if (upstashClient !== undefined) return upstashClient
  const { baseUrl, token } = getUpstashConfig()
  upstashClient = createRestClient({ baseUrl, token, label: 'upstash' })
  return upstashClient
}

export function getKvClient() {
  if (kvClient !== undefined) return kvClient
  const { baseUrl, token } = getKvConfig()
  kvClient = createRestClient({ baseUrl, token, label: 'kv' })
  return kvClient
}

export function getRestAvailability(provider) {
  switch (String(provider || '').toLowerCase()) {
    case 'upstash': {
      const config = getUpstashConfig()
      const reason = getMissingReason(config, 'upstash')
      return { enabled: !reason, reason }
    }
    case 'kv': {
      const config = getKvConfig()
      const reason = getMissingReason(config, 'kv')
      return { enabled: !reason, reason }
    }
    default:
      return { enabled: false, reason: 'unsupported-provider' }
  }
}

export const __internal = {
  createRestClient,
  getMissingReason,
  getUpstashConfig,
  getKvConfig
}
