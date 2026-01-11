'use client'

import { ReactNode } from 'react'
import { PageTransition } from '@/components/effects'
import { SupabaseProvider } from '@/components/providers'

interface ClientLayoutProps {
    children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <SupabaseProvider>
            <PageTransition>
                {children}
            </PageTransition>
        </SupabaseProvider>
    )
}
