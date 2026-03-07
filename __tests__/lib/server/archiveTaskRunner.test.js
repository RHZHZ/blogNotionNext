/** @jest-environment node */

describe('lib/server/archiveTaskRunner __internal', () => {
  const loadModule = () => require('@/lib/server/archiveTaskRunner')

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    delete process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER
    delete process.env.ARCHIVE_AUDIO_STORAGE_PROVIDER
    process.env.TENCENT_COS_SECRET_ID = ''
    process.env.TENCENT_COS_SECRET_KEY = ''
    process.env.TENCENT_COS_BUCKET = ''
    process.env.TENCENT_COS_REGION = ''
    process.env.TENCENT_COS_KEY_PREFIX = ''
    process.env.TENCENT_COS_PUBLIC_BASE_URL = ''
    process.env.COS_SECRET_ID = ''
    process.env.COS_SECRET_KEY = ''
    process.env.COS_BUCKET = ''
    process.env.COS_REGION = ''
    process.env.COS_KEY_PREFIX = ''
    process.env.COS_PUBLIC_BASE_URL = ''
    process.env.QINIU_ACCESS_KEY = ''
    process.env.QINIU_SECRET_KEY = ''
    process.env.QINIU_BUCKET = ''
    process.env.QINIU_REGION = ''
    process.env.QINIU_UPLOAD_URL = ''
    process.env.QINIU_KEY_PREFIX = ''
    process.env.QINIU_PUBLIC_BASE_URL = ''
    process.env.R2_ACCOUNT_ID = ''
    process.env.R2_ACCESS_KEY_ID = ''
    process.env.R2_ACCESS_KEY = ''
    process.env.R2_SECRET_ACCESS_KEY = ''
    process.env.R2_SECRET_KEY = ''
    process.env.R2_BUCKET = ''
    process.env.R2_ENDPOINT = ''
    process.env.R2_PUBLIC_BASE_URL = ''
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

  it('prefers configured qiniu provider when qiniu env is complete', async () => {
    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER = 'qiniu'
    process.env.QINIU_ACCESS_KEY = 'ak123'
    process.env.QINIU_SECRET_KEY = 'sk123'
    process.env.QINIU_BUCKET = 'bucket123'
    process.env.QINIU_REGION = 'z0'
    process.env.QINIU_PUBLIC_BASE_URL = 'https://cdn.example.com/music'

    const { __internal } = loadModule()
    await __internal.initializeRuntimeConfig()

    expect(__internal.hasQiniuStorageConfigured()).toBe(true)
    expect(__internal.getConfiguredStorageProvider()).toBe('qiniu')
    expect(__internal.getStorageProviderDiagnostics().activeProvider).toBe('qiniu')
  })



  it('derives qiniu upload url from region when upload url is omitted', async () => {
    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER = 'qiniu'
    process.env.QINIU_ACCESS_KEY = 'ak123'
    process.env.QINIU_SECRET_KEY = 'sk123'
    process.env.QINIU_BUCKET = 'bucket123'
    process.env.QINIU_REGION = 'z1'
    process.env.QINIU_PUBLIC_BASE_URL = 'https://cdn.example.com/music'

    const { __internal } = loadModule()
    await __internal.initializeRuntimeConfig()

    expect(__internal.hasQiniuStorageConfigured()).toBe(true)
    const diagnostics = __internal.getStorageProviderDiagnostics()
    expect(diagnostics.activeProvider).toBe('qiniu')
  })


  it('prefers configured r2 provider when r2 env is complete', async () => {
    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER = 'r2'
    process.env.R2_ACCOUNT_ID = 'acc123'
    process.env.R2_ACCESS_KEY_ID = 'key123'
    process.env.R2_SECRET_ACCESS_KEY = 'secret123'
    process.env.R2_BUCKET = 'bucket123'
    process.env.R2_PUBLIC_BASE_URL = 'https://cdn.example.com/music'

    const { __internal } = loadModule()
    await __internal.initializeRuntimeConfig()

    expect(__internal.hasR2StorageConfigured()).toBe(true)
    expect(__internal.getConfiguredStorageProvider()).toBe('r2')
    expect(__internal.getStorageProviderDiagnostics().activeProvider).toBe('r2')
  })

  it('reports provider diagnostics for incomplete qiniu configuration', async () => {

    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER = 'qiniu'
    process.env.QINIU_BUCKET = 'bucket123'

    const { __internal } = loadModule()
    await __internal.initializeRuntimeConfig()

    const diagnostics = __internal.getStorageProviderDiagnostics()
    expect(diagnostics.configuredProvider).toBe('qiniu')
    expect(diagnostics.activeProvider).toBe('local')
    expect(diagnostics.providers.qiniu.available).toBe(false)
    expect(diagnostics.providers.qiniu.reason).toContain('missing QINIU_ACCESS_KEY')
  })

  it('reports provider diagnostics for incomplete r2 configuration', async () => {
    process.env.MUSIC_PLAYER_AUDIO_STORAGE_PROVIDER = 'r2'
    process.env.R2_BUCKET = 'bucket123'

    const { __internal } = loadModule()
    await __internal.initializeRuntimeConfig()

    const diagnostics = __internal.getStorageProviderDiagnostics()
    expect(diagnostics.configuredProvider).toBe('r2')
    expect(diagnostics.activeProvider).toBe('local')
    expect(diagnostics.providers.r2.available).toBe(false)
    expect(diagnostics.providers.r2.reason).toContain('missing R2_ACCESS_KEY_ID')
  })
})


