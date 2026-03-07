/** @jest-environment node */
const {
  ARCHIVE_TASK_STATUS,
  buildArchiveExecutionMeta,
  hasArchiveTarget,
  validateArchiveTaskOptions
} = require('@/lib/server/archiveCore')

describe('lib/server/archiveCore', () => {
  it('exposes unified archive status constants', () => {
    expect(ARCHIVE_TASK_STATUS).toEqual({
      pending: 'pending',
      archiving: 'archiving',
      archived: 'archived',
      failed: 'failed',
      stale: 'stale'
    })
  })

  it('detects whether archive target exists', () => {
    expect(hasArchiveTarget({})).toBe(false)
    expect(hasArchiveTarget({ pageId: 'page-1' })).toBe(true)
    expect(hasArchiveTarget({ trackId: '123' })).toBe(true)
  })

  it('builds archive execution meta', () => {
    expect(buildArchiveExecutionMeta({ playlistId: ' 17814924409 ' })).toEqual({
      mode: 'playlist',
      target: '17814924409',
      playlistId: '17814924409',
      trackId: '',
      songUrl: '',
      pageId: ''
    })
  })

  it('validates archive task options', () => {
    expect(() => validateArchiveTaskOptions({})).toThrow('At least one of playlistId, trackId, songUrl, pageId is required')
    expect(validateArchiveTaskOptions({ trackId: '42' })).toEqual({ trackId: '42' })
  })
})
