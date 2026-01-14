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
import { Target, Code, Brain, Bot, Palette, Gamepad2, BookOpen, Search } from 'lucide-react'

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

// Text shimmer classes for event titles (gradient on hover)
const categoryShimmerClasses: Record<string, string> = {
    coding: 'shimmer-coding',
    ai: 'shimmer-ai',
    robotics: 'shimmer-robotics',
    design: 'shimmer-design',
    gaming: 'shimmer-gaming',
    workshop: 'shimmer-workshop',
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
                        {/* Search Container */}
                        <div className="max-w-xl mx-auto mb-10 relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-glow-cyan/20 to-glow-violet/20 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative relative flex items-center bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg group-hover:border-glow-cyan/50 transition-all">
                                <Search className="w-6 h-6 text-glow-cyan ml-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                                <input
                                    type="text"
                                    placeholder="SEARCH_EVENTS_DATABASE..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-4 bg-transparent text-white placeholder-text-muted/50 focus:outline-none font-mono text-sm tracking-widest uppercase"
                                />
                                <div className="pr-4">
                                    <div className="w-2 h-2 bg-glow-cyan rounded-full animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Futuristic Categories HUD */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {eventCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`relative group px-6 py-3 font-heading font-bold uppercase tracking-wider text-sm transition-all duration-300 ${activeCategory === category.id
                                        ? 'text-black'
                                        : 'text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {/* Active Background - Glowing Shape */}
                                    {activeCategory === category.id && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute inset-0 bg-glow-cyan shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                                            style={{
                                                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                            }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    {/* Inactive Border - Visible on Hover */}
                                    {activeCategory !== category.id && (
                                        <div
                                            className="absolute inset-0 border border-white/20 bg-black/40 backdrop-blur-sm group-hover:border-glow-cyan/50 transition-colors"
                                            style={{
                                                clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                            }}
                                        />
                                    )}

                                    {/* Content */}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {categoryIcons[category.id]}
                                        {category.label}
                                    </span>
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
                                        <div className="glitch-container rounded-lg h-full group border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 relative overflow-hidden">
                                            {/* Event Image */}
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                                {/* Price Badge */}
                                                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm border border-glow-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                                    <span className="text-lg font-heading font-black text-glow-cyan">₹{event.price}</span>
                                                </div>

                                                {/* Category Badge */}
                                                <div className={`absolute bottom-3 left-3 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-gradient-to-r ${categoryColors[event.category]} text-white`}>
                                                    {event.category}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 sm:p-5">
                                                {/* Corner accents */}
                                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                                <h3 className={`text-lg sm:text-xl font-heading font-bold mb-2 ${categoryShimmerClasses[event.category]} group-hover:text-glow-cyan transition-colors`}>
                                                    {event.title}
                                                </h3>
                                                <p className="text-text-secondary text-xs sm:text-sm mb-4 line-clamp-2 font-mono">
                                                    {event.description}
                                                </p>
                                                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                                                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{event.date}</span>
                                                    <span className="text-sm font-cyber font-bold text-glow-violet tracking-widest">{event.prize}</span>
                                                </div>
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
