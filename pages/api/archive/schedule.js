import { sendApiError, sendApiSuccess } from '@/lib/server/apiResponse'
import { createRequestId } from '@/lib/server/logger'
import {
  markArchiveJobFailed,
  markArchiveJobFinished,
  markArchiveJobRunning,
  scheduleArchiveJob
} from '@/lib/server/archiveSchedule'
import { executeArchiveTask, resolveArchiveTaskMode } from '@/lib/server/archiveExecutor'

export default async function handler(req, res) {
  const requestId = createRequestId(6)

  if (req.method !== 'POST') {
    return sendApiError(res, 405, {
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
      requestId
    })
  }

  try {
    const body = typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : (req.body || {})

    const result = scheduleArchiveJob({
      playlistId: body.playlistId,
      trackId: body.trackId,
      songUrl: body.songUrl,
      reason: body.reason
    })

    if (result.deduplicated) {
      return sendApiSuccess(res, 200, {
        requestId,
        accepted: true,
        deduplicated: true,
        job: result.job
      })
    }

    markArchiveJobRunning(result.job.id)

    try {
      await executeArchiveTask({
        force: false,
        dryRun: false,
        limit: Number(body.limit || 0) || 0,
        pageId: '',
        sourceUrl: '',
        trackId: body.trackId || '',
        songUrl: body.songUrl || '',
        playlistId: body.playlistId || ''
      })

      const completedJob = markArchiveJobFinished(result.job.id, {
        executed: true,
        mode: resolveArchiveTaskMode(body)
      })

      return sendApiSuccess(res, 202, {
        requestId,
        accepted: true,
        deduplicated: false,
        executed: true,
        job: completedJob || result.job
      })
    } catch (error) {
      const failedJob = markArchiveJobFailed(result.job.id, error)
      throw Object.assign(error, {
        status: error?.status || 500,
        code: error?.code || 'ARCHIVE_EXECUTION_FAILED',
        failedJob
      })
    }
  } catch (error) {
    const status = error?.status || (error instanceof SyntaxError ? 400 : 500)
    const code = error?.code || (error instanceof SyntaxError ? 'INVALID_JSON' : 'ARCHIVE_SCHEDULE_FAILED')
    const message = error instanceof SyntaxError
      ? 'Invalid JSON body'
      : (error?.message || 'Failed to schedule archive job')

    return sendApiError(res, status, {
      error: message,
      code,
      requestId,
      ...(error?.failedJob ? { job: error.failedJob } : {})
    })
  }
}
