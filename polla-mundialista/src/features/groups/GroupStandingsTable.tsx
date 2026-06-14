import type { SimulatedGroup } from '../bracket/bracket.types'

type GroupStandingsTableProps = {
  group: SimulatedGroup
}

function formatGoalDifference(value: number) {
  return value > 0 ? `+${value}` : String(value)
}

function getPositionStyles(position: number) {
  if (position <= 2) return 'bg-brand-50 text-brand-900'
  if (position === 3) return 'bg-amber-50 text-amber-900'
  return 'text-slate-600'
}

export function GroupStandingsTable({ group }: GroupStandingsTableProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="font-black text-slate-950">
            Grupo {group.groupName}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            {group.completedMatches}/6 partidos definidos
          </p>
        </div>
        <span
          className={[
            'rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider',
            group.isComplete
              ? 'bg-brand-100 text-brand-800'
              : 'bg-slate-100 text-slate-600',
          ].join(' ')}
        >
          {group.isComplete ? 'Completo' : 'Provisional'}
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-72 border-collapse text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-3 py-2" scope="col">
                Pos.
              </th>
              <th className="px-2 py-2" scope="col">
                Equipo
              </th>
              <th className="px-2 py-2 text-center" scope="col" title="Partidos jugados">
                PJ
              </th>
              <th className="px-2 py-2 text-center" scope="col" title="Diferencia de gol">
                DG
              </th>
              <th className="px-3 py-2 text-right" scope="col">
                Pts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {group.standings.map((standing, index) => {
              const position = index + 1

              return (
                <tr
                  key={standing.team.id}
                  className={getPositionStyles(position)}
                >
                  <td className="px-3 py-2.5">
                    <span className="grid size-6 place-items-center rounded-full bg-white/80 font-black shadow-sm">
                      {position}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      {standing.team.flagUrl ? (
                        <img
                          src={standing.team.flagUrl}
                          alt=""
                          className="size-6 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : null}
                      <span className="truncate font-bold">
                        {standing.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center font-semibold">
                    {standing.played}
                  </td>
                  <td className="px-2 py-2.5 text-center font-semibold">
                    {formatGoalDifference(standing.goalDifference)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-black">
                    {standing.points}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer className="flex gap-3 border-t border-slate-100 px-4 py-2 text-[10px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-brand-400" />
          Clasifica
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-400" />
          Posible 3.º
        </span>
      </footer>
    </article>
  )
}
