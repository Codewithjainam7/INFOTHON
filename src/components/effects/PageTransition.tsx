'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface PageTransitionProps {
    children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 600)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div className="relative">
            {/* Full-screen Glitch Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Black flash base */}
                        <motion.div
                            className="absolute inset-0 bg-black"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0, 1, 0.8, 0.3, 0],
                            }}
                            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 0.6, 1] }}
                        />

                        {/* Cyan glitch slice 1 */}
                        <motion.div
                            className="absolute inset-0 bg-[#00f0ff]"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{
                                opacity: [0, 0.8, 0, 0.6, 0],
                                x: [-100, 50, -30, 20, 0],
                                scaleX: [1, 1.1, 0.95, 1.05, 1],
                            }}
                            transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.7, 1] }}
                            style={{ clipPath: 'inset(0 0 70% 0)' }}
                        />

                        {/* Violet glitch slice 2 */}
                        <motion.div
                            className="absolute inset-0 bg-[#8b5cf6]"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{
                                opacity: [0, 0.7, 0, 0.5, 0],
                                x: [100, -40, 25, -15, 0],
                                scaleX: [1, 0.95, 1.1, 0.98, 1],
                            }}
                            transition={{ duration: 0.35, times: [0, 0.25, 0.5, 0.75, 1], delay: 0.05 }}
                            style={{ clipPath: 'inset(30% 0 40% 0)' }}
                        />

                        {/* Cyan glitch slice 3 */}
                        <motion.div
                            className="absolute inset-0 bg-[#00f0ff]"
                            initial={{ opacity: 0, x: 0 }}
                            animate={{
                                opacity: [0, 0.9, 0, 0.4, 0],
                                x: [-80, 60, -20, 10, 0],
                            }}
                            transition={{ duration: 0.3, times: [0, 0.2, 0.5, 0.8, 1], delay: 0.1 }}
                            style={{ clipPath: 'inset(60% 0 10% 0)' }}
                        />

                        {/* Scanlines overlay */}
                        <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0.3, 0] }}
                            transition={{ duration: 0.5 }}
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                            }}
                        />

                        {/* Horizontal glitch lines */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute left-0 right-0 h-1 bg-white/80"
                                style={{ top: `${20 + i * 15}%` }}
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scaleX: [0, 1, 0],
                                    x: ['-100%', '0%', '100%'],
                                }}
                                transition={{
                                    duration: 0.25,
                                    delay: i * 0.03,
                                    times: [0, 0.5, 1],
                                }}
                            />
                        ))}

                        {/* White flash */}
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 0.15, delay: 0.1 }}
                        />

                        {/* Noise texture */}
                        <motion.div
                            className="absolute inset-0 opacity-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.3, 0.1, 0] }}
                            transition={{ duration: 0.4 }}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page content with entrance animation */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' }
                }}
            >
                {children}
            </motion.div>
        </div>
    )
}
