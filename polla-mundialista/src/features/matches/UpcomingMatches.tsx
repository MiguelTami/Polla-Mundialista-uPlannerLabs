import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import {
  getDateFilterLabel,
  getMatchDateKey,
  hasMatchStarted,
} from './match-formatters'
import { MatchCard } from './MatchCard'
import { MatchCardSkeleton } from './MatchCardSkeleton'
import { useMatches } from './useMatches'

export function UpcomingMatches() {
  const { matches, isLoading, errorMessage } = useMatches()
  const matchesByDate = useMemo(() => {
    const groupedMatches = new Map<string, typeof matches>()

    for (const match of matches) {
      const dateKey = getMatchDateKey(match.matchDate)
      groupedMatches.set(dateKey, [
        ...(groupedMatches.get(dateKey) ?? []),
        match,
      ])
    }

    return groupedMatches
  }, [matches])
  const availableDates = useMemo(
    () =>
      [...matchesByDate.entries()]
        .filter(([, dateMatches]) =>
          dateMatches.some((match) => !hasMatchStarted(match.matchDate)),
        )
        .map(([dateKey, dateMatches]) => ({
          dateKey,
          representativeDate: dateMatches[0].matchDate,
          matchCount: dateMatches.length,
        }))
        .sort(
          (first, second) =>
            new Date(first.representativeDate).getTime() -
            new Date(second.representativeDate).getTime(),
        ),
    [matchesByDate],
  )
  const [selectedDateKey, setSelectedDateKey] = useState('')
  const activeDateKey = availableDates.some(
    (date) => date.dateKey === selectedDateKey,
  )
    ? selectedDateKey
    : availableDates[0]?.dateKey ?? ''
  const selectedMatches = activeDateKey
    ? matchesByDate.get(activeDateKey) ?? []
    : []

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        <MatchCardSkeleton />
        <MatchCardSkeleton />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
        No pudimos consultar los próximos partidos.
      </p>
    )
  }

  if (availableDates.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay próximos partidos"
        description="Los encuentros aparecerán aquí cuando estén disponibles en el calendario."
        action={
          <Link
            to="/partidos"
            className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Ir a partidos
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-3"
        aria-label="Filtrar próximos partidos por día"
      >
        {availableDates.map((date) => {
          const isActive = date.dateKey === activeDateKey

          return (
            <button
              key={date.dateKey}
              type="button"
              onClick={() => setSelectedDateKey(date.dateKey)}
              className={[
                'shrink-0 rounded-xl border px-4 py-2.5 text-left transition',
                isActive
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50',
              ].join(' ')}
            >
              <span className="block text-sm font-black capitalize">
                {getDateFilterLabel(date.representativeDate)}
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

      <div className="mt-2 grid gap-4 xl:grid-cols-2">
        {selectedMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  )
}
