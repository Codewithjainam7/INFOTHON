'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface BootSequenceProps {
    onComplete: () => void
    duration?: number
}

// Glitch text component with RGB split effect
const GlitchText = ({ children, className, intensity = 'normal' }: { children: string; className?: string; intensity?: 'normal' | 'high' }) => {
    const glitchDelay = intensity === 'high' ? 1.5 : 2.5;
    return (
        <motion.span className={`relative inline-block ${className}`}>
            <span className="relative z-10">{children}</span>
            <motion.span
                className="absolute inset-0 text-glow-cyan"
                animate={{
                    x: [0, -3, 0, 2, -1, 0],
                    opacity: [0, 0.8, 0, 0.5, 0.3, 0],
                    skewX: [0, 2, 0, -1, 0]
                }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: glitchDelay }}
                style={{ clipPath: 'inset(0 0 60% 0)' }}
            >
                {children}
            </motion.span>
            <motion.span
                className="absolute inset-0 text-glow-violet"
                animate={{
                    x: [0, 3, -2, 0, 1, 0],
                    opacity: [0, 0.7, 0, 0.4, 0.2, 0],
                    skewX: [0, -2, 0, 1, 0]
                }}
                transition={{ duration: 0.12, repeat: Infinity, repeatDelay: glitchDelay + 0.5 }}
                style={{ clipPath: 'inset(40% 0 0 0)' }}
            >
                {children}
            </motion.span>
        </motion.span>
    )
}

// Terminal line component with typing effect
const TerminalLine = ({ text, delay, isCommand = false }: { text: string; delay: number; isCommand?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.2 }}
        className={`font-mono text-xs ${isCommand ? 'text-glow-cyan' : 'text-text-muted'}`}
    >
        {isCommand && <span className="text-glow-violet mr-2">›</span>}
        <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 0.1, repeat: 3, delay: delay + 0.1 }}
        >
            {text}
        </motion.span>
    </motion.div>
)

export function BootSequence({ onComplete, duration = 4000 }: BootSequenceProps) {
    const [phase, setPhase] = useState<'loading' | 'transition'>('loading')
    const [progress, setProgress] = useState(0)
    const [showLogo, setShowLogo] = useState(false)
    const [glitchActive, setGlitchActive] = useState(false)

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

        // Random glitch effect
        const glitchInterval = setInterval(() => {
            setGlitchActive(true)
            setTimeout(() => setGlitchActive(false), 150)
        }, 2000)

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

        // Transition after duration - trigger intense glitch before exit
        const timer = setTimeout(() => {
            // Trigger rapid glitch sequence before transition
            setGlitchActive(true)
            setTimeout(() => {
                setGlitchActive(false)
                setTimeout(() => {
                    setGlitchActive(true)
                    setTimeout(() => {
                        setPhase('transition')
                        setTimeout(onComplete, 800)
                    }, 100)
                }, 50)
            }, 100)
        }, duration)

        return () => {
            clearTimeout(timer)
            clearTimeout(logoTimer)
            clearInterval(progressInterval)
            clearInterval(glitchInterval)
        }
    }, [duration, onComplete])

    return (
        <AnimatePresence>
            {phase === 'loading' && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-bg-primary flex items-center justify-center overflow-hidden"
                    exit={{
                        opacity: 0,
                        scale: 1.05,
                        filter: 'blur(10px) brightness(2)',
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
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
                            animate={{
                                y: [0, 50],
                                x: glitchActive ? [0, -5, 3, 0] : 0,
                            }}
                            transition={{
                                y: { duration: 2, repeat: Infinity, ease: 'linear' },
                                x: { duration: 0.1 }
                            }}
                        />
                    </div>

                    {/* Background Image with glitch */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            x: glitchActive ? [0, -3, 2, 0] : 0,
                        }}
                        transition={{ duration: 0.1 }}
                    >
                        <Image
                            src="/images/booting_img.048Z.png"
                            alt="Boot Background"
                            fill
                            priority
                            className="object-cover opacity-20"
                        />
                    </motion.div>

                    {/* Glitch overlay effect */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-50"
                        animate={{ opacity: glitchActive ? 1 : 0 }}
                        transition={{ duration: 0.05 }}
                    >
                        <div className="absolute inset-0 bg-glow-cyan/5" style={{ clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-5px)' }} />
                        <div className="absolute inset-0 bg-glow-violet/5" style={{ clipPath: 'inset(50% 0 30% 0)', transform: 'translateX(5px)' }} />
                        <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'inset(70% 0 10% 0)', transform: 'translateX(-3px)' }} />
                    </motion.div>

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
                                animate={{
                                    opacity: [0.2, 0.5, 0.2],
                                    x: glitchActive && i % 3 === 0 ? [0, 10, -5, 0] : 0,
                                }}
                                transition={{
                                    opacity: { duration: 1.5, delay: i * 0.05, repeat: Infinity },
                                    x: { duration: 0.1 }
                                }}
                            />
                        ))}
                    </div>

                    {/* Main Content Container */}
                    <motion.div
                        className="relative z-10 w-full max-w-lg px-6"
                        animate={{
                            x: glitchActive ? [0, -4, 3, 0] : 0,
                            skewX: glitchActive ? [0, 1, -1, 0] : 0,
                        }}
                        transition={{ duration: 0.1 }}
                    >
                        {/* Terminal Window */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass rounded-lg p-4 mb-8 border border-glow-cyan/20"
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-red-500"
                                    animate={{ scale: glitchActive ? [1, 1.5, 1] : 1 }}
                                    transition={{ duration: 0.1 }}
                                />
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-yellow-500"
                                    animate={{ scale: glitchActive ? [1, 0.5, 1] : 1 }}
                                    transition={{ duration: 0.1 }}
                                />
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-500"
                                    animate={{ scale: glitchActive ? [1, 1.3, 1] : 1 }}
                                    transition={{ duration: 0.1 }}
                                />
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
                            {/* Animated Logo with Glitch - No Circles */}
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                {/* Glitch logo layer - Cyan */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ filter: 'hue-rotate(180deg)' }}
                                    animate={{
                                        x: glitchActive ? [-6, 4, 0] : [0, -2, 0, 2, 0],
                                        opacity: glitchActive ? [0.8, 0.4, 0.6] : [0, 0.4, 0],
                                    }}
                                    transition={{
                                        x: { duration: glitchActive ? 0.1 : 0.15, repeat: glitchActive ? 0 : Infinity, repeatDelay: 3 },
                                        opacity: { duration: glitchActive ? 0.1 : 0.15, repeat: glitchActive ? 0 : Infinity, repeatDelay: 3 }
                                    }}
                                >
                                    <Image
                                        src="/images/INFOTHON.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>

                                {/* Glitch logo layer - Violet */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ filter: 'hue-rotate(-60deg)' }}
                                    animate={{
                                        x: glitchActive ? [5, -3, 0] : [0, 2, 0, -2, 0],
                                        opacity: glitchActive ? [0.7, 0.3, 0.5] : [0, 0.3, 0],
                                    }}
                                    transition={{
                                        x: { duration: glitchActive ? 0.1 : 0.12, repeat: glitchActive ? 0 : Infinity, repeatDelay: 2.5 },
                                        opacity: { duration: glitchActive ? 0.1 : 0.12, repeat: glitchActive ? 0 : Infinity, repeatDelay: 2.5 }
                                    }}
                                >
                                    <Image
                                        src="/images/INFOTHON.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                    />
                                </motion.div>

                                {/* Main logo with glow and glitch */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden"
                                    animate={{
                                        x: glitchActive ? [0, -3, 3, 0] : 0,
                                        filter: [
                                            'drop-shadow(0 0 15px rgba(34,211,238,0.4))',
                                            'drop-shadow(0 0 25px rgba(139,92,246,0.5))',
                                            'drop-shadow(0 0 15px rgba(34,211,238,0.4))',
                                        ],
                                    }}
                                    transition={{
                                        x: { duration: 0.1 },
                                        filter: { duration: 2, repeat: Infinity }
                                    }}
                                >
                                    <Image
                                        src="/images/INFOTHON.png"
                                        alt="INFOTHON Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>

                                {/* Glitch slice overlays */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden pointer-events-none"
                                    animate={{ opacity: glitchActive ? 1 : 0 }}
                                    transition={{ duration: 0.05 }}
                                >
                                    <div
                                        className="absolute w-full h-1/4 bg-glow-cyan/30"
                                        style={{ top: '20%', transform: 'translateX(-4px)' }}
                                    />
                                    <div
                                        className="absolute w-full h-1/5 bg-glow-violet/30"
                                        style={{ top: '55%', transform: 'translateX(4px)' }}
                                    />
                                </motion.div>

                                {/* Corner accents with glitch */}
                                <motion.div
                                    className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-glow-cyan"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        x: glitchActive ? [0, -4, 2, 0] : 0,
                                    }}
                                    transition={{
                                        opacity: { duration: 1, repeat: Infinity },
                                        x: { duration: 0.1 }
                                    }}
                                />
                                <motion.div
                                    className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-glow-violet"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        x: glitchActive ? [0, 4, -2, 0] : 0,
                                    }}
                                    transition={{
                                        opacity: { duration: 1, repeat: Infinity, delay: 0.25 },
                                        x: { duration: 0.1 }
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-glow-violet"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        x: glitchActive ? [0, -3, 2, 0] : 0,
                                    }}
                                    transition={{
                                        opacity: { duration: 1, repeat: Infinity, delay: 0.5 },
                                        x: { duration: 0.1 }
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-glow-cyan"
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        x: glitchActive ? [0, 3, -2, 0] : 0,
                                    }}
                                    transition={{
                                        opacity: { duration: 1, repeat: Infinity, delay: 0.75 },
                                        x: { duration: 0.1 }
                                    }}
                                />
                            </div>

                            {/* Brand Name with High Intensity Glitch */}
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    x: glitchActive ? [0, -5, 3, 0] : 0,
                                }}
                                transition={{
                                    opacity: { delay: 1.2 },
                                    x: { duration: 0.1 }
                                }}
                                className="text-3xl sm:text-4xl font-heading font-bold mb-2"
                            >
                                <GlitchText className="text-glow-cyan" intensity="high">INFO</GlitchText>
                                <GlitchText className="text-white" intensity="high">THON</GlitchText>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    x: glitchActive ? [0, 3, -2, 0] : 0,
                                }}
                                transition={{
                                    opacity: { delay: 1.4 },
                                    x: { duration: 0.1 }
                                }}
                                className="text-text-muted text-sm mb-6 tracking-widest"
                            >
                                <GlitchText intensity="normal">HACKATHON 2026 • INFOTHON</GlitchText>
                            </motion.p>

                            {/* Progress Bar with Glitch */}
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
                                        animate={{
                                            x: glitchActive ? [0, -3, 2, 0] : 0,
                                        }}
                                        transition={{ duration: 0.1 }}
                                    />
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <motion.p
                                        className="font-mono text-xs text-glow-cyan tracking-wider"
                                        animate={{ opacity: glitchActive ? [1, 0.5, 1] : 1 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        LOADING SYSTEM
                                    </motion.p>
                                    <motion.p
                                        className="font-mono text-xs text-glow-violet"
                                        animate={{
                                            x: glitchActive ? [0, 2, -1, 0] : 0,
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {progress.toFixed(0)}%
                                    </motion.p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Scanning Line Effect with Glitch */}
                    <motion.div
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-glow-cyan/60 to-transparent"
                        animate={{
                            top: ['0%', '100%'],
                            opacity: glitchActive ? [0.6, 1, 0.6] : 0.6,
                        }}
                        transition={{
                            top: { duration: 2, repeat: Infinity, ease: 'linear' },
                            opacity: { duration: 0.1 }
                        }}
                    />

                    {/* Vertical Scan Lines */}
                    <motion.div
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-glow-violet/40 to-transparent"
                        animate={{
                            left: ['0%', '100%'],
                            opacity: glitchActive ? [0.4, 0.8, 0.4] : 0.4,
                        }}
                        transition={{
                            left: { duration: 3, repeat: Infinity, ease: 'linear' },
                            opacity: { duration: 0.1 }
                        }}
                    />

                    {/* Corner Decorations */}
                    <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-glow-cyan/40 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-glow-violet/40 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-glow-violet/40 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-glow-cyan/40 rounded-br-lg" />

                    {/* HUD Elements with Glitch */}
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2"
                        animate={{ x: glitchActive ? [0, -10, 5, 0] : '-50%' }}
                        transition={{ duration: 0.1 }}
                    >
                        <motion.div
                            className="font-mono text-xs text-glow-cyan/60 tracking-widest"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ◆ SYSTEM v2.026 ◆
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-4 left-1/2 -translate-x-1/2"
                        animate={{ x: glitchActive ? [0, 8, -4, 0] : '-50%' }}
                        transition={{ duration: 0.1 }}
                    >
                        <motion.div
                            className="font-mono text-xs text-text-muted tracking-wider"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            FEBRUARY 12-13, 2026 • MUMBAI
                        </motion.div>
                    </motion.div>

                    {/* Random glitch noise lines */}
                    {glitchActive && (
                        <>
                            <motion.div
                                className="absolute left-0 right-0 h-0.5 bg-white/20"
                                style={{ top: '30%' }}
                                initial={{ scaleX: 0, x: '-100%' }}
                                animate={{ scaleX: 1, x: '100%' }}
                                transition={{ duration: 0.1 }}
                            />
                            <motion.div
                                className="absolute left-0 right-0 h-0.5 bg-glow-cyan/30"
                                style={{ top: '65%' }}
                                initial={{ scaleX: 0, x: '100%' }}
                                animate={{ scaleX: 1, x: '-100%' }}
                                transition={{ duration: 0.08 }}
                            />
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BootSequence
