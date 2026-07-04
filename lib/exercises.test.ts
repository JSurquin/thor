import { describe, it, expect } from "vitest";
import {
  getExercises,
  getExerciseById,
  getExerciseInitialFiles,
  getExerciseEntryFile,
  mergeExerciseFilesWithSeed,
  resolveExerciseSelectedFile,
  getExerciseFileContent,
  validateExercise,
  isExerciseValid,
} from "./exercises";
import { TEMPLATES } from "./templates";

describe("getExercises / getExerciseById", () => {
  it("retourne les exercices triés par order", () => {
    const list = getExercises();
    expect(list.length).toBeGreaterThanOrEqual(9);
    const orders = list.map((e) => e.order ?? 99);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
  });

  it("priorité Vue, Next, React en tête de liste", () => {
    const list = getExercises();
    expect(list[0]?.templateId).toBe("vue");
    expect(list[1]?.templateId).toBe("next");
    expect(list[2]?.templateId).toBe("react");
  });

  it("résout un id connu", () => {
    expect(getExerciseById("vue-ref-compteur")?.title).toContain("Vue");
    expect(getExerciseById("next-sous-titre-h2")?.templateId).toBe("next");
    expect(getExerciseById("inexistant")).toBeUndefined();
  });
});

describe("getExerciseInitialFiles", () => {
  it("fusionne le template Vue pour l’exercice compteur", () => {
    const ex = getExerciseById("vue-ref-compteur");
    expect(ex).toBeDefined();
    const files = getExerciseInitialFiles(ex!);
    expect(files["/src/App.vue"]).toContain("script setup");
    expect(files["/src/main.js"]).toContain("createApp");
  });

  it("fusionne le template Next (App Router)", () => {
    const ex = getExerciseById("next-sous-titre-h2");
    expect(ex).toBeDefined();
    const files = getExerciseInitialFiles(ex!);
    expect(files["/app/page.jsx"]).toBeDefined();
    expect(files["/app/layout.jsx"]).toContain("globals.css");
    expect(files["/index.js"]).toContain("RootLayout");
  });

  it("conserve le code de base si le brouillon est vide ou partiel", () => {
    const ex = getExerciseById("next-lien-navigation");
    expect(ex).toBeDefined();
    const mergedEmpty = mergeExerciseFilesWithSeed(ex!, {});
    expect(mergedEmpty["/app/page.jsx"]).toContain("Next.js");
    const mergedPartial = mergeExerciseFilesWithSeed(ex!, {
      "/app/page.jsx": "export default function Page() { return null; }",
    });
    expect(mergedPartial["/app/page.jsx"]).toContain("return null");
    expect(mergedPartial["/app/layout.jsx"]).toContain("globals.css");
  });
});

describe("resolveExerciseSelectedFile", () => {
  it("retombe sur entryFile si le brouillon pointe vers un fichier absent", () => {
    const ex = getExerciseById("next-lien-navigation");
    expect(ex).toBeDefined();
    const files = getExerciseInitialFiles(ex!);
    expect(
      resolveExerciseSelectedFile(ex!, files, "/fichier-inexistant.jsx")
    ).toBe("/app/page.jsx");
  });
});

describe("getExerciseEntryFile", () => {
  it("utilise entryFile de l’exercice", () => {
    const ex = getExerciseById("next-sous-titre-h2");
    expect(getExerciseEntryFile(ex!)).toBe("/app/page.jsx");
  });

  it("retombe sur le template si absent", () => {
    const minimal = {
      ...getExerciseById("react-hello-state")!,
      entryFile: undefined,
    };
    expect(getExerciseEntryFile(minimal)).toBe(TEMPLATES.react.entryFile);
  });

  it("retombe sur l’entrée du template si entryFile est invalide", () => {
    const ex = {
      ...getExerciseById("vue-ref-compteur")!,
      entryFile: "/introuvable.vue",
    };
    expect(getExerciseEntryFile(ex)).toBe(TEMPLATES.vue.entryFile);
  });
});

describe("getExerciseFileContent", () => {
  it("lit avec ou sans slash initial", () => {
    const files = { "/src/App.vue": "ok", "plain.txt": "x" };
    expect(getExerciseFileContent(files, "/src/App.vue")).toBe("ok");
    expect(getExerciseFileContent(files, "src/App.vue")).toBe("ok");
    expect(getExerciseFileContent(files, "plain.txt")).toBe("x");
  });
});

describe("validateExercise", () => {
  it("valide une solution Vue conforme", () => {
    const ex = getExerciseById("vue-ref-compteur")!;
    const files = {
      ...getExerciseInitialFiles(ex),
      "/src/App.vue": `<template>
  <div>
    <p>{{ n }}</p>
    <button type="button" @click="n++">Incrémenter</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
const n = ref(0);
</script>`,
    };
    const results = validateExercise(ex, files);
    expect(isExerciseValid(results)).toBe(true);
  });

  it("rejette une solution Vue incomplète", () => {
    const ex = getExerciseById("vue-ref-compteur")!;
    const files = {
      ...getExerciseInitialFiles(ex),
      "/src/App.vue": "<template><div>ok</div></template>",
    };
    const results = validateExercise(ex, files);
    expect(isExerciseValid(results)).toBe(false);
    expect(results.some((r) => !r.ok)).toBe(true);
  });

  it("valide une solution Next conforme", () => {
    const ex = getExerciseById("next-sous-titre-h2")!;
    const base = getExerciseInitialFiles(ex);
    const files = {
      ...base,
      "/app/page.jsx": `export default function Page() {
  return (
    <main>
      <h1>Titre</h1>
      <h2>Apprentissage Next.js</h2>
    </main>
  );
}`,
    };
    expect(isExerciseValid(validateExercise(ex, files))).toBe(true);
  });

  it("valide une solution React useState", () => {
    const ex = getExerciseById("react-hello-state")!;
    const files = {
      ...getExerciseInitialFiles(ex),
      "/App.js": `import { useState } from "react";
export default function App() {
  const [c, setC] = useState(0);
  return (
    <div>
      <p>{c}</p>
      <button type="button" onClick={() => setC(c + 1)}>Incrémenter</button>
    </div>
  );
}`,
    };
    expect(isExerciseValid(validateExercise(ex, files))).toBe(true);
  });

  it("valide HTML quand le h1 est changé et color est présent", () => {
    const ex = getExerciseById("html-titre-couleur")!;
    const files = {
      ...getExerciseInitialFiles(ex),
      "/index.html": `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css" /></head><body><h1>Jean</h1></body></html>`,
      "/style.css": "h1 { color: navy; }",
    };
    expect(isExerciseValid(validateExercise(ex, files))).toBe(true);
  });

  it("accepte rule.file sans slash si la clé dans files utilise un slash", () => {
    const ex = getExerciseById("vue-ref-compteur")!;
    const patched = {
      ...ex,
      validation: [
        {
          type: "contains" as const,
          file: "src/App.vue",
          substring: "ref(",
        },
      ],
    };
    const files = getExerciseInitialFiles(ex);
    expect(isExerciseValid(validateExercise(patched, files))).toBe(true);
  });

  it("valide l’exercice Next.js Link /contact", () => {
    const ex = getExerciseById("next-lien-navigation")!;
    const base = getExerciseInitialFiles(ex);
    const files = {
      ...base,
      "/app/page.jsx": `import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Titre</h1>
      <Link href="/contact">Nous contacter</Link>
    </main>
  );
}
`,
    };
    expect(isExerciseValid(validateExercise(ex, files))).toBe(true);
  });

  it("valide l’exercice HTML landmark main", () => {
    const ex = getExerciseById("html-landmark-main")!;
    const base = getExerciseInitialFiles(ex);
    const ok = {
      ...base,
      "/index.html": `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /><title>x</title><link rel="stylesheet" href="style.css" /></head>
<body><main><h1>Hello HTML</h1><p>OK</p></main></body>
</html>`,
    };
    expect(isExerciseValid(validateExercise(ex, ok))).toBe(true);
  });

  it("valide les critères « matches » (regex) sur l’exercice e-mail", () => {
    const ex = getExerciseById("js-regex-email")!;
    const base = getExerciseInitialFiles(ex);
    const okFiles = {
      ...base,
      "/utils.js": `export function isEmail(str) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(str);
}
`,
    };
    expect(isExerciseValid(validateExercise(ex, okFiles))).toBe(true);

    const badFiles = {
      ...base,
      "/utils.js": "export function isEmail(str) {\n  return false;\n}\n",
    };
    expect(isExerciseValid(validateExercise(ex, badFiles))).toBe(false);
  });
});
