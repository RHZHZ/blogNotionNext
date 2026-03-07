describe('lib/server/logger', () => {
  const originalEnv = process.env
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error
  }

  const loadLoggerModule = async (env = {}) => {
    jest.resetModules()
    process.env = { ...originalEnv, ...env }
    return import('@/lib/server/logger')
  }

  beforeEach(() => {
    process.env = { ...originalEnv }
    console.debug = jest.fn()
    console.info = jest.fn()
    console.warn = jest.fn()
    console.error = jest.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    console.debug = originalConsole.debug
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
  })

  it('creates request ids with the requested length', async () => {
    const { createRequestId } = await loadLoggerModule()

    expect(createRequestId()).toHaveLength(8)
    expect(createRequestId(6)).toHaveLength(6)
  })

  it('logs all levels when LOG_LEVEL=debug', async () => {
    const { createLogger } = await loadLoggerModule({ LOG_LEVEL: 'debug', NODE_ENV: 'production' })
    const logger = createLogger('meting')

    logger.debug('debug message', { requestId: '1' })
    logger.info('info message')
    logger.warn('warn message')
    logger.error('error message')

    expect(console.debug).toHaveBeenCalledWith('[meting]', 'debug message', { requestId: '1' })
    expect(console.info).toHaveBeenCalledWith('[meting]', 'info message')
    expect(console.warn).toHaveBeenCalledWith('[meting]', 'warn message')
    expect(console.error).toHaveBeenCalledWith('[meting]', 'error message')
  })

  it('suppresses lower-priority logs when LOG_LEVEL=warn', async () => {
    const { createLogger } = await loadLoggerModule({ LOG_LEVEL: 'warn', NODE_ENV: 'development' })
    const logger = createLogger('audio-meta')

    logger.debug('debug message')
    logger.info('info message')
    logger.warn('warn message')
    logger.error('error message', { requestId: '2' })

    expect(console.debug).not.toHaveBeenCalled()
    expect(console.info).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith('[audio-meta]', 'warn message')
    expect(console.error).toHaveBeenCalledWith('[audio-meta]', 'error message', { requestId: '2' })
  })

  it('falls back to environment defaults when LOG_LEVEL is invalid', async () => {
    const devModule = await loadLoggerModule({ LOG_LEVEL: 'invalid-level', NODE_ENV: 'development' })
    expect(devModule.__internal.getConfiguredLevel()).toBe('debug')

    const prodModule = await loadLoggerModule({ LOG_LEVEL: 'invalid-level', NODE_ENV: 'production' })
    expect(prodModule.__internal.getConfiguredLevel()).toBe('info')
  })

  it('supports NEXT_PUBLIC_LOG_LEVEL when LOG_LEVEL is absent', async () => {
    const { createLogger } = await loadLoggerModule({
      LOG_LEVEL: '',
      NEXT_PUBLIC_LOG_LEVEL: 'error',
      NODE_ENV: 'development'
    })
    const logger = createLogger()

    logger.warn('warn message')
    logger.error('error message')

    expect(console.warn).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('[server]', 'error message')
  })

  it('ignores empty or array metadata objects', async () => {
    const { createLogger } = await loadLoggerModule({ LOG_LEVEL: 'info', NODE_ENV: 'production' })
    const logger = createLogger('meting')

    logger.info('empty meta', {})
    logger.info('array meta', [])

    expect(console.info).toHaveBeenNthCalledWith(1, '[meting]', 'empty meta')
    expect(console.info).toHaveBeenNthCalledWith(2, '[meting]', 'array meta')
  })
})
