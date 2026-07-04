"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Code2Icon,
  FileTextIcon,
  LayoutIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  ChevronLeftIcon,
  WifiOffIcon,
  ClipboardCopyIcon,
  Link2Icon,
  KeyboardIcon,
  LightbulbIcon,
  BookOpenCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { Exercise } from "@/lib/exercises";
import {
  getExerciseById,
  getExerciseInitialFiles,
  getExerciseEntryFile,
  validateExercise,
  isExerciseValid,
} from "@/lib/exercises";
import { OfflineExportDialog } from "@/components/offline-export-dialog";
import { ResumeLocalDraftDialog } from "@/components/resume-local-draft-dialog";
import {
  readExerciseDraft,
  writeExerciseDraft,
  clearExerciseDraft,
  formatSavedAt,
  type ExercisePersistedV1,
} from "@/lib/workspace-storage";
import {
  getLanguage,
  getSandpackTemplate,
  filesToSandpackFormat,
  buildHtmlPreview,
  templateSupportsSandpackPreview,
} from "@/lib/playground";
import type { TemplateId } from "@/lib/templates";
import {
  parseExerciseShareToken,
  buildExerciseShareToken,
  buildShareUrl,
} from "@/lib/share-state";
import { useDocumentTitle } from "@/lib/hooks/use-document-title";
import { useEditorShortcuts } from "@/lib/hooks/use-editor-shortcuts";
import { ShortcutsHelpDialog } from "@/components/shortcuts-help-dialog";
import { BashTerminalPreview } from "@/components/bash-terminal-preview";
import { markExerciseCompleted } from "@/lib/progress-storage";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { localizeExercise } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ExerciseCorrectionPanel } from "@/components/exercise-correction-panel";
import { ExerciseEditorLoading } from "@/components/exercise-editor-loading";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <ExerciseEditorLoading />,
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

type Panel = "instructions" | "editor" | "preview";

type ExerciseSeed = {
  files: Record<string, string>;
  selectedFile: string;
};

type ExerciseView =
  | { phase: "loading" }
  | { phase: "prompt"; draft: ExercisePersistedV1 }
  | { phase: "run"; seed: ExerciseSeed | null };

function ExerciseWorkspaceInner({
  exercise,
  seed,
}: {
  exercise: Exercise;
  seed: ExerciseSeed | null;
}) {
  const { locale, messages } = useLocale();
  const t = messages.exercise;
  const localized = useMemo(
    () => localizeExercise(exercise, locale),
    [exercise, locale]
  );
  const { resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? "dark") === "dark";

  const [mobilePanel, setMobilePanel] = useState<Panel>("instructions");
  const [offlineExportOpen, setOfflineExportOpen] = useState(false);
  const [files, setFiles] = useState(() =>
    seed ? { ...seed.files } : getExerciseInitialFiles(exercise)
  );
  const [selectedFile, setSelectedFile] = useState(
    () => seed?.selectedFile ?? getExerciseEntryFile(exercise)
  );
  const [validationResults, setValidationResults] = useState<
    import("@/lib/exercises").ValidationResult[] | null
  >(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionConfirmOpen, setSolutionConfirmOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);

  const instructionsRef = useRef<HTMLElement>(null);
  const editorRegionRef = useRef<HTMLElement>(null);
  const previewRegionRef = useRef<HTMLElement>(null);

  const filePaths = useMemo(() => Object.keys(files).sort(), [files]);
  const editorPath = useMemo(() => {
    if (filePaths.length === 0) return selectedFile;
    if (filePaths.includes(selectedFile)) return selectedFile;
    return filePaths[0]!;
  }, [filePaths, selectedFile]);

  useDocumentTitle(`${localized.title} — Exercices · lab.andromed`);

  const copyCurrentFile = useCallback(async () => {
    const text = files[editorPath] ?? "";
    const name = editorPath.replace(/^\//, "");
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copyFileSuccess(name));
    } catch {
      toast.error(t.copyFileError);
    }
  }, [files, editorPath, t]);

  const copyShareLink = useCallback(async () => {
    const tok = await buildExerciseShareToken(exercise.id, files, editorPath);
    if (!tok) {
      toast.error(t.shareTooLong);
      return;
    }
    const url = buildShareUrl(`/exercices/${exercise.id}`, tok);
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t.shareSuccess);
    } catch {
      toast.error(t.shareError);
    }
  }, [exercise.id, files, editorPath, t]);

  useEditorShortcuts({
    onCopyFile: () => {
      void copyCurrentFile();
    },
    onExportOffline: () => setOfflineExportOpen(true),
    onShowHelp: () => setHelpOpen(true),
    onFocusInstructions: () => {
      setMobilePanel("instructions");
      window.requestAnimationFrame(() =>
        instructionsRef.current?.focus({ preventScroll: false })
      );
    },
    onFocusEditor: () => {
      setMobilePanel("editor");
      window.requestAnimationFrame(() =>
        editorRegionRef.current?.focus({ preventScroll: false })
      );
    },
    onFocusPreview: () => {
      setMobilePanel("preview");
      window.requestAnimationFrame(() =>
        previewRegionRef.current?.focus({ preventScroll: false })
      );
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const ok = writeExerciseDraft({
        exerciseId: exercise.id,
        files,
        selectedFile: editorPath,
      });
      if (!ok) {
        toast.message(t.draftNotSaved, { duration: 4_000 });
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [exercise.id, files, editorPath, t.draftNotSaved]);

  const updateFile = useCallback((path: string, content: string) => {
    setFiles((prev) => ({ ...prev, [path]: content }));
    setValidationResults(null);
  }, []);

  const handleReset = useCallback(() => {
    clearExerciseDraft(exercise.id);
    setFiles(getExerciseInitialFiles(exercise));
    setSelectedFile(getExerciseEntryFile(exercise));
    setValidationResults(null);
    toast.success(t.resetSuccess);
  }, [exercise, t.resetSuccess]);

  const handleValidate = useCallback(() => {
    const results = validateExercise(exercise, files, locale);
    setValidationResults(results);
    if (isExerciseValid(results)) {
      markExerciseCompleted(exercise.id);
      toast.success(t.validateSuccess);
    } else {
      const firstFail = results.find((r) => !r.ok);
      toast.error(firstFail && !firstFail.ok ? firstFail.message : t.validateError);
    }
  }, [exercise, files, locale, t.validateSuccess, t.validateError]);

  const sandpackFiles = useMemo(() => filesToSandpackFormat(files), [files]);
  const hasSandpack = templateSupportsSandpackPreview(exercise.templateId as TemplateId);
  const hasHtmlPreview = exercise.templateId === "html";
  const hasBashPreview = exercise.templateId === "bash";
  const sandpackRuntimeTemplate = getSandpackTemplate(exercise.templateId as TemplateId);

  const previewContent = useMemo(() => {
    if (hasBashPreview) {
      return <BashTerminalPreview />;
    }
    if (hasSandpack) {
      return (
        <SandpackRoot
          template={sandpackRuntimeTemplate}
          files={sandpackFiles}
          theme={isDark ? "dark" : "light"}
          options={{ recompileMode: "delayed", recompileDelay: 400 }}
        >
          <SandpackPreview
            style={{ minHeight: 280, borderRadius: 8 }}
            showOpenInCodeSandbox={false}
          />
        </SandpackRoot>
      );
    }
    if (hasHtmlPreview) {
      return (
        <iframe
          title="Aperçu"
          srcDoc={buildHtmlPreview(files)}
          className="w-full min-h-[280px] rounded-lg border border-border bg-white"
          sandbox="allow-scripts"
        />
      );
    }
    return (
      <div className="min-h-[280px] flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
        {t.noPreview}
      </div>
    );
  }, [hasBashPreview, hasSandpack, hasHtmlPreview, sandpackFiles, sandpackRuntimeTemplate, files, isDark, t.noPreview]);

  const tabs: { id: Panel; label: string; icon: React.ReactNode }[] = [
    { id: "instructions", label: t.tabInstructions, icon: <FileTextIcon className="size-4" /> },
    { id: "editor", label: t.tabEditor, icon: <Code2Icon className="size-4" /> },
    { id: "preview", label: t.tabPreview, icon: <LayoutIcon className="size-4" /> },
  ];

  const hasSolution =
    Boolean(localized.solutionSummary?.trim()) ||
    Boolean(
      exercise.solutionFiles &&
        Object.keys(exercise.solutionFiles).length > 0
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50 shrink-0 safe-area-inset-top">
        <div className="mx-auto max-w-[1920px] flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 touch-manipulation" asChild>
              <Link href="/exercices" aria-label={t.backToList}>
                <ChevronLeftIcon className="size-5" />
              </Link>
            </Button>
            <h1 className="font-semibold text-foreground truncate text-sm sm:text-base">
              {localized.title}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-wrap justify-end">
            <LocaleSwitcher className="hidden sm:flex w-[130px] min-h-[36px] h-9" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHelpOpen(true)}
              className="gap-1.5 touch-manipulation"
              aria-label={t.help}
            >
              <KeyboardIcon className="size-4 sm:hidden" />
              <span className="hidden sm:inline">{t.help}</span>
            </Button>
            {localized.hint ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHintOpen(true)}
                className="gap-1.5 touch-manipulation"
              >
                <LightbulbIcon className="size-4" />
                <span className="hidden sm:inline">{t.hint}</span>
              </Button>
            ) : null}
            {hasSolution ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSolutionConfirmOpen(true)}
                className="gap-1.5 touch-manipulation"
              >
                <BookOpenCheckIcon className="size-4" />
                <span className="hidden sm:inline">{t.solution}</span>
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyShareLink()}
              className="gap-1.5 touch-manipulation"
              aria-label={t.share}
            >
              <Link2Icon className="size-4" />
              <span className="hidden sm:inline">{t.share}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyCurrentFile()}
              className="gap-1.5 touch-manipulation"
              aria-label={t.copy}
              data-testid="exercise-copy-file"
            >
              <ClipboardCopyIcon className="size-4" />
              <span className="hidden sm:inline">{t.copy}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5 touch-manipulation"
            >
              <RotateCcwIcon className="size-4" />
              <span className="hidden sm:inline">{t.reset}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOfflineExportOpen(true)}
              className="gap-1.5 touch-manipulation"
              data-testid="exercise-export-offline"
            >
              <WifiOffIcon className="size-4" />
              <span className="hidden sm:inline">{t.offline}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleValidate}
              className="gap-1.5 touch-manipulation"
            >
              <CheckCircle2Icon className="size-4" />
              <span className="hidden sm:inline">{t.validate}</span>
            </Button>
          </div>
        </div>

        <nav
          aria-label="Fil d'Ariane"
          className="hidden sm:block border-t border-border/40 bg-muted/10"
        >
          <ol className="mx-auto max-w-[1920px] flex flex-wrap items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs text-muted-foreground">
            <li>
              <Link
                href="/"
                className="hover:text-foreground underline-offset-2 hover:underline"
              >
                {t.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/exercices"
                className="hover:text-foreground underline-offset-2 hover:underline"
              >
                {t.exercisesBreadcrumb}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="min-w-0 truncate font-medium text-foreground">
              {localized.title}
            </li>
          </ol>
        </nav>

        <div className="flex lg:hidden border-t border-border/40 bg-muted/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobilePanel(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors touch-manipulation ${
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
        <aside
          ref={instructionsRef}
          tabIndex={-1}
          className={`flex flex-col border-b lg:border-b-0 lg:border-r border-border/40 bg-card/30 shrink-0 outline-none ${
            mobilePanel !== "instructions" ? "hidden lg:flex" : "flex"
          } lg:w-80 xl:w-96`}
        >
          <div className="p-3 sm:p-4 border-b border-border/40 shrink-0">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileTextIcon className="size-4" />
              {t.instructionsHeading}
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-3 sm:p-4 min-h-[200px] lg:min-h-0">
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              {localized.instructions.split("\n").map((line, i) => (
                <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed mb-2 last:mb-0">
                  {line.startsWith("##") ? (
                    <strong className="block mt-3 mb-1 text-foreground">{line.replace(/^#+\s*/, "")}</strong>
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        </aside>

        <section
          ref={editorRegionRef}
          tabIndex={-1}
          className={`flex flex-col min-w-0 flex-1 outline-none ${
            mobilePanel !== "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-border/40 px-2 py-1 flex items-center gap-1 overflow-x-auto shrink-0 min-h-[44px]">
            {filePaths.map((path) => (
              <button
                key={path}
                type="button"
                onClick={() => setSelectedFile(path)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors touch-manipulation min-h-[40px] ${
                  editorPath === path
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {path.replace(/^\//, "")}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] overflow-hidden">
            <MonacoEditor
              height="100%"
              language={getLanguage(editorPath)}
              value={files[editorPath] ?? ""}
              onChange={(value) => updateFile(editorPath, value ?? "")}
              theme={isDark ? "vs-dark" : "vs"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>
        </section>

        <section
          ref={previewRegionRef}
          tabIndex={-1}
          className={`flex flex-col min-w-0 flex-1 bg-muted/20 outline-none ${
            mobilePanel !== "preview" ? "hidden lg:flex" : "flex"
          } lg:max-w-[50%]`}
        >
          <div className="px-3 py-2 border-b border-border/40 flex items-center gap-2 shrink-0 min-h-[44px]">
            <LayoutIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{t.previewHeading}</span>
          </div>
          <div className="flex-1 overflow-auto p-3 sm:p-4 min-h-[240px] sm:min-h-[280px]">
            {previewContent}
          </div>
        </section>
      </div>

      {validationResults ? (
        <ExerciseCorrectionPanel
          results={validationResults}
          labels={{
            title: t.correctionTitle,
            progress: t.correctionProgress,
            allPassed: t.correctionAllPassed,
            someFailed: t.correctionSomeFailed,
          }}
        />
      ) : null}

      <OfflineExportDialog
        variant="exercise"
        open={offlineExportOpen}
        onOpenChange={setOfflineExportOpen}
        files={files}
        exerciseId={exercise.id}
      />

      <ShortcutsHelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        title="Raccourcis — Exercice"
        shortcuts={[
          { keys: "? ou Ctrl+/", label: "Afficher cette aide" },
          { keys: "⌘/Ctrl+Shift+C", label: "Copier le fichier ouvert" },
          { keys: "⌘/Ctrl+Shift+S", label: "Ouvrir l’export hors ligne" },
          { keys: "⌘/Ctrl+I", label: "Focus énoncé" },
          { keys: "⌘/Ctrl+E", label: "Focus éditeur" },
          { keys: "⌘/Ctrl+P", label: "Focus aperçu" },
        ]}
      />

      {localized.hint ? (
        <Dialog open={hintOpen} onOpenChange={setHintOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t.hintDialogTitle}</DialogTitle>
              <DialogDescription className="sr-only">
                {t.hintDialogDescription}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm whitespace-pre-wrap text-foreground">
              {localized.hint}
            </p>
          </DialogContent>
        </Dialog>
      ) : null}

      {hasSolution ? (
        <AlertDialog
          open={solutionConfirmOpen}
          onOpenChange={setSolutionConfirmOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t.solutionConfirmTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t.solutionConfirmDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{messages.exercises.cancel}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setSolutionOpen(true);
                }}
              >
                {t.solutionConfirmShow}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      {hasSolution ? (
        <Dialog open={solutionOpen} onOpenChange={setSolutionOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.solutionDialogTitle}</DialogTitle>
              <DialogDescription className="sr-only">
                {t.solutionDialogDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              {localized.solutionSummary ? (
                <p className="whitespace-pre-wrap text-foreground">
                  {localized.solutionSummary}
                </p>
              ) : null}
              {exercise.solutionFiles &&
              Object.keys(exercise.solutionFiles).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(exercise.solutionFiles).map(([path, src]) => (
                    <div key={path}>
                      <p className="font-mono text-xs text-muted-foreground mb-1">
                        {path.replace(/^\//, "")}
                      </p>
                      <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto border border-border/40">
                        {src}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

function ExerciseWithPersistence({ exercise }: { exercise: Exercise }) {
  const { messages } = useLocale();
  const t = messages.exercise;
  const [view, setView] = useState<ExerciseView>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const params = new URLSearchParams(window.location.search);
      const tok = params.get("s");
      if (tok) {
        const shared = await parseExerciseShareToken(tok, exercise.id);
        if (!cancelled && shared) {
          window.history.replaceState(
            {},
            "",
            `/exercices/${encodeURIComponent(exercise.id)}`
          );
          setView({
            phase: "run",
            seed: { files: shared.files, selectedFile: shared.selectedFile },
          });
          return;
        }
      }
      const d = readExerciseDraft(exercise.id);
      if (d) setView({ phase: "prompt", draft: d });
      else setView({ phase: "run", seed: null });
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [exercise.id]);

  if (view.phase === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Spinner className="size-10 text-primary" />
        <p className="text-sm text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  if (view.phase === "prompt") {
    const { draft } = view;
    return (
      <ResumeLocalDraftDialog
        open
        title={t.resumeDraftTitle}
        description={t.resumeDraftDescription(formatSavedAt(draft.savedAt))}
        freshLabel={t.resumeDraftFresh}
        onResume={() =>
          setView({
            phase: "run",
            seed: { files: draft.files, selectedFile: draft.selectedFile },
          })
        }
        onStartFresh={() => {
          clearExerciseDraft(exercise.id);
          setView({ phase: "run", seed: null });
        }}
      />
    );
  }

  return <ExerciseWorkspaceInner exercise={exercise} seed={view.seed} />;
}

export default function ExercisePage() {
  const params = useParams();
  const { messages } = useLocale();
  const t = messages.exercise;
  const id = typeof params.id === "string" ? params.id : "";
  const exercise = useMemo(() => getExerciseById(id), [id]);

  if (!exercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-background">
        <p className="text-muted-foreground">{t.notFound}</p>
        <Button asChild>
          <Link href="/exercices">{t.backToExercises}</Link>
        </Button>
      </div>
    );
  }

  return <ExerciseWithPersistence key={exercise.id} exercise={exercise} />;
}
