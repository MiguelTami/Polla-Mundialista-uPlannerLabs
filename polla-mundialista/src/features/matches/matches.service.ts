import { supabase } from '../../lib/supabase'
import type { Match, Team } from './matches.types'

type TeamRow = {
  id: string | number
  name: string
  group_name: string | null
  flag_url: string | null
  fifa_code: string | null
  fifa_rank: number | null
}

type MatchRow = {
  id: string | number
  match_number: number | null
  phase: string
  group_name: string | null
  home_team_id: string | number | null
  away_team_id: string | number | null
  match_date: string
  home_score: number | null
  away_score: number | null
  winner_team_id: string | number | null
  status: string
}

function mapTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
    groupName: row.group_name,
    flagUrl: row.flag_url,
    fifaCode: row.fifa_code,
    fifaRank: row.fifa_rank,
  }
}

export async function getMatches(): Promise<Match[]> {
  const [teamsResult, matchesResult] = await Promise.all([
    supabase
      .from('teams')
      .select('id, name, group_name, flag_url, fifa_code, fifa_rank')
      .order('name'),
    supabase
      .from('matches')
      .select(
        'id, match_number, phase, group_name, home_team_id, away_team_id, match_date, home_score, away_score, winner_team_id, status',
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
    matchNumber: match.match_number,
    phase: match.phase,
    groupName: match.group_name,
    matchDate: match.match_date,
    homeScore: match.home_score,
    awayScore: match.away_score,
    winnerTeamId: match.winner_team_id,
    status: match.status,
    homeTeam: match.home_team_id
      ? teamsById.get(String(match.home_team_id)) ?? null
      : null,
    awayTeam: match.away_team_id
      ? teamsById.get(String(match.away_team_id)) ?? null
      : null,
  }))
}
