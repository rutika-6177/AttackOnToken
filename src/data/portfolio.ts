// ============================================================
//  CTRL_ALT_CHAOS — Portfolio Data
//  Fictional portfolio for "Vesper Nox"
// ============================================================

import type { Project, Experience, Skill } from '../types';

export const PORTFOLIO_OWNER = {
  name: 'Vesper Nox',
  initials: 'VN',
  role: 'Creative Technologist & Interface Architect',
  tagline: 'I build experiences that nobody asked for and everyone remembers.',
  email: 'vesper@nox.design',
  github: 'github.com/vespernox',
  linkedin: 'linkedin.com/in/vespernox',
  location: 'San Francisco, CA',
  bio: `I've spent the last seven years turning impossible design briefs into 
  (mostly) working software. I specialize in the space between interaction design 
  and frontend engineering — where thoughtful systems meet unreasonable animations 
  and someone has to explain to the client why the button moves.
  
  Previously at Synthwave Labs, Hollow Moon Studio, and briefly, a startup that 
  built a social network for houseplants (acquired, don't ask). I write 
  occasionally about interface philosophy, the ethics of dark patterns, and 
  why every loading spinner is a philosophical statement.`,
  avatar: null, // We'll use initials
};

export const PROJECTS: Project[] = [
  {
    id: 'chromashift',
    title: 'Chromashift',
    description: 'A real-time collaborative color-grading tool for design teams that somehow became a meditation app.',
    tech: ['React', 'WebGL', 'WebSockets', 'Rust'],
    year: 2024,
    status: 'shipped',
    details: `Chromashift started as an internal tool for Hollow Moon Studio's design team 
    — a way to preview color palettes across multiple screens simultaneously. 
    It accidentally became calming. We added ambient audio and it now has 40,000 monthly users 
    who just stare at color gradients. No regrets.
    
    The real engineering challenge was keeping sub-10ms sync latency across 8+ clients 
    while running a full WASM color transformation pipeline. Solution: Rust-compiled 
    LUTs piped through shared ArrayBuffers. Works beautifully. Ships to prod on Fridays. 
    (Joke. We don't deploy on Fridays.)`,
  },
  {
    id: 'papertrail',
    title: 'Papertrail OS',
    description: 'A desktop metaphor for personal knowledge management. Files. Folders. Feelings.',
    tech: ['Electron', 'TypeScript', 'SQLite', 'CSS Grid'],
    year: 2023,
    status: 'shipped',
    details: `I was frustrated with every note-taking app so I built my own. 
    It took 14 months, 3 complete rewrites, and one moment of clarity at 2am 
    where I realized I was building a filesystem with feelings.
    
    Papertrail OS uses a spatial canvas metaphor — notes live in physical "space" 
    you can explore. The killer feature: a "paper shredder" that permanently deletes 
    notes with a satisfying animation and sound. Users love destroying their own thoughts.
    
    Downloaded by 12,000 people. Rated 4.8 stars. One review just says "finally."`,
  },
  {
    id: 'signal-loss',
    title: 'Signal/Loss',
    description: 'An interactive audio-visual web experience about communication, designed for the browser.',
    tech: ['Web Audio API', 'Canvas', 'TypeScript', 'GLSL'],
    year: 2023,
    status: 'shipped',
    details: `Signal/Loss was a commissioned art piece for the Digital Futures exhibition. 
    Visitors interact with a real-time audio visualization that responds to microphone input, 
    transforming speech into light-wave interference patterns.
    
    The piece explores how meaning degrades across transmission — text into speech into signal 
    into light into interpretation. Each visitor's voice permanently alters a shared canvas 
    that evolves over the exhibition's run. By day 30, it looked like anxiety feels.`,
  },
  {
    id: 'warden',
    title: 'Warden',
    description: 'A privacy-first browser extension that visualizes exactly who is tracking you and how.',
    tech: ['Web Extensions API', 'React', 'D3.js', 'TypeScript'],
    year: 2022,
    status: 'shipped',
    details: `Warden intercepts network requests and renders a real-time social graph of 
    all third-party trackers attempting to observe you on any given page. 
    The results are often alarming. A news homepage often shows 47+ unique trackers. 
    
    The UI is designed to be beautiful because information design should respect the reader. 
    The tracker graph uses force-directed layout with domain clustering. 
    100,000 active users. Reviewed by the EFF. Privacy Twitter loves it.`,
  },
  {
    id: 'hollow-design-system',
    title: 'Hollow Design System',
    description: 'An internal design system that escaped into the wild and became a minor cult classic.',
    tech: ['React', 'Storybook', 'CSS Variables', 'TypeScript', 'Rollup'],
    year: 2022,
    status: 'shipped',
    details: `Every studio eventually builds a design system. Ours got a GitHub star from 
    someone at a company we deeply respect, which counts as external validation.
    
    Hollow features 47 components, a motion system built on CSS custom properties, 
    an accessible color system (WCAG AA, always), and documentation that people have 
    described as "weirdly entertaining." We wrote the docs like we'd write a manual 
    for a movie prop.`,
  },
  {
    id: 'sunken-city',
    title: 'Sunken City',
    description: 'A browser-based ambient game where you build a city that slowly sinks beneath the sea.',
    tech: ['Phaser 3', 'TypeScript', 'Tiled', 'Howler.js'],
    year: 2021,
    status: 'shipped',
    details: `Sunken City is a 48-hour game jam project that became a 6-month obsession. 
    The premise: you build an underwater city. The mechanics: everything you build 
    also creates the pressure that eventually destroys it. 
    
    Featured in 3 indie game newsletters. 8,000 plays on itch.io. 
    One person emailed me to say it made them think about urban planning. 
    I'm choosing to take that as a compliment.`,
  },
];

export const EXPERIENCE: Experience[] = [
  {
    role: 'Senior Interface Architect',
    company: 'Synthwave Labs',
    period: '2023 – Present',
    description: [
      'Lead the Design Systems and Frontend Experience team (7 engineers, 3 designers).',
      'Architected the component library powering three enterprise SaaS products.',
      'Reduced first-paint time by 40% through render-pipeline refactoring.',
      'Established an accessibility review process that eliminated WCAG AA violations across all products.',
    ],
  },
  {
    role: 'Lead Creative Developer',
    company: 'Hollow Moon Studio',
    period: '2020 – 2023',
    description: [
      'Built interactive web experiences for clients including two Fortune 500 companies and several arts organizations.',
      'Developed Chromashift and the Hollow Design System.',
      'Mentored 4 junior developers from bootcamp to mid-level in 18 months.',
      'Introduced motion design principles into the engineering culture.',
    ],
  },
  {
    role: 'Frontend Engineer',
    company: 'Verdant (formerly Leafchat)',
    period: '2018 – 2020',
    description: [
      'Early-stage startup building a social network for houseplant enthusiasts.',
      'Sole frontend engineer for the first year. Built the entire web client from scratch.',
      'Survived two pivots, one rebrand, and the Great Pothos Discourse of 2019.',
      'Company acquired. The app still exists. The plants are doing fine.',
    ],
  },
];

export const SKILLS: Skill[] = [
  { name: 'TypeScript', level: 5, category: 'language' },
  { name: 'React', level: 5, category: 'framework' },
  { name: 'CSS / CSS-in-JS', level: 5, category: 'language' },
  { name: 'WebGL / GLSL', level: 4, category: 'language' },
  { name: 'Rust', level: 3, category: 'language' },
  { name: 'Python', level: 3, category: 'language' },
  { name: 'Next.js', level: 5, category: 'framework' },
  { name: 'Vite', level: 5, category: 'tool' },
  { name: 'Motion / Framer', level: 5, category: 'framework' },
  { name: 'D3.js', level: 4, category: 'framework' },
  { name: 'Web Audio API', level: 4, category: 'framework' },
  { name: 'Figma', level: 5, category: 'design' },
  { name: 'Storybook', level: 4, category: 'tool' },
  { name: 'Electron', level: 4, category: 'framework' },
  { name: 'Node.js', level: 4, category: 'tool' },
  { name: 'PostgreSQL', level: 3, category: 'tool' },
  { name: 'Docker', level: 3, category: 'tool' },
  { name: 'Git', level: 5, category: 'tool' },
];

export const EDUCATION = [
  {
    degree: 'B.F.A. Interaction Design',
    school: 'California College of the Arts',
    year: '2018',
    note: 'Thesis: "Hostile Architectures: When UX Becomes the Product"',
  },
  {
    degree: 'Computer Science (incomplete)',
    school: 'UC Berkeley Extension',
    year: '2016 – 2017',
    note: 'Dropped out to join Verdant. Worth it.',
  },
];
