import { NavLink } from 'react-router-dom'

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
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
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
          className="ml-auto flex gap-1 overflow-x-auto pb-1 sm:pb-0"
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
      </div>
    </header>
  )
}
