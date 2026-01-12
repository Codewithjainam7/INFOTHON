'use client'

import { createContext, useContext, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

const SupabaseContext = createContext<SupabaseClient | null>(null)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const supabase = useMemo(() => createClient(), [])

    return (
        <SupabaseContext.Provider value={supabase}>
            {children}
        </SupabaseContext.Provider>
    )
}

export function useSupabase() {
    const context = useContext(SupabaseContext)
    if (!context) {
        throw new Error('useSupabase must be used within SupabaseProvider')
    }
    return context
}
