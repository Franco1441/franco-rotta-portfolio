import { applyMirrorCustomizations } from "./sync-site-content.mjs";

applyMirrorCustomizations().catch((error) => {
  console.error(error);
  process.exit(1);
});
