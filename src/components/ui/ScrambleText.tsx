'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrambleTextProps {
    text: string
    className?: string
    scrambleSpeed?: number
    revealSpeed?: number
    delay?: number
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

export function ScrambleText({
    text,
    className,
    scrambleSpeed = 60, // ms per scramble
    revealSpeed = 80, // ms per character reveal
    delay = 0,
}: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        let currentIndex = 0
        const totalLength = text.length

        // Start scrambling
        const startScramble = () => {
            intervalRef.current = setInterval(() => {
                let scrambled = ''
                for (let i = 0; i < totalLength; i++) {
                    if (i < currentIndex) {
                        scrambled += text[i]
                    } else {
                        scrambled += CHARS[Math.floor(Math.random() * CHARS.length)]
                    }
                }
                setDisplayText(scrambled)

                if (currentIndex >= totalLength) {
                    if (intervalRef.current) clearInterval(intervalRef.current)
                    setIsComplete(true)
                }
            }, scrambleSpeed)
        }

        // Start reveal loop
        const startReveal = () => {
            timeoutRef.current = setInterval(() => {
                currentIndex++
            }, revealSpeed)
        }

        const initialDelay = setTimeout(() => {
            startScramble()
            startReveal()
        }, delay)

        return () => {
            clearTimeout(initialDelay)
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (timeoutRef.current) clearInterval(timeoutRef.current)
        }
    }, [text, scrambleSpeed, revealSpeed, delay])

    return (
        <span className={cn('inline-block font-mono', className)}>
            {displayText}
            {!isComplete && (
                <span className="animate-pulse text-glow-cyan inline-block w-[0.5em] h-[1em] bg-glow-cyan/50 align-middle ml-1" />
            )}
        </span>
    )
}
