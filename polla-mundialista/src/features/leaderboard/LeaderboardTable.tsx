import type { LeaderboardEntry } from './leaderboard.types'

type LeaderboardTableProps = {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">Posición</th>
              <th className="px-5 py-4">Participante</th>
              <th className="px-5 py-4 text-center">Predicciones</th>
              <th className="px-5 py-4 text-center">Exactos</th>
              <th className="px-5 py-4 text-right">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId

              return (
                <tr
                  key={entry.userId}
                  className={isCurrentUser ? 'bg-brand-50' : 'bg-white'}
                >
                  <td className="px-5 py-4">
                    <span
                      className={[
                        'grid size-9 place-items-center rounded-full text-sm font-black',
                        entry.position === 1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700',
                      ].join(' ')}
                    >
                      {entry.position}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">
                      {entry.displayName}
                      {isCurrentUser ? (
                        <span className="ml-2 text-xs font-bold text-brand-700">
                          Tú
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {entry.correctOutcomes} aciertos de resultado
                    </p>
                  </td>
                  <td className="px-5 py-4 text-center font-semibold text-slate-700">
                    {entry.predictionsCount}
                  </td>
                  <td className="px-5 py-4 text-center font-semibold text-slate-700">
                    {entry.exactScores}
                  </td>
                  <td className="px-5 py-4 text-right text-xl font-black text-brand-800">
                    {entry.totalPoints}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
