export const createClientCacheResource = ({
  cacheKey,
  cacheTTL,
  memoryTTL,
  normalize,
  onReadStorage,
  onWriteStorage
}) => {
  let inflightPromise = null
  let latestResult = null
  let latestTimestamp = 0

  const normalizeResult = value => normalize(value)

  const readStorage = () => {
    if (typeof window === 'undefined') return null

    try {
      const raw = window.sessionStorage.getItem(cacheKey)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      const timestamp = Number(parsed?.timestamp) || 0
      if (!timestamp || Date.now() - timestamp > cacheTTL) {
        window.sessionStorage.removeItem(cacheKey)
        return null
      }
      const payload = onReadStorage
        ? onReadStorage({ parsed, timestamp, expiresAt: timestamp + cacheTTL })
        : parsed?.payload
      return normalizeResult(payload)
    } catch {
      return null
    }
  }

  const writeStorage = value => {
    if (typeof window === 'undefined') return

    try {
      const timestamp = Date.now()
      const payload = onWriteStorage
        ? onWriteStorage({ value, timestamp, expiresAt: timestamp + cacheTTL })
        : normalizeResult(value)
      window.sessionStorage.setItem(
        cacheKey,
        JSON.stringify({
          timestamp,
          payload
        })
      )
    } catch {}
  }

  const getMemory = () => {
    if (!latestResult) return null
    if (Date.now() - latestTimestamp > memoryTTL) {
      latestResult = null
      latestTimestamp = 0
      return null
    }
    return normalizeResult(latestResult)
  }

  const setMemory = value => {
    latestResult = normalizeResult(value)
    latestTimestamp = Date.now()
    return latestResult
  }

  const fetch = async ({ request, bypassMemory = false } = {}) => {
    if (typeof request !== 'function') throw new Error('request is required')

    if (typeof window === 'undefined' || bypassMemory) {
      const result = await request()
      return setMemory(result)
    }

    const memoryResult = getMemory()
    if (memoryResult) return memoryResult

    if (!inflightPromise) {
      inflightPromise = Promise.resolve()
        .then(() => request())
        .then(result => setMemory(result))
        .finally(() => {
          inflightPromise = null
        })
    }

    return inflightPromise
  }

  return {
    readStorage,
    writeStorage,
    getMemory,
    setMemory,
    fetch
  }
}
