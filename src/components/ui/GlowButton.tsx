'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, ReactNode } from 'react'

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    glowColor?: 'cyan' | 'violet'
    className?: string
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        glowColor = 'cyan',
        className,
        ...props
    }, ref) => {
        const baseStyles = 'relative inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider transition-all duration-300 overflow-hidden group'

        const sizeStyles = {
            sm: 'px-4 py-2 text-xs rounded-lg',
            md: 'px-6 py-3 text-sm rounded-xl',
            lg: 'px-8 py-4 text-base rounded-2xl',
        }

        const variantStyles = {
            primary: glowColor === 'cyan'
                ? 'bg-glow-cyan/10 border border-glow-cyan/50 text-glow-cyan hover:bg-glow-cyan/20 hover:shadow-glow-md'
                : 'bg-glow-violet/10 border border-glow-violet/50 text-glow-violet hover:bg-glow-violet/20 hover:shadow-glow-violet',
            secondary: 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40',
            ghost: 'bg-transparent border border-transparent text-text-secondary hover:text-white hover:bg-white/5',
        }

        return (
            <motion.button
                ref={ref}
                className={cn(
                    baseStyles,
                    sizeStyles[size],
                    variantStyles[variant],
                    className
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                    {children}
                </span>
            </motion.button>
        )
    }
)

GlowButton.displayName = 'GlowButton'

export default GlowButton
