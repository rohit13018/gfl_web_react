import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import { ROUTES } from '../utils/constants'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
