'use client'

import { motion } from 'framer-motion'
import { NeonText } from '@/components/ui'
import { sponsors, sponsorTiers } from '@/data'

export function Sponsors() {
    return (
        <section id="sponsors" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary/20 to-bg-primary" />

            <div className="relative z-10 section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1 rounded-full glass text-xs font-mono text-glow-cyan tracking-wider mb-4">
                        SPONSORS
                    </span>
                    <NeonText as="h2" color="gradient" className="text-4xl sm:text-5xl md:text-6xl mb-6">
                        Our Partners
                    </NeonText>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Powered by the world&apos;s leading technology companies.
                    </p>
                </motion.div>

                {/* Sponsor Tiers */}
                <div className="space-y-16">
                    {sponsorTiers.map((tier, tierIndex) => {
                        const tierSponsors = sponsors.filter((s) => s.tier === tier.id)
                        if (tierSponsors.length === 0) return null

                        return (
                            <motion.div
                                key={tier.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: tierIndex * 0.1 }}
                            >
                                {/* Tier Label */}
                                <div className="text-center mb-8">
                                    <span className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${tier.color} text-white text-sm font-semibold`}>
                                        {tier.label}
                                    </span>
                                </div>

                                {/* Sponsor Grid */}
                                <div className={`flex flex-wrap justify-center gap-6 ${tier.id === 'title' ? 'max-w-2xl mx-auto' : ''
                                    }`}>
                                    {tierSponsors.map((sponsor, index) => (
                                        <motion.a
                                            key={sponsor.id}
                                            href={sponsor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ scale: 1.05 }}
                                            className={`
                        group glass rounded-2xl flex items-center justify-center
                        transition-all duration-300 hover:shadow-glow-sm hover:border-glow-cyan/30
                        ${tier.id === 'title' ? 'w-64 h-32' : ''}
                        ${tier.id === 'platinum' ? 'w-48 h-24' : ''}
                        ${tier.id === 'gold' ? 'w-40 h-20' : ''}
                        ${tier.id === 'silver' ? 'w-36 h-16' : ''}
                      `}
                                        >
                                            {/* Placeholder Logo - In production, use actual logos */}
                                            <div className={`
                        font-heading font-bold text-text-muted group-hover:text-white transition-colors
                        ${tier.id === 'title' ? 'text-xl' : ''}
                        ${tier.id === 'platinum' ? 'text-lg' : ''}
                        ${tier.id === 'gold' ? 'text-base' : ''}
                        ${tier.id === 'silver' ? 'text-sm' : ''}
                      `}>
                                                {sponsor.name}
                                            </div>
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-text-secondary mb-4">Interested in becoming a sponsor?</p>
                    <a
                        href="mailto:sponsors@nexus2026.com"
                        className="inline-flex items-center gap-2 text-glow-cyan hover:text-white transition-colors group"
                    >
                        <span className="font-heading font-semibold">Get in Touch</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

export default Sponsors
