'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, ReactNode } from 'react'

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode
    variant?: 'default' | 'light' | 'dark'
    glowColor?: 'cyan' | 'violet' | 'none'
    hover3D?: boolean
    className?: string
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({
        children,
        variant = 'default',
        glowColor = 'cyan',
        hover3D = true,
        className,
        ...props
    }, ref) => {
        const variantStyles = {
            default: 'glass',
            light: 'glass-light',
            dark: 'glass-dark',
        }

        const glowStyles = {
            cyan: 'hover:shadow-glow-md hover:border-glow-cyan/40',
            violet: 'hover:shadow-glow-violet hover:border-glow-violet/40',
            none: '',
        }

        return (
            <motion.div
                ref={ref}
                className={cn(
                    'rounded-2xl p-6 transition-all duration-300',
                    variantStyles[variant],
                    glowStyles[glowColor],
                    className
                )}
                whileHover={hover3D ? {
                    scale: 1.02,
                    rotateX: 2,
                    rotateY: 2,
                    transition: { duration: 0.3, ease: 'easeOut' }
                } : undefined}
                style={{ transformStyle: 'preserve-3d' }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

GlassCard.displayName = 'GlassCard'

export default GlassCard
