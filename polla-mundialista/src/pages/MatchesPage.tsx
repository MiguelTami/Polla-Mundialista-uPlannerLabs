import { useMemo, useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import {
  formatPhase,
  getMatchDateKey,
  getDateGroupLabel,
} from '../features/matches/match-formatters'
import { MatchCard } from '../features/matches/MatchCard'
import { MatchCardSkeleton } from '../features/matches/MatchCardSkeleton'
import { MatchesFilters } from '../features/matches/MatchesFilters'
import type { MatchFilters } from '../features/matches/matches.types'
import { useMatches } from '../features/matches/useMatches'

export function MatchesPage() {
  const { matches, isLoading, errorMessage, reload } = useMatches()
  const [filters, setFilters] = useState<MatchFilters>({
    phase: '',
    group: '',
  })

  const phases = useMemo(
    () =>
      [...new Set(matches.map((match) => match.phase))]
        .sort()
        .map((phase) => ({ value: phase, label: formatPhase(phase) })),
    [matches],
  )
  const groups = useMemo(
    () =>
      [...new Set(matches.flatMap((match) => match.groupName ?? []))].sort(),
    [matches],
  )
  const filteredMatches = useMemo(
    () =>
      matches.filter(
        (match) =>
          (!filters.phase || match.phase === filters.phase) &&
          (!filters.group || match.groupName === filters.group),
      ),
    [filters, matches],
  )
  const matchesByDate = useMemo(() => {
    const groupsByDate = new Map<string, typeof filteredMatches>()

    for (const match of filteredMatches) {
      const dateKey = getMatchDateKey(match.matchDate)
      groupsByDate.set(dateKey, [...(groupsByDate.get(dateKey) ?? []), match])
    }

    return [...groupsByDate.entries()]
  }, [filteredMatches])

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Calendario"
        title="Partidos"
        description="Consulta todos los encuentros del Mundial, sus horarios y resultados."
      />

      {matches.length > 0 ? (
        <MatchesFilters
          filters={filters}
          phases={phases}
          groups={groups}
          onChange={setFilters}
        />
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <MatchCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="font-bold text-rose-900">
            No pudimos cargar los partidos
          </h2>
          <p className="mt-2 text-sm leading-6 text-rose-700">{errorMessage}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-bold text-white"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {!isLoading && !errorMessage && matches.length === 0 ? (
        <EmptyState
          title="Aún no hay partidos cargados"
          description="La conexión con Supabase funciona, pero las tablas teams y matches todavía no tienen datos."
        />
      ) : null}

      {!isLoading &&
      !errorMessage &&
      matches.length > 0 &&
      filteredMatches.length === 0 ? (
        <EmptyState
          title="No encontramos partidos"
          description="Cambia los filtros para volver a consultar el calendario."
          action={
            <button
              type="button"
              onClick={() => setFilters({ phase: '', group: '' })}
              className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white"
            >
              Limpiar filtros
            </button>
          }
        />
      ) : null}

      {matchesByDate.map(([date, dateMatches]) => (
        <section key={date}>
          <h2 className="mb-3 text-sm font-black capitalize text-slate-700">
            {getDateGroupLabel(dateMatches[0].matchDate)}
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {dateMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
