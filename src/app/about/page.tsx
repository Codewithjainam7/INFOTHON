'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

const stats = [
    { value: '50K+', label: 'Participants' },
    { value: '100+', label: 'Events' },
    { value: '₹50L', label: 'Prize Pool' },
    { value: '3', label: 'Days' },
]

import { Rocket, Target, Globe, Lightbulb } from 'lucide-react'

const features = [
    { icon: <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-glow-cyan" />, title: 'Innovation Hub', description: 'A melting pot of ideas where the brightest minds converge to shape the future.' },
    { icon: <Target className="w-8 h-8 sm:w-10 sm:h-10 text-glow-violet" />, title: 'World-Class Events', description: 'From hackathons to robotics, our competitions are designed to challenge and inspire.' },
    { icon: <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-glow-cyan" />, title: 'Global Network', description: 'Connect with industry leaders, researchers, and innovators from around the world.' },
    { icon: <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-glow-violet" />, title: 'Learn & Grow', description: 'Hands-on workshops and talks by pioneers defining the next technological frontier.' },
]

export default function AboutPage() {
    return (
        <SmoothScroll>
            <GlowCursor />
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg7.png" />
            <FloatingNavbar />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-24 pb-16">
                <div className="section-container px-6 sm:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center mb-16 sm:mb-20"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm text-xs font-cyber text-glow-cyan tracking-widest mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            ABOUT US
                        </span>
                        <div className="relative inline-block mb-6">
                            {/* Main visible text - HIGH Z-INDEX for iOS */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-black relative z-20">
                                <span className="gradient-text">
                                    <ScrambleText
                                        text="The Future Awaits"
                                        revealSpeed={50}
                                        scrambleSpeed={30}
                                        delay={300}
                                    />
                                </span>
                            </h1>

                            {/* Glitch layer - Cyan offset */}
                            <motion.h1
                                className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
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
                                The Future Awaits
                            </motion.h1>

                            {/* Glitch layer - Violet offset */}
                            <motion.h1
                                className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
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
                                    repeatDelay: 0.8,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                The Future Awaits
                            </motion.h1>
                        </div>
                        <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                            INFOTHON is more than a tech festival—it&apos;s a movement. For over a decade, we&apos;ve been
                            the launchpad for ideas that transformed industries and careers that shaped the world.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="glitch-container rounded-lg p-4 sm:p-6 group border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 relative overflow-hidden"
                                style={{ willChange: 'transform' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Active Glitch Hover Effect - Border Glow Pulse */}
                                <motion.div
                                    className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-lg pointer-events-none"
                                    style={{ willChange: 'opacity' }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                <div className="mb-2 relative inline-block group-hover:scale-105 transition-transform duration-300">
                                    {/* Glitch layers */}
                                    <motion.div
                                        className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl font-cyber font-bold opacity-0"
                                        style={{ color: '#00f0ff', filter: 'hue-rotate(180deg)', willChange: 'transform, opacity' }}
                                        animate={{
                                            x: [0, -2, 0, 1, 0],
                                            opacity: [0, 0.6, 0, 0.4, 0],
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            repeat: Infinity,
                                            repeatDelay: 3 + index,
                                        }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    <motion.div
                                        className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl font-cyber font-bold opacity-0"
                                        style={{ color: '#8b5cf6', filter: 'hue-rotate(-60deg)', willChange: 'transform, opacity' }}
                                        animate={{
                                            x: [0, 2, 0, -1, 0],
                                            opacity: [0, 0.5, 0, 0.3, 0],
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: Infinity,
                                            repeatDelay: 2.5 + index,
                                        }}
                                    >
                                        {stat.value}
                                    </motion.div>
                                    {/* Main text */}
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-cyber font-bold gradient-text relative z-10">
                                        {stat.value}
                                    </div>
                                </div>
                                <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-widest font-cyber">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="glitch-container rounded-lg p-6 sm:p-8 group border border-white/10 bg-black/40 backdrop-blur-md hover:border-glow-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 relative overflow-hidden"
                                style={{ willChange: 'transform' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Active Glitch Hover Effect - Border Glow Pulse */}
                                <motion.div
                                    className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-lg pointer-events-none"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                {/* Corner accents */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-glow-cyan/60" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-glow-violet/60" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-glow-violet/60" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-glow-cyan/60" />

                                <div className="flex items-start gap-4">
                                    <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-cyber font-bold mb-2 group-hover:text-glow-cyan transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed group-hover:text-white/80 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-center"
                    >
                        <div className="glitch-container inline-block max-w-4xl py-10 sm:py-12 px-6 sm:px-8 rounded-xl relative">
                            {/* Corner accents */}
                            <div className="absolute top-[-2px] left-[-2px] w-6 h-6 border-l-2 border-t-2 border-glow-cyan" />
                            <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 border-r-2 border-b-2 border-glow-violet" />

                            <blockquote className="text-xl sm:text-2xl md:text-3xl font-heading font-light leading-relaxed">
                                &ldquo;We don&apos;t just predict the future—
                                <span className="gradient-text font-black"> we build it.</span>&rdquo;
                            </blockquote>
                            <p className="mt-4 text-text-muted text-xs sm:text-sm font-cyber tracking-widest">
                                — INFOTHON Vision Statement
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
