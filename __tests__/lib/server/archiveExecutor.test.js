/** @jest-environment node */

describe('lib/server/archiveExecutor', () => {
  const loadModule = () => require('@/lib/server/archiveExecutor')

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('normalizes archive task options', () => {
    const {
      DEFAULT_ARCHIVE_TASK_OPTIONS,
      normalizeArchiveTaskOptions
    } = loadModule()

    expect(normalizeArchiveTaskOptions({
      force: 1,
      dryRun: '',
      limit: '3',
      trackId: ' 123 ',
      playlistId: '  ',
      songUrl: null
    })).toEqual({
      ...DEFAULT_ARCHIVE_TASK_OPTIONS,
      force: true,
      dryRun: false,
      limit: 3,
      trackId: '123'
    })
  })

  it('resolves task mode by priority', () => {
    const { resolveArchiveTaskMode } = loadModule()

    expect(resolveArchiveTaskMode({ playlistId: '1', trackId: '2' })).toBe('playlist')
    expect(resolveArchiveTaskMode({ trackId: '2', songUrl: 'x' })).toBe('track')
    expect(resolveArchiveTaskMode({ songUrl: 'x' })).toBe('songUrl')
    expect(resolveArchiveTaskMode({ pageId: 'page-1' })).toBe('page')
    expect(resolveArchiveTaskMode({})).toBe('database')
  })

  it('delegates execution to injected runner with normalized options', async () => {
    const {
      executeArchiveTask,
      setArchiveTaskRunnerForTest
    } = loadModule()
    const runner = jest.fn().mockResolvedValue('ok')
    setArchiveTaskRunnerForTest(runner)

    await expect(executeArchiveTask({ trackId: ' 42 ', limit: '2' })).resolves.toBe('ok')
    expect(runner).toHaveBeenCalledWith(expect.objectContaining({
      trackId: '42',
      limit: 2
    }))
  })

  it('loads shared archive task runner module when no injected runner is set', async () => {
    const runner = jest.fn().mockResolvedValue('shared-ok')
    jest.doMock('@/lib/server/archiveTaskRunner', () => ({
      runArchiveTask: runner
    }))

    const { executeArchiveTask } = loadModule()

    await expect(executeArchiveTask({ trackId: '42' })).resolves.toBe('shared-ok')
    expect(runner).toHaveBeenCalledWith(expect.objectContaining({
      trackId: '42'
    }))
  })
})


