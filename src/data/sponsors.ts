export interface Sponsor {
    id: string
    name: string
    logo: string
    tier: 'title' | 'platinum' | 'gold' | 'silver'
    website: string
}

export const sponsors: Sponsor[] = [
    {
        id: 'sponsor-1',
        name: 'TechCorp Global',
        logo: '/sponsors/techcorp.svg',
        tier: 'title',
        website: 'https://techcorp.com'
    },
    {
        id: 'sponsor-2',
        name: 'InnovateAI Labs',
        logo: '/sponsors/innovateai.svg',
        tier: 'title',
        website: 'https://innovateai.com'
    },
    {
        id: 'sponsor-3',
        name: 'QuantumLeap',
        logo: '/sponsors/quantumleap.svg',
        tier: 'platinum',
        website: 'https://quantumleap.tech'
    },
    {
        id: 'sponsor-4',
        name: 'CyberSecure Inc',
        logo: '/sponsors/cybersecure.svg',
        tier: 'platinum',
        website: 'https://cybersecure.com'
    },
    {
        id: 'sponsor-5',
        name: 'RoboTech Industries',
        logo: '/sponsors/robotech.svg',
        tier: 'gold',
        website: 'https://robotech.industries'
    },
    {
        id: 'sponsor-6',
        name: 'CloudNine Solutions',
        logo: '/sponsors/cloudnine.svg',
        tier: 'gold',
        website: 'https://cloudnine.solutions'
    },
    {
        id: 'sponsor-7',
        name: 'DataDrive Analytics',
        logo: '/sponsors/datadrive.svg',
        tier: 'gold',
        website: 'https://datadrive.analytics'
    },
    {
        id: 'sponsor-8',
        name: 'PixelForge Studio',
        logo: '/sponsors/pixelforge.svg',
        tier: 'silver',
        website: 'https://pixelforge.studio'
    },
    {
        id: 'sponsor-9',
        name: 'ByteStream Media',
        logo: '/sponsors/bytestream.svg',
        tier: 'silver',
        website: 'https://bytestream.media'
    },
    {
        id: 'sponsor-10',
        name: 'NeuralNet Systems',
        logo: '/sponsors/neuralnet.svg',
        tier: 'silver',
        website: 'https://neuralnet.systems'
    }
]

export const sponsorTiers = [
    { id: 'title', label: 'Title Sponsors', color: 'from-yellow-400 to-amber-600' },
    { id: 'platinum', label: 'Platinum Partners', color: 'from-slate-300 to-slate-500' },
    { id: 'gold', label: 'Gold Partners', color: 'from-yellow-500 to-yellow-700' },
    { id: 'silver', label: 'Silver Partners', color: 'from-gray-400 to-gray-600' }
]
