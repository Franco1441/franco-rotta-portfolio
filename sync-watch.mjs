import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const watchedFiles = [
  "site-content.mjs",
  "sync-site-content.mjs",
];

let isRunning = false;
let rerunRequested = false;
let debounceTimer = null;
const lastEventAt = new Map();

const log = (message) => {
  const timestamp = new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  process.stdout.write(`[sync:watch ${timestamp}] ${message}\n`);
};

const runScript = (scriptName) =>
  new Promise((resolve, reject) => {
    const child = spawn("node", [scriptName], {
      cwd: rootDir,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${scriptName} exited with code ${code ?? "unknown"}`));
    });

    child.on("error", reject);
  });

const runSync = async (reason = "manual") => {
  if (isRunning) {
    rerunRequested = true;
    return;
  }

  isRunning = true;
  log(`running sync (${reason})...`);

  try {
    await runScript("sync-site-content.mjs");
    log("sync complete");
  } catch (error) {
    log(`sync failed: ${error.message}`);
  } finally {
    isRunning = false;

    if (rerunRequested) {
      rerunRequested = false;
      await runSync("queued change");
    }
  }
};

const scheduleSync = (reason) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runSync(reason);
  }, 150);
};

for (const relativeFile of watchedFiles) {
  const fullPath = path.join(rootDir, relativeFile);

  fs.watch(fullPath, () => {
    const now = Date.now();
    const previousEventAt = lastEventAt.get(relativeFile) ?? 0;

    if (now - previousEventAt < 400) {
      return;
    }

    lastEventAt.set(relativeFile, now);
    scheduleSync(relativeFile);
  });

  log(`watching ${relativeFile}`);
}

runSync("startup");
