import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { PlaygroundShareHydrate } from "@/lib/share-state";
import { TEMPLATES, type TemplateId } from "@/lib/templates";

export type PlaygroundHydrate = PlaygroundShareHydrate;

/** Templates Sandpack pour l’aperçu live (les autres restent vanilla / ZIP local). */
export const SANDPACK_TEMPLATE_MAP: Record<
  TemplateId,
  "react" | "vanilla" | "vue"
> = {
  react: "react",
  /** App Router simulé : mêmes fichiers que Next, bundler React Sandpack (Next réel non supporté dans l’iframe). */
  next: "react",
  vue: "vue",
  docker: "vanilla",
  rails: "vanilla",
  ansible: "vanilla",
  python: "vanilla",
  git: "vanilla",
  bash: "vanilla",
  go: "vanilla",
  node: "vanilla",
  terraform: "vanilla",
  kubernetes: "vanilla",
  sql: "vanilla",
  nginx: "vanilla",
  makefile: "vanilla",
  html: "vanilla",
  rust: "vanilla",
  typescript: "vanilla",
  php: "vanilla",
};

export function getSandpackTemplate(
  templateId: TemplateId
): "react" | "vanilla" | "vue" {
  return SANDPACK_TEMPLATE_MAP[templateId] ?? "vanilla";
}

/** Aperçu Sandpack (React, Next.js, Vue). Les autres templates affichent HTML statique ou message d’export. */
export function templateSupportsSandpackPreview(templateId: TemplateId): boolean {
  return SANDPACK_TEMPLATE_MAP[templateId] !== "vanilla";
}

export function filesToSandpackFormat(
  files: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    const key = path.startsWith("/") ? path.slice(1) : path;
    out[key] = content;
  }
  return out;
}

export function getLanguage(path: string): string {
  if (path.endsWith(".vue")) return "html";
  if (path.endsWith(".tsx") || path.endsWith(".jsx")) return "javascript";
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  if (path.endsWith(".rb")) return "ruby";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".py")) return "python";
  if (path.endsWith(".tf")) return "hcl";
  if (path.endsWith(".go")) return "go";
  if (path.endsWith(".rs")) return "rust";
  if (path.endsWith(".sh")) return "shell";
  if (path.endsWith(".toml")) return "toml";
  if (path.endsWith(".sql")) return "sql";
  if (path.endsWith(".conf")) return "nginx";
  if (path.endsWith(".ini")) return "ini";
  if (path.endsWith(".php")) return "php";
  if (path.includes("Makefile") || path.endsWith("Makefile")) return "makefile";
  if (path.endsWith(".gitconfig.example") || path.includes(".git"))
    return "ini";
  return "plaintext";
}

/**
 * Build a full HTML document for the HTML template preview (iframe srcdoc).
 * Inlines the CSS from style.css by replacing the link tag.
 */
function injectCssInHead(html: string, css: string): string {
  const block = `<style>${css}</style>`;
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${block}</head>`);
  }
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (open) => `${open}${block}`);
  }
  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html[^>]*>/i, (open) => `${open}<head>${block}</head>`);
  }
  return `<!DOCTYPE html><html><head>${block}</head><body>${html}</body></html>`;
}

export function buildHtmlPreview(files: Record<string, string>): string {
  const html = files["/index.html"] ?? files["index.html"] ?? "";
  const css = files["/style.css"] ?? files["style.css"] ?? "";
  if (!html)
    return "<!DOCTYPE html><html><body><p>Aucun index.html</p></body></html>";
  const linkRegex = /<link[^>]*href=["']style\.css["'][^>]*\s*\/?>/i;
  let withStyle = html;
  if (css) {
    if (linkRegex.test(html)) {
      withStyle = html.replace(linkRegex, `<style>${css}</style>`);
    } else {
      withStyle = injectCssInHead(html, css);
    }
  }
  return withStyle;
}

export function usePlaygroundState(
  initialTemplateId: TemplateId,
  hydrate?: PlaygroundShareHydrate | null
) {
  const [templateId, setTemplateId] = useState<TemplateId>(() =>
    hydrate != null ? hydrate.templateId : initialTemplateId
  );
  const template = TEMPLATES[templateId];
  const [files, setFiles] = useState<Record<string, string>>(() =>
    hydrate != null
      ? { ...hydrate.files }
      : { ...TEMPLATES[initialTemplateId].files }
  );
  const [selectedFile, setActiveFile] = useState(() =>
    hydrate != null
      ? hydrate.selectedFile
      : TEMPLATES[initialTemplateId].entryFile
  );

  const reset = useCallback(() => {
    const t = TEMPLATES[templateId];
    setFiles({ ...t.files });
    setActiveFile(t.entryFile);
    toast.success("Environnement réinitialisé");
  }, [templateId]);

  const setTemplate = useCallback((id: TemplateId) => {
    const t = TEMPLATES[id];
    setTemplateId(id);
    setFiles({ ...t.files });
    setActiveFile(t.entryFile);
  }, []);

  const updateFile = useCallback((path: string, content: string) => {
    setFiles((prev) => ({ ...prev, [path]: content }));
  }, []);

  /** Fusionne ou remplace les fichiers (ex. import ZIP). */
  const mergeImportedFiles = useCallback(
    (incoming: Record<string, string>, replaceAll?: boolean) => {
      if (replaceAll) {
        setFiles({ ...incoming });
        const paths = Object.keys(incoming).sort();
        if (paths.length > 0) setActiveFile(paths[0]!);
        return;
      }
      setFiles((prev) => ({ ...prev, ...incoming }));
    },
    []
  );

  const filePaths = useMemo(() => Object.keys(files).sort(), [files]);
  const activeFile = useMemo(() => {
    if (filePaths.length === 0) return selectedFile;
    if (filePaths.includes(selectedFile)) return selectedFile;
    return filePaths[0]!;
  }, [filePaths, selectedFile]);

  return {
    templateId,
    template,
    files,
    activeFile,
    setActiveFile,
    setTemplate,
    updateFile,
    mergeImportedFiles,
    reset,
    filePaths,
  };
}
