import { createBrowserClient } from '@supabase/ssr'

// Fallback values for build time - will be replaced by actual env vars at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
