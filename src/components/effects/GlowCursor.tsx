'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function GlowCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    // Snappy spring for main cursor
    const springConfig = { damping: 30, stiffness: 400 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // Slower spring for trailing ring
    const trailConfig = { damping: 20, stiffness: 150 }
    const trailXSpring = useSpring(cursorX, trailConfig)
    const trailYSpring = useSpring(cursorY, trailConfig)

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

            {/* Trailing Ring - follows with delay */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
                style={{
                    x: trailXSpring,
                    y: trailYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        rotate: isHovering ? 180 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <div
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${isHovering
                                ? 'border-glow-violet shadow-[0_0_20px_rgba(139,92,246,0.6)]'
                                : 'border-glow-cyan/70 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                            }`}
                        style={{
                            background: isHovering
                                ? 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)'
                                : 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
                        }}
                    />
                    {/* Decorative corners on hover */}
                    {isHovering && (
                        <>
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-glow-violet" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-glow-violet" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-glow-violet" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-glow-violet" />
                        </>
                    )}
                </motion.div>
            </motion.div>

            {/* Main Cursor Dot - moves instantly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.5 : isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.15 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {/* Glowing center dot */}
                    <div
                        className="w-4 h-4 rounded-full bg-white"
                        style={{
                            boxShadow: '0 0 10px #fff, 0 0 20px #22d3ee, 0 0 30px #22d3ee, 0 0 40px #22d3ee',
                        }}
                    />
                </div>
            </motion.div>

            {/* Click ripple effect */}
            {isClicking && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9997] hidden lg:block"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0.8, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <div className="w-10 h-10 rounded-full border-2 border-glow-cyan" />
                    </div>
                </motion.div>
            )}

            {/* Ambient glow */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9996] hidden lg:block"
                style={{
                    x: trailXSpring,
                    y: trailYSpring,
                }}
                animate={{
                    opacity: isVisible ? (isHovering ? 0.6 : 0.3) : 0,
                }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <div
                        className={`w-32 h-32 rounded-full blur-2xl transition-colors duration-300 ${isHovering ? 'bg-glow-violet/20' : 'bg-glow-cyan/15'
                            }`}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default GlowCursor
