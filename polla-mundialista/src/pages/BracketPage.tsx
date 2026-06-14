import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import {
  buildBracket,
  simulateGroups,
} from '../features/bracket/bracket-engine'
import type { BracketMatch } from '../features/bracket/bracket.types'
import { KnockoutMatchCard } from '../features/bracket/KnockoutMatchCard'
import { useKnockoutPredictions } from '../features/bracket/useKnockoutPredictions'
import { useMatches } from '../features/matches/useMatches'
import { usePredictions } from '../features/predictions/usePredictions'

const rounds: Array<{ key: BracketMatch['round']; label: string }> = [
  { key: 'round_of_32', label: 'Dieciseisavos' },
  { key: 'round_of_16', label: 'Octavos' },
  { key: 'quarter_final', label: 'Cuartos' },
  { key: 'semi_final', label: 'Semifinales' },
  { key: 'final', label: 'Final' },
]

export function BracketPage() {
  const matchesState = useMatches()
  const predictionsState = usePredictions()
  const knockoutState = useKnockoutPredictions()
  const simulatedGroups = useMemo(
    () =>
      simulateGroups(matchesState.matches, predictionsState.predictions),
    [matchesState.matches, predictionsState.predictions],
  )
  const bracket = useMemo(
    () =>
      buildBracket(
        simulatedGroups,
        knockoutState.predictionsByMatchNumber,
      ),
    [simulatedGroups, knockoutState.predictionsByMatchNumber],
  )
  const completedGroups = simulatedGroups.filter(
    (group) => group.isComplete,
  ).length
  const completedGroupMatches = simulatedGroups.reduce(
    (total, group) => total + group.completedMatches,
    0,
  )
  const final = bracket.find((match) => match.round === 'final')
  const championId = final?.prediction?.winnerId
  const finalists = final ? [final.home.team, final.away.team] : []
  const champion = finalists.find(
    (team) => String(team?.id) === String(championId),
  )
  const runnerUp = finalists.find(
    (team) => team && String(team.id) !== String(championId),
  )
  const isLoading =
    matchesState.isLoading ||
    predictionsState.isLoading ||
    knockoutState.isLoading
  const errorMessage =
    matchesState.errorMessage ||
    predictionsState.errorMessage ||
    knockoutState.errorMessage

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Predicción progresiva"
        title="Mi cuadro"
        description="El cuadro toma tus resultados de grupos y se completa a medida que defines cada clasificación."
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Grupos definidos
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {completedGroups}/12
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            Partidos considerados
          </p>
          <p className="mt-2 text-3xl font-black text-slate-950">
            {completedGroupMatches}/72
          </p>
        </div>
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
          <p className="text-xs font-black uppercase tracking-wider text-brand-700">
            Tu podio
          </p>
          <p className="mt-2 font-black text-brand-950">
            {champion ? `Campeón: ${champion.name}` : 'Campeón por definir'}
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-800">
            {runnerUp
              ? `Subcampeón: ${runnerUp.name}`
              : 'Subcampeón por definir'}
          </p>
        </div>
      </section>

      {completedGroupMatches < 72 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold leading-6 text-amber-900">
            Completa los seis partidos de cada grupo para revelar sus equipos.
            Los terceros se asignarán exactamente al definir los 12 grupos.
          </p>
          <Link
            to="/partidos"
            className="shrink-0 rounded-xl bg-amber-900 px-4 py-2.5 text-center text-sm font-black text-white"
          >
            Completar grupos
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-800">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage ? (
        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[1480px] grid-cols-5 items-start gap-5">
            {rounds.map((round) => (
              <section key={round.key}>
                <h2 className="mb-4 text-center text-sm font-black uppercase tracking-wider text-slate-500">
                  {round.label}
                </h2>
                <div className="space-y-4">
                  {bracket
                    .filter((match) => match.round === round.key)
                    .map((match) => (
                      <KnockoutMatchCard
                        key={`${match.matchNumber}-${match.home.team?.id ?? 'x'}-${match.away.team?.id ?? 'x'}-${match.prediction?.updatedAt ?? 'new'}`}
                        match={match}
                        onSaved={knockoutState.updatePrediction}
                      />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
