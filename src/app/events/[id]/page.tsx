'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { events } from '@/data'
import { GlowButton, ScrambleText } from '@/components/ui'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { Footer } from '@/components/sections'
import { ClipboardList, Clock, Calendar, MapPin, Users, FileText } from 'lucide-react'

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
                            {/* Header with Glitch Effect */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col"
                            >
                                <div className={`inline-block w-fit px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white mb-3 sm:mb-4`}>
                                    {event.category}
                                </div>

                                {/* Glitched Title */}
                                <div className="relative mb-4">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                        <ScrambleText
                                            text={event.title}
                                            revealSpeed={50}
                                            scrambleSpeed={30}
                                            delay={300}
                                        />
                                    </h1>

                                    {/* Glitch layer - Cyan */}
                                    <motion.h1
                                        className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, -8, 4, -6, 0],
                                            y: [0, 3, -2, 0],
                                            scale: [1, 1.03, 0.97, 1],
                                            opacity: [0, 1, 0, 0.8, 0],
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            repeat: Infinity,
                                            repeatDelay: 1.5,
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                        }}
                                    >
                                        {event.title}
                                    </motion.h1>

                                    {/* Glitch layer - Violet */}
                                    <motion.h1
                                        className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, 8, -4, 6, 0],
                                            y: [0, -3, 2, 0],
                                            scale: [1, 0.97, 1.03, 1],
                                            opacity: [0, 0.9, 0, 0.7, 0],
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: Infinity,
                                            repeatDelay: 1.2,
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                        }}
                                    >
                                        {event.title}
                                    </motion.h1>
                                </div>

                                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                                    {event.longDescription}
                                </p>
                            </motion.div>

                            {/* Rules - Glassmorphism Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="glitch-container rounded-lg p-5 sm:p-6 border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 relative overflow-hidden">
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2 text-glow-cyan">
                                        <ClipboardList className="w-6 h-6" />
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
                                </div>
                            </motion.div>

                            {/* Timeline - Glassmorphism Container with Cool Animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="glitch-container rounded-lg p-5 sm:p-6 border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 relative overflow-hidden">
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                    <h2 className="text-lg sm:text-xl font-heading font-bold mb-4 flex items-center gap-2 text-glow-violet">
                                        <Clock className="w-6 h-6" />
                                        Event Timeline
                                    </h2>
                                    <div className="relative">
                                        {/* Animated gradient line */}
                                        <motion.div
                                            className="absolute left-2.5 sm:left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan"
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            style={{ originY: 0 }}
                                        />
                                        {/* Glowing pulse traveling down the line */}
                                        <motion.div
                                            className="absolute left-2 sm:left-2.5 w-1.5 h-8 bg-gradient-to-b from-transparent via-glow-cyan to-transparent rounded-full blur-sm"
                                            animate={{ top: ['0%', '100%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        />

                                        <div className="space-y-4 sm:space-y-5">
                                            {event.timeline.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-start gap-3 sm:gap-4 pl-8 sm:pl-10 relative group"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + index * 0.15 }}
                                                >
                                                    {/* Pulsing dot */}
                                                    <motion.div
                                                        className="absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bg-primary border-2 border-glow-cyan flex items-center justify-center"
                                                        animate={{
                                                            boxShadow: ['0 0 0px rgba(34,211,238,0.5)', '0 0 15px rgba(34,211,238,0.8)', '0 0 0px rgba(34,211,238,0.5)']
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                                    >
                                                        <motion.div
                                                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-glow-cyan"
                                                            animate={{ scale: [1, 1.3, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                                                        />
                                                    </motion.div>

                                                    {/* Content card */}
                                                    <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-glow-cyan/30 group-hover:bg-white/10 transition-all duration-300">
                                                        <p className="font-mono text-xs sm:text-sm text-glow-cyan font-bold">{item.time}</p>
                                                        <p className="text-text-primary text-sm sm:text-base mt-1">{item.activity}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Glassmorphism Container */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="glitch-container rounded-lg p-5 sm:p-6 border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 lg:sticky lg:top-24 relative overflow-hidden">
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                    <h3 className="text-base sm:text-lg font-heading font-bold mb-4 sm:mb-6 text-glow-violet">Event Details</h3>

                                    <div className="space-y-3 sm:space-y-4">
                                        <InfoRow icon={<Calendar className="w-5 h-5 text-glow-cyan" />} label="Date" value={event.date} />
                                        <InfoRow icon={<Clock className="w-5 h-5 text-glow-cyan" />} label="Time" value={event.time} />
                                        <InfoRow icon={<MapPin className="w-5 h-5 text-glow-cyan" />} label="Venue" value={event.venue} />
                                        <InfoRow icon={<Users className="w-5 h-5 text-glow-cyan" />} label="Team Size" value={event.teamSize} />
                                        <InfoRow icon={<FileText className="w-5 h-5 text-glow-cyan" />} label="Deadline" value={event.registrationDeadline} />

                                        <div className="pt-3 sm:pt-4 border-t border-white/10">
                                            <p className="text-xs sm:text-sm text-text-muted mb-1">Prize Pool</p>
                                            <p className="text-2xl sm:text-3xl font-heading font-bold text-glow-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{event.prize}</p>
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
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2 sm:gap-3">
            <span className="mt-0.5">{icon}</span>
            <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">{label}</p>
                <p className="text-text-primary text-sm sm:text-base">{value}</p>
            </div>
        </div>
    )
}

