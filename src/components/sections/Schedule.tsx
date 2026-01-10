'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard, NeonText } from '@/components/ui'
import { schedule, type ScheduleItem } from '@/data'

const typeColors: Record<string, string> = {
    event: 'bg-glow-cyan/20 text-glow-cyan border-glow-cyan/30',
    ceremony: 'bg-glow-violet/20 text-glow-violet border-glow-violet/30',
    break: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    workshop: 'bg-green-500/20 text-green-400 border-green-500/30',
    talk: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const typeIcons: Record<string, string> = {
    event: '🏆',
    ceremony: '✨',
    break: '☕',
    workshop: '🔧',
    talk: '🎤',
}

export function Schedule() {
    const [activeDay, setActiveDay] = useState(1)

    const currentDaySchedule = schedule.find((day) => day.day === activeDay)

    return (
        <section id="schedule" className="relative py-32 overflow-hidden">
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
                        SCHEDULE
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                        Three Days of Innovation
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Plan your journey through the most action-packed tech weekend of the year.
                    </p>
                </motion.div>

                {/* Day Switcher */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center gap-4 mb-12"
                >
                    {schedule.map((day) => (
                        <button
                            key={day.day}
                            onClick={() => setActiveDay(day.day)}
                            className={`relative px-6 py-4 rounded-xl transition-all duration-300 group ${activeDay === day.day
                                    ? 'glass border-glow-cyan/50 shadow-glow-sm'
                                    : 'glass-light hover:border-white/30'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`text-2xl font-heading font-bold mb-1 ${activeDay === day.day ? 'text-glow-cyan' : 'text-white group-hover:text-glow-cyan'
                                    } transition-colors`}>
                                    Day {day.day}
                                </div>
                                <div className="text-xs text-text-muted">{day.date}</div>
                            </div>

                            {/* Active Indicator */}
                            {activeDay === day.day && (
                                <motion.div
                                    layoutId="activeDay"
                                    className="absolute inset-0 rounded-xl border-2 border-glow-cyan/50"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Day Label */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDay}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center mb-8"
                    >
                        <h3 className="text-2xl font-heading font-semibold gradient-text">
                            {currentDaySchedule?.label}
                        </h3>
                    </motion.div>
                </AnimatePresence>

                {/* Timeline */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeDay}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan opacity-30" />

                            {/* Schedule Items */}
                            <div className="space-y-4">
                                {currentDaySchedule?.items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <ScheduleCard item={item} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
    return (
        <div className="flex gap-4 group">
            {/* Time Marker */}
            <div className="flex-shrink-0 w-16 text-right">
                <div className="relative">
                    {/* Dot */}
                    <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-bg-primary border-2 border-glow-cyan group-hover:bg-glow-cyan/20 transition-colors" />

                    <span className="font-mono text-sm text-text-muted group-hover:text-glow-cyan transition-colors">
                        {item.time}
                    </span>
                </div>
            </div>

            {/* Content Card */}
            <GlassCard className="flex-1 ml-4" glowColor="cyan" hover3D={false}>
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <span className="text-2xl">{typeIcons[item.type]}</span>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-heading font-semibold group-hover:text-glow-cyan transition-colors">
                                {item.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${typeColors[item.type]}`}>
                                {item.type}
                            </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{item.description}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.venue}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}

export default Schedule
