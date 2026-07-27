"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTheme } from "next-themes";
import JSZip from "jszip";
import {
  RotateCcwIcon,
  WifiOffIcon,
  Code2Icon,
  LayoutIcon,
  FileCodeIcon,
  ClipboardCopyIcon,
  Link2Icon,
  UploadIcon,
  KeyboardIcon,
  FolderTreeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TEMPLATES, TEMPLATE_IDS, type TemplateId } from "@/lib/templates";
import {
  getLanguage,
  getSandpackTemplate,
  filesToSandpackFormat,
  buildHtmlPreview,
  usePlaygroundState,
  templateSupportsSandpackPreview,
  type PlaygroundHydrate,
} from "@/lib/playground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfflineExportDialog } from "@/components/offline-export-dialog";
import { ResumeLocalDraftDialog } from "@/components/resume-local-draft-dialog";
import { ShortcutsHelpDialog } from "@/components/shortcuts-help-dialog";
import { PlaygroundFileTree } from "@/components/playground-file-tree";
import {
  readPlaygroundDraft,
  writePlaygroundDraft,
  clearPlaygroundDraft,
  formatSavedAt,
  type PlaygroundPersistedV1,
} from "@/lib/workspace-storage";
import {
  buildPlaygroundShareToken,
  buildShareUrl,
  parsePlaygroundShareToken,
} from "@/lib/share-state";
import { isSafeZipRelativePath } from "@/lib/export-zip";
import { useDocumentTitle } from "@/lib/hooks/use-document-title";
import { useEditorShortcuts } from "@/lib/hooks/use-editor-shortcuts";
import {
  useContainerHeight,
  useIsLargeScreen,
} from "@/lib/hooks/use-container-height";
import type { editor } from "monaco-editor";
import { toast } from "sonner";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-muted/30 text-muted-foreground">
        Chargement de l’éditeur…
      </div>
    ),
  }
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

type PlaygroundPanel = "editor" | "preview";

const TEMPLATE_PRIORITY: TemplateId[] = ["vue", "next", "react"];
const PLAYGROUND_TEMPLATE_ORDER: TemplateId[] = [
  ...TEMPLATE_PRIORITY,
  ...TEMPLATE_IDS.filter((id) => !TEMPLATE_PRIORITY.includes(id)),
];

type PlaygroundView =
  | { phase: "loading" }
  | { phase: "prompt"; draft: PlaygroundPersistedV1 }
  | { phase: "run"; hydrate: PlaygroundHydrate | null };

function PlaygroundWorkspace({ hydrate }: { hydrate: PlaygroundHydrate | null }) {
  const { resolvedTheme } = useTheme();
  const [initialTemplate] = useState<TemplateId>("react");
  const [mobilePanel, setMobilePanel] = useState<PlaygroundPanel>("editor");
  const [offlineExportOpen, setOfflineExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileFileTreeOpen, setMobileFileTreeOpen] = useState(false);
  const isLargeScreen = useIsLargeScreen();
  const { ref: editorContainerRef, height: editorHeight } =
    useContainerHeight(320);
  const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const state = usePlaygroundState(initialTemplate, hydrate);
  const isDark = (resolvedTheme ?? "dark") === "dark";
  const {
    templateId,
    template,
    files,
    activeFile,
    setActiveFile,
    setTemplate,
    updateFile,
    mergeImportedFiles,
    addFile,
    removeFile,
    reset,
    filePaths,
  } = state;

  useDocumentTitle(`Playground — ${template.name} · lab.andromed`);

  const shouldRenderEditor = isLargeScreen || mobilePanel === "editor";

  useEffect(() => {
    if (!shouldRenderEditor) return;
    const id = window.requestAnimationFrame(() => {
      monacoRef.current?.layout();
    });
    return () => window.cancelAnimationFrame(id);
  }, [shouldRenderEditor, activeFile, mobilePanel, editorHeight]);

  const copyActiveFile = useCallback(async () => {
    const text = files[activeFile] ?? "";
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`« ${activeFile.replace(/^\//, "")} » copié`);
    } catch {
      toast.error("Copie impossible");
    }
  }, [files, activeFile]);

  useEditorShortcuts({
    onCopyFile: () => {
      void copyActiveFile();
    },
    onExportOffline: () => setOfflineExportOpen(true),
    onShowHelp: () => setHelpOpen(true),
  });

  useEffect(() => {
    const t = window.setTimeout(() => {
      const ok = writePlaygroundDraft({
        templateId,
        files,
        selectedFile: activeFile,
      });
      if (!ok) {
        toast.message(
          "Brouillon non sauvegardé (trop volumineux pour le stockage local)",
          { duration: 4_000 }
        );
      }
    }, 650);
    return () => window.clearTimeout(t);
  }, [templateId, files, activeFile]);

  const copyShareLink = useCallback(async () => {
    const token = await buildPlaygroundShareToken(templateId, files, activeFile);
    if (!token) {
      toast.error("État trop volumineux pour un lien (réduisez les fichiers)");
      return;
    }
    const url = buildShareUrl("/playground", token);
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien de partage copié");
    } catch {
      toast.error("Copie du lien impossible");
    }
  }, [templateId, files, activeFile]);

  const onZipInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      try {
        const zip = await JSZip.loadAsync(file);
        const out: Record<string, string> = {};
        for (const [relPath, entry] of Object.entries(zip.files)) {
          if (entry.dir) continue;
          const clean = relPath.replace(/^\//, "");
          if (!isSafeZipRelativePath(clean)) continue;
          const raw = await entry.async("string");
          const key = relPath.startsWith("/") ? relPath : `/${clean}`;
          out[key] = raw;
        }
        if (Object.keys(out).length === 0) {
          toast.error("Aucun fichier importé (ZIP vide ou chemins refusés)");
          return;
        }
        mergeImportedFiles(out);
        toast.success(`${Object.keys(out).length} fichier(s) fusionné(s)`);
      } catch {
        toast.error("Import ZIP impossible");
      }
    },
    [mergeImportedFiles]
  );

  const sandpackTemplate = getSandpackTemplate(templateId);
  const sandpackFiles = useMemo(
    () => filesToSandpackFormat(files),
    [files]
  );
  const hasSandpackPreview = templateSupportsSandpackPreview(templateId);
  const hasHtmlPreview = templateId === "html";

  const previewContent = useMemo(() => {
    if (hasSandpackPreview) {
      return (
        <SandpackRoot
          template={sandpackTemplate}
          files={sandpackFiles}
          theme={isDark ? "dark" : "light"}
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
      );
    }
    if (hasHtmlPreview) {
      return (
        <iframe
          title="Aperçu HTML"
          srcDoc={buildHtmlPreview(files)}
          className="w-full min-h-[360px] rounded-lg border border-border bg-white"
          sandbox="allow-scripts"
        />
      );
    }
    return (
      <div className="h-full flex items-center justify-center rounded-lg border border-dashed border-border bg-background/50 text-center p-8">
        <div>
          <p className="text-lg font-medium text-foreground mb-1">
            {template.icon} {template.name}
          </p>
          <p className="text-sm text-muted-foreground max-w-sm">
            Exportez le projet en ZIP et exécutez-le en local selon le README du
            template.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Utilisez l’export ZIP pour récupérer le code.
          </p>
        </div>
      </div>
    );
  }, [
    hasSandpackPreview,
    hasHtmlPreview,
    sandpackTemplate,
    sandpackFiles,
    isDark,
    files,
    template.icon,
    template.name,
  ]);

  const mobileTabs: { id: PlaygroundPanel; label: string; icon: React.ReactNode }[] = [
    { id: "editor", label: "Code", icon: <FileCodeIcon className="size-4" /> },
    { id: "preview", label: "Aperçu", icon: <LayoutIcon className="size-4" /> },
  ];

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-background">
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip"
        className="hidden"
        onChange={onZipInputChange}
      />
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50 shrink-0 safe-area-inset-top">
        <div className="mx-auto max-w-[1920px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:opacity-90 min-w-0 shrink-0"
          >
            <div className="size-9 rounded-lg bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 shrink-0">
              <Code2Icon className="size-5 text-primary" />
            </div>
            <span className="font-semibold tracking-tight truncate">lab.andromed</span>
            <span className="text-muted-foreground text-sm hidden sm:inline shrink-0">— Playground</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-x-auto flex-nowrap sm:flex-wrap sm:overflow-visible min-h-[44px] -mx-3 px-3 sm:mx-0 sm:px-0 pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0">
            <Select
              value={templateId}
              onValueChange={(v) => setTemplate(v as TemplateId)}
            >
              <SelectTrigger className="w-[120px] sm:w-[140px] min-h-[40px] touch-manipulation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAYGROUND_TEMPLATE_ORDER.map((id) => (
                  <SelectItem key={id} value={id}>
                    <span className="flex items-center gap-2">
                      <span>{TEMPLATES[id].icon}</span>
                      {TEMPLATES[id].name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHelpOpen(true)}
              className="gap-1.5 min-h-[40px] touch-manipulation"
              aria-label="Raccourcis clavier"
            >
              <KeyboardIcon className="size-4" />
              <span className="hidden sm:inline">Aide</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyShareLink()}
              className="gap-1.5 min-h-[40px] touch-manipulation"
              title="Copier un lien avec l’état actuel"
            >
              <Link2Icon className="size-4" />
              <span className="hidden lg:inline">Lien</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => zipInputRef.current?.click()}
              className="gap-1.5 min-h-[40px] touch-manipulation"
              title="Importer un ZIP (fusion dans les fichiers)"
            >
              <UploadIcon className="size-4" />
              <span className="hidden lg:inline">ZIP</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyActiveFile()}
              className="gap-1.5 min-h-[40px] touch-manipulation"
              aria-label="Copier le fichier ouvert"
              data-testid="playground-copy-file"
            >
              <ClipboardCopyIcon className="size-4" />
              <span className="hidden sm:inline">Copier</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              className="gap-1.5 min-h-[40px] touch-manipulation"
            >
              <RotateCcwIcon className="size-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setOfflineExportOpen(true)}
              className="gap-1.5 min-h-[40px] touch-manipulation"
              data-testid="playground-export-offline"
            >
              <WifiOffIcon className="size-4" />
              <span className="hidden sm:inline">Hors ligne</span>
            </Button>
          </div>
        </div>

        <div className="flex lg:hidden border-t border-border/40 bg-muted/20">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobilePanel(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors touch-manipulation min-h-[48px] ${
                mobilePanel === tab.id
                  ? "bg-background text-primary border-b-2 border-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div
          className={`flex flex-col w-full lg:w-1/2 min-w-0 border-r border-border/40 ${
            mobilePanel !== "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="lg:hidden border-b border-border/40 px-2 py-2 shrink-0 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2 min-h-[40px] touch-manipulation"
              onClick={() => setMobileFileTreeOpen(true)}
            >
              <FolderTreeIcon className="size-4" />
              Fichiers
            </Button>
            <span className="text-xs text-muted-foreground truncate flex-1 min-w-0" title={activeFile}>
              {activeFile.replace(/^\//, "")}
            </span>
          </div>

          <div className="flex flex-1 flex-col lg:flex-row min-h-0 min-h-[260px] sm:min-h-[300px] lg:min-h-[400px]">
            <aside className="hidden lg:flex w-[220px] xl:w-56 shrink-0 flex-col border-b lg:border-b-0 lg:border-r border-border/40 bg-muted/10">
              <PlaygroundFileTree
                filePaths={filePaths}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                onAddFile={addFile}
                onRemoveFile={removeFile}
                className="flex-1 min-h-0"
              />
            </aside>
            <div
              ref={editorContainerRef}
              className="relative flex-1 min-w-0 min-h-[240px] flex flex-col overflow-hidden"
            >
            {shouldRenderEditor ? (
            <MonacoEditor
              height={editorHeight}
              language={getLanguage(activeFile)}
              value={files[activeFile] ?? ""}
              onChange={(value) => updateFile(activeFile, value ?? "")}
              onMount={(instance) => {
                monacoRef.current = instance;
                window.requestAnimationFrame(() => instance.layout());
              }}
              theme={isDark ? "vs-dark" : "vs"}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/30 text-muted-foreground text-sm">
                Chargement de l’éditeur…
              </div>
            )}
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col w-full lg:w-1/2 min-w-0 bg-muted/20 ${
            mobilePanel !== "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="px-3 py-2 border-b border-border/40 flex items-center gap-2 shrink-0 min-h-[44px]">
            <LayoutIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Aperçu</span>
          </div>
          <div className="flex-1 min-h-[280px] sm:min-h-[320px] overflow-auto p-3 sm:p-4">
            {previewContent}
          </div>
        </div>
      </div>

      <OfflineExportDialog
        variant="playground"
        open={offlineExportOpen}
        onOpenChange={setOfflineExportOpen}
        files={files}
        templateId={templateId}
      />

      <ShortcutsHelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        title="Raccourcis — Playground"
        shortcuts={[
          { keys: "? ou Ctrl+/", label: "Afficher cette aide" },
          { keys: "⌘/Ctrl+Shift+C", label: "Copier le fichier ouvert" },
          { keys: "⌘/Ctrl+Shift+S", label: "Ouvrir l’export hors ligne" },
        ]}
      />

      <Dialog open={mobileFileTreeOpen} onOpenChange={setMobileFileTreeOpen}>
        <DialogContent className="max-h-[85vh] flex flex-col gap-0 p-0 sm:max-w-lg overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-border/40 shrink-0 text-left">
            <DialogTitle>Fichiers du projet</DialogTitle>
          </DialogHeader>
          <div className="min-h-[200px] max-h-[70vh] flex flex-col overflow-hidden">
            <PlaygroundFileTree
              filePaths={filePaths}
              activeFile={activeFile}
              onSelectFile={(path) => {
                setActiveFile(path);
                setMobileFileTreeOpen(false);
              }}
              onAddFile={addFile}
              onRemoveFile={removeFile}
              className="flex-1 min-h-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PlaygroundPage() {
  const [view, setView] = useState<PlaygroundView>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const params = new URLSearchParams(window.location.search);
      const tok = params.get("s");
      if (tok) {
        const h = await parsePlaygroundShareToken(tok);
        if (!cancelled && h) {
          window.history.replaceState({}, "", "/playground");
          setView({ phase: "run", hydrate: h });
          return;
        }
      }
      const d = readPlaygroundDraft();
      if (d) setView({ phase: "prompt", draft: d });
      else setView({ phase: "run", hydrate: null });
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (view.phase === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Spinner className="size-10 text-primary" />
        <p className="text-sm text-muted-foreground">Chargement du playground…</p>
      </div>
    );
  }

  if (view.phase === "prompt") {
    const { draft } = view;
    return (
      <ResumeLocalDraftDialog
        open
        title="Reprendre votre brouillon ?"
        description={`Une sauvegarde locale existe (${formatSavedAt(draft.savedAt)}). Reprendre le code et les fichiers enregistrés sur cet appareil, ou repartir du template par défaut.`}
        onResume={() =>
          setView({
            phase: "run",
            hydrate: {
              templateId: draft.templateId,
              files: draft.files,
              selectedFile: draft.selectedFile,
            },
          })
        }
        onStartFresh={() => {
          clearPlaygroundDraft();
          setView({ phase: "run", hydrate: null });
        }}
      />
    );
  }

  return <PlaygroundWorkspace hydrate={view.hydrate} />;
}
