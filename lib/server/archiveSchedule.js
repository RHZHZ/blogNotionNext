import { createLogger } from '@/lib/server/logger'

const logger = createLogger('archive-schedule')

const jobs = new Map()
const DEFAULT_TTL = 10 * 60 * 1000
const FAILED_RETRY_BASE_MS = 60 * 1000
const FAILED_RETRY_MAX_MS = 30 * 60 * 1000
const FAILED_BLACKLIST_THRESHOLD = 3
const FAILED_BLACKLIST_MS = 6 * 60 * 60 * 1000

const normalizeText = value => String(value || '').trim()

const buildScheduleKey = ({ playlistId = '', trackId = '', songUrl = '' }) => {
  const normalizedPlaylistId = normalizeText(playlistId)
  const normalizedTrackId = normalizeText(trackId)
  const normalizedSongUrl = normalizeText(songUrl)
  return [normalizedPlaylistId, normalizedTrackId, normalizedSongUrl].join('::')
}

const cleanupExpiredJobs = (now = Date.now()) => {
  for (const [key, job] of jobs.entries()) {
    if (!job?.expiresAt || job.expiresAt <= now) {
      jobs.delete(key)
    }
  }
}

const calculateFailedRetryDelay = failureCount => {
  const normalizedFailureCount = Math.max(1, Number(failureCount || 1))
  return Math.min(FAILED_RETRY_BASE_MS * (2 ** (normalizedFailureCount - 1)), FAILED_RETRY_MAX_MS)
}

export const scheduleArchiveJob = ({
  playlistId = '',
  trackId = '',
  songUrl = '',
  reason = 'manual',
  ttl = DEFAULT_TTL
} = {}) => {
  const payload = {
    playlistId: normalizeText(playlistId),
    trackId: normalizeText(trackId),
    songUrl: normalizeText(songUrl),
    reason: normalizeText(reason) || 'manual'
  }

  if (!payload.playlistId && !payload.trackId && !payload.songUrl) {
    const error = new Error('At least one of playlistId, trackId, songUrl is required')
    error.code = 'MISSING_ARCHIVE_TARGET'
    error.status = 400
    throw error
  }

  const key = buildScheduleKey(payload)
  const now = Date.now()
  const previousJob = jobs.get(key)

  cleanupExpiredJobs(now)

  const existing = jobs.get(key)
  if (existing && existing.expiresAt > now) {
    return {
      accepted: true,
      deduplicated: true,
      job: serializeJob(existing)
    }
  }

  const carriedFailureCount = previousJob?.status === 'failed'
    ? Number(previousJob.failureCount || 0)
    : 0
  const carriedBlacklistUntil = previousJob?.status === 'failed'
    ? (previousJob.blacklistedUntil || null)
    : null

  const job = {
    id: `archive_${Math.random().toString(36).slice(2, 10)}`,
    ...payload,
    status: 'pending',
    createdAt: new Date(now).toISOString(),
    expiresAt: now + ttl,
    failureCount: carriedFailureCount,
    nextRetryAt: null,
    blacklistedUntil: carriedBlacklistUntil
  }

  jobs.set(key, job)
  logger.info('Archive job scheduled', {
    key,
    playlistId: job.playlistId || null,
    trackId: job.trackId || null,
    songUrl: job.songUrl || null,
    reason: job.reason,
    carriedFailureCount
  })

  return {
    accepted: true,
    deduplicated: false,
    job: serializeJob(job)
  }
}


const serializeJob = job => ({
  id: job.id,
  playlistId: job.playlistId,
  trackId: job.trackId,
  songUrl: job.songUrl,
  reason: job.reason,
  status: job.status,
  createdAt: job.createdAt,
  startedAt: job.startedAt || null,
  finishedAt: job.finishedAt || null,
  error: job.error || null,
  result: job.result || null,
  failureCount: Number(job.failureCount || 0),
  nextRetryAt: job.nextRetryAt || null,
  blacklistedUntil: job.blacklistedUntil || null
})

export const markArchiveJobRunning = jobId => {
  for (const [key, job] of jobs.entries()) {
    if (job?.id !== jobId) continue
    const nextJob = {
      ...job,
      status: 'running',
      startedAt: new Date().toISOString(),
      error: null,
      nextRetryAt: null,
      blacklistedUntil: null
    }
    jobs.set(key, nextJob)
    return nextJob
  }
  return null
}

export const markArchiveJobFinished = (jobId, result = null) => {
  for (const [key, job] of jobs.entries()) {
    if (job?.id !== jobId) continue
    const nextJob = {
      ...job,
      status: 'completed',
      finishedAt: new Date().toISOString(),
      result: result || null,
      error: null,
      failureCount: 0,
      nextRetryAt: null,
      blacklistedUntil: null
    }
    jobs.set(key, nextJob)
    return nextJob
  }
  return null
}

export const markArchiveJobFailed = (jobId, error) => {
  for (const [key, job] of jobs.entries()) {
    if (job?.id !== jobId) continue
    const failureCount = Number(job.failureCount || 0) + 1
    const now = Date.now()
    const retryDelay = calculateFailedRetryDelay(failureCount)
    const isBlacklisted = failureCount >= FAILED_BLACKLIST_THRESHOLD
    const nextRetryAt = new Date(now + retryDelay).toISOString()
    const blacklistedUntil = isBlacklisted
      ? new Date(now + FAILED_BLACKLIST_MS).toISOString()
      : null
    const nextJob = {
      ...job,
      status: 'failed',
      finishedAt: new Date(now).toISOString(),
      error: String(error?.message || error || 'Unknown archive error').slice(0, 500),
      failureCount,
      nextRetryAt,
      blacklistedUntil,
      expiresAt: isBlacklisted ? now + FAILED_BLACKLIST_MS : now + retryDelay
    }
    jobs.set(key, nextJob)
    logger.warn(isBlacklisted ? 'Archive job blacklisted after repeated failures' : 'Archive job scheduled for retry', {
      key,
      failureCount,
      nextRetryAt,
      blacklistedUntil,
      error: nextJob.error
    })
    return nextJob
  }
  return null
}

export const getArchiveJob = jobId => {
  for (const job of jobs.values()) {
    if (job?.id === jobId) return job
  }
  return null
}

export const __internal = {
  jobs,
  buildScheduleKey,
  cleanupExpiredJobs,
  calculateFailedRetryDelay,
  DEFAULT_TTL,
  FAILED_RETRY_BASE_MS,
  FAILED_RETRY_MAX_MS,
  FAILED_BLACKLIST_THRESHOLD,
  FAILED_BLACKLIST_MS,
  serializeJob
}
