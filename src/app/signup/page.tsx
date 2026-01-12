'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard } from '@/components/ui'
import { Footer } from '@/components/sections'
import { createClient } from '@/lib/supabase'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

// Cyberpunk Input Component
function CyberInput({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon
}: {
    label: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
}) {
    return (
        <div className="relative group">
            <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                {label}
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-glow-cyan/60 group-focus-within:text-glow-cyan transition-colors z-10 pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="relative z-10 w-full bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg px-12 py-3.5 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 font-mono text-sm"
                />
                <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-glow-cyan/0 via-glow-cyan/5 to-glow-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </div>
    )
}

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const supabase = createClient()
        // Supabase SignUp
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.name,
                    phone: formData.phone,
                    college: formData.college,
                    role: 'user', // Default role
                }
            }
        })

        if (error) {
            console.error('Signup Error:', error)
            alert('Signup failed: ' + error.message) // Simple alert for now
            setIsSubmitting(false)
            return
        }

        // Store basic user info in local storage as a fallback/cache
        if (data.user) {
            localStorage.setItem('infothon_user', JSON.stringify({
                name: formData.name,
                email: formData.email,
                signedUp: true,
                id: data.user.id
            }))
            setSubmitted(true)
        }

        setIsSubmitting(false)
    }

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg4.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-28 pb-16 flex items-center">
                <div className="section-container px-4 sm:px-6 w-full">
                    <div className="max-w-lg mx-auto">
                        {!submitted ? (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="inline-block mb-4"
                                    >
                                        <div className="glass px-4 py-2 rounded-full">
                                            <span className="font-mono text-xs text-glow-cyan tracking-wider">
                                                // SYSTEM_ACCESS_REQUIRED
                                            </span>
                                        </div>
                                    </motion.div>

                                    <NeonText as="h1" color="gradient" className="text-3xl sm:text-4xl md:text-5xl mb-3">
                                        Create Account
                                    </NeonText>
                                    <p className="text-text-secondary text-sm">
                                        Sign up to register for INFOTHON 2026 events
                                    </p>
                                </div>

                                {/* Form Card */}
                                <GlassCard className="p-6 sm:p-8" glowColor="cyan">
                                    {/* Scan Line Effect */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/40 to-transparent"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    />

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <CyberInput
                                            label="Full Name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange('name')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Email Address"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleChange('email')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Phone Number"
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            value={formData.phone}
                                            onChange={handleChange('phone')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="College / Institution"
                                            placeholder="Your college name"
                                            value={formData.college}
                                            onChange={handleChange('college')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Password"
                                            type="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleChange('password')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange('confirmPassword')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                </svg>
                                            }
                                        />

                                        <div className="pt-4">
                                            <GlowButton
                                                size="lg"
                                                className="w-full justify-center"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Initialize Account
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </>
                                                )}
                                            </GlowButton>
                                        </div>
                                    </form>

                                    {/* Divider */}
                                    <div className="mt-6 pt-6 border-t border-glow-cyan/20 text-center">
                                        <p className="text-text-muted text-sm">
                                            Already have an account?{' '}
                                            <Link href="/register" className="text-glow-cyan hover:underline">
                                                Register for events
                                            </Link>
                                        </p>
                                    </div>
                                </GlassCard>

                                {/* Corner Decorations */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-glow-cyan/40 -translate-x-2 -translate-y-2" />
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-glow-cyan/40 translate-x-2 -translate-y-2" />
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-glow-cyan/40 -translate-x-2 translate-y-2" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-glow-cyan/40 translate-x-2 translate-y-2" />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <GlassCard className="p-8" glowColor="cyan">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-glow-cyan to-glow-violet flex items-center justify-center"
                                    >
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>

                                    <NeonText as="h2" color="cyan" className="text-2xl sm:text-3xl mb-3">
                                        Account Created!
                                    </NeonText>
                                    <p className="text-text-secondary mb-6">
                                        Welcome to INFOTHON 2026, {formData.name}!
                                    </p>

                                    <Link href="/register">
                                        <GlowButton size="lg">
                                            Register for Events
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </GlowButton>
                                    </Link>
                                </GlassCard>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
