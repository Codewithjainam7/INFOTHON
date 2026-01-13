'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { createClient } from '@/lib/supabase'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

function CyberInput({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon,
    required = false
}: {
    label: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
    required?: boolean
}) {
    return (
        <div className="relative group">
            <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-glow-cyan/60 group-focus-within:text-glow-cyan transition-colors z-20 pointer-events-none">
                    {icon}
                </div>
                <div className="absolute inset-0 z-0 bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg group-focus-within:border-glow-cyan group-focus-within:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 pointer-events-none" />
                <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-glow-cyan/0 via-glow-cyan/5 to-glow-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className="relative z-10 w-full bg-transparent px-12 py-3.5 text-white placeholder-text-muted focus:outline-none font-mono text-sm"
                />
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])
    const [formData, setFormData] = useState({
        college: '',
        cc: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [userName, setUserName] = useState<string>('')

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // If user already has college info, redirect to profile
            if (user.user_metadata?.college) {
                router.push('/profile')
                return
            }

            // Set name from Google
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        }
        checkUser()
    }, [router, supabase])

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        setError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.college.trim()) {
            setError('College name is required')
            return
        }

        setIsSubmitting(true)
        setError(null)

        const { error } = await supabase.auth.updateUser({
            data: {
                college: formData.college,
                cc: formData.cc || ''
            }
        })

        if (error) {
            console.error('Update Error:', error)
            setError(error.message)
            setIsSubmitting(false)
            return
        }

        router.push('/profile')
        router.refresh()
    }

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg4.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-28 pb-16 flex items-center">
                <div className="section-container px-4 sm:px-6 w-full">
                    <div className="max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Header */}
                            <div className="flex flex-col items-center justify-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-4"
                                >
                                    <div className="px-4 py-1.5 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                        <span className="font-cyber text-xs text-glow-cyan tracking-widest">
                                            COMPLETE_PROFILE
                                        </span>
                                    </div>
                                </motion.div>

                                <div className="relative inline-block mb-3">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                        <ScrambleText
                                            text={`Welcome, ${userName}!`}
                                            revealSpeed={50}
                                            scrambleSpeed={30}
                                            delay={300}
                                        />
                                    </h1>
                                </div>
                                <p className="text-text-secondary text-sm text-center">
                                    Complete your profile to access INFOTHON 2026 events
                                </p>
                            </div>

                            {/* Form Container */}
                            <div className="glitch-container rounded-xl p-8 relative group border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-glow-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                                {/* Border Glow Pulse */}
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

                                <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            {error}
                                        </motion.div>
                                    )}

                                    <CyberInput
                                        label="College / Institution"
                                        placeholder="Your college name"
                                        value={formData.college}
                                        onChange={handleChange('college')}
                                        required
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                                            </svg>
                                        }
                                    />

                                    <CyberInput
                                        label="Campus Coordinator Code (Optional)"
                                        placeholder="Enter CC code if you have one"
                                        value={formData.cc}
                                        onChange={handleChange('cc')}
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                            </svg>
                                        }
                                    />

                                    <div className="pt-4">
                                        <GlowButton
                                            onClick={() => { }}
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    Complete Profile
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </GlowButton>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
