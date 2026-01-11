'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { events, eventCategories, type Event } from '@/data'
import { GlowButton, ScrambleText } from '@/components/ui'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { Footer } from '@/components/sections'
import { Target, Code, Brain, Bot, Palette, Gamepad2, BookOpen } from 'lucide-react'

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

const categoryIcons: Record<string, React.ReactNode> = {
    all: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
    coding: <Code className="w-4 h-4 sm:w-5 sm:h-5" />,
    ai: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />,
    robotics: <Bot className="w-4 h-4 sm:w-5 sm:h-5" />,
    design: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />,
    gaming: <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />,
    workshop: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
}

export default function EventsPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesCategory = activeCategory === 'all' || event.category === activeCategory
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [activeCategory, searchQuery])

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg6.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center mb-10 sm:mb-12"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm text-xs font-cyber text-glow-cyan tracking-widest mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            EVENTS
                        </span>
                        <div className="relative inline-block mb-4">
                            {/* Main visible text - SOLID COLOR for maximum compatibility */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black relative z-20 text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                <ScrambleText
                                    text="Competitions"
                                    revealSpeed={50}
                                    scrambleSpeed={30}
                                    delay={300}
                                />
                            </h1>

                            {/* Glitch layer - Cyan offset */}
                            <motion.h1
                                className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
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
                                    repeatDelay: 1,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Competitions
                            </motion.h1>

                            {/* Glitch layer - Violet offset */}
                            <motion.h1
                                className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
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
                                    repeatDelay: 0.8,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Competitions
                            </motion.h1>
                        </div>
                        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                            Explore all competitions, hackathons, workshops, and more.
                        </p>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-10 sm:mb-12"
                    >
                        {/* Search */}
                        <div className="max-w-md mx-auto mb-6 sm:mb-8">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 sm:px-5 py-3 pl-10 sm:pl-12 rounded-xl glass bg-bg-secondary/50 border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan/50 transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {eventCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center ${activeCategory === category.id
                                        ? 'bg-glow-cyan/20 text-glow-cyan border border-glow-cyan/50'
                                        : 'glass text-text-secondary hover:text-white'
                                        }`}
                                >
                                    <span className="mr-1.5 sm:mr-2">{categoryIcons[category.id]}</span>
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Events Grid */}
                    <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link href={`/events/${event.id}`}>
                                        <div className="glitch-container rounded-lg p-4 sm:p-5 h-full group border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 relative overflow-hidden">
                                            <div className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase bg-gradient-to-r ${categoryColors[event.category]} text-white mb-3 sm:mb-4`}>
                                                {event.category}
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 sm:mb-3 group-hover:text-glow-cyan transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-text-secondary text-xs sm:text-sm mb-4 line-clamp-2">
                                                {event.description}
                                            </p>
                                            <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-white/10">
                                                <span className="text-xs sm:text-sm text-text-muted">{event.date}</span>
                                                <span className="text-sm sm:text-base font-heading font-bold gradient-text">{event.prize}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-text-muted">No events found.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
