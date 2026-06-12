import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { useAuth } from './useAuth'

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
