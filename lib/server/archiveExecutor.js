const {
  buildArchiveExecutionMeta,
  validateArchiveTaskOptions
} = require('./archiveCore')

let archiveTaskRunner = null
let archiveTaskRunnerLoadError = null

const DEFAULT_ARCHIVE_TASK_OPTIONS = {
  force: false,
  dryRun: false,
  limit: 0,
  pageId: '',
  sourceUrl: '',
  trackId: '',
  songUrl: '',
  playlistId: ''
}

const normalizeText = value => String(value || '').trim()

const normalizeArchiveTaskOptions = (options = {}) => ({
  force: Boolean(options.force),
  dryRun: Boolean(options.dryRun),
  limit: Math.max(0, Number(options.limit || 0) || 0),
  pageId: normalizeText(options.pageId),
  sourceUrl: normalizeText(options.sourceUrl),
  trackId: normalizeText(options.trackId),
  songUrl: normalizeText(options.songUrl),
  playlistId: normalizeText(options.playlistId)
})

const resolveArchiveTaskMode = options => {
  const normalized = normalizeArchiveTaskOptions(options)
  if (normalized.playlistId) return buildArchiveExecutionMeta(normalized).mode
  if (normalized.trackId) return buildArchiveExecutionMeta(normalized).mode
  if (normalized.songUrl) return buildArchiveExecutionMeta(normalized).mode
  if (normalized.pageId) return buildArchiveExecutionMeta(normalized).mode
  return 'database'
}


const setArchiveTaskRunnerForTest = runner => {
  archiveTaskRunner = typeof runner === 'function' ? runner : null
  archiveTaskRunnerLoadError = null
}

const loadArchiveTaskRunner = () => {
  if (archiveTaskRunner) return archiveTaskRunner

  try {
    const { runArchiveTask } = require('./archiveTaskRunner')
    if (typeof runArchiveTask !== 'function') {
      throw new Error('runArchiveTask export is missing')
    }
    archiveTaskRunner = runArchiveTask
    return archiveTaskRunner
  } catch (error) {
    archiveTaskRunnerLoadError = error
    throw new Error(
      `Archive task runner is not available in current workspace${error?.message ? `: ${error.message}` : ''}`
    )
  }
}

const executeArchiveTask = async options => {
  const normalized = validateArchiveTaskOptions(normalizeArchiveTaskOptions(options))
  return loadArchiveTaskRunner()(normalized)
}

module.exports = {
  DEFAULT_ARCHIVE_TASK_OPTIONS,
  normalizeArchiveTaskOptions,
  resolveArchiveTaskMode,
  executeArchiveTask,
  setArchiveTaskRunnerForTest,
  __internal: {
    loadArchiveTaskRunner,
    getArchiveTaskRunnerLoadError: () => archiveTaskRunnerLoadError
  }
}



