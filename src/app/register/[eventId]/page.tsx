'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Users, User, Mail, Phone, School, CreditCard, Check, Zap, Shield, AlertTriangle } from 'lucide-react'
import { eventPackages, colorMap } from '@/data'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

interface TeamMember {
    name: string
    email: string
    phone: string
    college: string
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
    const [registrationId, setRegistrationId] = useState<string | null>(null) // For pending registrations

    useEffect(() => {
        const foundEvent = eventPackages.find(e => e.id === eventId)
        if (foundEvent) {
            setEvent(foundEvent)
            // Initialize with just the leader (Member 1)
            const initialMembers: TeamMember[] = [{
                name: '',
                email: '',
                phone: '',
                college: ''
            }]
            setMembers(initialMembers)
        }

        // Check auth
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login?next=/register/' + eventId)
            } else {
                setUser(user)
                // Pre-fill first member with user data
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

                // Check for existing pending registration
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
                    // Restore members if possible (or just let them start over/continue)
                    // For now, we mainly want to catch the pending state to resume payment
                    // But if they are here, maybe they want to restart?
                    // Let's NOT force restore to keep it simple, but we will UPDATE this record instead of creating new
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
        if (members.length > 1) { // Always keep at least 1 (Leader)
            setMembers(prev => prev.filter((_, i) => i !== index))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []

        if (!teamName.trim()) {
            newErrors.push('Team name is required')
        }

        members.forEach((member, i) => {
            // Member 1 (Leader) is mandatory
            if (i === 0) {
                if (!member.name.trim()) newErrors.push(`Team Leader: Name is required`)
                if (!member.email.trim()) newErrors.push(`Team Leader: Email is required`)
                if (!member.phone.trim()) newErrors.push(`Team Leader: Phone is required`)
                if (!member.college.trim()) newErrors.push(`Team Leader: College is required`)
            } else {
                // Optional members: if ANY field is filled, ALL must be filled
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
            payment_status: 'pending' // Important
        }

        if (registrationId) {
            // Update existing pending record
            const { error } = await supabase
                .from('registrations')
                .update(regData)
                .eq('id', registrationId)

            if (error) throw error
            return registrationId
        } else {
            // Create new pending record
            const { data, error } = await supabase
                .from('registrations')
                .insert({
                    ...regData,
                    ticket_id: ticketId,
                    team_id: teamId,
                })
                .select()
                .single()

            if (error) throw error
            setRegistrationId(data.id)
            return data.id
        }
    }

    const handlePayment = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            // 1. Save Registration as Pending
            const regId = await savePendingRegistration()

            // 2. Create Razorpay order
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: event.price,
                    eventId: event.id,
                    eventName: event.title,
                    registrationId: regId // Pass this if needed by backend, or just for tracking
                })
            })

            const { orderId } = await res.json()

            // 3. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: event.price * 100,
                currency: 'INR',
                name: 'INFOTHON × 2K26',
                description: `Team Registration - ${event.title}`,
                order_id: orderId,
                handler: async function (response: any) {
                    // 4. Payment successful - Update to Paid
                    await confirmRegistration(response.razorpay_payment_id, regId!)
                },
                prefill: {
                    name: members[0]?.name,
                    email: members[0]?.email,
                    contact: members[0]?.phone
                },
                theme: {
                    color: '#00f5ff'
                }
            }

            const razor = new (window as any).Razorpay(options)
            razor.on('payment.failed', function (response: any) {
                // If failed/closed, user has a pending registration they can pay for later in profile
                setErrors(['Payment cancelled or failed. You can complete payment from your Profile page.'])
                // Optional: Redirect to profile directly?
                // router.push('/profile')
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
                .update({
                    payment_id: paymentId,
                    payment_status: 'paid', // Mark as paid
                    details_locked: true
                })
                .eq('id', regId)

            if (error) throw error

            // Redirect to profile with success
            router.push('/profile?registered=true')
        } catch (error) {
            console.error('Confirmation error:', error)
            setErrors(['Payment successful but confirmation failed. Please contact support.'])
        }
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-glow-cyan">Loading event details...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-bg-primary relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,245,255,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)]" />
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%2300f5ff' stroke-width='0.1' opacity='0.3'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%2300f5ff' stroke-width='0.1' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                <Link href="/register" className="inline-flex items-center gap-2 text-text-muted hover:text-glow-cyan transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4 border ${colors.border} bg-black/40 backdrop-blur-md text-glow-cyan shadow-[0_0_15px_rgba(34,211,238,0.3)]`}>
                        {event.category} • TEAM REGISTRATION
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-4 uppercase tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-glow-cyan to-white animate-pulse">
                            {event.title}
                        </span>
                    </h1>
                    <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto font-mono">
                        Assemble your squad. Rule the code.
                        <br />
                        <span className="text-glow-cyan">Team Size: {event.teamMinSize}-{event.teamMaxSize} Members</span>
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-12">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <motion.div
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${currentStep >= step
                                        ? 'border-glow-cyan bg-glow-cyan/20 text-glow-cyan shadow-[0_0_15px_rgba(0,245,255,0.4)]'
                                        : 'border-white/10 bg-white/5 text-text-muted'
                                        }`}
                                    animate={currentStep === step ? { scale: [1, 1.1, 1], borderColor: ['#00f5ff', '#ffffff', '#00f5ff'] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    {currentStep > step ? <Check className="w-6 h-6" /> : step}
                                </motion.div>
                                {step < 3 && (
                                    <div className={`w-16 md:w-24 h-0.5 ${currentStep > step ? 'bg-glow-cyan shadow-[0_0_10px_rgba(0,245,255,0.4)]' : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form Container */}
                    <motion.div
                        className="relative rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
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
                                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white">
                                            <Users className="w-6 h-6 text-glow-cyan" />
                                            Team Information
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                                                    Team Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    placeholder="ENTER_TEAM_NAME"
                                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none focus:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all font-mono"
                                                />
                                            </div>

                                            <div className="p-5 rounded-xl bg-glow-cyan/5 border border-glow-cyan/20">
                                                <div className="flex items-center gap-3 text-glow-cyan mb-2">
                                                    <Shield className="w-5 h-5" />
                                                    <span className="font-bold font-cyber tracking-wide">REQUIRED_DOCUMENTS</span>
                                                </div>
                                                <p className="text-text-secondary text-sm leading-relaxed">
                                                    Team size for this event is <span className="text-white font-bold">{event.teamMinSize}-{event.teamMaxSize} members</span>.
                                                    All team members must carry their valid college ID cards and Aadhar cards for verification at the venue.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-8">
                                            <button
                                                onClick={() => teamName.trim() && setCurrentStep(2)}
                                                disabled={!teamName.trim()}
                                                className="px-8 py-3 rounded-xl bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-2 border border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                                            >
                                                INITIALIZE MEMBERS
                                                <Zap className="w-4 h-4" />
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
                                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3 text-white">
                                            <User className="w-6 h-6 text-glow-cyan" />
                                            Operatives ({members.length}/{event.teamMaxSize})
                                        </h2>

                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {members.map((member, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-glow-cyan font-bold font-cyber tracking-wide text-sm">
                                                            // MEMBER_0{index + 1} {index === 0 && '[LEADER]'}
                                                        </span>
                                                        {index > 0 && ( // Allow removing any member except leader
                                                            <button
                                                                onClick={() => removeMember(index)}
                                                                className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider hover:underline"
                                                            >
                                                                REMOVE_UNIT
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="text"
                                                                    value={member.name}
                                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                                    placeholder="Full Name"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none text-sm font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="email"
                                                                    value={member.email}
                                                                    onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                                    placeholder="Email Address"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none text-sm font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="tel"
                                                                    value={member.phone}
                                                                    onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                                    placeholder="Phone Number"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none text-sm font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="relative">
                                                                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="text"
                                                                    value={member.college}
                                                                    onChange={(e) => updateMember(index, 'college', e.target.value)}
                                                                    placeholder="College Name"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-text-muted/50 focus:border-glow-cyan focus:outline-none text-sm font-mono"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-6 flex flex-col gap-4">
                                            {members.length < event.teamMaxSize && (
                                                <button
                                                    onClick={addMember}
                                                    className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-text-muted hover:border-glow-cyan/50 hover:text-glow-cyan hover:bg-glow-cyan/5 transition-all flex items-center justify-center gap-2 group"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-glow-cyan/20">+</div>
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
                                                className="px-6 py-3 rounded-xl bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 font-bold transition-all flex items-center gap-2 border border-glow-cyan/50"
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
                                        <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-3 text-white">
                                            <CreditCard className="w-6 h-6 text-glow-cyan" />
                                            Mission Summary
                                        </h2>

                                        {/* Bill */}
                                        <div className="space-y-4 mb-8">
                                            <div className="p-6 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <CreditCard className="w-24 h-24" />
                                                </div>

                                                <div className="flex justify-between items-center mb-4 relative z-10">
                                                    <span className="text-text-secondary text-sm uppercase tracking-wider">Operation</span>
                                                    <span className="text-white font-bold">{event.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-4 relative z-10">
                                                    <span className="text-text-secondary text-sm uppercase tracking-wider">Squad Name</span>
                                                    <span className="text-glow-cyan font-bold font-mono">{teamName}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-4 relative z-10">
                                                    <span className="text-text-secondary text-sm uppercase tracking-wider">Unit Count</span>
                                                    <span className="text-white">{members.length} Operatives</span>
                                                </div>

                                                <div className="border-t border-dashed border-white/20 my-4" />

                                                <div className="flex justify-between items-center relative z-10">
                                                    <span className="text-lg font-bold">TOTAL_ACCESS_FEE</span>
                                                    <span className="text-3xl font-heading font-black text-glow-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">₹{event.price}</span>
                                                </div>
                                            </div>

                                            {/* Errors */}
                                            {errors.length > 0 && (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span className="font-bold">CRITICAL_ERROR</span>
                                                    </div>
                                                    <ul className="text-sm text-red-300 space-y-1 list-disc list-inside">
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
                                                disabled={isLoading}
                                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-black hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                                            >
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
            </div>

            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        </main>
    )
}
