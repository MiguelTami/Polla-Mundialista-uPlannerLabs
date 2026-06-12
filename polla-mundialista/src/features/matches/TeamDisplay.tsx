import type { Team } from './matches.types'

type TeamDisplayProps = {
  team: Team | null
  align?: 'left' | 'right'
}

export function TeamDisplay({ team, align = 'left' }: TeamDisplayProps) {
  const isRightAligned = align === 'right'

  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        isRightAligned ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {team?.flagUrl ? (
        <img
          src={team.flagUrl}
          alt=""
          className="size-9 shrink-0 rounded-full border border-slate-200 object-cover"
        />
      ) : (
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-500">
          {team?.name.slice(0, 2).toUpperCase() ?? '—'}
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate font-bold text-slate-900">
          {team?.name ?? 'Por definir'}
        </span>
        {team?.groupName ? (
          <span className="block text-xs text-slate-500">
            Grupo {team.groupName}
          </span>
        ) : null}
      </span>
    </div>
  )
}
