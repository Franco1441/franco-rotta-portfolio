import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://www.franckpoingt.dev";
const DIST_DIR = "dist";
const START_PATHS = ["/"];

const assetLikeExtensions = new Set([
  ".js",
  ".mjs",
  ".css",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".json",
  ".map",
  ".txt",
  ".xml",
]);

const baseUrl = new URL(BASE_URL);
const visited = new Set();
const queue = START_PATHS.map((p) => new URL(p, baseUrl).toString());

const stripQueryAndHash = (value) => value.split("#")[0].split("?")[0];

const isTextContent = (contentType) =>
  contentType.includes("text/") ||
  contentType.includes("application/javascript") ||
  contentType.includes("application/json");

const toFilePath = (urlString, contentType = "") => {
  const url = new URL(urlString);
  const pathname = decodeURIComponent(stripQueryAndHash(url.pathname));
  const ext = path.extname(pathname);

  if (pathname.endsWith("/")) {
    return path.join(DIST_DIR, pathname, "index.html");
  }

  if (ext) {
    return path.join(DIST_DIR, pathname);
  }

  if (contentType.includes("text/html")) {
    return path.join(DIST_DIR, pathname, "index.html");
  }

  return path.join(DIST_DIR, pathname);
};

const normalize = (candidate, currentUrl) => {
  const raw = candidate.trim().replace(/^['"]|['"]$/g, "");
  if (!raw || raw.startsWith("#")) return null;
  if (raw.startsWith("data:")) return null;
  if (raw.startsWith("mailto:")) return null;
  if (raw.startsWith("tel:")) return null;
  if (raw.startsWith("javascript:")) return null;
  if (/[`{}[\]$]/.test(raw)) return null;
  if (raw.includes(",") || raw.includes(" ")) return null;

  let resolved;
  try {
    resolved = new URL(raw, currentUrl);
  } catch {
    return null;
  }

  if (resolved.origin !== baseUrl.origin) return null;
  if (resolved.pathname.startsWith("/api/")) return null;

  const cleaned = stripQueryAndHash(resolved.toString());
  return cleaned;
};

const shouldFollow = (urlString) => {
  const url = new URL(urlString);
  if (url.pathname.endsWith("/")) return true;
  const ext = path.extname(url.pathname).toLowerCase();
  if (!ext) return true;
  return assetLikeExtensions.has(ext);
};

const extractUrls = (text, currentUrl) => {
  const found = new Set();
  const patterns = [
    /(?:href|src)=["']([^"']+)["']/gim,
    /url\(([^)]+)\)/gim,
    /import\(["']([^"']+)["']\)/gim,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const normalized = normalize(match[1], currentUrl);
      if (normalized && shouldFollow(normalized)) {
        found.add(normalized);
      }
    }
  }

  return [...found];
};

const saveResponse = async (urlString, responseBuffer, contentType) => {
  const filePath = toFilePath(urlString, contentType);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, responseBuffer);
};

const fetchOne = async (urlString) => {
  if (visited.has(urlString)) return;
  visited.add(urlString);

  const res = await fetch(urlString, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; MirrorBot/1.0)",
      accept: "*/*",
    },
  });

  if (!res.ok) {
    if (res.status === 404) return;
    throw new Error(`Failed ${urlString} -> ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "";
  const buffer = Buffer.from(await res.arrayBuffer());
  await saveResponse(urlString, buffer, contentType);

  if (isTextContent(contentType)) {
    const text = buffer.toString("utf8");
    const urls = extractUrls(text, urlString);
    for (const nextUrl of urls) {
      if (!visited.has(nextUrl)) {
        queue.push(nextUrl);
      }
    }
  }
};

const run = async () => {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  while (queue.length > 0) {
    const next = queue.shift();
    if (!next) break;
    // eslint-disable-next-line no-console
    console.log(`fetch ${next}`);
    await fetchOne(next);
  }

  // eslint-disable-next-line no-console
  console.log(`Mirror complete. Files written to ${DIST_DIR}`);
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
