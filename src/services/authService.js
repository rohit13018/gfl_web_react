import apiService, { ApiError } from './apiService'

const login = async ({ email, password }) => {
  try {
    return await apiService.post('/login', { email, password })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new Error('Invalid email or password', { cause: error })
    }
    if (error instanceof ApiError && error.status === 0) {
      throw new Error('Unable to reach the server. Please try again later.', { cause: error })
    }
    throw new Error('Something went wrong. Please try again.', { cause: error })
  }
}

const authService = { login }

export default authService
