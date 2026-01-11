'use client'

import { useState, useCallback, useEffect } from 'react'
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

// Session storage key for boot sequence
const BOOT_KEY = 'infothon_boot_complete'

export default function Home() {
    const [isBooting, setIsBooting] = useState(true)
    const [isReady, setIsReady] = useState(false)

    // Check if boot sequence has already run this session
    useEffect(() => {
        const hasBooted = sessionStorage.getItem(BOOT_KEY)
        if (hasBooted) {
            setIsBooting(false)
        }
        setIsReady(true)
    }, [])

    const handleBootComplete = useCallback(() => {
        sessionStorage.setItem(BOOT_KEY, 'true')
        setIsBooting(false)
    }, [])

    // Don't render until we check sessionStorage (prevents flash)
    if (!isReady) {
        return (
            <div className="fixed inset-0 bg-bg-primary z-[100]" />
        )
    }

    return (
        <>
            {/* Boot Sequence - only runs on first visit per session */}
            {isBooting && <BootSequence onComplete={handleBootComplete} />}

            {/* Main Application - Landing Page */}
            {!isBooting && (
                <SmoothScroll>
                    <GlowCursor />
                    <Background3D backgroundImage="/images/bg_img.540Z.png" />
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
