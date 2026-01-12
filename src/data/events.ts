export interface Event {
    id: string
    title: string
    category: 'coding' | 'ai' | 'robotics' | 'design' | 'gaming' | 'workshop'
    description: string
    longDescription: string
    date: string
    time: string
    venue: string
    prize: string
    teamSize: string
    registrationDeadline: string
    image: string
    rules: string[]
    timeline: { time: string; activity: string }[]
}

export const events: Event[] = [
    {
        id: 'code-sprint',
        title: 'Code Sprint',
        category: 'coding',
        description: 'A 24-hour competitive programming challenge that pushes the limits of algorithmic thinking.',
        longDescription: 'Code Sprint is the flagship coding competition of NEXUS 2026. Teams of 2-3 compete in a grueling 24-hour marathon of algorithmic challenges, testing their problem-solving skills, coding efficiency, and mental endurance. From dynamic programming to graph theory, participants face a diverse array of problems designed by experts from leading tech companies.',
        date: 'February 12, 2026',
        time: '10:00 AM - 10:00 AM (Next Day)',
        venue: 'Tech Hub Arena',
        prize: '₹2,00,000',
        teamSize: '2-3 members',
        registrationDeadline: 'March 10, 2026',
        image: '/images/code_sprint.png',
        rules: [
            'Teams must consist of 2-3 members from the same institution',
            'All standard programming languages are allowed',
            'Internet access is restricted to documentation only',
            'Any form of cheating leads to immediate disqualification',
            'Decisions of the judges are final'
        ],
        timeline: [
            { time: '09:00 AM', activity: 'Registration & Setup' },
            { time: '10:00 AM', activity: 'Competition Begins' },
            { time: '02:00 PM', activity: 'Lunch Break' },
            { time: '08:00 PM', activity: 'Dinner Break' },
            { time: '10:00 AM', activity: 'Competition Ends' },
            { time: '12:00 PM', activity: 'Results & Prize Distribution' }
        ]
    },
    {
        id: 'neural-nexus',
        title: 'Neural Nexus',
        category: 'ai',
        description: 'Build and train AI models to solve real-world problems in this intensive ML hackathon.',
        longDescription: 'Neural Nexus brings together the brightest minds in artificial intelligence for a 36-hour hackathon focused on creating impactful ML solutions. Participants will work with real datasets provided by our industry partners to develop models that address pressing challenges in healthcare, sustainability, and urban planning.',
        date: 'March 16-17, 2026',
        time: '9:00 AM Day 1 - 9:00 PM Day 2',
        venue: 'AI Research Center',
        prize: '₹3,00,000',
        teamSize: '3-4 members',
        registrationDeadline: 'March 12, 2026',
        image: '/images/neural_nexus.png',
        rules: [
            'Pre-trained models are allowed but must be disclosed',
            'Cloud computing resources will be provided',
            'Solution must be reproducible with clear documentation',
            'Plagiarism detection will be conducted on all submissions',
            'Final presentation is mandatory for all finalists'
        ],
        timeline: [
            { time: 'Day 1 - 9:00 AM', activity: 'Opening Ceremony & Problem Reveal' },
            { time: 'Day 1 - 10:00 AM', activity: 'Hacking Begins' },
            { time: 'Day 1 - 6:00 PM', activity: 'Mentor Sessions' },
            { time: 'Day 2 - 3:00 PM', activity: 'Submission Deadline' },
            { time: 'Day 2 - 5:00 PM', activity: 'Final Presentations' },
            { time: 'Day 2 - 8:00 PM', activity: 'Awards Ceremony' }
        ]
    },
    {
        id: 'robo-wars',
        title: 'Robo Wars',
        category: 'robotics',
        description: 'Design and build combat robots to battle it out in the ultimate arena showdown.',
        longDescription: 'Robo Wars is the most anticipated robotics competition where engineering meets combat. Teams design, build, and operate combat robots in a tournament-style elimination. From spinners to flippers, witness the clash of metal as robots battle for supremacy in our purpose-built arena.',
        date: 'March 17, 2026',
        time: '11:00 AM - 7:00 PM',
        venue: 'Main Arena',
        prize: '₹2,50,000',
        teamSize: '4-6 members',
        registrationDeadline: 'March 5, 2026',
        image: '/images/robo_wars.png',
        rules: [
            'Robots must weigh under 60kg',
            'No projectile weapons or flame-based attacks',
            'Robots must pass safety inspection before competing',
            'Remote control only - no autonomous operation',
            'Arena damage beyond normal combat may result in penalties'
        ],
        timeline: [
            { time: '10:00 AM', activity: 'Weigh-in & Safety Check' },
            { time: '11:00 AM', activity: 'Preliminary Rounds Begin' },
            { time: '02:00 PM', activity: 'Lunch Break' },
            { time: '03:00 PM', activity: 'Quarter Finals' },
            { time: '05:00 PM', activity: 'Semi Finals & Finals' },
            { time: '06:30 PM', activity: 'Prize Distribution' }
        ]
    },
    {
        id: 'pixel-perfect',
        title: 'Pixel Perfect',
        category: 'design',
        description: 'A UI/UX design competition where creativity meets functionality.',
        longDescription: 'Pixel Perfect challenges designers to create stunning, user-centric interfaces for given problem statements. Judged by industry professionals from top design studios, this competition emphasizes both aesthetic excellence and usability. Winners get mentorship opportunities with leading design firms.',
        date: 'February 12, 2026',
        time: '10:00 AM - 6:00 PM',
        venue: 'Design Studio Hall',
        prize: '₹1,00,000',
        teamSize: '1-2 members',
        registrationDeadline: 'March 12, 2026',
        image: '/images/pixel_perfect.png',
        rules: [
            'Any design tool is permitted (Figma, Sketch, Adobe XD, etc.)',
            'Submissions must include interactive prototypes',
            'Design must be original and created during the event',
            'Participants must present their design process',
            'Accessibility considerations will be evaluated'
        ],
        timeline: [
            { time: '10:00 AM', activity: 'Problem Statement Reveal' },
            { time: '10:30 AM', activity: 'Design Phase Begins' },
            { time: '01:00 PM', activity: 'Lunch Break' },
            { time: '04:00 PM', activity: 'Submission Deadline' },
            { time: '04:30 PM', activity: 'Presentations Begin' },
            { time: '06:00 PM', activity: 'Results & Networking' }
        ]
    },
    {
        id: 'cyber-siege',
        title: 'Cyber Siege',
        category: 'gaming',
        description: 'Competitive esports tournament featuring top games in multiple formats.',
        longDescription: 'Cyber Siege is the ultimate gaming showdown featuring tournaments in Valorant, CS2, and Rocket League. With professional-grade setups and live streaming, experience esports at its finest. Top teams compete for massive prize pools and bragging rights.',
        date: 'March 16-17, 2026',
        time: 'All Day Event',
        venue: 'Gaming Arena',
        prize: '₹1,50,000',
        teamSize: '5 members (Varies by game)',
        registrationDeadline: 'March 14, 2026',
        image: '/images/cyber_siege.png',
        rules: [
            'Teams must register for specific game tournaments',
            'All participants must be 16 years or older',
            'Personal peripherals allowed, no custom software',
            'Match schedules are final and non-negotiable',
            'Tournament rules follow official game league standards'
        ],
        timeline: [
            { time: 'Day 1 - 10:00 AM', activity: 'Group Stage Matches' },
            { time: 'Day 1 - 6:00 PM', activity: 'Group Stage Ends' },
            { time: 'Day 2 - 10:00 AM', activity: 'Knockout Rounds' },
            { time: 'Day 2 - 4:00 PM', activity: 'Semi Finals' },
            { time: 'Day 2 - 6:00 PM', activity: 'Grand Finals' },
            { time: 'Day 2 - 8:00 PM', activity: 'Prize Ceremony' }
        ]
    },
    {
        id: 'quantum-computing-101',
        title: 'Quantum Computing 101',
        category: 'workshop',
        description: 'Hands-on workshop introducing quantum computing concepts and programming.',
        longDescription: 'Dive into the fascinating world of quantum computing with this comprehensive workshop. Led by researchers from leading quantum computing companies, participants will learn quantum mechanics fundamentals, work with Qiskit, and run actual quantum circuits on IBM quantum computers.',
        date: 'February 12, 2026',
        time: '2:00 PM - 6:00 PM',
        venue: 'Seminar Hall A',
        prize: 'Certificate + Swag Kit',
        teamSize: 'Individual',
        registrationDeadline: 'March 14, 2026',
        image: '/images/quantum_101.png',
        rules: [
            'Basic Python knowledge required',
            'Laptops mandatory',
            'Limited to 100 participants',
            'Certificate provided upon completion',
            'Materials will be shared digitally'
        ],
        timeline: [
            { time: '2:00 PM', activity: 'Introduction to Quantum Mechanics' },
            { time: '3:00 PM', activity: 'Quantum Gates & Circuits' },
            { time: '4:00 PM', activity: 'Break' },
            { time: '4:15 PM', activity: 'Hands-on with Qiskit' },
            { time: '5:30 PM', activity: 'Q&A Session' },
            { time: '6:00 PM', activity: 'Certificate Distribution' }
        ]
    }
]

export const eventCategories = [
    { id: 'all', label: 'All Events', icon: '🎯' },
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'ai', label: 'AI/ML', icon: '🤖' },
    { id: 'robotics', label: 'Robotics', icon: '🦾' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'workshop', label: 'Workshops', icon: '📚' },
]
