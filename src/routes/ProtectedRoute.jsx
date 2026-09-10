import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import useAuth from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'
import { theme } from '../styles/theme'

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Screen = styled.div`
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.pageBg};
`

const Spinner = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid ${theme.colors.border};
  border-top-color: ${theme.colors.navy};
  animation: ${spin} 0.7s linear infinite;
`

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <Screen>
        <Spinner role="status" aria-label="Loading" />
      </Screen>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
