import type { BracketEntrant } from './bracket.types'

type BracketTeamProps = {
  entrant: BracketEntrant
  isWinner?: boolean
}

export function BracketTeam({ entrant, isWinner = false }: BracketTeamProps) {
  return (
    <div
      className={[
        'flex min-w-0 items-center gap-2 rounded-lg px-2 py-2',
        isWinner ? 'bg-brand-50 text-brand-900' : 'bg-slate-50 text-slate-700',
      ].join(' ')}
    >
      {entrant.team?.flagUrl ? (
        <img
          src={entrant.team.flagUrl}
          alt=""
          className="size-7 shrink-0 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-slate-300 text-[10px] font-black text-slate-400">
          ?
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-xs font-bold">
        {entrant.team?.name ?? entrant.label}
      </span>
    </div>
  )
}
