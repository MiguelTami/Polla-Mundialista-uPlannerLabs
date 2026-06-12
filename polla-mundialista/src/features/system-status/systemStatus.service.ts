import { supabase } from '../../lib/supabase'

export async function checkSupabaseConnection() {
  const { error } = await supabase
    .from('teams')
    .select('id', { count: 'exact', head: true })

  if (error) {
    throw new Error(error.message)
  }
}
