import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'
import { ApiError, refreshSession } from '../services/apiService'
import { getItem, setItem, removeItem } from '../utils/storage'
import { USER_KEY } from '../utils/constants'
import { onAuthLogout } from '../utils/authBus'
import {
  setAccessToken as storeAccessToken,
  saveRefreshToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '../utils/token'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getAccessToken)
  const [user, setUser] = useState(() => getItem(USER_KEY))
  // On a reload the in-memory access token is gone; if a refresh token is
  // persisted we try to re-mint one before deciding the user is logged out.
  const [isInitializing, setIsInitializing] = useState(() => Boolean(getRefreshToken()))

  const login = useCallback(async ({ username, password }) => {
    const data = await authService.login({ username, password })

    storeAccessToken(data.accessToken)
    saveRefreshToken(data.refreshToken)
    setItem(USER_KEY, data.user)

    setAccessToken(data.accessToken)
    setUser(data.user)

    return data.user
  }, [])

  const logout = useCallback(() => {
    authService.logout(getRefreshToken())
    clearTokens()
    removeItem(USER_KEY)
    setAccessToken(null)
    setUser(null)
  }, [])

  // Restore the session from the persisted refresh token on load.
  useEffect(() => {
    if (!getRefreshToken()) return undefined

    let active = true

    refreshSession()
      .then((token) => {
        if (active) setAccessToken(token)
      })
      .catch((error) => {
        if (!active) return
        // Keep the session on a network error so a flaky reload doesn't force
        // a re-login; only drop it when the refresh token is actually rejected.
        if (error instanceof ApiError && error.status === 0) return
        clearTokens()
        removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => {
        if (active) setIsInitializing(false)
      })

    return () => {
      active = false
    }
  }, [])

  // Clear session when the API layer signals a 401; ProtectedRoute then redirects to login.
  useEffect(() => onAuthLogout(logout), [logout])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      login,
      logout,
    }),
    [user, accessToken, isInitializing, login, logout]
  )

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
