import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/ui/EmptyState'
import { hasMatchStarted } from './match-formatters'
import { MatchCard } from './MatchCard'
import { MatchCardSkeleton } from './MatchCardSkeleton'
import { useMatches } from './useMatches'

export function UpcomingMatches() {
  const { matches, isLoading, errorMessage } = useMatches()
  const upcomingMatches = matches
    .filter((match) => !hasMatchStarted(match.matchDate))
    .slice(0, 2)

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

  if (upcomingMatches.length === 0) {
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
    <div className="grid gap-4 xl:grid-cols-2">
      {upcomingMatches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}
