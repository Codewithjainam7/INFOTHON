'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { GlassCard, NeonText } from '@/components/ui'

const stats = [
    { value: '50K+', label: 'Participants' },
    { value: '100+', label: 'Events' },
    { value: '₹50L', label: 'Prize Pool' },
    { value: '3', label: 'Days' },
]

const features = [
    {
        icon: '🚀',
        title: 'Innovation Hub',
        description: 'A melting pot of ideas where the brightest minds converge to shape the future of technology.'
    },
    {
        icon: '🎯',
        title: 'World-Class Events',
        description: 'From hackathons to robotics, our competitions are designed to challenge and inspire.'
    },
    {
        icon: '🌐',
        title: 'Global Network',
        description: 'Connect with industry leaders, researchers, and innovators from around the world.'
    },
    {
        icon: '💡',
        title: 'Learn & Grow',
        description: 'Hands-on workshops and talks by pioneers who are defining the next technological frontier.'
    },
]

export function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section id="about" className="relative py-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/50 to-bg-primary" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-glow-violet/5 rounded-full blur-3xl" />

            <div ref={ref} className="relative z-10 section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                        ABOUT US
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                        The Future Awaits
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
                        NEXUS is more than a tech festival—it&apos;s a movement. For over a decade, we&apos;ve been
                        the launchpad for ideas that transformed industries and careers that shaped the world.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        >
                            <GlassCard className="text-center py-8" hover3D={false}>
                                <div className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-muted uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        >
                            <GlassCard className="h-full group" glowColor={index % 2 === 0 ? 'cyan' : 'violet'}>
                                <div className="flex items-start gap-4">
                                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-glow-cyan transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-text-secondary leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Vision Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 text-center"
                >
                    <GlassCard variant="dark" className="inline-block max-w-4xl py-12 px-8" hover3D={false}>
                        <blockquote className="text-xl sm:text-2xl md:text-3xl font-heading font-light text-text-primary leading-relaxed">
                            &ldquo;We don&apos;t just predict the future—
                            <span className="gradient-text font-semibold"> we build it.</span>&rdquo;
                        </blockquote>
                        <p className="mt-4 text-text-muted text-sm uppercase tracking-wider">
                            — NEXUS Vision Statement
                        </p>
                    </GlassCard>
                </motion.div>
            </div>
        </section>
    )
}

export default About
