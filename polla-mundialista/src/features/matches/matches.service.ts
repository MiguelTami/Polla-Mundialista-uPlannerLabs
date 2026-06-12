import { supabase } from '../../lib/supabase'
import type { Match, Team } from './matches.types'

type TeamRow = {
  id: string | number
  name: string
  group_name: string | null
  flag_url: string | null
}

type MatchRow = {
  id: string | number
  phase: string
  group_name: string | null
  home_team_id: string | number | null
  away_team_id: string | number | null
  match_date: string
  home_score: number | null
  away_score: number | null
  status: string
}

function mapTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    groupName: row.group_name,
    flagUrl: row.flag_url,
  }
}

export async function getMatches(): Promise<Match[]> {
  const [teamsResult, matchesResult] = await Promise.all([
    supabase
      .from('teams')
      .select('id, name, group_name, flag_url')
      .order('name'),
    supabase
      .from('matches')
      .select(
        'id, phase, group_name, home_team_id, away_team_id, match_date, home_score, away_score, status',
      )
      .order('match_date'),
  ])

  if (teamsResult.error) {
    throw new Error(teamsResult.error.message)
  }

  if (matchesResult.error) {
    throw new Error(matchesResult.error.message)
  }

  const teams = (teamsResult.data as TeamRow[]).map(mapTeam)
  const teamsById = new Map(teams.map((team) => [String(team.id), team]))

  return (matchesResult.data as MatchRow[]).map((match) => ({
    id: match.id,
    phase: match.phase,
    groupName: match.group_name,
    matchDate: match.match_date,
    homeScore: match.home_score,
    awayScore: match.away_score,
    status: match.status,
    homeTeam: match.home_team_id
      ? teamsById.get(String(match.home_team_id)) ?? null
      : null,
    awayTeam: match.away_team_id
      ? teamsById.get(String(match.away_team_id)) ?? null
      : null,
  }))
}
