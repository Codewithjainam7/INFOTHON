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
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
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

    // Filter Logic
    const categories = ['ALL', ...Array.from(new Set(eventPackages.map(e => e.category)))]
    const filteredEvents = selectedCategory === 'ALL'
        ? eventPackages
        : eventPackages.filter(e => e.category === selectedCategory)

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
                        <p className="text-text-secondary max-w-2xl mx-auto font-cyber text-glow-cyan/70 tracking-wide text-sm sm:text-base">
                            Choose your battles. Each event has unique challenges and prizes.
                            Early bird pricing ends soon!
                        </p>
                    </motion.div>

                    {/* Category Filter - Cyber Command Deck */}
                    <div className="sticky top-24 z-30 mb-12 flex justify-center px-4">
                        <div className="relative p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] overflow-hidden">
                            {/* Animated Background Scanline */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glow-cyan/5 to-transparent skew-x-12 translate-x-[-150%] animate-[scan_4s_linear_infinite]" />

                            {/* Inner Border */}
                            <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />

                            <div className="flex flex-wrap justify-center gap-2 relative z-10">
                                {categories.map((cat) => {
                                    const isSelected = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`
                                                relative px-6 py-2.5 rounded-xl font-cyber text-xs tracking-[0.15em] transition-all duration-300 overflow-hidden group
                                                ${isSelected
                                                    ? 'bg-glow-cyan text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                                                    : 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                                }
                                            `}
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {/* Glitch Dot Indicator */}
                                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-black' : 'bg-glow-cyan/50 group-hover:bg-glow-cyan'}`} />
                                                {cat}
                                            </span>

                                            {/* Hover Glitch Effect */}
                                            {!isSelected && (
                                                <span className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

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
                        {filteredEvents.map((event, index) => {
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

                                            {/* Details Link Button */}
                                            <Link
                                                href={`/events/${event.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="absolute top-4 left-4 z-20 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-glow-cyan hover:text-black hover:border-glow-cyan transition-all group/info"
                                            >
                                                <svg className="w-4 h-4 text-white group-hover/info:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </Link>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className={`text-xl font-heading font-black mb-1 group-hover:translate-x-1 transition-transform ${isSelected ? 'text-white' : 'text-gray-100'}`}>
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-sm text-text-muted line-clamp-2 font-mono">{event.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold font-mono ${isSelected ? 'text-glow-cyan' : 'text-white'}`}>₹{event.price}</div>
                                                    {event.originalPrice > event.price && (
                                                        <div className="text-xs text-text-muted line-through">₹{event.originalPrice}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features */}
                                            {/* Features */}
                                            <div className="space-y-2 mb-6 flex-grow">
                                                {event.features.slice(0, 3).map((feature, i) => (
                                                    <div key={i} className="flex items-center text-xs text-text-secondary/80">
                                                        {/* Fixed Bullet Point */}
                                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isSelected ? 'bg-glow-cyan' : 'bg-gray-500'}`} />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Selection Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (isSignedUp) toggleEvent(event.id);
                                                }}
                                                className={`w-full py-3 rounded-xl font-bold font-cyber tracking-wider text-sm transition-all flex items-center justify-center gap-2 ${isSelected
                                                    ? 'bg-glow-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                                                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-glow-cyan/50'
                                                    }`}
                                            >
                                                {isSelected ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        SELECTED
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-4 h-4" />
                                                        SELECT EVENT
                                                    </>
                                                )}
                                            </button>

                                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse pointer-events-none" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Floating Cart - Improved Popup / Docked Bar */}
                    <AnimatePresence>
                        {selectedEvents.length > 0 && isSignedUp && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-center pointer-events-none"
                            >
                                {/* Glass Panel - Docked Bottom Bar */}
                                <div className="pointer-events-auto w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-glow-cyan/50 shadow-[0_0_50px_rgba(34,211,238,0.2)] rounded-2xl overflow-hidden relative group">

                                    {/* Animated Scanline & Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glow-cyan/10 to-transparent translate-x-[-100%] animate-[scan_3s_linear_infinite]" />
                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-glow-cyan to-transparent opacity-50" />

                                    <div className="p-4 sm:px-8 sm:py-5 flex items-center justify-between gap-6">

                                        {/* Left Side: Count & Total */}
                                        <div className="flex items-center gap-6">
                                            {/* Counter Badge */}
                                            <div className="relative hidden sm:block">
                                                <div className="w-14 h-14 rounded-xl bg-glow-cyan/10 border border-glow-cyan/30 flex items-center justify-center group-hover:border-glow-cyan transition-colors">
                                                    <span className="font-heading font-black text-2xl text-glow-cyan">{selectedEvents.length}</span>
                                                </div>
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-cyber tracking-[0.2em] text-glow-cyan/70 uppercase mb-1">Total Payable</span>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-3xl font-heading font-bold text-white tracking-tight">₹{totalPrice}</span>
                                                    {totalSavings > 0 && (
                                                        <span className="text-sm text-green-400 font-mono line-through opacity-60">₹{totalPrice + totalSavings}</span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-text-muted hidden sm:block">
                                                    {selectedEvents.length} Event{selectedEvents.length > 1 ? 's' : ''} Selected
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Button */}
                                        <GlowButton className="whitespace-nowrap shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] px-8 py-4 text-lg">
                                            <span className="hidden sm:inline tracking-widest font-bold">PROCEED TO PAYMENT</span>
                                            <span className="sm:hidden font-bold">PAY ₹{totalPrice}</span>
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
