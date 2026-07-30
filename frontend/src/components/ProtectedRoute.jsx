import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children, requireAuth = true, allowedRoles, redirectTo }) {
  const { isAuthenticated, user } = useAuth()

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || '/student/login'} replace />
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={redirectTo || '/admin/login'} replace />
  }

  return children
}

export default ProtectedRoute
