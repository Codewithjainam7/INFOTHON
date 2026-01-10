import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard } from '@/components/ui'
import { Footer } from '@/components/sections'
import { eventPackages, colorMap } from '@/data'
import { Calendar, Clock, MapPin, QrCode, Ticket, User, Download, Share2, Edit2, Check } from 'lucide-react'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const avatars = [
    '/images/boy_avatar_1.325Z.png',
    '/images/girl_avatar_1.851Z.png',
    '/images/boy_avatar_2.325Z.png',
    '/images/girl_avatar_2.851Z.png',
]

export default function ProfilePage() {
    const [purchasedEvents, setPurchasedEvents] = useState<string[]>([])
    const [user, setUser] = useState<{ name: string; email: string } | null>(null)
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
    const [showAvatarSelection, setShowAvatarSelection] = useState(false)

    useEffect(() => {
        // Load user data
        const userData = localStorage.getItem('infothon_user')
        if (userData) {
            setUser({ name: 'Cyber Nomad', email: 'nomad@infothon.tech' })
        }

        // Load purchased events
        const saved = localStorage.getItem('infothon_purchased')
        if (saved) {
            setPurchasedEvents(JSON.parse(saved))
        }

        // Load avatar
        const savedAvatar = localStorage.getItem('infothon_avatar')
        if (savedAvatar) {
            setSelectedAvatar(savedAvatar)
        } else {
            setShowAvatarSelection(true)
        }
    }, [])

    const handleAvatarSelect = (avatar: string) => {
        setSelectedAvatar(avatar)
        localStorage.setItem('infothon_avatar', avatar)
        setShowAvatarSelection(false)
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
                                {/* Avatar Section */}
                                <div className="relative group">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-glow-cyan to-glow-violet shadow-[0_0_30px_rgba(0,245,255,0.3)]">
                                        <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                            {selectedAvatar ? (
                                                <Image
                                                    src={selectedAvatar}
                                                    alt="Profile Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                    <User className="w-10 h-10 text-white/50" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAvatarSelection(!showAvatarSelection)}
                                        className="absolute bottom-0 right-0 p-2 rounded-full bg-bg-primary border border-glow-cyan text-glow-cyan shadow-lg hover:bg-glow-cyan hover:text-black transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div>
                                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-2">
                                        // OPERATIVE_STATUS: ACTIVE
                                    </span>
                                    <NeonText as="h1" color="gradient" className="text-3xl sm:text-4xl md:text-5xl mb-2">
                                        {user?.name || 'Guest User'}
                                    </NeonText>
                                    <div className="flex items-center gap-2 text-text-secondary font-mono text-sm">
                                        <span>{user?.email || 'Not logged in'}</span>
                                    </div>
                                </div>
                            </div>

                            <GlowButton onClick={() => window.location.reload()}>
                                Refresh Data
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </GlowButton>
                        </div>

                        {/* Avatar Selection Panel */}
                        <AnimatePresence>
                            {showAvatarSelection && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <GlassCard className="p-6 border-glow-cyan/30" glowColor="cyan">
                                        <h3 className="text-lg font-heading font-bold mb-4 flex items-center gap-2">
                                            <User className="w-5 h-5 text-glow-cyan" />
                                            Choose Your Avatar
                                        </h3>
                                        <div className="flex flex-wrap gap-4 md:gap-8">
                                            {avatars.map((avatar, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleAvatarSelect(avatar)}
                                                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all ${selectedAvatar === avatar
                                                            ? 'bg-gradient-to-r from-glow-cyan to-white shadow-[0_0_20px_rgba(0,245,255,0.5)]'
                                                            : 'bg-white/10 hover:bg-white/30'
                                                        }`}
                                                >
                                                    <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
                                                        <Image
                                                            src={avatar}
                                                            alt={`Avatar ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    {selectedAvatar === avatar && (
                                                        <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-glow-cyan text-black flex items-center justify-center border-2 border-black z-10">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </GlassCard>
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
                                <TicketCard key={ticket.id} event={ticket} index={index} />
                            ))}
                        </div>
                    ) : (
                        <GlassCard className="text-center py-16">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Ticket className="w-8 h-8 text-text-muted" />
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-2">No Active Registrations</h3>
                            <p className="text-text-secondary mb-6">You haven&apos;t registered for any events yet.</p>
                            <Link href="/register">
                                <GlowButton>Browse Events</GlowButton>
                            </Link>
                        </GlassCard>
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
            <GlassCard className="p-4 sm:p-6" hover3D={false}>
                <div className="flex items-start justify-between mb-2">
                    <span className="text-text-muted text-xs uppercase tracking-wider">{label}</span>
                    <span className="text-glow-cyan opacity-50">{icon}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold">{value}</div>
            </GlassCard>
        </motion.div>
    )
}

function TicketCard({ event, index }: { event: any; index: number }) {
    const colors = colorMap[event.color] || colorMap.cyan

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
        >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-secondary/50 backdrop-blur-md flex flex-col sm:flex-row">
                {/* Left Side: Event Info */}
                <div className="flex-1 p-6 relative">
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${event.category === 'CODING' ? 'from-glow-cyan to-blue-500' : 'from-glow-violet to-purple-500'}`} />

                    <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors.border} ${colors.text} bg-white/5`}>
                            {event.category}
                        </div>
                        <div className="text-xs font-mono text-text-muted">
                            #{event.id.toUpperCase().slice(0, 8)}
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
                        <GlowButton size="sm" variant="secondary">
                            <Download className="w-4 h-4 mr-2" />
                            Ticket
                        </GlowButton>
                        <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                            <Share2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Right Side: QR Code Stub */}
                <div className="relative sm:w-48 bg-black/40 border-t sm:border-t-0 sm:border-l border-white/10 p-6 flex flex-col items-center justify-center gap-4">
                    {/* Perforated Line Visual */}
                    <div className="absolute left-0 top-0 bottom-0 w-px hidden sm:flex flex-col justify-between -ml-[1px]">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-[2px] h-2 bg-text-muted/20 my-1" />
                        ))}
                    </div>

                    <div className="w-24 h-24 bg-white p-2 rounded-lg">
                        <QrCode className="w-full h-full text-black" />
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-text-muted uppercase tracking-wider mb-1">Pass Type</div>
                        <div className="text-sm font-bold text-white">General Entry</div>
                    </div>
                    <div className="text-[10px] font-mono text-text-muted text-center">
                        Non-Transferable
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
