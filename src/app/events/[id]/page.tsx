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

                    {/* Main Frosted Glass Container */}
                    <motion.div
                        className="rounded-2xl border border-white/10 bg-black/10 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden"
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

                            {/* Glitched Title */}
                            <div className="relative mb-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-glow-cyan drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                                    <ScrambleText text={event.title} revealSpeed={50} scrambleSpeed={30} delay={300} />
                                </h1>
                                <motion.h1
                                    className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#00f0ff] pointer-events-none"
                                    style={{ opacity: 0 }}
                                    animate={{ x: [0, -8, 4, 0], opacity: [0, 1, 0, 0] }}
                                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
                                >{event.title}</motion.h1>
                                <motion.h1
                                    className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-[#8b5cf6] pointer-events-none"
                                    style={{ opacity: 0 }}
                                    animate={{ x: [0, 8, -4, 0], opacity: [0, 0.9, 0, 0] }}
                                    transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 1.2 }}
                                >{event.title}</motion.h1>
                            </div>

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
                                    { icon: Calendar, label: 'DATE', value: event.date, color: 'cyan' },
                                    { icon: Clock, label: 'TIME', value: event.time, color: 'violet' },
                                    { icon: MapPin, label: 'VENUE', value: event.venue, color: 'cyan' },
                                    { icon: Users, label: 'TEAM', value: event.teamSize, color: 'violet' },
                                    { icon: FileText, label: 'DEADLINE', value: event.registrationDeadline, color: 'cyan' },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className={`p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 hover:border-glow-${item.color}/50 transition-all duration-300 group`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-glow-${item.color}/20 flex items-center justify-center mb-2 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all`}>
                                            <item.icon className={`w-4 h-4 text-glow-${item.color}`} />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">{item.label}</p>
                                        <p className="text-sm sm:text-base text-text-primary font-semibold truncate">{item.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Holographic Prize Pool */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 relative"
                        >
                            <div className="text-center py-8 sm:py-12 rounded-xl bg-gradient-to-r from-glow-cyan/10 via-glow-violet/10 to-glow-cyan/10 border border-white/10 relative overflow-hidden">
                                {/* Scanline effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-glow-cyan/5 to-transparent"
                                    animate={{ y: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                />
                                <p className="text-sm sm:text-base text-text-muted uppercase tracking-[0.3em] font-mono mb-2">PRIZE POOL</p>
                                <motion.p
                                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-glow-cyan"
                                    style={{
                                        textShadow: '0 0 30px rgba(34,211,238,0.8), 0 0 60px rgba(34,211,238,0.5), 0 0 100px rgba(34,211,238,0.3)',
                                    }}
                                    animate={{
                                        textShadow: [
                                            '0 0 30px rgba(34,211,238,0.8), 0 0 60px rgba(34,211,238,0.5), 0 0 100px rgba(34,211,238,0.3)',
                                            '0 0 50px rgba(34,211,238,1), 0 0 80px rgba(34,211,238,0.7), 0 0 120px rgba(34,211,238,0.5)',
                                            '0 0 30px rgba(34,211,238,0.8), 0 0 60px rgba(34,211,238,0.5), 0 0 100px rgba(34,211,238,0.3)',
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    {event.prize}
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Rules - 2 Column Glass Card Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
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
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="p-4 rounded-lg bg-white/5 border border-glow-cyan/30 hover:border-glow-cyan/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="font-mono text-lg sm:text-xl font-bold text-glow-cyan opacity-60 group-hover:opacity-100 transition-opacity">
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

                        {/* Timeline - Stunning Animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mb-8"
                        >
                            <h2 className="text-lg sm:text-xl font-heading font-bold mb-6 flex items-center gap-2 text-glow-violet">
                                <Clock className="w-6 h-6" />
                                Event Timeline
                            </h2>
                            <div className="relative">
                                {/* Central animated line */}
                                <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan opacity-30" />
                                <motion.div
                                    className="absolute left-3.5 sm:left-5.5 w-2 h-2 rounded-full bg-glow-cyan shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                />

                                <div className="space-y-4">
                                    {event.timeline.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            className="flex items-center gap-4 pl-10 sm:pl-14 group"
                                        >
                                            {/* Timeline node */}
                                            <motion.div
                                                className="absolute left-2.5 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-bg-primary border-2 border-glow-violet"
                                                animate={{
                                                    boxShadow: ['0 0 0px rgba(139,92,246,0.5)', '0 0 20px rgba(139,92,246,1)', '0 0 0px rgba(139,92,246,0.5)'],
                                                    scale: [1, 1.2, 1]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                            />

                                            {/* Content */}
                                            <div className="flex-1 flex items-center gap-4 p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10 group-hover:border-glow-violet/50 group-hover:bg-white/10 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all duration-300">
                                                <div className="px-3 py-1 rounded bg-glow-violet/20 border border-glow-violet/30">
                                                    <p className="font-mono text-xs sm:text-sm text-glow-violet font-bold whitespace-nowrap">{item.time}</p>
                                                </div>
                                                <p className="text-text-primary text-sm sm:text-base">{item.activity}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Chamfered Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <motion.button
                                className="flex-1 relative overflow-hidden py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-white"
                                style={{
                                    clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                                    background: 'linear-gradient(135deg, #00f0ff, #8b5cf6)',
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-glow-cyan via-glow-violet to-glow-cyan"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    style={{ opacity: 0.3 }}
                                />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Register Now
                                </span>
                            </motion.button>

                            <motion.button
                                className="flex-1 relative overflow-hidden py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-glow-cyan border-2 border-glow-cyan/50 bg-transparent hover:bg-glow-cyan/10 transition-colors"
                                style={{
                                    clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)',
                                }}
                                whileHover={{ scale: 1.02, borderColor: 'rgba(34,211,238,1)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Download className="w-5 h-5" />
                                    Download Rulebook
                                </span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
