import type { Team } from '../matches/matches.types'

export type GroupStanding = {
  team: Team
  played: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export type SimulatedGroup = {
  groupName: string
  isComplete: boolean
  completedMatches: number
  standings: GroupStanding[]
}

export type BracketEntrant = {
  team: Team | null
  label: string
  isExact: boolean
}

export type KnockoutPrediction = {
  id: number
  matchNumber: number
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  winnerId: number
  pointsAwarded: number
  updatedAt: string
}

export type SaveKnockoutPredictionInput = {
  matchNumber: number
  homeTeamId: number
  awayTeamId: number
  homeScore: number
  awayScore: number
  winnerId: number
}

export type BracketMatch = {
  matchNumber: number
  round: 'round_of_32' | 'round_of_16' | 'quarter_final' | 'semi_final' | 'final'
  home: BracketEntrant
  away: BracketEntrant
  prediction: KnockoutPrediction | null
  matchDate: string | null
  actualHomeScore: number | null
  actualAwayScore: number | null
  actualWinnerId: number | null
  isFinished: boolean
  isLocked: boolean
}
