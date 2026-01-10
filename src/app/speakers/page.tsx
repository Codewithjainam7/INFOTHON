'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlassCard, NeonText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { speakers } from '@/data'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

export default function SpeakersPage() {
    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg2.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-violet tracking-wider mb-4">
                            SPEAKERS
                        </span>
                        <NeonText as="h1" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                            Industry Pioneers
                        </NeonText>
                        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                            Learn from the visionaries who are shaping the future of technology.
                        </p>
                    </motion.div>

                    {/* Speakers Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {speakers.map((speaker, index) => (
                            <motion.div
                                key={speaker.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="text-center group h-full" glowColor="violet">
                                    {/* Avatar */}
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-glow-cyan to-glow-violet animate-glow-pulse" />
                                        <div className="absolute inset-1 rounded-full bg-bg-secondary flex items-center justify-center">
                                            <span className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
                                                {speaker.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <h3 className="text-base sm:text-lg font-heading font-bold mb-1 group-hover:text-glow-violet transition-colors">
                                        {speaker.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-glow-cyan mb-1">{speaker.title}</p>
                                    <p className="text-xs text-text-muted mb-4">{speaker.company}</p>

                                    {/* Topic */}
                                    <div className="mt-auto pt-4 border-t border-white/10">
                                        <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
                                            &ldquo;{speaker.topic}&rdquo;
                                        </p>
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex justify-center gap-3 mt-4">
                                        {speaker.social.twitter && (
                                            <a
                                                href={speaker.social.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-glow-cyan transition-colors"
                                            >
                                                <span className="text-xs">X</span>
                                            </a>
                                        )}
                                        {speaker.social.linkedin && (
                                            <a
                                                href={speaker.social.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-glow-cyan transition-colors"
                                            >
                                                <span className="text-xs">in</span>
                                            </a>
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
