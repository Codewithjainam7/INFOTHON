'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { DeviceTiltParallax } from '@/components/effects'

interface Background3DProps {
    backgroundImage?: string
    blur?: boolean
}

export function Background3D({ backgroundImage = '/images/bg_img.540Z.png', blur = false }: Background3DProps) {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Main Background Image with Device Tilt Parallax */}
            <DeviceTiltParallax intensity={30}>
                <div className="absolute inset-[-50px]">
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        priority
                        className={`object-cover opacity-50 ${blur ? 'blur-sm' : ''}`}
                    />
                </div>
            </DeviceTiltParallax>

            {/* Dark Overlay for brightness control */}
            <div className="absolute inset-0 bg-bg-primary/40" />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 via-transparent to-bg-primary" />
            <div className="absolute inset-0 bg-gradient-radial from-glow-cyan/5 via-transparent to-transparent" />

            {/* Animated Grid */}
            <div className="absolute inset-0 grid-bg opacity-15" />

            {/* Floating Particles with Tilt */}
            <DeviceTiltParallax intensity={15}>
                <div className="absolute inset-0">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-glow-cyan/40"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: 'easeInOut',
                            }}
                        />
                    ))}
                </div>
            </DeviceTiltParallax>

            {/* Scan Line */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-glow-cyan/20 to-transparent"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    )
}

export default Background3D
