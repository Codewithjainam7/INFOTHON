'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function GlowCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 200 }
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

        // Check for interactive elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive = !!(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('data-cursor-hover') !== null
            )

            setIsHovering(isInteractive)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleElementHover)
        document.addEventListener('mouseenter', handleMouseEnter)
        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleElementHover)
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
            {/* Main cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {/* Core */}
                    <div className={`
            w-3 h-3 rounded-full bg-white
            transition-transform duration-200
            ${isHovering ? 'scale-0' : 'scale-100'}
          `} />

                    {/* Ring */}
                    <div className={`
            absolute inset-0 w-10 h-10 -translate-x-[14px] -translate-y-[14px]
            rounded-full border-2 border-white/50
            transition-all duration-300
            ${isHovering ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
          `} />
                </div>
            </motion.div>

            {/* Glow trail */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 0.3 : 0,
                }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-24 rounded-full bg-glow-cyan/20 blur-xl" />
                </div>
            </motion.div>
        </>
    )
}

export default GlowCursor
