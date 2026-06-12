import { Brand } from '../branding/Brand'
import { useAuth } from '../../features/auth/useAuth'
import { NavigationLinks } from './NavigationLinks'
import { SignOutButton } from './SignOutButton'
import { UserSummary } from './UserSummary'

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
      <Brand />
      <div className="mt-9 flex-1">
        <NavigationLinks />
      </div>
      {user ? (
        <div className="space-y-4 border-t border-slate-200 pt-5">
          <UserSummary user={user} />
          <SignOutButton />
        </div>
      ) : null}
    </aside>
  )
}
