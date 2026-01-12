'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, Tag, ArrowLeft, ArrowRight } from 'lucide-react'
import { FloatingNavbar } from '@/components/navigation'
import { SmoothScroll, GlowCursor } from '@/components/effects'
import { GlowButton, GlassCard, ScrambleText } from '@/components/ui'
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

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
    const [couponError, setCouponError] = useState('')
    const [discount, setDiscount] = useState(0)

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
        'TECHFEST20': 20,
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

    return (
        <SmoothScroll>
            <GlowCursor />
            <Background3D backgroundImage="/images/new_bg6.png" />
            <FloatingNavbar />

            <main className="relative z-10 min-h-screen pt-28 pb-20">
                <div className="section-container px-4 sm:px-6 max-w-5xl mx-auto">

                    {/* Header */}
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

                        <div className="relative inline-block mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-glow-cyan drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                                <ScrambleText
                                    text="Checkout"
                                    revealSpeed={50}
                                    scrambleSpeed={30}
                                    delay={200}
                                />
                            </h1>
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
                                            <GlassCard className="p-4 sm:p-5" glowColor="cyan">
                                                <div className="flex gap-4">
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
                                                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                <span className="w-8 text-center font-mono text-white">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    disabled={item.quantity >= 5}
                                                                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                                            </GlassCard>
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
                                    <GlassCard className="p-6" glowColor="cyan">
                                        <h3 className="font-heading font-bold text-lg text-white mb-6 flex items-center gap-2">
                                            <Tag className="w-5 h-5 text-glow-cyan" />
                                            Order Summary
                                        </h3>

                                        {/* Coupon Code Input */}
                                        <div className="mb-6">
                                            <label className="text-xs font-cyber tracking-widest text-text-muted mb-2 block">
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
                                            <span className="font-cyber text-xs tracking-widest text-text-muted">TOTAL</span>
                                            <span className="font-heading font-black text-3xl text-glow-cyan">
                                                ₹{total}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="space-y-3">
                                            <GlowButton className="w-full justify-center py-4">
                                                <span className="font-bold tracking-widest">PROCEED TO PAY</span>
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </GlowButton>
                                            <Link href="/register" className="block">
                                                <button className="w-full py-3 rounded-xl border border-white/10 text-text-muted hover:text-white hover:border-white/20 font-cyber text-xs tracking-wider transition-colors">
                                                    ← ADD MORE EVENTS
                                                </button>
                                            </Link>
                                        </div>
                                    </GlassCard>
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
