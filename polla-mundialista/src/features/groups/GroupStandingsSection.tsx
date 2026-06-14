import type { SimulatedGroup } from '../bracket/bracket.types'
import { GroupStandingsTable } from './GroupStandingsTable'

type GroupStandingsSectionProps = {
  groups: SimulatedGroup[]
}

export function GroupStandingsSection({
  groups,
}: GroupStandingsSectionProps) {
  if (groups.length === 0) return null

  return (
    <section aria-labelledby="group-standings-title">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-700">
            Tu torneo simulado
          </p>
          <h2
            id="group-standings-title"
            className="mt-1 text-2xl font-black tracking-tight text-slate-950"
          >
            Así van los grupos
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Combina los resultados oficiales ya disputados con tus predicciones
          para los partidos restantes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {groups.map((group) => (
          <GroupStandingsTable key={group.groupName} group={group} />
        ))}
      </div>
    </section>
  )
}
