'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Users, User, Mail, Phone, School, CreditCard, Check, Zap, Shield, AlertTriangle } from 'lucide-react'
import { eventPackages, colorMap } from '@/data/packages'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

    useEffect(() => {
        const foundEvent = eventPackages.find(e => e.id === eventId)
        if (foundEvent) {
            setEvent(foundEvent)
            // Initialize member slots based on team size
            const minMembers = foundEvent.teamMinSize || 1
            const initialMembers: TeamMember[] = Array(minMembers).fill(null).map(() => ({
                name: '',
                email: '',
                phone: '',
                college: ''
            }))
            setMembers(initialMembers)
        }

        // Check auth
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
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
        if (members.length > (event?.teamMinSize || 1)) {
            setMembers(prev => prev.filter((_, i) => i !== index))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: string[] = []

        if (!teamName.trim()) {
            newErrors.push('Team name is required')
        }

        members.forEach((member, i) => {
            if (!member.name.trim()) newErrors.push(`Member ${i + 1}: Name is required`)
            if (!member.email.trim()) newErrors.push(`Member ${i + 1}: Email is required`)
            if (!member.phone.trim()) newErrors.push(`Member ${i + 1}: Phone is required`)
            if (!member.college.trim()) newErrors.push(`Member ${i + 1}: College is required`)
        })

        setErrors(newErrors)
        return newErrors.length === 0
    }

    const handlePayment = async () => {
        if (!validateForm()) return

        setIsLoading(true)
        try {
            // Create Razorpay order
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: event.price,
                    eventId: event.id,
                    eventName: event.title
                })
            })

            const { orderId } = await res.json()

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: event.price * 100,
                currency: 'INR',
                name: 'INFOTHON × 2K26',
                description: `Team Registration - ${event.title}`,
                order_id: orderId,
                handler: async function (response: any) {
                    // Payment successful - generate team pass
                    await generateTeamPass(response.razorpay_payment_id)
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
            razor.open()
        } catch (error) {
            console.error('Payment error:', error)
            setErrors(['Payment failed. Please try again.'])
        } finally {
            setIsLoading(false)
        }
    }

    const generateTeamPass = async (paymentId: string) => {
        try {
            // Generate unique team ID
            const timestamp = Date.now()
            const random = Math.random().toString(36).substring(2, 6).toUpperCase()
            const teamId = `TEAM-${event.id.toUpperCase().slice(0, 4)}-${timestamp.toString(36).toUpperCase().slice(-4)}${random}`
            const ticketId = `INFOTHON-${event.id.toUpperCase().slice(0, 4)}-${timestamp.toString(36).toUpperCase().slice(-4)}${random}`

            // Insert team registration
            const { error } = await supabase.from('registrations').insert({
                ticket_id: ticketId,
                team_id: teamId,
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
                payment_id: paymentId,
                amount_paid: event.price
            })

            if (error) throw error

            // Redirect to profile
            router.push('/profile?registered=true')
        } catch (error) {
            console.error('Registration error:', error)
            setErrors(['Registration failed. Please contact support.'])
        }
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-glow-cyan">Loading...</div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-bg-primary relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,245,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%2300f5ff' stroke-width='0.1' opacity='0.3'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%2300f5ff' stroke-width='0.1' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
                {/* Back Button */}
                <Link href="/register" className="inline-flex items-center gap-2 text-text-muted hover:text-glow-cyan transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 ${colors.bg} ${colors.border} ${colors.text} border`}>
                        {event.category} • Team of {event.teamMinSize}-{event.teamMaxSize}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                        Register for <span className="text-glow-cyan">{event.title}</span>
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Fill in your team details below. All team members must be present with Aadhar cards for verification.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {/* Progress Steps */}
                    <div className="flex justify-center mb-12">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${currentStep >= step
                                            ? 'border-glow-cyan bg-glow-cyan/20 text-glow-cyan'
                                            : 'border-white/20 bg-white/5 text-text-muted'
                                        }`}
                                    animate={currentStep === step ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    {currentStep > step ? <Check className="w-6 h-6" /> : step}
                                </motion.div>
                                {step < 3 && (
                                    <div className={`w-16 md:w-24 h-0.5 ${currentStep > step ? 'bg-glow-cyan' : 'bg-white/20'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form Container */}
                    <motion.div
                        className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-glow-cyan" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-glow-violet" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-glow-violet" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-glow-cyan" />

                        <div className="p-6 md:p-8">
                            {/* Step 1: Team Info */}
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                            <Users className="w-6 h-6 text-glow-cyan" />
                                            Team Information
                                        </h2>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Team Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={teamName}
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    placeholder="Enter your team name"
                                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-text-muted focus:border-glow-cyan focus:outline-none focus:ring-1 focus:ring-glow-cyan/50 transition-all"
                                                />
                                            </div>

                                            <div className="p-4 rounded-lg bg-glow-cyan/10 border border-glow-cyan/30">
                                                <div className="flex items-center gap-3 text-glow-cyan mb-2">
                                                    <Shield className="w-5 h-5" />
                                                    <span className="font-bold">Important</span>
                                                </div>
                                                <p className="text-text-secondary text-sm">
                                                    Team size: {event.teamMinSize}-{event.teamMaxSize} members. All members must
                                                    bring their Aadhar cards for verification at the event.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-8">
                                            <button
                                                onClick={() => teamName.trim() && setCurrentStep(2)}
                                                disabled={!teamName.trim()}
                                                className="px-6 py-3 rounded-lg bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all flex items-center gap-2"
                                            >
                                                Next: Team Members
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
                                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                            <User className="w-6 h-6 text-glow-cyan" />
                                            Team Members ({members.length}/{event.teamMaxSize})
                                        </h2>

                                        <div className="space-y-6">
                                            {members.map((member, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-glow-cyan font-bold">
                                                            Member {index + 1} {index === 0 && '(Team Leader)'}
                                                        </span>
                                                        {index >= event.teamMinSize && (
                                                            <button
                                                                onClick={() => removeMember(index)}
                                                                className="text-red-400 hover:text-red-300 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-text-muted mb-1">Full Name *</label>
                                                            <div className="relative">
                                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="text"
                                                                    value={member.name}
                                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                                    placeholder="Enter full name"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-text-muted focus:border-glow-cyan focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-text-muted mb-1">Email *</label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="email"
                                                                    value={member.email}
                                                                    onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                                    placeholder="Enter email"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-text-muted focus:border-glow-cyan focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-text-muted mb-1">Phone *</label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="tel"
                                                                    value={member.phone}
                                                                    onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                                    placeholder="Enter phone"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-text-muted focus:border-glow-cyan focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-text-muted mb-1">College *</label>
                                                            <div className="relative">
                                                                <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                                <input
                                                                    type="text"
                                                                    value={member.college}
                                                                    onChange={(e) => updateMember(index, 'college', e.target.value)}
                                                                    placeholder="Enter college"
                                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-white placeholder-text-muted focus:border-glow-cyan focus:outline-none text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {members.length < event.teamMaxSize && (
                                                <button
                                                    onClick={addMember}
                                                    className="w-full py-3 rounded-lg border-2 border-dashed border-white/20 text-text-muted hover:border-glow-cyan hover:text-glow-cyan transition-all"
                                                >
                                                    + Add Team Member
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <button
                                                onClick={() => setCurrentStep(1)}
                                                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 font-bold transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={() => setCurrentStep(3)}
                                                className="px-6 py-3 rounded-lg bg-glow-cyan/20 text-glow-cyan hover:bg-glow-cyan/30 font-bold transition-all flex items-center gap-2"
                                            >
                                                Next: Payment
                                                <CreditCard className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Step 3: Payment */}
                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-glow-cyan" />
                                            Review & Pay
                                        </h2>

                                        {/* Summary */}
                                        <div className="space-y-4 mb-8">
                                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-text-secondary">Event</span>
                                                    <span className="text-white font-bold">{event.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-text-secondary">Team Name</span>
                                                    <span className="text-glow-cyan font-bold">{teamName}</span>
                                                </div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-text-secondary">Team Size</span>
                                                    <span className="text-white">{members.length} members</span>
                                                </div>
                                                <div className="border-t border-white/10 my-4" />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold">Total Amount</span>
                                                    <span className="text-2xl font-bold text-glow-cyan">₹{event.price}</span>
                                                </div>
                                            </div>

                                            {/* Team Members Summary */}
                                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                                <h3 className="font-bold mb-3">Team Members</h3>
                                                <div className="space-y-2">
                                                    {members.map((m, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <Check className="w-4 h-4 text-green-400" />
                                                            <span className="text-white">{m.name}</span>
                                                            <span className="text-text-muted">({m.email})</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Errors */}
                                            {errors.length > 0 && (
                                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                                        <AlertTriangle className="w-5 h-5" />
                                                        <span className="font-bold">Please fix the following:</span>
                                                    </div>
                                                    <ul className="text-sm text-red-300 space-y-1">
                                                        {errors.map((err, i) => (
                                                            <li key={i}>• {err}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Aadhar Notice */}
                                            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                                <div className="flex items-center gap-2 text-amber-400">
                                                    <AlertTriangle className="w-5 h-5" />
                                                    <span className="font-bold">All team members must bring Aadhar cards for verification</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <button
                                                onClick={() => setCurrentStep(2)}
                                                className="px-6 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 font-bold transition-all"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handlePayment}
                                                disabled={isLoading}
                                                className="px-8 py-3 rounded-lg bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <>Processing...</>
                                                ) : (
                                                    <>
                                                        <Zap className="w-5 h-5" />
                                                        Pay ₹{event.price} & Register
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
