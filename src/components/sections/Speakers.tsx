'use client'

import { motion } from 'framer-motion'
import { GlassCard, NeonText } from '@/components/ui'
import { speakers } from '@/data'

export function Speakers() {
    return (
        <section id="speakers" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/20 to-bg-primary" />
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-glow-violet/5 rounded-full blur-3xl translate-x-1/2" />

            <div className="relative z-10 section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-violet tracking-wider mb-4">
                        SPEAKERS
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                        Industry Pioneers
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Learn from the visionaries who are shaping the future of technology.
                    </p>
                </motion.div>

                {/* Speakers Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {speakers.map((speaker, index) => (
                        <motion.div
                            key={speaker.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <GlassCard className="text-center group h-full" glowColor="violet">
                                {/* Avatar */}
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-glow-cyan to-glow-violet animate-glow-pulse" />
                                    <div className="absolute inset-1 rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl font-heading font-bold gradient-text">
                                            {speaker.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>

                                    {/* Hover Ring */}
                                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-glow-violet/50 transition-colors duration-300" />
                                </div>

                                {/* Info */}
                                <h3 className="text-lg font-heading font-bold mb-1 group-hover:text-glow-violet transition-colors">
                                    {speaker.name}
                                </h3>
                                <p className="text-sm text-glow-cyan mb-1">{speaker.title}</p>
                                <p className="text-xs text-text-muted mb-4">{speaker.company}</p>

                                {/* Topic */}
                                <div className="mt-auto pt-4 border-t border-white/10">
                                    <p className="text-sm text-text-secondary line-clamp-2">
                                        &ldquo;{speaker.topic}&rdquo;
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center gap-3 mt-4">
                                    {speaker.social.twitter && (
                                        <a
                                            href={speaker.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-glow-cyan hover:border-glow-cyan/50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    )}
                                    {speaker.social.linkedin && (
                                        <a
                                            href={speaker.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 rounded-full glass flex items-center justify-center text-text-muted hover:text-glow-cyan hover:border-glow-cyan/50 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Speakers
