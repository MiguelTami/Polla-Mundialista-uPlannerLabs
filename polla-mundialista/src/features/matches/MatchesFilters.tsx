import type { MatchFilters } from './matches.types'

type MatchesFiltersProps = {
  filters: MatchFilters
  phases: Array<{ value: string; label: string }>
  groups: string[]
  dates: Array<{ value: string; label: string; matchCount: number }>
  onChange: (filters: MatchFilters) => void
}

const statusFilters: Array<{
  value: Exclude<MatchFilters['status'], ''>
  label: string
  activeStyles: string
}> = [
  {
    value: 'upcoming',
    label: 'Por jugar',
    activeStyles: 'border-amber-500 bg-amber-500 text-white',
  },
  {
    value: 'in_progress',
    label: 'En curso',
    activeStyles: 'border-rose-600 bg-rose-600 text-white',
  },
  {
    value: 'finished',
    label: 'Finalizados',
    activeStyles: 'border-slate-700 bg-slate-700 text-white',
  },
]

export function MatchesFilters({
  filters,
  phases = [],
  groups = [],
  dates = [],
  onChange,
}: MatchesFiltersProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Fase
          </span>
          <select
            value={filters.phase}
            onChange={(event) =>
              onChange({ ...filters, phase: event.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
          >
            <option value="">Todas las fases</option>
            {phases.map((phase) => (
              <option key={phase.value} value={phase.value}>
                {phase.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Grupo
          </span>
          <select
            value={filters.group}
            onChange={(event) =>
              onChange({ ...filters, group: event.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
          >
            <option value="">Todos los grupos</option>
            {groups.map((group) => (
              <option key={group} value={group}>
                Grupo {group}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Fecha
        </p>
        <div
          className="mt-2 flex gap-2 overflow-x-auto pb-2"
          aria-label="Filtrar partidos por fecha"
        >
          <button
            type="button"
            onClick={() => onChange({ ...filters, date: '' })}
            className={[
              'shrink-0 rounded-xl border px-4 py-2.5 text-left transition',
              !filters.date
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50',
            ].join(' ')}
          >
            <span className="block text-sm font-black">Todas</span>
            <span
              className={[
                'mt-0.5 block text-[11px] font-semibold',
                !filters.date ? 'text-brand-100' : 'text-slate-500',
              ].join(' ')}
            >
              Calendario completo
            </span>
          </button>
          {dates.map((date) => {
            const isActive = filters.date === date.value

            return (
              <button
                key={date.value}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    date: isActive ? '' : date.value,
                  })
                }
                className={[
                  'shrink-0 rounded-xl border px-4 py-2.5 text-left transition',
                  isActive
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50',
                ].join(' ')}
              >
                <span className="block text-sm font-black capitalize">
                  {date.label}
                </span>
                <span
                  className={[
                    'mt-0.5 block text-[11px] font-semibold',
                    isActive ? 'text-brand-100' : 'text-slate-500',
                  ].join(' ')}
                >
                  {date.matchCount}{' '}
                  {date.matchCount === 1 ? 'partido' : 'partidos'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Estado
        </p>
        <div
          className="mt-2 flex flex-wrap gap-2"
          aria-label="Filtrar partidos por estado"
        >
          {statusFilters.map((status) => {
            const isActive = filters.status === status.value

            return (
              <button
                key={status.value}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  onChange({
                    ...filters,
                    status: isActive ? '' : status.value,
                  })
                }
                className={[
                  'rounded-full border px-4 py-2 text-sm font-black transition',
                  isActive
                    ? status.activeStyles
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {status.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
