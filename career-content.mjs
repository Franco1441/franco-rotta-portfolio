// Only list tools used in real projects. Keep technical projects separate from paid work.
export const career = {
  intro: [
    "I am a web developer based in Santa Fe, Argentina. I build React and Next.js interfaces, REST API integrations and full-stack tools for ordering, quoting and appointment management.",
    "My freelance projects include Tostadero Wellington, Cotizador Santa Fe and SEMO. They involve payment flows, webhooks, PDF delivery, administration panels and PostgreSQL/Supabase data models.",
    "My latest technical project, PokéRadar, combines interactive maps, a Three.js Safari and expedition analytics. I work with AI coding tools to build and iterate, with manual checks and automated tests rather than treating generated output as finished work.",
    "I am available for a full-time or part-time development role, remotely from Argentina. I am especially interested in frontend, integrations and teams where I can learn through feedback and code review.",
  ],
  specs: [
    ["Location", "Santa Fe, Argentina"],
    ["Languages", "Spanish (native), Portuguese (intermediate), English (intermediate; improving spoken communication)"],
    ["Education", "UNL / FICH - Technical Degree in Computer Science Applied to Multimedia Design and Web Pages, completed December 2025"],
  ],
  stack: [
    ["Frontend", "JavaScript, TypeScript, React, Next.js, Tailwind CSS, HTML and CSS"],
    ["Interactive UI and data", "Motion, MapLibre GL JS, Three.js and TanStack Query - used in PokéRadar"],
    ["Backend and integrations", "Node.js, Express, REST APIs, Netlify Functions and webhooks"],
    ["Data and services", "PostgreSQL, Supabase, Mercado Pago and Twilio"],
    ["Testing and delivery", "Vitest, Playwright, Git, GitHub, Vercel, Netlify and Railway"],
    ["Workflow", "AI-assisted implementation, manual iteration, debugging and review of generated code"],
  ],
  experience: [
    {
      title: "Freelance Web Developer | November 2024 - Present",
      bullets: [
        "Tostadero Wellington: Next.js and TypeScript ordering flow with a catalog, persisted cart, discounts and Mercado Pago checkout.",
        "Connected payment webhooks to Supabase and built an internal order-management panel.",
        "Cotizador Santa Fe: guided React quote flow with validation, calculation logic, PDF generation and email delivery through Netlify Functions.",
        "SEMO: WhatsApp appointment flows with Twilio, Node.js and Express; React admin tooling and PostgreSQL availability and appointment-state models.",
        "Worked from feature definition to deployment and iterative client feedback.",
      ],
    },
    {
      title: "PokéRadar | Technical Project, November 2026",
      bullets: [
        "Built a Next.js / TypeScript exploration experience with a MapLibre globe, regional maps and a Three.js 360-degree Safari.",
        "Integrated PokéAPI and Open-Meteo with TanStack Query, loading and error states, cached responses and local progress persistence.",
        "Added expedition analytics and tests with Vitest and Playwright; iterated on mobile layout, keyboard interaction and reduced-motion support.",
        "Developed with AI assistance and documented the implementation choices, manual checks and corrections in the public repository.",
      ],
    },
    {
      title: "Audiovisual Production and Editing | October 2021 - Present",
      bullets: [
        "Project-based work in multicamera production, editing and streaming for community events and media channels, including Brazos Abiertos and InsertBIC / InsertBeat.",
        "Prepared footage, sound, titles, subtitles and final exports, coordinating production tasks and delivery requirements.",
      ],
    },
  ],
};
