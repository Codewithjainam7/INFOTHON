'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BootSequenceProps {
    onComplete: () => void
    duration?: number
}

// Glitch text component
const GlitchText = ({ children, className }: { children: string; className?: string }) => (
    <motion.span className={`relative inline-block ${className}`}>
        <span className="relative z-10">{children}</span>
        <motion.span
            className="absolute inset-0 text-glow-cyan opacity-70"
            animate={{ x: [0, -2, 2, 0], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
            style={{ clipPath: 'inset(0 0 50% 0)' }}
        >
            {children}
        </motion.span>
        <motion.span
            className="absolute inset-0 text-glow-violet opacity-70"
            animate={{ x: [0, 2, -2, 0], opacity: [0.7, 0.3, 0.7] }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2.5 }}
            style={{ clipPath: 'inset(50% 0 0 0)' }}
        >
            {children}
        </motion.span>
    </motion.span>
)

// Terminal line component
const TerminalLine = ({ text, delay, isCommand = false }: { text: string; delay: number; isCommand?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.2 }}
        className={`font-mono text-xs ${isCommand ? 'text-glow-cyan' : 'text-text-muted'}`}
    >
        {isCommand && <span className="text-glow-violet mr-2">›</span>}
        {text}
    </motion.div>
)

export function BootSequence({ onComplete, duration = 4000 }: BootSequenceProps) {
    const [phase, setPhase] = useState<'loading' | 'transition'>('loading')
    const [progress, setProgress] = useState(0)
    const [showLogo, setShowLogo] = useState(false)

    const terminalLines = [
        { text: 'SYSTEM BOOT SEQUENCE INITIATED', delay: 0.2, isCommand: true },
        { text: 'Loading kernel modules...', delay: 0.4 },
        { text: 'Initializing neural interface...', delay: 0.6 },
        { text: 'Connecting to INFOTHON network...', delay: 0.8 },
        { text: 'STATUS: ONLINE', delay: 1.0, isCommand: true },
        { text: 'Welcome to HACKATHON 2026', delay: 1.3, isCommand: true },
    ]

    useEffect(() => {
        // Show logo after initial lines
        const logoTimer = setTimeout(() => setShowLogo(true), 800)

        // Progress animation
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 1.5
            })
        }, duration / 70)

        // Transition after duration
        const timer = setTimeout(() => {
            setPhase('transition')
            setTimeout(onComplete, 600)
        }, duration)

        return () => {
            clearTimeout(timer)
            clearTimeout(logoTimer)
            clearInterval(progressInterval)
        }
    }, [duration, onComplete])

    return (
        <AnimatePresence>
            {phase === 'loading' && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-bg-primary flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Animated Background Grid */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px),
                                                  linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)`,
                                backgroundSize: '50px 50px',
                            }}
                            animate={{ y: [0, 50] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>

                    {/* Background Image */}
                    <Image
                        src="/images/booting_img.048Z.png"
                        alt="Boot Background"
                        fill
                        priority
                        className="object-cover opacity-20"
                    />

                    {/* Radial Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-glow-cyan/10 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/80 via-transparent to-bg-primary" />

                    {/* Horizontal Scan Lines */}
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute left-0 right-0 h-px bg-glow-cyan/20"
                                style={{ top: `${i * 5}%` }}
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity }}
                            />
                        ))}
                    </div>

                    {/* Main Content Container */}
                    <div className="relative z-10 w-full max-w-lg px-6">
                        {/* Terminal Window */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass rounded-lg p-4 mb-8 border border-glow-cyan/20"
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="ml-2 text-xs text-text-muted font-mono">system_init.exe</span>
                            </div>

                            {/* Terminal Lines */}
                            <div className="space-y-1">
                                {terminalLines.map((line, i) => (
                                    <TerminalLine key={i} {...line} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Logo Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: showLogo ? 1 : 0, scale: showLogo ? 1 : 0.8 }}
                            transition={{ duration: 0.6, type: 'spring' }}
                            className="text-center"
                        >
                            {/* Animated Logo */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                {/* Outer rotating ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-transparent"
                                    style={{
                                        borderImage: 'linear-gradient(45deg, #22d3ee, #8b5cf6, #22d3ee) 1',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                />

                                {/* Inner pulsing ring */}
                                <motion.div
                                    className="absolute inset-2 rounded-full border border-glow-cyan/50"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />

                                {/* Logo container with glow */}
                                <motion.div
                                    className="absolute inset-4 rounded-full overflow-hidden"
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(34,211,238,0.3)',
                                            '0 0 40px rgba(139,92,246,0.4)',
                                            '0 0 20px rgba(34,211,238,0.3)',
                                        ],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Image
                                        src="/images/INFOTHON.png"
                                        alt="INFOTHON Logo"
                                        fill
                                        className="object-contain p-2"
                                        priority
                                    />
                                </motion.div>

                                {/* Corner accents */}
                                <motion.div
                                    className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-glow-cyan"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-glow-violet"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
                                />
                                <motion.div
                                    className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-glow-violet"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                />
                                <motion.div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-glow-cyan"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
                                />
                            </div>

                            {/* Brand Name with Glitch */}
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-3xl sm:text-4xl font-heading font-bold mb-2"
                            >
                                <GlitchText className="text-glow-cyan">INFO</GlitchText>
                                <GlitchText className="text-white">THON</GlitchText>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                                className="text-text-muted text-sm mb-6 tracking-widest"
                            >
                                HACKATHON 2026 • TECHFEST
                            </motion.p>

                            {/* Progress Bar */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="w-full max-w-xs mx-auto"
                            >
                                <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-glow-cyan via-glow-violet to-glow-cyan rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="font-mono text-xs text-glow-cyan tracking-wider">
                                        LOADING SYSTEM
                                    </p>
                                    <p className="font-mono text-xs text-glow-violet">
                                        {progress.toFixed(0)}%
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Scanning Line Effect */}
                    <motion.div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-glow-cyan/60 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Vertical Scan Lines */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-glow-violet/40 to-transparent"
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Corner Decorations */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-glow-cyan/40 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-glow-violet/40 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-glow-violet/40 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-glow-cyan/40 rounded-br-lg" />

                    {/* HUD Elements */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                        <motion.div
                            className="font-mono text-xs text-glow-cyan/60 tracking-widest"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ◆ SYSTEM v2.026 ◆
                        </motion.div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <motion.div
                            className="font-mono text-xs text-text-muted tracking-wider"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            FEBRUARY 12-13, 2026 • MUMBAI
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BootSequence
