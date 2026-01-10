'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { NeonText } from '@/components/ui'

const themePoints = [
    {
        title: 'TRANSCENDENCE',
        subtitle: 'Beyond the Horizon',
        description: 'Breaking barriers between human imagination and technological reality.',
    },
    {
        title: 'CONVERGENCE',
        subtitle: 'Where Worlds Collide',
        description: 'AI, quantum computing, and biotechnology merging into a unified future.',
    },
    {
        title: 'EVOLUTION',
        subtitle: 'The Next Leap',
        description: 'Not just adapting to change, but becoming the architects of transformation.',
    },
]

export function Theme() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.9])

    return (
        <section
            id="theme"
            ref={containerRef}
            className="relative min-h-screen py-32 overflow-hidden"
        >
            {/* Cosmic Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-radial from-glow-violet/10 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-glow-violet/10 animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-glow-cyan/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-glow-violet/20" />
            </div>

            <motion.div
                style={{ opacity, scale }}
                className="relative z-10 section-container"
            >
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-violet tracking-wider mb-4">
                        THEME 2026
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-7xl mb-6">
                        QUANTUM LEAP
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        This year, we explore the boundaries between what is and what could be.
                    </p>
                </motion.div>

                {/* Theme Points */}
                <div className="max-w-4xl mx-auto space-y-24">
                    {themePoints.map((point, index) => (
                        <motion.div
                            key={point.title}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                        >
                            {/* Visual Element */}
                            <div className="flex-shrink-0 relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full glass flex items-center justify-center relative group">
                                    <div className={`absolute inset-0 rounded-full ${index === 0 ? 'bg-glow-cyan/10' : index === 1 ? 'bg-glow-violet/10' : 'bg-gradient-to-br from-glow-cyan/10 to-glow-violet/10'} group-hover:scale-110 transition-transform duration-500`} />
                                    <span className="text-6xl md:text-7xl font-heading font-bold gradient-text relative z-10">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    {/* Orbiting Dot */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-glow-cyan shadow-glow-sm" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                                    {point.title}
                                </h3>
                                <p className={`text-lg font-heading ${index === 0 ? 'text-glow-cyan' : index === 1 ? 'text-glow-violet' : 'gradient-text'} mb-4`}>
                                    {point.subtitle}
                                </p>
                                <p className="text-text-secondary leading-relaxed max-w-md">
                                    {point.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 text-center"
                >
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-glow-cyan/20 via-glow-violet/20 to-glow-cyan/20 blur-3xl" />
                        <p className="relative text-3xl md:text-4xl lg:text-5xl font-heading font-light">
                            The future is not something we{' '}
                            <span className="font-bold gradient-text">enter</span>.
                            <br />
                            It&apos;s something we{' '}
                            <span className="font-bold gradient-text">create</span>.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default Theme
