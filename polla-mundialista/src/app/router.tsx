import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { AuthPage } from '../pages/AuthPage'
import { DashboardPage } from '../pages/DashboardPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
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
        element: (
          <PlaceholderPage
            eyebrow="Próxima fase"
            title="Partidos"
            description="Aquí podrás consultar el calendario, filtrar por fase y registrar tus marcadores."
          />
        ),
      },
      {
        path: 'predicciones',
        element: (
          <PlaceholderPage
            eyebrow="Próxima fase"
            title="Mis predicciones"
            description="Este espacio reunirá tus pronósticos, su estado y los puntos obtenidos."
          />
        ),
      },
      {
        path: 'clasificacion',
        element: (
          <PlaceholderPage
            eyebrow="Próxima fase"
            title="Clasificación"
            description="El ranking general mostrará la posición y los puntos de cada participante."
          />
        ),
      },
      {
        path: 'perfil',
        element: (
          <PlaceholderPage
            eyebrow="Próxima fase"
            title="Perfil"
            description="Aquí podrás gestionar tu información y revisar tu actividad en la polla."
          />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
