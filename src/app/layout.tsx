import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'INFOTHON 2026 | The Future Awaits',
    description: 'Experience the pinnacle of innovation at INFOTHON 2026 - A world-class tech festival featuring cutting-edge competitions, workshops, and exhibitions.',
    keywords: ['tech fest', 'technology festival', 'hackathon', 'robotics', 'AI', 'innovation', 'college fest', 'infothon'],
    authors: [{ name: 'INFOTHON Tech Festival' }],
    openGraph: {
        title: 'INFOTHON 2026 | The Future Awaits',
        description: 'Experience the pinnacle of innovation at INFOTHON 2026',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" type="image/png" href="/images/INFOTHON.png" />
                <link rel="apple-touch-icon" href="/images/INFOTHON.png" />
                <meta name="theme-color" content="#0a0a0f" />
            </head>
            <body className="bg-bg-primary text-text-primary antialiased">
                {children}
            </body>
        </html>
    )
}
