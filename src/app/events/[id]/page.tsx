'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { events } from '@/data'
import { ScrambleText } from '@/components/ui'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { Footer } from '@/components/sections'
import { ClipboardList, Clock, Calendar, MapPin, Users, FileText, Download, Zap } from 'lucide-react'

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

                    {/* Main Container */}
                    <motion.div
                        className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 sm:p-8 relative"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-glow-cyan/80" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-glow-violet/80" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-glow-violet/80" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-glow-cyan/80" />

                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className={`inline-block w-fit px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white mb-4`}>
                                {event.category}
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-glow-cyan drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] mb-4">
                                <ScrambleText text={event.title} revealSpeed={50} scrambleSpeed={30} delay={300} />
                            </h1>

                            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
                                {event.longDescription}
                            </p>
                        </motion.div>

                        {/* HUD Dashboard - Event Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                                {[
                                    { icon: Calendar, label: 'DATE', value: event.date },
                                    { icon: Clock, label: 'TIME', value: event.time },
                                    { icon: MapPin, label: 'VENUE', value: event.venue },
                                    { icon: Users, label: 'TEAM', value: event.teamSize },
                                    { icon: FileText, label: 'DEADLINE', value: event.registrationDeadline },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + index * 0.03 }}
                                        className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-glow-cyan/50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-glow-cyan/20 flex items-center justify-center mb-2">
                                            <item.icon className="w-4 h-4 text-glow-cyan" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">{item.label}</p>
                                        <p className="text-sm sm:text-base text-text-primary font-semibold truncate">{item.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Prize Pool - Static Glow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <div className="text-center py-8 sm:py-10 rounded-xl bg-gradient-to-r from-glow-cyan/10 via-glow-violet/5 to-glow-cyan/10 border border-glow-cyan/20">
                                <p className="text-sm sm:text-base text-text-muted uppercase tracking-[0.3em] font-mono mb-2">PRIZE POOL</p>
                                <p
                                    className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-glow-cyan"
                                    style={{ textShadow: '0 0 40px rgba(34,211,238,0.6), 0 0 80px rgba(34,211,238,0.3)' }}
                                >
                                    {event.prize}
                                </p>
                            </div>
                        </motion.div>

                        {/* Rules - 2 Column Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2 text-glow-cyan">
                                <ClipboardList className="w-6 h-6" />
                                Rules & Guidelines
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                {event.rules.map((rule, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 + index * 0.03 }}
                                        className="p-4 rounded-lg bg-white/5 border border-glow-cyan/30 hover:border-glow-cyan/60 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="font-mono text-lg font-bold text-glow-cyan/70">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                                                {rule.split(/(\d+-\d+|\d+ members?)/gi).map((part, i) =>
                                                    /\d+-\d+|\d+ members?/i.test(part) ?
                                                        <span key={i} className="text-green-400 font-bold">{part}</span> : part
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Timeline - Simple Clean */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8"
                        >
                            <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2 text-glow-violet">
                                <Clock className="w-6 h-6" />
                                Event Timeline
                            </h2>
                            <div className="relative">
                                {/* Static line */}
                                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-glow-cyan via-glow-violet to-transparent" />

                                <div className="space-y-0">
                                    {event.timeline.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -15 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.45 + index * 0.05 }}
                                            className="relative pl-10 sm:pl-12 pb-5 last:pb-0"
                                        >
                                            {/* Node */}
                                            <div className="absolute left-1 sm:left-2 top-1 w-4 h-4 rounded-full bg-bg-primary border-2 border-glow-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)] flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-glow-cyan" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-glow-cyan/40 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <span className="font-mono text-sm text-glow-cyan font-bold">{item.time}</span>
                                                    <span className="hidden sm:block w-px h-4 bg-white/20" />
                                                    <p className="text-text-primary text-sm sm:text-base">{item.activity}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button
                                className="flex-1 py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-bg-primary bg-glow-cyan hover:bg-cyan-400 transition-colors rounded-lg"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Register Now
                                </span>
                            </button>

                            <button
                                className="flex-1 py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-glow-cyan border-2 border-glow-cyan/60 bg-transparent hover:bg-glow-cyan/10 hover:border-glow-cyan transition-colors rounded-lg"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download Rulebook
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
