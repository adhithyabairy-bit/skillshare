import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isPlaceholder = !supabaseUrl || supabaseUrl.includes('your-project')
const keyIsPlaceholder = !supabaseAnonKey || supabaseAnonKey.includes('your-anon')

if (isPlaceholder || keyIsPlaceholder) {
  console.warn('Supabase credentials are placeholder values. Replace in .env with real credentials.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
export const hasValidCredentials = !isPlaceholder && !keyIsPlaceholder
