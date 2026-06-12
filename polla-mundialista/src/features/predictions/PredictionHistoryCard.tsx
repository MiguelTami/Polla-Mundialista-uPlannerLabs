import { Link } from 'react-router-dom'
import { formatMatchDate, formatPhase } from '../matches/match-formatters'
import type { Match } from '../matches/matches.types'
import { TeamDisplay } from '../matches/TeamDisplay'
import {
  getPredictionStatus,
  predictionStatusContent,
} from './prediction-status'
import type { Prediction } from './predictions.types'

type PredictionHistoryCardProps = {
  prediction: Prediction
  match: Match
}

export function PredictionHistoryCard({
  prediction,
  match,
}: PredictionHistoryCardProps) {
  const status = getPredictionStatus(match)
  const statusContent = predictionStatusContent[status]

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
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
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusContent.styles}`}
        >
          {statusContent.label}
        </span>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-5">
        <TeamDisplay team={match.homeTeam} align="right" />
        <div className="min-w-16 text-center">
          <p className="text-2xl font-black text-brand-800">
            {prediction.homeScore} – {prediction.awayScore}
          </p>
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
            Predicción
          </p>
        </div>
        <TeamDisplay team={match.awayTeam} />
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        {status === 'evaluated' ? (
          <div>
            <p className="text-xs font-semibold text-slate-500">
              Resultado: {match.homeScore} – {match.awayScore}
            </p>
            <p className="mt-1 font-black text-brand-800">
              {prediction.pointsAwarded}{' '}
              {prediction.pointsAwarded === 1 ? 'punto' : 'puntos'}
            </p>
          </div>
        ) : (
          <p className="text-xs leading-5 text-slate-500">
            {status === 'pending'
              ? 'Puedes modificarla antes del inicio.'
              : 'El marcador ya no puede modificarse.'}
          </p>
        )}

        {status === 'pending' ? (
          <Link
            to="/partidos"
            className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Editar
          </Link>
        ) : null}
      </footer>
    </article>
  )
}
