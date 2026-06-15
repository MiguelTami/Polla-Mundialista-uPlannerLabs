export type Team = {
  id: string | number
  name: string
  groupName: string | null
  flagUrl: string | null
  fifaCode: string | null
  fifaRank: number | null
}

export type MatchStatus = 'scheduled' | 'finished' | string

export type Match = {
  id: string | number
  matchNumber: number | null
  phase: string
  groupName: string | null
  matchDate: string
  homeScore: number | null
  awayScore: number | null
  winnerTeamId: string | number | null
  status: MatchStatus
  homeTeam: Team | null
  awayTeam: Team | null
}

export type MatchFilters = {
  phase: string
  group: string
  date: string
  status: '' | 'upcoming' | 'in_progress' | 'finished'
}
