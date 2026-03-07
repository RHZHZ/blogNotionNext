describe('lib/server/cache', () => {
  const loadModule = async () => import('@/lib/server/cache')

  beforeEach(() => {
    jest.resetModules()
    delete process.env.REDIS_URL
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  it('supports memory cache store adapters', async () => {
    const { createMemoryCacheStore, setCacheEntry, getCacheEntry } = await loadModule()
    const store = createMemoryCacheStore()

    await setCacheEntry(store, 'song-1', { name: 'Song 1' }, { source: 'test' })
    const entry = await getCacheEntry(store, 'song-1', 1000)

    expect(entry).toMatchObject({
      data: { name: 'Song 1' },
      metadata: { source: 'test' }
    })
  })

  it('builds normalized meting cache keys', async () => {
    const { buildMetingCacheKey } = await loadModule()

    expect(buildMetingCacheKey({ id: ' Song-1 ', level: 'Standard', type: 'JSON' })).toBe(
      'meting:song-1:standard:json'
    )
  })

  it('falls back to memory store when upstash or kv providers are unavailable', async () => {
    const { createCacheStore } = await loadModule()

    expect(createCacheStore('kv').provider).toBe('memory')
    expect(createCacheStore('upstash').provider).toBe('memory')
  })

  it('falls back to memory store when redis provider is unavailable', async () => {
    const { createCacheStore } = await loadModule()

    expect(createCacheStore('redis').provider).toBe('memory')
  })

  it('uses redis cache store when redis is configured', async () => {
    jest.doMock('@/lib/server/redis', () => ({
      getRedisClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        keys: jest.fn().mockResolvedValue([])
      }),
      getRedisAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createCacheStore } = await loadModule()
    expect(createCacheStore('redis').provider).toBe('redis')
  })

  it('uses upstash cache store when rest config is present', async () => {
    jest.doMock('@/lib/server/restStore', () => ({
      getUpstashClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        keys: jest.fn().mockResolvedValue([])
      }),
      getKvClient: () => null,
      getRestAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createCacheStore } = await loadModule()
    expect(createCacheStore('upstash').provider).toBe('upstash')
  })

  it('uses kv cache store when rest config is present', async () => {
    jest.doMock('@/lib/server/restStore', () => ({
      getUpstashClient: () => null,
      getKvClient: () => ({
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue('OK'),
        del: jest.fn().mockResolvedValue(1),
        keys: jest.fn().mockResolvedValue([])
      }),
      getRestAvailability: () => ({ enabled: true, reason: null })
    }))

    const { createCacheStore } = await loadModule()
    expect(createCacheStore('kv').provider).toBe('kv')
  })

  it('reports detailed rest availability reasons for partial configuration', async () => {
    jest.dontMock('@/lib/server/restStore')
    const restStore = await import('@/lib/server/restStore')

    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    expect(restStore.getRestAvailability('upstash')).toEqual({
      enabled: false,
      reason: 'missing-upstash-token'
    })

    delete process.env.UPSTASH_REDIS_REST_URL
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token'
    expect(restStore.getRestAvailability('upstash')).toEqual({
      enabled: false,
      reason: 'missing-upstash-url'
    })
  })

  it('removes expired entries through the store interface', async () => {
    const { createMemoryCacheStore, getCacheEntry } = await loadModule()
    const store = createMemoryCacheStore([
      ['song-1', { data: { name: 'Song 1' }, metadata: {}, timestamp: Date.now() - 2000 }]
    ])

    const entry = await getCacheEntry(store, 'song-1', 1000)

    expect(entry).toBeNull()
    expect(store.get('song-1')).toBeUndefined()
  })
})
