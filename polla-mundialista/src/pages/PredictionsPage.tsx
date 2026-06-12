import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useMatches } from '../features/matches/useMatches'
import {
  getPredictionStatus,
  predictionStatusContent,
  type PredictionStatus,
} from '../features/predictions/prediction-status'
import { PredictionHistoryCard } from '../features/predictions/PredictionHistoryCard'
import { PredictionsSummary } from '../features/predictions/PredictionsSummary'
import { usePredictions } from '../features/predictions/usePredictions'

type StatusFilter = 'all' | PredictionStatus

const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'locked', label: 'Bloqueadas' },
  { value: 'evaluated', label: 'Evaluadas' },
]

export function PredictionsPage() {
  const {
    matches,
    isLoading: areMatchesLoading,
    errorMessage: matchesError,
  } = useMatches()
  const {
    predictions,
    isLoading: arePredictionsLoading,
    errorMessage: predictionsError,
  } = usePredictions()
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const matchesById = useMemo(
    () => new Map(matches.map((match) => [String(match.id), match])),
    [matches],
  )
  const predictionItems = useMemo(
    () =>
      predictions.flatMap((prediction) => {
        const match = matchesById.get(String(prediction.matchId))
        return match ? [{ prediction, match }] : []
      }),
    [matchesById, predictions],
  )
  const statusCounts = useMemo(
    () =>
      predictionItems.reduce(
        (counts, item) => {
          counts[getPredictionStatus(item.match)] += 1
          return counts
        },
        { pending: 0, locked: 0, evaluated: 0 } satisfies Record<
          PredictionStatus,
          number
        >,
      ),
    [predictionItems],
  )
  const visibleItems = useMemo(
    () =>
      predictionItems
        .filter(
          (item) =>
            statusFilter === 'all' ||
            getPredictionStatus(item.match) === statusFilter,
        )
        .sort(
          (first, second) =>
            new Date(first.match.matchDate).getTime() -
            new Date(second.match.matchDate).getTime(),
        ),
    [predictionItems, statusFilter],
  )
  const totalPoints = predictions.reduce(
    (total, prediction) => total + prediction.pointsAwarded,
    0,
  )
  const isLoading = areMatchesLoading || arePredictionsLoading
  const errorMessage = matchesError || predictionsError
  const emptyFilterLabel =
    statusFilter === 'all'
      ? 'asociadas a partidos disponibles'
      : predictionStatusContent[statusFilter].label.toLowerCase()

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Tu historial"
        title="Mis predicciones"
        description="Consulta tus marcadores, su estado y los puntos obtenidos."
      />

      {!isLoading && !errorMessage ? (
        <PredictionsSummary
          total={predictions.length}
          points={totalPoints}
          statusCounts={statusCounts}
        />
      ) : null}

      {!isLoading && !errorMessage && predictions.length > 0 ? (
        <div className="flex flex-wrap gap-2" aria-label="Filtrar predicciones">
          {filters.map((filter) => {
            const isActive = statusFilter === filter.value
            const count =
              filter.value === 'all'
                ? predictionItems.length
                : statusCounts[filter.value]

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-bold transition',
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                ].join(' ')}
              >
                {filter.label} · {count}
              </button>
            )
          })}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h2 className="font-bold text-rose-900">
            No pudimos cargar tus predicciones
          </h2>
          <p className="mt-2 text-sm text-rose-700">{errorMessage}</p>
        </div>
      ) : null}

      {!isLoading && !errorMessage && predictions.length === 0 ? (
        <EmptyState
          title="Todavía no has registrado predicciones"
          description="Elige un partido futuro y guarda tu primer marcador."
          action={
            <Link
              to="/partidos"
              className="inline-flex rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white"
            >
              Ver partidos
            </Link>
          }
        />
      ) : null}

      {!isLoading &&
      !errorMessage &&
      predictions.length > 0 &&
      visibleItems.length === 0 ? (
        <EmptyState
          title={`No tienes predicciones ${emptyFilterLabel}`}
          description="Selecciona otro estado para consultar tu historial."
          action={
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
            >
              Ver todas
            </button>
          }
        />
      ) : null}

      {visibleItems.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleItems.map(({ prediction, match }) => (
            <PredictionHistoryCard
              key={prediction.id}
              prediction={prediction}
              match={match}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
