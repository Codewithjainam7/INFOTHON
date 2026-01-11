'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function GlowCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    // Smooth spring for cursor
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive = !!(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('data-cursor-hover') !== null ||
                target.closest('[data-cursor-hover]') ||
                window.getComputedStyle(target).cursor === 'pointer'
            )
            setIsHovering(isInteractive)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleElementHover)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseenter', handleMouseEnter)
        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleElementHover)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseenter', handleMouseEnter)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [cursorX, cursorY, isVisible])

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
        return null
    }

    return (
        <>
            {/* Hide default cursor */}
            <style jsx global>{`
                @media (min-width: 1024px) {
                    * {
                        cursor: none !important;
                    }
                }
            `}</style>

            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        scale: isClicking ? 0.6 : isHovering ? 1.8 : 1,
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                    {/* Glowing center dot */}
                    <motion.div
                        className="w-3 h-3 rounded-full"
                        animate={{
                            backgroundColor: isHovering ? '#8b5cf6' : '#22d3ee',
                            boxShadow: isHovering
                                ? '0 0 8px #8b5cf6, 0 0 20px #8b5cf6, 0 0 30px #8b5cf6'
                                : '0 0 6px #22d3ee, 0 0 15px #22d3ee',
                        }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>
            </motion.div>

            {/* Hover Ring - Only shows on hover */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0.5,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="w-10 h-10 rounded-full border border-glow-violet/60"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        style={{
                            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                        }}
                    />
                </div>
            </motion.div>

            {/* Subtle glow trail */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9996] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? (isHovering ? 0.4 : 0.2) : 0,
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className={`w-8 h-8 rounded-full blur-md transition-colors duration-300 ${isHovering ? 'bg-glow-violet/40' : 'bg-glow-cyan/30'
                            }`}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default GlowCursor
