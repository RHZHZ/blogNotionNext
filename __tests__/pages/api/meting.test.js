/** @jest-environment node */
describe('pages/api/meting', () => {

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

  const createReq = (query = {}, headers = {}) => ({
    query,
    headers,
    connection: { remoteAddress: '127.0.0.1' }
  })

  const loadHandler = async (
    rateLimitOverrides = {},
    envOverrides = {},
    blogOverrides = {},
    audioMetaOverrides = {}
  ) => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_MUSIC_PLAYER_METING_CACHE_PROVIDER: 'memory',
      NEXT_PUBLIC_MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER: 'memory',
      ...envOverrides
    }


    global.fetch = jest.fn()
    if (typeof window !== 'undefined') {
      window.fetch = global.fetch
    }

    jest.doMock('@/blog.config', () => {
      const actualModule = jest.requireActual('@/blog.config')
      const actualConfig = actualModule.default || actualModule
      return {
        __esModule: true,
        default: {
          ...actualConfig,
          MUSIC_PLAYER_METING_CACHE_PROVIDER: 'memory',
          MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER: 'memory',
          ...blogOverrides
        }

      }
    })

    jest.doMock('@/lib/server/rateLimit', () => {
      const actual = jest.requireActual('@/lib/server/rateLimit')
      return {
        ...actual,
        checkIpRateLimit: rateLimitOverrides.checkIpRateLimit || actual.checkIpRateLimit,
        checkUpstreamRateLimit:
          rateLimitOverrides.checkUpstreamRateLimit || actual.checkUpstreamRateLimit,
        cleanupExpiredIpLimits:
          rateLimitOverrides.cleanupExpiredIpLimits || actual.cleanupExpiredIpLimits
      }
    })

    if (Object.keys(audioMetaOverrides).length > 0) {
      jest.doMock('@/lib/server/audioMeta', () => {
        const actual = jest.requireActual('@/lib/server/audioMeta')
        return {
          ...actual,
          getAudioMetaMaps: audioMetaOverrides.getAudioMetaMaps || actual.getAudioMetaMaps,
          hasAudioMetaSourceConfigured:
            audioMetaOverrides.hasAudioMetaSourceConfigured || actual.hasAudioMetaSourceConfigured
        }
      })
    } else {
      jest.dontMock('@/lib/server/audioMeta')
    }

    const mod = await import('@/pages/api/meting')
    return mod.default
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    jest.dontMock('@/lib/server/rateLimit')
    jest.dontMock('@/lib/server/audioMeta')
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_MUSIC_PLAYER_METING_CACHE_PROVIDER: 'memory',
      NEXT_PUBLIC_MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER: 'memory'
    }
    global.fetch = jest.fn()

    if (typeof window !== 'undefined') {
      window.fetch = global.fetch
    }
  })


  afterAll(() => {
    process.env = originalEnv
  })

  it('returns 400 when url query param is missing', async () => {
    const handler = await loadHandler()
    const req = createReq()
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.body).toMatchObject({
      error: 'Missing required query param: url or playlistId',
      code: 'MISSING_URL'
    })
    expect(res.body.requestId).toEqual(expect.any(String))
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns cached data on repeated requests', async () => {
    const handler = await loadHandler()

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          name: 'Cached Song',
          ar_name: 'Cached Artist',
          url: 'http://audio.example.com/song.mp3',
          pic: 'https://audio.example.com/cover.jpg',
          lyric: '[00:00.00] cached'
        }
      })
    })

    const req = createReq({ url: 'song-1' })
    const firstRes = createRes()
    const secondRes = createRes()

    await handler(req, firstRes)
    await handler(req, secondRes)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(firstRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.body.meta.cacheHits).toBe(1)
    expect(secondRes.body.tracks[0]).toMatchObject({
      name: 'Cached Song',
      artist: 'Cached Artist',
      url: 'https://audio.example.com/song.mp3'
    })
  })

  it('merges duplicate concurrent track requests into one upstream fetch', async () => {
    const handler = await loadHandler()
    let resolveFetch

    global.fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          resolveFetch = resolve
        })
    )

    const req = createReq({ url: 'song-1,song-1' })
    const res = createRes()

    const request = handler(req, res)

    await new Promise(resolve => setTimeout(resolve, 0))
    expect(global.fetch).toHaveBeenCalledTimes(1)

    resolveFetch({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          name: 'Merged Song',
          ar_name: 'Merged Artist',
          url: 'http://audio.example.com/merged.mp3',
          pic: '',
          lyric: ''
        }
      })
    })

    await request

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.meta.cacheHits).toBe(1)
    expect(res.body.tracks).toHaveLength(2)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('retries retryable upstream failures and returns recovered track', async () => {
    const handler = await loadHandler()
    jest.useFakeTimers()
    jest.spyOn(Math, 'random').mockReturnValue(0)

    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: jest.fn().mockResolvedValue({})
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'Recovered Song',
            ar_name: 'Recovered Artist',
            url: 'http://audio.example.com/recovered.mp3',
            pic: '',
            lyric: ''
          }
        })
      })

    const req = createReq({ url: 'song-1' })
    const res = createRes()

    const request = handler(req, res)

    await jest.advanceTimersByTimeAsync(1000)
    await request

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.meta.retries).toBe(1)
    expect(res.body.tracks[0]).toMatchObject({
      name: 'Recovered Song',
      artist: 'Recovered Artist',
      url: 'https://audio.example.com/recovered.mp3'
    })

    Math.random.mockRestore()
  })

  it('releases pending request after failure so the next request can refetch', async () => {
    const handler = await loadHandler()

    global.fetch
      .mockRejectedValueOnce(new Error('boom-once'))
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'Recovered After Failure',
            ar_name: 'Recovered Artist',
            url: 'http://audio.example.com/recovered-after-failure.mp3',
            pic: '',
            lyric: ''
          }
        })
      })

    const req = createReq({ url: 'song-1,song-1' })

    const firstRes = createRes()
    await handler(req, firstRes)

    expect(firstRes.status).toHaveBeenCalledWith(502)
    expect(firstRes.body).toMatchObject({
      error: '上游数据获取失败',
      code: 'UPSTREAM_FETCH_FAILED'
    })

    const secondRes = createRes()
    await handler(req, secondRes)

    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.body.tracks).toHaveLength(2)
    expect(secondRes.body.tracks[0]).toMatchObject({
      name: 'Recovered After Failure',
      artist: 'Recovered Artist',
      url: 'https://audio.example.com/recovered-after-failure.mp3'
    })
  })

  it('prefers archived audio url from audio meta when track id matches', async () => {
    const handler = await loadHandler(
      {},
      {},
      {},
      {
        hasAudioMetaSourceConfigured: jest.fn(() => true),
        getAudioMetaMaps: jest.fn().mockResolvedValue({
          byAudioKey: {},
          byTrackId: {
            'song-1': {
              trackId: 'song-1',
              name: 'Archived Song',
              artist: 'Archived Artist',
              cover: 'https://archive.example.com/cover.jpg',
              lrc: '[00:00.00] archived',
              rawUrl: 'https://audio.example.com/original.mp3',
              archivedAudioUrl: 'https://archive.example.com/stable.mp3',
              sourceAudioUrl: 'https://audio.example.com/original.mp3',
              archiveStatus: 'archived'
            }
          }
        })
      }
    )

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          name: 'Archived Song',
          ar_name: 'Archived Artist',
          url: 'http://audio.example.com/original.mp3',
          pic: 'https://audio.example.com/original-cover.jpg',
          lyric: '[00:00.00] original'
        }
      })
    })

    const req = createReq({ url: 'song-1' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.tracks[0]).toMatchObject({
      id: 'song-1',
      name: 'Archived Song',
      artist: 'Archived Artist',
      url: 'https://archive.example.com/stable.mp3',
      cover: 'https://archive.example.com/cover.jpg',
      lrc: '[00:00.00] archived'
    })
    expect(res.body.tracks[0].meta.audioArchive).toMatchObject({
      matched: true,
      archived: true,
      archiveStatus: 'archived'
    })
    expect(res.body.meta.audioArchiveEnabled).toBe(true)
    expect(res.body.meta.audioArchiveMatched).toBe(1)
  })

  it('supports playlistId mode and preserves playlist order', async () => {
    const handler = await loadHandler()

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            playlist: {
              id: 17814924409,
              name: 'rhz的博客',
              coverImgUrl: 'https://cover.example.com/playlist.jpg',
              creator: 'kakakajxk',
              trackCount: 2,
              tracks: [
                {
                  id: 2,
                  name: 'Second Song',
                  artists: 'Artist B',
                  album: 'Album B'
                },
                {
                  id: 1,
                  name: 'First Song',
                  artists: 'Artist A',
                  album: 'Album A'
                }
              ]
            }
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'Second Song',
            ar_name: 'Artist B',
            url: 'http://audio.example.com/second.mp3',
            pic: '',
            lyric: ''
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'First Song',
            ar_name: 'Artist A',
            url: 'http://audio.example.com/first.mp3',
            pic: '',
            lyric: ''
          }
        })
      })

    const req = createReq({ playlistId: '17814924409' })
    const res = createRes()

    await handler(req, res)

    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.meta.playlist).toMatchObject({
      id: '17814924409',
      name: 'rhz的博客',
      creator: 'kakakajxk',
      trackCount: 2
    })
    expect(res.body.tracks.map(track => track.name)).toEqual(['Second Song', 'First Song'])
    expect(res.body.tracks.map(track => track.url)).toEqual([
      'https://audio.example.com/second.mp3',
      'https://audio.example.com/first.mp3'
    ])
  })


  it('merges archive playlist supplement tracks in playlist mode and deduplicates overlaps', async () => {
    const handler = await loadHandler(
      {},
      {},
      {},
      {
        hasAudioMetaSourceConfigured: jest.fn(() => true),
        getAudioMetaMaps: jest.fn().mockResolvedValue({
          byAudioKey: {},
          byTrackId: {
            '2': {
              trackId: '2',
              name: 'Second Song Archived',
              artist: 'Artist B',
              cover: 'https://archive.example.com/second-cover.jpg',
              lrc: '',
              rawUrl: 'https://audio.example.com/second.mp3',
              archivedAudioUrl: 'https://archive.example.com/second-stable.mp3',
              sourceAudioUrl: 'https://audio.example.com/second.mp3',
              archiveStatus: 'archived'
            }
          },
          archivePlaylist: [
            {
              id: '2',
              name: 'Second Song Archived',
              artist: 'Artist B',
              url: 'https://archive.example.com/second-stable.mp3',
              cover: 'https://archive.example.com/second-cover.jpg',
              lrc: '',
              meta: {
                trackId: '2',
                sourceUrl: 'https://audio.example.com/second.mp3',
                source: 'archive-playlist',
                playlistOrder: 1,
                audioArchive: {
                  matched: true,
                  by: 'trackId',
                  archived: true,
                  archiveStatus: 'archived'
                }
              }
            },
            {
              id: 'extra-1',
              name: 'Manual Extra Song',
              artist: 'Manual Artist',
              url: 'https://archive.example.com/manual-extra.mp3',
              cover: 'https://archive.example.com/manual-extra.jpg',
              lrc: '',
              meta: {
                trackId: 'extra-1',
                sourceUrl: 'https://archive.example.com/manual-extra.mp3',
                source: 'archive-playlist',
                playlistOrder: 2,
                audioArchive: {
                  matched: true,
                  by: 'trackId',
                  archived: true,
                  archiveStatus: 'archived'
                }
              }
            }
          ]
        })
      }
    )

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            playlist: {
              id: 17814924409,
              name: 'rhz的博客',
              coverImgUrl: 'https://cover.example.com/playlist.jpg',
              creator: 'kakakajxk',
              trackCount: 2,
              tracks: [
                {
                  id: 2,
                  name: 'Second Song',
                  artists: 'Artist B',
                  album: 'Album B'
                },
                {
                  id: 1,
                  name: 'First Song',
                  artists: 'Artist A',
                  album: 'Album A'
                }
              ]
            }
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'Second Song',
            ar_name: 'Artist B',
            url: 'http://audio.example.com/second.mp3',
            pic: '',
            lyric: ''
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'First Song',
            ar_name: 'Artist A',
            url: 'http://audio.example.com/first.mp3',
            pic: '',
            lyric: ''
          }
        })
      })

    const req = createReq({ playlistId: '17814924409' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.tracks.map(track => track.name)).toEqual(['Second Song Archived', 'First Song', 'Manual Extra Song'])
    expect(res.body.tracks.map(track => track.url)).toEqual([
      'https://archive.example.com/second-stable.mp3',
      'https://audio.example.com/first.mp3',
      'https://archive.example.com/manual-extra.mp3'
    ])
    expect(res.body.meta.archivePoolEnabled).toBe(true)
    expect(res.body.meta.archivePoolMerged).toBe(1)
  })

  it('enriches manual archive supplement tracks with AudioMeta fields by audioKey', async () => {
    const handler = await loadHandler(
      {},
      {},
      {},
      {
        hasAudioMetaSourceConfigured: jest.fn(() => true),
        getAudioMetaMaps: jest.fn().mockResolvedValue({
          byAudioKey: {
            'manual-extra.mp3': {
              trackId: null,
              name: 'AudioMeta Manual Song',
              artist: 'AudioMeta Artist',
              cover: 'https://audio-meta.example.com/manual-cover.jpg',
              lrc: '[00:00.00] manual lyrics',
              rawUrl: 'https://origin.example.com/manual-extra.mp3',
              archivedAudioUrl: '',
              sourceAudioUrl: 'https://origin.example.com/manual-extra.mp3',
              archiveStatus: ''
            }
          },
          byTrackId: {},
          archivePlaylist: [
            {
              id: 'manual-extra',
              name: '',
              artist: '',
              url: 'https://archive.example.com/manual-extra.mp3',
              cover: '',
              lrc: '',
              meta: {
                trackId: null,
                sourceUrl: 'https://origin.example.com/manual-extra.mp3',
                source: 'archive-playlist',
                playlistOrder: 1,
                audioArchive: {
                  matched: true,
                  by: 'audioKey',
                  archived: true,
                  archiveStatus: 'archived'
                }
              }
            }
          ]
        })
      }
    )

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          playlist: {
            id: 17814924409,
            name: 'rhz的博客',
            coverImgUrl: 'https://cover.example.com/playlist.jpg',
            creator: 'kakakajxk',
            trackCount: 0,
            tracks: []
          }
        }
      })
    })

    const req = createReq({ playlistId: '17814924409' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.tracks).toHaveLength(1)
    expect(res.body.tracks[0]).toMatchObject({
      name: 'AudioMeta Manual Song',
      artist: 'AudioMeta Artist',
      url: 'https://archive.example.com/manual-extra.mp3',
      cover: 'https://audio-meta.example.com/manual-cover.jpg',
      lrc: '[00:00.00] manual lyrics'
    })
    expect(res.body.tracks[0].meta).toMatchObject({
      source: 'archive-playlist',
      sourceUrl: 'https://origin.example.com/manual-extra.mp3'
    })
  })

  it('can disable archive playlist supplement tracks in playlist mode', async () => {
    const handler = await loadHandler(
      {},
      {},
      {},
      {
        hasAudioMetaSourceConfigured: jest.fn(() => true),
        getAudioMetaMaps: jest.fn().mockResolvedValue({
          byAudioKey: {},
          byTrackId: {},
          archivePlaylist: [
            {
              id: 'manual-extra',
              name: 'Manual Extra Song',
              artist: 'Manual Artist',
              url: 'https://archive.example.com/manual-extra.mp3',
              cover: '',
              lrc: '',
              meta: {
                trackId: null,
                sourceUrl: 'https://origin.example.com/manual-extra.mp3',
                source: 'archive-playlist',
                playlistOrder: 1,
                audioArchive: {
                  matched: true,
                  by: 'audioKey',
                  archived: true,
                  archiveStatus: 'archived'
                }
              }
            }
          ]
        })
      }
    )

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            playlist: {
              id: 17814924409,
              name: 'rhz的博客',
              coverImgUrl: 'https://cover.example.com/playlist.jpg',
              creator: 'kakakajxk',
              trackCount: 1,
              tracks: [
                {
                  id: 1,
                  name: 'First Song',
                  artists: 'Artist A',
                  album: 'Album A'
                }
              ]
            }
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            name: 'First Song',
            ar_name: 'Artist A',
            url: 'http://audio.example.com/first.mp3',
            pic: '',
            lyric: ''
          }
        })
      })

    const req = createReq({ playlistId: '17814924409', includeArchivePool: '0' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.tracks).toHaveLength(1)
    expect(res.body.tracks[0]).toMatchObject({
      name: 'First Song',
      artist: 'Artist A'
    })
    expect(res.body.meta.archivePoolEnabled).toBe(false)
    expect(res.body.meta.archivePoolMerged).toBe(0)
  })

  it('falls back to playlist metadata when song detail fetch fails in playlist mode', async () => {

    const handler = await loadHandler()


    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({
          data: {
            playlist: {
              id: 17814924409,
              name: 'rhz的博客',
              coverImgUrl: 'https://cover.example.com/playlist.jpg',
              creator: 'kakakajxk',
              trackCount: 1,
              tracks: [
                {
                  id: 99,
                  name: 'Fallback Song',
                  artists: 'Fallback Artist',
                  album: 'Fallback Album'
                }
              ]
            }
          }
        })
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({})
      })


    const req = createReq({ playlistId: '17814924409' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.body.tracks).toHaveLength(1)
    expect(res.body.tracks[0]).toMatchObject({
      name: 'Fallback Song',
      artist: 'Fallback Artist'
    })
    expect(res.body.tracks[0].url).toBeUndefined()
  })

  it('returns 404 when playlistId mode yields no tracks', async () => {
    const handler = await loadHandler()

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          playlist: {
            id: 17814924409,
            name: 'empty',
            coverImgUrl: '',
            creator: 'tester',
            trackCount: 0,
            tracks: []
          }
        }
      })
    })

    const req = createReq({ playlistId: '17814924409' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.body).toMatchObject({
      error: '歌单中没有可用歌曲',
      code: 'EMPTY_PLAYLIST'
    })
  })

  it('sets provider debug headers when debug badge is enabled', async () => {
    const handler = await loadHandler(
      {},
      {
        NEXT_PUBLIC_MUSIC_PLAYER_DEBUG_BADGE: 'true',
        NEXT_PUBLIC_MUSIC_PLAYER_METING_CACHE_PROVIDER: 'redis',
        NEXT_PUBLIC_MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER: 'redis'
      },
      {
        MUSIC_PLAYER_DEBUG_BADGE: true,
        MUSIC_PLAYER_METING_CACHE_PROVIDER: 'redis',
        MUSIC_PLAYER_METING_RATE_LIMIT_PROVIDER: 'redis'
      }
    )

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: {
          name: 'Debug Song',
          ar_name: 'Debug Artist',
          url: 'http://audio.example.com/debug.mp3',
          pic: '',
          lyric: ''
        }
      })
    })

    const req = createReq({ url: 'song-1' })
    const res = createRes()

    await handler(req, res)

    expect(res.headers['X-Player-Debug']).toBe('1')
    expect(res.headers['X-Request-Id']).toEqual(expect.any(String))
    expect(res.headers['X-Cache-Provider-Configured']).toBe('redis')
    expect(res.headers['X-Cache-Provider-Active']).toBe('memory')
    expect(res.headers['X-Cache-Provider-Fallback']).toBe('true')
    expect(res.headers['X-Cache-Provider-Reason']).toBe('missing-redis-url')
    expect(res.headers['X-RateLimit-Provider-Configured']).toBe('redis')
    expect(res.headers['X-Ip-RateLimit-Provider-Active']).toBe('memory')
    expect(res.headers['X-Upstream-RateLimit-Provider-Active']).toBe('memory')
    expect(res.headers['X-RateLimit-Provider-Fallback']).toBe('true')
    expect(res.headers['X-RateLimit-Provider-Reason']).toBe('missing-redis-url')
  })

  it('returns 502 when upstream fetch yields no valid tracks', async () => {
    const handler = await loadHandler()

    global.fetch.mockRejectedValue(new Error('boom'))

    const req = createReq({ url: 'song-1' })
    const res = createRes()

    await handler(req, res)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.body).toMatchObject({
      error: '上游数据获取失败',
      code: 'UPSTREAM_FETCH_FAILED'
    })
    expect(res.body.requestId).toEqual(expect.any(String))
  })
})
