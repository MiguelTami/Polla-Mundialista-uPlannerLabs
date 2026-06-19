import type { Match, MatchStatus } from './matches.types'

const colombiaTimeZone = 'America/Bogota'

const phaseLabels: Record<string, string> = {
  group: 'Fase de grupos',
  group_stage: 'Fase de grupos',
  round_of_32: 'Dieciseisavos de final',
  round_of_16: 'Octavos de final',
  quarter_final: 'Cuartos de final',
  semi_final: 'Semifinal',
  third_place: 'Tercer puesto',
  final: 'Final',
}

const phaseOrder: Record<string, number> = {
  group: 0,
  group_stage: 0,
  round_of_32: 1,
  round_of_16: 2,
  quarter_final: 3,
  semi_final: 4,
  third_place: 5,
  final: 6,
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

export function comparePhases(firstPhase: string, secondPhase: string) {
  const firstOrder = phaseOrder[firstPhase.toLowerCase()] ?? Number.MAX_VALUE
  const secondOrder = phaseOrder[secondPhase.toLowerCase()] ?? Number.MAX_VALUE

  return firstOrder - secondOrder || firstPhase.localeCompare(secondPhase)
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
    timeZone: colombiaTimeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getDateGroupLabel(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: colombiaTimeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

export function getDateFilterLabel(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: colombiaTimeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export function isFinishedStatus(status: MatchStatus) {
  return ['finished', 'completed'].includes(status.toLowerCase())
}

export function hasMatchStarted(matchDate: string) {
  return new Date(matchDate).getTime() <= Date.now()
}

export function getMatchFilterStatus(
  match: Match,
): 'upcoming' | 'in_progress' | 'finished' {
  if (
    isFinishedStatus(match.status) &&
    match.homeScore !== null &&
    match.awayScore !== null
  ) {
    return 'finished'
  }

  return hasMatchStarted(match.matchDate) ? 'in_progress' : 'upcoming'
}

export function getMatchDateKey(date: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: colombiaTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date))
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  )

  return `${values.year}-${values.month}-${values.day}`
}
