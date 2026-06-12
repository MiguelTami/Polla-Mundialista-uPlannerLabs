const authErrorMessages: Record<string, string> = {
  'Invalid login credentials': 'El correo o la contraseña no son correctos.',
  'Email not confirmed':
    'Debes confirmar tu correo antes de iniciar sesión.',
  'User already registered': 'Ya existe una cuenta registrada con este correo.',
  'Password should be at least 6 characters':
    'La contraseña debe tener al menos 6 caracteres.',
  'Signup requires a valid password':
    'Ingresa una contraseña válida para crear tu cuenta.',
  'Database error creating new user':
    'No se pudo crear el perfil asociado. Revisa el trigger de registro en Supabase.',
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return (
      authErrorMessages[error.message] ??
      'No pudimos completar la operación. Inténtalo nuevamente.'
    )
  }

  return 'Ocurrió un error inesperado. Inténtalo nuevamente.'
}
