'use client'

import { ReactNode } from 'react'
import { PageTransition } from '@/components/effects'

interface ClientLayoutProps {
    children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <PageTransition>
            {children}
        </PageTransition>
    )
}
