describe('pages/api/audio-meta', () => {
  const originalEnv = process.env

  const createRes = () => {
    const res = {
      statusCode: 200,
      headers: {},
      body: undefined,
      setHeader: jest.fn((key, value) => {
        res.headers[key] = value
      }),
      status: jest.fn(code => {
        res.statusCode = code
        return res
      }),
      json: jest.fn(payload => {
        res.body = payload
        return res
      })
    }

    return res
  }

  const loadHandler = async (env, blogOverrides = {}, audioMetaOverrides = null) => {
    jest.resetModules()
    process.env = { ...originalEnv, ...env }
    global.fetch = jest.fn()

    jest.doMock('@/blog.config', () => ({
      __esModule: true,
      default: {
        MUSIC_PLAYER_ARTICLE_META_DB_ID: 'blog-config-db-id',
        MUSIC_PLAYER_METING_CACHE_PROVIDER: 'memory',
        MUSIC_PLAYER_AUDIO_META_CACHE_TTL: 10 * 60 * 1000,
        ...blogOverrides
      }
    }))

    if (audioMetaOverrides) {
      jest.doMock('@/lib/server/audioMeta', () => ({
        ...audioMetaOverrides
      }))
    } else {
      jest.dontMock('@/lib/server/audioMeta')
    }

    const mod = await import('@/pages/api/audio-meta')
    return mod.default
  }

  const createNotionPage = ({
    audioUrl,
    archivedAudioUrl,
    trackId,
    audioKey,
    name = 'Test Song',
    artist = 'Test Artist',
    album = 'Test Album',
    cover = 'https://example.com/cover.jpg',
    lyrics = '[00:00.00] test'
  }) => ({
    properties: {
      AudioUrl: { url: audioUrl },
      ...(archivedAudioUrl ? { ArchivedAudioUrl: { url: archivedAudioUrl } } : {}),
      ...(trackId ? { TrackId: { rich_text: [{ plain_text: String(trackId) }] } } : {}),
      ...(audioKey ? { AudioKey: { rich_text: [{ plain_text: String(audioKey) }] } } : {}),
      Name: { title: [{ plain_text: name }] },
      Artist: { rich_text: [{ plain_text: artist }] },
      Album: { rich_text: [{ plain_text: album }] },
      Cover: { url: cover },
      Lyrics: { rich_text: [{ plain_text: lyrics }] }
    }
  })


  beforeEach(() => {
    jest.clearAllMocks()
    jest.dontMock('@/blog.config')
    jest.dontMock('@/lib/server/cache')
    jest.dontMock('@/lib/server/audioMeta')
    process.env = { ...originalEnv }
    global.fetch = jest.fn()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns 500 when audio meta database id is missing', async () => {
    const handler = await loadHandler(
      {
        NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: '',
        NOTION_ACCESS_TOKEN: 'test-token'
      },
      { MUSIC_PLAYER_ARTICLE_META_DB_ID: '' }
    )

    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.body).toMatchObject({
      error: 'Audio meta database is not configured',
      code: 'AUDIO_META_DB_ID_MISSING'
    })
    expect(res.body.requestId).toEqual(expect.any(String))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 503 when NOTION_ACCESS_TOKEN is missing', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id'
    })
    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.body).toMatchObject({
      error: 'NOTION_ACCESS_TOKEN is missing',
      code: 'NOTION_TOKEN_MISSING'
    })
    expect(res.body.requestId).toEqual(expect.any(String))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 502 when Notion responds with a non-2xx status', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({ message: 'upstream failed' })
    })

    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.body).toMatchObject({
      error: 'Failed to fetch audio metadata from Notion',
      code: 'NOTION_FETCH_FAILED'
    })
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('reuses cached result for subsequent requests', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          createNotionPage({
            audioUrl: 'https://cdn.example.com/music/song-a.mp3',
            name: 'Song A'
          })
        ],
        has_more: false,
        next_cursor: null
      })
    })

    const firstRes = createRes()
    const secondRes = createRes()

    await handler({}, firstRes)
    await handler({}, secondRes)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(firstRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.body).toEqual(firstRes.body)
    expect(secondRes.body['song-a.mp3']).toMatchObject({
      name: 'Song A'
    })
  })

  it('uses shared audio-meta module result when available', async () => {
    const handler = await loadHandler(
      {
        NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
        NOTION_ACCESS_TOKEN: 'test-token'
      },
      { MUSIC_PLAYER_METING_CACHE_PROVIDER: 'redis' },
      {
        getAudioMetaMap: jest.fn().mockResolvedValue({
          'shared.mp3': {
            name: 'Shared Song'
          }
        })
      }
    )

    const res = createRes()
    await handler({}, res)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body).toMatchObject({
      'shared.mp3': { name: 'Shared Song' }
    })
  })

  it('aggregates paginated Notion results into one meta map', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          results: [
            createNotionPage({
              audioUrl: 'https://cdn.example.com/music/first.mp3',
              name: 'First Song'
            })
          ],
          has_more: true,
          next_cursor: 'cursor-2'
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          results: [
            createNotionPage({
              audioUrl: 'https://cdn.example.com/music/second.mp3?x=1',
              name: 'Second Song'
            })
          ],
          has_more: false,
          next_cursor: null
        })
      })

    const res = createRes()

    await handler({}, res)

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch.mock.calls[1][1].body).toContain('cursor-2')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body).toMatchObject({
      'first.mp3': { name: 'First Song' },
      'second.mp3': { name: 'Second Song' }
    })
  })

  it('returns track-indexed archived audio metadata through shared module', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          createNotionPage({
            audioUrl: 'https://cdn.example.com/music/source-song.mp3',
            archivedAudioUrl: 'https://archive.example.com/music/stable-song.mp3',
            trackId: '12345',
            name: 'Stable Song'
          })
        ],
        has_more: false,
        next_cursor: null
      })
    })

    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body['source-song.mp3']).toMatchObject({
      trackId: '12345',
      archivedAudioUrl: 'https://archive.example.com/music/stable-song.mp3',
      rawUrl: 'https://cdn.example.com/music/source-song.mp3'
    })
  })

  it('indexes audio meta by explicit AudioKey when source url filename differs', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          createNotionPage({
            audioUrl: 'https://cdn.example.com/music/custom-source-name.mp3',
            audioKey: 'manual-extra.mp3',
            name: 'Manual AudioKey Song'
          })
        ],
        has_more: false,
        next_cursor: null
      })
    })

    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body['manual-extra.mp3']).toMatchObject({
      name: 'Manual AudioKey Song',
      rawUrl: 'https://cdn.example.com/music/custom-source-name.mp3'
    })
  })
  it('indexes audio meta by both extension and extensionless AudioKey variants', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          createNotionPage({
            audioUrl: 'https://cdn.example.com/music/sunny.mp3',
            audioKey: 'sunny',
            name: 'Sunny Song'
          })
        ],
        has_more: false,
        next_cursor: null
      })
    })

    const res = createRes()

    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.sunny).toMatchObject({
      name: 'Sunny Song',
      rawUrl: 'https://cdn.example.com/music/sunny.mp3'
    })
    expect(res.body['sunny.mp3']).toMatchObject({
      name: 'Sunny Song',
      rawUrl: 'https://cdn.example.com/music/sunny.mp3'
    })
  })


  it('sets provider debug headers when debug badge is enabled', async () => {
    const handler = await loadHandler(
      {
        NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
        NOTION_ACCESS_TOKEN: 'test-token',
        NEXT_PUBLIC_MUSIC_PLAYER_DEBUG_BADGE: 'true',
        NEXT_PUBLIC_MUSIC_PLAYER_METING_CACHE_PROVIDER: 'redis'
      },
      {
        MUSIC_PLAYER_DEBUG_BADGE: true,
        MUSIC_PLAYER_METING_CACHE_PROVIDER: 'redis'
      },
      {
        getAudioMetaMap: jest.fn().mockResolvedValue({})
      }
    )

    const res = createRes()
    await handler({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.headers['X-Player-Debug']).toBe('1')
    expect(res.headers['X-Request-Id']).toEqual(expect.any(String))
    expect(res.headers['X-Cache-Provider-Configured']).toBe('redis')
    expect(res.headers['X-Cache-Provider-Active']).toBe('memory')
    expect(res.headers['X-Cache-Provider-Fallback']).toBe('true')
    expect(res.headers['X-Cache-Provider-Reason']).toBe('provider-fallback')
  })

  it('reuses the same pending promise for concurrent requests', async () => {
    const handler = await loadHandler({
      NEXT_PUBLIC_MUSIC_PLAYER_ARTICLE_META_DB_ID: 'test-db-id',
      NOTION_ACCESS_TOKEN: 'test-token'
    })

    let resolveFetch
    global.fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveFetch = resolve
        })
    )

    const firstRes = createRes()
    const secondRes = createRes()

    const firstRequest = handler({}, firstRes)
    const secondRequest = handler({}, secondRes)

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(global.fetch).toHaveBeenCalledTimes(1)

    resolveFetch({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [
          createNotionPage({
            audioUrl: 'https://cdn.example.com/music/shared.mp3',
            name: 'Shared Song'
          })
        ],
        has_more: false,
        next_cursor: null
      })
    })

    await Promise.all([firstRequest, secondRequest])

    expect(firstRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(firstRes.body).toEqual(secondRes.body)
    expect(firstRes.body['shared.mp3']).toMatchObject({ name: 'Shared Song' })
  })
})
