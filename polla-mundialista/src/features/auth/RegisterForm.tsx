import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuthErrorMessage } from './auth-errors'
import { AuthField } from './AuthField'
import { signUp } from './auth.service'

export function RegisterForm() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (password !== passwordConfirmation) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)

    try {
      const data = await signUp({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      })

      if (data.session) {
        navigate('/', { replace: true })
        return
      }

      setSuccessMessage(
        'Cuenta creada. Revisa tu correo y confirma el registro para iniciar sesión.',
      )
      setPassword('')
      setPasswordConfirmation('')
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <AuthField
        id="register-name"
        label="Nombre visible"
        type="text"
        autoComplete="name"
        placeholder="Miguel Tami"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        minLength={2}
        maxLength={80}
        required
      />
      <AuthField
        id="register-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="nombre@empresa.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <AuthField
        id="register-password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={8}
        hint="Usa al menos 8 caracteres."
        required
      />
      <AuthField
        id="register-password-confirmation"
        label="Confirma tu contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        minLength={8}
        required
      />

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {successMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-brand-700 px-5 py-3 font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
