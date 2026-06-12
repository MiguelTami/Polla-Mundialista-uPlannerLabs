import { useEffect, useState } from 'react'
import { Brand } from '../branding/Brand'
import { useAuth } from '../../features/auth/useAuth'
import { NavigationLinks } from './NavigationLinks'
import { SignOutButton } from './SignOutButton'
import { UserSummary } from './UserSummary'

export function Navbar() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <Brand />
          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700"
          >
            {isOpen ? (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/45"
          />
          <aside className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setIsOpen(false)}
                className="grid size-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-8 flex-1">
              <NavigationLinks onNavigate={() => setIsOpen(false)} />
            </div>
            {user ? (
              <div className="space-y-4 border-t border-slate-200 pt-5">
                <UserSummary user={user} />
                <SignOutButton />
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}
    </>
  )
}
