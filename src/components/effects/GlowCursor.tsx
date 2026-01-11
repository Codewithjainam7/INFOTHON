'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function GlowCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    const springConfig = { damping: 20, stiffness: 300 }
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

        // Check for interactive elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive = !!(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('data-cursor-hover') !== null ||
                target.closest('[data-cursor-hover]')
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
            {/* Hide default cursor globally */}
            <style jsx global>{`
                * {
                    cursor: none !important;
                }
            `}</style>

            {/* Main Cyberpunk Cursor */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isClicking ? 0.85 : isHovering ? 1.3 : 1,
                }}
                transition={{ duration: 0.15 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    {/* Outer rotating frame */}
                    <motion.div
                        className="absolute inset-0 w-8 h-8 -translate-x-[4px] -translate-y-[4px]"
                        animate={{ rotate: isHovering ? 45 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Corner brackets - cyberpunk targeting reticle */}
                        <div className={`absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 transition-colors duration-200 ${isHovering ? 'border-glow-violet' : 'border-glow-cyan'}`} />
                        <div className={`absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 transition-colors duration-200 ${isHovering ? 'border-glow-violet' : 'border-glow-cyan'}`} />
                        <div className={`absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 transition-colors duration-200 ${isHovering ? 'border-glow-violet' : 'border-glow-cyan'}`} />
                        <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 transition-colors duration-200 ${isHovering ? 'border-glow-violet' : 'border-glow-cyan'}`} />
                    </motion.div>

                    {/* Center dot / crosshair */}
                    <motion.div
                        className={`w-5 h-5 relative ${isHovering ? 'opacity-100' : 'opacity-90'}`}
                        animate={{ scale: isClicking ? 0.7 : 1 }}
                        transition={{ duration: 0.1 }}
                    >
                        {/* Horizontal line */}
                        <div className={`absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 transition-colors duration-200 ${isHovering ? 'bg-glow-violet' : 'bg-glow-cyan'}`} />
                        {/* Vertical line */}
                        <div className={`absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 transition-colors duration-200 ${isHovering ? 'bg-glow-violet' : 'bg-glow-cyan'}`} />
                        {/* Center diamond */}
                        <motion.div
                            className={`absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rotate-45 transition-colors duration-200 ${isHovering ? 'bg-glow-violet border-glow-violet' : 'bg-glow-cyan border-glow-cyan'} border`}
                            animate={{ scale: isHovering ? [1, 1.3, 1] : 1 }}
                            transition={{ duration: 0.5, repeat: isHovering ? Infinity : 0, repeatType: 'loop' }}
                        />
                    </motion.div>

                    {/* Scanning line effect on hover */}
                    {isHovering && (
                        <motion.div
                            className="absolute -inset-2 overflow-hidden rounded-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-glow-violet to-transparent"
                                initial={{ top: '-10%' }}
                                animate={{ top: '110%' }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Glow trail - enhanced cyberpunk glow */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isVisible ? (isHovering ? 0.5 : 0.25) : 0,
                }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className={`w-16 h-16 blur-xl transition-colors duration-300 ${isHovering ? 'bg-glow-violet/30' : 'bg-glow-cyan/20'}`}
                        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                        animate={{ rotate: [0, 90, 180, 270, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </motion.div>

            {/* Additional outer ring on hover */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9997] hidden lg:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    opacity: isHovering ? 0.6 : 0,
                    scale: isHovering ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
            >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="w-12 h-12 border border-glow-violet/50 rounded-sm"
                        style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            </motion.div>
        </>
    )
}

export default GlowCursor
