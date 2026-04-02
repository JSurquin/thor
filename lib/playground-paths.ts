/** Normalise un chemin de fichier playground : `/` au début, pas de `..`, segments non vides. */
export function normalizePlaygroundPath(input: string): string | null {
  let p = input.trim().replace(/\\/g, "/");
  if (!p) return null;
  p = p.replace(/^\/+/, "");
  const parts = p.split("/").filter((s) => s.length > 0);
  if (parts.length === 0) return null;
  for (const part of parts) {
    if (part === "." || part === "..") return null;
  }
  return `/${parts.join("/")}`;
}

/** Contenu par défaut selon l’extension (aperçu / édition utile). */
export function defaultContentForPath(path: string): string {
  const name = path.split("/").pop() ?? "";
  if (name.endsWith(".tsx") || name.endsWith(".jsx")) {
    return `export default function Component() {\n  return <div>Nouveau fichier</div>;\n}\n`;
  }
  if (name.endsWith(".vue")) {
    return `<template>\n  <div>Nouveau fichier</div>\n</template>\n\n<script setup lang="ts">\n</script>\n`;
  }
  if (name.endsWith(".ts")) {
    return `export {};\n`;
  }
  if (name.endsWith(".js") || name.endsWith(".mjs") || name.endsWith(".cjs")) {
    return `// Nouveau fichier\n`;
  }
  if (name.endsWith(".css")) {
    return `/* Nouveau fichier */\n`;
  }
  if (name.endsWith(".json")) {
    return `{\n}\n`;
  }
  if (name.endsWith(".html")) {
    return `<!DOCTYPE html>\n<html lang="fr">\n<head><meta charset="UTF-8" /></head>\n<body></body>\n</html>\n`;
  }
  if (name.endsWith(".md")) {
    return `# Nouveau fichier\n\n`;
  }
  if (name.endsWith(".yml") || name.endsWith(".yaml")) {
    return `# Nouveau fichier\n`;
  }
  if (name.endsWith(".sh")) {
    return `#!/usr/bin/env bash\nset -euo pipefail\n`;
  }
  if (name.endsWith(".py")) {
    return `# Nouveau fichier\n`;
  }
  if (name.endsWith(".rb")) {
    return `# Nouveau fichier\n`;
  }
  if (name.endsWith(".sql")) {
    return `-- Nouveau fichier\n`;
  }
  return "";
}
