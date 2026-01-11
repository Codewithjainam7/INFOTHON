'use client'

import { useEffect, useState, ReactNode, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface DeviceTiltParallaxProps {
    children: ReactNode
    intensity?: number
}

export function DeviceTiltParallax({ children, intensity = 20 }: DeviceTiltParallaxProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false)
    const [needsPermission, setNeedsPermission] = useState(false)

    const tiltX = useMotionValue(0)
    const tiltY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 150 }
    const smoothTiltX = useSpring(tiltX, springConfig)
    const smoothTiltY = useSpring(tiltY, springConfig)

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        if (event.gamma === null || event.beta === null) return

        // gamma is left-right tilt (-90 to 90)
        // beta is front-back tilt (-180 to 180)
        const x = Math.min(Math.max(event.gamma, -45), 45) / 45 * intensity
        const y = Math.min(Math.max(event.beta - 45, -45), 45) / 45 * intensity

        tiltX.set(x)
        tiltY.set(y)
    }, [intensity, tiltX, tiltY])

    const requestPermission = useCallback(async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permission = await (DeviceOrientationEvent as any).requestPermission()
                if (permission === 'granted') {
                    setIsEnabled(true)
                    setNeedsPermission(false)
                    window.addEventListener('deviceorientation', handleOrientation)
                }
            } catch (err) {
                console.log('DeviceOrientation permission denied')
            }
        }
    }, [handleOrientation])

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            const mobile = window.matchMedia('(max-width: 768px)').matches &&
                'DeviceOrientationEvent' in window
            setIsMobile(mobile)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (!isMobile) return

        // Check if iOS 13+ needs permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // iOS 13+ - needs user interaction to request permission
            setNeedsPermission(true)

            // Try to enable on first touch
            const handleFirstTouch = () => {
                requestPermission()
                document.removeEventListener('touchstart', handleFirstTouch)
            }
            document.addEventListener('touchstart', handleFirstTouch, { once: true })

            return () => document.removeEventListener('touchstart', handleFirstTouch)
        } else {
            // Android and older iOS - just enable directly
            setIsEnabled(true)
            window.addEventListener('deviceorientation', handleOrientation)

            return () => {
                window.removeEventListener('deviceorientation', handleOrientation)
            }
        }
    }, [isMobile, handleOrientation, requestPermission])

    if (!isMobile || !isEnabled) {
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
