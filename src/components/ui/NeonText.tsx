'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, ReactNode } from 'react'

interface NeonTextProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
    children: ReactNode
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p'
    color?: 'cyan' | 'violet' | 'gradient'
    animate?: boolean
    className?: string
}

export const NeonText = forwardRef<HTMLSpanElement, NeonTextProps>(
    ({
        children,
        as = 'span',
        color = 'cyan',
        animate = false,
        className,
        ...props
    }, ref) => {
        const colorStyles = {
            cyan: 'text-glow-cyan glow-text-cyan',
            violet: 'text-glow-violet glow-text-violet',
            gradient: animate ? 'gradient-text-animated' : 'gradient-text',
        }

        const Component = motion[as] as typeof motion.span

        return (
            <Component
                ref={ref}
                className={cn(
                    'font-heading font-bold',
                    colorStyles[color],
                    className
                )}
                initial={animate ? { opacity: 0, y: 20 } : undefined}
                animate={animate ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                {...props}
            >
                {children}
            </Component>
        )
    }
)

NeonText.displayName = 'NeonText'

export default NeonText
