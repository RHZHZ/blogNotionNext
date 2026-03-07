const ARCHIVE_TASK_STATUS = {
  pending: 'pending',
  archiving: 'archiving',
  archived: 'archived',
  failed: 'failed',
  stale: 'stale'
}

const normalizeText = value => String(value || '').trim()

const hasArchiveTarget = options => {
  const playlistId = normalizeText(options?.playlistId)
  const trackId = normalizeText(options?.trackId)
  const songUrl = normalizeText(options?.songUrl)
  const pageId = normalizeText(options?.pageId)
  return Boolean(playlistId || trackId || songUrl || pageId)
}

const validateArchiveTaskOptions = options => {
  if (!hasArchiveTarget(options)) {
    const error = new Error('At least one of playlistId, trackId, songUrl, pageId is required')
    error.code = 'MISSING_ARCHIVE_TARGET'
    error.status = 400
    throw error
  }

  return options
}

const buildArchiveExecutionMeta = options => {
  const normalized = {
    playlistId: normalizeText(options?.playlistId),
    trackId: normalizeText(options?.trackId),
    songUrl: normalizeText(options?.songUrl),
    pageId: normalizeText(options?.pageId)
  }

  const mode = normalized.playlistId
    ? 'playlist'
    : normalized.trackId
      ? 'track'
      : normalized.songUrl
        ? 'songUrl'
        : 'page'

  return {
    mode,
    target: normalized.playlistId || normalized.trackId || normalized.songUrl || normalized.pageId || null,
    ...normalized
  }
}

module.exports = {
  ARCHIVE_TASK_STATUS,
  hasArchiveTarget,
  validateArchiveTaskOptions,
  buildArchiveExecutionMeta
}
