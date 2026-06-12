export type Prediction = {
  id: number
  matchId: number
  homeScore: number
  awayScore: number
  predictedWinnerId: number | null
  pointsAwarded: number
  updatedAt: string | null
}

export type SavePredictionInput = {
  matchId: number
  homeScore: number
  awayScore: number
}
