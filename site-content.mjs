export const profile = {
  name: 'Franco Rotta',
  title: 'Software Developer',
  headline: 'Software Developer',
  location: 'Santa Fe, Argentina',
  email: 'franco.rotta@hotmail.com',
  github: 'https://github.com/Franco1441',
  linkedin: 'https://www.linkedin.com/in/franco-rotta',
  contactPage: '/contact',
  languageSummary: 'Spanish (Native), English (B2 - Upper-Intermediate)',
  availability: 'Open to developer roles, freelance builds and automation work.',
};

export const hero = {
  rotatingTitles: [
    'Software Developer',
    'Full Stack Developer',
    'Integrations and Automation',
    'Frontend and Backend',
  ],
  intro:
    'I build web products, operational tools and client-facing experiences with strong ownership from planning to deployment.',
  primaryCta: {
    label: 'View Projects',
    href: '/projects',
  },
  secondaryCta: {
    label: 'Contact Me',
    href: '/contact',
  },
};

export const homeCards = {
  about: {
    title: 'About',
    description: 'Who I am and what I build.',
    href: '/about',
  },
  work: {
    title: 'Work Experience',
    description: 'My journey in development and digital production.',
    href: '/work-experience',
  },
  projects: {
    title: 'Projects',
    description: "Projects I've planned, built and deployed.",
    href: '/projects',
  },
  contact: {
    title: 'Contact',
    description: 'GitHub, projects and direct contact.',
    href: '/contact',
  },
};

export const about = {
  intro: [
    'I am a product-focused Full Stack JavaScript developer based in Santa Fe, Argentina. I build web applications, API integrations, and automated workflows with strong ownership from discovery to deployment.',
    'My main stack is React, Next.js, Node.js, Express, and PostgreSQL/Supabase. I enjoy shipping practical products for real clients, especially when the work involves integrations, operations, and business logic.',
    'Alongside development, I also bring a proven background in high-pressure audiovisual production. That experience strengthened the way I work under deadlines, coordinate people, and deliver polished outputs.',
  ],
  specs: [
    { label: 'Location', value: 'Santa Fe, Argentina' },
    { label: 'Languages', value: 'Spanish (Native), English (B2 - Upper-Intermediate)' },
    { label: 'Focus', value: 'Full Stack development, integrations and automation' },
  ],
  education: [
    'Technical Degree in Computer Science Applied to Multimedia Design and Web Pages - Universidad Nacional del Litoral (2022 - 2025)',
    'CS50: Introduction to Computer Science - Harvard University (online, 2023)',
  ],
  stackGroups: [
    {
      label: 'Core Frontend',
      value: 'React, Next.js, Vite, Tailwind CSS, HTML5, CSS3, JavaScript ES6+',
    },
    {
      label: 'Backend & APIs',
      value: 'Node.js, Express, REST APIs, Server Actions, Webhooks',
    },
    {
      label: 'Data',
      value: 'PostgreSQL, Supabase',
    },
    {
      label: 'Integrations',
      value: 'Mercado Pago API, Twilio WhatsApp API',
    },
    {
      label: 'Deploy & Infra',
      value: 'Railway, Vercel, Netlify, Netlify Functions, Git, GitHub',
    },
    {
      label: 'Automation & AI',
      value: 'Codex, Claude, Make.com (learning), Zapier (learning)',
    },
    {
      label: 'Audiovisual Tools',
      value: 'Premiere Pro, DaVinci Resolve, After Effects, Photoshop, Illustrator',
    },
  ],
};

export const workExperience = [
  {
    title: 'Full Stack Developer - Freelance | Tostadero Wellington',
    period: '2025 - Present',
    bullets: [
      'Built a full-stack Next.js commerce app for take-away orders with Mercado Pago checkout.',
      'Implemented server-side webhook processing to sync payment status into Supabase in real time.',
      'Built an internal operations board to manage and fulfill paid orders.',
      'Handled cart persistence, coupon handling, and discount logic across the buying flow.',
    ],
  },
  {
    title: 'Full Stack Developer - Freelance | SEMO (Medical Clinic)',
    period: '2024 - Present',
    bullets: [
      'Designed and implemented a WhatsApp chatbot for medical appointment management using Twilio, Node.js, and Express.',
      'Built a React/Vite admin panel with role-based access for admin, receptionist, and doctor flows.',
      'Designed a PostgreSQL model for six specialties with availability and appointment-state logic.',
      'Deployed frontend and backend on Railway with a mobile-first product approach.',
    ],
  },
  {
    title: 'Frontend Developer - Freelance | Sancor Seguros',
    period: '2024',
    bullets: [
      'Developed an insurance quoting tool using React, Vite, and Tailwind CSS.',
      'Implemented business logic with Netlify Functions.',
      'Delivered a guided quote flow with real-time validation and PDF/email output.',
    ],
  },
  {
    title: 'Audiovisual Production Lead (Project-Based) | InsertBIC / InsertBeat',
    period: '2025 - Present',
    bullets: [
      'Planned and executed 4K multicam productions in S-Log3, defining technical setup and event coverage.',
      'Led hired camera operators and owned pre-production, technical direction, post-production, and delivery.',
      'Delivered publish-ready edits under tight turnaround requirements, often in under 24 hours.',
      'Produced and edited 10+ events and 50+ audiovisual assets, and switched one live format with ATEM Mini Pro when required.',
    ],
  },
  {
    title: 'Technical & Creative Production Lead | Iglesia Brazos Abiertos',
    period: '2021 - Present',
    bullets: [
      'Handled end-to-end technical operation of live streaming, lighting, audio, and multimedia for live events.',
      'Edited social media video content and coordinated technical coverage.',
      'Continued in a lower-volume support role since 2025 while staying involved in streaming and media production.',
    ],
  },
];

export const contactLinks = [
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: '/email.svg',
  },
  {
    label: 'GitHub',
    href: profile.github,
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    icon: '/linkedin.svg',
  },
];

export const contactIntro = {
  eyebrow: 'Contact',
  title: 'Let\'s build something useful.',
  body:
    'If you have a product role, freelance build, automation need, or collaboration in mind, send me the details here and I will reply by email.',
};

export const projectsPageCta = {
  title: 'Let\'s work together',
  description: 'Open to product roles, freelance builds and automation work.',
  label: 'Start a conversation',
};

export const chatStarters = [
  'Who is Franco?',
  'How much experience does he have?',
  'Which languages does he speak?',
  'What projects has he built?',
  'How can I contact him?',
];

export const projects = [
  {
    id: 'scraaatch',
    title: 'Tostadero Wellington',
    subtitle: 'Commerce flow with Mercado Pago',
    description:
      'Next.js ordering platform with checkout, webhook sync and internal order operations.',
    longDescription:
      'Full-stack ordering system for a local coffee business, covering catalog, cart persistence, Mercado Pago checkout, payment feedback and an internal operations view.',
    thumbnail: '/projects/ic-scraaatch.svg',
    category: 'Full Stack Commerce',
    year: '2025',
    users: 'Production',
    links: {
      github: 'https://github.com/Franco1441/Tostadero-Wellington',
      website: 'https://skill-deploy-92740275le.vercel.app',
    },
    features: [
      'Catalog and cart persistence',
      'Mercado Pago checkout',
      'Payment status handling',
      'Webhook sync into Supabase',
      'Internal order operations',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Mercado Pago', 'Vercel'],
    theme: {
      from: '#d8b555',
      to: '#4c74bf',
      text: '#f8fafc',
      muted: 'rgba(248, 250, 252, 0.82)',
      title: '#ffffff',
      iconSurface: '#244f8f',
      chip: 'rgba(255,255,255,0.14)',
    },
  },
  {
    id: 'anass',
    title: 'Cotizador Santa Fe',
    subtitle: 'Quote simulator with PDF delivery',
    description:
      'Retirement quote simulator with guided flow, PDF export and email delivery.',
    longDescription:
      'Frontend-led insurance quoting tool focused on step-by-step data entry, real-time validation and PDF/email delivery through serverless functions.',
    thumbnail: '/projects/ic-anass.svg',
    category: 'Frontend + Serverless',
    year: '2024',
    users: 'Insurance',
    links: {
      github: 'https://github.com/Franco1441/cotizador-santafe',
      website: 'https://github.com/Franco1441/cotizador-santafe',
    },
    features: [
      'Guided quote flow',
      'Retirement-plan simulation',
      'PDF generation',
      'Email delivery',
      'Real-time validation',
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'jsPDF', 'Netlify'],
    theme: {
      from: '#cf87d5',
      to: '#6c20c6',
      text: '#f8fafc',
      muted: 'rgba(248, 250, 252, 0.84)',
      title: '#ffffff',
      iconSurface: '#c86cbf',
      chip: 'rgba(255,255,255,0.16)',
    },
  },
  {
    id: 'daily-story',
    title: 'Brazos Abiertos Web',
    subtitle: 'Institutional website and media hub',
    description:
      'Responsive institutional site with media modules and clear content hierarchy.',
    longDescription:
      'Institutional website with responsive navigation, ministry pages, embedded maps and media-driven sections for community and event communication.',
    thumbnail: '/projects/ic-daily-story.svg',
    category: 'Institutional Web',
    year: '2025',
    links: {
      github: 'https://github.com/Franco1441/BrazosAbiertos_Web',
      website: 'https://brazos-abiertos-web-one.vercel.app',
    },
    features: [
      'Responsive navigation',
      'Media-rich sections',
      'Multi-page structure',
      'Contact and map integration',
      'Production deployment',
    ],
    technologies: ['HTML5', 'JavaScript', 'Tailwind CSS', 'AOS', 'Vercel'],
    theme: {
      from: '#78ae8a',
      to: '#4b8a67',
      text: '#f8fafc',
      muted: 'rgba(248, 250, 252, 0.82)',
      title: '#ffffff',
      iconSurface: '#0e0f12',
      chip: 'rgba(255,255,255,0.14)',
    },
  },
  {
    id: 'zod-json-schema-builder',
    title: 'Turnero SEMO',
    subtitle: 'Appointment system with WhatsApp flows',
    description:
      'Scheduling platform with WhatsApp automation, role-based access and appointment logic.',
    longDescription:
      'Appointment management system for a medical clinic, combining WhatsApp intake, admin tooling, configurable availability and operational scheduling logic.',
    thumbnail: '/projects/ic-zod-json.svg',
    category: 'Full Stack Healthcare',
    year: '2024 - Present',
    links: {
      github: 'https://github.com/Franco1441/semo-backend',
      website: 'https://github.com/Franco1441/semo-backend',
    },
    features: [
      'WhatsApp appointment intake',
      'Role-based admin panel',
      'Availability and slot control',
      'Appointment-state workflows',
      'Railway deployment',
    ],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Twilio', 'Railway'],
    theme: {
      from: '#6f92da',
      to: '#7eafd9',
      text: '#0b1120',
      muted: 'rgba(11, 17, 32, 0.74)',
      title: '#081224',
      iconSurface: '#c9d7f0',
      chip: 'rgba(11,17,32,0.08)',
    },
  },
  {
    id: 'melany-portfolio',
    title: 'Melany Altare Portfolio',
    subtitle: 'Art-directed portfolio experience',
    description:
      'Creative portfolio with custom transitions, responsive storytelling and polished presentation.',
    longDescription:
      'Client portfolio designed around visual identity, motion and clean storytelling across desktop and mobile.',
    thumbnail: '/projects/IC-Melany.png',
    category: 'Creative Frontend',
    year: '2025',
    links: {
      github: 'https://github.com/Franco1441/melanyaltareportfolio',
      website: 'https://melanyportfolio.netlify.app',
    },
    features: [
      'Custom visual direction',
      'One-page storytelling',
      'Motion and reveal transitions',
      'Responsive layout',
      'Client-ready deployment',
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Netlify'],
    theme: {
      from: '#2c2b31',
      to: '#60646f',
      text: '#f8fafc',
      muted: 'rgba(248, 250, 252, 0.82)',
      title: '#ffffff',
      iconSurface: '#101114',
      chip: 'rgba(255,255,255,0.15)',
    },
  },
];
