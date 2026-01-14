'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Mail, Lock } from 'lucide-react'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard, ScrambleText } from '@/components/ui'
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
    icon
}: {
    label?: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
}) {
    return (
        <div className="relative group">
            {label && (
                <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                    {label}
                </label>
            )}
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-glow-cyan/60 group-focus-within:text-glow-cyan transition-colors z-20 pointer-events-none">
                    {icon}
                </div>
                {/* Background Layer with Blur to prevent text blurring */}
                <div className="absolute inset-0 z-0 bg-bg-primary/60 backdrop-blur-sm border border-glow-cyan/30 rounded-lg group-focus-within:border-glow-cyan group-focus-within:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all duration-300 pointer-events-none" />

                {/* Gradient Glow Layer */}
                <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-glow-cyan/0 via-glow-cyan/5 to-glow-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="relative z-10 w-full bg-transparent px-12 py-3.5 text-white placeholder-text-muted focus:outline-none font-mono text-sm"
                />
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
    const [error, setError] = useState<string | null>(null)

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        setError(null)
    }

    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.email.trim() || !formData.password) {
            setError('Please enter both email and password')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email address')
            return
        }

        setIsSubmitting(true)

        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            console.error('Login Error:', error)
            setError(error.message)
            setIsSubmitting(false)
            return
        }

        if (data.session) {
            router.push('/profile')
            router.refresh()
        }

        setIsSubmitting(false)
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            console.error('Google Sign-In Error:', error)
            setError(error.message)
            setIsGoogleLoading(false)
        }
    }

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg4.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-x-hidden">
                <div className="section-container px-4 sm:px-6 w-full">
                    <div className="max-w-lg mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-md"
                        >
                            {/* Header */}
                            <div className="flex flex-col items-center justify-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-4"
                                >
                                    <div className="px-4 py-1 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                        <span className="font-cyber text-xs text-glow-cyan tracking-widest">
                                            SYSTEM_ACCESS_REQUIRED
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Glitch Title */}
                                <div className="relative inline-block mb-3">
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-glow-cyan via-white to-glow-violet drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                            <ScrambleText
                                                text="System Access"
                                                revealSpeed={50}
                                                scrambleSpeed={60}
                                                delay={300}
                                            />
                                        </span>
                                    </h1>
                                    {/* Glitch layer - Cyan offset */}
                                    <motion.h1
                                        className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, -8, 4, -6, 0],
                                            y: [0, 3, -2, 0],
                                            scale: [1, 1.03, 0.97, 1],
                                            opacity: [0, 1, 0, 0.8, 0],
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            repeat: Infinity,
                                            repeatDelay: 5,
                                            times: [0, 0.2, 0.4, 0.6, 1],
                                        }}
                                    >
                                        System Access
                                    </motion.h1>
                                    {/* Glitch layer - Violet offset */}
                                    <motion.h1
                                        className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
                                        style={{ opacity: 0 }}
                                        animate={{
                                            x: [0, 8, -4, 6, 0],
                                            y: [0, -3, 2, 0],
                                            scale: [1, 0.97, 1.03, 1],
                                            opacity: [0, 0.9, 0, 0.7, 0],
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: Infinity,
                                            repeatDelay: 7,
                                        }}
                                    >
                                        System Access
                                    </motion.h1>
                                </div>
                                <p className="text-text-secondary text-sm">
                                    Login to access your registered events and profile
                                </p>
                            </div>

                            {/* Login Form Container - Matching About Page "Innovation Hub" Style */}
                            <div className="glitch-container rounded-xl p-8 relative group border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden hover:border-glow-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
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

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2 overflow-hidden"
                                            >
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <CyberInput
                                        label="Email Address"
                                        type="email"
                                        placeholder="operative@infothon.net"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        icon={<Mail className="w-5 h-5" />}
                                    />

                                    <CyberInput
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange('password')}
                                        icon={<Lock className="w-5 h-5" />}
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

                                {/* OR Divider */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-glow-cyan/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-black/60 text-text-muted font-mono text-xs tracking-widest">
                                            OR_CONTINUE_WITH
                                        </span>
                                    </div>
                                </div>

                                {/* Google Sign-In Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isGoogleLoading}
                                    className="w-full relative group flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.15)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGoogleLoading ? (
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        />
                                    ) : (
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                    )}
                                    <span className="font-mono text-sm text-white/90 tracking-wide">
                                        {isGoogleLoading ? 'Connecting...' : 'Sign in with Google'}
                                    </span>
                                </button>

                                {/* Signup Link Divider */}
                                <div className="mt-6 pt-6 border-t border-glow-cyan/20 text-center">
                                    <p className="text-text-muted text-sm">
                                        New user?{' '}
                                        <Link href="/signup" className="text-glow-cyan hover:underline">
                                            Create an account
                                        </Link>
                                    </p>
                                </div>
                            </div>

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
