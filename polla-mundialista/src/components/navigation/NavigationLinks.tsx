import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'

type NavigationLinksProps = {
  onNavigate?: () => void
}

export function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <nav aria-label="Navegación principal" className="space-y-1">
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
              isActive
                ? 'bg-brand-100 text-brand-900'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            ].join(' ')
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
