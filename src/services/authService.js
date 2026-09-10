import apiService, { ApiError } from './apiService'
import config from '../config'

const login = async ({ username, password }) => {
  let response

  try {
    // The API requires `mode` alongside the credentials.
    response = await apiService.post('/web/admin/authenticate', {
      username,
      password,
      mode: config.authMode,
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error('Invalid username or password', { cause: error })
    }
    if (error instanceof ApiError && error.status === 0) {
      throw new Error('Unable to reach the server. Please try again later.', { cause: error })
    }
    throw new Error('Something went wrong. Please try again.', { cause: error })
  }

  // Unwrap the { success, message, data } envelope.
  if (!response?.data?.accessToken) {
    throw new Error('Unexpected response from the server. Please try again.')
  }

  return response.data
}

// swagger: POST /api/auth/logout — revokes the refresh token server-side. Best-effort.
const logout = (refreshToken) => {
  if (!refreshToken) return Promise.resolve()
  return apiService.post('/api/auth/logout', { refreshToken }).catch(() => {})
}

const authService = { login, logout }

export default authService
