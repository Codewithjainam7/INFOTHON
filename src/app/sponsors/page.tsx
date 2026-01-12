'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { NeonText, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { sponsors, sponsorTiers } from '@/data'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

export default function SponsorsPage() {
    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg4.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center mb-16"
                    >
                        <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                            SPONSORS
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
                                Our Partners
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
                                Our Partners
                            </motion.h1>

                            {/* Main Text */}
                            <motion.h1
                                className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                animate={{
                                    textShadow: [
                                        "0 0 10px rgba(34,211,238,0.5)",
                                        "0 0 20px rgba(34,211,238,0.8)",
                                        "0 0 10px rgba(34,211,238,0.5)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ScrambleText text="Our Partners" />
                            </motion.h1>
                        </div>

                        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                            Powered by the world&apos;s leading technology companies.
                        </p>
                    </motion.div>

                    {/* Sponsor Tiers */}
                    <div className="space-y-12 sm:space-y-16">
                        {sponsorTiers.map((tier, tierIndex) => {
                            const tierSponsors = sponsors.filter((s) => s.tier === tier.id)
                            if (tierSponsors.length === 0) return null

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: tierIndex * 0.1 }}
                                >
                                    {/* Tier Label */}
                                    <div className="text-center mb-6 sm:mb-8">
                                        <span className={`inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-semibold`}>
                                            {tier.label}
                                        </span>
                                    </div>

                                    {/* Sponsor Grid */}
                                    <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${tier.id === 'title' ? 'max-w-2xl mx-auto' : ''
                                        }`}>
                                        {tierSponsors.map((sponsor, index) => (
                                            <motion.a
                                                key={sponsor.id}
                                                href={sponsor.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 + index * 0.05 }}
                                                whileHover={{ scale: 1.05 }}
                                                className={`
                          group relative overflow-hidden rounded-2xl flex items-center justify-center
                          bg-black/60 backdrop-blur-md border border-white/10
                          transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-glow-cyan/50 hover:bg-black/80
                          ${tier.id === 'title' ? 'w-48 sm:w-64 h-24 sm:h-32' : ''}
                          ${tier.id === 'platinum' ? 'w-36 sm:w-48 h-20 sm:h-24' : ''}
                          ${tier.id === 'gold' ? 'w-32 sm:w-40 h-16 sm:h-20' : ''}
                          ${tier.id === 'silver' ? 'w-28 sm:w-36 h-14 sm:h-16' : ''}
                        `}
                                            >
                                                <div className={`
                          font-heading font-bold text-text-muted group-hover:text-white transition-colors text-center px-2 z-10
                          ${tier.id === 'title' ? 'text-lg sm:text-xl' : ''}
                          ${tier.id === 'platinum' ? 'text-base sm:text-lg' : ''}
                          ${tier.id === 'gold' ? 'text-sm sm:text-base' : ''}
                          ${tier.id === 'silver' ? 'text-xs sm:text-sm' : ''}
                        `}>
                                                    {sponsor.name}
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-12 sm:mt-16"
                    >
                        <p className="text-text-secondary mb-4">Interested in becoming a sponsor?</p>
                        <a
                            href="mailto:sponsors@infothon2026.com"
                            className="inline-flex items-center gap-2 text-glow-cyan hover:text-white transition-colors group"
                        >
                            <span className="font-heading font-semibold">Get in Touch</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
