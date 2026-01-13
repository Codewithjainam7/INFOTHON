'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { NeonText, GlassCard, GlowButton, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { eventPackages, colorMap } from '@/data'
import { Calendar, Clock, MapPin, QrCode, Ticket, User, Download, Share2, Edit2, Check } from 'lucide-react'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const avatars = [
    '/images/new_avatar_1.png',
    '/images/new_avatar_2.png',
    '/images/new_avatar_3.png',
    '/images/new_avatar_4.png',
    '/images/new_avatar_5.png',
    '/images/new_avatar_6.png',
    '/images/new_avatar_7.png',
    '/images/new_avatar_8.png',
    '/images/new_avatar_9.png',
    '/images/new_avatar_10.png',
    '/images/boy_avatar_1.325Z.png',
    '/images/girl_avatar_1.851Z.png',
    '/images/boy_avatar_2.325Z.png',
    '/images/girl_avatar_2.851Z.png',
]

import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

export default function ProfilePage() {
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])
    const [purchasedEvents, setPurchasedEvents] = useState<string[]>([])
    const [user, setUser] = useState<{ name: string; email: string; phone: string; college: string; cc: string } | null>(null)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [showAvatarSelection, setShowAvatarSelection] = useState(false)

    // Edit states
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [editName, setEditName] = useState('')
    const [editCollege, setEditCollege] = useState('')
    const [editCC, setEditCC] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser({
                    name: user.user_metadata.full_name || 'Cyber Nomad',
                    email: user.email || '',
                    phone: user.user_metadata.phone || '',
                    college: user.user_metadata.college || '',
                    cc: user.user_metadata.cc || ''
                })
                setEditName(user.user_metadata.full_name || '')
                setEditCollege(user.user_metadata.college || '')
                setEditCC(user.user_metadata.cc || '')
            } else {
                // Fallback to local storage for demo/testing without backend
                const userData = localStorage.getItem('infothon_user')
                if (userData) {
                    const parsed = JSON.parse(userData)
                    setUser({ ...parsed, phone: '', college: '', cc: '' })
                } else {
                    router.push('/login')
                }
            }
        }
        getUser()

        // Load purchased events from Supabase user_metadata
        const loadEvents = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.user_metadata?.purchased_events) {
                setPurchasedEvents(user.user_metadata.purchased_events)
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem('infothon_purchased')
                if (saved) {
                    setPurchasedEvents(JSON.parse(saved))
                }
            }
        }
        loadEvents()

        // Load avatar from Supabase or localStorage
        const loadAvatar = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.user_metadata?.avatar) {
                setSelectedAvatar(user.user_metadata.avatar)
            } else {
                const savedAvatar = localStorage.getItem('infothon_avatar')
                if (savedAvatar) {
                    setSelectedAvatar(savedAvatar)
                } else {
                    setShowAvatarSelection(true)
                }
            }
        }
        loadAvatar()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('infothon_user') // Clear local fallback
        router.push('/')
        router.refresh()
    }

    const handleAvatarSelect = async (avatar: string) => {
        setSelectedAvatar(avatar)
        setShowAvatarSelection(false)

        // Save to Supabase
        await supabase.auth.updateUser({
            data: { avatar }
        })

        // Also save to localStorage as backup
        localStorage.setItem('infothon_avatar', avatar)
    }

    const handleSaveProfile = async () => {
        setIsSaving(true)
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: editName,
                college: editCollege,
                cc: editCC
            }
        })

        if (!error && user) {
            setUser({
                ...user,
                name: editName,
                college: editCollege,
                cc: editCC
            })
            setShowEditProfile(false)
        }
        setIsSaving(false)
    }

    const myTickets = eventPackages.filter(pkg => purchasedEvents.includes(pkg.id))

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg2.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-28 pb-20">
                <div className="section-container px-4 sm:px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                {/* Avatar Section with Glitch Frame */}
                                <div className="relative group">
                                    {/* Outer Hexagon Frame */}
                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                                        {/* Corner Accents */}
                                        <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-glow-cyan z-20" />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 border-r-2 border-t-2 border-glow-violet z-20" />
                                        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-l-2 border-b-2 border-glow-violet z-20" />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-glow-cyan z-20" />

                                        {/* Animated Glow Ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl"
                                            animate={{
                                                boxShadow: [
                                                    '0 0 20px rgba(0,245,255,0.3), inset 0 0 15px rgba(0,245,255,0.1)',
                                                    '0 0 40px rgba(0,245,255,0.5), inset 0 0 25px rgba(139,92,246,0.2)',
                                                    '0 0 20px rgba(139,92,246,0.3), inset 0 0 15px rgba(139,92,246,0.1)',
                                                    '0 0 20px rgba(0,245,255,0.3), inset 0 0 15px rgba(0,245,255,0.1)',
                                                ]
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />

                                        {/* Main Container */}
                                        <div className="absolute inset-0 rounded-2xl p-1 bg-gradient-to-br from-glow-cyan via-glow-violet to-glow-cyan overflow-hidden">
                                            <div className="w-full h-full rounded-xl bg-black overflow-hidden relative">
                                                {selectedAvatar ? (
                                                    <Image
                                                        src={selectedAvatar}
                                                        alt="Profile Avatar"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                        <User className="w-12 h-12 text-white/50" />
                                                    </div>
                                                )}

                                                {/* Scanline overlay */}
                                                <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                                                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.05) 2px, rgba(0,245,255,0.05) 4px)'
                                                }} />
                                            </div>
                                        </div>

                                        {/* Glitch Copies */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl border-2 border-[#00f0ff] opacity-0 pointer-events-none"
                                            animate={{ x: [-3, 3, -2, 0], opacity: [0, 0.6, 0, 0.4, 0] }}
                                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
                                        />
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl border-2 border-[#8b5cf6] opacity-0 pointer-events-none"
                                            animate={{ x: [3, -3, 2, 0], opacity: [0, 0.5, 0, 0.3, 0] }}
                                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                    </div>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                                        className="absolute -bottom-1 -right-1 z-30 p-2.5 rounded-xl bg-black border-2 border-glow-cyan text-glow-cyan shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:bg-glow-cyan hover:text-black hover:shadow-[0_0_25px_rgba(0,245,255,0.5)] transition-all cursor-pointer"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <span className="inline-block px-4 py-1 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm text-xs font-cyber text-glow-cyan tracking-widest">
                                        OPERATIVE_STATUS: ACTIVE
                                    </span>
                                    {/* Glitch Username */}
                                    <div className="relative inline-block">
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] mb-2">
                                            <ScrambleText
                                                text={user?.name || 'Guest User'}
                                                revealSpeed={50}
                                                scrambleSpeed={30}
                                                delay={300}
                                            />
                                        </h1>
                                        <motion.h1
                                            className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
                                            style={{ opacity: 0 }}
                                            animate={{ x: [0, -5, 3, -4, 0], opacity: [0, 0.8, 0, 0.6, 0] }}
                                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                                        >
                                            {user?.name || 'Guest User'}
                                        </motion.h1>
                                        <motion.h1
                                            className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
                                            style={{ opacity: 0 }}
                                            animate={{ x: [0, 5, -3, 4, 0], opacity: [0, 0.7, 0, 0.5, 0] }}
                                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
                                        >
                                            {user?.name || 'Guest User'}
                                        </motion.h1>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary font-mono text-sm">
                                        <span>{user?.email || 'Not logged in'}</span>
                                    </div>
                                    {user?.phone && (
                                        <div className="flex items-center gap-2 text-text-muted font-mono text-xs mt-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                            </svg>
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                    {user?.college && (
                                        <div className="flex items-center gap-2 text-text-muted font-mono text-xs mt-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                            </svg>
                                            <span>{user.college}</span>
                                            {user.cc && <span className="text-glow-cyan">• CC: {user.cc}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <GlowButton onClick={() => setShowEditProfile(!showEditProfile)} size="sm">
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Edit Profile
                                </GlowButton>
                                <GlowButton onClick={handleSignOut} className="border-red-500/50 hover:bg-red-500/20 text-red-400">
                                    Sign Out
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </GlowButton>
                            </div>
                        </div>

                        {/* Edit Profile Panel */}
                        <AnimatePresence>
                            {showEditProfile && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="relative z-50"
                                >
                                    <div className="glitch-container rounded-xl p-6 sm:p-8 relative group border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-glow-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                        <motion.div
                                            className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-xl pointer-events-none z-0"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-glow-cyan/60 z-10" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-glow-violet/60 z-10" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-glow-violet/60 z-10" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-glow-cyan/60 z-10" />

                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2 relative z-20">
                                            <Edit2 className="w-5 h-5 text-glow-cyan" />
                                            Edit Profile
                                        </h3>

                                        <div className="space-y-4 relative z-20">
                                            <div>
                                                <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">Name</label>
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 font-mono text-sm"
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">College / Institution</label>
                                                <input
                                                    type="text"
                                                    value={editCollege}
                                                    onChange={(e) => setEditCollege(e.target.value)}
                                                    className="w-full bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 font-mono text-sm"
                                                    placeholder="Your college name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">Contingent Code</label>
                                                <input
                                                    type="text"
                                                    value={editCC}
                                                    onChange={(e) => setEditCC(e.target.value)}
                                                    className="w-full bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 font-mono text-sm"
                                                    placeholder="Enter CC code (optional)"
                                                />
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <GlowButton onClick={handleSaveProfile} disabled={isSaving}>
                                                    {isSaving ? (
                                                        <>
                                                            <motion.div
                                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </GlowButton>
                                                <button
                                                    onClick={() => setShowEditProfile(false)}
                                                    className="px-4 py-2 rounded-lg border border-white/20 text-text-muted hover:bg-white/10 transition-colors font-mono text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Avatar Selection Panel */}
                        <AnimatePresence>
                            {showAvatarSelection && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="relative z-50"
                                >
                                    <div className="glitch-container rounded-xl p-6 sm:p-8 relative group border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-glow-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                        {/* Active Glitch Hover Effect - Border Glow Pulse */}
                                        <motion.div
                                            className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-xl pointer-events-none z-0"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />

                                        {/* Corner accents */}
                                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-glow-cyan/60 z-10" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-glow-violet/60 z-10" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-glow-violet/60 z-10" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-glow-cyan/60 z-10" />

                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2 relative z-20">
                                            <User className="w-5 h-5 text-glow-cyan" />
                                            Choose Your Avatar
                                        </h3>
                                        <div className="flex flex-wrap gap-4 md:gap-8 justify-center sm:justify-start relative z-20">
                                            {avatars.map((avatar, index) => (
                                                <motion.button
                                                    key={index}
                                                    type="button"
                                                    whileHover={{ scale: 1.1, zIndex: 60 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent propagation
                                                        handleAvatarSelect(avatar);
                                                    }}
                                                    className={`relative cursor-pointer w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all outline-none focus:outline-none ${selectedAvatar === avatar
                                                        ? 'bg-gradient-to-r from-glow-cyan to-white shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                                                        : 'bg-white/10 hover:bg-white/30'
                                                        }`}
                                                >
                                                    <div className="w-full h-full rounded-full overflow-hidden relative bg-black pointer-events-none">
                                                        <Image
                                                            src={avatar}
                                                            alt={`Avatar ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    {selectedAvatar === avatar && (
                                                        <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-glow-cyan text-black flex items-center justify-center border-2 border-black z-50 pointer-events-none">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <StatCard label="Events Registered" value={myTickets.length.toString()} icon={<Ticket />} delay={0.1} />
                        <StatCard label="Total Spent" value={`₹${myTickets.reduce((sum, e) => sum + e.price, 0)}`} icon={<Download />} delay={0.2} />
                        <StatCard label="Workshops" value={myTickets.filter(e => e.category === 'WORKSHOP').length.toString()} icon={<Calendar />} delay={0.3} />
                        <StatCard label="Certificates" value="0" icon={<Share2 />} delay={0.4} />
                    </div>

                    {/* Tickets Section */}
                    <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                        <span className="text-glow-cyan">///</span> My Tickets
                    </h2>

                    {myTickets.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myTickets.map((ticket, index) => (
                                <TicketCard key={ticket.id} event={ticket} index={index} userName={user?.name || 'Guest'} />
                            ))}
                        </div>
                    ) : (
                        <div className="glitch-container rounded-xl p-8 border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden group text-center py-16">
                            {/* Active Glitch Hover Effect - Border Glow Pulse */}
                            <motion.div
                                className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-xl pointer-events-none"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-glow-cyan/60" />
                            <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-glow-violet/60" />
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-glow-violet/60" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-glow-cyan/60" />

                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 relative z-10">
                                <Ticket className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-2 relative z-10">No Active Registrations</h3>
                            <p className="text-text-secondary mb-6 relative z-10">You haven&apos;t registered for any events yet.</p>
                            <div className="relative z-10">
                                <Link href="/register">
                                    <GlowButton>Browse Events</GlowButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}

function StatCard({ label, value, icon, delay }: { label: string; value: string; icon: React.ReactNode; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div className="glitch-container rounded-xl p-4 sm:p-6 group border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] h-full">
                {/* Active Glitch Hover Effect - Border Glow Pulse */}
                <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-xl pointer-events-none"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                <div className="flex items-start justify-between mb-2 relative z-10">
                    <span className="text-text-muted text-xs uppercase tracking-wider">{label}</span>
                    <span className="text-glow-cyan opacity-50 group-hover:opacity-100 transition-opacity">{icon}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold relative z-10 group-hover:text-white transition-colors">{value}</div>
            </div>
        </motion.div>
    )
}

function TicketCard({ event, index, userName }: { event: any; index: number; userName: string }) {
    const colors = colorMap[event.color] || colorMap.cyan
    const ticketId = `INFOTHON-${event.id.toUpperCase().slice(0, 4)}-${Date.now().toString(36).toUpperCase().slice(-4)}`

    const handleDownload = async () => {
        // Create a simple ticket image using canvas
        const canvas = document.createElement('canvas')
        canvas.width = 800
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 800, 400)
        gradient.addColorStop(0, '#0a0a0a')
        gradient.addColorStop(1, '#1a1a2e')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 800, 400)

        // Border
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 3
        ctx.strokeRect(10, 10, 780, 380)

        // Corner accents
        ctx.fillStyle = '#00f5ff'
        ctx.fillRect(10, 10, 30, 3)
        ctx.fillRect(10, 10, 3, 30)
        ctx.fillRect(760, 10, 30, 3)
        ctx.fillRect(787, 10, 3, 30)
        ctx.fillRect(10, 387, 30, 3)
        ctx.fillRect(10, 360, 3, 30)
        ctx.fillRect(760, 387, 30, 3)
        ctx.fillRect(787, 360, 3, 30)

        // Event Title
        ctx.font = 'bold 36px Arial'
        ctx.fillStyle = '#00f5ff'
        ctx.fillText(event.title, 40, 80)

        // Category
        ctx.font = '14px Arial'
        ctx.fillStyle = '#8b5cf6'
        ctx.fillText(event.category, 40, 110)

        // Details
        ctx.font = '18px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`Attendee: ${userName}`, 40, 160)
        ctx.fillText(`Date: ${event.date}`, 40, 190)
        ctx.fillText(`Venue: Main Auditorium`, 40, 220)
        ctx.fillText(`Time: 10:00 AM IST`, 40, 250)

        // Ticket ID
        ctx.font = 'bold 16px monospace'
        ctx.fillStyle = '#00f5ff'
        ctx.fillText(`Ticket ID: ${ticketId}`, 40, 300)

        // INFOTHON branding
        ctx.font = 'bold 48px Arial'
        ctx.fillStyle = 'rgba(0, 245, 255, 0.1)'
        ctx.fillText('INFOTHON 2026', 400, 360)

        // Download
        const link = document.createElement('a')
        link.download = `infothon-ticket-${event.id}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `INFOTHON 2026 - ${event.title}`,
                    text: `I'm attending ${event.title} at INFOTHON 2026! Join me!`,
                    url: window.location.origin,
                })
            } catch {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(
                `I'm attending ${event.title} at INFOTHON 2026! Join me at ${window.location.origin}`
            )
            alert('Link copied to clipboard!')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group h-full"
        >
            <div className="glitch-container rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col sm:flex-row h-full">
                {/* Active Glitch Hover Effect - Border Glow Pulse */}
                <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-2xl pointer-events-none z-20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-glow-cyan/60 z-20 transition-colors group-hover:border-glow-cyan" />
                <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-glow-cyan/60 z-20 transition-colors group-hover:border-glow-cyan" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-glow-cyan/60 z-20 transition-colors group-hover:border-glow-cyan" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-glow-cyan/60 z-20 transition-colors group-hover:border-glow-cyan" />

                {/* Left Side: Event Info */}
                <div className="flex-1 p-6 relative z-10">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${event.category === 'CODING' ? 'from-glow-cyan to-blue-500' : 'from-glow-violet to-purple-500'}`} />

                    <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors.border} ${colors.text} bg-white/5`}>
                            {event.category}
                        </div>
                        <div className="text-xs font-mono text-text-muted">
                            #{ticketId.slice(-8)}
                        </div>
                    </div>

                    <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-glow-cyan transition-colors">
                        {event.title}
                    </h3>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Calendar className="w-4 h-4 text-glow-cyan" />
                            {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Clock className="w-4 h-4 text-glow-cyan" />
                            10:00 AM IST
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <MapPin className="w-4 h-4 text-glow-cyan" />
                            Main Auditorium
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <GlowButton size="sm" variant="secondary" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Ticket
                        </GlowButton>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                        >
                            <Share2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Right Side: QR Code Stub */}
                <div className="relative sm:w-48 bg-black/60 border-t sm:border-t-0 sm:border-l border-white/10 p-6 flex flex-col items-center justify-center gap-4 z-10">
                    {/* Perforated Line Visual */}
                    <div className="absolute left-0 top-0 bottom-0 w-px hidden sm:flex flex-col justify-between -ml-[1px]">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-[2px] h-2 bg-text-muted/20 my-1" />
                        ))}
                    </div>

                    <div className="w-24 h-24 bg-white p-2 rounded-lg relative overflow-hidden">
                        <QrCode className="w-full h-full text-black" />
                        {/* Shimmer on QR code for effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Pass Type</div>
                        <div className="text-sm font-bold text-white">General Entry</div>
                    </div>
                    <div className="text-[10px] font-mono text-text-muted text-center">
                        Valid for {userName}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
