describe('lib/server/rateLimit', () => {
  const loadModule = async () => import('@/lib/server/rateLimit')

  beforeEach(() => {
    jest.resetModules()
    delete process.env.REDIS_URL
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  it('supports memory ip rate limit store adapters', async () => {
    const { createMemoryIpRateLimitStore, checkIpRateLimit } = await loadModule()
    const store = createMemoryIpRateLimitStore()
    const config = { windowMs: 60000, maxRequests: 2, burstLimit: 10 }

    const first = await checkIpRateLimit(store, config, '127.0.0.1')
    const second = await checkIpRateLimit(store, config, '127.0.0.1')
    const third = await checkIpRateLimit(store, config, '127.0.0.1')

    expect(first.allowed).toBe(true)
    expect(second.allowed).toBe(true)
    expect(third.allowed).toBe(false)
  })

  it('supports memory upstream rate limit store adapters', async () => {
    const { createMemoryUpstreamRateLimitStore, checkUpstreamRateLimit } = await loadModule()
    const store = createMemoryUpstreamRateLimitStore({ resetTime: Date.now() + 60000 })
    const config = { windowMs: 60000, maxRequests: 1, retryAfterMs: 1000 }

    const first = await checkUpstreamRateLimit(store, config)
    const second = await checkUpstreamRateLimit(store, config)

    expect(first.allowed).toBe(true)
    expect(second).toMatchObject({ allowed: false, retryAfter: 1000 })
  })

  it('falls back to memory stores when upstash or kv providers are unavailable', async () => {
    const { createIpRateLimitStore, createUpstreamRateLimitStore } = await loadModule()

    expect(createIpRateLimitStore('kv').provider).toBe('memory')
    expect(createUpstreamRateLimitStore('upstash').provider).toBe('memory')
  })

  it('falls back to memory stores when redis provider is unavailable', async () => {
    const { createIpRateLimitStore, createUpstreamRateLimitStore } = await loadModule()

    expect(createIpRateLimitStore('redis').provider).toBe('memory')
    expect(createUpstreamRateLimitStore('redis').provider).toBe('memory')
  })

  it('uses redis stores when redis is configured', async () => {
    jest.doMock('@/lib/server/redis', () => ({
      getRedisClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        pexpireat: jest.fn().mockResolvedValue(1)
      }),
      getRedisAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createIpRateLimitStore, createUpstreamRateLimitStore } = await loadModule()

    expect(createIpRateLimitStore('redis').provider).toBe('redis')
    expect(createUpstreamRateLimitStore('redis').provider).toBe('redis')
  })

  it('uses upstash stores when rest config is present', async () => {
    jest.doMock('@/lib/server/restStore', () => ({
      getUpstashClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        pexpireat: jest.fn().mockResolvedValue(1)
      }),
      getKvClient: () => null,
      getRestAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createIpRateLimitStore, createUpstreamRateLimitStore } = await loadModule()

    expect(createIpRateLimitStore('upstash').provider).toBe('upstash')
    expect(createUpstreamRateLimitStore('upstash').provider).toBe('upstash')
  })

  it('uses kv stores when rest config is present', async () => {
    jest.doMock('@/lib/server/restStore', () => ({
      getUpstashClient: () => null,
      getKvClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        pexpireat: jest.fn().mockResolvedValue(1)
      }),
      getRestAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createIpRateLimitStore, createUpstreamRateLimitStore } = await loadModule()

    expect(createIpRateLimitStore('kv').provider).toBe('kv')
    expect(createUpstreamRateLimitStore('kv').provider).toBe('kv')
  })
})
