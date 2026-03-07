import { act, render, waitFor } from '@testing-library/react'
import Player from '@/components/Player'

jest.mock('styled-jsx/style', () => () => null)

jest.mock('@/lib/config', () => ({
  siteConfig: jest.fn(key => {
    const config = {
      MUSIC_PLAYER_VISIBLE: 'true',
      MUSIC_PLAYER_AUTO_PLAY: 'false',
      MUSIC_PLAYER_ORDER: 'random',
      MUSIC_PLAYER_LRC_TYPE: '0',
      MUSIC_PLAYER: true,
      MUSIC_PLAYER_CDN_URL: 'https://cdn.example.com/aplayer.js',
      MUSIC_PLAYER_STYLE_CDN_URL: 'https://cdn.example.com/aplayer.css',
      MUSIC_PLAYER_METING: 'true',
      MUSIC_PLAYER_METING_API: '/api/meting?url=:id',
      MUSIC_PLAYER_METING_ID: '1,2,3',
      MUSIC_PLAYER_METING_PLAYLIST_ID: '17814924409',
      MUSIC_PLAYER_AUDIO_LIST: [{ name: 'fallback', artist: 'artist', url: 'https://example.com/fallback.mp3' }]
    }

    return config[key]
  })
}))

jest.mock('@/lib/utils', () => ({
  loadExternalResource: jest.fn().mockResolvedValue(undefined)
}))

describe('components/Player', () => {
  let playerInstances

  class MockAPlayer {
    constructor(options) {
      this.options = options
      this.audio = {
        paused: true,
        error: null,
        addEventListener: jest.fn((event, handler) => {
          if (event === 'error') this.__audioErrorHandler = handler
        }),
        removeEventListener: jest.fn()
      }
      this.list = {
        index: 0,
        audios: options.audio,
        switch: jest.fn(index => {
          this.list.index = index
        })
      }
      this.play = jest.fn(() => {
        this.audio.paused = false
      })
      this.destroy = jest.fn()
      playerInstances.push(this)
    }
  }

  const createJsonResponse = payload => ({
    ok: true,
    status: 200,
    headers: { get: jest.fn().mockReturnValue(null) },
    json: jest.fn().mockResolvedValue(payload)
  })

  beforeEach(() => {
    playerInstances = []
    global.fetch = jest.fn()
    window.APlayer = MockAPlayer
    window.__APPLAYER__ = undefined
    window.__APPLAYER_META__ = undefined
  })

  afterEach(() => {
    window.APlayer = undefined
    window.__APPLAYER__ = undefined
    window.__APPLAYER_META__ = undefined
  })

  it('reports playlist-low-coverage when remote archive coverage is incomplete', async () => {
    global.fetch
      .mockResolvedValueOnce(createJsonResponse({
        tracks: [{
          name: 'Song A',
          artist: 'Artist A',
          url: 'https://example.com/song-a.mp3',
          meta: { trackId: 'track-a', sourceUrl: 'https://example.com/source-a.mp3' }
        }],
        meta: {
          total: 3,
          audioArchiveMatched: 1,
          playlist: { id: '17814924409' }
        }
      }))
      .mockResolvedValueOnce(createJsonResponse({ accepted: true, deduplicated: false }))

    render(<Player />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/archive/schedule', expect.objectContaining({
        method: 'POST'
      }))
    })

    const [, scheduleRequest] = global.fetch.mock.calls[1]
    expect(scheduleRequest).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(JSON.parse(scheduleRequest.body)).toMatchObject({
      reason: 'playlist-low-coverage',
      playlistId: '17814924409',
      trackId: '',
      songUrl: ''
    })
  })

  it('does not reschedule archive or force refresh for archived tracks on audio error', async () => {
    global.fetch.mockResolvedValueOnce(createJsonResponse({
      tracks: [{
        name: 'Archived Song',
        artist: 'Artist A',
        url: 'https://music.rhzhz.cn/music-archive/archived.mp3',
        meta: {
          trackId: 'archived.mp3',
          sourceUrl: 'https://music.rhzhz.cn/music-archive/archived.mp3',
          source: 'archive-playlist',
          audioArchive: { archived: true }
        }
      }],
      meta: {
        total: 1,
        audioArchiveMatched: 1,
        playlist: { id: '17814924409' }
      }
    }))

    render(<Player />)

    await waitFor(() => {
      expect(playerInstances).toHaveLength(1)
    })

    const firstPlayer = playerInstances[0]
    window.__APPLAYER__ = firstPlayer
    firstPlayer.audio.error = { code: 4 }

    await act(async () => {
      await firstPlayer.__audioErrorHandler()
    })

    expect(global.fetch).not.toHaveBeenCalledWith('/api/archive/schedule', expect.anything())
    expect(global.fetch).not.toHaveBeenCalledWith('/api/meting?playlistId=17814924409&forceRefresh=1', { cache: 'no-store' })
    expect(playerInstances).toHaveLength(1)
  })
})
