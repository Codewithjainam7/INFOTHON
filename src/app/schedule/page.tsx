'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlassCard, NeonText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { schedule, type ScheduleItem } from '@/data'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const typeColors: Record<string, string> = {
    event: 'bg-glow-cyan/20 text-glow-cyan border-glow-cyan/30',
    ceremony: 'bg-glow-violet/20 text-glow-violet border-glow-violet/30',
    break: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    workshop: 'bg-green-500/20 text-green-400 border-green-500/30',
    talk: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

// SVG Icons for schedule types
const TypeIcons: Record<string, React.FC<{ className?: string }>> = {
    event: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516" />
        </svg>
    ),
    ceremony: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
    ),
    break: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12" />
        </svg>
    ),
    workshop: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
    ),
    talk: ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
    ),
}

const LocationIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
)

export default function SchedulePage() {
    const [activeDay, setActiveDay] = useState(1)
    const currentDaySchedule = schedule.find((day) => day.day === activeDay)

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg3.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                            SCHEDULE
                        </span>
                        <NeonText as="h1" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                            Two Days of Innovation
                        </NeonText>
                        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                            Plan your journey through the most action-packed tech weekend of the year.
                        </p>
                    </motion.div>

                    {/* Day Switcher */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2"
                    >
                        {schedule.slice(0, 2).map((day) => (
                            <button
                                key={day.day}
                                onClick={() => setActiveDay(day.day)}
                                className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl transition-all group ${activeDay === day.day
                                    ? 'glass border-glow-cyan/50 shadow-glow-sm'
                                    : 'glass-light hover:border-white/30'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className={`text-xl sm:text-2xl font-heading font-bold mb-1 ${activeDay === day.day ? 'text-glow-cyan' : 'text-white group-hover:text-glow-cyan'
                                        } transition-colors`}>
                                        Day {day.day}
                                    </div>
                                    <div className="text-xs text-text-muted">{day.date}</div>
                                </div>

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
                            <h3 className="text-xl sm:text-2xl font-heading font-semibold gradient-text">
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
                            className="max-w-3xl mx-auto"
                        >
                            <div className="relative">
                                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-glow-cyan via-glow-violet to-glow-cyan opacity-30" />

                                <div className="space-y-3 sm:space-y-4">
                                    {currentDaySchedule?.items.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ScheduleCard item={item} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}

function ScheduleCard({ item }: { item: ScheduleItem }) {
    const IconComponent = TypeIcons[item.type] || TypeIcons.event

    return (
        <div className="flex gap-3 sm:gap-4 group">
            {/* Time Marker */}
            <div className="flex-shrink-0 w-12 sm:w-16 text-right">
                <div className="relative">
                    <div className="absolute right-[-18px] sm:right-[-24px] top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-bg-primary border-2 border-glow-cyan group-hover:bg-glow-cyan/20 transition-colors" />
                    <span className="font-mono text-xs sm:text-sm text-text-muted group-hover:text-glow-cyan transition-colors">
                        {item.time}
                    </span>
                </div>
            </div>

            {/* Content Card */}
            <GlassCard className="flex-1 ml-3 sm:ml-4" glowColor="cyan" hover3D={false}>
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 text-glow-cyan flex-shrink-0">
                        <IconComponent className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-sm sm:text-base font-heading font-semibold group-hover:text-glow-cyan transition-colors">
                                {item.title}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs border ${typeColors[item.type]}`}>
                                {item.type}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm text-text-secondary mb-2 line-clamp-2">{item.description}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1">
                            <LocationIcon className="w-3 h-3" />
                            {item.venue}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}
