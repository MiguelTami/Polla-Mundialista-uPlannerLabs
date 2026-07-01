import { useMemo, useState } from 'react'
import { saveKnockoutPrediction } from './bracket.service'
import type {
  BracketMatch,
  KnockoutPrediction,
} from './bracket.types'
import { BracketTeam } from './BracketTeam'

type KnockoutMatchCardProps = {
  match: BracketMatch
  onSaved: (prediction: KnockoutPrediction) => void
}

function alignPredictionToEntrants(match: BracketMatch) {
  const prediction = match.prediction
  const homeTeamId = match.home.team?.id
  const awayTeamId = match.away.team?.id
  if (!prediction || !homeTeamId || !awayTeamId) return prediction

  const sameOrder =
    String(prediction.homeTeamId) === String(homeTeamId) &&
    String(prediction.awayTeamId) === String(awayTeamId)
  if (sameOrder) return prediction

  const reverseOrder =
    String(prediction.homeTeamId) === String(awayTeamId) &&
    String(prediction.awayTeamId) === String(homeTeamId)
  if (!reverseOrder) return prediction

  return {
    ...prediction,
    homeTeamId: Number(homeTeamId),
    awayTeamId: Number(awayTeamId),
    homeScore: prediction.awayScore,
    awayScore: prediction.homeScore,
  }
}

export function KnockoutMatchCard({ match, onSaved }: KnockoutMatchCardProps) {
  const displayedPrediction = useMemo(
    () => alignPredictionToEntrants(match),
    [match],
  )
  const [homeScore, setHomeScore] = useState(
    displayedPrediction?.homeScore.toString() ?? '',
  )
  const [awayScore, setAwayScore] = useState(
    displayedPrediction?.awayScore.toString() ?? '',
  )
  const [tieWinnerId, setTieWinnerId] = useState(
    displayedPrediction?.winnerId.toString() ?? '',
  )
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const canPredict =
    !match.isLocked &&
    !match.isFinished &&
    match.home.isExact &&
    match.away.isExact &&
    match.home.team !== null &&
    match.away.team !== null
  const numericHomeScore = Number(homeScore)
  const numericAwayScore = Number(awayScore)
  const isTie =
    homeScore !== '' &&
    awayScore !== '' &&
    numericHomeScore === numericAwayScore
  const winnerId =
    !canPredict || homeScore === '' || awayScore === ''
      ? null
      : numericHomeScore > numericAwayScore
        ? Number(match.home.team?.id)
        : numericAwayScore > numericHomeScore
          ? Number(match.away.team?.id)
          : tieWinnerId
            ? Number(tieWinnerId)
            : null
  const displayedHomeScore = canPredict
    ? homeScore
    : displayedPrediction?.homeScore.toString() ?? ''
  const displayedAwayScore = canPredict
    ? awayScore
    : displayedPrediction?.awayScore.toString() ?? ''

  async function handleSave() {
    if (
      !match.home.team ||
      !match.away.team ||
      winnerId === null ||
      !Number.isInteger(numericHomeScore) ||
      !Number.isInteger(numericAwayScore) ||
      numericHomeScore < 0 ||
      numericAwayScore < 0
    ) {
      setMessage('Completa el marcador y elige quién avanza si hay empate.')
      return
    }

    setIsSaving(true)
    setMessage('')
    try {
      const prediction = await saveKnockoutPrediction({
        matchNumber: match.matchNumber,
        homeTeamId: Number(match.home.team.id),
        awayTeamId: Number(match.away.team.id),
        homeScore: numericHomeScore,
        awayScore: numericAwayScore,
        winnerId,
      })
      onSaved(prediction)
      setMessage('Predicción guardada.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar la predicción.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          Partido {match.matchNumber}
        </span>
        {match.isFinished ? (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black text-emerald-800">
            Finalizado
          </span>
        ) : match.isLocked ? (
          <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-black text-slate-700">
            Cerrado
          </span>
        ) : match.prediction ? (
          <span className="rounded-full bg-brand-100 px-2 py-1 text-[10px] font-black text-brand-800">
            Guardado
          </span>
        ) : null}
      </div>

      {match.isFinished ? (
        <div className="mb-3 rounded-xl bg-slate-950 px-3 py-2 text-center text-sm font-black text-white">
          Resultado real: {match.actualHomeScore} - {match.actualAwayScore}
          {match.actualHomePenaltyScore !== null &&
          match.actualAwayPenaltyScore !== null ? (
            <span className="ml-1 text-slate-300">
              ({match.actualHomePenaltyScore} - {match.actualAwayPenaltyScore} pen.)
            </span>
          ) : null}
          {match.prediction ? (
            <span className="ml-2 text-brand-200">
              {match.prediction.pointsAwarded} pts
            </span>
          ) : (
            <span className="ml-2 text-slate-300">Sin predicción · 0 pts</span>
          )}
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_3rem] items-center gap-2">
          <BracketTeam
            entrant={match.home}
            isWinner={
              displayedPrediction?.winnerId === Number(match.home.team?.id)
            }
          />
          <input
            aria-label={`Goles de ${match.home.label}`}
            type="number"
            min="0"
            max="99"
            value={displayedHomeScore}
            disabled={!canPredict}
            onChange={(event) => setHomeScore(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 text-center text-sm font-black disabled:bg-slate-50"
          />
        </div>
        <div className="grid grid-cols-[1fr_3rem] items-center gap-2">
          <BracketTeam
            entrant={match.away}
            isWinner={
              displayedPrediction?.winnerId === Number(match.away.team?.id)
            }
          />
          <input
            aria-label={`Goles de ${match.away.label}`}
            type="number"
            min="0"
            max="99"
            value={displayedAwayScore}
            disabled={!canPredict}
            onChange={(event) => setAwayScore(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 text-center text-sm font-black disabled:bg-slate-50"
          />
        </div>
      </div>

      {canPredict && isTie ? (
        <div className="mt-3">
          <label
            className="text-xs font-bold text-slate-600"
            htmlFor={`winner-${match.matchNumber}`}
          >
            Clasifica por penales
          </label>
          <select
            id={`winner-${match.matchNumber}`}
            value={tieWinnerId}
            onChange={(event) => setTieWinnerId(event.target.value)}
            className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold"
          >
            <option value="">Selecciona un equipo</option>
            <option value={String(match.home.team?.id)}>
              {match.home.team?.name}
            </option>
            <option value={String(match.away.team?.id)}>
              {match.away.team?.name}
            </option>
          </select>
        </div>
      ) : null}

      {canPredict ? (
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || winnerId === null}
          className="mt-3 w-full rounded-lg bg-brand-700 px-3 py-2 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSaving ? 'Guardando...' : 'Guardar y avanzar'}
        </button>
      ) : !match.isFinished ? (
        <p className="mt-3 text-center text-[11px] leading-4 text-slate-500">
          {match.isLocked
            ? 'El partido ya comenzó. No se admiten predicciones nuevas.'
            : 'Se habilitará cuando ambos equipos estén definidos.'}
        </p>
      ) : null}

      {message ? (
        <p className="mt-2 text-center text-[11px] font-semibold text-slate-600">
          {message}
        </p>
      ) : null}
    </article>
  )
}
