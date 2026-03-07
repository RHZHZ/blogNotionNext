/** @jest-environment node */
describe('pages/api/archive/schedule', () => {
  const createRes = () => {
    const res = {
      statusCode: 200,
      body: undefined,
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

  const createReq = ({ method = 'POST', body = {} } = {}) => ({
    method,
    body
  })

  const loadHandler = async ({ runArchiveTaskImpl } = {}) => {
    jest.resetModules()
    jest.doMock('@/lib/server/archiveExecutor', () => ({
      executeArchiveTask: runArchiveTaskImpl || jest.fn().mockResolvedValue(undefined),
      resolveArchiveTaskMode: jest.requireActual('@/lib/server/archiveExecutor').resolveArchiveTaskMode
    }))
    const scheduleModule = await import('@/lib/server/archiveSchedule')
    scheduleModule.__internal.jobs.clear()
    const mod = await import('@/pages/api/archive/schedule')
    return { handler: mod.default, scheduleModule }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 405 for non-POST methods', async () => {
    const { handler } = await loadHandler()
    const req = createReq({ method: 'GET' })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.body).toMatchObject({
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    })
  })

  it('returns 400 when schedule target is missing', async () => {
    const { handler } = await loadHandler()
    const req = createReq({ body: { reason: 'manual' } })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.body).toMatchObject({
      error: 'At least one of playlistId, trackId, songUrl is required',
      code: 'MISSING_ARCHIVE_TARGET'
    })
  })

  it('accepts and executes a new archive job', async () => {
    const runArchiveTask = jest.fn().mockResolvedValue(undefined)
    const { handler } = await loadHandler({ runArchiveTaskImpl: runArchiveTask })
    const req = createReq({
      body: {
        playlistId: '17814924409',
        reason: 'playlist-low-coverage'
      }
    })
    const res = createRes()

    await handler(req, res)

    expect(runArchiveTask).toHaveBeenCalledWith(expect.objectContaining({
      playlistId: '17814924409'
    }))
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toMatchObject({
      accepted: true,
      deduplicated: false,
      executed: true,
      job: {
        playlistId: '17814924409',
        reason: 'playlist-low-coverage',
        status: 'completed'
      }
    })
  })

  it('deduplicates repeated archive jobs within ttl window', async () => {
    const { handler } = await loadHandler()
    const req = createReq({
      body: {
        trackId: '2710156169',
        reason: '403-refresh'
      }
    })

    const firstRes = createRes()
    const secondRes = createRes()

    await handler(req, firstRes)
    await handler(req, secondRes)

    expect(firstRes.status).toHaveBeenCalledWith(202)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.body).toMatchObject({
      accepted: true,
      deduplicated: true,
      job: {
        trackId: '2710156169',
        reason: '403-refresh'
      }
    })
  })

  it('returns failed job state when archive execution throws', async () => {
    const runArchiveTask = jest.fn().mockRejectedValue(new Error('archive boom'))
    const { handler } = await loadHandler({ runArchiveTaskImpl: runArchiveTask })
    const req = createReq({
      body: {
        trackId: '2710156169',
        reason: 'manual'
      }
    })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.body).toMatchObject({
      error: 'archive boom',
      code: 'ARCHIVE_EXECUTION_FAILED',
      job: {
        trackId: '2710156169',
        status: 'failed',
        error: 'archive boom',
        failureCount: 1
      }
    })
    expect(res.body.job.nextRetryAt).toEqual(expect.any(String))
    expect(res.body.job.blacklistedUntil).toBeNull()
  })

  it('deduplicates failed jobs during exponential backoff window', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-03-07T11:00:00.000Z'))

    const runArchiveTask = jest.fn().mockRejectedValue(new Error('fetch failed'))
    const { handler } = await loadHandler({ runArchiveTaskImpl: runArchiveTask })
    const req = createReq({
      body: {
        playlistId: '17814924409',
        reason: 'playlist-low-coverage'
      }
    })

    const firstRes = createRes()
    const secondRes = createRes()

    await handler(req, firstRes)
    await handler(req, secondRes)

    expect(firstRes.status).toHaveBeenCalledWith(500)
    expect(secondRes.status).toHaveBeenCalledWith(200)
    expect(secondRes.body).toMatchObject({
      accepted: true,
      deduplicated: true,
      job: {
        playlistId: '17814924409',
        status: 'failed',
        failureCount: 1
      }
    })
    expect(runArchiveTask).toHaveBeenCalledTimes(1)

    jest.useRealTimers()
  })

  it('allows retry after failed job backoff expires and blacklists after repeated failures', async () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-03-07T11:00:00.000Z'))

    const runArchiveTask = jest.fn().mockRejectedValue(new Error('fetch failed'))
    const { handler } = await loadHandler({ runArchiveTaskImpl: runArchiveTask })
    const req = createReq({
      body: {
        trackId: '2710156169',
        reason: 'manual'
      }
    })

    const firstRes = createRes()
    await handler(req, firstRes)

    jest.setSystemTime(new Date('2026-03-07T11:01:01.000Z'))
    const secondRes = createRes()
    await handler(req, secondRes)

    jest.setSystemTime(new Date('2026-03-07T11:03:05.000Z'))
    const thirdRes = createRes()
    await handler(req, thirdRes)

    expect(runArchiveTask).toHaveBeenCalledTimes(3)
    expect(thirdRes.status).toHaveBeenCalledWith(500)
    expect(thirdRes.body.job).toMatchObject({
      trackId: '2710156169',
      status: 'failed',
      failureCount: 3
    })
    expect(thirdRes.body.job.blacklistedUntil).toEqual(expect.any(String))

    const fourthRes = createRes()
    await handler(req, fourthRes)
    expect(fourthRes.status).toHaveBeenCalledWith(200)
    expect(fourthRes.body).toMatchObject({
      accepted: true,
      deduplicated: true,
      job: {
        trackId: '2710156169',
        status: 'failed',
        failureCount: 3
      }
    })
    expect(runArchiveTask).toHaveBeenCalledTimes(3)

    jest.useRealTimers()
  })

  it('supports stringified JSON body', async () => {
    const { handler } = await loadHandler()
    const req = createReq({
      body: JSON.stringify({
        songUrl: 'https://example.com/test.mp3',
        reason: 'manual'
      })
    })
    const res = createRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.body).toMatchObject({
      accepted: true,
      deduplicated: false,
      executed: true,
      job: {
        songUrl: 'https://example.com/test.mp3'
      }
    })
  })
})
