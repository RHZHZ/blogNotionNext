export const createRequestId = (length = 8) => Math.random().toString(36).slice(2, 2 + length)

const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 50
}

const DEFAULT_DEV_LEVEL = 'debug'
const DEFAULT_PROD_LEVEL = 'info'

const normalizeLevel = level => {
  const normalized = String(level || '')
    .trim()
    .toLowerCase()
  return LOG_LEVELS[normalized] ? normalized : null
}

const getConfiguredLevel = () => {
  const configured = normalizeLevel(process.env.LOG_LEVEL || process.env.NEXT_PUBLIC_LOG_LEVEL)
  if (configured) return configured
  return process.env.NODE_ENV === 'production' ? DEFAULT_PROD_LEVEL : DEFAULT_DEV_LEVEL
}

const shouldLog = level => LOG_LEVELS[level] >= LOG_LEVELS[getConfiguredLevel()]

const write = (method, args) => {
  const fn = console?.[method]
  if (typeof fn === 'function') {
    fn(...args)
  }
}

const formatScope = scope => (scope ? `[${scope}]` : '[server]')

const serializeMeta = meta => {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null
  return Object.keys(meta).length ? meta : null
}

export const createLogger = scope => {
  const prefix = formatScope(scope)

  const emit = (level, message, meta) => {
    if (!shouldLog(level)) return
    const details = serializeMeta(meta)
    const args = details ? [prefix, message, details] : [prefix, message]
    write(level, args)
  }

  return {
    debug(message, meta) {
      emit('debug', message, meta)
    },
    info(message, meta) {
      emit('info', message, meta)
    },
    warn(message, meta) {
      emit('warn', message, meta)
    },
    error(message, meta) {
      emit('error', message, meta)
    }
  }
}

export const __internal = {
  LOG_LEVELS,
  DEFAULT_DEV_LEVEL,
  DEFAULT_PROD_LEVEL,
  normalizeLevel,
  getConfiguredLevel,
  shouldLog,
  formatScope,
  serializeMeta
}
