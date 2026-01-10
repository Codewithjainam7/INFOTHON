import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'bg-primary': '#0a0a0f',
                'bg-secondary': '#12121a',
                'bg-tertiary': '#1a1a2e',
                'glow-cyan': '#00f0ff',
                'glow-violet': '#8b5cf6',
                'glow-purple': '#a855f7',
                'accent-blue': '#3b82f6',
                'accent-steel': '#64748b',
                'text-primary': '#ffffff',
                'text-secondary': '#94a3b8',
                'text-muted': '#64748b',
            },
            fontFamily: {
                'heading': ['Space Grotesk', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'spin-slow': 'spin 8s linear infinite',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
                'slide-down': 'slideDown 0.6s ease-out forwards',
                'scale-in': 'scaleIn 0.4s ease-out forwards',
                'text-reveal': 'textReveal 0.8s ease-out forwards',
                'border-glow': 'borderGlow 3s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
                        borderColor: 'rgba(0, 240, 255, 0.5)'
                    },
                    '50%': {
                        boxShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(0, 240, 255, 0.2)',
                        borderColor: 'rgba(0, 240, 255, 0.8)'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(2deg)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fadeIn': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slideUp': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slideDown': {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scaleIn': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'textReveal': {
                    '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
                },
                'borderGlow': {
                    '0%, 100%': {
                        borderColor: 'rgba(0, 240, 255, 0.3)',
                    },
                    '50%': {
                        borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glow-gradient': 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(0, 240, 255, 0.3)',
                'glow-md': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
                'glow-lg': '0 0 30px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.2)',
                'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
                'inner-glow': 'inset 0 0 20px rgba(0, 240, 255, 0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            transitionTimingFunction: {
                'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}

export default config
