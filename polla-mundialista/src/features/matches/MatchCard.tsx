import type { ReactNode } from 'react'
import {
  formatMatchDate,
  formatMatchStatus,
  formatPhase,
  getStatusStyles,
  hasMatchStarted,
  isFinishedStatus,
} from './match-formatters'
import type { Match } from './matches.types'
import { TeamDisplay } from './TeamDisplay'

type MatchCardProps = {
  match: Match
  predictionContent?: ReactNode
}

export function MatchCard({ match, predictionContent }: MatchCardProps) {
  const hasResult =
    isFinishedStatus(match.status) &&
    match.homeScore !== null &&
    match.awayScore !== null
  const hasStarted = hasMatchStarted(match.matchDate)
  const displayedStatus =
    hasStarted && !hasResult ? 'in_progress' : match.status

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {match.matchNumber ? `Partido ${match.matchNumber} · ` : ''}
            {formatPhase(match.phase)}
            {match.groupName ? ` · Grupo ${match.groupName}` : ''}
          </p>
          <p className="mt-1 text-xs capitalize text-slate-500">
            {formatMatchDate(match.matchDate)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(displayedStatus)}`}
        >
          {formatMatchStatus(displayedStatus)}
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

      {predictionContent ?? (!hasResult ? (
        <p
          className={`border-t border-slate-100 pt-4 text-center text-xs font-semibold ${
            hasStarted ? 'text-slate-500' : 'text-brand-700'
          }`}
        >
          {hasStarted
            ? 'Predicciones cerradas: el partido ya comenzó'
            : 'Disponible para predecir en la siguiente fase'}
        </p>
      ) : null)}
    </article>
  )
}
