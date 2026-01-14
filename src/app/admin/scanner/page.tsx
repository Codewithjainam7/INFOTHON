'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import { Lock, Scan, CheckCircle, XCircle, User, Calendar, MapPin, Ticket, Mail, Shield, AlertTriangle, Database, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// Hardcoded credentials
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'infothon2k26ADMIN'

interface TicketData {
    ticketId: string
    event: string
    eventName: string
    attendee: string
    email: string
    date: string
    verified: boolean
    issuedAt: string
}

interface DBRegistration {
    ticket_id: string
    user_id: string
    user_email: string
    attendee_name: string
    event_id: string
    event_name: string
    event_date: string
    verified: boolean
    created_at: string
}

// Glitch Text Component
function GlitchText({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative inline-block ${className}`}>
            <span className="relative z-10">{children}</span>
            <motion.span
                className="absolute inset-0 text-glow-cyan opacity-0"
                animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0, 0.3, 0] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
            >
                {children}
            </motion.span>
            <motion.span
                className="absolute inset-0 text-glow-violet opacity-0"
                animate={{ x: [2, -2, 1, 0], opacity: [0, 0.4, 0, 0.2, 0] }}
                transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 2.5 }}
            >
                {children}
            </motion.span>
        </div>
    )
}

// Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        setTimeout(() => {
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                onLogin()
            } else {
                setError('ACCESS DENIED: Invalid credentials')
                setIsLoading(false)
            }
        }, 1500)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto"
        >
            <div className="relative p-8 rounded-2xl border border-glow-cyan/30 bg-black/80 backdrop-blur-xl overflow-hidden">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-glow-cyan" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-glow-violet" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-glow-violet" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-glow-cyan" />

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.05) 2px, rgba(0,245,255,0.05) 4px)'
                }} />

                <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                        <motion.div
                            className="w-16 h-16 rounded-full border-2 border-glow-cyan flex items-center justify-center"
                            animate={{ boxShadow: ['0 0 20px rgba(0,245,255,0.3)', '0 0 40px rgba(0,245,255,0.5)', '0 0 20px rgba(0,245,255,0.3)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Shield className="w-8 h-8 text-glow-cyan" />
                        </motion.div>
                    </div>

                    <h2 className="text-2xl font-heading font-bold text-center mb-2">
                        <GlitchText>ADMIN ACCESS</GlitchText>
                    </h2>
                    <p className="text-text-muted text-sm text-center mb-6 font-mono">
                        EVENT COORDINATOR PORTAL
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-glow-cyan mb-2 uppercase tracking-wider">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-glow-cyan/60" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black/50 border border-glow-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all font-mono"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-glow-cyan mb-2 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-glow-cyan/60" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-glow-cyan/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-glow-cyan focus:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all font-mono"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400"
                            >
                                <AlertTriangle className="w-5 h-5" />
                                <span className="text-sm font-mono">{error}</span>
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-lg bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-bold uppercase tracking-wider relative overflow-hidden disabled:opacity-50"
                        >
                            {isLoading ? (
                                <motion.span
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    AUTHENTICATING...
                                </motion.span>
                            ) : (
                                'ACCESS SYSTEM'
                            )}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.button>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

// Scanner Component
function QRScanner({ onScan }: { onScan: (data: TicketData | null) => void }) {
    const [isScanning, setIsScanning] = useState(false)
    const [scanError, setScanError] = useState('')
    const scannerRef = useRef<Html5Qrcode | null>(null)

    const startScanning = async () => {
        setScanError('')
        setIsScanning(true)

        try {
            const scanner = new Html5Qrcode('qr-reader')
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    try {
                        const data = JSON.parse(decodedText) as TicketData
                        onScan(data)
                        stopScanning()
                    } catch {
                        setScanError('Invalid QR format')
                    }
                },
                () => { /* Ignore scan failures */ }
            )
        } catch (err) {
            setScanError('Camera access denied or not available')
            setIsScanning(false)
        }
    }

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop()
                scannerRef.current = null
            } catch {
                // Ignore stop errors
            }
        }
        setIsScanning(false)
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => { })
            }
        }
    }, [])

    return (
        <div className="text-center">
            <div className="relative w-full max-w-sm mx-auto mb-6">
                {/* Scanner frame */}
                <div className="relative aspect-square rounded-2xl border-2 border-glow-cyan/50 overflow-hidden bg-black/50">
                    {/* Corner decorations */}
                    <div className="absolute top-2 left-2 w-10 h-10 border-l-4 border-t-4 border-glow-cyan z-20" />
                    <div className="absolute top-2 right-2 w-10 h-10 border-r-4 border-t-4 border-glow-cyan z-20" />
                    <div className="absolute bottom-2 left-2 w-10 h-10 border-l-4 border-b-4 border-glow-cyan z-20" />
                    <div className="absolute bottom-2 right-2 w-10 h-10 border-r-4 border-b-4 border-glow-cyan z-20" />

                    {/* Scanning line animation */}
                    {isScanning && (
                        <motion.div
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-glow-cyan to-transparent z-10"
                            animate={{ top: ['5%', '95%', '5%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        />
                    )}

                    {/* QR Reader container */}
                    <div id="qr-reader" className="w-full h-full" />

                    {/* Placeholder when not scanning */}
                    {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Scan className="w-20 h-20 text-glow-cyan/50" />
                            </motion.div>
                            <p className="mt-4 text-text-muted font-mono text-sm">
                                Press START to activate camera
                            </p>
                        </div>
                    )}
                </div>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                        boxShadow: isScanning
                            ? ['0 0 30px rgba(0,245,255,0.3)', '0 0 50px rgba(0,245,255,0.5)', '0 0 30px rgba(0,245,255,0.3)']
                            : '0 0 20px rgba(0,245,255,0.2)'
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

            {scanError && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-mono text-sm"
                >
                    {scanError}
                </motion.div>
            )}

            <motion.button
                onClick={isScanning ? stopScanning : startScanning}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all ${isScanning
                    ? 'bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30'
                    : 'bg-gradient-to-r from-glow-cyan to-glow-violet text-black'
                    }`}
            >
                {isScanning ? 'STOP SCANNING' : 'START SCANNING'}
            </motion.button>
        </div>
    )
}

// Verification Result Component with DB info
function VerificationResult({
    data,
    dbRecord,
    isLoading,
    showCheckedIn,
    onReset,
    onMarkVerified
}: {
    data: TicketData | null
    dbRecord: DBRegistration | null
    isLoading: boolean
    showCheckedIn: boolean
    onReset: () => void
    onMarkVerified: () => void
}) {
    const isValid = dbRecord !== null
    const alreadyVerified = dbRecord?.verified === true

    // Show success celebration when just checked in
    if (showCheckedIn) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg mx-auto"
            >
                <div className="relative p-8 rounded-2xl border-2 border-green-500/50 bg-green-500/10 backdrop-blur-xl overflow-hidden text-center">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-500" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-500" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-500" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-500" />

                    {/* Success animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <motion.div
                            className="w-28 h-28 rounded-full border-4 border-green-500 flex items-center justify-center"
                            animate={{
                                boxShadow: ['0 0 20px rgba(34,197,94,0.3)', '0 0 60px rgba(34,197,94,0.6)', '0 0 20px rgba(34,197,94,0.3)']
                            }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring' }}
                            >
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-heading font-bold text-green-500 mb-4"
                    >
                        ✓ CHECK-IN COMPLETE!
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white font-mono mb-2"
                    >
                        {dbRecord?.attendee_name}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-text-muted text-sm font-mono mb-6"
                    >
                        {dbRecord?.event_name}
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={onReset}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-bold uppercase tracking-wider"
                    >
                        SCAN ANOTHER TICKET
                    </motion.button>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg mx-auto"
        >
            {isLoading ? (
                <div className="text-center p-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-4"
                    >
                        <RefreshCw className="w-16 h-16 text-glow-cyan" />
                    </motion.div>
                    <p className="text-glow-cyan font-mono animate-pulse">VERIFYING IN DATABASE...</p>
                </div>
            ) : (
                <div className={`relative p-8 rounded-2xl border-2 ${isValid ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                    } backdrop-blur-xl overflow-hidden`}>
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 ${isValid ? 'border-green-500' : 'border-red-500'}`} />
                    <div className={`absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 ${isValid ? 'border-green-500' : 'border-red-500'}`} />
                    <div className={`absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 ${isValid ? 'border-green-500' : 'border-red-500'}`} />
                    <div className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 ${isValid ? 'border-green-500' : 'border-red-500'}`} />

                    {/* Status icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="flex justify-center mb-6"
                    >
                        <motion.div
                            className={`w-24 h-24 rounded-full border-4 ${isValid ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}
                            animate={{
                                boxShadow: isValid
                                    ? ['0 0 30px rgba(34,197,94,0.3)', '0 0 60px rgba(34,197,94,0.5)', '0 0 30px rgba(34,197,94,0.3)']
                                    : ['0 0 30px rgba(239,68,68,0.3)', '0 0 60px rgba(239,68,68,0.5)', '0 0 30px rgba(239,68,68,0.3)']
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {isValid ? (
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            ) : (
                                <XCircle className="w-12 h-12 text-red-500" />
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Status text */}
                    <h2 className={`text-3xl font-heading font-bold text-center mb-2 ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                        <GlitchText>
                            {isValid ? '✓ TICKET VERIFIED' : '✗ TICKET NOT FOUND'}
                        </GlitchText>
                    </h2>

                    {/* Database verification badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono ${isValid ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
                            }`}>
                            <Database className="w-4 h-4" />
                            {isValid ? 'FOUND IN DATABASE' : 'NOT IN DATABASE'}
                        </div>
                    </div>

                    {/* Already verified warning */}
                    {alreadyVerified && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 flex items-center gap-2"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm font-mono">TICKET ALREADY SCANNED PREVIOUSLY</span>
                        </motion.div>
                    )}

                    {/* Ticket details from DB */}
                    {dbRecord && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4 mb-6"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase mb-1">
                                        <Ticket className="w-4 h-4" />
                                        Ticket ID
                                    </div>
                                    <div className="font-mono text-glow-cyan font-bold text-sm">{dbRecord.ticket_id}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Event
                                    </div>
                                    <div className="font-bold text-white">{dbRecord.event_name}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase mb-1">
                                        <User className="w-4 h-4" />
                                        Attendee
                                    </div>
                                    <div className="font-bold text-white">{dbRecord.attendee_name}</div>
                                </div>
                                <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                                    <div className="flex items-center gap-2 text-text-muted text-xs uppercase mb-1">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </div>
                                    <div className="font-mono text-sm text-white truncate">{dbRecord.user_email}</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                                <div className="flex items-center gap-2 text-text-muted text-xs uppercase mb-1">
                                    <MapPin className="w-4 h-4" />
                                    Event Date
                                </div>
                                <div className="font-bold text-white">{dbRecord.event_date}</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Fallback: show QR data if no DB record */}
                    {!dbRecord && data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                        >
                            <p className="text-red-400 text-sm font-mono mb-2">QR Data (Not in Database):</p>
                            <p className="text-white text-sm">Ticket: {data.ticketId}</p>
                            <p className="text-white text-sm">Event: {data.eventName}</p>
                            <p className="text-white text-sm">Attendee: {data.attendee}</p>
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-3">
                        {isValid && !alreadyVerified && (
                            <motion.button
                                onClick={onMarkVerified}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl bg-green-500 text-black font-bold uppercase tracking-wider"
                            >
                                ✓ MARK AS CHECKED IN
                            </motion.button>
                        )}
                        <motion.button
                            onClick={onReset}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-violet text-black font-bold uppercase tracking-wider"
                        >
                            SCAN ANOTHER TICKET
                        </motion.button>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

// Main Admin Scanner Page
export default function AdminScannerPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [scannedData, setScannedData] = useState<TicketData | null>(null)
    const [dbRecord, setDbRecord] = useState<DBRegistration | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [showCheckedIn, setShowCheckedIn] = useState(false)

    const verifyInDatabase = async (data: TicketData) => {
        setIsVerifying(true)
        const supabase = createClient()

        try {
            // Query the registrations table for this ticket
            const { data: registration, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('ticket_id', data.ticketId)
                .single()

            if (error || !registration) {
                console.log('Ticket not found in DB:', data.ticketId)
                setDbRecord(null)
            } else {
                console.log('Found registration:', registration)
                setDbRecord(registration as DBRegistration)
            }
        } catch (err) {
            console.error('DB verification error:', err)
            setDbRecord(null)
        }

        setIsVerifying(false)
    }

    const handleScan = async (data: TicketData | null) => {
        setScannedData(data)
        setShowResult(true)
        setShowCheckedIn(false)

        if (data) {
            await verifyInDatabase(data)
        }
    }

    const handleMarkVerified = async () => {
        if (!dbRecord) return

        const supabase = createClient()
        const { error } = await supabase
            .from('registrations')
            .update({ verified: true })
            .eq('ticket_id', dbRecord.ticket_id)

        if (!error) {
            setDbRecord({ ...dbRecord, verified: true })
            setShowCheckedIn(true)
        }
    }

    const handleReset = () => {
        setScannedData(null)
        setDbRecord(null)
        setShowResult(false)
        setShowCheckedIn(false)
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-glow-cyan/5 via-transparent to-glow-violet/5" />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 245, 255, 0.03) 2px, rgba(0, 245, 255, 0.03) 4px)'
            }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">
                        <span className="text-glow-cyan">INFOTHON</span>
                        <span className="text-white"> × </span>
                        <span className="text-glow-violet">2K26</span>
                    </h1>
                    <p className="text-text-muted font-mono uppercase tracking-widest">
                        Ticket Verification System
                    </p>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {!isAuthenticated ? (
                        <motion.div key="login" exit={{ opacity: 0, scale: 0.9 }}>
                            <AdminLogin onLogin={() => setIsAuthenticated(true)} />
                        </motion.div>
                    ) : showResult ? (
                        <motion.div key="result" exit={{ opacity: 0, scale: 0.9 }}>
                            <VerificationResult
                                data={scannedData}
                                dbRecord={dbRecord}
                                isLoading={isVerifying}
                                showCheckedIn={showCheckedIn}
                                onReset={handleReset}
                                onMarkVerified={handleMarkVerified}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="max-w-md mx-auto">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                                        <GlitchText>SCAN TICKET QR</GlitchText>
                                    </h2>
                                    <p className="text-text-muted text-sm">
                                        Point camera at attendee&apos;s ticket QR code
                                    </p>
                                </div>
                                <QRScanner onScan={handleScan} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
