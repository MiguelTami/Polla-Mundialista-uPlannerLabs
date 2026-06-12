import { supabase } from '../../lib/supabase'
import type { LeaderboardEntry } from './leaderboard.types'

type LeaderboardRow = {
  user_id: string
  display_name: string
  total_points: number
  predictions_count: number
  exact_scores: number
  correct_outcomes: number
  position: number
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select(
      'user_id, display_name, total_points, predictions_count, exact_scores, correct_outcomes, position',
    )
    .order('position')
    .order('display_name')

  if (error) {
    throw new Error(error.message)
  }

  return (data as LeaderboardRow[]).map((row) => ({
    userId: row.user_id,
    displayName: row.display_name,
    totalPoints: Number(row.total_points),
    predictionsCount: Number(row.predictions_count),
    exactScores: Number(row.exact_scores),
    correctOutcomes: Number(row.correct_outcomes),
    position: Number(row.position),
  }))
}
