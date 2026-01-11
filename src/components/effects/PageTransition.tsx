'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface PageTransitionProps {
    children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative"
            >
                {/* Glitch overlay on page transition */}
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 1 }}
                >
                    {/* Cyan glitch layer */}
                    <motion.div
                        className="absolute inset-0 bg-[#00f0ff]/20"
                        exit={{
                            x: [-20, 20, -10, 0],
                            opacity: [0, 1, 0.5, 0],
                        }}
                        transition={{ duration: 0.3, times: [0, 0.3, 0.6, 1] }}
                    />
                    {/* Violet glitch layer */}
                    <motion.div
                        className="absolute inset-0 bg-[#8b5cf6]/20"
                        exit={{
                            x: [20, -20, 10, 0],
                            opacity: [0, 1, 0.5, 0],
                        }}
                        transition={{ duration: 0.25, times: [0, 0.3, 0.6, 1], delay: 0.05 }}
                    />
                    {/* Scanlines */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                        }}
                        exit={{ opacity: [0, 0.8, 0] }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>

                {/* Page content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: 'easeOut' }
                    }}
                    exit={{
                        opacity: 0,
                        x: [0, -5, 5, -3, 0],
                        transition: { duration: 0.3 }
                    }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
