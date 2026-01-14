'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, NeonText, GlassCard, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { createClient } from '@/lib/supabase'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

// Cyberpunk Input Component with Password Toggle
function CyberInput({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon,
    error,
    showPasswordToggle = false
}: {
    label: string
    type?: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
    error?: string
    showPasswordToggle?: boolean
}) {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

    return (
        <div className="relative group">
            <label className="block text-xs font-mono text-glow-cyan mb-2 tracking-wider uppercase">
                {label}
            </label>
            <div className="relative">
                {/* Background Layer with Blur */}
                <div className={`absolute inset-0 z-0 bg-bg-primary/60 backdrop-blur-sm border rounded-lg transition-all duration-300 pointer-events-none ${error ? 'border-red-500/50' : 'border-glow-cyan/30 group-focus-within:border-glow-cyan group-focus-within:shadow-[0_0_20px_rgba(0,245,255,0.3)]'}`} />

                {/* Gradient Glow Layer */}
                <div className="absolute inset-0 z-0 rounded-lg bg-gradient-to-r from-glow-cyan/0 via-glow-cyan/5 to-glow-cyan/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

                {/* Left Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-glow-cyan/60 group-focus-within:text-glow-cyan transition-colors z-20 pointer-events-none">
                    {icon}
                </div>

                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`relative z-10 w-full bg-transparent pl-12 ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3.5 text-white placeholder-text-muted focus:outline-none font-mono text-sm`}
                />

                {/* Password Toggle Button - Right Side Inside Input */}
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-glow-cyan/60 hover:text-glow-cyan transition-colors p-1"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>
            )}
        </div>
    )
}

// Password Strength Indicator
function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: 'Min 8 characters', valid: password.length >= 8 },
        { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
        { label: 'Number', valid: /[0-9]/.test(password) },
        { label: 'Special char (!@#$%)', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]

    const strength = checks.filter(c => c.valid).length
    const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'

    if (!password) return null

    return (
        <div className="mt-3 space-y-2">
            {/* Strength Bar */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-white/10'}`}
                    />
                ))}
            </div>
            {/* Checks */}
            <div className="grid grid-cols-2 gap-1">
                {checks.map((check, i) => (
                    <div key={i} className={`flex items-center gap-1 text-xs font-mono ${check.valid ? 'text-green-400' : 'text-text-muted'}`}>
                        {check.valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {check.label}
                    </div>
                ))}
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
        cc: '',
        password: '',
        confirmPassword: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        setError(null)
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
            console.error('Google Sign-Up Error:', error)
            setError(error.message)
            setIsGoogleLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.college.trim() || !formData.password || !formData.confirmPassword) {
            setError('All fields are required')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError('Invalid email address')
            return
        }

        const phoneRegex = /^[0-9]{10}$/
        if (!phoneRegex.test(formData.phone)) {
            setError('Phone number must be 10 digits')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

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
                    cc: formData.cc || '',
                    role: 'user', // Default role
                }
            }
        })

        if (error) {
            console.error('Signup Error:', error)
            alert('Signup failed: ' + error.message)
            setIsSubmitting(false)
            return
        }

        // Check if email confirmation is required
        // When "Confirm email" is enabled in Supabase, user.identities will be empty
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            // Email confirmation required - don't log in yet
            console.log('Email confirmation required')
            setSubmitted(true)
            setIsSubmitting(false)
            return
        }

        // If email confirmation is disabled OR user confirmed, store user info
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

            <main className="relative z-10 min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-x-hidden">
                <div className="section-container px-4 sm:px-6 w-full">
                    <div className="max-w-lg mx-auto">
                        {!submitted ? (
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
                                                BECOME_OPERATIVE
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Glitch Title */}
                                    <div className="relative inline-block mb-3">
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                            <ScrambleText
                                                text="Create Account"
                                                revealSpeed={50}
                                                scrambleSpeed={30}
                                                delay={300}
                                            />
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
                                                repeatDelay: 1,
                                                times: [0, 0.2, 0.4, 0.6, 1],
                                            }}
                                        >
                                            Create Account
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
                                                repeatDelay: 1.5,
                                            }}
                                        >
                                            Create Account
                                        </motion.h1>
                                    </div>
                                    <p className="text-text-secondary text-sm">
                                        Sign up to register for INFOTHON 2026 events
                                    </p>
                                </div>

                                {/* Signup Form Container - Matching About Page "Innovation Hub" Style */}
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

                                    {/* Scan Line Effect */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/40 to-transparent z-10 pointer-events-none"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    />

                                    <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Contingent Code (Optional)"
                                            placeholder="Enter CC code if you have one"
                                            value={formData.cc}
                                            onChange={handleChange('cc')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                                </svg>
                                            }
                                        />

                                        <CyberInput
                                            label="Password"
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange('password')}
                                            showPasswordToggle
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                            }
                                        />
                                        <PasswordStrength password={formData.password} />

                                        <CyberInput
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange('confirmPassword')}
                                            showPasswordToggle
                                            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                </svg>
                                            }
                                        />

                                        <div className="pt-4">
                                            <GlowButton
                                                onClick={() => { }}
                                                className="w-full mt-6"
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

                                    {/* Google Sign-Up Button */}
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
                                            {isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}
                                        </span>
                                    </button>

                                    {/* Login Link Divider */}
                                    <div className="mt-6 pt-6 border-t border-glow-cyan/20 text-center">
                                        <p className="text-text-muted text-sm">
                                            Already have an account?{' '}
                                            <Link href="/login" className="text-glow-cyan hover:underline">
                                                Log in
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
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <GlassCard className="p-8 relative overflow-hidden" glowColor="cyan">
                                    {/* Scan line effect */}
                                    <motion.div
                                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/60 to-transparent"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    />

                                    {/* Email Icon */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-glow-cyan to-glow-violet flex items-center justify-center shadow-[0_0_40px_rgba(0,245,255,0.4)]"
                                    >
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </motion.div>

                                    {/* Glitch Title */}
                                    <div className="relative inline-block mb-3">
                                        <h2 className="text-2xl sm:text-3xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                            Verify Your Email
                                        </h2>
                                        <motion.h2
                                            className="absolute inset-0 text-2xl sm:text-3xl font-heading font-black text-[#00f0ff] pointer-events-none"
                                            style={{ opacity: 0 }}
                                            animate={{ x: [0, -4, 2, -3, 0], opacity: [0, 0.8, 0, 0.6, 0] }}
                                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2.5 }}
                                        >
                                            Verify Your Email
                                        </motion.h2>
                                    </div>

                                    <p className="text-text-secondary mb-2">
                                        We&apos;ve sent a verification link to:
                                    </p>
                                    <p className="font-mono text-glow-cyan text-sm mb-6 px-4 py-2 bg-black/50 rounded-lg border border-glow-cyan/30 inline-block">
                                        {formData.email}
                                    </p>

                                    <div className="bg-black/30 rounded-lg p-4 mb-6 border border-glow-violet/30">
                                        <p className="text-sm text-text-muted">
                                            <span className="text-glow-violet font-mono">// INSTRUCTIONS:</span><br />
                                            Check your inbox and click the verification link to activate your account.
                                            Don&apos;t forget to check your spam folder!
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href="/login">
                                            <GlowButton size="lg">
                                                Go to Login
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </GlowButton>
                                        </Link>
                                    </div>
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
