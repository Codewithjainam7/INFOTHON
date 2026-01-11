'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlassCard, NeonText, ScrambleText } from '@/components/ui'
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

                        <div className="relative inline-block group mb-6">
                            {/* Glitch layer - Cyan offset */}
                            <motion.h1
                                className="absolute top-0 left-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#00f0ff] opacity-70 pointer-events-none z-0"
                                animate={{
                                    x: [0, -2, 2, -1, 0],
                                    y: [0, 1, -1, 0, 0],
                                    scale: [1, 1.02, 0.98, 1, 1],
                                    opacity: [0, 0.8, 0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 2.5,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Industry Pioneers
                            </motion.h1>

                            {/* Glitch layer - Violet offset */}
                            <motion.h1
                                className="absolute top-0 left-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#8b5cf6] opacity-70 pointer-events-none z-0"
                                animate={{
                                    x: [0, 2, -2, 1, 0],
                                    y: [0, -1, 1, 0, 0],
                                    scale: [1, 0.98, 1.02, 1, 1],
                                    opacity: [0, 0.8, 0, 0.5, 0],
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 2.2,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Industry Pioneers
                            </motion.h1>

                            {/* Main Text */}
                            <motion.h1
                                className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                animate={{
                                    textShadow: [
                                        "0 0 10px rgba(139,92,246,0.5)",
                                        "0 0 20px rgba(139,92,246,0.8)",
                                        "0 0 10px rgba(139,92,246,0.5)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ScrambleText text="Industry Pioneers" />
                            </motion.h1>
                        </div>

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
                                <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 group h-full hover:border-glow-violet/50 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all">
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
                                    <h3 className="text-base sm:text-lg font-heading font-bold mb-1 text-white group-hover:text-glow-violet transition-colors text-center">
                                        {speaker.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-glow-cyan mb-1 text-center">{speaker.title}</p>
                                    <p className="text-xs text-text-muted mb-4 text-center">{speaker.company}</p>

                                    {/* Topic */}
                                    <div className="mt-auto pt-4 border-t border-white/10">
                                        <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 text-center">
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
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
