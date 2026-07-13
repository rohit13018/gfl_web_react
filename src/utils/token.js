import { getItem, setItem, removeItem } from './storage'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './constants'

export const saveAccessToken = (token) => setItem(ACCESS_TOKEN_KEY, token)
export const getAccessToken = () => getItem(ACCESS_TOKEN_KEY)

export const saveRefreshToken = (token) => setItem(REFRESH_TOKEN_KEY, token)
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY)

export const removeTokens = () => {
  removeItem(ACCESS_TOKEN_KEY)
  removeItem(REFRESH_TOKEN_KEY)
}

export const isAuthenticated = () => Boolean(getAccessToken())
