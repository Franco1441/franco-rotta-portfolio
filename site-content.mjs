export const profile = {
  name: "Franco Rotta",
  title: "Full Stack Developer",
  heroTitle: "Full Stack Developer | Integrations and Automation",
  location: "Santa Fe, Argentina",
  email: "franco.rotta@hotmail.com",
  github: "https://github.com/Franco1441",
  linkedin: "https://www.linkedin.com/in/franco-rotta",
  contactPage: "/contact",
};

export const hero = {
  primaryWords: [
    "Full Stack",
    "Integrations",
    "Automation",
    "Frontend",
    "Backend",
    "React",
    "Node.js",
    "Product",
    "Systems",
  ],
  secondaryWords: ["Developer", "Developer", "", "", "", "", "", "", ""],
  fallbackPrimary: "Full Stack",
  fallbackSecondary: "Developer",
};

export const homeCards = {
  about: "Profile, stack and how I approach building.",
  work: "Development roles, freelance work and digital production.",
  projects: "Selected products, client builds and production-ready launches.",
  contact: "Email, LinkedIn and project inquiries.",
};

export const projectsPageCta = {
  title: "Let's work together",
  description: "Open to product roles, freelance builds and automation work.",
  label: "Start a conversation",
};

export const contactLinks = [
  {
    name: "Email",
    url: `mailto:${profile.email}`,
    iconUrl: "/email.svg",
    className: "bg-neutral-900 hover:bg-neutral-800",
  },
  {
    name: "GitHub",
    url: profile.github,
    iconUrl: "github",
    className: "dark:bg-gray-200 dark:hover:bg-gray-100",
  },
  {
    name: "LinkedIn",
    url: profile.linkedin,
    iconUrl: "/linkedin.svg",
    className: "bg-sky-600 hover:bg-sky-700",
  },
];

export const projects = [
  {
    id: "scraaatch",
    title: "Tostadero Wellington",
    subtitle: "Commerce flow with Mercado Pago",
    description:
      "Next.js ordering platform with checkout, webhook sync and internal order operations.",
    longDescription:
      "Full-stack ordering system for a local coffee business, covering catalog, cart persistence, Mercado Pago checkout, payment feedback and an internal operations view.",
    thumbnail: "/projects/ic-scraaatch.svg",
    category: "Full Stack Commerce",
    year: "2025",
    users: "Production",
    links: {
      github: "https://github.com/Franco1441/Tostadero-Wellington",
      website: "https://skill-deploy-92740275le.vercel.app",
    },
    features: [
      "Catalog and cart persistence",
      "Mercado Pago checkout",
      "Payment status handling",
      "Webhook sync into Supabase",
      "Internal order operations",
    ],
    technologies: [
      { name: "Next.js", slug: "next.js/nextjs" },
      { name: "TypeScript", slug: "typescript/typescript" },
      { name: "Tailwind", slug: "tailwindcss/tailwindcss" },
      { name: "Supabase", slug: "supabase/supabase" },
      { name: "Mercado Pago", slug: "mercadopago/mercadopago" },
      { name: "Vercel", slug: "vercel/vercel" },
    ],
    styles: { bgColor: "bg-yellow-600", textColor: "text-black" },
  },
  {
    id: "anass",
    title: "Cotizador Santa Fe",
    subtitle: "Quote simulator with PDF delivery",
    description:
      "Retirement quote simulator with guided flow, PDF export and email delivery.",
    longDescription:
      "Frontend-led insurance quoting tool focused on step-by-step data entry, real-time validation and PDF/email delivery through serverless functions.",
    thumbnail: "/projects/ic-anass.svg",
    category: "Frontend + Serverless",
    year: "2024",
    users: "Insurance",
    links: {
      github: "https://github.com/Franco1441/cotizador-santafe",
      website: "https://github.com/Franco1441/cotizador-santafe",
    },
    features: [
      "Guided quote flow",
      "Retirement-plan simulation",
      "PDF generation",
      "Email delivery",
      "Real-time validation",
    ],
    technologies: [
      { name: "React", slug: "react/react" },
      { name: "Vite", slug: "vite/vite" },
      { name: "Tailwind", slug: "tailwindcss/tailwindcss" },
      { name: "Framer Motion", slug: "framer/framer" },
      { name: "jsPDF", slug: "adobeacrobatreader/adobeacrobatreader" },
      { name: "Netlify", slug: "netlify/netlify" },
    ],
    styles: { bgColor: "bg-purple-800", textColor: "text-white" },
  },
  {
    id: "daily-story",
    title: "Brazos Abiertos Web",
    subtitle: "Institutional website and media hub",
    description:
      "Responsive institutional site with media modules and clear content hierarchy.",
    longDescription:
      "Institutional website with responsive navigation, ministry pages, embedded maps and media-driven sections for community and event communication.",
    thumbnail: "/projects/ic-daily-story.svg",
    category: "Institutional Web",
    year: "2025",
    links: {
      github: "https://github.com/Franco1441/BrazosAbiertos_Web",
      website: "https://brazos-abiertos-web-one.vercel.app",
    },
    features: [
      "Responsive navigation",
      "Media-rich sections",
      "Multi-page structure",
      "Contact and map integration",
      "Production deployment",
    ],
    technologies: [
      { name: "HTML5", slug: "html5/html5" },
      { name: "JavaScript", slug: "javascript/javascript" },
      { name: "Tailwind CSS", slug: "tailwindcss/tailwindcss" },
      { name: "AOS", slug: "greensock/greensock" },
      { name: "Vercel", slug: "vercel/vercel" },
    ],
    styles: { bgColor: "bg-green-800", textColor: "text-white" },
  },
  {
    id: "zod-json-schema-builder",
    title: "Turnero SEMO",
    subtitle: "Appointment system with WhatsApp flows",
    description:
      "Scheduling platform with WhatsApp automation, role-based access and appointment logic.",
    longDescription:
      "Appointment management system for a medical clinic, combining WhatsApp intake, admin tooling, configurable availability and operational scheduling logic.",
    thumbnail: "/projects/ic-zod-json.svg",
    category: "Full Stack Healthcare",
    year: "2024-Present",
    links: {
      github: "https://github.com/Franco1441/semo-backend",
      website: "https://github.com/Franco1441/semo-backend",
    },
    features: [
      "WhatsApp appointment intake",
      "Role-based admin panel",
      "Availability and slot control",
      "Appointment-state workflows",
      "Railway deployment",
    ],
    technologies: [
      { name: "React", slug: "react/react" },
      { name: "Node.js", slug: "nodedotjs/nodedotjs" },
      { name: "Express", slug: "express/express" },
      { name: "PostgreSQL", slug: "postgresql/postgresql" },
      { name: "Twilio", slug: "twilio/twilio" },
      { name: "Railway", slug: "railway/railway" },
    ],
    styles: { bgColor: "bg-red-700", textColor: "text-white" },
  },
  {
    id: "melany-portfolio",
    title: "Melany Altare Portfolio",
    subtitle: "Art-directed portfolio experience",
    description:
      "Creative portfolio with custom transitions, responsive storytelling and polished presentation.",
    longDescription:
      "Client portfolio designed around visual identity, motion and clean storytelling across desktop and mobile.",
    thumbnail: "/projects/IC-Melany.png",
    category: "Creative Frontend",
    year: "2025",
    links: {
      github: "https://github.com/Franco1441/melanyaltareportfolio",
      website: "https://melanyportfolio.netlify.app",
    },
    features: [
      "Custom visual direction",
      "One-page storytelling",
      "Motion and reveal transitions",
      "Responsive layout",
      "Client-ready deployment",
    ],
    technologies: [
      { name: "React", slug: "react/react" },
      { name: "Vite", slug: "vite/vite" },
      { name: "Tailwind", slug: "tailwindcss/tailwindcss" },
      { name: "Framer Motion", slug: "framer/framer" },
      { name: "Netlify", slug: "netlify/netlify" },
    ],
    styles: { bgColor: "bg-blue-800", textColor: "text-white" },
  },
];
