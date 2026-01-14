'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function GlitchOverlay() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 1200) // Match duration + buffer
        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <motion.div
            className="fixed inset-0 z-[95] pointer-events-none overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
        >
            {/* Screen flash */}
            <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: [1, 0, 0.3, 0, 0.1, 0] }}
                transition={{ duration: 0.5, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }}
            />

            {/* RGB Split - Cyan layer */}
            <motion.div
                className="absolute inset-0 bg-glow-cyan/40"
                style={{ mixBlendMode: 'screen' }}
                animate={{
                    x: [-15, 10, -8, 5, -3, 0],
                    opacity: [0.8, 0.5, 0.6, 0.3, 0.2, 0],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* RGB Split - Violet layer */}
            <motion.div
                className="absolute inset-0 bg-glow-violet/40"
                style={{ mixBlendMode: 'screen' }}
                animate={{
                    x: [15, -10, 8, -5, 3, 0],
                    opacity: [0.7, 0.4, 0.5, 0.2, 0.1, 0],
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Horizontal scan distortion lines */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute left-0 right-0 bg-white/60"
                    style={{
                        top: `${(i * 8) + 4}%`,
                        height: `${Math.random() * 4 + 2}px`,
                    }}
                    animate={{
                        scaleX: [0, 1, 0.3, 0.8, 0],
                        x: [i % 2 === 0 ? -50 : 50, 0, i % 2 === 0 ? 30 : -30, 0, 0],
                        opacity: [0, 1, 0.5, 0.3, 0],
                    }}
                    transition={{
                        duration: 0.4,
                        delay: i * 0.02,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Vertical glitch slices */}
            <motion.div
                className="absolute top-0 bottom-0 w-1/3 left-0 bg-glow-cyan/30"
                animate={{
                    x: [-100, 0, 50, -20, 0],
                    opacity: [1, 0.6, 0.3, 0.1, 0],
                }}
                transition={{ duration: 0.5 }}
            />
            <motion.div
                className="absolute top-0 bottom-0 w-1/3 right-0 bg-glow-violet/30"
                animate={{
                    x: [100, 0, -50, 20, 0],
                    opacity: [1, 0.6, 0.3, 0.1, 0],
                }}
                transition={{ duration: 0.5 }}
            />

            {/* Scanline overlay */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                }}
                animate={{ opacity: [0.8, 0.4, 0.6, 0.2, 0] }}
                transition={{ duration: 0.8 }}
            />

            {/* Noise flicker */}
            <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{ opacity: [0, 0.3, 0, 0.2, 0, 0.1, 0] }}
                transition={{ duration: 0.3, repeat: 2 }}
            />

            {/* Center burst */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 50%)',
                }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />

            {/* Glitch text flash */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl sm:text-8xl font-heading font-black text-white/80"
                style={{ textShadow: '4px 0 #00f0ff, -4px 0 #8b5cf6' }}
                animate={{
                    opacity: [1, 0, 0.5, 0],
                    x: [-5, 5, -3, 0],
                    scale: [1.2, 1, 1.1, 1],
                }}
                transition={{ duration: 0.4 }}
            >
                SYSTEM ACCESS
            </motion.div>
        </motion.div>
    )
}
