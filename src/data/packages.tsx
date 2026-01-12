import React from 'react'
import { Code, Brain, Bot, Palette, Gamepad2, Zap } from 'lucide-react'

export const eventPackages = [
    {
        id: 'code-sprint',
        title: 'Code Sprint',
        category: 'CODING',
        description: '24-hour competitive programming challenge',
        price: 499,
        originalPrice: 699,
        teamSize: '2-3 members',
        date: 'Feb 12, 2026',
        features: ['24hr Challenge', 'Mentorship', 'Certificates', 'Swag Kit'],
        image: '/images/events/code.jpg',
        color: 'cyan',
        icon: <Code className="w-8 h-8" />
    },
    {
        id: 'neural-nexus',
        title: 'Neural Nexus',
        category: 'AI/ML',
        description: '36-hour ML hackathon with real datasets',
        price: 599,
        originalPrice: 849,
        teamSize: '3-4 members',
        date: 'Feb 12-13, 2026',
        features: ['Cloud Credits', 'Industry Mentors', 'Job Referrals', 'Swag Kit'],
        image: '/images/events/ai.jpg',
        color: 'violet',
        popular: true,
        icon: <Brain className="w-8 h-8" />
    },
    {
        id: 'robo-wars',
        title: 'Robo Wars',
        category: 'ROBOTICS',
        description: 'Combat robot arena showdown',
        price: 799,
        originalPrice: 1099,
        teamSize: '4-6 members',
        date: 'Feb 13, 2026',
        features: ['Arena Access', 'Safety Gear', 'Tools Provided', 'Trophies'],
        image: '/images/events/robot.jpg',
        color: 'orange',
        icon: <Bot className="w-8 h-8" />
    },
    {
        id: 'pixel-perfect',
        title: 'Pixel Perfect',
        category: 'DESIGN',
        description: 'UI/UX design competition',
        price: 349,
        originalPrice: 499,
        teamSize: '1-2 members',
        date: 'Feb 12, 2026',
        features: ['Design Tools', 'Portfolio Review', 'Mentorship', 'Certificates'],
        image: '/images/events/design.jpg',
        color: 'pink',
        icon: <Palette className="w-8 h-8" />
    },
    {
        id: 'cyber-siege',
        title: 'Cyber Siege',
        category: 'GAMING',
        description: 'Esports tournament - Valorant, CS2',
        price: 449,
        originalPrice: 599,
        teamSize: '5 members',
        date: 'Feb 12-13, 2026',
        features: ['Pro Setups', 'Live Stream', 'Prize Pool', 'Merchandise'],
        image: '/images/events/gaming.jpg',
        color: 'green',
        icon: <Gamepad2 className="w-8 h-8" />
    },
    {
        id: 'quantum-workshop',
        title: 'Quantum 101',
        category: 'WORKSHOP',
        description: 'Hands-on quantum computing workshop',
        price: 299,
        originalPrice: 449,
        teamSize: 'Individual',
        date: 'Feb 12, 2026',
        features: ['IBM Qiskit', 'Certificate', 'Materials', 'Swag Kit'],
        image: '/images/events/quantum.jpg',
        color: 'blue',
        icon: <Zap className="w-8 h-8" />
    }
]

export const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: { bg: 'bg-glow-cyan/10', border: 'border-glow-cyan/30', text: 'text-glow-cyan', glow: 'shadow-[0_0_30px_rgba(0,245,255,0.3)]' },
    violet: { bg: 'bg-glow-violet/10', border: 'border-glow-violet/30', text: 'text-glow-violet', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.3)]' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.3)]' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]' },
}
