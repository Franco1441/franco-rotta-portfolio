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

const copy = async (fromRelativePath, toRelativePath) => {
  const targetPath = path.join(rootDir, toRelativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.copyFile(
    path.join(rootDir, fromRelativePath),
    targetPath
  );
};

const exists = async (relativePath) => {
  try {
    await fs.access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
};

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

const makeHeaderNameSpans = (name) =>
  [...name]
    .map(
      (character) =>
        `<span class="inline-block whitespace-pre" style="opacity:0;filter:blur(10px);transform:translateY(20px)">${character}</span>`
    )
    .join("");

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
  )},textColor:${quote(project.styles.textColor)},background:${quote(
    project.styles.background || ""
  )}}}`;
};

const HOME_MARQUEE_STYLE_JS =
  'style:{width:"92px",height:"92px",marginTop:"0px",marginBottom:"0px"}';
const HOME_MARQUEE_STYLE_HTML =
  'class="block object-contain rounded-[1.6rem]" style="width:92px;height:92px;margin-top:0px;margin-bottom:0px"';

const HOME_ABOUT_CONTAINER_JS =
  'className:"relative",style:{width:"240px",height:"160px",marginRight:"-38px",marginBottom:"-92px"}';
const HOME_WORK_CONTAINER_JS =
  'className:"relative",style:{width:"240px",height:"160px",marginRight:"-38px",marginTop:"-72px"}';

const HOME_ABOUT_CONTAINER_HTML =
  '<div class="relative" style="width:240px;height:160px;margin-right:-38px;margin-bottom:-92px">';
const HOME_WORK_CONTAINER_HTML =
  '<div class="relative" style="width:240px;height:160px;margin-right:-38px;margin-top:-72px">';

// Eye tuning: edit ONLY these 4 numbers.
const HOME_ABOUT_EYE_COORDS = {
  left: { x: 146, y: 7 },
  right: { x: 175, y: 24 },
};

const HOME_ABOUT_EYES_JS = `eyePositions:[{x:${HOME_ABOUT_EYE_COORDS.left.x},y:${HOME_ABOUT_EYE_COORDS.left.y}},{x:${HOME_ABOUT_EYE_COORDS.right.x},y:${HOME_ABOUT_EYE_COORDS.right.y}}]`;
const HOME_ABOUT_EYES_HTML = [
  `style="left:${HOME_ABOUT_EYE_COORDS.left.x}px;top:${HOME_ABOUT_EYE_COORDS.left.y}px;transform:translate(-50%, -50%)"`,
  `style="left:${HOME_ABOUT_EYE_COORDS.right.x}px;top:${HOME_ABOUT_EYE_COORDS.right.y}px;transform:translate(-50%, -50%)"`,
];

const HOME_ABOUT_IMAGE_JS =
  'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 44% 0)"}';
const HOME_WORK_IMAGE_JS =
  'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(48% 0 0 0)"}';

const HOME_ABOUT_IMAGE_HTML =
  '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(0 0 44% 0)"/>';
const HOME_WORK_IMAGE_HTML =
  '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(48% 0 0 0)"/>';

const HOME_WORK_DUPLICATE_STYLE =
  'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"},style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(55% 0 0 0)"}})';

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

const applyGlobalBranding = async () => {
  const files = [];

  const walk = async (directory) => {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (entry.name.endsWith(".html") || entry.name.endsWith(".js")) {
        files.push(fullPath);
      }
    }
  };

  await walk(distDir);

  const replacements = [
    ["Franck Poingt", profile.name],
    ["Franck&#x27;s Portfolio", `${profile.name} Portfolio`],
    ["Franck's Portfolio", `${profile.name} Portfolio`],
    ["Ask FranckGPT", "Ask FrancoGPT"],
    ["Who is Franck?", "Who is Franco?"],
  ];

  for (const filePath of files) {
    let input = await fs.readFile(filePath, "utf8");
    const original = input;

    for (const [from, to] of replacements) {
      input = replaceIfPresent(input, from, to);
    }

    if (input !== original) {
      await fs.writeFile(filePath, input, "utf8");
    }
  }
};

const applyHeaderNameToHtml = async () => {
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

  const header = `<h1 class="whitespace-pre-wrap text-3xl md:text-5xl lg:text-6xl font-medium font-serif" style="opacity:1">${makeHeaderNameSpans(
    profile.name
  )}</h1>`;

  for (const filePath of htmlFiles) {
    let input = await fs.readFile(filePath, "utf8");
    input = input.replace(
      /<h1 class="whitespace-pre-wrap text-3xl md:text-5xl lg:text-6xl font-medium font-serif" style="opacity:1">[\s\S]*?<\/h1>/g,
      header
    );
    await fs.writeFile(filePath, input, "utf8");
  }
};

const applyFaviconLinks = async () => {
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
    input = input.replace(
      /<link rel="icon" href="[^"]*"\s*\/?>/g,
      '<link rel="icon" href="/favicon.png"/>'
    );
    await fs.writeFile(filePath, input, "utf8");
  }
};

const applyHeroToMainBundle = async () => {
  const file = "dist/assets/main-BWk4fnlg.js";
  let input = await text(file);
  const primaryVariants = [
    'words:["Software","Frontend","Backend","Full Stack","Problem Solver","Fast Learner","Team Player","Creative","Builder"]',
    'words:["Software","Product","Founder","Creative","Problem Solver","French","Fluent in English","Full Stack","Self-taught"]',
  ];
  const secondaryVariants = [
    'words:["Developer","Developer","","","","","","",""]',
    'words:["Engineer","Engineer","","","","","","",""]',
  ];

  input = ensure(
    input,
    (value) =>
      primaryVariants.some((variant) => value.includes(variant)) ||
      value.includes(`words:${JSON.stringify(hero.primaryWords)}`),
    "Could not find the main hero word array in main-BWk4fnlg.js"
  );

  input = replaceVariants(
    input,
    primaryVariants,
    `words:${JSON.stringify(hero.primaryWords)}`
  );
  input = replaceVariants(
    input,
    secondaryVariants,
    `words:${JSON.stringify(hero.secondaryWords)}`
  );
  input = replaceVariants(input, ['children:"Software"'], `children:${quote(hero.fallbackPrimary)}`);
  input = replaceVariants(
    input,
    ['children:"Engineer"', 'children:"Developer"'],
    `children:${quote(hero.fallbackSecondary)}`
  );

  await write(file, input);
};

const applyHomeCards = async () => {
  const file = "dist/assets/features-BsmKvl1W.js";
  let input = await text(file);

  input = replaceVariants(
    input,
    [
      "Projects I've planned, built and deployed.",
      "Personal projects I've been working on.",
    ],
    homeCards.projects
  );
  input = replaceVariants(
    input,
    ["Who I am and what I build.", "A bit about myself."],
    homeCards.about
  );
  input = replaceVariants(
    input,
    [
      "My journey in development and digital production.",
      "My career as a Software Engineer.",
    ],
    homeCards.work
  );
  input = replaceVariants(
    input,
    [
      "GitHub, projects and direct contact.",
      "Email, LinkedIn, carrier pigeon...",
    ],
    homeCards.contact
  );
  input = replaceIfPresent(
    input,
    'S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"size-28 md:size-30 block -my-2"})}),',
    `S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"block object-contain rounded-[1.6rem]",${HOME_MARQUEE_STYLE_JS}})}),`
  );
  input = replaceIfPresent(
    input,
    'S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"block object-contain rounded-[1.6rem]",style:t.id==="melany-portfolio"?{width:"88px",height:"126px",marginTop:"-6px",marginBottom:"-6px"}:{width:"112px",height:"112px",marginTop:"-8px",marginBottom:"-8px"}})}),',
    `S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"block object-contain rounded-[1.6rem]",${HOME_MARQUEE_STYLE_JS}})}),`
  );
  input = replaceIfPresent(
    input,
    'S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"block object-contain rounded-[1.6rem]",style:{width:"98px",height:"98px",marginTop:"-4px",marginBottom:"-4px"}})}),',
    `S=({project:t,className:n})=>e.jsx("div",{className:b("self-start flex-shrink-0",n),children:e.jsx(v.img,{src:t.thumbnail,alt:t.title,className:"block object-contain rounded-[1.6rem]",${HOME_MARQUEE_STYLE_JS}})}),`
  );
  input = replaceIfPresent(
    input,
    'className:"absolute inset-0 -bottom-6 flex items-end justify-end overflow-hidden pb-4"',
    'className:"absolute inset-0 flex items-end justify-end overflow-hidden"'
  );
  input = replaceVariants(
    input,
    [
      'className:"relative w-48 h-28"',
      'className:"relative",style:{width:"240px",height:"160px",marginRight:"-22px",marginBottom:"-6px"}',
      HOME_ABOUT_CONTAINER_JS,
      'className:"relative",style:{width:"380px",height:"255px",marginRight:"-110px",marginBottom:"-70px"}',
      'className:"relative w-60 h-36 -mr-2 -mb-2"',
      'className:"relative w-56 h-34 -mr-3 -mb-1"',
      'className:"relative w-56 h-36 -mr-3 -mb-1"',
    ],
    HOME_ABOUT_CONTAINER_JS
  );
  input = input.replace(
    /className:"relative",style:\{width:"240px",height:"160px",marginRight:"-?\d+px",marginBottom:"-?\d+px"\}/g,
    HOME_ABOUT_CONTAINER_JS
  );
  input = replaceVariants(
    input,
    [
      'className:"absolute top-0 w-full h-auto object-contain"',
      'className:"absolute top-0 right-0 w-full h-auto object-contain"',
      'className:"absolute bottom-0 right-0 w-full h-auto object-contain"',
      'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"}',
      'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 48% 0)"}',
    ],
    HOME_ABOUT_IMAGE_JS
  );
  input = replaceIfPresent(input, 'src:"/finalincon.png"', 'src:"/bitmoji.webp"');
  input = replaceIfPresent(
    input,
    'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"},style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"}})',
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_ABOUT_IMAGE_JS}})`
  );
  input = replaceIfPresent(
    input,
    'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 48% 0)"},style:{clipPath:"inset(0 0 42% 0)"}})',
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_ABOUT_IMAGE_JS}})`
  );
  input = replaceIfPresent(
    input,
    'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"},style:{clipPath:"inset(0 0 42% 0)"}})',
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_ABOUT_IMAGE_JS}})`
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:150,y:60},{x:180,y:67}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:117,y:70},{x:140,y:83}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:110,y:24},{x:132,y:27}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:106,y:40},{x:129,y:45}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:114,y:33},{x:138,y:41}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:142,y:24},{x:180,y:34}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:142,y:42},{x:172,y:51}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:166,y:39},{x:176,y:27}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:153,y:27},{x:185,y:31}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:152,y:12},{x:186,y:16}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:146,y:19},{x:176,y:27}]',
    HOME_ABOUT_EYES_JS
  );
  input = replaceIfPresent(
    input,
    'eyePositions:[{x:236,y:96},{x:286,y:107}]',
    HOME_ABOUT_EYES_JS
  );
  // Robust fallback: always replace the first eyePositions pair found in the bundle.
  // This avoids getting stuck when the current build contains unknown coordinates.
  let homeEyePositionsReplaced = false;
  input = input.replace(
    /eyePositions:\[\{x:-?\d+,y:-?\d+\},\{x:-?\d+,y:-?\d+\}\]/g,
    (match) => {
      if (homeEyePositionsReplaced) {
        return match;
      }
      homeEyePositionsReplaced = true;
      return HOME_ABOUT_EYES_JS;
    }
  );
  input = replaceIfPresent(
    input,
    ",g=1.25,w=Math.cos(p)*g,j=Math.sin(p)*g;",
    ",g=3,w=Math.cos(p)*g,j=Math.sin(p)*g;"
  );
  input = replaceIfPresent(
    input,
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(.99)`',
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(1.04)`'
  );
  input = replaceIfPresent(
    input,
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(.94)`',
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(1.04)`'
  );
  input = replaceIfPresent(
    input,
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(.88)`',
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(1.04)`'
  );
  input = replaceIfPresent(
    input,
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(.42)`',
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(1.04)`'
  );
  input = replaceIfPresent(
    input,
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px))`',
    'transform:`translate(calc(-50% + ${s}px), calc(-50% + ${d}px)) scale(1.04)`'
  );
  input = replaceIfPresent(
    input,
    'className:"relative w-48 h-24"',
    HOME_WORK_CONTAINER_JS
  );
  input = replaceIfPresent(
    input,
    'className:"relative",style:{width:"240px",height:"160px",marginRight:"-22px",marginTop:"-10px"}',
    HOME_WORK_CONTAINER_JS
  );
  input = replaceIfPresent(
    input,
    'className:"relative",style:{width:"380px",height:"255px",marginRight:"-110px",marginTop:"-34px"}',
    HOME_WORK_CONTAINER_JS
  );
  input = input.replace(
    /className:"relative",style:\{width:"240px",height:"160px",marginRight:"-?\d+px",marginTop:"-?\d+px"\}/g,
    HOME_WORK_CONTAINER_JS
  );

  input = replaceIfPresent(
    input,
    HOME_WORK_DUPLICATE_STYLE,
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_WORK_IMAGE_JS}})`
  );
  input = replaceIfPresent(
    input,
    'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute bottom-4 w-full h-auto object-contain rounded-bl-lg",style:{clipPath:"inset(55% 0 0 0)"}})',
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_WORK_IMAGE_JS}})`
  );
  input = replaceIfPresent(
    input,
    'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(55% 0 0 0)"}',
    HOME_WORK_IMAGE_JS
  );
  input = replaceIfPresent(
    input,
    'className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(52% 0 0 0)"}',
    HOME_WORK_IMAGE_JS
  );
  input = replaceIfPresent(
    input,
    'className:"absolute bottom-4 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"',
    'className:"absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"'
  );
  input = replaceIfPresent(
    input,
    'className:"absolute bottom-4 top-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"',
    'className:"absolute bottom-0 top-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"'
  );
  input = replaceIfPresent(
    input,
    'e.jsx("img",{src:"/bitmoji.webp",alt:"",className:"absolute object-contain",style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(0 0 42% 0)"},style:{right:"0",bottom:"0",width:"100%",height:"auto",clipPath:"inset(55% 0 0 0)"}})',
    `e.jsx("img",{src:"/bitmoji.webp",alt:"",${HOME_WORK_IMAGE_JS}})`
  );

  await write(file, input);
};

const applyHomeHtml = async () => {
  let html = await text("dist/index.html");
  html = replaceVariants(
    html,
    [
      "Projects I&#x27;ve planned, built and deployed.",
      "Personal projects I&#x27;ve been working on.",
      "Personal projects I've been working on.",
    ],
    homeCards.projects
  );
  html = replaceVariants(
    html,
    ["Who I am and what I build.", "A bit about myself."],
    homeCards.about
  );
  html = replaceVariants(
    html,
    [
      "My journey in development and digital production.",
      "My career as a Software Engineer.",
    ],
    homeCards.work
  );
  html = replaceVariants(
    html,
    [
      "GitHub, projects and direct contact.",
      "Email, LinkedIn, carrier pigeon...",
    ],
    homeCards.contact
  );
  html = replaceIfPresent(
    html,
    'class="size-28 md:size-30 block -my-2"',
    HOME_MARQUEE_STYLE_HTML
  );
  html = replaceIfPresent(
    html,
    'class="block object-contain rounded-[1.6rem]" style="width:112px;height:112px;margin-top:-8px;margin-bottom:-8px"',
    HOME_MARQUEE_STYLE_HTML
  );
  html = replaceIfPresent(
    html,
    'class="block object-contain rounded-[1.6rem]" style="width:98px;height:98px;margin-top:-4px;margin-bottom:-4px"',
    HOME_MARQUEE_STYLE_HTML
  );
  html = replaceIfPresent(
    html,
    'class="absolute inset-0 -bottom-6 flex items-end justify-end overflow-hidden pb-4"',
    'class="absolute inset-0 flex items-end justify-end overflow-hidden"'
  );
  html = replaceIfPresent(
    html,
    '<div class="relative w-48 h-28">',
    HOME_ABOUT_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<div class="relative" style="width:380px;height:255px;margin-right:-110px;margin-bottom:-70px">',
    HOME_ABOUT_CONTAINER_HTML
  );
  html = html.replace(
    /<div class="relative" style="width:240px;height:160px;margin-right:-?\d+px;margin-bottom:-?\d+px">/g,
    HOME_ABOUT_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<div class="relative" style="width:240px;height:160px;margin-right:-22px;margin-bottom:-6px">',
    HOME_ABOUT_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/finalincon.png" alt="" class="absolute top-0 w-full h-auto object-contain" style="clip-path:inset(0 0 42% 0)"/>',
    HOME_ABOUT_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(0 0 42% 0)" style="clip-path:inset(0 0 42% 0)"/>',
    HOME_ABOUT_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(0 0 42% 0)"/>',
    HOME_ABOUT_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(0 0 48% 0)"/>',
    HOME_ABOUT_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    'style="left:117px;top:70px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:140px;top:83px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:236px;top:96px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:286px;top:107px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:150px;top:60px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:180px;top:67px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:142px;top:24px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:180px;top:34px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:166px;top:39px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:176px;top:27px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:153px;top:27px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:185px;top:31px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:152px;top:12px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  html = replaceIfPresent(
    html,
    'style="left:186px;top:16px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[1]
  );
  html = replaceIfPresent(
    html,
    'style="left:146px;top:19px;transform:translate(-50%, -50%)"',
    HOME_ABOUT_EYES_HTML[0]
  );
  // Robust fallback: replace the first two eye inline styles regardless of previous values.
  let replacedEyeStyleCount = 0;
  html = html.replace(
    /style="left:-?\d+px;top:-?\d+px;transform:translate\(-50%, -50%\)"/g,
    (match) => {
      if (replacedEyeStyleCount === 0) {
        replacedEyeStyleCount += 1;
        return HOME_ABOUT_EYES_HTML[0];
      }
      if (replacedEyeStyleCount === 1) {
        replacedEyeStyleCount += 1;
        return HOME_ABOUT_EYES_HTML[1];
      }
      return match;
    }
  );
  html = replaceIfPresent(
    html,
    '<div class="relative w-48 h-24">',
    HOME_WORK_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<div class="relative" style="width:380px;height:255px;margin-right:-110px;margin-top:-34px">',
    HOME_WORK_CONTAINER_HTML
  );
  html = html.replace(
    /<div class="relative" style="width:240px;height:160px;margin-right:-?\d+px;margin-top:-?\d+px">/g,
    HOME_WORK_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<div class="relative" style="width:240px;height:160px;margin-right:-22px;margin-top:-10px">',
    HOME_WORK_CONTAINER_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/finalincon.png" alt="" class="absolute bottom-4 w-full h-auto object-contain rounded-bl-lg" style="clip-path:inset(55% 0 0 0)"/>',
    HOME_WORK_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute bottom-4 w-full h-auto object-contain rounded-bl-lg" style="clip-path:inset(55% 0 0 0)"/>',
    HOME_WORK_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(55% 0 0 0)"/>',
    HOME_WORK_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    '<img src="/bitmoji.webp" alt="" class="absolute object-contain" style="right:0;bottom:0;width:100%;height:auto;clip-path:inset(52% 0 0 0)"/>',
    HOME_WORK_IMAGE_HTML
  );
  html = replaceIfPresent(
    html,
    'class="absolute bottom-4 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"',
    'class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"'
  );
  html = replaceIfPresent(
    html,
    'class="absolute bottom-4 top-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"',
    'class="absolute bottom-0 top-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none"'
  );
  await write("dist/index.html", html);
};

const applyContactLinks = async () => {
  const file = "dist/assets/index-CGlUleov.js";
  let input = await text(file);

  const compactSource =
    `const o=[{name:"Email",url:${quote(contactLinks[0].url)},iconUrl:${quote(
      contactLinks[0].iconUrl
    )},className:${quote(contactLinks[0].className)}},{name:"GitHub",url:${quote(
      contactLinks[1].url
    )},iconUrl:${quote(contactLinks[1].iconUrl)},className:${quote(
      contactLinks[1].className
    )}},{name:"LinkedIn",url:${quote(contactLinks[2].url)},iconUrl:${quote(
      contactLinks[2].iconUrl
    )},className:${quote(contactLinks[2].className)}}],c=({link:s})=>`;

  const expandedSource = `const links = [
  {
    name: "Email",
    url: ${quote(contactLinks[0].url)},
    iconUrl: ${quote(contactLinks[0].iconUrl)},
    className: ${quote(contactLinks[0].className)},
  },
  {
    name: "GitHub",
    url: ${quote(contactLinks[1].url)},
    iconUrl: ${quote(contactLinks[1].iconUrl)},
    className: ${quote(contactLinks[1].className)},
  },
  {
    name: "LinkedIn",
    url: ${quote(contactLinks[2].url)},
    iconUrl: ${quote(contactLinks[2].iconUrl)},
    className: ${quote(contactLinks[2].className)},
  },
];`;

  input = input.replace(
    /const o=\[[\s\S]*?\],c=\(\{link:s\}\)=>/,
    compactSource
  );
  input = input.replace(/const links = \[[\s\S]*?\];/, expandedSource);

  await write(file, input);
};

const applyContactForm = async () => {
  const file = "dist/assets/contact-form-Ch5-8k1a.js";
  let input = await text(file);

  input = replaceIfPresent(
    input,
    '"https://api.web3forms.com/submit"',
    '"/api/contact"'
  );
  input = replaceIfPresent(
    input,
    "Name is required - even the Night King needs one!",
    "Name is required."
  );
  input = replaceIfPresent(
    input,
    "Invalid email address - try a carrier pigeon?",
    "Enter a valid email address."
  );
  input = replaceIfPresent(
    input,
    "Message too short - tell me your tale!",
    "Message should be at least 15 characters."
  );
  input = replaceIfPresent(input, "Get in Touch", "Start a conversation");
  input = replaceIfPresent(input, "Thank You!", "Message sent");
  input = replaceIfPresent(input, "Oops!", "Something went wrong");
  input = replaceIfPresent(
    input,
    "I'll get back to you as soon as possible.",
    "I'll reply as soon as I can."
  );
  input = replaceIfPresent(input, "Jon Snow", "Franco Rotta");
  input = replaceIfPresent(input, "jon.snow@stark.com", "franco.rotta@hotmail.com");
  input = replaceIfPresent(input, "Night's Watch Inc.", "Your company or project");
  input = replaceIfPresent(
    input,
    "Winter is coming...",
    "Tell me a bit about your project, role or idea."
  );

  await write(file, input);
};

const applyAboutContent = async () => {
  const replacements = [
    ["Auckland, New Zealand", profile.location],
    ["English (Fluent), French (Native), TypeScript", "Spanish (Native), English (B2), TypeScript"],
    [
      "I am a Software Engineer based in Auckland, New Zealand with a passion for building ",
      "I am a Full Stack Developer based in Santa Fe, Argentina focused on building ",
    ],
    [
      "I am a Software Engineer based in Santa Fe, Argentina with a passion for building ",
      "I am a Full Stack Developer based in Santa Fe, Argentina focused on building ",
    ],
    [
      "UX-heavy web applications",
      "production-ready web applications, integrations and automation flows",
    ],
    [
      "that drive real business results.",
      "that solve real operational problems.",
    ],
    [
      "My journey into engineering was non-traditional. I started self-teaching during the pandemic and haven't stopped since. That drive led me to build ",
      "My path into development has been hands-on and product-focused. I learned by shipping for real clients and teams, and that led me to build ",
    ],
    ["Scraaatch", "client products across commerce, quoting and scheduling"],
    ["1,200+ active users", "production systems with daily usage"],
    [
      "I don't just write code, I ship products that people use.",
      "I focus on reliable delivery, clean UX and maintainable full-stack implementations.",
    ],
    [
      "When I'm not shipping features or mentoring junior devs, I'm an avid traveller, ex-homebrewer, and football fan.",
      "Alongside software, I also lead audiovisual production and streaming workflows for events and media channels.",
    ],
    ["Node.js, NestJS, Deno, Bun", "Node.js, Express, API Routes, Bun"],
    ["PostgreSQL, MongoDB, Supabase, Convex", "PostgreSQL, Supabase, SQL-first data design"],
    ["Docker, GCP, Cloudflare Workers, Vercel", "Vercel, Netlify, Cloudflare, CI/CD"],
    ["Camunda (BPMN/DMN), Vercel AI SDK, Git/GitHub", "Payments, webhooks, Git/GitHub"],
    ["React Native, Go, Effect.ts", "Advanced TypeScript, testing, backend architecture"],
  ];

  const targets = [
    "dist/assets/index-B4y-iZIh.js",
    "dist/about/index.html",
  ];

  for (const target of targets) {
    if (!(await exists(target))) {
      continue;
    }

    let input = await text(target);
    for (const [from, to] of replacements) {
      input = replaceIfPresent(input, from, to);
      input = replaceIfPresent(input, from.replace(/'/g, "&#x27;"), to.replace(/'/g, "&#x27;"));
    }

    await write(target, input);
  }
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

const applyProjectCardBundle = async () => {
  const file = "dist/assets/project-card-BIefMaxb.js";
  const moduleSource = `import{r as React,j as jsx,m as motion,c as cn}from"./main-BWk4fnlg.js";

const gradients={
  scraaatch:"linear-gradient(135deg, #f5cf67 0%, #e1a316 48%, #cb7f00 100%)",
  anass:"linear-gradient(135deg, #d69af8 0%, #9646dd 50%, #6417b5 100%)",
  "daily-story":"linear-gradient(135deg, #91cca3 0%, #4f9b68 50%, #2f6e49 100%)",
  "zod-json-schema-builder":"linear-gradient(135deg, #8ab8ff 0%, #4684eb 50%, #2558be 100%)",
  "melany-portfolio":"linear-gradient(135deg, #6b6b76 0%, #2f2f37 38%, #111116 72%, #4b4b58 100%)"
};

const InteractiveCard=({children,containerClassName,className,containerStyle})=>{
  const[mouse,setMouse]=React.useState({x:0,y:0});
  const[hovered,setHovered]=React.useState(false);
  const handleMouseMove=(event)=>{
    const{clientX,clientY}=event;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(clientX-(rect.left+rect.width/2))/20;
    const y=(clientY-(rect.top+rect.height/2))/20;
    setMouse({x,y});
  };

  return jsx.jsx(motion.section,{
    onMouseMove:handleMouseMove,
    onMouseEnter:()=>setHovered(true),
    onMouseLeave:()=>{
      setHovered(false);
      setMouse({x:0,y:0});
    },
    style:{
      ...containerStyle,
      transform:hovered?\`translate3d(\${mouse.x}px, \${mouse.y}px, 0) scale3d(1, 1, 1)\`:"translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
      transition:"transform 0.1s ease-out"
    },
    className:cn("mx-auto w-full bg-primary relative rounded-2xl overflow-hidden",containerClassName),
    children:jsx.jsx("div",{
      className:"relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden",
      style:{
        boxShadow:"0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)"
      },
      children:jsx.jsxs(motion.div,{
        style:{
          transform:hovered?\`translate3d(\${-mouse.x}px, \${-mouse.y}px, 0) scale3d(1.03, 1.03, 1)\`:"translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
          transition:"transform 0.1s ease-out"
        },
        className:cn("h-full px-4 py-20 sm:px-10",className),
        children:[jsx.jsx(NoiseOverlay,{}),children]
      })
    })
  });
};

const NoiseOverlay=()=>jsx.jsx("div",{
  className:"absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)] z-0",
  style:{backgroundImage:"url(/noise.webp)",backgroundSize:"30%"}
});

const ProjectCard=({project,withImagePadding=false})=>jsx.jsx(InteractiveCard,{
  className:"flex-col sm:flex-row h-full !pt-2 pb-4 !px-4 sm:!px-6 flex rounded-2xl relative mx-auto group overflow-hidden",
  containerClassName:cn(project.styles.bgColor,project.styles.textColor),
  containerStyle:project.styles.background?{background:project.styles.background||gradients[project.id]}:{background:gradients[project.id]},
  children:jsx.jsxs("div",{
    className:"flex flex-row items-start gap-4 p-0",
    children:[
      jsx.jsx("div",{
        className:cn("self-start flex-shrink-0",{"pt-2":withImagePadding}),
        children:jsx.jsx("img",{
          src:project.thumbnail,
          alt:project.title,
          className:cn("size-28 md:size-30 block object-contain rounded-[1.6rem]",project.id==="melany-portfolio"&&"scale-[0.82]")
        })
      }),
      jsx.jsx("div",{
        className:"flex flex-col justify-between items-start gap-2 z-20 text-left max-w-[300px] sm:max-w-[340px] md:max-w-[380px] break-words min-w-0",
        children:jsx.jsxs("div",{
          className:"flex flex-col gap-1",
          children:[
            jsx.jsx("h2",{className:"text-2xl md:text-3xl !mb-0 font-bold tracking-tight line-clamp-2 !text-inherit group-hover:scale-[1.02] transition-transform duration-200 ",children:project.title}),
            jsx.jsx("span",{className:"text-xs md:text-base line-clamp-4 hyphens-auto",children:project.description})
          ]
        })
      })
    ]
  })
});

export{ProjectCard as P,InteractiveCard as W};
`;

  await write(file, moduleSource);
};

const applyWorkExperienceArt = async () => {
  const file = "dist/assets/index-CkJi5eF3.js";
  let input = await text(file);

  const replacements = [
    ['src:"/hmy.svg"', 'src:"/bitmoji.webp"'],
    ['src:"/sparksport.svg"', 'src:"/bitmoji.webp"'],
    ['src="/hmy.svg"', 'src="/bitmoji.webp"'],
    ['src="/sparksport.svg"', 'src="/bitmoji.webp"'],
    ['href="/hmy.svg"', 'href="/bitmoji.webp"'],
    ['href="/sparksport.svg"', 'href="/bitmoji.webp"'],
    ["Harmoney logo", "Franco Rotta illustration"],
    ["Spark Sport logo", "Franco Rotta illustration"],
    [
      'src:"/bitmoji.webp",alt:"Franco Rotta logo",width:200,height:25',
      'src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220',
    ],
    [
      'src:"/bitmoji.webp",alt:"Franco Rotta logo",width:200,height:25,loading:"lazy",className:"dark:invert-0 invert"',
      'src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220,loading:"lazy"',
    ],
    [
      'src="/bitmoji.webp" alt="Franco Rotta logo" width="200" height="25"',
      'src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220"',
    ],
    [
      'src="/bitmoji.webp" alt="Franco Rotta logo" width="200" height="25" loading="lazy" class="dark:invert-0 invert"',
      'src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"',
    ],
    ["Fullstack Engineer | January 2023 - Present", "Full Stack Developer | 2024 - Present"],
    [
      "Created a library to collect analytics across the platform and landing pages, enabling data-driven decision-making.",
      "Built a Next.js commerce flow for Tostadero Wellington with Mercado Pago checkout and server-side webhooks into Supabase.",
    ],
    [
      "Executed a seamless migration of the core data layer from TypeORM to Prisma, improving developer experience and reducing database migration conflicts.",
      "Built an internal operations board, cart persistence and discount logic for day-to-day order management.",
    ],
    [
      "Taking part in numerous focus groups related to product development, user experience and developer tooling.",
      "Designed and implemented SEMO's WhatsApp appointment flow with Twilio, Node.js and Express.",
    ],
    [
      "Proactively improved the developer experience to maintain high velocity across the team.",
      "Developed a React/Vite admin panel with role-based access and PostgreSQL scheduling logic for six specialties.",
    ],
    [
      "Helped organise an internal hackathon to foster innovation and collaboration. Curated a list of tools and technologies that non-technical team members could use to build prototypes.",
      "Delivered Sancor's React + Vite + Tailwind quote flow with Netlify Functions and real-time validation.",
    ],
    [
      "Accelerated teammate onboarding with React by leading pair-programming sessions and code reviews.",
      "Shipped and maintained these tools through deployment, operations and iterative client feedback.",
    ],
    [
      "Mentored three cohorts of interns.",
      "Worked end-to-end from product requirements to launch, keeping a strong focus on reliability and user flow.",
    ],
    ["Fullstack Engineer | August 2021 - January 2023", "Audiovisual Production & Streaming | 2021 - Present"],
    [
      "Boosted SEO performance and developer productivity by leading the upgrade of a legacy application to Next.js and refactoring most of the codebase to TypeScript.",
      "Project-based and ongoing production work across Insert BIC / Insert Beat and Iglesia Brazos Abiertos.",
    ],
    [
      "Collaborated with the design lead to implement a Design System and automated the design token handover from Figma to Storybook.",
      "Planned and executed 4K multicam productions (S-Log3) with 3 to 5 cameras and occasional live switching with ATEM Mini Pro.",
    ],
    [
      "Improved release stability by redesigning and implementing a new Git workflow across all frontend applications.",
      "Led hired camera operators and owned pre-production, technical direction, post-production and delivery.",
    ],
    [
      "Enhanced the streaming experience for Web players and Chromecast.",
      "Delivered publish-ready edits under tight turnaround requirements, often in under 24 hours.",
    ],
    [
      "Enabled a new revenue stream by successfully implementing Google Dynamic Ad Insertion (DAI) for the Chromecast platform.",
      "Produced 10+ event productions and 50+ edited assets across social, event and streaming cycles.",
    ],
  ];

  for (const [from, to] of replacements) {
    input = replaceIfPresent(input, from, to);
  }

  // Force illustration sizing in case previous passes left logo dimensions behind.
  input = input.replace(
    /src:"\/bitmoji\.webp",alt:"Franco Rotta illustration",width:200,height:25,loading:"lazy",className:"dark:invert-0 invert"/g,
    'src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220,loading:"lazy"'
  );
  input = input.replace(
    /src:"\/bitmoji\.webp",alt:"Franco Rotta illustration",width:200,height:25/g,
    'src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220'
  );

  input = replaceIfPresent(
    input,
    'e.jsx(r,{src:"/finalincon.png",alt:"Franco Rotta illustration",width:220,height:220})',
    'e.jsx(r,{src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220})'
  );
  input = replaceIfPresent(
    input,
    'e.jsx(r,{src:"/finalincon.png",alt:"Franco Rotta illustration",width:220,height:220,loading:"lazy"})',
    'e.jsx(r,{src:"/bitmoji.webp",alt:"Franco Rotta illustration",width:220,height:220,loading:"lazy"})'
  );

  await write(file, input);

  const htmlFile = "dist/work-experience/index.html";
  let html = await text(htmlFile);
  for (const [from, to] of replacements) {
    html = replaceIfPresent(html, from, to);
  }
  html = html.replace(
    /src="\/bitmoji\.webp" alt="Franco Rotta illustration" width="200" height="25" loading="lazy" class="dark:invert-0 invert"/g,
    'src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"'
  );
  html = html.replace(
    /src="\/bitmoji\.webp" alt="Franco Rotta illustration" width="200" height="25"/g,
    'src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220"'
  );
  html = replaceIfPresent(
    html,
    '<link rel="preload" as="image" href="/hmy.svg"/>',
    '<link rel="preload" as="image" href="/bitmoji.webp"/>'
  );
  html = replaceIfPresent(
    html,
    '<link rel="preload" as="image" href="/sparksport.svg"/>',
    '<link rel="preload" as="image" href="/bitmoji.webp"/>'
  );
  html = replaceIfPresent(
    html,
    '<img src="/hmy.svg" alt="Franco Rotta illustration" width="220" height="220"/>',
    '<img src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220"/>'
  );
  html = replaceIfPresent(
    html,
    '<img src="/sparksport.svg" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"/>',
    '<img src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"/>'
  );
  html = replaceIfPresent(
    html,
    '<link rel="preload" as="image" href="/finalincon.png"/>',
    '<link rel="preload" as="image" href="/bitmoji.webp"/>'
  );
  html = replaceIfPresent(
    html,
    '<img src="/finalincon.png" alt="Franco Rotta illustration" width="220" height="220"/>',
    '<img src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220"/>'
  );
  html = replaceIfPresent(
    html,
    '<img src="/finalincon.png" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"/>',
    '<img src="/bitmoji.webp" alt="Franco Rotta illustration" width="220" height="220" loading="lazy"/>'
  );
  await write(htmlFile, html);
};

const applyProjectsHtml = async () => {
  const replacements = [
    [
      "Commerce flow with Mercado Pago to your family and friends.",
      projects[0].description,
    ],
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
  listHtml = replaceIfPresent(listHtml, "bg-red-700", "bg-blue-800");

  const projectGradients = {
    scraaatch:
      "linear-gradient(135deg, #f5cf67 0%, #e1a316 48%, #cb7f00 100%)",
    anass:
      "linear-gradient(135deg, #d69af8 0%, #9646dd 50%, #6417b5 100%)",
    "daily-story":
      "linear-gradient(135deg, #91cca3 0%, #4f9b68 50%, #2f6e49 100%)",
    "zod-json-schema-builder":
      "linear-gradient(135deg, #8ab8ff 0%, #4684eb 50%, #2558be 100%)",
    "melany-portfolio":
      "linear-gradient(135deg, #6b6b76 0%, #2f2f37 38%, #111116 72%, #4b4b58 100%)",
  };

  for (const [projectId, gradient] of Object.entries(projectGradients)) {
    listHtml = listHtml.replace(
      new RegExp(
        `(<a href="/projects/${projectId}"[\\s\\S]*?<section class="[^"]*" style=")([^"]*)"`,
        "m"
      ),
      (_, prefix, existingStyle) => `${prefix}background:${gradient};${existingStyle}"`
    );
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
    if (!(await exists(detail.path))) {
      continue;
    }

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
      html = replaceIfPresent(
        html,
        "Take-away ordering with Mercado Pago to your family and friends.",
        detail.next.description
      );
      html = replaceIfPresent(html, "Shadcn UI", "Supabase");
    }

    if (detail.path.endsWith("daily-story/index.html")) {
      html = replaceIfPresent(
        html,
        "At midnight (UTC), it uses AI to generate a unique title, theme and cover image, providing the initial spark of inspiration.\nThroughout the day, anyone can visit the site and contribute their part of the story. It allows a 500 characters contribution. Every contribution appears instantly for everyone to see.\nAt the end of the day, Gemini reads all the contributions, edits them for flow and coherence, and compiles a final, polished short story. It also generates a full audiobook.\nThis project was built during the Bolt.new hackathon\n",
        detail.next.longDescription
      );
      html = replaceIfPresent(html, "Creative Writing", detail.next.category);
      html = replaceIfPresent(html, "AI-generated themes and covers", detail.next.features[0]);
      html = replaceIfPresent(html, "Daily story cycle", detail.next.features[1]);
      html = replaceIfPresent(html, "AI editing and compilation", detail.next.features[2]);
      html = replaceIfPresent(html, "Audiobook generation", detail.next.features[3]);
      html = replaceIfPresent(html, "AI moderation", detail.next.features[4]);
      html = replaceIfPresent(html, "React", "HTML5");
      html = replaceIfPresent(html, "Vite", "JavaScript");
      html = replaceIfPresent(html, "Tailwind", "Tailwind CSS");
      html = replaceIfPresent(html, "Convex", "AOS");
      html = replaceIfPresent(html, "Netlify", "Vercel");
      html = replaceIfPresent(html, "Gemini", "Maps");
      html = replaceIfPresent(html, "Eleven Labs", "SEO");
    }

    if (detail.path.endsWith("zod-json-schema-builder/index.html")) {
      html = replaceIfPresent(
        html,
        "A web application that allows developers to create data schemas visually through a user-friendly form interface. The tool generates both JSON Schema and Zod validation code, streamlining the schema creation process for various applications.",
        detail.next.longDescription
      );
      html = replaceIfPresent(html, "Web App", detail.next.category);
      html = replaceIfPresent(html, "2025", detail.next.year);
      html = replaceIfPresent(html, "Visual schema builder", detail.next.features[0]);
      html = replaceIfPresent(html, "Generates JSON Schema", detail.next.features[1]);
      html = replaceIfPresent(html, "Generates Zod validation code", detail.next.features[2]);
      html = replaceIfPresent(html, "User-friendly interface", detail.next.features[3]);
      html = replaceIfPresent(html, "Export and share schemas", detail.next.features[4]);
      html = replaceIfPresent(html, "Tailwind", "Node.js");
      html = replaceIfPresent(html, "Netlify", "Express");
      html = replaceIfPresent(html, "Zod", "PostgreSQL");
      html = replaceIfPresent(html, "Shadcn UI", "Twilio");
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

const applyStaticAssets = async () => {
  const staticAssets = [
    ["public/favicon.png", "dist/favicon.png"],
    ["public/bitmoji.webp", "dist/bitmoji.webp"],
    ["public/finalincon.png", "dist/finalincon.png"],
    ["public/email.svg", "dist/email.svg"],
    ["public/github.svg", "dist/github.svg"],
    ["public/linkedin.svg", "dist/linkedin.svg"],
    ["public/projects/IC-Melany.png", "dist/projects/IC-Melany.png"],
    ["public/projects/IC-Melany-thumb.png", "dist/projects/IC-Melany-thumb.png"],
    ["public/projects/ic-anass.svg", "dist/projects/ic-anass.svg"],
    ["public/projects/ic-daily-story.svg", "dist/projects/ic-daily-story.svg"],
    ["public/projects/ic-scraaatch.svg", "dist/projects/ic-scraaatch.svg"],
    ["public/projects/ic-zod-json.svg", "dist/projects/ic-zod-json.svg"],
  ];

  for (const [fromPath, toPath] of staticAssets) {
    await copy(fromPath, toPath);
  }
};

export async function applyMirrorCustomizations() {
  await applyHeroToHtml();
  await applyHeaderNameToHtml();
  await applyFaviconLinks();
  await applyGlobalBranding();
  await applyHeroToMainBundle();
  await applyHomeCards();
  await applyHomeHtml();
  await applyContactLinks();
  await applyContactForm();
  await applyAboutContent();
  await applyProjectDataToMainBundle();
  await applyProjectsPageBundle();
  await applyProjectCardBundle();
  await applyProjectsHtml();
  await applyWorkExperienceArt();
  await applyStaticAssets();
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
