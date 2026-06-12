const getRequiredEnv = (key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY') => {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`La variable de entorno ${key} no está configurada.`)
  }

  return value
}

export const env = {
  supabaseUrl: getRequiredEnv('VITE_SUPABASE_URL'),
  supabasePublishableKey: getRequiredEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
} as const
