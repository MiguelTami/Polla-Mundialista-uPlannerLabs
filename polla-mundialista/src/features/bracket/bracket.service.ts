import { supabase } from '../../lib/supabase'
import type {
  KnockoutPrediction,
  SaveKnockoutPredictionInput,
} from './bracket.types'

type KnockoutPredictionRow = {
  id: number
  match_number: number
  home_team_id: number
  away_team_id: number
  predicted_home_score: number
  predicted_away_score: number
  predicted_winner_id: number
  points_awarded: number
  updated_at: string
}

function mapPrediction(row: KnockoutPredictionRow): KnockoutPrediction {
  return {
    id: row.id,
    matchNumber: row.match_number,
    homeTeamId: row.home_team_id,
    awayTeamId: row.away_team_id,
    homeScore: row.predicted_home_score,
    awayScore: row.predicted_away_score,
    winnerId: row.predicted_winner_id,
    pointsAwarded: row.points_awarded,
    updatedAt: row.updated_at,
  }
}

export async function getMyKnockoutPredictions() {
  const { data, error } = await supabase
    .from('user_knockout_predictions')
    .select(
      'id, match_number, home_team_id, away_team_id, predicted_home_score, predicted_away_score, predicted_winner_id, points_awarded, updated_at',
    )
    .order('match_number')

  if (error) throw new Error(error.message)
  return (data as KnockoutPredictionRow[]).map(mapPrediction)
}

export async function saveKnockoutPrediction(
  input: SaveKnockoutPredictionInput,
) {
  const { data, error } = await supabase.rpc('save_knockout_prediction', {
    p_match_number: input.matchNumber,
    p_home_team_id: input.homeTeamId,
    p_away_team_id: input.awayTeamId,
    p_home_score: input.homeScore,
    p_away_score: input.awayScore,
    p_winner_id: input.winnerId,
  })

  if (error) throw error
  return mapPrediction(data as KnockoutPredictionRow)
}
