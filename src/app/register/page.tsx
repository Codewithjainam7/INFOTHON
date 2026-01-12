'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Plus } from 'lucide-react'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { createClient } from '@/lib/supabase'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

import { eventPackages, colorMap } from '@/data'

export default function RegisterPage() {
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [isSignedUp, setIsSignedUp] = useState(false)
    const [showCart, setShowCart] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                setIsSignedUp(true)
            } else {
                // Fallback to local storage if needed, or clear it if session is invalid
                const user = localStorage.getItem('infothon_user')
                if (user) setIsSignedUp(true)
            }
        }

        checkUser()

        // Load saved selections
        const saved = localStorage.getItem('infothon_registrations')
        if (saved) {
            setSelectedEvents(JSON.parse(saved))
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
                        className="flex flex-col items-center justify-center mb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="px-4 py-1.5 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                <span className="font-cyber text-xs text-glow-cyan tracking-widest">
                                    SELECT_YOUR_EVENTS
                                </span>
                            </div>
                        </motion.div>

                        {/* Glitch Title */}
                        <div className="relative inline-block mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                <ScrambleText
                                    text="Register for Events"
                                    revealSpeed={50}
                                    scrambleSpeed={30}
                                    delay={300}
                                />
                            </h1>
                            {/* Glitch layer - Cyan offset */}
                            <motion.h1
                                className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
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
                                Register for Events
                            </motion.h1>

                            {/* Glitch layer - Violet offset */}
                            <motion.h1
                                className="absolute inset-0 text-3xl sm:text-4xl md:text-6xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
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
                                Register for Events
                            </motion.h1>
                        </div>
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
                                    layout
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className={`glitch-container group cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden h-full flex flex-col relative ${isSelected
                                            ? `border-2 ${colors.border} shadow-[0_0_30px_rgba(0,245,255,0.2)] bg-black/80`
                                            : 'border border-white/10 hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] bg-black/40 backdrop-blur-md'
                                            }`}
                                        onClick={() => isSignedUp && toggleEvent(event.id)}
                                    >
                                        {/* Active Glitch Hover Effect - Border Glow Pulse (From About Page) */}
                                        <motion.div
                                            className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-2xl pointer-events-none z-20"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />

                                        {/* Corner accents */}
                                        <div className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 ${isSelected ? 'border-glow-cyan' : 'border-white/20 group-hover:border-glow-cyan/60'} transition-colors z-20`} />
                                        <div className={`absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 ${isSelected ? 'border-glow-cyan' : 'border-white/20 group-hover:border-glow-cyan/60'} transition-colors z-20`} />
                                        <div className={`absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 ${isSelected ? 'border-glow-cyan' : 'border-white/20 group-hover:border-glow-cyan/60'} transition-colors z-20`} />
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 ${isSelected ? 'border-glow-cyan' : 'border-white/20 group-hover:border-glow-cyan/60'} transition-colors z-20`} />

                                        {/* Image Container with About Page Styling */}
                                        <div className="relative h-48 w-full shrink-0 overflow-hidden border-b border-white/10">
                                            {/* Image Inner Border/Effect */}
                                            <div className="absolute inset-0 pointer-events-none z-10 box-border border-b border-white/5" />

                                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10`} />

                                            {event.image ? (
                                                <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
                                                    {/* Use generic image if available */}
                                                    <Image
                                                        src={event.image}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-full h-full ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                                    {event.icon}
                                                </div>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className={`text-[10px] font-cyber tracking-widest px-3 py-1 bg-black/60 backdrop-blur-md border ${colors.border} rounded-full ${colors.text}`}>
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className={`text-xl font-heading font-black mb-1 group-hover:translate-x-1 transition-transform ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-sm text-text-muted line-clamp-2">{event.description}</p>
                                                </div>
                                            </div>

                                            {/* Features */}
                                            <div className="space-y-2 mb-6 flex-grow">
                                                {event.features.slice(0, 3).map((feature, i) => (
                                                    <div key={i} className="flex items-center text-xs text-text-secondary/80">
                                                        <div className={`w-1 h-1 rounded-full ${colors.bg.replace('/10', '')} mr-2`} />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>

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
                                className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-auto max-w-xl"
                            >
                                {/* Cyberpunk styled cart with corner accents */}
                                <div className="relative">
                                    {/* Corner accents */}
                                    <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-glow-cyan" />
                                    <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-glow-violet" />
                                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-glow-violet" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-glow-cyan" />

                                    {/* Glitch border animation */}
                                    <motion.div
                                        className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none"
                                        animate={{ borderColor: ['rgba(0,245,255,0.3)', 'rgba(139,92,246,0.3)', 'rgba(0,245,255,0.3)'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    />

                                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sm:justify-start gap-3 sm:gap-6 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,245,255,0.15)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-glow-cyan/30 to-glow-violet/30 border border-glow-cyan/50 flex items-center justify-center text-glow-cyan font-bold text-sm sm:text-base shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                                                {selectedEvents.length}
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm text-glow-cyan/70 hidden sm:block font-mono tracking-wider">// SELECTED_EVENTS</div>
                                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                                                    <span className="text-lg sm:text-xl font-heading font-bold text-white">₹{totalPrice}</span>
                                                    {totalSavings > 0 && (
                                                        <span className="text-[10px] sm:text-xs text-green-400 font-mono">SAVE ₹{totalSavings}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <GlowButton size="sm" className="sm:text-base">
                                            <span className="hidden sm:inline">Proceed to Pay</span>
                                            <span className="sm:hidden">Pay Now</span>
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </GlowButton>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main >

            <Footer />
        </SmoothScroll >
    )
}
