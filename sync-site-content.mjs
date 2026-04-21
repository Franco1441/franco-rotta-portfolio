import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  contactLinks,
  hero,
  homeCards,
  profile,
  projects,
  projectsPageCta,
} from "./site-content.mjs";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const distDir = path.join(rootDir, "dist");

const text = async (relativePath) =>
  fs.readFile(path.join(rootDir, relativePath), "utf8");

const write = async (relativePath, contents) =>
  fs.writeFile(path.join(rootDir, relativePath), contents, "utf8");

const quote = (value) => JSON.stringify(value);

const replaceIfPresent = (input, from, to) => {
  if (input.includes(from)) {
    return input.split(from).join(to);
  }

  return input;
};

const replaceVariants = (input, variants, to) =>
  variants.reduce((accumulator, variant) => replaceIfPresent(accumulator, variant, to), input);

const replaceNthOccurrence = (input, search, replacement, occurrence) => {
  let fromIndex = -1;

  for (let index = 0; index < occurrence; index += 1) {
    fromIndex = input.indexOf(search, fromIndex + 1);

    if (fromIndex === -1) {
      return input;
    }
  }

  return (
    input.slice(0, fromIndex) +
    replacement +
    input.slice(fromIndex + search.length)
  );
};

const ensure = (input, test, message) => {
  if (!test(input)) {
    throw new Error(message);
  }

  return input;
};

const serializeProject = (project) => {
  const users = project.users ? `,users:${quote(project.users)}` : "";
  const features = project.features.map(quote).join(",");
  const technologies = project.technologies
    .map(
      (tech) => `{name:${quote(tech.name)},iconUrl:\`\${Ht}${tech.slug}\`}`
    )
    .join(",");

  return `{id:${quote(project.id)},title:${quote(project.title)},subtitle:${quote(
    project.subtitle
  )},description:${quote(project.description)},longDescription:${quote(
    project.longDescription
  )},thumbnail:${quote(project.thumbnail)},category:${quote(
    project.category
  )},year:${quote(project.year)}${users},links:{github:${quote(
    project.links.github
  )},website:${quote(
    project.links.website
  )}},features:[${features}],technologies:[${technologies}],styles:{bgColor:${quote(
    project.styles.bgColor
  )},textColor:${quote(project.styles.textColor)}}}`;
};

const applyHeroToHtml = async () => {
  const htmlFiles = [];

  const walk = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (entry.name.endsWith(".html")) {
        htmlFiles.push(fullPath);
      }
    }
  };

  await walk(distDir);

  for (const filePath of htmlFiles) {
    let input = await fs.readFile(filePath, "utf8");
    input = replaceIfPresent(
      input,
      ">Software<",
      `>${hero.fallbackPrimary}<`
    );
    input = replaceIfPresent(
      input,
      ">Engineer<",
      `>${hero.fallbackSecondary}<`
    );
    await fs.writeFile(filePath, input, "utf8");
  }
};

const applyHeroToMainBundle = async () => {
  const file = "dist/assets/main-BWk4fnlg.js";
  let input = await text(file);

  input = ensure(
    input,
    (value) =>
      value.includes(
        'words:["Software","Frontend","Backend","Full Stack","Problem Solver","Fast Learner","Team Player","Creative","Builder"]'
      ) ||
      value.includes(`words:${JSON.stringify(hero.primaryWords)}`),
    "Could not find the main hero word array in main-BWk4fnlg.js"
  );

  input = replaceIfPresent(
    input,
    'words:["Software","Frontend","Backend","Full Stack","Problem Solver","Fast Learner","Team Player","Creative","Builder"]',
    `words:${JSON.stringify(hero.primaryWords)}`
  );
  input = replaceIfPresent(
    input,
    'words:["Developer","Developer","","","","","","",""]',
    `words:${JSON.stringify(hero.secondaryWords)}`
  );
  input = replaceIfPresent(
    input,
    'children:"Software"',
    `children:${quote(hero.fallbackPrimary)}`
  );
  input = replaceIfPresent(
    input,
    'children:"Engineer"',
    `children:${quote(hero.fallbackSecondary)}`
  );

  await write(file, input);
};

const applyHomeCards = async () => {
  const file = "dist/assets/features-BsmKvl1W.js";
  let input = await text(file);

  input = replaceIfPresent(
    input,
    "Projects I've planned, built and deployed.",
    homeCards.projects
  );
  input = replaceIfPresent(
    input,
    "Who I am and what I build.",
    homeCards.about
  );
  input = replaceIfPresent(
    input,
    "My journey in development and digital production.",
    homeCards.work
  );
  input = replaceIfPresent(
    input,
    "GitHub, projects and direct contact.",
    homeCards.contact
  );

  await write(file, input);
};

const applyHomeHtml = async () => {
  let html = await text("dist/index.html");
  html = replaceIfPresent(
    html,
    "Projects I&#x27;ve planned, built and deployed.",
    homeCards.projects
  );
  html = replaceIfPresent(html, "Who I am and what I build.", homeCards.about);
  html = replaceIfPresent(
    html,
    "My journey in development and digital production.",
    homeCards.work
  );
  html = replaceIfPresent(
    html,
    "GitHub, projects and direct contact.",
    homeCards.contact
  );
  await write("dist/index.html", html);
};

const applyContactLinks = async () => {
  const file = "dist/assets/index-CGlUleov.js";
  let input = await text(file);

  const linksSource = `const links = [
  {
    name: "Email",
    url: ${quote(contactLinks[0].url)},
    iconUrl: ${quote(contactLinks[0].iconUrl)},
    className: ${quote(contactLinks[0].className)},
  },
  {
    name: "GitHub",
    url: ${quote(contactLinks[1].url)},
    iconUrl: \`\${n}github/github\`,
    className: ${quote(contactLinks[1].className)},
  },
  {
    name: "LinkedIn",
    url: ${quote(contactLinks[2].url)},
    iconUrl: ${quote(contactLinks[2].iconUrl)},
    className: ${quote(contactLinks[2].className)},
  },
];`;

  input = input.replace(/const links = \[[\s\S]*?\];/, linksSource);
  await write(file, input);

  const emailSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path d="M4 7h16v10H4z" stroke="#fff" stroke-width="1.75" rx="2"/>
  <path d="m5 8 7 5 7-5" stroke="#fff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

  await write("dist/email.svg", emailSvg);
};

const applyContactForm = async () => {
  const file = "dist/assets/contact-form-Ch5-8k1a.js";
  let input = await text(file);

  input = replaceIfPresent(
    input,
    '"https://api.web3forms.com/submit"',
    '"/api/contact"'
  );

  await write(file, input);
};

const applyProjectDataToMainBundle = async () => {
  const file = "dist/assets/main-BWk4fnlg.js";
  let input = await text(file);
  const projectArraySource = `[${projects.map(serializeProject).join(",")}]`;

  input = ensure(
    input,
    (value) => /Pz=\[[\s\S]*?\],kz=/.test(value),
    "Could not find the project data block in main-BWk4fnlg.js"
  );

  input = input.replace(/Pz=\[[\s\S]*?\],kz=/, `Pz=${projectArraySource},kz=`);

  await write(file, input);
};

const applyProjectsPageBundle = async () => {
  const file = "dist/assets/index-BqIROs03.js";
  let input = await text(file);

  input = replaceIfPresent(input, "New Project", projectsPageCta.title);
  input = replaceIfPresent(
    input,
    "I'm always exploring new ideas.",
    projectsPageCta.description
  );
  input = replaceIfPresent(input, "Let's connect", projectsPageCta.label);

  await write(file, input);
};

const applyProjectsHtml = async () => {
  const replacements = [
    [
      "Online ordering flow with checkout, payment status pages and internal order management.",
      projects[0].description,
    ],
    [
      "Simulate retirement plans, generate PDF quotes and send results by email.",
      projects[1].description,
    ],
    [
      "Institutional site with responsive sections, media content and clear information architecture.",
      projects[2].description,
    ],
    [
      "Scheduling platform for managing appointments, time slots and patient flow.",
      projects[3].description,
    ],
    [
      "One-page portfolio with custom visual identity, transitions and responsive presentation.",
      projects[4].description,
    ],
    ["New Project", projectsPageCta.title],
    ["I&#x27;m always exploring new ideas.", projectsPageCta.description],
    ["Let's connect", projectsPageCta.label],
    ["Let&#x27;s connect", projectsPageCta.label],
  ];

  let listHtml = await text("dist/projects/index.html");
  for (const [from, to] of replacements) {
    listHtml = replaceIfPresent(listHtml, from, to);
  }
  await write("dist/projects/index.html", listHtml);

  const detailPages = [
    {
      path: "dist/projects/scraaatch/index.html",
      current: {
        subtitle: "Take-away ordering with Mercado Pago",
        description:
          "Online ordering flow with checkout, payment status pages and internal order management.",
        longDescription:
          "Full-stack ordering application for a coffee shop, including product catalog, cart, Mercado Pago checkout, payment webhooks and an internal dashboard for local operations.",
        category: "Full Stack",
        year: "2026",
        users: "live",
        features: [
          "Product catalog and cart",
          "Payment status pages",
          "Webhook synchronization",
          "Internal order dashboard",
          "Shadcn UI",
        ],
        tech: ["Shadcn UI"],
      },
      next: projects[0],
    },
    {
      path: "dist/projects/anass/index.html",
      current: {
        subtitle: "Financial simulation and PDF quoting",
        description:
          "Simulate retirement plans, generate PDF quotes and send results by email.",
        longDescription:
          "Web application for financial simulation with custom scenarios, instant PDF generation and automated email delivery through serverless functions.",
        category: "Fintech Tool",
        year: "2025",
        users: "b2b",
        features: [
          "Financial projection engine",
          "PDF quote generation",
          "Email sending workflow",
          "Route variants for advisors",
          "Animated, guided UX",
        ],
        tech: [],
      },
      next: projects[1],
    },
    {
      path: "dist/projects/daily-story/index.html",
      current: {
        subtitle: "Institutional multi-page website",
        description:
          "Institutional site with responsive sections, media content and clear information architecture.",
        longDescription:
          "Institutional website build with responsive navigation, multimedia sections, embedded maps and dedicated pages for ministry and community content.",
        category: "Web Platform",
        year: "2025",
        users: null,
        features: [
          "Responsive navigation",
          "Video hero and media sections",
          "Multi-page content structure",
          "Embedded maps and contact sections",
          "Production deployment",
        ],
        tech: [],
      },
      next: projects[2],
    },
    {
      path: "dist/projects/zod-json-schema-builder/index.html",
      current: {
        subtitle: "Medical appointment system (MERN)",
        description:
          "Scheduling platform for managing appointments, time slots and patient flow.",
        longDescription:
          "Appointment management system with role-based flows, configurable availability, and backend services for booking, status tracking and operational control.",
        category: "Full Stack",
        year: "2026",
        users: null,
        features: [
          "Appointment scheduling",
          "Availability and slot control",
          "Role-based access",
          "Booking status workflows",
          "Operational dashboard-ready API",
        ],
        tech: ["MongoDB", "JWT", "Vercel"],
      },
      next: projects[3],
    },
    {
      path: "dist/projects/melany-portfolio/index.html",
      current: {
        subtitle: "Creative visual portfolio",
        description:
          "One-page portfolio with custom visual identity, transitions and responsive presentation.",
        longDescription:
          "Client portfolio focused on branding, smooth interactions and strong visual presentation across desktop and mobile.",
        category: "Creative Web",
        year: "2025",
        users: null,
        features: [
          "Custom visual direction",
          "One-page storytelling",
          "Responsive layout",
          "Interaction and reveal effects",
          "Client-ready deployment",
        ],
        tech: [],
      },
      next: projects[4],
    },
  ];

  for (const detail of detailPages) {
    let html = await text(detail.path);
    html = replaceIfPresent(html, detail.current.subtitle, detail.next.subtitle);
    html = replaceIfPresent(html, detail.current.description, detail.next.description);
    html = replaceIfPresent(
      html,
      detail.current.longDescription,
      detail.next.longDescription
    );
    html = replaceIfPresent(html, detail.current.category, detail.next.category);
    html = replaceIfPresent(html, detail.current.year, detail.next.year);

    if (detail.current.users && detail.next.users) {
      html = replaceIfPresent(html, detail.current.users, detail.next.users);
    }

    for (let index = 0; index < detail.current.features.length; index += 1) {
      html = replaceIfPresent(
        html,
        detail.current.features[index],
        detail.next.features[index]
      );
    }

    if (detail.path.endsWith("scraaatch/index.html")) {
      html = replaceIfPresent(html, "Shadcn UI", "Supabase");
    }

    if (detail.path.endsWith("zod-json-schema-builder/index.html")) {
      html = replaceIfPresent(html, "MongoDB", "PostgreSQL");
      html = replaceIfPresent(html, "JWT", "Twilio");
      html = replaceIfPresent(html, "Vercel", "Railway");
    }

    if (detail.path.endsWith("melany-portfolio/index.html")) {
      html = replaceNthOccurrence(
        html,
        "Motion and reveal transitions",
        "Responsive layout",
        2
      );
      html = replaceNthOccurrence(
        html,
        "Motion and reveal transitions",
        "Responsive layout",
        3
      );
    }

    await write(detail.path, html);
  }
};

export async function applyMirrorCustomizations() {
  await applyHeroToHtml();
  await applyHeroToMainBundle();
  await applyHomeCards();
  await applyHomeHtml();
  await applyContactLinks();
  await applyContactForm();
  await applyProjectDataToMainBundle();
  await applyProjectsPageBundle();
  await applyProjectsHtml();
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  applyMirrorCustomizations().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
