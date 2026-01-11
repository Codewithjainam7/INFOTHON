'use client'

import { useEffect, useState, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface DeviceTiltParallaxProps {
    children: ReactNode
    intensity?: number
}

export function DeviceTiltParallax({ children, intensity = 20 }: DeviceTiltParallaxProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [hasPermission, setHasPermission] = useState(false)

    const tiltX = useMotionValue(0)
    const tiltY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const smoothTiltX = useSpring(tiltX, springConfig)
    const smoothTiltY = useSpring(tiltY, springConfig)

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches &&
                'DeviceOrientationEvent' in window)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (!isMobile) return

        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma === null || event.beta === null) return

            // gamma is left-right tilt (-90 to 90)
            // beta is front-back tilt (-180 to 180)
            const x = Math.min(Math.max(event.gamma, -45), 45) / 45 * intensity
            const y = Math.min(Math.max(event.beta - 45, -45), 45) / 45 * intensity

            tiltX.set(x)
            tiltY.set(y)
        }

        // Request permission on iOS 13+
        const requestPermission = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permission = await (DeviceOrientationEvent as any).requestPermission()
                    if (permission === 'granted') {
                        setHasPermission(true)
                        window.addEventListener('deviceorientation', handleOrientation)
                    }
                } catch (err) {
                    console.log('DeviceOrientation permission denied')
                }
            } else {
                // Non-iOS or older iOS
                setHasPermission(true)
                window.addEventListener('deviceorientation', handleOrientation)
            }
        }

        requestPermission()

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [isMobile, intensity, tiltX, tiltY])

    if (!isMobile) {
        return <>{children}</>
    }

    return (
        <motion.div
            style={{
                x: smoothTiltX,
                y: smoothTiltY,
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    )
}
