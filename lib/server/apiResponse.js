export function sendApiError(res, status, payload) {
  return res.status(status).json(payload)
}

export function sendApiSuccess(res, status, payload) {
  return res.status(status).json(payload)
}
