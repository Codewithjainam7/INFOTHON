'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlowButton, MagneticElement } from '@/components/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/speakers', label: 'Speakers' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/profile', label: 'Profile' },
]

export function FloatingNavbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { scrollY } = useScroll()
    const pathname = usePathname()

    // Navbar always visible, just changes style on scroll
    useMotionValueEvent(scrollY, 'change', (latest) => {
        setIsScrolled(latest > 50)
    })

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsMobileMenuOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300',
                    isScrolled ? 'py-2' : 'py-4'
                )}
            >
                <div className={cn(
                    'max-w-7xl mx-auto rounded-2xl transition-all duration-300 border border-white/10',
                    'bg-bg-primary/60 backdrop-blur-lg shadow-lg',
                    isScrolled ? 'px-4 sm:px-6 py-3 shadow-glow-cyan/20' : 'px-4 sm:px-6 py-3'
                )}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <MagneticElement strength={0.2}>
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="relative w-10 h-10">
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-glow-cyan to-glow-violet opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0.5 rounded-lg bg-bg-primary flex items-center justify-center">
                                        <span className="text-xl font-heading font-bold gradient-text">I</span>
                                    </div>
                                </div>
                                <span className="font-heading font-bold text-base sm:text-lg tracking-wider">
                                    <span className="text-glow-cyan">INFO</span>
                                    <span className="text-white">THON</span>
                                </span>
                            </Link>
                        </MagneticElement>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <MagneticElement key={link.href} strength={0.15}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            'px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors relative group',
                                            pathname === link.href ? 'text-glow-cyan' : 'text-text-secondary hover:text-white'
                                        )}
                                    >
                                        {link.label}
                                        <span className={cn(
                                            'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-glow-cyan transition-all duration-300',
                                            pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                                        )} />
                                    </Link>
                                </MagneticElement>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="hidden lg:block">
                            <MagneticElement strength={0.2}>
                                <Link href="/register">
                                    <GlowButton size="sm">Register Now</GlowButton>
                                </Link>
                            </MagneticElement>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 group"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-white group-hover:bg-glow-cyan transition-colors origin-center"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-6 h-0.5 bg-white group-hover:bg-glow-cyan transition-colors"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-6 h-0.5 bg-white group-hover:bg-glow-cyan transition-colors origin-center"
                            />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-full max-w-sm glass-dark p-6 sm:p-8 pt-24"
                        >
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                'block px-4 py-3 text-lg font-heading font-semibold rounded-xl transition-all',
                                                pathname === link.href
                                                    ? 'text-glow-cyan bg-glow-cyan/10'
                                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-6 pt-6 border-t border-white/10"
                                >
                                    <Link href="/register">
                                        <GlowButton className="w-full justify-center">
                                            Register Now
                                        </GlowButton>
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default FloatingNavbar
