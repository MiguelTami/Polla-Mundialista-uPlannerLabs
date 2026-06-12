import { supabase } from '../../lib/supabase'
import type {
  Prediction,
  SavePredictionInput,
} from './predictions.types'

type PredictionRow = {
  id: number
  match_id: number
  predicted_home_score: number
  predicted_away_score: number
  predicted_winner_id: number | null
  points_awarded: number
  updated_at: string | null
}

function mapPrediction(row: PredictionRow): Prediction {
  return {
    id: row.id,
    matchId: row.match_id,
    homeScore: row.predicted_home_score,
    awayScore: row.predicted_away_score,
    predictedWinnerId: row.predicted_winner_id,
    pointsAwarded: row.points_awarded,
    updatedAt: row.updated_at,
  }
}

export async function getMyPredictions() {
  const { data, error } = await supabase
    .from('predictions')
    .select(
      'id, match_id, predicted_home_score, predicted_away_score, predicted_winner_id, points_awarded, updated_at',
    )
    .order('match_id')

  if (error) {
    throw new Error(error.message)
  }

  return (data as PredictionRow[]).map(mapPrediction)
}

export async function savePrediction({
  matchId,
  homeScore,
  awayScore,
}: SavePredictionInput) {
  const { data, error } = await supabase.rpc('save_match_prediction', {
    p_match_id: matchId,
    p_home_score: homeScore,
    p_away_score: awayScore,
  })

  if (error) {
    throw error
  }

  return mapPrediction(data as PredictionRow)
}
