import { access, cp, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const packageRoot = dirname(require.resolve("monaco-editor/package.json"));
const source = join(packageRoot, "min", "vs");
const destination = join(projectRoot, "public", "vendor", "monaco", "vs");

// Use the exact installed Monaco version, including its workers and language assets.
await access(join(source, "loader.js"));
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
console.log("Monaco assets prepared at /vendor/monaco/vs");
