import type { MatchStatus } from './matches.types'

const phaseLabels: Record<string, string> = {
  group: 'Fase de grupos',
  group_stage: 'Fase de grupos',
  round_of_32: 'Dieciseisavos de final',
  round_of_16: 'Octavos de final',
  quarter_final: 'Cuartos de final',
  semifinal: 'Semifinal',
  third_place: 'Tercer puesto',
  final: 'Final',
}

const statusLabels: Record<string, string> = {
  scheduled: 'Programado',
  pending: 'Programado',
  live: 'En curso',
  in_progress: 'En curso',
  finished: 'Finalizado',
  completed: 'Finalizado',
}

export function formatPhase(phase: string) {
  return phaseLabels[phase.toLowerCase()] ?? phase.replaceAll('_', ' ')
}

export function formatMatchStatus(status: MatchStatus) {
  return statusLabels[status.toLowerCase()] ?? status.replaceAll('_', ' ')
}

export function getStatusStyles(status: MatchStatus) {
  const normalizedStatus = status.toLowerCase()

  if (['live', 'in_progress'].includes(normalizedStatus)) {
    return 'bg-rose-100 text-rose-700'
  }

  if (['finished', 'completed'].includes(normalizedStatus)) {
    return 'bg-slate-200 text-slate-700'
  }

  return 'bg-amber-100 text-amber-800'
}

export function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getDateGroupLabel(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

export function isFinishedStatus(status: MatchStatus) {
  return ['finished', 'completed'].includes(status.toLowerCase())
}
