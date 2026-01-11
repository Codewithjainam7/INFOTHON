'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard } from '@/components/ui'
import { Footer } from '@/components/sections'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-glow-cyan/60 group-focus-within:text-glow-cyan transition-colors">
                    {icon}
                </div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg px-12 py-3.5 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 font-mono text-sm"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-glow-cyan/0 via-glow-cyan/5 to-glow-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            </div>
        </div>
    )
}

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            console.error('Login Error:', error)
            alert('Login failed: ' + error.message)
            setIsSubmitting(false)
            return
        }

        if (data.session) {
            // Basic local cache if needed, but session is managed by Supabase
            /* localStorage.setItem('infothon_user', JSON.stringify({
               email: formData.email,
               id: data.user.id
           })) */

            router.push('/profile')
            router.refresh()
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
                                            // AUTH_REQUIRED
                                        </span>
                                    </div>
                                </motion.div>

                                <NeonText as="h1" color="gradient" className="text-3xl sm:text-4xl md:text-5xl mb-3">
                                    System Access
                                </NeonText>
                                <p className="text-text-secondary text-sm">
                                    Login to access your registered events and profile
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
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        icon={
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
                                                    Authenticating...
                                                </>
                                            ) : (
                                                <>
                                                    Access Dashboard
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                                                    </svg>
                                                </>
                                            )}
                                        </GlowButton>
                                    </div>
                                </form>

                                {/* Divider */}
                                <div className="mt-6 pt-6 border-t border-glow-cyan/20 text-center">
                                    <p className="text-text-muted text-sm">
                                        New user?{' '}
                                        <Link href="/signup" className="text-glow-cyan hover:underline">
                                            Create an account
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
                    </div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
