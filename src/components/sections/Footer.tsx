'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
    explore: [
        { label: 'About', href: '/about' },
        { label: 'Events', href: '/events' },
        { label: 'Schedule', href: '/schedule' },
        { label: 'Sponsors', href: '/sponsors' },
    ],
    participate: [
        { label: 'Register', href: '/register' },
        { label: 'Speakers', href: '/speakers' },
        { label: 'Campus Ambassador', href: '#' },
        { label: 'Volunteer', href: '#' },
    ],
    connect: [
        { label: 'Contact Us', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Media Kit', href: '#' },
        { label: 'Terms', href: '#' },
    ],
}

export function Footer() {
    return (
        <footer className="relative pt-16 sm:pt-20 pb-6 sm:pb-8 overflow-hidden">
            <div className="absolute inset-0 bg-bg-secondary/50" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/30 to-transparent" />

            <div className="relative z-10 section-container px-6 sm:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6 group">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                                <Image
                                    src="/images/INFOTHON.png"
                                    alt="INFOTHON Logo"
                                    fill
                                    className="object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                                />
                            </div>
                            <span className="font-heading font-bold text-lg sm:text-xl tracking-wider">
                                <span className="text-glow-cyan">INFO</span>
                                <span className="text-white">THON</span>
                            </span>
                        </Link>
                        <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6 max-w-sm leading-relaxed">
                            The premier tech festival. Breaking barriers, building futures, one innovation at a time.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2 sm:gap-3">
                            {['X', 'IG', 'LI', 'YT'].map((social) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    whileHover={{ scale: 1.1 }}
                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-glow-cyan transition-colors text-xs sm:text-sm"
                                >
                                    {social}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([key, links]) => (
                        <div key={key}>
                            <h4 className="font-heading font-semibold uppercase tracking-wider mb-3 sm:mb-4 text-xs sm:text-sm capitalize">
                                {key}
                            </h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-text-secondary hover:text-glow-cyan transition-colors text-sm">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 sm:pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-text-muted text-xs sm:text-sm">© 2026 INFOTHON. All rights reserved.</p>
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-muted">
                            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
