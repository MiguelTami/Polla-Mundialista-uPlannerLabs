import { useMemo, useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { simulateGroups } from '../features/bracket/bracket-engine'
import { GroupStandingsSection } from '../features/groups/GroupStandingsSection'
import {
  getDateFilterLabel,
  getMatchFilterStatus,
  formatPhase,
  getMatchDateKey,
  getDateGroupLabel,
} from '../features/matches/match-formatters'
import { MatchCard } from '../features/matches/MatchCard'
import { MatchCardSkeleton } from '../features/matches/MatchCardSkeleton'
import { MatchesFilters } from '../features/matches/MatchesFilters'
import type { MatchFilters } from '../features/matches/matches.types'
import { useMatches } from '../features/matches/useMatches'
import { hasMatchStarted } from '../features/matches/match-formatters'
import { LockedPrediction } from '../features/predictions/LockedPrediction'
import { PredictionForm } from '../features/predictions/PredictionForm'
import { usePredictions } from '../features/predictions/usePredictions'

export function MatchesPage() {
  const { matches, isLoading, errorMessage, reload } = useMatches()
  const {
    predictions,
    predictionsByMatchId,
    isLoading: arePredictionsLoading,
    errorMessage: predictionsError,
    updatePrediction,
  } = usePredictions()
  const [filters, setFilters] = useState<MatchFilters>({
    phase: '',
    group: '',
    date: '',
    status: '',
  })
  const [showStandings, setShowStandings] = useState(false)

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
  const dates = useMemo(
    () => {
      const datesByKey = new Map<
        string,
        { value: string; label: string; matchCount: number }
      >()

      const matchesForDateFilter = matches.filter((match) => {
        const status = getMatchFilterStatus(match)

        if (filters.status === 'finished') return status === 'finished'
        if (filters.status) return status === filters.status
        return status !== 'finished'
      })

      for (const match of matchesForDateFilter) {
        const value = getMatchDateKey(match.matchDate)
        const current = datesByKey.get(value)

        datesByKey.set(value, {
          value,
          label: getDateFilterLabel(match.matchDate),
          matchCount: (current?.matchCount ?? 0) + 1,
        })
      }

      return [...datesByKey.values()].sort((first, second) =>
        first.value.localeCompare(second.value),
      )
    },
    [filters.status, matches],
  )
  const activeDate = dates.some((date) => date.value === filters.date)
    ? filters.date
    : ''
  const filteredMatches = useMemo(
    () =>
      matches.filter(
        (match) =>
          (!filters.phase || match.phase === filters.phase) &&
          (!filters.group || match.groupName === filters.group) &&
          (!activeDate ||
            getMatchDateKey(match.matchDate) === activeDate) &&
          (!filters.status ||
            getMatchFilterStatus(match) === filters.status),
      ),
    [activeDate, filters, matches],
  )
  const simulatedGroups = useMemo(
    () => simulateGroups(matches, predictions),
    [matches, predictions],
  )
  const visibleStandings = useMemo(
    () =>
      filters.group
        ? simulatedGroups.filter(
            (group) => group.groupName === filters.group,
          )
        : simulatedGroups,
    [filters.group, simulatedGroups],
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

      {predictionsError ? (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          Los partidos cargaron, pero no pudimos consultar tus predicciones.
        </p>
      ) : null}

      {matches.length > 0 ? (
        <MatchesFilters
          filters={{ ...filters, date: activeDate }}
          phases={phases}
          groups={groups}
          dates={dates}
          onChange={setFilters}
        />
      ) : null}

      {!isLoading &&
      !errorMessage &&
      matches.length > 0 &&
      (!filters.phase || filters.phase === 'group_stage') ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black text-slate-950">
                Tablas de posiciones
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Consulta cómo quedan los grupos según resultados y predicciones.
              </p>
            </div>
            <button
              type="button"
              aria-expanded={showStandings}
              onClick={() => setShowStandings((current) => !current)}
              className={[
                'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-black transition',
                showStandings
                  ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  : 'bg-brand-700 text-white hover:bg-brand-800',
              ].join(' ')}
            >
              {showStandings ? 'Ocultar tablas' : 'Mostrar tablas'}
            </button>
          </div>
        </section>
      ) : null}

      {showStandings &&
      !isLoading &&
      !arePredictionsLoading &&
      !errorMessage &&
      matches.length > 0 &&
      (!filters.phase || filters.phase === 'group_stage') ? (
        <GroupStandingsSection groups={visibleStandings} />
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
              onClick={() =>
                setFilters({ phase: '', group: '', date: '', status: '' })
              }
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
              <MatchCard
                key={match.id}
                match={match}
                predictionContent={
                  arePredictionsLoading ? (
                    <div className="border-t border-slate-100 pt-4">
                      <div className="mx-auto h-10 w-40 animate-pulse rounded-xl bg-slate-100" />
                    </div>
                  ) : hasMatchStarted(match.matchDate) ? (
                    <LockedPrediction
                      prediction={predictionsByMatchId.get(String(match.id))}
                    />
                  ) : (
                    <PredictionForm
                      match={match}
                      prediction={predictionsByMatchId.get(String(match.id))}
                      onSaved={updatePrediction}
                    />
                  )
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
