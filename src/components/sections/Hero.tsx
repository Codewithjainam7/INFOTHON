'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn, formatCountdown } from '@/lib/utils'
import { GlowButton, NeonText, MagneticElement, GlassCard } from '@/components/ui'
import Link from 'next/link'

// Target date: February 12, 2026
const TARGET_DATE = new Date('2026-02-12T09:00:00')

// SVG Icons - properly sized
const TrophyIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516" />
    </svg>
)

const MicrophoneIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
)

const CalendarIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
)

const SparklesIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
)

const quickLinks = [
    { Icon: TrophyIcon, title: 'Events', description: '50+ competitions', href: '/events' },
    { Icon: MicrophoneIcon, title: 'Speakers', description: 'Industry leaders', href: '/speakers' },
    { Icon: CalendarIcon, title: 'Schedule', description: '2 days packed', href: '/schedule' },
    { Icon: SparklesIcon, title: 'Register', description: 'Limited spots', href: '/register' },
]

const highlights = [
    { value: '50+', label: 'Events' },
    { value: '₹10L+', label: 'Prizes' },
    { value: '5000+', label: 'Participants' },
    { value: '2', label: 'Days' },
]

export function Hero() {
    const [countdown, setCountdown] = useState(formatCountdown(TARGET_DATE))
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setCountdown(formatCountdown(TARGET_DATE))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const countdownItems = [
        { value: countdown.days, label: 'Days' },
        { value: countdown.hours, label: 'Hours' },
        { value: countdown.minutes, label: 'Minutes' },
        { value: countdown.seconds, label: 'Seconds' },
    ]

    return (
        <section id="home" className="relative min-h-screen overflow-hidden pb-20">
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-radial from-glow-cyan/5 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />

            {/* Hero Content */}
            <div className="relative z-10 section-container px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16">
                {/* Mobile Spacer */}
                <div className="h-40 sm:hidden" />

                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-2 rounded-full glass text-sm font-mono text-glow-cyan tracking-wider">
                            FEBRUARY 12-13, 2026 • MUMBAI, INDIA
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <NeonText as="h1" color="gradient" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter mb-4">
                            INFOTHON x HACKATHON
                        </NeonText>

                        {/* Animated 2026 Image */}
                        <div className="flex justify-center mt-4 relative">
                            {/* Glow background */}
                            <motion.div
                                className="absolute inset-0 flex justify-center items-center"
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="w-64 h-24 bg-glow-cyan/20 blur-3xl rounded-full" />
                            </motion.div>

                            {/* Main 2026 image with animations */}
                            <motion.div
                                className="relative"
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                {/* Side accent lines */}
                                <motion.div
                                    className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-r from-transparent to-glow-cyan"
                                    animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-px bg-gradient-to-l from-transparent to-glow-violet"
                                    animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />

                                {/* Image with glow effect */}
                                <motion.img
                                    src="/images/2026.png"
                                    alt="2026"
                                    className="h-32 sm:h-28 md:h-32 lg:h-36 w-auto object-contain relative z-10"
                                    style={{
                                        filter: 'drop-shadow(0 0 20px rgba(34,211,238,0.4)) drop-shadow(0 0 40px rgba(139,92,246,0.2))',
                                    }}
                                    animate={{
                                        filter: [
                                            'drop-shadow(0 0 20px rgba(34,211,238,0.4)) drop-shadow(0 0 40px rgba(139,92,246,0.2))',
                                            'drop-shadow(0 0 30px rgba(34,211,238,0.6)) drop-shadow(0 0 60px rgba(139,92,246,0.4))',
                                            'drop-shadow(0 0 20px rgba(34,211,238,0.4)) drop-shadow(0 0 40px rgba(139,92,246,0.2))',
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />

                                {/* Scanning line effect */}
                                <motion.div
                                    className="absolute inset-0 overflow-hidden pointer-events-none"
                                    style={{ clipPath: 'inset(0)' }}
                                >
                                    <motion.div
                                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan to-transparent"
                                        animate={{ top: ['-10%', '110%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                    />
                                </motion.div>

                                {/* Corner brackets */}
                                <div className="absolute -top-2 -left-2 w-3 h-3 border-l-2 border-t-2 border-glow-cyan/50" />
                                <div className="absolute -top-2 -right-2 w-3 h-3 border-r-2 border-t-2 border-glow-violet/50" />
                                <div className="absolute -bottom-2 -left-2 w-3 h-3 border-l-2 border-b-2 border-glow-violet/50" />
                                <div className="absolute -bottom-2 -right-2 w-3 h-3 border-r-2 border-b-2 border-glow-cyan/50" />
                            </motion.div>
                        </div>

                        <motion.p
                            className="mt-6 text-lg sm:text-xl md:text-2xl font-heading font-semibold tracking-wide"
                            animate={{
                                color: ['rgba(203,213,225,1)', 'rgba(34,211,238,0.9)', 'rgba(203,213,225,1)'],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            INFOTHON PRESENTS HACKATHON 2026
                        </motion.p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-6 mb-10 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed px-4"
                    >
                        Where innovation meets imagination. Join the largest tech festival
                        for two days of competitions, workshops, and groundbreaking experiences.
                    </motion.p>

                    {/* Countdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="flex justify-center gap-2 sm:gap-4 md:gap-6 mb-10 px-2"
                    >
                        {countdownItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                                className="glass rounded-xl p-3 sm:p-4 md:p-5 min-w-[65px] sm:min-w-[80px]"
                            >
                                <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-glow-cyan glow-text-cyan">
                                    {mounted ? String(item.value).padStart(2, '0') : '--'}
                                </div>
                                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider mt-1">
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4"
                    >
                        <MagneticElement strength={0.15}>
                            <Link href="/register">
                                <GlowButton size="lg">
                                    Register Now
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </GlowButton>
                            </Link>
                        </MagneticElement>

                        <MagneticElement strength={0.15}>
                            <Link href="/events">
                                <GlowButton variant="secondary" size="lg">
                                    Explore Events
                                </GlowButton>
                            </Link>
                        </MagneticElement>
                    </motion.div>
                </div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12 px-2"
                >
                    {highlights.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 + index * 0.1 }}
                            className="glass rounded-xl p-4 text-center"
                        >
                            <div className="text-xl sm:text-2xl font-heading font-bold gradient-text">
                                {stat.value}
                            </div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Links Grid - Fixed Icon Alignment */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto px-4"
                >
                    {quickLinks.map((link, index) => {
                        const { Icon } = link
                        return (
                            <motion.div
                                key={link.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.7 + index * 0.1 }}
                            >
                                <Link href={link.href}>
                                    <GlassCard className="text-center group cursor-pointer h-full" glowColor={index % 2 === 0 ? 'cyan' : 'violet'}>
                                        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-glow-cyan/10 border border-glow-cyan/20 flex items-center justify-center text-glow-cyan group-hover:bg-glow-violet/10 group-hover:border-glow-violet/20 group-hover:text-glow-violet transition-all duration-300">
                                            <Icon />
                                        </div>
                                        <h3 className="text-sm sm:text-base font-heading font-semibold mb-1 group-hover:text-glow-cyan transition-colors">
                                            {link.title}
                                        </h3>
                                        <p className="text-xs text-text-muted">{link.description}</p>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div >

            {/* Corner Elements */}
            < div className="absolute top-20 left-4 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 border-l-2 border-t-2 border-glow-cyan/20 rounded-tl-3xl" />
            <div className="absolute top-20 right-4 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 border-r-2 border-t-2 border-glow-cyan/20 rounded-tr-3xl" />
        </section >
    )
}

export default Hero
