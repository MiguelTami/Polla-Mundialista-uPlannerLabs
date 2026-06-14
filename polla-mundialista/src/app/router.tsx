import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { PublicOnlyRoute } from '../features/auth/PublicOnlyRoute'
import { AppLayout } from '../layouts/AppLayout'
import { AuthPage } from '../pages/AuthPage'
import { BracketPage } from '../pages/BracketPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LeaderboardPage } from '../pages/LeaderboardPage'
import { MatchesPage } from '../pages/MatchesPage'
import { PredictionsPage } from '../pages/PredictionsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RouteErrorPage } from '../pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <AuthPage mode="login" />,
      },
      {
        path: '/registro',
        element: <AuthPage mode="register" />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        errorElement: <RouteErrorPage />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'partidos',
            element: <MatchesPage />,
          },
          {
            path: 'predicciones',
            element: <PredictionsPage />,
          },
          {
            path: 'cuadro',
            element: <BracketPage />,
          },
          {
            path: 'clasificacion',
            element: <LeaderboardPage />,
          },
          {
            path: 'perfil',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
