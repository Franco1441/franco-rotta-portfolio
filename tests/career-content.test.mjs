import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { projects } from "../site-content.mjs";
import { career } from "../career-content.mjs";

const read = file => fs.readFile(new URL(`../dist/${file}`, import.meta.url), "utf8");

test("project identifiers stay unique and existing links are retained", () => {
  assert.equal(new Set(projects.map(project => project.id)).size, 6);
  assert.deepEqual(projects.slice(0, 5).map(project => project.id), ["scraaatch", "anass", "daily-story", "zod-json-schema-builder", "melany-portfolio"]);
});

test("About uses the completed qualification and accurate languages", async () => {
  const about = await read("about/index.html");
  assert.match(about, /completed December 2025/);
  assert.match(about, /Portuguese \(intermediate\)/);
  assert.doesNotMatch(about, /Self-Taught|English \(Fluent\)|a platform I scaled/);
});

test("work history separates freelance work from the technical project", async () => {
  const work = await read("work-experience/index.html");
  for (const role of career.experience) assert.ok(work.includes(role.title));
  assert.doesNotMatch(work, /loan book|award!|Harmoney|Spark Sport/);
});

test("every direct project route contains its own loader data and body", async () => {
  for (const project of projects) {
    const page = await read(`projects/${project.id}/index.html`);
    assert.ok(page.includes(`"id":"${project.id}"`));
    assert.ok(page.includes(project.title));
    assert.ok(page.includes(project.links.github));
    assert.ok(page.includes(project.longDescription));
  }
});

test("project list and client data include PokeRadar", async () => {
  assert.match(await read("projects/index.html"), /href="\/projects\/pokeradar"/);
  assert.match(await read("assets/main-BWk4fnlg.js"), /id:"pokeradar"/);
});

test("PokeRadar uses the padded icon consistently across rendered project routes", async () => {
  const project = projects.find(project => project.id === "pokeradar");
  const source = await fs.readFile(new URL("../public/projects/pokeradar.svg", import.meta.url), "utf8");
  assert.match(source, /viewBox="0 0 128 128"/);
  assert.match(source, /<rect width="128" height="128" rx="28" fill="#172b4d"/);
  assert.match(source, /transform="translate\(16 16\) scale\(1\.5\)"/);
  assert.equal(await read("projects/pokeradar.svg"), source);
  for (const route of ["projects/index.html", "projects/pokeradar/index.html"]) {
    assert.ok((await read(route)).includes(`src="${project.thumbnail}"`));
  }
  assert.ok((await read("assets/main-BWk4fnlg.js")).includes(`thumbnail:"${project.thumbnail}"`));
});

test("bilingual downloadable CVs are present and have PDF signatures", async () => {
  for (const language of ["es", "en"]) {
    const buffer = await fs.readFile(new URL(`../dist/cv-franco-rotta-${language}.pdf`, import.meta.url));
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
  }
});
