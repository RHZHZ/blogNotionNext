describe('lib/config/env-validation', () => {
  const originalEnv = process.env

  const loadModule = async () => import('@/lib/config/env-validation')

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv, NOTION_PAGE_ID: '01234567-89ab-cdef-0123-456789abcdef' }
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    delete process.env.KV_REST_API_URL
    delete process.env.KV_REST_API_TOKEN
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('reports paired upstash env vars when only url is set', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    const { validateEnvironmentVariables } = await loadModule()

    const result = validateEnvironmentVariables()

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together'
    )
  })

  it('reports paired kv env vars when only token is set', async () => {
    process.env.KV_REST_API_TOKEN = 'test-token'
    const { validateEnvironmentVariables } = await loadModule()

    const result = validateEnvironmentVariables()

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain(
      'KV_REST_API_URL and KV_REST_API_TOKEN must be configured together'
    )
  })

  it('accepts complete rest provider env pairs', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token-a'
    process.env.KV_REST_API_URL = 'https://example.kv.io'
    process.env.KV_REST_API_TOKEN = 'token-b'
    const { validateEnvironmentVariables } = await loadModule()

    const result = validateEnvironmentVariables()

    expect(result.errors).not.toContain(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be configured together'
    )
    expect(result.errors).not.toContain(
      'KV_REST_API_URL and KV_REST_API_TOKEN must be configured together'
    )
  })
})
