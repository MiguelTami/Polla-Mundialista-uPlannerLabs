import { useState, type FormEvent } from 'react'
import type { Match } from '../matches/matches.types'
import { getPredictionErrorMessage } from './prediction-errors'
import { savePrediction } from './predictions.service'
import type { Prediction } from './predictions.types'

type PredictionFormProps = {
  match: Match
  prediction?: Prediction
  onSaved: (prediction: Prediction) => void
}

export function PredictionForm({
  match,
  prediction,
  onSaved,
}: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState(
    prediction ? String(prediction.homeScore) : '',
  )
  const [awayScore, setAwayScore] = useState(
    prediction ? String(prediction.awayScore) : '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const parsedHomeScore = Number(homeScore)
    const parsedAwayScore = Number(awayScore)

    if (
      !Number.isInteger(parsedHomeScore) ||
      !Number.isInteger(parsedAwayScore) ||
      parsedHomeScore < 0 ||
      parsedAwayScore < 0 ||
      parsedHomeScore > 99 ||
      parsedAwayScore > 99
    ) {
      setErrorMessage('Ingresa marcadores enteros entre 0 y 99.')
      return
    }

    setIsSubmitting(true)

    try {
      const savedPrediction = await savePrediction({
        matchId: Number(match.id),
        homeScore: parsedHomeScore,
        awayScore: parsedAwayScore,
      })

      onSaved(savedPrediction)
      setSuccessMessage(
        prediction ? 'Predicción actualizada.' : 'Predicción guardada.',
      )
    } catch (error) {
      setErrorMessage(getPredictionErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-100 pt-4"
    >
      <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-500">
        Tu predicción
      </p>
      <div className="mx-auto mt-3 grid max-w-xs grid-cols-[1fr_auto_1fr] items-end gap-3">
        <label className="text-center">
          <span className="block truncate text-xs font-semibold text-slate-600">
            {match.homeTeam?.name ?? 'Local'}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            required
            aria-label={`Goles de ${match.homeTeam?.name ?? 'equipo local'}`}
            value={homeScore}
            onChange={(event) => setHomeScore(event.target.value)}
            className="mx-auto mt-2 block size-14 rounded-xl border border-slate-300 text-center text-xl font-black text-slate-950 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
          />
        </label>
        <span className="pb-4 text-sm font-black text-slate-400">–</span>
        <label className="text-center">
          <span className="block truncate text-xs font-semibold text-slate-600">
            {match.awayTeam?.name ?? 'Visitante'}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="99"
            required
            aria-label={`Goles de ${match.awayTeam?.name ?? 'equipo visitante'}`}
            value={awayScore}
            onChange={(event) => setAwayScore(event.target.value)}
            className="mx-auto mt-2 block size-14 rounded-xl border border-slate-300 text-center text-xl font-black text-slate-950 outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
          />
        </label>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-center text-xs text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p
          role="status"
          className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-700"
        >
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? 'Guardando...'
          : prediction
            ? 'Actualizar predicción'
            : 'Guardar predicción'}
      </button>
    </form>
  )
}
