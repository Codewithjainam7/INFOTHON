'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode, useRef } from 'react'

interface MagneticElementProps {
    children: ReactNode
    className?: string
    strength?: number
}

export function MagneticElement({
    children,
    className,
    strength = 0.3
}: MagneticElementProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const springX = useSpring(x, springConfig)
    const springY = useSpring(y, springConfig)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const distanceX = e.clientX - centerX
        const distanceY = e.clientY - centerY

        x.set(distanceX * strength)
        y.set(distanceY * strength)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            className={cn('inline-block', className)}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    )
}

export default MagneticElement
