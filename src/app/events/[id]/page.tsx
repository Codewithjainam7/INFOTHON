'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { events } from '@/data'
import { GlassCard, GlowButton, NeonText } from '@/components/ui'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { Footer } from '@/components/sections'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const categoryColors: Record<string, string> = {
    coding: 'from-blue-500 to-cyan-500',
    ai: 'from-purple-500 to-pink-500',
    robotics: 'from-orange-500 to-red-500',
    design: 'from-green-500 to-teal-500',
    gaming: 'from-yellow-500 to-orange-500',
    workshop: 'from-indigo-500 to-purple-500',
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const event = events.find((e) => e.id === id)

    if (!event) {
        notFound()
    }

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg7.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-glow-cyan transition-colors mb-6 sm:mb-8 group text-sm sm:text-base"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Events
                        </Link>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white mb-3 sm:mb-4`}>
                                    {event.category}
                                </div>
                                <NeonText as="h1" color="gradient" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
                                    {event.title}
                                </NeonText>
                                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                                    {event.longDescription}
                                </p>
                            </motion.div>

                            {/* Rules */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <GlassCard>
                                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">📋</span>
                                        Rules & Guidelines
                                    </h2>
                                    <ul className="space-y-2 sm:space-y-3">
                                        {event.rules.map((rule, index) => (
                                            <li key={index} className="flex items-start gap-2 sm:gap-3 text-text-secondary text-sm sm:text-base">
                                                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-glow-cyan/20 flex items-center justify-center flex-shrink-0 text-xs text-glow-cyan font-bold mt-0.5">
                                                    {index + 1}
                                                </span>
                                                {rule}
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            </motion.div>

                            {/* Timeline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <GlassCard>
                                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">⏰</span>
                                        Event Timeline
                                    </h2>
                                    <div className="relative">
                                        <div className="absolute left-2.5 sm:left-3 top-0 bottom-0 w-px bg-gradient-to-b from-glow-cyan to-glow-violet opacity-30" />
                                        <div className="space-y-3 sm:space-y-4">
                                            {event.timeline.map((item, index) => (
                                                <div key={index} className="flex items-start gap-3 sm:gap-4 pl-6 sm:pl-8 relative">
                                                    <div className="absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bg-secondary border-2 border-glow-cyan flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-glow-cyan" />
                                                    </div>
                                                    <div>
                                                        <p className="font-mono text-xs sm:text-sm text-glow-cyan">{item.time}</p>
                                                        <p className="text-text-primary text-sm sm:text-base">{item.activity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <GlassCard className="lg:sticky lg:top-24" glowColor="violet">
                                    <h3 className="text-base sm:text-lg font-heading font-bold mb-4 sm:mb-6">Event Details</h3>

                                    <div className="space-y-3 sm:space-y-4">
                                        <InfoRow icon="📅" label="Date" value={event.date} />
                                        <InfoRow icon="🕐" label="Time" value={event.time} />
                                        <InfoRow icon="📍" label="Venue" value={event.venue} />
                                        <InfoRow icon="👥" label="Team Size" value={event.teamSize} />
                                        <InfoRow icon="📝" label="Deadline" value={event.registrationDeadline} />

                                        <div className="pt-3 sm:pt-4 border-t border-white/10">
                                            <p className="text-xs sm:text-sm text-text-muted mb-1">Prize Pool</p>
                                            <p className="text-2xl sm:text-3xl font-heading font-bold gradient-text">{event.prize}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 space-y-3">
                                        <GlowButton className="w-full justify-center" size="lg">
                                            Register Now
                                        </GlowButton>
                                        <GlowButton variant="secondary" className="w-full justify-center">
                                            Download Rulebook
                                        </GlowButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl">{icon}</span>
            <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
                <p className="text-text-primary text-sm sm:text-base">{value}</p>
            </div>
        </div>
    )
}
