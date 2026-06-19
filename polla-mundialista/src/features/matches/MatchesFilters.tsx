import type { MatchFilters } from './matches.types'
import type { Team } from './matches.types'
import { FilterSelect } from './FilterSelect'

export type GroupFilterOption = {
  value: string
  label: string
  teams: Team[]
}

type MatchesFiltersProps = {
  filters: MatchFilters
  phases: Array<{ value: string; label: string }>
  groups: GroupFilterOption[]
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
        <FilterSelect
          label="Fase"
          value={filters.phase}
          options={phases}
          emptyLabel="Todas las fases"
          onChange={(phase) => onChange({ ...filters, phase })}
        />
        <FilterSelect
          label="Grupo"
          value={filters.group}
          options={groups}
          emptyLabel="Todos los grupos"
          onChange={(group) => onChange({ ...filters, group })}
          renderTrailing={(group) => <GroupFlags teams={group.teams} />}
        />
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

function GroupFlags({ teams }: { teams: Team[] }) {
  return (
    <span
      className="flex -space-x-1.5"
      aria-label={teams.map((team) => team.name).join(', ')}
      title={teams.map((team) => team.name).join(', ')}
    >
      {teams.map((team) =>
        team.flagUrl ? (
          <img
            key={team.id}
            src={team.flagUrl}
            alt=""
            className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm"
          />
        ) : (
          <span
            key={team.id}
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[8px] font-black text-slate-600 shadow-sm"
          >
            {team.fifaCode ?? team.name.slice(0, 2).toUpperCase()}
          </span>
        ),
      )}
    </span>
  )
}
