'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlassCard, NeonText } from '@/components/ui'
import { Footer } from '@/components/sections'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const stats = [
    { value: '50K+', label: 'Participants' },
    { value: '100+', label: 'Events' },
    { value: '₹50L', label: 'Prize Pool' },
    { value: '3', label: 'Days' },
]

const features = [
    { icon: '🚀', title: 'Innovation Hub', description: 'A melting pot of ideas where the brightest minds converge to shape the future.' },
    { icon: '🎯', title: 'World-Class Events', description: 'From hackathons to robotics, our competitions are designed to challenge and inspire.' },
    { icon: '🌐', title: 'Global Network', description: 'Connect with industry leaders, researchers, and innovators from around the world.' },
    { icon: '💡', title: 'Learn & Grow', description: 'Hands-on workshops and talks by pioneers defining the next technological frontier.' },
]

export default function AboutPage() {
    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16 sm:mb-20"
                    >
                        <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                            ABOUT US
                        </span>
                        <NeonText as="h1" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                            The Future Awaits
                        </NeonText>
                        <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                            INFOTHON is more than a tech festival—it&apos;s a movement. For over a decade, we&apos;ve been
                            the launchpad for ideas that transformed industries and careers that shaped the world.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                <GlassCard className="text-center py-6 sm:py-8" hover3D={false}>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold gradient-text mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs sm:text-sm text-text-muted uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <GlassCard className="h-full group" glowColor={index % 2 === 0 ? 'cyan' : 'violet'}>
                                    <div className="flex items-start gap-4">
                                        <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 group-hover:text-glow-cyan transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center"
                    >
                        <GlassCard variant="dark" className="inline-block max-w-4xl py-10 sm:py-12 px-6 sm:px-8" hover3D={false}>
                            <blockquote className="text-xl sm:text-2xl md:text-3xl font-heading font-light leading-relaxed">
                                &ldquo;We don&apos;t just predict the future—
                                <span className="gradient-text font-semibold"> we build it.</span>&rdquo;
                            </blockquote>
                            <p className="mt-4 text-text-muted text-sm uppercase tracking-wider">
                                — INFOTHON Vision Statement
                            </p>
                        </GlassCard>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
