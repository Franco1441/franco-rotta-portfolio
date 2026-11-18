import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { career } from "./career-content.mjs";
import { projects } from "./site-content.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const node = (tag, props = {}, ...children) => ({ tag, props, children: children.flat() });
const toReact = (value, key = 0) => typeof value === "object"
  ? React.createElement(value.tag, { ...value.props, key }, ...value.children.map(toReact))
  : value;
const html = (value) => renderToStaticMarkup(toReact(value));
const prose = /(<main class="mx-auto px-4 sm:px-6 lg:px-8"><div class="[^"]*">)[\s\S]*?(<\/div><\/main>)/;
const read = (file) => fs.readFile(path.join(root, "dist", file), "utf8");
const write = async (file, value) => {
  const target = path.join(root, "dist", file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, value);
};

const clientRenderer = `const mount=(v,key=0)=>typeof v==="object"?jsx.jsx(v.tag,{...v.props,...(v.children.length?{children:v.children.map(mount)}:{})},key):v;`;
const componentModule = (tree) => `import{j as jsx}from"./main-BWk4fnlg.js";${clientRenderer}const tree=${JSON.stringify(tree)};function component(){return mount(tree)}export{component};`;

function card(project) {
  return node("section", {
    className: `mx-auto w-full relative rounded-2xl overflow-hidden ${project.styles.bgColor} ${project.styles.textColor}`,
    style: { background: project.styles.background, transform: "translate3d(0px, 0px, 0) scale3d(1, 1, 1)", transition: "transform 0.1s ease-out" },
  }, node("div", {
    className: "relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden",
    style: { boxShadow: "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)" },
  }, node("div", {
    className: "h-full px-4 py-20 sm:px-10 flex-col sm:flex-row !pt-2 pb-4 !px-4 sm:!px-6 flex rounded-2xl relative mx-auto group overflow-hidden",
    style: { transform: "translate3d(0px, 0px, 0) scale3d(1, 1, 1)", transition: "transform 0.1s ease-out" },
  }, node("div", {
    className: "absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)] z-0",
    style: { backgroundImage: "url(/noise.webp)", backgroundSize: "30%" },
  }), node("div", { className: "flex flex-row items-start gap-4 p-0" },
    node("div", { className: "self-start flex-shrink-0" }, node("img", {
      src: project.thumbnail, alt: project.title, loading: "lazy",
      className: `size-28 md:size-30 block object-contain rounded-[1.6rem]${project.id === "melany-portfolio" ? " scale-[0.82]" : ""}`,
    })), node("div", { className: "flex flex-col justify-between items-start gap-2 z-20 text-left max-w-[300px] sm:max-w-[340px] md:max-w-[380px] break-words min-w-0" },
      node("div", { className: "flex flex-col gap-1" },
        node("h2", { className: "text-2xl md:text-3xl !mb-0 font-bold tracking-tight line-clamp-2 !text-inherit group-hover:scale-[1.02] transition-transform duration-200 " }, project.title),
        node("span", { className: "text-xs md:text-base line-clamp-4 hyphens-auto" }, project.description),
      )),
  ))));
}

function detail(project) {
  const link = (href, label) => node("a", { href, target: "_blank", rel: "noopener noreferrer", className: "text-primary underline" }, label);
  return node("div", { className: "relative mx-auto min-h-svh px-4 py-12 md:px-8 lg:px-12" },
    node("div", { className: "mb-8" }, node("a", { href: "/projects", className: "text-primary underline" }, "Back to Projects")),
    node("div", { className: "mx-auto max-w-5xl" },
      node("div", { style: { viewTransitionName: `project-card-${project.id}` } }, card(project)),
      node("div", { className: "mt-2 grid gap-2 md:gap-8 md:grid-cols-3" },
        node("div", { className: "md:col-span-2 md:space-y-8" },
          node("section", {}, node("h2", { className: "text-2xl font-semibold mb-4 font-serif" }, "About"), node("p", { className: "text-muted-foreground leading-relaxed" }, project.longDescription)),
          node("section", {}, node("h2", { className: "text-2xl font-semibold mb-4 font-serif" }, "Key Features"), node("ul", { className: "space-y-3" }, project.features.map(item => node("li", { className: "text-muted-foreground" }, item)))),
        ),
        node("div", { className: "md:space-y-8" },
          node("section", {}, node("h3", { className: "text-lg font-semibold mb-4 font-serif" }, "Info"),
            node("p", {}, project.category), node("p", {}, project.year),
            node("p", {}, link(project.links.website, "View project")),
            node("p", {}, link(project.links.github, "Source on GitHub")),
          ),
          node("section", {}, node("h3", { className: "text-lg font-semibold mb-4 font-serif" }, "Tech"),
            node("div", { className: "flex flex-wrap gap-2" }, project.technologies.map(tech => node("span", { className: "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium" }, tech.name))),
          ),
        ),
      ),
    ),
  );
}

function setBody(shell, body) {
  if (!prose.test(shell)) throw new Error("Could not find the page content boundary");
  return shell.replace(prose, (_, start, end) => start + html(body) + end);
}

export async function syncCareerContent() {
  const about = node("div", {}, node("h2", {}, "About Me"),
    career.intro.map(text => node("p", {}, text)),
    node("p", {}, node("a", { href: "/cv-franco-rotta-es.pdf", target: "_blank", rel: "noopener noreferrer" }, "CV en español"), " · ", node("a", { href: "/cv-franco-rotta-en.pdf", target: "_blank", rel: "noopener noreferrer" }, "CV in English")),
    node("h2", {}, "The Specs"), node("ul", { className: "list-disc list-inside space-y-1 mb-8" }, career.specs.map(([label, value]) => node("li", {}, node("span", { className: "font-medium" }, `${label}: `), value))),
    node("h2", {}, "Tech Stack"), node("ul", { className: "list-disc list-inside space-y-1" }, career.stack.map(([label, value]) => node("li", {}, node("span", { className: "font-medium" }, `${label}: `), value))),
  );
  const work = node("div", {}, node("img", { src: "/bitmoji.webp", alt: "Franco Rotta illustration", width: 220, height: 220, loading: "lazy" }),
    career.experience.flatMap(role => [node("h2", {}, role.title), node("ul", {}, role.bullets.map(text => node("li", {}, node("p", {}, text))))]),
  );
  for (const [route, bundle, tree] of [
    ["about", "index-B4y-iZIh.js", about],
    ["work-experience", "index-CkJi5eF3.js", work],
  ]) {
    await write(`assets/${bundle}`, componentModule(tree));
    await write(`${route}/index.html`, setBody(await read(`${route}/index.html`), tree));
  }

  // Keep pre-rendered loader data in sync; otherwise direct links show the old projects.
  const template = await read("projects/scraaatch/index.html");
  const loaderPattern = /l:\$R\[\d+\]=\{project:\$R\[\d+\]=\{[\s\S]*?\}\},ssr:!0/;
  for (const project of projects) {
    let shell = template.replaceAll("/(pages)/projects/scraaatch/", `/(pages)/projects/${project.id}/`);
    const payload = { ...project, technologies: project.technologies.map(tech => ({ ...tech, iconUrl: `https://cdn.simpleicons.org/${tech.slug}` })) };
    if (loaderPattern.test(shell)) shell = shell.replace(loaderPattern, () => `l:${JSON.stringify({ project: payload })},ssr:!0`);
    else if (/l:\{"project":/.test(shell)) shell = shell.replace(/l:\{"project":[\s\S]*?\},ssr:!0/, () => `l:${JSON.stringify({ project: payload })},ssr:!0`);
    else throw new Error("Project loader payload was not found");
    await write(`projects/${project.id}/index.html`, setBody(shell, detail(project)));
  }
  const detailSource = `import{j as jsx,I as route}from"./main-BWk4fnlg.js";const node=${node.toString()};const card=${card.toString()};const detail=${detail.toString()};${clientRenderer}function component(){return mount(detail(route.useLoaderData().project))}export{component};`;
  await write("assets/index-B5EKBNNl.js", detailSource);

  let list = await read("projects/index.html");
  const cards = projects.map((project, index) => html(node("div", { className: "sticky h-[260px] md:h-[280px] top-[122px] md:top-[182px]" },
    node("div", { className: "origin-top relative h-full", style: { top: `${index * 3}%`, transform: "none" } },
      node("a", { href: `/projects/${project.id}`, className: "no-underline" }, node("div", { style: { viewTransitionName: `project-card-${project.id}` } }, card(project))),
    ),
  ))).join("");
  const boundary = /(<div class="pb-\[305px\] sm:pb-\[325px\] space-y-0">)[\s\S]*?(<div class="sticky h-\[310px\])/;
  if (!boundary.test(list)) throw new Error("Project list boundary was not found");
  list = list.replace(boundary, (_, start, cta) => start + cards + cta);
  await write("projects/index.html", list);
  await fs.copyFile(path.join(root, "public/projects/pokeradar.svg"), path.join(root, "dist/projects/pokeradar.svg"));
  for (const language of ["es", "en"]) {
    await fs.copyFile(path.join(root, `public/cv-franco-rotta-${language}.pdf`), path.join(root, `dist/cv-franco-rotta-${language}.pdf`));
  }
}
