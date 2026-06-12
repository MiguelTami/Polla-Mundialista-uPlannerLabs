import type { User } from '@supabase/supabase-js'

type UserSummaryProps = {
  user: User
}

function getDisplayName(user: User) {
  return typeof user.user_metadata.display_name === 'string'
    ? user.user_metadata.display_name
    : user.email ?? 'Participante'
}

export function UserSummary({ user }: UserSummaryProps) {
  const displayName = getDisplayName(user)
  const initial = displayName.trim().charAt(0).toUpperCase() || 'P'

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-black text-brand-800">
        {initial}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">
          {displayName}
        </span>
        <span className="block truncate text-xs text-slate-500">
          {user.email}
        </span>
      </span>
    </div>
  )
}
