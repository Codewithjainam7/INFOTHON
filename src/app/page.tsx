'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { BootSequence } from '@/components/boot'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { Hero, Footer } from '@/components/sections'

// Lazy load background
const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

export default function Home() {
    const [isBooting, setIsBooting] = useState(true)

    const handleBootComplete = useCallback(() => {
        setIsBooting(false)
    }, [])

    return (
        <>
            {/* Boot Sequence */}
            {isBooting && <BootSequence onComplete={handleBootComplete} />}

            {/* Main Application - Landing Page */}
            {!isBooting && (
                <SmoothScroll>
                    <GlowCursor />
                    <Background3D backgroundImage="/images/2026.png" />
                    <FloatingNavbar />

                    <main className="relative z-10">
                        <Hero />
                    </main>

                    <Footer />
                </SmoothScroll>
            )}
        </>
    )
}
