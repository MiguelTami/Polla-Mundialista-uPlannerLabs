import {
  formatMatchDate,
  formatMatchStatus,
  formatPhase,
  getStatusStyles,
  isFinishedStatus,
} from './match-formatters'
import type { Match } from './matches.types'
import { TeamDisplay } from './TeamDisplay'

type MatchCardProps = {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const hasResult =
    isFinishedStatus(match.status) &&
    match.homeScore !== null &&
    match.awayScore !== null

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {formatPhase(match.phase)}
            {match.groupName ? ` · Grupo ${match.groupName}` : ''}
          </p>
          <p className="mt-1 text-xs capitalize text-slate-500">
            {formatMatchDate(match.matchDate)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(match.status)}`}
        >
          {formatMatchStatus(match.status)}
        </span>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-5">
        <TeamDisplay team={match.homeTeam} align="right" />
        <div className="min-w-16 text-center">
          {hasResult ? (
            <span className="text-2xl font-black tracking-tight text-slate-950">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-black uppercase tracking-wider text-slate-400">
              VS
            </span>
          )}
        </div>
        <TeamDisplay team={match.awayTeam} />
      </div>

      {!hasResult && !isFinishedStatus(match.status) ? (
        <p className="border-t border-slate-100 pt-4 text-center text-xs font-semibold text-brand-700">
          Disponible para predecir en la siguiente fase
        </p>
      ) : null}
    </article>
  )
}
