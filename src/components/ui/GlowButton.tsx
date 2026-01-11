'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { forwardRef, ReactNode, useState } from 'react'

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
        onClick,
        ...props
    }, ref) => {
        const [isGlitching, setIsGlitching] = useState(false)

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            setIsGlitching(true)
            setTimeout(() => setIsGlitching(false), 300)
            onClick?.(e)
        }

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
                onClick={handleClick}
                {...props}
            >
                {/* Glitch effect on click */}
                {isGlitching && (
                    <>
                        {/* Cyan glitch layer */}
                        <motion.span
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ color: '#00f0ff', filter: 'brightness(1.5)' }}
                            initial={{ x: 0, opacity: 0 }}
                            animate={{
                                x: [-4, 3, -2, 0],
                                opacity: [0.8, 0.5, 0.3, 0],
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="flex items-center gap-2">{children}</span>
                        </motion.span>
                        {/* Violet glitch layer */}
                        <motion.span
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ color: '#8b5cf6', filter: 'brightness(1.5)' }}
                            initial={{ x: 0, opacity: 0 }}
                            animate={{
                                x: [4, -3, 2, 0],
                                opacity: [0.7, 0.4, 0.2, 0],
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="flex items-center gap-2">{children}</span>
                        </motion.span>
                        {/* Flash overlay */}
                        <motion.span
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        />
                        {/* Glitch lines */}
                        <motion.span
                            className="absolute left-0 right-0 h-[2px] bg-glow-cyan/80"
                            style={{ top: '30%' }}
                            initial={{ scaleX: 1, x: -20 }}
                            animate={{ scaleX: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="absolute left-0 right-0 h-[2px] bg-glow-violet/80"
                            style={{ top: '70%' }}
                            initial={{ scaleX: 1, x: 20 }}
                            animate={{ scaleX: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        />
                    </>
                )}

                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Content */}
                <motion.span
                    className="relative z-10 flex items-center gap-2"
                    animate={isGlitching ? {
                        x: [0, -2, 2, -1, 0],
                    } : {}}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.span>
            </motion.button>
        )
    }
)

GlowButton.displayName = 'GlowButton'

export default GlowButton

