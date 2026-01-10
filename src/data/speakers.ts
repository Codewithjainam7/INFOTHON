export interface Speaker {
    id: string
    name: string
    title: string
    company: string
    image: string
    topic: string
    bio: string
    social: {
        twitter?: string
        linkedin?: string
    }
}

export const speakers: Speaker[] = [
    {
        id: 'speaker-1',
        name: 'Dr. Sarah Chen',
        title: 'Chief AI Scientist',
        company: 'DeepMind',
        image: '/speakers/speaker-1.jpg',
        topic: 'The Future of AGI: Challenges and Possibilities',
        bio: 'Dr. Sarah Chen leads the foundational research team at DeepMind, focusing on developing AI systems that can reason and learn like humans. Her work on neural architecture search has been cited over 10,000 times.',
        social: {
            twitter: 'https://twitter.com/sarahchen',
            linkedin: 'https://linkedin.com/in/sarahchen'
        }
    },
    {
        id: 'speaker-2',
        name: 'Raj Malhotra',
        title: 'Co-Founder & CTO',
        company: 'QuantumLeap Technologies',
        image: '/speakers/speaker-2.jpg',
        topic: 'Quantum Computing in Practice: Real-world Applications',
        bio: 'A pioneer in making quantum computing accessible, Raj has led teams that developed the first commercially viable quantum optimization solutions for logistics and finance sectors.',
        social: {
            linkedin: 'https://linkedin.com/in/rajmalhotra'
        }
    },
    {
        id: 'speaker-3',
        name: 'Maya Rodriguez',
        title: 'VP of Design',
        company: 'Apple',
        image: '/speakers/speaker-3.jpg',
        topic: 'Designing the Invisible: Creating Seamless Human-Computer Interaction',
        bio: 'Maya has shaped the design language of some of the most iconic tech products of the decade. She advocates for inclusive design that puts human needs at the center of technology.',
        social: {
            twitter: 'https://twitter.com/mayarod',
            linkedin: 'https://linkedin.com/in/mayarodriguez'
        }
    },
    {
        id: 'speaker-4',
        name: 'Dr. James Liu',
        title: 'Director of Robotics',
        company: 'Boston Dynamics',
        image: '/speakers/speaker-4.jpg',
        topic: 'From Factory Floors to Mars: The Evolution of Autonomous Robots',
        bio: 'Dr. Liu leads the advanced locomotion team and has been instrumental in developing robots that can navigate complex terrains. His TED talk on robotic mobility has over 5 million views.',
        social: {
            twitter: 'https://twitter.com/jamesliu_robots',
            linkedin: 'https://linkedin.com/in/jamesliu'
        }
    }
]
