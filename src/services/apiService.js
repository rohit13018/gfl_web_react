import config from '../config'
import { getAccessToken, getRefreshToken, setAccessToken } from '../utils/token'
import { emitAuthLogout } from '../utils/authBus'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// swagger: POST /api/auth/refresh — { refreshToken } -> { data: { accessToken } }
const REFRESH_ENDPOINT = '/api/auth/refresh'

const buildHeaders = (customHeaders = {}) => {
  const headers = { 'Content-Type': 'application/json', ...customHeaders }
  const accessToken = getAccessToken()

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

const parseResponse = async (response) => {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// Exchanges the stored refresh token for a fresh access token. Uses a raw fetch
// (not `request`) so its own failure can't recurse, and de-dupes concurrent
// callers onto one in-flight call.
let refreshInFlight = null

export const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) throw new ApiError('Session expired', 401)

      let response
      try {
        response = await fetch(`${config.apiBaseUrl}${REFRESH_ENDPOINT}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        })
      } catch {
        throw new ApiError('Unable to reach the server. Check your connection.', 0)
      }

      const data = await parseResponse(response)
      if (!response.ok || !data?.data?.accessToken) {
        throw new ApiError(data?.message || 'Unable to refresh session', response.status)
      }

      setAccessToken(data.data.accessToken)
      return data.data.accessToken
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

const request = async (endpoint, options = {}, allowRefresh = true) => {
  let response

  try {
    response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: buildHeaders(options.headers),
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0)
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    // Access token likely expired — mint a fresh one and retry the request once.
    if (
      response.status === 401 &&
      allowRefresh &&
      endpoint !== REFRESH_ENDPOINT &&
      getRefreshToken()
    ) {
      try {
        await refreshSession()
      } catch (refreshError) {
        if (refreshError instanceof ApiError && refreshError.status === 0) {
          throw new ApiError('Unable to reach the server. Check your connection.', 0)
        }
        emitAuthLogout()
        throw new ApiError('Your session has expired. Please sign in again.', 401)
      }
      return request(endpoint, options, false)
    }

    // 401 with a session present (but unrecoverable) — sign out. A 401 without
    // one is just a rejected login and shouldn't fire a logout.
    if (response.status === 401 && getRefreshToken()) {
      emitAuthLogout()
    }

    throw new ApiError(data?.message || 'Request failed', response.status)
  }

  return data
}

const apiService = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
}

export default apiService
