import { API_BASE_URL } from '../utils/constants'
import { getAccessToken } from '../utils/token'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

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

const request = async (endpoint, options = {}) => {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: buildHeaders(options.headers),
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0)
  }

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed', response.status)
  }

  return data
}

const apiService = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
}

export default apiService
