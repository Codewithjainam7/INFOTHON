'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BootSequenceProps {
    onComplete: () => void
    duration?: number
}

export function BootSequence({ onComplete, duration = 3500 }: BootSequenceProps) {
    const [phase, setPhase] = useState<'loading' | 'transition'>('loading')
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 2
            })
        }, duration / 50)

        // Transition after duration
        const timer = setTimeout(() => {
            setPhase('transition')
            setTimeout(onComplete, 600)
        }, duration)

        return () => {
            clearTimeout(timer)
            clearInterval(progressInterval)
        }
    }, [duration, onComplete])

    return (
        <AnimatePresence>
            {phase === 'loading' && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-bg-primary flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Background Image */}
                    <Image
                        src="/images/booting_img.048Z.png"
                        alt="Boot Background"
                        fill
                        priority
                        className="object-cover opacity-30"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-radial from-glow-cyan/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-transparent to-bg-primary" />

                    {/* Center Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center px-6"
                    >
                        {/* Logo */}
                        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto mb-6 relative">
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glow-cyan/30 to-glow-violet/30"
                                animate={{
                                    boxShadow: ['0 0 30px rgba(0,245,255,0.3)', '0 0 60px rgba(0,245,255,0.5)', '0 0 30px rgba(0,245,255,0.3)'],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="absolute inset-2 flex items-center justify-center">
                                <Image
                                    src="/images/INFOTHON.png"
                                    alt="INFOTHON Logo"
                                    width={120}
                                    height={120}
                                    className="object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Brand Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-4xl font-heading font-bold mb-2"
                        >
                            <span className="text-glow-cyan">INFO</span>
                            <span className="text-white">THON</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-text-muted text-sm mb-8"
                        >
                            2026 • TECHFEST
                        </motion.p>

                        {/* Progress Bar */}
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: '100%' }}
                            transition={{ delay: 0.6 }}
                            className="w-48 sm:w-64 mx-auto"
                        >
                            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-glow-cyan to-glow-violet rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="font-mono text-xs text-glow-cyan mt-3 tracking-widest">
                                INITIALIZING... {progress}%
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Scanning Line Effect */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/50 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Corner Decorations */}
                    <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-glow-cyan/30 rounded-tl-lg" />
                    <div className="absolute top-6 right-6 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-t-2 border-glow-cyan/30 rounded-tr-lg" />
                    <div className="absolute bottom-6 left-6 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-b-2 border-glow-cyan/30 rounded-bl-lg" />
                    <div className="absolute bottom-6 right-6 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-glow-cyan/30 rounded-br-lg" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BootSequence
