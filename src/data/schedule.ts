export interface ScheduleItem {
    id: string
    time: string
    title: string
    description: string
    venue: string
    type: 'event' | 'ceremony' | 'break' | 'workshop' | 'talk'
}

export interface DaySchedule {
    day: number
    date: string
    label: string
    items: ScheduleItem[]
}

export const schedule: DaySchedule[] = [
    {
        day: 1,
        date: 'February 12, 2026',
        label: 'Day 1 - Genesis',
        items: [
            {
                id: 'sch-1-1',
                time: '09:00 AM',
                title: 'Opening Ceremony',
                description: 'Grand inauguration with chief guests and keynote address',
                venue: 'Main Auditorium',
                type: 'ceremony'
            },
            {
                id: 'sch-1-2',
                time: '10:30 AM',
                title: 'Code Sprint Begins',
                description: '24-hour competitive programming challenge kickoff',
                venue: 'Tech Hub Arena',
                type: 'event'
            },
            {
                id: 'sch-1-3',
                time: '11:00 AM',
                title: 'Pixel Perfect Design Competition',
                description: 'UI/UX design challenge begins',
                venue: 'Design Studio Hall',
                type: 'event'
            },
            {
                id: 'sch-1-4',
                time: '01:00 PM',
                title: 'Lunch Break',
                description: 'Networking lunch with sponsors',
                venue: 'Food Court',
                type: 'break'
            },
            {
                id: 'sch-1-5',
                time: '02:00 PM',
                title: 'Quantum Computing Workshop',
                description: 'Hands-on session with IBM Qiskit',
                venue: 'Seminar Hall A',
                type: 'workshop'
            },
            {
                id: 'sch-1-6',
                time: '04:00 PM',
                title: 'Keynote: Future of AGI',
                description: 'By Dr. Sarah Chen, DeepMind',
                venue: 'Main Auditorium',
                type: 'talk'
            },
            {
                id: 'sch-1-7',
                time: '06:00 PM',
                title: 'Cultural Evening',
                description: 'Music, dance, and entertainment',
                venue: 'Open Air Theatre',
                type: 'ceremony'
            }
        ]
    },
    {
        day: 2,
        date: 'February 13, 2026',
        label: 'Day 2 - Apex',
        items: [
            {
                id: 'sch-2-1',
                time: '09:00 AM',
                title: 'Neural Nexus AI Hackathon Begins',
                description: '36-hour ML hackathon kickoff',
                venue: 'AI Research Center',
                type: 'event'
            },
            {
                id: 'sch-2-2',
                time: '10:00 AM',
                title: 'Cyber Siege Gaming Tournament',
                description: 'Esports group stage matches',
                venue: 'Gaming Arena',
                type: 'event'
            },
            {
                id: 'sch-2-3',
                time: '10:30 AM',
                title: 'Code Sprint Ends',
                description: 'Final submissions and judging begins',
                venue: 'Tech Hub Arena',
                type: 'event'
            },
            {
                id: 'sch-2-4',
                time: '01:00 PM',
                title: 'Lunch Break',
                description: 'Sponsor booths and demos',
                venue: 'Exhibition Hall',
                type: 'break'
            },
            {
                id: 'sch-2-5',
                time: '02:30 PM',
                title: 'Talk: Quantum Computing in Practice',
                description: 'By Raj Malhotra, QuantumLeap',
                venue: 'Seminar Hall B',
                type: 'talk'
            },
            {
                id: 'sch-2-6',
                time: '04:00 PM',
                title: 'Robotics Workshop',
                description: 'Building autonomous systems with ROS2',
                venue: 'Robotics Lab',
                type: 'workshop'
            },
            {
                id: 'sch-2-7',
                time: '07:00 PM',
                title: 'DJ Night',
                description: 'Music and celebration',
                venue: 'Central Grounds',
                type: 'ceremony'
            }
        ]
    },
    {
        day: 3,
        date: 'March 17, 2026',
        label: 'Day 3 - Apex',
        items: [
            {
                id: 'sch-3-1',
                time: '10:00 AM',
                title: 'Robo Wars Safety Check',
                description: 'Weigh-in and safety inspection',
                venue: 'Main Arena',
                type: 'event'
            },
            {
                id: 'sch-3-2',
                time: '11:00 AM',
                title: 'Robo Wars Tournament',
                description: 'Robot combat competition begins',
                venue: 'Main Arena',
                type: 'event'
            },
            {
                id: 'sch-3-3',
                time: '02:00 PM',
                title: 'Cyber Siege Grand Finals',
                description: 'Esports championship matches',
                venue: 'Gaming Arena',
                type: 'event'
            },
            {
                id: 'sch-3-4',
                time: '03:00 PM',
                title: 'Neural Nexus Presentations',
                description: 'AI hackathon finalist presentations',
                venue: 'Main Auditorium',
                type: 'event'
            },
            {
                id: 'sch-3-5',
                time: '05:00 PM',
                title: 'Panel: Future of Robotics',
                description: 'Industry experts discussion',
                venue: 'Seminar Hall A',
                type: 'talk'
            },
            {
                id: 'sch-3-6',
                time: '07:00 PM',
                title: 'Grand Closing Ceremony',
                description: 'Prize distribution and farewell',
                venue: 'Main Auditorium',
                type: 'ceremony'
            }
        ]
    }
]
