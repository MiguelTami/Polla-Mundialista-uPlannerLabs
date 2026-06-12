import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../features/auth/auth-errors'
import { signOut } from '../../features/auth/auth.service'
import { useAuth } from '../../features/auth/useAuth'

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Partidos', to: '/partidos' },
  { label: 'Mis predicciones', to: '/predicciones' },
  { label: 'Clasificación', to: '/clasificacion' },
  { label: 'Perfil', to: '/perfil' },
] as const

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-100 text-brand-800'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')
}

export function Navbar() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')

  const displayName =
    typeof user?.user_metadata.display_name === 'string'
      ? user.user_metadata.display_name
      : user?.email

  async function handleSignOut() {
    setIsSigningOut(true)
    setSignOutError('')

    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      setSignOutError(getAuthErrorMessage(error))
      setIsSigningOut(false)
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <NavLink to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-700 text-sm font-black text-white">
            26
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight text-slate-950">
              Polla Mundialista
            </span>
            <span className="block text-xs text-slate-500">uPlanner Labs</span>
          </span>
        </NavLink>

        <nav
          aria-label="Navegación principal"
          className="order-3 flex w-full gap-1 overflow-x-auto border-t border-slate-100 pt-3 lg:order-none lg:ml-auto lg:w-auto lg:border-0 lg:pt-0"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={getNavLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex min-w-0 items-center gap-3 lg:ml-2">
          <span
            className="hidden max-w-40 truncate text-sm font-semibold text-slate-700 sm:block"
            title={displayName}
          >
            {displayName}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            {isSigningOut ? 'Saliendo...' : 'Cerrar sesión'}
          </button>
        </div>
      </div>
      {signOutError ? (
        <p role="alert" className="bg-rose-50 px-4 py-2 text-center text-sm text-rose-700">
          {signOutError}
        </p>
      ) : null}
    </header>
  )
}
