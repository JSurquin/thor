"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  RotateCcwIcon,
  DownloadIcon,
  Code2Icon,
  LayoutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATES, type TemplateId } from "@/lib/templates";
import JSZip from "jszip";
import { toast } from "sonner";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-muted/30 text-muted-foreground">Chargement de l’éditeur…</div> }
);

const SandpackRoot = dynamic(
  () =>
    import("@codesandbox/sandpack-react").then((mod) => ({
      default: mod.SandpackProvider,
    })),
  { ssr: false }
);
const SandpackPreview = dynamic(
  () =>
    import("@codesandbox/sandpack-react").then((mod) => ({
      default: mod.SandpackPreview,
    })),
  { ssr: false }
);

const SANDPACK_TEMPLATE_MAP: Record<TemplateId, "react" | "vanilla"> = {
  react: "react",
  next: "vanilla",
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

function usePlaygroundState(initialTemplateId: TemplateId) {
  const [templateId, setTemplateId] = useState<TemplateId>(initialTemplateId);
  const template = TEMPLATES[templateId];
  const [files, setFiles] = useState<Record<string, string>>(() => ({
    ...template.files,
  }));
  const [activeFile, setActiveFile] = useState(template.entryFile);

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

  const filePaths = useMemo(() => Object.keys(files).sort(), [files]);

  return {
    templateId,
    template,
    files,
    activeFile,
    setActiveFile,
    setTemplate,
    updateFile,
    reset,
    filePaths,
  };
}

function getSandpackTemplate(templateId: TemplateId): "react" | "vanilla" {
  return SANDPACK_TEMPLATE_MAP[templateId] ?? "vanilla";
}

function filesToSandpackFormat(files: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    const key = path.startsWith("/") ? path.slice(1) : path;
    out[key] = content;
  }
  return out;
}

export default function PlaygroundPage() {
  const [initialTemplate] = useState<TemplateId>("react");
  const state = usePlaygroundState(initialTemplate);
  const {
    templateId,
    template,
    files,
    activeFile,
    setActiveFile,
    setTemplate,
    updateFile,
    reset,
    filePaths,
  } = state;

  const sandpackTemplate = getSandpackTemplate(templateId);
  const sandpackFiles = useMemo(
    () => filesToSandpackFormat(files),
    [files]
  );
  const hasPreview = templateId === "react";

  const handleExportZip = useCallback(() => {
    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      const cleanPath = path.startsWith("/") ? path.slice(1) : path;
      zip.file(cleanPath, content);
    }
    zip.generateAsync({ type: "blob" }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `thor-playground-${templateId}-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export ZIP téléchargé");
    });
  }, [files, templateId]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shrink-0">
        <div className="mx-auto max-w-[1920px] flex items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:opacity-90"
          >
            <div className="size-9 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
              <Code2Icon className="size-5 text-primary" />
            </div>
            <div>
              <span className="font-semibold tracking-tight">lab.andromed</span>
              <span className="text-muted-foreground font-normal text-sm ml-1.5 hidden sm:inline">
                — Playground
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={templateId}
              onValueChange={(v) => setTemplate(v as TemplateId)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
                  <SelectItem key={id} value={id}>
                    <span className="flex items-center gap-2">
                      <span>{TEMPLATES[id].icon}</span>
                      {TEMPLATES[id].name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
              <RotateCcwIcon className="size-4" />
              Reset
            </Button>
            <Button size="sm" onClick={handleExportZip} className="gap-1.5">
              <DownloadIcon className="size-4" />
              Export ZIP
            </Button>
          </div>
        </div>
      </header>

      {/* Editor + Preview */}
      <div className="flex-1 flex min-h-0">
        {/* Left: file tabs + Monaco */}
        <div className="flex flex-col w-full lg:w-1/2 min-w-0 border-r border-border/40">
          <div className="border-b border-border/40 px-2 py-1 flex items-center gap-1 overflow-x-auto shrink-0">
            {filePaths.map((path) => (
              <button
                key={path}
                type="button"
                onClick={() => setActiveFile(path)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFile === path
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {path.replace(/^\//, "")}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-[320px] overflow-hidden">
            <MonacoEditor
              height="100%"
              language={getLanguage(activeFile)}
              value={files[activeFile] ?? ""}
              onChange={(value) => updateFile(activeFile, value ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        {/* Right: Sandpack preview or placeholder */}
        <div className="flex flex-col w-full lg:w-1/2 min-w-0 bg-muted/20">
          <div className="px-3 py-2 border-b border-border/40 flex items-center gap-2 shrink-0">
            <LayoutIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Aperçu
            </span>
          </div>
          <div className="flex-1 min-h-[320px] overflow-auto p-4">
            {hasPreview ? (
              <SandpackRoot
                template={sandpackTemplate}
                files={sandpackFiles}
                theme="dark"
                options={{
                  recompileMode: "delayed",
                  recompileDelay: 400,
                }}
              >
                <SandpackPreview
                  style={{ minHeight: 360, borderRadius: 8 }}
                  showOpenInCodeSandbox={false}
                />
              </SandpackRoot>
            ) : (
              <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-border bg-background/50 text-center p-8">
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">
                    {template.icon} {template.name}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Exportez le projet en ZIP et exécutez-le en local selon le
                    README du template.
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Utilisez l’export ZIP pour récupérer le code.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getLanguage(path: string): string {
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
  if (path.endsWith(".gitconfig.example") || path.includes(".git")) return "ini";
  return "plaintext";
}
