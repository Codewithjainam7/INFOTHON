'use client'

import { motion } from 'framer-motion'
import { GlowButton, NeonText, MagneticElement } from '@/components/ui'

export function Registration() {
    return (
        <section id="register" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-radial from-glow-cyan/10 via-bg-primary to-bg-primary" />
            <div className="absolute inset-0 grid-bg opacity-20" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-glow-cyan/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    y: [0, 30, 0],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-violet/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 section-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-block mb-8"
                    >
                        <div className="glass px-6 py-2 rounded-full">
                            <span className="font-mono text-sm text-glow-cyan tracking-wider">
                                LIMITED SPOTS AVAILABLE
                            </span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-7xl mb-6">
                        Join the Future
                    </NeonText>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Don&apos;t miss your chance to be part of the most transformative tech festival of 2026.
                        Register now and secure your spot in history.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        {[
                            { value: '₹999', label: 'Early Bird Price' },
                            { value: '30%', label: 'Discount Ends Soon' },
                            { value: '2000+', label: 'Already Registered' },
                        ].map((stat, index) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-heading font-bold text-glow-cyan">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-muted">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <MagneticElement strength={0.15}>
                            <GlowButton size="lg" className="min-w-[200px]">
                                Register Now
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </GlowButton>
                        </MagneticElement>

                        <MagneticElement strength={0.15}>
                            <GlowButton variant="secondary" size="lg" className="min-w-[200px]">
                                Download Brochure
                            </GlowButton>
                        </MagneticElement>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-12 flex flex-wrap justify-center gap-6 text-text-muted text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Secure Payment
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Multiple Payment Options
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Instant Confirmation
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default Registration
