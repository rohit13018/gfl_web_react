import { getItem, setItem, removeItem } from './storage'
import { REFRESH_TOKEN_KEY } from './constants'

// Access token is kept in memory only, never in storage — it's re-minted from
// the refresh token on reload (AuthContext) and on 401 (apiService).
let accessToken = null

export const getAccessToken = () => accessToken
export const setAccessToken = (token) => {
  accessToken = token || null
}

// Refresh token is persisted so a reload can re-establish the session.
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY)
export const saveRefreshToken = (token) => setItem(REFRESH_TOKEN_KEY, token)

export const clearTokens = () => {
  accessToken = null
  removeItem(REFRESH_TOKEN_KEY)
}

// A persisted refresh token means there may be a session to restore.
export const hasSession = () => Boolean(getRefreshToken())
