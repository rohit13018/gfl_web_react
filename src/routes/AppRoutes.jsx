import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import { ROUTES } from '../utils/constants'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  )
}

export default AppRoutes
