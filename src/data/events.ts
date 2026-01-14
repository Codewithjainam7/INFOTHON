export interface Event {
    id: string
    title: string
    category: 'coding' | 'ai' | 'hackathon' | 'quiz' | 'fun' | 'debate' | 'showcase' | 'speed' | 'design'
    description: string
    longDescription: string
    date: string
    time: string
    venue: string
    prize: string
    teamSize: string
    teamMinSize: number
    teamMaxSize: number
    isTeamEvent: boolean
    registrationFee: number
    registrationDeadline: string
    image: string
    rules: string[]
    timeline: { time: string; activity: string }[]
}

export const events: Event[] = [
    {
        id: 'hackathon',
        title: 'Hackathon',
        category: 'hackathon',
        description: 'A 2-day innovation challenge where teams build next-gen solutions in Gen AI and Agentic AI from scratch.',
        longDescription: 'The flagship 36-hour hackathon of INFOTHON × 2K26. Teams of 1-5 members ideate, design, and build innovative solutions using Generative AI and Agentic AI technologies. Work with cutting-edge tools, get mentorship from industry experts, and compete for massive prizes. Cloud credits, APIs, and development resources will be provided.',
        date: 'Day 1 & Day 2',
        time: '36 Hours Non-Stop',
        venue: 'Main Tech Arena',
        prize: '₹1,00,000',
        teamSize: '1-5 members',
        teamMinSize: 1,
        teamMaxSize: 5,
        isTeamEvent: true,
        registrationFee: 1000,
        registrationDeadline: 'February 10, 2026',
        image: '/images/hackathon.png',
        rules: [
            'Teams can have 1-5 members',
            'All code must be written during the hackathon',
            'Pre-built templates and libraries are allowed',
            'Projects must incorporate AI/ML components',
            'Final submission must include working demo and documentation'
        ],
        timeline: [
            { time: 'Day 1 - 9:00 AM', activity: 'Opening Ceremony & Problem Statement Release' },
            { time: 'Day 1 - 10:00 AM', activity: 'Hacking Begins' },
            { time: 'Day 1 - 6:00 PM', activity: 'Mentor Sessions' },
            { time: 'Day 2 - 3:00 PM', activity: 'Code Freeze & Submission' },
            { time: 'Day 2 - 4:00 PM', activity: 'Final Presentations' },
            { time: 'Day 2 - 7:00 PM', activity: 'Awards Ceremony' }
        ]
    },
    {
        id: 'blind-coding',
        title: 'Blind Coding',
        category: 'coding',
        description: 'Test your logical thinking by solving coding problems without seeing the output on the screen.',
        longDescription: 'Can you code without seeing your output? This unique challenge tests your pure programming logic and mental debugging skills. Write code, submit, and hope your logic is flawless - because you won\'t see any output until the final evaluation!',
        date: 'Day 1',
        time: '2:00 PM - 4:00 PM',
        venue: 'Computer Lab A',
        prize: '₹15,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 100,
        registrationDeadline: 'February 10, 2026',
        image: '/images/blind_coding.png',
        rules: [
            'Individual participation only',
            'Languages allowed: C, C++, Python, Java',
            'No output visible during coding',
            'Multiple problems with increasing difficulty',
            'Time-based scoring'
        ],
        timeline: [
            { time: '2:00 PM', activity: 'Registration & Briefing' },
            { time: '2:15 PM', activity: 'Competition Starts' },
            { time: '3:45 PM', activity: 'Submission Deadline' },
            { time: '4:00 PM', activity: 'Results & Prizes' }
        ]
    },
    {
        id: 'prompt-ai',
        title: 'Prompt AI',
        category: 'ai',
        description: 'Craft powerful and creative prompts to get the best results from AI tools and models.',
        longDescription: 'Master the art of prompt engineering! Participants will be given tasks that require crafting the perfect prompts to get desired outputs from AI models like GPT, Claude, and image generators. The one who extracts the best results wins!',
        date: 'Day 1',
        time: '10:00 AM - 12:00 PM',
        venue: 'AI Lab',
        prize: '₹15,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 100,
        registrationDeadline: 'February 10, 2026',
        image: '/images/prompt_ai.png',
        rules: [
            'Individual participation',
            'Multiple AI tools will be provided',
            'Tasks include text, code, and image generation',
            'Judged on creativity and accuracy',
            'Time limit per challenge'
        ],
        timeline: [
            { time: '10:00 AM', activity: 'Introduction to Challenge' },
            { time: '10:15 AM', activity: 'Round 1: Text Prompts' },
            { time: '10:45 AM', activity: 'Round 2: Code Generation' },
            { time: '11:15 AM', activity: 'Round 3: Creative Tasks' },
            { time: '12:00 PM', activity: 'Judging & Results' }
        ]
    },
    {
        id: 'tech-quiz',
        title: 'Tech Quiz',
        category: 'quiz',
        description: 'A fast-paced quiz covering technology, programming, AI, and general tech knowledge.',
        longDescription: 'Test your tech IQ in this rapid-fire quiz competition! Questions span across programming languages, AI/ML concepts, tech history, current trends, and general computing knowledge. Fast fingers and faster thinking required!',
        date: 'Day 1',
        time: '4:00 PM - 5:30 PM',
        venue: 'Seminar Hall',
        prize: '₹10,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 50,
        registrationDeadline: 'February 10, 2026',
        image: '/images/tech_quiz.png',
        rules: [
            'Individual participation',
            'Multiple choice and rapid-fire rounds',
            'No external help or devices',
            'Tie-breaker rounds if needed',
            'Judges decision is final'
        ],
        timeline: [
            { time: '4:00 PM', activity: 'Prelims - Written Round' },
            { time: '4:30 PM', activity: 'Semifinals - Buzzer Round' },
            { time: '5:00 PM', activity: 'Finals - Rapid Fire' },
            { time: '5:30 PM', activity: 'Prize Distribution' }
        ]
    },
    {
        id: 'offline-treasure',
        title: 'Offline Treasure',
        category: 'fun',
        description: 'A fun, logic-based treasure hunt involving clues, puzzles, and teamwork across the campus.',
        longDescription: 'Get ready for an adrenaline-pumping treasure hunt across the campus! Solve cryptic clues, decode puzzles, find hidden checkpoints, and race against time. Physical fitness and mental agility both required!',
        date: 'Day 1',
        time: '11:00 AM - 1:00 PM',
        venue: 'Campus Wide',
        prize: '₹10,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 100,
        registrationDeadline: 'February 10, 2026',
        image: '/images/offline_treasure.png',
        rules: [
            'Individual participation',
            'Follow all clues in order',
            'No damaging campus property',
            'GPS and maps allowed on phone',
            'First to complete all checkpoints wins'
        ],
        timeline: [
            { time: '11:00 AM', activity: 'Briefing & First Clue' },
            { time: '11:15 AM', activity: 'Hunt Begins' },
            { time: '12:45 PM', activity: 'Final Checkpoint' },
            { time: '1:00 PM', activity: 'Results' }
        ]
    },
    {
        id: 'ai-debate',
        title: 'AI Debate',
        category: 'debate',
        description: 'A thought-provoking debate where participants discuss and defend views on AI, ethics, and future tech.',
        longDescription: 'Should AI have rights? Will automation take all jobs? Join the intellectual battlefield and debate the most pressing questions about artificial intelligence, ethics, and the future of technology. Persuade the judges with logic and eloquence!',
        date: 'Day 1',
        time: '3:00 PM - 5:00 PM',
        venue: 'Debate Hall',
        prize: '₹10,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 50,
        registrationDeadline: 'February 10, 2026',
        image: '/images/ai_debate.png',
        rules: [
            'Individual participation',
            'Topics revealed on spot',
            'Prep time: 10 minutes',
            'Speaking time: 5 minutes per side',
            'Judged on content, delivery, and rebuttal'
        ],
        timeline: [
            { time: '3:00 PM', activity: 'Topic Reveal & Prep' },
            { time: '3:15 PM', activity: 'Preliminary Rounds' },
            { time: '4:00 PM', activity: 'Semifinals' },
            { time: '4:30 PM', activity: 'Finals' },
            { time: '5:00 PM', activity: 'Results' }
        ]
    },
    {
        id: 'reverse-it',
        title: 'Reverse IT',
        category: 'coding',
        description: 'Debug, analyze, or reverse-engineer given outputs to understand the logic behind the code.',
        longDescription: 'Think like a detective! You\'ll be given program outputs and must figure out what code produced them. Reverse engineering, pattern recognition, and deep logical thinking are key to winning this unique challenge.',
        date: 'Day 2',
        time: '10:00 AM - 12:00 PM',
        venue: 'Computer Lab B',
        prize: '₹15,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 100,
        registrationDeadline: 'February 10, 2026',
        image: '/images/reverse_it.png',
        rules: [
            'Individual participation',
            'Analyze outputs, write matching code',
            'Multiple levels of difficulty',
            'Partial marks for close solutions',
            'Time is a scoring factor'
        ],
        timeline: [
            { time: '10:00 AM', activity: 'Rules Explanation' },
            { time: '10:15 AM', activity: 'Level 1: Easy' },
            { time: '10:45 AM', activity: 'Level 2: Medium' },
            { time: '11:15 AM', activity: 'Level 3: Hard' },
            { time: '12:00 PM', activity: 'Scoring & Results' }
        ]
    },
    {
        id: 'project-expo',
        title: 'Project Expo',
        category: 'showcase',
        description: 'Showcase your innovative projects and ideas to judges and fellow students.',
        longDescription: 'Got a cool project? Present it to the world! Whether it\'s a web app, AI model, IoT device, or any tech innovation - set up your booth, demonstrate your project, and impress the judges. Networking opportunity with industry professionals included!',
        date: 'Day 2',
        time: '2:00 PM - 5:00 PM',
        venue: 'Exhibition Hall',
        prize: '₹20,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 150,
        registrationDeadline: 'February 10, 2026',
        image: '/images/project_expo.png',
        rules: [
            'Pre-built projects allowed',
            'Working demo required',
            'Documentation must be provided',
            'Presentation time: 10 minutes',
            'Q&A with judges: 5 minutes'
        ],
        timeline: [
            { time: '2:00 PM', activity: 'Booth Setup' },
            { time: '2:30 PM', activity: 'Judging Begins' },
            { time: '4:00 PM', activity: 'Public Exhibition' },
            { time: '4:45 PM', activity: 'Results Announcement' },
            { time: '5:00 PM', activity: 'Prize Distribution' }
        ]
    },
    {
        id: 'typing-titans',
        title: 'Typing Titans',
        category: 'speed',
        description: 'A speed and accuracy challenge to test your typing skills under time pressure.',
        longDescription: 'How fast can you type? Compete against the clock and other participants in this typing speed championship. Words per minute (WPM) and accuracy both count. The fastest, most accurate typist takes the crown!',
        date: 'Day 2',
        time: '11:00 AM - 12:30 PM',
        venue: 'Computer Lab A',
        prize: '₹5,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 50,
        registrationDeadline: 'February 10, 2026',
        image: '/images/typing_titans.png',
        rules: [
            'Individual participation',
            'Standard QWERTY keyboards',
            'Multiple rounds with elimination',
            'WPM and accuracy both scored',
            'Minimum 95% accuracy required'
        ],
        timeline: [
            { time: '11:00 AM', activity: 'Practice Round' },
            { time: '11:15 AM', activity: 'Preliminary Round' },
            { time: '11:45 AM', activity: 'Semifinals' },
            { time: '12:15 PM', activity: 'Finals' },
            { time: '12:30 PM', activity: 'Results' }
        ]
    },
    {
        id: 'canva-design',
        title: 'Canva',
        category: 'design',
        description: 'Design creative posters or visuals using Canva within a given theme and time limit.',
        longDescription: 'Unleash your creativity using Canva! You\'ll be given a theme and must create a stunning poster or visual design within the time limit. Creativity, aesthetics, message clarity, and tool usage will be judged.',
        date: 'Day 2',
        time: '1:00 PM - 3:00 PM',
        venue: 'Design Studio',
        prize: '₹10,000',
        teamSize: 'Individual',
        teamMinSize: 1,
        teamMaxSize: 1,
        isTeamEvent: false,
        registrationFee: 50,
        registrationDeadline: 'February 10, 2026',
        image: '/images/canva_design.png',
        rules: [
            'Individual participation',
            'Canva Free or Pro allowed',
            'Theme revealed at start',
            'Time limit: 1.5 hours',
            'Original work only, no templates'
        ],
        timeline: [
            { time: '1:00 PM', activity: 'Theme Reveal' },
            { time: '1:15 PM', activity: 'Design Begins' },
            { time: '2:45 PM', activity: 'Submission Deadline' },
            { time: '3:00 PM', activity: 'Judging & Results' }
        ]
    }
]

export const eventCategories = [
    { id: 'all', label: 'All Events', icon: '🎯' },
    { id: 'hackathon', label: 'Hackathon', icon: '🚀' },
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'ai', label: 'AI/ML', icon: '🤖' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'fun', label: 'Fun', icon: '🎮' },
    { id: 'debate', label: 'Debate', icon: '🎤' },
    { id: 'showcase', label: 'Showcase', icon: '🏆' },
    { id: 'speed', label: 'Speed', icon: '⚡' },
    { id: 'design', label: 'Design', icon: '🎨' },
]
