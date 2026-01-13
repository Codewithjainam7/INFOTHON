'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, Tag, ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, ScrambleText } from '@/components/ui'
import { Footer } from '@/components/sections'
import { eventPackages, colorMap } from '@/data'

const Background3D = dynamic(
    () => import('@/components/three/Background3D').then((mod) => mod.Background3D),
    { ssr: false }
)

interface CartItem {
    id: string
    quantity: number
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    }
}

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id?: string
    handler: (response: RazorpayResponse) => void
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    theme?: {
        color?: string
    }
}

interface RazorpayInstance {
    open: () => void
    close: () => void
}

interface RazorpayResponse {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
}

// Payment Success Animation Component
function PaymentSuccessOverlay({ onComplete }: { onComplete: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000)
        return () => clearTimeout(timer)
    }, [onComplete])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
        >
            {/* Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
                <div className="w-full h-full" style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.03) 2px, rgba(0, 245, 255, 0.03) 4px)'
                }} />
            </div>

            {/* Glitch Lines */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background: [
                        'linear-gradient(0deg, transparent 0%, transparent 100%)',
                        'linear-gradient(0deg, transparent 0%, rgba(0,245,255,0.1) 50%, transparent 51%, transparent 100%)',
                        'linear-gradient(0deg, transparent 0%, transparent 100%)',
                    ]
                }}
                transition={{ duration: 0.1, repeat: 10, repeatDelay: 0.3 }}
            />

            <div className="relative z-20 text-center">
                {/* Success Icon with Glitch */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                    className="relative mb-8"
                >
                    {/* Outer Ring */}
                    <motion.div
                        className="w-32 h-32 mx-auto rounded-full border-4 border-glow-cyan flex items-center justify-center"
                        animate={{
                            boxShadow: [
                                '0 0 20px rgba(0,245,255,0.3), inset 0 0 20px rgba(0,245,255,0.1)',
                                '0 0 60px rgba(0,245,255,0.6), inset 0 0 40px rgba(0,245,255,0.3)',
                                '0 0 20px rgba(0,245,255,0.3), inset 0 0 20px rgba(0,245,255,0.1)',
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Check className="w-16 h-16 text-glow-cyan" strokeWidth={3} />
                        </motion.div>
                    </motion.div>

                    {/* Glitch copies */}
                    <motion.div
                        className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-[#00f0ff] opacity-0"
                        animate={{ x: [-5, 5, -3, 0], opacity: [0, 0.8, 0, 0.5, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <motion.div
                        className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-4 border-[#8b5cf6] opacity-0"
                        animate={{ x: [5, -5, 3, 0], opacity: [0, 0.7, 0, 0.4, 0] }}
                        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 1.8 }}
                    />
                </motion.div>

                {/* Success Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="relative inline-block mb-4">
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_30px_rgba(0,245,255,0.5)]">
                            <ScrambleText text="PAYMENT SUCCESSFUL" revealSpeed={30} scrambleSpeed={20} delay={800} />
                        </h2>
                        {/* Glitch layers */}
                        <motion.h2
                            className="absolute inset-0 text-4xl md:text-5xl font-heading font-black text-[#00f0ff] opacity-0"
                            animate={{ x: [-8, 8, -4, 0], opacity: [0, 0.8, 0, 0] }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
                        >
                            PAYMENT SUCCESSFUL
                        </motion.h2>
                        <motion.h2
                            className="absolute inset-0 text-4xl md:text-5xl font-heading font-black text-[#8b5cf6] opacity-0"
                            animate={{ x: [8, -8, 4, 0], opacity: [0, 0.7, 0, 0] }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 1.2 }}
                        >
                            PAYMENT SUCCESSFUL
                        </motion.h2>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-text-secondary font-mono text-sm mb-8"
                >
                    Transaction verified. Access granted.
                </motion.p>

                {/* Energy Pulses */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center justify-center gap-3"
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-8 bg-glow-cyan rounded-full"
                            animate={{
                                scaleY: [0.3, 1, 0.3],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-glow-cyan/60 font-cyber text-xs tracking-widest mt-6"
                >
                    REDIRECTING TO PROFILE...
                </motion.p>
            </div>
        </motion.div>
    )
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
    const [couponError, setCouponError] = useState('')
    const [discount, setDiscount] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    // Load cart from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('infothon_registrations')
        if (saved) {
            const eventIds: string[] = JSON.parse(saved)
            setCartItems(eventIds.map(id => ({ id, quantity: 1 })))
        }
    }, [])

    // Get event details for cart items
    const getEventDetails = (id: string) => eventPackages.find(e => e.id === id)

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const event = getEventDetails(item.id)
        return sum + (event?.price || 0) * item.quantity
    }, 0)

    const total = subtotal - discount

    // Coupon validation (hardcoded for demo)
    const validCoupons: Record<string, number> = {
        'INFOTHON10': 10,
        'INFOTHON20': 20,
        'EARLY50': 50,
    }

    const applyCoupon = () => {
        setCouponError('')
        const upperCode = couponCode.toUpperCase()

        if (validCoupons[upperCode]) {
            const discountPercent = validCoupons[upperCode]
            const discountAmount = Math.round(subtotal * (discountPercent / 100))
            setDiscount(discountAmount)
            setAppliedCoupon(upperCode)
        } else {
            setCouponError('Invalid coupon code')
            setDiscount(0)
            setAppliedCoupon(null)
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
        setDiscount(0)
    }

    const removeItem = (id: string) => {
        const newItems = cartItems.filter(item => item.id !== id)
        setCartItems(newItems)
        localStorage.setItem('infothon_registrations', JSON.stringify(newItems.map(i => i.id)))
    }

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, Math.min(5, item.quantity + delta))
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const handlePaymentSuccess = useCallback(() => {
        // Save purchased events
        localStorage.setItem('infothon_purchased', JSON.stringify(cartItems.map(i => i.id)))
        // Clear cart
        localStorage.removeItem('infothon_registrations')
        setCartItems([])
        // Redirect
        window.location.href = '/profile'
    }, [cartItems])

    const initiatePayment = async () => {
        if (total <= 0) return

        setIsProcessing(true)

        try {
            // Create order
            const response = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    currency: 'INR',
                    receipt: `INFOTHON_${Date.now()}`
                })
            })

            const data = await response.json()

            if (!data.success) {
                throw new Error('Failed to create order')
            }

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'INFOTHON 2026',
                description: `Registration for ${cartItems.length} event(s)`,
                order_id: data.order.id,
                handler: function () {
                    setShowSuccess(true)
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#00F5FF'
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error('Payment error:', error)
            alert('Payment failed. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg6.png" />
            <FloatingNavbar />

            {/* Payment Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <PaymentSuccessOverlay onComplete={handlePaymentSuccess} />
                )}
            </AnimatePresence>

            <main className="relative z-10 min-h-screen pt-28 pb-20 overflow-x-hidden">
                <div className="section-container px-4 sm:px-6 max-w-5xl mx-auto overflow-hidden">

                    {/* Header with Glitch Animation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center mb-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="px-4 py-1.5 rounded-full border border-glow-cyan/50 bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                <span className="font-cyber text-xs text-glow-cyan tracking-widest">
                                    ORDER_SUMMARY
                                </span>
                            </div>
                        </motion.div>

                        {/* Glitch Title */}
                        <div className="relative inline-block mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                <ScrambleText
                                    text="Checkout"
                                    revealSpeed={50}
                                    scrambleSpeed={30}
                                    delay={200}
                                />
                            </h1>
                            {/* Glitch layer - Cyan offset */}
                            <motion.h1
                                className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#00f0ff] pointer-events-none z-10"
                                style={{ opacity: 0 }}
                                animate={{
                                    x: [0, -8, 4, -6, 0],
                                    y: [0, 3, -2, 0],
                                    scale: [1, 1.03, 0.97, 1],
                                    opacity: [0, 1, 0, 0.8, 0],
                                }}
                                transition={{
                                    duration: 0.2,
                                    repeat: Infinity,
                                    repeatDelay: 1.5,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Checkout
                            </motion.h1>

                            {/* Glitch layer - Violet offset */}
                            <motion.h1
                                className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#8b5cf6] pointer-events-none z-10"
                                style={{ opacity: 0 }}
                                animate={{
                                    x: [0, 8, -4, 6, 0],
                                    y: [0, -3, 2, 0],
                                    scale: [1, 0.97, 1.03, 1],
                                    opacity: [0, 0.9, 0, 0.7, 0],
                                }}
                                transition={{
                                    duration: 0.15,
                                    repeat: Infinity,
                                    repeatDelay: 1.2,
                                    times: [0, 0.2, 0.4, 0.6, 1],
                                }}
                            >
                                Checkout
                            </motion.h1>
                        </div>
                        <p className="text-text-secondary max-w-xl mx-auto font-cyber text-glow-cyan/70 tracking-wide text-sm text-center">
                            Review your selections and complete your registration.
                        </p>
                    </motion.div>

                    {cartItems.length === 0 ? (
                        /* Empty Cart State */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="font-heading text-2xl text-white mb-2">Your cart is empty</h2>
                            <p className="text-text-muted mb-8">Add some events to get started!</p>
                            <Link href="/register">
                                <GlowButton>
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Browse Events
                                </GlowButton>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Cart Items - Left Column */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-heading text-xl text-white">
                                        Selected Events ({cartItems.length})
                                    </h2>
                                    <Link href="/register" className="text-glow-cyan text-sm font-cyber hover:underline flex items-center gap-1">
                                        <Plus className="w-4 h-4" />
                                        ADD MORE
                                    </Link>
                                </div>

                                {cartItems.map((item, index) => {
                                    const event = getEventDetails(item.id)
                                    if (!event) return null
                                    const colors = colorMap[event.color]

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            {/* Cyber Container with Corner Accents */}
                                            <div className="relative rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 overflow-hidden group hover:border-glow-cyan/30 transition-colors">
                                                {/* Corner Accents */}
                                                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-glow-cyan/40 z-10" />
                                                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-glow-cyan/40 z-10" />
                                                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-glow-cyan/40 z-10" />
                                                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-glow-cyan/40 z-10" />

                                                {/* Pulsing Border Glow */}
                                                <motion.div
                                                    className="absolute inset-0 border-2 border-transparent group-hover:border-glow-cyan/30 rounded-2xl pointer-events-none"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />

                                                <div className="p-4 sm:p-5 flex gap-4 relative z-10">
                                                    {/* Event Image */}
                                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                                        {event.image ? (
                                                            <Image
                                                                src={event.image}
                                                                alt={event.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className={`w-full h-full ${colors.bg} flex items-center justify-center`}>
                                                                {event.icon}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Event Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <span className={`text-[10px] font-cyber tracking-widest ${colors.text}`}>
                                                                    {event.category}
                                                                </span>
                                                                <h3 className="font-heading font-bold text-white truncate">
                                                                    {event.title}
                                                                </h3>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 rounded-lg hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-3">
                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    disabled={item.quantity <= 1}
                                                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-glow-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-8 text-center font-mono text-white">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    disabled={item.quantity >= 5}
                                                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-glow-cyan/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="text-right">
                                                                <div className="font-heading font-bold text-lg text-glow-cyan">
                                                                    ₹{event.price * item.quantity}
                                                                </div>
                                                                {item.quantity > 1 && (
                                                                    <div className="text-xs text-text-muted">
                                                                        ₹{event.price} each
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Order Summary - Right Column */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="sticky top-28"
                                >
                                    {/* Cyber Container with Corner Accents */}
                                    <div className="relative rounded-2xl bg-black/40 backdrop-blur-2xl border border-glow-cyan/30 overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                                        {/* Corner Accents */}
                                        <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-glow-cyan z-10" />
                                        <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-glow-cyan z-10" />
                                        <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-glow-cyan z-10" />
                                        <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-glow-cyan z-10" />

                                        {/* Pulsing Border Glow */}
                                        <motion.div
                                            className="absolute inset-0 border-2 border-glow-cyan/20 rounded-2xl pointer-events-none"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />

                                        {/* Bottom Glow Line */}
                                        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-glow-cyan to-transparent opacity-50" />

                                        <div className="p-6 relative z-10">
                                            <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
                                                <Tag className="w-5 h-5 text-glow-cyan" />
                                                Order Summary
                                            </h3>

                                            {/* Coupon Code Input */}
                                            <div className="mb-6">
                                                <label className="text-xs font-cyber tracking-widest text-glow-cyan/70 mb-2 block">
                                                    COUPON_CODE
                                                </label>
                                                {appliedCoupon ? (
                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="w-4 h-4 text-green-400" />
                                                            <span className="font-mono text-green-400">{appliedCoupon}</span>
                                                        </div>
                                                        <button
                                                            onClick={removeCoupon}
                                                            className="text-xs text-red-400 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter code"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value)}
                                                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted font-mono text-sm focus:outline-none focus:border-glow-cyan/50 transition-colors"
                                                        />
                                                        <button
                                                            onClick={applyCoupon}
                                                            className="px-4 py-2.5 rounded-xl bg-glow-cyan/20 border border-glow-cyan/50 text-glow-cyan font-cyber text-xs tracking-wider hover:bg-glow-cyan/30 transition-colors"
                                                        >
                                                            APPLY
                                                        </button>
                                                    </div>
                                                )}
                                                {couponError && (
                                                    <p className="text-xs text-red-400 mt-2">{couponError}</p>
                                                )}
                                            </div>

                                            {/* Price Breakdown */}
                                            <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-text-muted">Subtotal</span>
                                                    <span className="text-white font-mono">₹{subtotal}</span>
                                                </div>
                                                {discount > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-green-400">Discount</span>
                                                        <span className="text-green-400 font-mono">-₹{discount}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between items-baseline mb-8">
                                                <span className="font-cyber text-xs tracking-widest text-glow-cyan/70">TOTAL</span>
                                                <span className="font-heading font-black text-3xl text-glow-cyan drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                                    ₹{total}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-3">
                                                <GlowButton
                                                    onClick={initiatePayment}
                                                    disabled={isProcessing}
                                                    className="w-full justify-center py-4 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <motion.div
                                                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                            />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Zap className="w-5 h-5 mr-2" />
                                                            <span className="font-bold tracking-widest">PAY WITH RAZORPAY</span>
                                                        </>
                                                    )}
                                                </GlowButton>
                                                <Link href="/register" className="block">
                                                    <button className="w-full py-3 rounded-xl border border-white/10 text-text-muted hover:text-white hover:border-glow-cyan/30 font-cyber text-sm tracking-wider transition-colors flex items-center justify-center gap-2">
                                                        <ArrowLeft className="w-4 h-4" />
                                                        ADD MORE EVENTS
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </SmoothScroll>
    )
}
