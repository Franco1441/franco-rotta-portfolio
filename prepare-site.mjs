import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
// Build from the approved local base, never from a changing remote website.
await fs.access(new URL("./site-base.tar.gz", import.meta.url));
await fs.rm(new URL("./dist", import.meta.url), { recursive: true, force: true });
await fs.mkdir(new URL("./dist", import.meta.url), { recursive: true });
execFileSync("tar", ["-xzf", "site-base.tar.gz", "-C", "dist"], { cwd: root, stdio: "inherit" });
