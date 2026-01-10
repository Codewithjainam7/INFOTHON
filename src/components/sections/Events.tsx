'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, GlowButton, NeonText } from '@/components/ui'
import { events, eventCategories, type Event } from '@/data'
import Link from 'next/link'

const categoryColors: Record<string, string> = {
    coding: 'from-blue-500 to-cyan-500',
    ai: 'from-purple-500 to-pink-500',
    robotics: 'from-orange-500 to-red-500',
    design: 'from-green-500 to-teal-500',
    gaming: 'from-yellow-500 to-orange-500',
    workshop: 'from-indigo-500 to-purple-500',
}

export function Events() {
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
        <section id="events" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/30 to-bg-primary" />

            <div className="relative z-10 section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                        EVENTS
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                        Competitions & Challenges
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Push your limits, showcase your skills, and compete for glory.
                    </p>
                </motion.div>

                {/* Search & Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-5 py-3 pl-12 rounded-xl glass bg-bg-secondary/50 border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan/50 focus:shadow-glow-sm transition-all"
                            />
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {eventCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                                        ? 'bg-glow-cyan/20 text-glow-cyan border border-glow-cyan/50 shadow-glow-sm'
                                        : 'glass text-text-secondary hover:text-white hover:border-white/30'
                                    }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Events Grid */}
                <motion.div
                    layout
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
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
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* No Results */}
                {filteredEvents.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <p className="text-text-muted text-lg">No events found matching your criteria.</p>
                    </motion.div>
                )}

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link href="/events">
                        <GlowButton variant="secondary" size="lg">
                            View All Events
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </GlowButton>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

function EventCard({ event }: { event: Event }) {
    return (
        <Link href={`/events/${event.id}`}>
            <GlassCard className="h-full group cursor-pointer overflow-hidden" glowColor="cyan">
                {/* Category Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white mb-4`}>
                    {event.category}
                </div>

                {/* Title */}
                <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-glow-cyan transition-colors">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
                    {event.description}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.teamSize}
                    </div>
                </div>

                {/* Prize */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-text-muted">Prize Pool</span>
                        <span className="text-lg font-heading font-bold gradient-text">{event.prize}</span>
                    </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-glow-cyan/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-glow-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </GlassCard>
        </Link>
    )
}

export default Events
