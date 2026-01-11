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
                                        className="p-3 sm:p-4 rounded-xl bg-black/60 backdrop-blur-md border border-glow-cyan/30 hover:border-glow-cyan/60 hover:bg-black/70 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-glow-cyan/20 border border-glow-cyan/30 flex items-center justify-center mb-2 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-shadow">
                                            <item.icon className="w-5 h-5 text-glow-cyan" />
                                        </div>
                                        <p className="text-xs text-glow-cyan/80 uppercase tracking-wider font-mono mb-1">{item.label}</p>
                                        <p className="text-sm sm:text-base text-white font-bold">{item.value}</p>
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
                            <div className="relative mb-4">
                                <h2 className="text-lg sm:text-xl font-heading font-bold flex items-center gap-2 text-glow-cyan relative z-20">
                                    <ClipboardList className="w-6 h-6" />
                                    Rules & Guidelines
                                </h2>

                                {/* Glitch layer - Cyan offset */}
                                <motion.div
                                    className="absolute inset-0 flex items-center gap-2 text-lg sm:text-xl font-heading font-bold text-[#00f0ff] pointer-events-none z-10"
                                    style={{ opacity: 0 }}
                                    animate={{
                                        x: [0, -4, 2, -3, 0],
                                        y: [0, 2, -1, 0],
                                        opacity: [0, 0.9, 0, 0.7, 0],
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 2.5,
                                        times: [0, 0.2, 0.4, 0.6, 1],
                                    }}
                                >
                                    <ClipboardList className="w-6 h-6" />
                                    Rules & Guidelines
                                </motion.div>

                                {/* Glitch layer - Violet offset */}
                                <motion.div
                                    className="absolute inset-0 flex items-center gap-2 text-lg sm:text-xl font-heading font-bold text-[#8b5cf6] pointer-events-none z-10"
                                    style={{ opacity: 0 }}
                                    animate={{
                                        x: [0, 4, -2, 3, 0],
                                        y: [0, -2, 1, 0],
                                        opacity: [0, 0.8, 0, 0.6, 0],
                                    }}
                                    transition={{
                                        duration: 0.15,
                                        repeat: Infinity,
                                        repeatDelay: 2.2,
                                        times: [0, 0.2, 0.4, 0.6, 1],
                                    }}
                                >
                                    <ClipboardList className="w-6 h-6" />
                                    Rules & Guidelines
                                </motion.div>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                                {event.rules.map((rule, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35 + index * 0.03 }}
                                        className="p-4 rounded-xl bg-black/60 backdrop-blur-md border border-glow-cyan/30 hover:border-glow-cyan hover:bg-black/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
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
                            <div className="relative mb-6">
                                <h2 className="text-lg sm:text-xl font-heading font-bold flex items-center gap-2 text-glow-violet relative z-20">
                                    <Clock className="w-6 h-6" />
                                    Event Timeline
                                </h2>

                                {/* Glitch layer - Cyan offset */}
                                <motion.div
                                    className="absolute inset-0 flex items-center gap-2 text-lg sm:text-xl font-heading font-bold text-[#00f0ff] pointer-events-none z-10"
                                    style={{ opacity: 0 }}
                                    animate={{
                                        x: [0, -4, 2, -3, 0],
                                        y: [0, 2, -1, 0],
                                        opacity: [0, 0.9, 0, 0.7, 0],
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        times: [0, 0.2, 0.4, 0.6, 1],
                                    }}
                                >
                                    <Clock className="w-6 h-6" />
                                    Event Timeline
                                </motion.div>

                                {/* Glitch layer - Violet offset */}
                                <motion.div
                                    className="absolute inset-0 flex items-center gap-2 text-lg sm:text-xl font-heading font-bold text-[#8b5cf6] pointer-events-none z-10"
                                    style={{ opacity: 0 }}
                                    animate={{
                                        x: [0, 4, -2, 3, 0],
                                        y: [0, -2, 1, 0],
                                        opacity: [0, 0.8, 0, 0.6, 0],
                                    }}
                                    transition={{
                                        duration: 0.15,
                                        repeat: Infinity,
                                        repeatDelay: 2.8,
                                        times: [0, 0.2, 0.4, 0.6, 1],
                                    }}
                                >
                                    <Clock className="w-6 h-6" />
                                    Event Timeline
                                </motion.div>
                            </div>
                            <div className="relative pl-2">
                                {/* Gradient line - grows vertically */}
                                <motion.div
                                    className="absolute left-[9px] sm:left-[11px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan/30 origin-top"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                                />

                                <div className="space-y-4">
                                    {event.timeline.map((item, index) => (
                                        <div key={index} className="relative pl-10 sm:pl-12 group">
                                            {/* Glowing node - pops in */}
                                            <motion.div
                                                className="absolute left-0 top-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bg-primary border-2 border-glow-cyan shadow-[0_0_12px_rgba(34,211,238,0.6)] flex items-center justify-center z-10 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.9)] transition-shadow"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                                            >
                                                <div className="w-2 h-2 rounded-full bg-glow-cyan" />
                                            </motion.div>

                                            {/* Content card - slides in */}
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 + index * 0.15, type: "spring", stiffness: 100, damping: 15 }}
                                                className="p-4 rounded-xl bg-black/80 backdrop-blur-md border border-glow-cyan/20 group-hover:border-glow-cyan/60 group-hover:bg-black/90 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all"
                                            >
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="px-3 py-1 rounded-lg bg-glow-violet/20 border border-glow-violet/40 font-mono text-sm text-glow-violet font-bold">
                                                        {item.time}
                                                    </span>
                                                    <p className="text-text-primary text-sm sm:text-base font-medium">{item.activity}</p>
                                                </div>
                                            </motion.div>
                                        </div>
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
                    </motion.div >
                </div >
            </main >

            <Footer />
        </SmoothScroll >
    )
}
