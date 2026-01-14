'use client'

import { useState, useEffect, useMemo } from 'react'
import QRCode from 'qrcode'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { NeonText, GlassCard, GlowButton, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { eventPackages, colorMap } from '@/data'
import { Calendar, Clock, MapPin, QrCode, Ticket, User, Download, Share2, Edit2, Check, AlertTriangle, ArrowRight, Users } from 'lucide-react'

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

export default function ProfilePage() {
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])
    const [purchasedEvents, setPurchasedEvents] = useState<string[]>([])
    const [user, setUser] = useState<{ name: string; email: string; phone: string; college: string; cc: string } | null>(null)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [showAvatarSelection, setShowAvatarSelection] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Registrations from database (for multi-ticket support)
    const [registrations, setRegistrations] = useState<{
        id: string
        ticket_id: string
        attendee_name: string
        attendee_email: string
        attendee_phone: string
        attendee_college: string
        attendee_cc: string
        details_locked: boolean
        event_id: string
        event_name: string
        event_date: string
        verified: boolean

        payment_status?: string
        amount_paid?: number
        is_team_pass?: boolean
        team_name?: string
        team_size?: number
    }[]>([])

    // Edit states
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [editName, setEditName] = useState('')
    const [editCollege, setEditCollege] = useState('')
    const [editCC, setEditCC] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    // Attendee editing - complete details
    const [editingTicketId, setEditingTicketId] = useState<string | null>(null)
    const [editingAttendee, setEditingAttendee] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        cc: ''
    })

    // Load ALL data from Supabase in one consolidated call
    useEffect(() => {
        const loadAllUserData = async () => {
            setIsLoading(true)

            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (authUser) {
                const metadata = authUser.user_metadata || {}

                // Set user profile data
                setUser({
                    name: metadata.full_name || 'Cyber Nomad',
                    email: authUser.email || '',
                    phone: metadata.phone || '',
                    college: metadata.college || '',
                    cc: metadata.cc || ''
                })
                setEditName(metadata.full_name || '')
                setEditCollege(metadata.college || '')
                setEditCC(metadata.cc || '')

                // Load purchased events from Supabase
                if (metadata.purchased_events && Array.isArray(metadata.purchased_events)) {
                    setPurchasedEvents(metadata.purchased_events)
                    // Sync to localStorage as backup
                    localStorage.setItem('infothon_purchased', JSON.stringify(metadata.purchased_events))
                }

                // Load avatar from Supabase
                if (metadata.avatar) {
                    setSelectedAvatar(metadata.avatar)
                    localStorage.setItem('infothon_avatar', metadata.avatar)
                } else {
                    const savedAvatar = localStorage.getItem('infothon_avatar')
                    if (savedAvatar) {
                        setSelectedAvatar(savedAvatar)
                        // Sync localStorage avatar to Supabase
                        await supabase.auth.updateUser({ data: { avatar: savedAvatar } })
                    } else {
                        setShowAvatarSelection(true)
                    }
                }

                // Fetch registrations from database (for multi-ticket support)
                const { data: regData, error: regError } = await supabase
                    .from('registrations')
                    .select('id, ticket_id, attendee_name, attendee_email, attendee_phone, attendee_college, attendee_cc, details_locked, event_id, event_name, event_date, verified, payment_status, amount_paid, is_team_pass, team_name, team_size')
                    .eq('user_id', authUser.id)
                    .order('created_at', { ascending: true })

                if (!regError && regData) {
                    setRegistrations(regData.map(r => ({
                        ...r,
                        attendee_email: r.attendee_email || '',
                        attendee_phone: r.attendee_phone || '',
                        attendee_college: r.attendee_college || '',
                        attendee_cc: r.attendee_cc || '',
                        details_locked: r.details_locked || false
                    })))
                }
            } else {
                // Not logged in - fallback to localStorage or redirect
                const userData = localStorage.getItem('infothon_user')
                if (userData) {
                    const parsed = JSON.parse(userData)
                    setUser({ ...parsed, phone: '', college: '', cc: '' })

                    const saved = localStorage.getItem('infothon_purchased')
                    if (saved) setPurchasedEvents(JSON.parse(saved))

                    const savedAvatar = localStorage.getItem('infothon_avatar')
                    if (savedAvatar) setSelectedAvatar(savedAvatar)
                    else setShowAvatarSelection(true)
                } else {
                    router.push('/login')
                }
            }

            setIsLoading(false)
        }

        loadAllUserData()
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

    // Save attendee details to registrations table (ONE TIME ONLY)
    const saveAttendeeDetails = async (ticketId: string, details: { name: string; email: string; phone: string; college: string; cc: string }) => {
        const { error } = await supabase
            .from('registrations')
            .update({
                attendee_name: details.name,
                attendee_email: details.email,
                attendee_phone: details.phone,
                attendee_college: details.college,
                attendee_cc: details.cc,
                details_locked: true  // Lock after first save
            })
            .eq('ticket_id', ticketId)

        if (!error) {
            // Update local state
            setRegistrations(prev => prev.map(reg =>
                reg.ticket_id === ticketId
                    ? {
                        ...reg,
                        attendee_name: details.name,
                        attendee_email: details.email,
                        attendee_phone: details.phone,
                        attendee_college: details.college,
                        attendee_cc: details.cc,
                        details_locked: true
                    }
                    : reg
            ))
            setEditingTicketId(null)
            setEditingAttendee({ name: '', email: '', phone: '', college: '', cc: '' })
        }
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
                                {/* Avatar Section with Animated Dotted Frame */}
                                <div className="relative group">
                                    {/* Square Frame with Animated Dotted Border */}
                                    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                                        {/* Animated Dotted Border - Top */}
                                        <div className="absolute -top-1 left-0 right-0 h-[2px] overflow-hidden">
                                            <motion.div
                                                className="w-[200%] h-full"
                                                style={{ background: 'repeating-linear-gradient(90deg, #00f5ff 0px, #00f5ff 8px, transparent 8px, transparent 16px)' }}
                                                animate={{ x: [0, -32] }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        </div>
                                        {/* Animated Dotted Border - Right */}
                                        <div className="absolute top-0 -right-1 bottom-0 w-[2px] overflow-hidden">
                                            <motion.div
                                                className="w-full h-[200%]"
                                                style={{ background: 'repeating-linear-gradient(180deg, #8b5cf6 0px, #8b5cf6 8px, transparent 8px, transparent 16px)' }}
                                                animate={{ y: [0, -32] }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        </div>
                                        {/* Animated Dotted Border - Bottom */}
                                        <div className="absolute -bottom-1 left-0 right-0 h-[2px] overflow-hidden">
                                            <motion.div
                                                className="w-[200%] h-full"
                                                style={{ background: 'repeating-linear-gradient(90deg, #00f5ff 0px, #00f5ff 8px, transparent 8px, transparent 16px)' }}
                                                animate={{ x: [-32, 0] }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        </div>
                                        {/* Animated Dotted Border - Left */}
                                        <div className="absolute top-0 -left-1 bottom-0 w-[2px] overflow-hidden">
                                            <motion.div
                                                className="w-full h-[200%]"
                                                style={{ background: 'repeating-linear-gradient(180deg, #8b5cf6 0px, #8b5cf6 8px, transparent 8px, transparent 16px)' }}
                                                animate={{ y: [-32, 0] }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            />
                                        </div>

                                        {/* Corner Accents */}
                                        <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-glow-cyan z-20" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-glow-violet z-20" />
                                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-glow-violet z-20" />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-glow-cyan z-20" />

                                        {/* Animated Glow */}
                                        <motion.div
                                            className="absolute inset-0 rounded-lg"
                                            animate={{
                                                boxShadow: [
                                                    '0 0 15px rgba(0,245,255,0.2)',
                                                    '0 0 30px rgba(139,92,246,0.3)',
                                                    '0 0 15px rgba(0,245,255,0.2)',
                                                ]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />

                                        {/* Main Container - Square */}
                                        <div className="absolute inset-0 rounded-lg p-0.5 bg-gradient-to-br from-glow-cyan via-glow-violet to-glow-cyan overflow-hidden">
                                            <div className="w-full h-full rounded-md bg-black overflow-hidden relative">
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
                        <span className="text-glow-cyan">///</span> My Passes
                        {registrations.length > 0 && (
                            <span className="text-sm font-normal text-text-muted ml-2">
                                ({registrations.length} total)
                            </span>
                        )}
                    </h2>

                    {registrations.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {registrations.map((reg, index) => {
                                const eventDetails = eventPackages.find(e => e.id === reg.event_id)

                                // Pending Payment Card
                                if (reg.payment_status === 'pending') {
                                    return (
                                        <motion.div
                                            key={reg.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative group h-full"
                                        >
                                            <div className="absolute inset-0 bg-red-500/10 blur-xl group-hover:bg-red-500/20 transition-all duration-500" />

                                            <div className="relative h-full flex flex-col justify-between p-6 rounded-2xl border border-red-500/30 bg-black/60 backdrop-blur-xl overflow-hidden">
                                                {/* Striped Warning Background */}
                                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                                    backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)'
                                                }} />

                                                <div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold font-mono tracking-wider animate-pulse">
                                                            PAYMENT_PENDING
                                                        </div>
                                                        <div className="text-red-500/50">
                                                            <AlertTriangle className="w-8 h-8" />
                                                        </div>
                                                    </div>

                                                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{reg.event_name}</h3>
                                                    {reg.team_name && (
                                                        <p className="text-red-300/80 font-mono text-sm mb-4">Team: {reg.team_name}</p>
                                                    )}

                                                    <div className="text-sm text-text-secondary mb-6">
                                                        Registration initiated but payment not completed. Complete payment to unlock your team pass.
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-red-500/20">
                                                    <span className="text-xl font-bold text-white">₹{reg.amount_paid}</span>
                                                    <button
                                                        onClick={() => router.push(`/register/${reg.event_id}`)}
                                                        className="px-6 py-2 rounded-lg bg-red-500 text-black font-bold hover:bg-red-400 transition-colors flex items-center gap-2"
                                                    >
                                                        Pay Now
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                }

                                return (
                                    <RegistrationPassCard
                                        key={reg.ticket_id}
                                        registration={reg}
                                        eventDetails={eventDetails}
                                        index={index}
                                        onStartEdit={(ticketId, attendee) => {
                                            setEditingTicketId(ticketId)
                                            setEditingAttendee(attendee)
                                        }}
                                        isEditing={editingTicketId === reg.ticket_id}
                                        editingAttendee={editingAttendee}
                                        onAttendeeChange={setEditingAttendee}
                                        onSaveAttendee={() => saveAttendeeDetails(reg.ticket_id, editingAttendee)}
                                        onCancelEdit={() => { setEditingTicketId(null); setEditingAttendee({ name: '', email: '', phone: '', college: '', cc: '' }) }}
                                    />
                                )
                            })}
                        </div>
                    ) : myTickets.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {myTickets.map((ticket, index) => (
                                <TicketCard key={ticket.id} event={ticket} index={index} userName={user?.name || 'Guest'} userEmail={user?.email || ''} />
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
                            <h3 className="text-xl font-heading font-bold mb-2 relative z-10">No Active Passes</h3>
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
            <div className="glitch-container rounded-xl p-4 sm:p-6 group border border-white/10 bg-black/40 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] h-full min-h-[120px]">
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

                <div className="flex items-center justify-between mb-3 relative z-10">
                    <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">{label}</span>
                    <span className="text-glow-cyan w-5 h-5">{icon}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold relative z-10 text-white group-hover:text-glow-cyan transition-colors">{value}</div>
            </div>
        </motion.div>
    )
}

function TicketCard({ event, index, userName, userEmail }: { event: any; index: number; userName: string; userEmail: string }) {
    const colors = colorMap[event.color] || colorMap.cyan
    // Generate a stable unique ticket ID based on user email and event
    const ticketId = useMemo(() => {
        const hash = btoa(`${userEmail}-${event.id}`).slice(0, 8).toUpperCase()
        return `INFOTHON-${event.id.toUpperCase().slice(0, 4)}-${hash}`
    }, [userEmail, event.id])

    const [qrDataUrl, setQrDataUrl] = useState<string>('')

    // Generate QR code with verifiable ticket data
    useEffect(() => {
        const generateQR = async () => {
            const ticketData = JSON.stringify({
                ticketId,
                event: event.id,
                eventName: event.title,
                attendee: userName,
                email: userEmail,
                date: event.date,
                verified: true,
                issuedAt: new Date().toISOString()
            })

            try {
                const qrUrl = await QRCode.toDataURL(ticketData, {
                    width: 200,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                })
                setQrDataUrl(qrUrl)
            } catch (err) {
                console.error('QR generation failed:', err)
            }
        }
        generateQR()
    }, [ticketId, event, userName, userEmail])

    const handleDownload = async () => {
        // Create ULTRA PREMIUM ticket with INFOTHON branding
        const canvas = document.createElement('canvas')
        canvas.width = 1000
        canvas.height = 500
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // === BACKGROUND ===
        // Deep space gradient
        const bgGradient = ctx.createRadialGradient(500, 250, 0, 500, 250, 600)
        bgGradient.addColorStop(0, '#0d0d15')
        bgGradient.addColorStop(0.5, '#080810')
        bgGradient.addColorStop(1, '#050508')
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, 1000, 500)

        // === CIRCUIT BOARD PATTERN ===
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.08)'
        ctx.lineWidth = 1

        // Horizontal circuit lines
        const circuitY = [60, 120, 380, 440]
        circuitY.forEach(y => {
            ctx.beginPath()
            ctx.moveTo(0, y)
            for (let x = 0; x < 1000; x += 50) {
                if (Math.random() > 0.7) {
                    ctx.lineTo(x, y)
                    ctx.lineTo(x, y + (Math.random() > 0.5 ? 15 : -15))
                    ctx.lineTo(x + 25, y + (Math.random() > 0.5 ? 15 : -15))
                    ctx.lineTo(x + 25, y)
                }
                ctx.lineTo(x + 50, y)
            }
            ctx.stroke()
        })

        // Circuit nodes
        ctx.fillStyle = 'rgba(0, 245, 255, 0.15)'
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 1000
            const y = Math.random() * 500
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill()
        }

        // === HEX PATTERN OVERLAY ===
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)'
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 15; col++) {
                const x = col * 80 + (row % 2) * 40
                const y = row * 70
                ctx.beginPath()
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 60 - 30) * Math.PI / 180
                    const px = x + 25 * Math.cos(angle)
                    const py = y + 25 * Math.sin(angle)
                    if (i === 0) ctx.moveTo(px, py)
                    else ctx.lineTo(px, py)
                }
                ctx.closePath()
                ctx.stroke()
            }
        }

        // === MAIN FRAME ===
        // Outer glow frame
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 25
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 3
        ctx.strokeRect(20, 20, 960, 460)
        ctx.shadowBlur = 0

        // Inner violet frame
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)'
        ctx.lineWidth = 1
        ctx.strokeRect(30, 30, 940, 440)

        // === CORNER DECORATIONS ===
        const corners = [[20, 20, 1, 1], [980, 20, -1, 1], [20, 480, 1, -1], [980, 480, -1, -1]]
        corners.forEach(([x, y, dx, dy]) => {
            // Large L bracket
            ctx.fillStyle = '#00f5ff'
            ctx.fillRect(x, y, 50 * dx, 4 * dy)
            ctx.fillRect(x, y, 4 * dx, 50 * dy)
            // Small inner bracket
            ctx.fillStyle = '#8b5cf6'
            ctx.fillRect(x + 8 * dx, y + 8 * dy, 30 * dx, 2 * dy)
            ctx.fillRect(x + 8 * dx, y + 8 * dy, 2 * dx, 30 * dy)
            // Corner dot
            ctx.beginPath()
            ctx.arc(x + 6 * dx, y + 6 * dy, 4, 0, Math.PI * 2)
            ctx.fillStyle = '#00f5ff'
            ctx.fill()
        })

        // === DATA MATRIX DECORATION ===
        ctx.fillStyle = 'rgba(0, 245, 255, 0.1)'
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (Math.random() > 0.5) {
                    ctx.fillRect(850 + col * 8, 350 + row * 8, 6, 6)
                }
            }
        }

        // === SCANLINES ===
        for (let y = 0; y < 500; y += 3) {
            ctx.fillStyle = `rgba(0, 0, 0, ${y % 6 === 0 ? 0.15 : 0.08})`
            ctx.fillRect(0, y, 1000, 1)
        }

        // === HEADER SECTION ===
        // INFOTHON text with glow
        ctx.font = 'bold 48px Arial, sans-serif'
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 20
        ctx.fillStyle = '#00f5ff'
        ctx.fillText('INFOTHON', 60, 90)
        ctx.shadowBlur = 0

        // Decorative line under INFOTHON
        const lineGrad = ctx.createLinearGradient(60, 100, 280, 100)
        lineGrad.addColorStop(0, '#00f5ff')
        lineGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = lineGrad
        ctx.fillRect(60, 105, 220, 2)

        // × symbol - positioned after INFOTHON with proper spacing
        ctx.font = 'bold 32px Arial'
        ctx.fillStyle = '#8b5cf6'
        ctx.fillText('×', 340, 85)

        // 2K26 with gradient - positioned after × symbol
        ctx.font = 'bold 44px Arial'
        const grad2k = ctx.createLinearGradient(380, 50, 520, 95)
        grad2k.addColorStop(0, '#8b5cf6')
        grad2k.addColorStop(0.5, '#00f5ff')
        grad2k.addColorStop(1, '#8b5cf6')
        ctx.fillStyle = grad2k
        ctx.shadowColor = '#8b5cf6'
        ctx.shadowBlur = 15
        ctx.fillText('2K26', 380, 90)
        ctx.shadowBlur = 0

        // Subtitle
        ctx.font = '14px monospace'
        ctx.fillStyle = 'rgba(0, 245, 255, 0.7)'
        ctx.fillText('NATIONAL LEVEL HACKATHON', 60, 130)

        // Horizontal divider
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
        ctx.lineWidth = 1
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        ctx.moveTo(60, 150)
        ctx.lineTo(600, 150)
        ctx.stroke()
        ctx.setLineDash([])

        // === EVENT DETAILS ===
        // Event name with glow
        ctx.font = 'bold 38px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 12
        ctx.fillText(event.title.toUpperCase(), 60, 200)
        ctx.shadowBlur = 0

        // Category badge
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
        ctx.strokeStyle = '#8b5cf6'
        ctx.lineWidth = 1
        const catText = event.category
        ctx.font = 'bold 12px Arial'
        const catW = ctx.measureText(catText).width + 24
        ctx.fillRect(60, 215, catW, 26)
        ctx.strokeRect(60, 215, catW, 26)
        ctx.fillStyle = '#8b5cf6'
        ctx.fillText(catText, 72, 233)

        // Attendee section
        ctx.font = '13px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fillText('ATTENDEE', 60, 280)
        ctx.font = 'bold 24px Arial'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(userName.toUpperCase(), 60, 310)

        // Info grid
        const infoItems = [
            { label: 'DATE', value: event.date },
            { label: 'VENUE', value: 'Main Auditorium' },
            { label: 'TIME', value: '10:00 AM IST' }
        ]
        infoItems.forEach((item, i) => {
            const xPos = 60 + i * 180
            ctx.font = '11px Arial'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
            ctx.fillText(item.label, xPos, 360)
            ctx.font = 'bold 16px Arial'
            ctx.fillStyle = '#00f5ff'
            ctx.fillText(item.value, xPos, 382)
        })

        // Ticket ID
        ctx.font = 'bold 13px monospace'
        ctx.fillStyle = 'rgba(0, 245, 255, 0.8)'
        ctx.fillText(`TICKET: ${ticketId}`, 60, 435)

        // Holographic stripe
        const holoGrad = ctx.createLinearGradient(60, 455, 350, 465)
        holoGrad.addColorStop(0, 'rgba(0, 245, 255, 0.4)')
        holoGrad.addColorStop(0.25, 'rgba(139, 92, 246, 0.4)')
        holoGrad.addColorStop(0.5, 'rgba(0, 245, 255, 0.4)')
        holoGrad.addColorStop(0.75, 'rgba(139, 92, 246, 0.4)')
        holoGrad.addColorStop(1, 'rgba(0, 245, 255, 0.4)')
        ctx.fillStyle = holoGrad
        ctx.fillRect(60, 450, 290, 10)

        // === QR SECTION (RIGHT SIDE) ===
        // Dashed divider
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)'
        ctx.lineWidth = 2
        ctx.setLineDash([8, 8])
        ctx.beginPath()
        ctx.moveTo(660, 50)
        ctx.lineTo(660, 450)
        ctx.stroke()
        ctx.setLineDash([])

        // "SCAN TO VERIFY" header
        ctx.font = '12px monospace'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.textAlign = 'center'
        ctx.fillText('< SCAN TO VERIFY >', 820, 80)

        // QR code container with glow
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 15
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 2
        ctx.strokeRect(730, 100, 180, 180)
        ctx.shadowBlur = 0

        // Draw QR code if available
        if (qrDataUrl) {
            const qrImg = new window.Image()
            qrImg.src = qrDataUrl
            await new Promise<void>((resolve) => {
                qrImg.onload = () => {
                    ctx.drawImage(qrImg, 740, 110, 160, 160)
                    resolve()
                }
                qrImg.onerror = () => resolve()
            })
        }

        // VIP Access badge
        ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'
        ctx.strokeStyle = '#8b5cf6'
        ctx.fillRect(740, 300, 160, 35)
        ctx.strokeRect(740, 300, 160, 35)
        ctx.font = 'bold 14px Arial'
        ctx.fillStyle = '#8b5cf6'
        ctx.fillText('VIP ACCESS PASS', 820, 323)

        // Additional info
        ctx.font = '11px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
        ctx.fillText('Valid for single entry', 820, 365)
        ctx.fillText('Non-transferable', 820, 385)

        // VERIFIED stamp
        ctx.save()
        ctx.translate(820, 430)
        ctx.rotate(-0.15)
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.6)'
        ctx.lineWidth = 3
        ctx.strokeRect(-45, -15, 90, 30)
        ctx.font = 'bold 14px Arial'
        ctx.fillStyle = '#00f5ff'
        ctx.fillText('✓ VERIFIED', 0, 6)
        ctx.restore()

        ctx.textAlign = 'left' // Reset

        // Download
        const link = document.createElement('a')
        link.download = `INFOTHON_2K26_${event.id}_${ticketId}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    const handleShare = async () => {
        const shareText = `🚀 I'm registered for ${event.title} at INFOTHON × HACKATHON 2K26!

🗓️ Date: ${event.date}
📍 Venue: Main Auditorium
🎫 Ticket: ${ticketId}

INFOTHON 2K26 is the ultimate national-level hackathon featuring:
⚡ Cutting-edge tech challenges
🏆 Amazing prizes worth ₹1,00,000+
👥 500+ participants
🔥 48 hours of non-stop innovation

Join us at the biggest tech fest of 2026!
🔗 Register now: ${window.location.origin}/register

#INFOTHON2K26 #Hackathon #TechFest #Coding #Innovation`

        // Try native share API first (mobile)
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `INFOTHON × HACKATHON 2K26 - ${event.title}`,
                    text: shareText,
                    url: window.location.origin,
                })
                return // Success, exit
            } catch (err) {
                // User cancelled or error, try clipboard fallback
                console.log('Share cancelled or failed:', err)
            }
        }

        // Fallback: copy to clipboard
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareText)
                alert('✅ Event details copied to clipboard!')
            } else {
                // Final fallback: use execCommand (deprecated but works)
                const textArea = document.createElement('textarea')
                textArea.value = shareText
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand('copy')
                document.body.removeChild(textArea)
                alert('✅ Event details copied to clipboard!')
            }
        } catch (err) {
            console.error('Clipboard failed:', err)
            alert('❌ Could not share. Please try again.')
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

                    <div className="w-24 h-24 bg-white p-1 rounded-lg relative overflow-hidden">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="Ticket QR Code" className="w-full h-full" />
                        ) : (
                            <QrCode className="w-full h-full text-black p-2" />
                        )}
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

// Component for registration-based passes with complete attendee details (ONE TIME EDIT)
function RegistrationPassCard({
    registration,
    eventDetails,
    index,
    onStartEdit,
    isEditing,
    editingAttendee,
    onAttendeeChange,
    onSaveAttendee,
    onCancelEdit
}: {
    registration: {
        ticket_id: string
        attendee_name: string
        attendee_email: string
        attendee_phone: string
        attendee_college: string
        attendee_cc: string
        details_locked: boolean
        event_id: string
        event_name: string
        event_date: string
        verified: boolean
        payment_status?: string
        amount_paid?: number
        is_team_pass?: boolean
        team_name?: string
        team_size?: number
    }
    eventDetails: any
    index: number
    onStartEdit: (ticketId: string, attendee: { name: string; email: string; phone: string; college: string; cc: string }) => void
    isEditing: boolean
    editingAttendee: { name: string; email: string; phone: string; college: string; cc: string }
    onAttendeeChange: (attendee: { name: string; email: string; phone: string; college: string; cc: string }) => void
    onSaveAttendee: () => void
    onCancelEdit: () => void
}) {
    const colors = eventDetails ? (colorMap[eventDetails.color] || colorMap.cyan) : colorMap.cyan
    const [qrDataUrl, setQrDataUrl] = useState<string>('')

    // Check if details are not filled yet (placeholder names or empty)
    const isPlaceholderName = !registration.attendee_name ||
        registration.attendee_name.startsWith('Attendee ') ||
        registration.attendee_name === 'Guest'
    const canEdit = !registration.details_locked && isPlaceholderName

    // Generate QR code with registration data
    useEffect(() => {
        const generateQR = async () => {
            const ticketData = JSON.stringify({
                ticketId: registration.ticket_id,
                event: registration.event_id,
                eventName: registration.event_name,
                attendee: registration.attendee_name,
                team: registration.team_name,
                isTeam: registration.is_team_pass,
                phone: registration.attendee_phone,
                college: registration.attendee_college,
                date: registration.event_date,
                verified: registration.verified
            })

            try {
                const qrUrl = await QRCode.toDataURL(ticketData, {
                    width: 200,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' }
                })
                setQrDataUrl(qrUrl)
            } catch (err) {
                console.error('QR generation failed:', err)
            }
        }
        generateQR()
    }, [registration])

    const handleDownload = async () => {
        const canvas = document.createElement('canvas')
        canvas.width = 1000
        canvas.height = 500
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // === BACKGROUND - Deep space with gradient ===
        const bgGradient = ctx.createRadialGradient(300, 250, 0, 500, 250, 700)
        bgGradient.addColorStop(0, '#0c1929')
        bgGradient.addColorStop(0.4, '#081220')
        bgGradient.addColorStop(1, '#040810')
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, 1000, 500)

        // === ANIMATED CIRCUIT PATTERNS ===
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.06)'
        ctx.lineWidth = 1

        // Horizontal circuit lines with nodes
        for (let y = 50; y < 500; y += 80) {
            ctx.beginPath()
            ctx.moveTo(0, y)
            for (let x = 0; x < 650; x += 40) {
                ctx.lineTo(x, y)
                if (Math.random() > 0.6) {
                    const offset = (Math.random() > 0.5 ? 1 : -1) * 12
                    ctx.lineTo(x, y + offset)
                    ctx.lineTo(x + 20, y + offset)
                    ctx.lineTo(x + 20, y)
                }
            }
            ctx.stroke()
        }

        // Circuit nodes (glowing dots)
        ctx.fillStyle = 'rgba(0, 245, 255, 0.15)'
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 600
            const y = Math.random() * 450 + 25
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill()
        }

        // === SCAN LINES EFFECT ===
        for (let y = 0; y < 500; y += 3) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.03 + Math.random() * 0.02})`
            ctx.fillRect(0, y, 1000, 1)
        }

        // === OUTER FRAME - Double border with glow ===
        // Outer glow
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 15
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.strokeRect(10, 10, 980, 480)
        ctx.shadowBlur = 0

        // Main border
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.8)'
        ctx.lineWidth = 2
        ctx.strokeRect(15, 15, 970, 470)

        // === CORNER ACCENTS - L-shaped ===
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 3
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 8
        // Top-left
        ctx.beginPath(); ctx.moveTo(15, 50); ctx.lineTo(15, 15); ctx.lineTo(50, 15); ctx.stroke()
        // Top-right  
        ctx.beginPath(); ctx.moveTo(950, 15); ctx.lineTo(985, 15); ctx.lineTo(985, 50); ctx.stroke()
        // Bottom-left
        ctx.beginPath(); ctx.moveTo(15, 450); ctx.lineTo(15, 485); ctx.lineTo(50, 485); ctx.stroke()
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(950, 485); ctx.lineTo(985, 485); ctx.lineTo(985, 450); ctx.stroke()
        ctx.shadowBlur = 0

        // === HEADER - INFOTHON  ×  2K26 (wide spacing) ===
        ctx.textAlign = 'left'

        // INFOTHON - cyan italic
        ctx.font = 'bold italic 52px Arial, sans-serif'
        ctx.fillStyle = '#00f5ff'
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 10
        ctx.fillText('INFOTHON', 40, 70)
        ctx.shadowBlur = 0

        // × - purple, spaced
        ctx.font = 'bold 40px Arial, sans-serif'
        ctx.fillStyle = '#a855f7'
        ctx.fillText('×', 320, 70)

        // 2K26 - purple italic
        ctx.font = 'bold italic 52px Arial, sans-serif'
        ctx.fillStyle = '#a855f7'
        ctx.shadowColor = '#a855f7'
        ctx.shadowBlur = 10
        ctx.fillText('2K26', 380, 70)
        ctx.shadowBlur = 0

        // Subtitle
        ctx.font = '11px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText('NATIONAL LEVEL HACKATHON', 40, 92)

        // === EVENT NAME ===
        ctx.font = 'bold 38px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(registration.event_name.toUpperCase(), 40, 145)

        // === CATEGORY BADGE ===
        const category = eventDetails?.category || 'EVENT'
        const badgeColor = category === 'CODING' ? '#00f5ff' : category === 'ROBOTICS' ? '#a855f7' : '#f59e0b'
        const badgeWidth = ctx.measureText(category).width + 30

        // Badge background with rounded corners simulation
        ctx.fillStyle = badgeColor
        ctx.beginPath()
        ctx.roundRect(40, 160, badgeWidth, 26, 4)
        ctx.fill()

        ctx.font = 'bold 11px Arial, sans-serif'
        ctx.fillStyle = '#000000'
        ctx.fillText(category, 55, 178)

        // === ATTENDEE / TEAM SECTION ===
        ctx.font = '10px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText(registration.is_team_pass ? 'TEAM DETAILS' : 'ATTENDEE', 40, 220)

        // Draw Team Name if team pass, else Attendee Name
        ctx.font = 'bold 30px Arial, sans-serif'
        ctx.fillStyle = registration.is_team_pass ? '#f59e0b' : '#ffffff' // Amber for team
        // Fix upper case call
        const attName = registration.attendee_name || ''
        const tName = registration.team_name || ''
        const nameText = registration.is_team_pass && tName
            ? tName.toUpperCase()
            : attName.toUpperCase()
        ctx.fillText(nameText, 40, 255)

        // If Team Pass, show Leader below
        if (registration.is_team_pass) {
            ctx.font = 'bold 14px monospace'
            ctx.fillStyle = '#94a3b8'
            ctx.fillText(`LEADER: ${attName.toUpperCase()}`, 40, 280)
        }

        // === DATE / VENUE / TIME COLUMNS ===
        const colY = 300

        // DATE column
        ctx.font = '9px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText('DATE', 40, colY)
        ctx.font = 'bold 16px Arial, sans-serif'
        ctx.fillStyle = '#00f5ff'
        ctx.fillText(registration.event_date, 40, colY + 20)

        // Separator line
        ctx.fillStyle = '#1e3a5f'
        ctx.fillRect(180, colY - 8, 1, 35)

        // VENUE column
        ctx.font = '9px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText('VENUE', 200, colY)
        ctx.font = 'bold 16px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('Main Auditorium', 200, colY + 20)

        // Separator line
        ctx.fillStyle = '#1e3a5f'
        ctx.fillRect(380, colY - 8, 1, 35)

        // TIME column
        ctx.font = '9px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText('TIME', 400, colY)
        ctx.font = 'bold 16px Arial, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText('10:00 AM IST', 400, colY + 20)

        // === TICKET ID ===
        ctx.font = '10px monospace'
        ctx.fillStyle = '#64748b'
        ctx.fillText('TICKET:', 40, 380)
        ctx.fillStyle = '#00f5ff'
        ctx.fillText(registration.ticket_id, 95, 380)

        // === GRADIENT PROGRESS BAR ===
        const barGradient = ctx.createLinearGradient(40, 0, 580, 0)
        barGradient.addColorStop(0, '#00f5ff')
        barGradient.addColorStop(0.3, '#06b6d4')
        barGradient.addColorStop(0.6, '#a855f7')
        barGradient.addColorStop(1, '#00f5ff')
        ctx.fillStyle = barGradient
        ctx.fillRect(40, 410, 540, 6)

        // Bar glow
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 8
        ctx.fillRect(40, 410, 540, 6)
        ctx.shadowBlur = 0

        // === AADHAR NOTICE ===
        ctx.font = '10px Arial, sans-serif'
        ctx.fillStyle = '#f59e0b'
        ctx.fillText('⚠ BRING AADHAR CARD FOR VERIFICATION', 40, 450)

        // === RIGHT SIDE - QR SECTION ===
        // QR container - double border with glow
        ctx.shadowColor = '#00f5ff'
        ctx.shadowBlur = 12
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 2
        ctx.strokeRect(680, 75, 280, 265)
        ctx.shadowBlur = 0

        // Inner border
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)'
        ctx.lineWidth = 1
        ctx.strokeRect(685, 80, 270, 255)

        // Corner decorations for QR box
        ctx.strokeStyle = '#00f5ff'
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(680, 95); ctx.lineTo(680, 75); ctx.lineTo(700, 75); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(940, 75); ctx.lineTo(960, 75); ctx.lineTo(960, 95); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(680, 320); ctx.lineTo(680, 340); ctx.lineTo(700, 340); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(940, 340); ctx.lineTo(960, 340); ctx.lineTo(960, 320); ctx.stroke()

        // "SCAN TO VERIFY" label
        ctx.font = '9px monospace'
        ctx.fillStyle = '#64748b'
        ctx.textAlign = 'center'
        ctx.fillText('< SCAN TO VERIFY >', 820, 65)

        // QR Code white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(720, 100, 200, 200)

        // === VIP ACCESS PASS BADGE ===
        ctx.strokeStyle = '#a855f7'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(720, 360, 200, 35, 5)
        ctx.stroke()
        ctx.font = 'bold 13px Arial, sans-serif'
        ctx.fillStyle = '#a855f7'
        ctx.textAlign = 'center'
        ctx.fillText('VIP ACCESS PASS', 820, 383)

        // Valid for text
        ctx.font = '9px Arial, sans-serif'
        ctx.fillStyle = '#64748b'
        ctx.fillText('Valid for single entry', 820, 410)
        ctx.fillText('Non-transferable', 820, 425)

        // === VERIFIED BADGE ===
        if (registration.verified || registration.details_locked) {
            ctx.fillStyle = '#22c55e'
            ctx.shadowColor = '#22c55e'
            ctx.shadowBlur = 10
            ctx.beginPath()
            ctx.roundRect(755, 445, 130, 35, 6)
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.font = 'bold 14px Arial, sans-serif'
            ctx.fillStyle = '#ffffff'
            ctx.fillText('✓ VERIFIED', 820, 468)
        }

        // === DRAW QR CODE ===
        if (qrDataUrl) {
            const qrImg = new window.Image()
            qrImg.onload = () => {
                ctx.drawImage(qrImg, 725, 105, 190, 190)
                const link = document.createElement('a')
                link.download = `INFOTHON_2K26_${registration.ticket_id}.png`
                link.href = canvas.toDataURL('image/png')
                link.click()
            }
            qrImg.src = qrDataUrl
        } else {
            const link = document.createElement('a')
            link.download = `INFOTHON_2K26_${registration.ticket_id}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        }
    }

    const handleShare = async () => {
        const shareText = `🚀 I'm attending ${registration.event_name} at INFOTHON × 2K26!

🎫 Ticket: ${registration.ticket_id}
🗓️ Date: ${registration.event_date}
📍 Venue: Main Auditorium

INFOTHON 2K26 - The Ultimate Tech Fest!
🔗 Register: ${typeof window !== 'undefined' ? window.location.origin : ''}/register

#INFOTHON2K26 #TechFest #Hackathon`

        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: `INFOTHON × 2K26 - ${registration.event_name}`,
                    text: shareText,
                    url: typeof window !== 'undefined' ? window.location.origin : '',
                })
                return
            } catch (err) {
                console.log('Share cancelled:', err)
            }
        }

        try {
            await navigator.clipboard.writeText(shareText)
            alert('✓ Ticket details copied to clipboard!')
        } catch (err) {
            console.error('Clipboard failed:', err)
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
                {/* Glow pulse on hover */}
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
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${eventDetails?.category === 'CODING' ? 'from-glow-cyan to-blue-500' : 'from-glow-violet to-purple-500'}`} />

                    {/* Category & Badges */}
                    <div className="flex items-start justify-between mb-4">
                        {eventDetails?.category && (
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors.border} ${colors.text} bg-white/5`}>
                                {eventDetails.category}
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {registration.details_locked && (
                                <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full border border-green-500/30 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> LOCKED
                                </span>
                            )}
                            {registration.verified && (
                                <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                    <Check className="w-3 h-3 inline" /> VERIFIED
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Team Pass Badge for UI */}
                    {registration.is_team_pass && (
                        <div className="mb-4">
                            <span className="px-3 py-1 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-xs font-bold font-mono tracking-wider animate-pulse inline-flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                TEAM PASS: {registration.team_name}
                            </span>
                        </div>
                    )}

                    {/* Ticket ID */}
                    <div className="text-xs font-mono text-glow-cyan mb-3">
                        #{registration.ticket_id}
                    </div>

                    {/* Event Name */}
                    <h3 className="text-2xl font-heading font-bold mb-3 group-hover:text-glow-cyan transition-colors">
                        {registration.event_name}
                    </h3>

                    {/* Event Details with Icons */}
                    <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <Calendar className="w-4 h-4 text-glow-cyan" />
                            {registration.event_date}
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

                    {/* Attendee Section */}
                    {isEditing ? (
                        <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-glow-cyan/30">
                            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2">
                                <Ticket className="w-4 h-4" /> Fill details carefully - ONE TIME ONLY
                            </div>
                            <input
                                type="text"
                                value={editingAttendee.name}
                                onChange={(e) => onAttendeeChange({ ...editingAttendee, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-glow-cyan/50 text-white text-sm"
                                placeholder="Full Name *"
                            />
                            <input
                                type="email"
                                value={editingAttendee.email}
                                onChange={(e) => onAttendeeChange({ ...editingAttendee, email: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-glow-cyan/50 text-white text-sm"
                                placeholder="Email Address *"
                            />
                            <input
                                type="tel"
                                value={editingAttendee.phone}
                                onChange={(e) => onAttendeeChange({ ...editingAttendee, phone: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-glow-cyan/50 text-white text-sm"
                                placeholder="Phone Number *"
                            />
                            <input
                                type="text"
                                value={editingAttendee.college}
                                onChange={(e) => onAttendeeChange({ ...editingAttendee, college: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-glow-cyan/50 text-white text-sm"
                                placeholder="College Name *"
                            />
                            <input
                                type="text"
                                value={editingAttendee.cc}
                                onChange={(e) => onAttendeeChange({ ...editingAttendee, cc: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/30 text-white text-sm"
                                placeholder="CC (Optional)"
                            />
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={onSaveAttendee}
                                    disabled={!editingAttendee.name || !editingAttendee.email || !editingAttendee.phone || !editingAttendee.college}
                                    className="flex-1 py-2 rounded-lg bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 transition-colors disabled:opacity-50 font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Save & Lock
                                </button>
                                <button
                                    onClick={onCancelEdit}
                                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : registration.details_locked || !isPlaceholderName ? (
                        // Locked - Show only Name + ID
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">ATTENDEE</div>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-glow-cyan" />
                                <span className="text-lg text-white font-bold">{registration.attendee_name}</span>
                            </div>
                        </div>
                    ) : (
                        // Not filled - Prompt
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
                            <Ticket className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                            <div className="text-amber-400 text-sm font-bold mb-2">Attendee details not set</div>
                            <button
                                onClick={() => onStartEdit(registration.ticket_id, { name: '', email: '', phone: '', college: '', cc: '' })}
                                className="px-4 py-2 rounded-lg bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 transition-colors text-sm font-bold"
                            >
                                <Edit2 className="w-4 h-4 inline mr-2" /> Fill Details
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-5">
                        <GlowButton size="sm" variant="secondary" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" /> Ticket
                        </GlowButton>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                            title="Share"
                        >
                            <Share2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Right Side: QR Code Stub */}
                <div className="relative sm:w-48 bg-black/60 border-t sm:border-t-0 sm:border-l border-white/10 p-6 flex flex-col items-center justify-center gap-4 z-10">
                    {/* Perforated Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px hidden sm:flex flex-col justify-between -ml-[1px]">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-[2px] h-2 bg-text-muted/20 my-1" />
                        ))}
                    </div>

                    {/* QR Code */}
                    <div className="w-24 h-24 bg-white p-1 rounded-lg relative overflow-hidden">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="Ticket QR Code" className="w-full h-full" />
                        ) : (
                            <QrCode className="w-full h-full text-black p-2" />
                        )}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                    </div>

                    {/* Pass Type */}
                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Pass Type</div>
                        <div className="text-sm font-bold text-white">General Entry</div>
                    </div>

                    {/* Valid For */}
                    <div className="text-[10px] font-mono text-text-muted text-center">
                        Valid for {registration.attendee_name || 'Attendee'}
                    </div>

                    {/* Aadhar Notice */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-400 text-[9px] font-bold">
                            <Ticket className="w-3 h-3" /> AADHAR REQUIRED
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
