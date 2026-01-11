'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
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
    const [showGlitchEntrance, setShowGlitchEntrance] = useState(false)

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
        setShowGlitchEntrance(true)
        // Brief glitch effect before showing content
        setTimeout(() => {
            setIsBooting(false)
        }, 100)
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
            <AnimatePresence mode="wait">
                {isBooting && <BootSequence onComplete={handleBootComplete} />}
            </AnimatePresence>

            {/* Main Application - Landing Page */}
            <AnimatePresence>
                {!isBooting && (
                    <motion.div
                        key="main-content"
                        initial={showGlitchEntrance ? {
                            opacity: 0,
                            filter: 'blur(10px) brightness(2)',
                            x: -10,
                        } : false}
                        animate={{
                            opacity: 1,
                            filter: 'blur(0px) brightness(1)',
                            x: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        {/* Glitch overlay effect on entrance */}
                        {showGlitchEntrance && (
                            <motion.div
                                className="fixed inset-0 z-[90] pointer-events-none"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-glow-cyan/20"
                                    animate={{
                                        x: [-5, 5, -3, 3, 0],
                                        opacity: [0.5, 0.3, 0.4, 0.2, 0],
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                                <motion.div
                                    className="absolute inset-0 bg-glow-violet/20"
                                    style={{ mixBlendMode: 'screen' }}
                                    animate={{
                                        x: [5, -5, 3, -3, 0],
                                        opacity: [0.4, 0.2, 0.3, 0.1, 0],
                                    }}
                                    transition={{ duration: 0.4 }}
                                />
                                {/* Glitch lines */}
                                <motion.div
                                    className="absolute left-0 right-0 h-1 bg-glow-cyan/60"
                                    style={{ top: '30%' }}
                                    animate={{
                                        scaleX: [1, 0.5, 1, 0.3, 0],
                                        x: [-20, 20, -10, 10, 0],
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                                <motion.div
                                    className="absolute left-0 right-0 h-1 bg-glow-violet/60"
                                    style={{ top: '70%' }}
                                    animate={{
                                        scaleX: [1, 0.6, 1, 0.4, 0],
                                        x: [20, -20, 10, -10, 0],
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>
                        )}

                        <SmoothScroll>
                            <GlowCursor />
                            <Background3D backgroundImage="/images/bg_img.540Z.png" />
                            <FloatingNavbar />

                            <main className="relative z-10">
                                <Hero />
                            </main>

                            <Footer />
                        </SmoothScroll>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
