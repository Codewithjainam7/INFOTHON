'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function GlowCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    // Smooth spring for main cursor
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // Slower spring for trailing elements
    const trailConfig = { damping: 20, stiffness: 180 }
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

            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.6 : isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.15 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <div
                        className="w-3 h-3 rounded-full bg-white"
                        style={{
                            boxShadow: '0 0 6px #22d3ee, 0 0 12px #22d3ee',
                        }}
                    />
                </div>
            </motion.div>

            {/* Hover Ring with Pointer Effect */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
                style={{
                    x: trailXSpring,
                    y: trailYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
                <motion.div
                    className="relative -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: isHovering ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Main ring - only visible on hover */}
                    <motion.div
                        className="w-12 h-12 rounded-full border-2 border-glow-violet"
                        animate={{
                            opacity: isHovering ? 1 : 0,
                            scale: isHovering ? 1 : 0.5,
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                            boxShadow: isHovering ? '0 0 15px rgba(139,92,246,0.5), inset 0 0 15px rgba(139,92,246,0.1)' : 'none',
                        }}
                    />

                    {/* Corner brackets on hover */}
                    <motion.div
                        animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-glow-cyan" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-glow-cyan" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-glow-cyan" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-glow-cyan" />
                    </motion.div>

                    {/* Center crosshair on hover */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: isHovering ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="w-4 h-px bg-glow-violet" />
                        <div className="absolute w-px h-4 bg-glow-violet" />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Subtle glow trail */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9996] hidden lg:block"
                style={{
                    x: trailXSpring,
                    y: trailYSpring,
                }}
                animate={{
                    opacity: isVisible ? (isHovering ? 0.5 : 0.2) : 0,
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <div
                        className={`w-10 h-10 rounded-full blur-lg transition-colors duration-300 ${isHovering ? 'bg-glow-violet/50' : 'bg-glow-cyan/30'
                            }`}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default GlowCursor
