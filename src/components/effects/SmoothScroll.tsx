'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
    children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
    const lenisRef = useRef<Lenis | null>(null)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        })

        lenisRef.current = lenis

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        // Add lenis class to html for CSS targeting
        document.documentElement.classList.add('lenis', 'lenis-smooth')

        return () => {
            lenis.destroy()
            document.documentElement.classList.remove('lenis', 'lenis-smooth')
        }
    }, [])

    return <>{children}</>
}

export default SmoothScroll
