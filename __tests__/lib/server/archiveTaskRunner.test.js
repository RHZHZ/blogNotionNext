/** @jest-environment node */

describe('lib/server/archiveTaskRunner __internal', () => {
  const loadModule = () => require('@/lib/server/archiveTaskRunner')

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('detects completed archive pages only when archived status and stable url both exist', () => {
    const { __internal } = loadModule()

    expect(__internal.isArchivePageCompleted({
      properties: {
        ArchiveStatus: { status: { name: 'archived' } },
        ArchivedAudioUrl: { url: 'https://archive.example.com/stable.mp3' }
      }
    })).toBe(true)

    expect(__internal.isArchivePageCompleted({
      properties: {
        ArchiveStatus: { status: { name: 'failed' } },
        ArchivedAudioUrl: { url: 'https://archive.example.com/stable.mp3' }
      }
    })).toBe(false)

    expect(__internal.isArchivePageCompleted({
      properties: {
        ArchiveStatus: { status: { name: 'archived' } },
        ArchivedAudioUrl: { url: '' }
      }
    })).toBe(false)
  })
})
