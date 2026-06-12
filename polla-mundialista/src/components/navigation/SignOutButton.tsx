import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from '../../features/auth/auth-errors'
import { signOut } from '../../features/auth/auth.service'

type SignOutButtonProps = {
  className?: string
}

export function SignOutButton({ className = '' }: SignOutButtonProps) {
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSignOut() {
    setIsSigningOut(true)
    setErrorMessage('')

    try {
      await signOut()
      navigate('/login', { replace: true })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
      setIsSigningOut(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={`flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {isSigningOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
      {errorMessage ? (
        <p role="alert" className="mt-2 text-xs leading-5 text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
