import type { MatchFilters } from './matches.types'

type MatchesFiltersProps = {
  filters: MatchFilters
  phases: Array<{ value: string; label: string }>
  groups: string[]
  onChange: (filters: MatchFilters) => void
}

export function MatchesFilters({
  filters,
  phases,
  groups,
  onChange,
}: MatchesFiltersProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
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
  )
}
