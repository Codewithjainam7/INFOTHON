'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { ArrowLeft, Users, User, Mail, Phone, School, CreditCard, Check, Zap, Shield, AlertTriangle } from 'lucide-react'
import { eventPackages, colorMap } from '@/data'
import { createClient } from '@/lib/supabase'
import { SmoothScroll, GlowCursor, GlitchOverlay } from '@/components/effects'
import { FloatingNavbar } from '@/components/navigation'
import { Footer } from '@/components/sections'

// Lazy load Background3D
const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const supabase = createClient()

interface TeamMember {
    name: string
    email: string
    phone: string
    college: string
}

// Local Intense Glitch Text
const IntenseGlitchText = ({ text, className = "", as: Component = "h1" }: { text: string, className?: string, as?: any }) => {
    return (
        <Component className={`relative inline-block ${className} group`}>
            {/* Main Text */}
            <span className="relative z-10">{text}</span>

            {/* Glitch Layer 1 - Cyan - Constant Jitter */}
            <motion.span
                className="absolute top-0 left-0 -ml-[2px] text-[#00f0ff] opacity-70 mix-blend-screen pointer-events-none"
                animate={{
                    x: [-2, 2, -1, 3, 0],
                    y: [1, -1, 0, 2, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
                }}
                transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            >
                {text}
            </motion.span>

            {/* Glitch Layer 2 - Violet - Random Jumps */}
            <motion.span
                className="absolute top-0 left-0 ml-[2px] text-[#8b5cf6] opacity-70 mix-blend-screen pointer-events-none"
                animate={{
                    x: [0, -3, 3, 0],
                    y: [0, 2, -2, 0]
                }}
                transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            >
                {text}
            </motion.span>

            {/* Glitch Layer 3 - White Flash */}
            <motion.span
                className="absolute inset-0 text-white mix-blend-overlay pointer-events-none"
                animate={{
                    opacity: [0, 1, 0, 0.5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                }}
            >
                {text}
            </motion.span>
        </Component>
    )
}

export default function TeamRegistrationPage() {
    const router = useRouter()
    const params = useParams()
    const eventId = params?.eventId as string

    const [event, setEvent] = useState<any>(null)
    const [teamName, setTeamName] = useState('')
    const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [errors, setErrors] = useState<string[]>([])
    const [registrationId, setRegistrationId] = useState<string | null>(null)
    const [showGlitchEntrance, setShowGlitchEntrance] = useState(true)
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)

    // Entrance Effect
    useEffect(() => {
        const timer = setTimeout(() => setShowGlitchEntrance(false), 2000)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const foundEvent = eventPackages.find(e => e.id === eventId)
        if (foundEvent) {
            setEvent(foundEvent)
            const initialMembers: TeamMember[] = [{
                name: '', email: '', phone: '', college: ''
            }]
            setMembers(initialMembers)
        }

        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login?next=/register/' + eventId)
            } else {
                setUser(user)
                const metadata = user.user_metadata || {}
                setMembers(prev => {
                    const updated = [...prev]
                    if (updated[0]) {
                        updated[0] = {
                            name: metadata.full_name || '',
                            email: user.email || '',
                            phone: metadata.phone || '',
                            college: metadata.college || ''
                        }
                    }
                    return updated
                })

                // Check pending registration
                const { data: existingReg } = await supabase
                    .from('registrations')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('event_id', eventId)
                    .eq('payment_status', 'pending')
                    .single()

                if (existingReg) {
                    setTeamName(existingReg.team_name || '')
                    setRegistrationId(existingReg.id)
                }
            }
        }
        checkAuth()
    }, [eventId, router])

    const colors = event ? colorMap[event.color] || colorMap.cyan : colorMap.cyan

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        setMembers(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const addMember = () => {
        if (event && members.length < event.teamMaxSize) {
            setMembers(prev => [...prev, { name: '', email: '', phone: '', college: '' }])
        }
    }

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(prev => prev.filter((_, i) => i !== index))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []
        if (!teamName.trim()) newErrors.push('Team name is required')

        members.forEach((member, i) => {
            if (i === 0) {
                if (!member.name.trim()) newErrors.push(`Team Leader: Name is required`)
                if (!member.email.trim()) newErrors.push(`Team Leader: Email is required`)
                if (!member.phone.trim()) newErrors.push(`Team Leader: Phone is required`)
                if (!member.college.trim()) newErrors.push(`Team Leader: College is required`)
            } else {
                const isPartiallyFilled = member.name.trim() || member.email.trim() || member.phone.trim() || member.college.trim()
                if (isPartiallyFilled) {
                    if (!member.name.trim()) newErrors.push(`Member ${i + 1}: Name is required`)
                    if (!member.email.trim()) newErrors.push(`Member ${i + 1}: Email is required`)
                    if (!member.phone.trim()) newErrors.push(`Member ${i + 1}: Phone is required`)
                    if (!member.college.trim()) newErrors.push(`Member ${i + 1}: College is required`)
                }
            }
        })

        setErrors(newErrors)
        return newErrors.length === 0
    }

    const savePendingRegistration = async () => {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 6).toUpperCase()
        const teamId = `TEAM-${event.id.toUpperCase().slice(0, 4)}-${timestamp.toString(36).toUpperCase().slice(-4)}${random}`
        const ticketId = `INFOTHON-${event.id.toUpperCase().slice(0, 4)}-${timestamp.toString(36).toUpperCase().slice(-4)}${random}`

        const regData = {
            user_id: user.id,
            user_email: user.email,
            event_id: event.id,
            event_name: event.title,
            event_date: event.date,
            is_team_pass: true,
            team_name: teamName,
            team_size: members.length,
            member_1_name: members[0]?.name || '',
            member_1_email: members[0]?.email || '',
            member_1_phone: members[0]?.phone || '',
            member_1_college: members[0]?.college || '',
            member_1_verified: false,
            member_2_name: members[1]?.name || '',
            member_2_email: members[1]?.email || '',
            member_2_phone: members[1]?.phone || '',
            member_2_college: members[1]?.college || '',
            member_2_verified: false,
            member_3_name: members[2]?.name || '',
            member_3_email: members[2]?.email || '',
            member_3_phone: members[2]?.phone || '',
            member_3_college: members[2]?.college || '',
            member_3_verified: false,
            member_4_name: members[3]?.name || '',
            member_4_email: members[3]?.email || '',
            member_4_phone: members[3]?.phone || '',
            member_4_college: members[3]?.college || '',
            member_4_verified: false,
            member_5_name: members[4]?.name || '',
            member_5_email: members[4]?.email || '',
            member_5_phone: members[4]?.phone || '',
            member_5_college: members[4]?.college || '',
            member_5_verified: false,
            details_locked: true,
            amount_paid: event.price,
            payment_status: 'pending'
        }

        if (registrationId) {
            const { error } = await supabase.from('registrations').update(regData).eq('id', registrationId)
            if (error) throw error
            return registrationId
        } else {
            const { data, error } = await supabase.from('registrations').insert({
                ...regData, ticket_id: ticketId, team_id: teamId
            }).select().single()
            if (error) throw error
            setRegistrationId(data.id)
            return data.id
        }
    }

    const handlePayment = async () => {
        if (!validateForm()) return
        if (!razorpayLoaded) {
            setErrors(['Payment gateway not ready. Please refresh the page.'])
            return
        }

        setIsLoading(true)
        try {
            const regId = await savePendingRegistration()

            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: event.price,
                    eventId: event.id,
                    eventName: event.title,
                    registrationId: regId
                })
            })

            if (!res.ok) throw new Error('Failed to create order')

            const { orderId } = await res.json()

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: event.price * 100,
                currency: 'INR',
                name: 'INFOTHON × 2K26',
                description: `Team Registration - ${event.title}`,
                order_id: orderId,
                handler: async function (response: any) {
                    await confirmRegistration(response.razorpay_payment_id, regId!)
                },
                prefill: {
                    name: members[0]?.name,
                    email: members[0]?.email,
                    contact: members[0]?.phone
                },
                theme: { color: '#00f5ff' }
            }

            const razor = new (window as any).Razorpay(options)
            razor.on('payment.failed', function (response: any) {
                setErrors(['Payment cancelled or failed. You can complete payment from your Profile page.'])
            });
            razor.open()
        } catch (error: any) {
            console.error('Payment error:', error)
            setErrors([error.message || 'Payment initialization failed. Please try again.'])
        } finally {
            setIsLoading(false)
        }
    }

    const confirmRegistration = async (paymentId: string, regId: string) => {
        try {
            const { error } = await supabase
                .from('registrations')
                .update({ payment_id: paymentId, payment_status: 'paid', details_locked: true })
                .eq('id', regId)

            if (error) throw error
            router.push('/profile?registered=true')
        } catch (error) {
            console.error('Confirmation error:', error)
            setErrors(['Payment successful but confirmation failed. Please contact support.'])
        }
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-glow-cyan animate-pulse font-mono tracking-widest">INITIALIZING EVENT DATA...</div>
            </div>
        )
    }

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
                strategy="lazyOnload"
            />

            {showGlitchEntrance && <GlitchOverlay />}

            <SmoothScroll>
                <GlowCursor />
                <Background3D backgroundImage="/images/bg_img.540Z.png" />
                <FloatingNavbar />

                <main className="min-h-screen relative z-10 pt-24 pb-20 px-4">
                    {/* Decorative Elements matching Landing Page */}
                    <div className="fixed inset-0 pointer-events-none z-0">
                        {/* Scanlines */}
                        <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}></div>
                    </div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        <Link href="/register" className="inline-flex items-center gap-2 text-text-muted hover:text-glow-cyan transition-colors mb-8 group font-mono text-sm">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            ABORT / RETURN TO EVENTS
                        </Link>

                        {/* Header Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8 md:mb-12 relative"
                        >
                            <div className="flex flex-col items-center">
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 border ${colors.border} bg-black/40 backdrop-blur-md text-glow-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    TEAM PROTOCOL: {event.category}
                                </div>

                                <IntenseGlitchText
                                    text={event.title}
                                    className="text-4xl sm:text-6xl md:text-8xl font-heading font-black mb-4 md:mb-6 uppercase tracking-tighter block text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                />

                                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-glow-cyan to-transparent mb-6 opacity-50" />

                                <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed relative">
                                    <span className="text-glow-cyan font-bold">&gt;_</span> Initialize team sequence. required: {event.teamMinSize}-{event.teamMaxSize} units.
                                    <br />
                                    <span className="text-glow-cyan font-bold">&gt;_</span> Secure channel established.
                                </p>
                            </div>
                        </motion.div>

                        {/* Progress Steps */}
                        <div className="flex justify-center mb-8 md:mb-12">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <motion.div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all backdrop-blur-md ${currentStep >= step
                                            ? 'border-glow-cyan bg-glow-cyan/10 text-glow-cyan shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                                            : 'border-white/10 bg-white/5 text-text-muted'
                                            }`}
                                    >
                                        {currentStep > step ? <Check className="w-6 h-6" /> : `0${step}`}
                                    </motion.div>
                                    {step < 3 && (
                                        <div className={`w-16 md:w-24 h-0.5 ${currentStep > step ? 'bg-glow-cyan shadow-[0_0_10px_rgba(0,245,255,0.4)]' : 'bg-white/10'}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Form Container */}
                        <motion.div
                            className="relative rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.05)] group/form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Random Glitch Overlay on Form */}
                            <motion.div
                                className="absolute inset-0 bg-white/5 pointer-events-none z-50 mix-blend-overlay"
                                animate={{ opacity: [0, 0.05, 0, 0.02, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Corner Accents - Glitching */}
                            <motion.div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-glow-cyan" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
                            <motion.div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-glow-violet" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                            <motion.div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-glow-violet" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                            <motion.div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-glow-cyan" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.4, repeat: Infinity }} />

                            <div className="p-6 md:p-10 relative z-10">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: Team Info */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h2 className="text-xl md:text-3xl font-heading font-bold mb-6 md:mb-8 flex items-center gap-3 text-white border-b border-white/10 pb-4 tracking-tight">
                                                <Users className="w-6 h-6 md:w-8 md:h-8 text-glow-cyan" />
                                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-glow-cyan">SQUAD CONFIGURATION</span>
                                            </h2>

                                            <div className="space-y-8">
                                                <div className="group/input relative">
                                                    <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase group-hover/input:text-white transition-colors relative z-10">
                                                        Identity Designation (Team Name)
                                                    </label>
                                                    <motion.div
                                                        className="relative z-10"
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                    >
                                                        <input
                                                            type="text"
                                                            value={teamName}
                                                            onChange={(e) => setTeamName(e.target.value)}
                                                            placeholder="ENTER_TEAM_NAME"
                                                            className="w-full px-4 py-4 md:px-6 md:py-5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-text-muted/30 focus:border-glow-cyan focus:outline-none focus:bg-glow-cyan/5 focus:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all font-mono text-base md:text-xl tracking-wider uppercase"
                                                        />
                                                        {/* Glitch Border on Input */}
                                                        <motion.div
                                                            className="absolute inset-0 rounded-xl border-2 border-glow-violet opacity-0 pointer-events-none"
                                                            animate={{
                                                                opacity: [0, 0, 1, 0],
                                                                x: [-2, 2, -2, 2],
                                                                y: [-2, 2, -2, 2]
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                                repeat: Infinity,
                                                                repeatDelay: 4
                                                            }}
                                                        />
                                                        {/* Input Crosshair Decorative */}
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-focus-within/input:text-glow-cyan transition-colors z-30">
                                                            [<span className="w-2 h-2 bg-current inline-block mx-1 animate-pulse" />]
                                                        </div>
                                                    </motion.div>
                                                </div>

                                                <div className="p-5 rounded-xl bg-glow-cyan/5 border border-glow-cyan/20 relative overflow-hidden backdrop-blur-md group/info hover:border-glow-cyan/50 transition-colors">
                                                    <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />
                                                    {/* Info Box Glitch Effect */}
                                                    <motion.div
                                                        className="absolute inset-0 bg-glow-cyan/10 mix-blend-overlay opacity-0"
                                                        animate={{ opacity: [0, 0.4, 0] }}
                                                        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
                                                    />

                                                    <div className="flex items-center gap-3 text-glow-cyan mb-2 relative z-10">
                                                        <Shield className="w-5 h-5 group-hover/info:rotate-12 transition-transform" />
                                                        <span className="font-bold font-cyber tracking-wide">MANDATORY PROTOCOLS</span>
                                                    </div>
                                                    <p className="text-text-secondary text-sm leading-relaxed relative z-10 font-mono">
                                                        REQUIRED UNITS: <span className="text-white font-bold">{event.teamMinSize}-{event.teamMaxSize}</span><br />
                                                        VERIFICATION: Valid College ID + Aadhar Card required at entry point.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-12">
                                                <motion.button
                                                    onClick={() => teamName.trim() && setCurrentStep(2)}
                                                    disabled={!teamName.trim()}
                                                    className="relative px-8 py-4 bg-glow-cyan/10 text-glow-cyan font-bold font-cyber tracking-widest text-sm border border-glow-cyan/50 hover:bg-glow-cyan hover:text-black transition-all group/btn overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                                    whileHover={{
                                                        skewX: [0, -10, 10, -5, 5, 0],
                                                        scale: 1.05,
                                                        transition: { duration: 0.3 }
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {/* Button Glitch Layers */}
                                                    <div className="absolute inset-0 bg-glow-violet mix-blend-color-dodge opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                                                    <div className="absolute inset-0 translate-x-[100%] group-hover/btn:translate-x-[-100%] bg-white/20 skew-x-12 transition-transform duration-700" />

                                                    <span className="relative z-10 flex items-center gap-2">
                                                        INITIALIZE OPERATIVES
                                                        <Zap className="w-4 h-4 fill-current group-hover/btn:animate-ping" />
                                                    </span>
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Team Members */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h2 className="text-lg md:text-2xl font-heading font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white border-b border-white/10 pb-4">
                                                <User className="w-5 h-5 md:w-6 md:h-6 text-glow-cyan" />
                                                <span className="truncate">OPERATIVE DETAILS ({members.length}/{event.teamMaxSize})</span>
                                            </h2>

                                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                {members.map((member, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group hover:bg-white/10"
                                                    >
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-glow-cyan font-bold font-cyber tracking-wide text-sm">
                                                                // UNIT_0{index + 1} {index === 0 && '[LEADER]'}
                                                            </span>
                                                            {index > 0 && (
                                                                <button
                                                                    onClick={() => removeMember(index)}
                                                                    className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider hover:underline"
                                                                >
                                                                    TERMINATE_UNIT
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {['name', 'email', 'phone', 'college'].map((field) => (
                                                                <div key={field} className="space-y-1">
                                                                    <div className="relative">
                                                                        <input
                                                                            type={field === 'email' ? 'email' : 'text'}
                                                                            value={(member as any)[field]}
                                                                            onChange={(e) => updateMember(index, field as keyof TeamMember, e.target.value)}
                                                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                                                            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none text-sm font-mono focus:shadow-[0_0_10px_rgba(0,245,255,0.1)] transition-all"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="mt-6">
                                                {members.length < event.teamMaxSize && (
                                                    <button
                                                        onClick={addMember}
                                                        className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-text-muted hover:border-glow-cyan/50 hover:text-glow-cyan hover:bg-glow-cyan/5 transition-all flex items-center justify-center gap-2 group font-mono text-sm"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-glow-cyan/20 transition-colors">+</div>
                                                        ADD OPERATIVE SLOT
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6 md:mt-8">
                                                <button
                                                    onClick={() => setCurrentStep(1)}
                                                    className="px-4 md:px-6 py-3 rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 font-bold transition-all border border-white/10 text-sm md:text-base order-2 sm:order-1"
                                                >
                                                    BACK
                                                </button>
                                                <button
                                                    onClick={() => setCurrentStep(3)}
                                                    className="px-4 md:px-6 py-3 rounded-xl bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 font-bold transition-all flex items-center justify-center gap-2 border border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] text-sm md:text-base order-1 sm:order-2"
                                                >
                                                    PROCEED TO SUMMARY
                                                    <CreditCard className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Review & Payment */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h2 className="text-lg md:text-xl font-heading font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white border-b border-white/10 pb-4">
                                                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-glow-cyan" />
                                                MISSION SUMMARY
                                            </h2>

                                            {/* Bill */}
                                            <div className="space-y-4 mb-6 md:mb-8">
                                                <div className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden backdrop-blur-sm group/summary hover:border-glow-cyan/30 transition-colors">
                                                    <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10" />

                                                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                                                        <span className="text-glow-cyan font-mono text-xs uppercase tracking-widest">Operation</span>
                                                        <span className="text-white font-cyber font-bold tracking-wide uppercase">{event.title}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-text-muted font-mono text-xs uppercase tracking-widest">Squad ID</span>
                                                        <span className="text-white font-mono uppercase truncate max-w-[200px] text-right text-sm">{teamName}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center mb-6">
                                                        <span className="text-text-muted font-mono text-xs uppercase tracking-widest">Unit Count</span>
                                                        <span className="text-white font-mono uppercase text-sm">{members.length} Operatives</span>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-dashed border-white/10 gap-2">
                                                        <span className="text-glow-cyan font-cyber font-bold text-sm md:text-lg tracking-widest">TOTAL_ACCESS_FEE</span>
                                                        <span className="text-3xl md:text-4xl font-heading font-black text-white tracking-tighter">₹{event.price}</span>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Errors */}
                                            {errors.length > 0 && (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-pulse">
                                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span className="font-bold">CRITICAL_ERROR</span>
                                                    </div>
                                                    <ul className="text-sm text-red-300 space-y-1 list-disc list-inside font-mono">
                                                        {errors.map((err, i) => (
                                                            <li key={i}>{err}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}


                                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-4 md:mt-6">
                                                <button
                                                    onClick={() => setCurrentStep(2)}
                                                    className="px-4 md:px-6 py-3 rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 font-bold transition-all border border-white/10 text-sm md:text-base order-2 sm:order-1"
                                                >
                                                    BACK
                                                </button>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={isLoading || !razorpayLoaded}
                                                    className="px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-black hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] relative overflow-hidden group text-sm md:text-base order-1 sm:order-2"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                                    {isLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                            PROCESSING...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                                                            INITIATE PAYMENT
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div >
                </main >

                <Footer />
            </SmoothScroll >
        </>
    )
}
