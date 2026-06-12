import {
  hasMatchStarted,
  isFinishedStatus,
} from '../matches/match-formatters'
import type { Match } from '../matches/matches.types'

export type PredictionStatus = 'pending' | 'locked' | 'evaluated'

export function getPredictionStatus(match: Match): PredictionStatus {
  if (
    isFinishedStatus(match.status) &&
    match.homeScore !== null &&
    match.awayScore !== null
  ) {
    return 'evaluated'
  }

  return hasMatchStarted(match.matchDate) ? 'locked' : 'pending'
}

export const predictionStatusContent: Record<
  PredictionStatus,
  { label: string; styles: string }
> = {
  pending: {
    label: 'Pendiente',
    styles: 'bg-amber-100 text-amber-800',
  },
  locked: {
    label: 'Bloqueada',
    styles: 'bg-slate-200 text-slate-700',
  },
  evaluated: {
    label: 'Evaluada',
    styles: 'bg-emerald-100 text-emerald-800',
  },
}
