import { TEMPLATE_IDS, type TemplateId } from "@/lib/templates";

export const WORKSPACE_VERSION = 1 as const;

/** Taille max approx. (string JSON) pour éviter de saturer localStorage (~5 Mo selon navigateur). */
export const WORKSPACE_MAX_JSON_CHARS = 4_200_000;

export type PlaygroundPersistedV1 = {
  v: typeof WORKSPACE_VERSION;
  templateId: TemplateId;
  files: Record<string, string>;
  selectedFile: string;
  savedAt: number;
};

export type ExercisePersistedV1 = {
  v: typeof WORKSPACE_VERSION;
  exerciseId: string;
  files: Record<string, string>;
  selectedFile: string;
  savedAt: number;
};

const PLAYGROUND_KEY = "thor.workspace.playground.v1";

function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function readPlaygroundDraft(): PlaygroundPersistedV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLAYGROUND_KEY);
    if (!raw) return null;
    const parsed = safeJsonParse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Partial<PlaygroundPersistedV1>;
    if (p.v !== WORKSPACE_VERSION) return null;
    if (typeof p.templateId !== "string" || !isTemplateId(p.templateId))
      return null;
    if (!p.files || typeof p.files !== "object") return null;
    if (typeof p.selectedFile !== "string") return null;
    return {
      v: WORKSPACE_VERSION,
      templateId: p.templateId,
      files: p.files as Record<string, string>,
      selectedFile: p.selectedFile,
      savedAt: typeof p.savedAt === "number" ? p.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writePlaygroundDraft(
  data: Pick<
    PlaygroundPersistedV1,
    "templateId" | "files" | "selectedFile"
  > & { savedAt?: number }
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: PlaygroundPersistedV1 = {
      v: WORKSPACE_VERSION,
      templateId: data.templateId,
      files: data.files,
      selectedFile: data.selectedFile,
      savedAt: data.savedAt ?? Date.now(),
    };
    const s = JSON.stringify(payload);
    if (s.length > WORKSPACE_MAX_JSON_CHARS) return false;
    localStorage.setItem(PLAYGROUND_KEY, s);
    return true;
  } catch {
    return false;
  }
}

export function clearPlaygroundDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PLAYGROUND_KEY);
  } catch {
    /* ignore */
  }
}

function exerciseStorageKey(exerciseId: string): string {
  return `thor.workspace.exercise.v1:${exerciseId}`;
}

export function readExerciseDraft(
  exerciseId: string
): ExercisePersistedV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(exerciseStorageKey(exerciseId));
    if (!raw) return null;
    const parsed = safeJsonParse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const p = parsed as Partial<ExercisePersistedV1>;
    if (p.v !== WORKSPACE_VERSION) return null;
    if (typeof p.exerciseId !== "string" || p.exerciseId !== exerciseId)
      return null;
    if (!p.files || typeof p.files !== "object") return null;
    if (typeof p.selectedFile !== "string") return null;
    return {
      v: WORKSPACE_VERSION,
      exerciseId: p.exerciseId,
      files: p.files as Record<string, string>,
      selectedFile: p.selectedFile,
      savedAt: typeof p.savedAt === "number" ? p.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeExerciseDraft(
  data: Pick<
    ExercisePersistedV1,
    "exerciseId" | "files" | "selectedFile"
  > & { savedAt?: number }
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const payload: ExercisePersistedV1 = {
      v: WORKSPACE_VERSION,
      exerciseId: data.exerciseId,
      files: data.files,
      selectedFile: data.selectedFile,
      savedAt: data.savedAt ?? Date.now(),
    };
    const s = JSON.stringify(payload);
    if (s.length > WORKSPACE_MAX_JSON_CHARS) return false;
    localStorage.setItem(exerciseStorageKey(data.exerciseId), s);
    return true;
  } catch {
    return false;
  }
}

export function clearExerciseDraft(exerciseId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(exerciseStorageKey(exerciseId));
  } catch {
    /* ignore */
  }
}

export function formatSavedAt(
  savedAt: number,
  locale = "fr-FR"
): string {
  try {
    return new Date(savedAt).toLocaleString(locale, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}
