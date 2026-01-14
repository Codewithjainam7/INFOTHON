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

// Local GlitchText Component
const GlitchText = ({ text, className = "", as: Component = "h1" }: { text: string, className?: string, as?: any }) => {
    return (
        <Component className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -ml-[2px] text-glow-cyan opacity-70 animate-pulse">{text}</span>
            <span className="absolute top-0 left-0 ml-[2px] text-glow-violet opacity-70 animate-pulse delay-75">{text}</span>
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
        } catch (error) {
            console.error('Payment error:', error)
            setErrors(['Payment initialization failed. Please try again.'])
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
                            className="text-center mb-12"
                        >
                            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 border ${colors.border} bg-black/40 backdrop-blur-md text-glow-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                                TEAM PROTOCOL: {event.category}
                            </div>

                            <GlitchText
                                text={event.title}
                                className="text-5xl md:text-7xl font-heading font-black mb-4 uppercase tracking-tighter block text-white"
                            />

                            <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto font-mono leading-relaxed">
                                <span className="text-glow-cyan">&gt;</span> Initialize team sequence. required: {event.teamMinSize}-{event.teamMaxSize} units.
                                <br />
                                <span className="text-glow-cyan">&gt;</span> Secure channel established.
                            </p>
                        </motion.div>

                        {/* Progress Steps */}
                        <div className="flex justify-center mb-12">
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
                            className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.1)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-glow-cyan" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-glow-violet" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-glow-violet" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-glow-cyan" />

                            <div className="p-6 md:p-10">
                                <AnimatePresence mode="wait">
                                    {/* Step 1: Team Info */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h2 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                                <Users className="w-6 h-6 text-glow-cyan" />
                                                SQUAD CONFIGURATION
                                            </h2>

                                            <div className="space-y-8">
                                                <div>
                                                    <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                                                        Identity Designation (Team Name)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={teamName}
                                                        onChange={(e) => setTeamName(e.target.value)}
                                                        placeholder="ENTER_TEAM_NAME"
                                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none focus:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all font-mono text-lg"
                                                    />
                                                </div>

                                                <div className="p-5 rounded-xl bg-glow-cyan/5 border border-glow-cyan/20 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none" />
                                                    <div className="flex items-center gap-3 text-glow-cyan mb-2 relative z-10">
                                                        <Shield className="w-5 h-5" />
                                                        <span className="font-bold font-cyber tracking-wide">MANDATORY PROTOCOLS</span>
                                                    </div>
                                                    <p className="text-text-secondary text-sm leading-relaxed relative z-10">
                                                        REQUIRED UNITS: <span className="text-white font-bold">{event.teamMinSize}-{event.teamMaxSize}</span><br />
                                                        VERIFICATION: Valid College ID + Aadhar Card required at entry point.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end mt-10">
                                                <button
                                                    onClick={() => teamName.trim() && setCurrentStep(2)}
                                                    disabled={!teamName.trim()}
                                                    className="px-8 py-3 rounded-xl bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-2 border border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] group"
                                                >
                                                    INITIALIZE OPERATIVES
                                                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                </button>
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
                                            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                                <User className="w-6 h-6 text-glow-cyan" />
                                                OPERATIVE DETAILS ({members.length}/{event.teamMaxSize})
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

                                            <div className="flex justify-between mt-8">
                                                <button
                                                    onClick={() => setCurrentStep(1)}
                                                    className="px-6 py-3 rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 font-bold transition-all border border-white/10"
                                                >
                                                    BACK
                                                </button>
                                                <button
                                                    onClick={() => setCurrentStep(3)}
                                                    className="px-6 py-3 rounded-xl bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 font-bold transition-all flex items-center gap-2 border border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
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
                                            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-3 text-white border-b border-white/10 pb-4">
                                                <CreditCard className="w-6 h-6 text-glow-cyan" />
                                                MISSION SUMMARY
                                            </h2>

                                            {/* Bill */}
                                            <div className="space-y-4 mb-8">
                                                <div className="p-6 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden backdrop-blur-sm">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                                        <CreditCard className="w-24 h-24" />
                                                    </div>

                                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                                        <span className="text-text-secondary text-sm uppercase tracking-wider font-mono">Operation</span>
                                                        <span className="text-white font-bold">{event.title}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                                        <span className="text-text-secondary text-sm uppercase tracking-wider font-mono">Squad ID</span>
                                                        <span className="text-glow-cyan font-bold font-mono">{teamName}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                                        <span className="text-text-secondary text-sm uppercase tracking-wider font-mono">Unit Count</span>
                                                        <span className="text-white">{members.length} Operatives</span>
                                                    </div>

                                                    <div className="border-t border-dashed border-white/20 my-4" />

                                                    <div className="flex justify-between items-center relative z-10">
                                                        <span className="text-lg font-bold font-mono text-glow-cyan">TOTAL_ACCESS_FEE</span>
                                                        <span className="text-3xl font-heading font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">₹{event.price}</span>
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
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <button
                                                    onClick={() => setCurrentStep(2)}
                                                    className="px-6 py-3 rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 font-bold transition-all border border-white/10"
                                                >
                                                    BACK
                                                </button>
                                                <button
                                                    onClick={handlePayment}
                                                    disabled={isLoading || !razorpayLoaded}
                                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-black hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                                                    {isLoading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                            PROCESSING...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Zap className="w-5 h-5 fill-current" />
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
                    </div>
                </main>

                <Footer />
            </SmoothScroll>
        </>
    )
}
