import { createContext, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'
import { getItem, setItem, removeItem } from '../utils/storage'
import { USER_KEY } from '../utils/constants'
import { saveAccessToken, saveRefreshToken, getAccessToken, removeTokens } from '../utils/token'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getAccessToken)
  const [user, setUser] = useState(() => getItem(USER_KEY))

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password })

    saveAccessToken(data.accessToken)
    saveRefreshToken(data.refreshToken)
    setItem(USER_KEY, data.user)

    setAccessToken(data.accessToken)
    setUser(data.user)

    return data.user
  }, [])

  const logout = useCallback(() => {
    removeTokens()
    removeItem(USER_KEY)
    setAccessToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [user, accessToken, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
