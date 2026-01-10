'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard } from '@/components/ui'
import { Footer } from '@/components/sections'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

// Event data with pricing
const eventPackages = [
    {
        id: 'code-sprint',
        title: 'Code Sprint',
        category: 'CODING',
        description: '24-hour competitive programming challenge',
        price: 499,
        originalPrice: 699,
        teamSize: '2-3 members',
        date: 'Feb 12, 2026',
        features: ['24hr Challenge', 'Mentorship', 'Certificates', 'Swag Kit'],
        color: 'cyan',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
        )
    },
    {
        id: 'neural-nexus',
        title: 'Neural Nexus',
        category: 'AI/ML',
        description: '36-hour ML hackathon with real datasets',
        price: 599,
        originalPrice: 849,
        teamSize: '3-4 members',
        date: 'Feb 12-13, 2026',
        features: ['Cloud Credits', 'Industry Mentors', 'Job Referrals', 'Swag Kit'],
        color: 'violet',
        popular: true,
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
        )
    },
    {
        id: 'robo-wars',
        title: 'Robo Wars',
        category: 'ROBOTICS',
        description: 'Combat robot arena showdown',
        price: 799,
        originalPrice: 1099,
        teamSize: '4-6 members',
        date: 'Feb 13, 2026',
        features: ['Arena Access', 'Safety Gear', 'Tools Provided', 'Trophies'],
        color: 'orange',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
        )
    },
    {
        id: 'pixel-perfect',
        title: 'Pixel Perfect',
        category: 'DESIGN',
        description: 'UI/UX design competition',
        price: 349,
        originalPrice: 499,
        teamSize: '1-2 members',
        date: 'Feb 12, 2026',
        features: ['Design Tools', 'Portfolio Review', 'Mentorship', 'Certificates'],
        color: 'pink',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        )
    },
    {
        id: 'cyber-siege',
        title: 'Cyber Siege',
        category: 'GAMING',
        description: 'Esports tournament - Valorant, CS2',
        price: 449,
        originalPrice: 599,
        teamSize: '5 members',
        date: 'Feb 12-13, 2026',
        features: ['Pro Setups', 'Live Stream', 'Prize Pool', 'Merchandise'],
        color: 'green',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
            </svg>
        )
    },
    {
        id: 'quantum-workshop',
        title: 'Quantum 101',
        category: 'WORKSHOP',
        description: 'Hands-on quantum computing workshop',
        price: 299,
        originalPrice: 449,
        teamSize: 'Individual',
        date: 'Feb 12, 2026',
        features: ['IBM Qiskit', 'Certificate', 'Materials', 'Swag Kit'],
        color: 'blue',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        )
    }
]

const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: { bg: 'bg-glow-cyan/10', border: 'border-glow-cyan/30', text: 'text-glow-cyan', glow: 'shadow-[0_0_30px_rgba(0,245,255,0.3)]' },
    violet: { bg: 'bg-glow-violet/10', border: 'border-glow-violet/30', text: 'text-glow-violet', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
}

export default function RegisterPage() {
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [isSignedUp, setIsSignedUp] = useState(false)
    const [showCart, setShowCart] = useState(false)

    useEffect(() => {
        // Check if user is signed up
        const user = localStorage.getItem('infothon_user')
        if (user) {
            setIsSignedUp(true)
        }
    }, [])

    const toggleEvent = (eventId: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        )
    }

    const totalPrice = selectedEvents.reduce((sum, id) => {
        const event = eventPackages.find(e => e.id === id)
        return sum + (event?.price || 0)
    }, 0)

    const totalSavings = selectedEvents.reduce((sum, id) => {
        const event = eventPackages.find(e => e.id === id)
        return sum + ((event?.originalPrice || 0) - (event?.price || 0))
    }, 0)

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg5.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-28 pb-20">
                <div className="section-container px-4 sm:px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block mb-4"
                        >
                            <div className="glass px-4 py-2 rounded-full">
                                <span className="font-mono text-xs text-glow-cyan tracking-wider">
                                    // SELECT_YOUR_EVENTS
                                </span>
                            </div>
                        </motion.div>

                        <NeonText as="h1" color="gradient" className="text-3xl sm:text-4xl md:text-6xl mb-4">
                            Register for Events
                        </NeonText>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Choose your battles. Each event has unique challenges and prizes.
                            Early bird pricing ends soon!
                        </p>
                    </motion.div>

                    {/* Sign Up Prompt */}
                    {!isSignedUp && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto mb-10"
                        >
                            <GlassCard className="p-6 border-yellow-500/30" glowColor="cyan">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-heading font-semibold text-white mb-1">Sign Up Required</h3>
                                        <p className="text-text-muted text-sm">Create an account before registering for events</p>
                                    </div>
                                    <Link href="/signup">
                                        <GlowButton size="sm">
                                            Sign Up Now
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </GlowButton>
                                    </Link>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Event Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
                        {eventPackages.map((event, index) => {
                            const colors = colorMap[event.color]
                            const isSelected = selectedEvents.includes(event.id)

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        className={`relative group cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected
                                                ? `${colors.border} ${colors.glow}`
                                                : 'border-white/10 hover:border-white/20'
                                            }`}
                                        onClick={() => isSignedUp && toggleEvent(event.id)}
                                    >
                                        {/* Popular Badge */}
                                        {event.popular && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-glow-violet to-glow-cyan text-xs font-bold text-white">
                                                    POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Card Content */}
                                        <div className="bg-bg-secondary/80 backdrop-blur-sm p-6">
                                            {/* Header */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text}`}>
                                                    {event.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`text-xs font-mono ${colors.text} tracking-wider`}>
                                                        {event.category}
                                                    </span>
                                                    <h3 className="text-lg font-heading font-bold text-white">
                                                        {event.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                                {event.description}
                                            </p>

                                            {/* Details */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-text-muted">
                                                    {event.teamSize}
                                                </span>
                                                <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-text-muted">
                                                    {event.date}
                                                </span>
                                            </div>

                                            {/* Features */}
                                            <div className="grid grid-cols-2 gap-2 mb-6">
                                                {event.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                                                        <svg className={`w-3 h-3 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-end justify-between pt-4 border-t border-white/10">
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className={`text-2xl font-heading font-bold ${colors.text}`}>
                                                            ₹{event.price}
                                                        </span>
                                                        <span className="text-sm text-text-muted line-through">
                                                            ₹{event.originalPrice}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-green-400">
                                                        Save ₹{event.originalPrice - event.price}
                                                    </span>
                                                </div>

                                                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                                                        ? `${colors.bg} ${colors.border}`
                                                        : 'border-white/20'
                                                    }`}>
                                                    {isSelected && (
                                                        <motion.svg
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className={`w-5 h-5 ${colors.text}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </motion.svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glitch Effect on Hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Floating Cart */}
                    <AnimatePresence>
                        {selectedEvents.length > 0 && isSignedUp && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                            >
                                <GlassCard className="px-6 py-4 flex items-center gap-6" glowColor="cyan">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-glow-cyan/20 flex items-center justify-center text-glow-cyan font-bold">
                                            {selectedEvents.length}
                                        </div>
                                        <div>
                                            <div className="text-sm text-text-muted">Selected Events</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-heading font-bold text-white">₹{totalPrice}</span>
                                                {totalSavings > 0 && (
                                                    <span className="text-xs text-green-400">Save ₹{totalSavings}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <GlowButton size="lg">
                                        Proceed to Pay
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </GlowButton>
                                </GlassCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
