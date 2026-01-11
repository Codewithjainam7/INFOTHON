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

                    {/* Main Glassmorphism Container */}
                    <motion.div
                        className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 sm:p-8 relative overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-glow-cyan/5 via-transparent to-glow-violet/5 pointer-events-none" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-glow-cyan" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-glow-violet" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-glow-violet" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-glow-cyan" />

                        {/* Header Section with Glitch */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 relative z-10"
                        >
                            <div className={`inline-block w-fit px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white mb-4`}>
                                {event.category}
                            </div>

                            {/* Title with Animated Glitch Effect */}
                            <div className="relative mb-4">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-glow-cyan drop-shadow-[0_0_30px_rgba(34,211,238,0.6)] relative z-20">
                                    <ScrambleText text={event.title} revealSpeed={50} scrambleSpeed={30} delay={300} />
                                </h1>

                                {/* Glitch layer - Cyan offset */}
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
                                >{event.title}</motion.h1>

                                {/* Glitch layer - Violet offset */}
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
                                >{event.title}</motion.h1>
                            </div>

                            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl">
                                {event.longDescription}
                            </p>
                        </motion.div>

                        {/* HUD Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8 relative z-10"
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
                                        className="p-3 sm:p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 hover:border-glow-cyan/50 hover:bg-black/40 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-glow-cyan/30 to-glow-violet/20 flex items-center justify-center mb-2 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-shadow">
                                            <item.icon className="w-5 h-5 text-glow-cyan" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider font-mono">{item.label}</p>
                                        <p className="text-sm sm:text-base text-text-primary font-semibold truncate">{item.value}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Prize Pool with Glitch Effect */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 relative z-10"
                        >
                            <div className="text-center py-10 sm:py-14 rounded-2xl bg-gradient-to-r from-black/40 via-glow-cyan/10 to-black/40 border border-glow-cyan/30 relative overflow-hidden group">
                                {/* Grid overlay */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                <p className="text-sm sm:text-base text-text-muted uppercase tracking-[0.4em] font-mono mb-3 relative z-10">PRIZE POOL</p>

                                {/* Prize with animated glitch */}
                                <div className="relative inline-block">
                                    <p
                                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black text-glow-cyan relative z-20"
                                        style={{ textShadow: '0 0 50px rgba(34,211,238,0.8), 0 0 100px rgba(34,211,238,0.4)' }}
                                    >
                                        {event.prize}
                                    </p>

                                    {/* Glitch layer - Cyan offset */}
                                    <motion.p
                                        className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, -6, 3, -4, 0],
                                            y: [0, 2, -2, 0],
                                            opacity: [0, 0.9, 0, 0.7, 0],
                                        }}
                                        transition={{
                                            duration: 0.18,
                                            repeat: Infinity,
                                            repeatDelay: 1.8,
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                        }}
                                    >{event.prize}</motion.p>

                                    {/* Glitch layer - Violet offset */}
                                    <motion.p
                                        className="absolute inset-0 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, 6, -3, 4, 0],
                                            y: [0, -2, 2, 0],
                                            opacity: [0, 0.8, 0, 0.6, 0],
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: Infinity,
                                            repeatDelay: 1.4,
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                        }}
                                    >{event.prize}</motion.p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Rules - Glass Cards Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8 relative z-10"
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
                                        className="p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-glow-cyan/40 hover:border-glow-cyan hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="font-mono text-xl font-black text-glow-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
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

                        {/* Timeline - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8 relative z-10"
                        >
                            <h2 className="text-lg sm:text-xl font-heading font-bold mb-6 flex items-center gap-2 text-glow-violet">
                                <Clock className="w-6 h-6" />
                                Event Timeline
                            </h2>
                            <div className="relative">
                                {/* Gradient line */}
                                <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan/30" />

                                <div className="space-y-4">
                                    {event.timeline.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.45 + index * 0.05 }}
                                            className="relative pl-12 sm:pl-14 group"
                                        >
                                            {/* Glowing node */}
                                            <div className="absolute left-2 sm:left-3 top-3 w-4 h-4 rounded-full bg-bg-primary border-2 border-glow-cyan shadow-[0_0_12px_rgba(34,211,238,0.6)] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(34,211,238,0.9)] transition-shadow">
                                                <div className="w-1.5 h-1.5 rounded-full bg-glow-cyan" />
                                            </div>

                                            {/* Content card */}
                                            <div className="p-4 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 group-hover:border-glow-violet/50 group-hover:bg-black/40 transition-all">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="px-3 py-1 rounded-lg bg-glow-violet/20 border border-glow-violet/40 font-mono text-sm text-glow-violet font-bold">
                                                        {item.time}
                                                    </span>
                                                    <p className="text-text-primary text-sm sm:text-base font-medium">{item.activity}</p>
                                                </div>
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
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 relative z-10"
                        >
                            <button
                                className="flex-1 py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-bg-primary bg-glow-cyan hover:bg-cyan-400 transition-colors"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Register Now
                                </span>
                            </button>

                            <button
                                className="flex-1 py-4 px-8 font-heading font-bold text-base sm:text-lg uppercase tracking-wider text-glow-cyan border-2 border-glow-cyan bg-transparent hover:bg-glow-cyan/10 transition-colors"
                                style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
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
