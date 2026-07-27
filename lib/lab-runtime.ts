/**
 * Abstraction pour les environnements d'exercices (simulé navigateur vs VM/conteneur cloud).
 * Prépare l'intégration future Azure/AWS facturée à la minute sans casser le mode actuel.
 */

import type { Exercise, ExerciseRuntimeConfig } from "./types";
import type { TemplateId } from "./templates";

export type LabProvider = "azure" | "aws";

export type LabSessionStatus =
  | "pending"
  | "provisioning"
  | "ready"
  | "stopped"
  | "error";

export interface LabSession {
  id: string;
  exerciseId: string;
  provider: LabProvider;
  image: string;
  status: LabSessionStatus;
  /** URL WebSocket ou terminal web (xterm.js, ttyd, etc.) — renseigné quand status=ready */
  terminalUrl?: string;
  createdAt: string;
  expiresAt: string;
  /** Durée max facturable (minutes) */
  maxMinutes: number;
  /** Coût estimé USD/minute pour affichage élève */
  estimatedUsdPerMinute: number;
}

export interface ResolvedExerciseRuntime extends ExerciseRuntimeConfig {
  effectiveKind: "simulated" | "remote";
  provider: LabProvider;
  image: string;
  maxMinutes: number;
}

/** Estimations indicatives (USD/min) — B-series Azure / t4g.micro AWS, arrondi conservateur. */
export const LAB_PROVIDER_ESTIMATES: Record<
  LabProvider,
  { usdPerMinute: number; label: string }
> = {
  azure: { usdPerMinute: 0.008, label: "Azure (B1s)" },
  aws: { usdPerMinute: 0.007, label: "AWS (t4g.micro)" },
};

const DEFAULT_MAX_MINUTES = 45;

const TEMPLATE_DEFAULT_IMAGES: Partial<Record<TemplateId, string>> = {
  bash: "ubuntu-22.04-minimal",
  docker: "docker-in-docker",
  kubernetes: "kind-node",
  ansible: "ubuntu-22.04-ansible",
  terraform: "ubuntu-22.04-terraform",
};

const REMOTE_CAPABLE_TEMPLATES = new Set<TemplateId>([
  "bash",
  "docker",
  "kubernetes",
  "ansible",
  "terraform",
]);

export function isLabRuntimeEnabled(): boolean {
  return (
    process.env.LAB_RUNTIME_ENABLED === "true" ||
    process.env.NEXT_PUBLIC_LAB_RUNTIME_ENABLED === "true"
  );
}

export function getDefaultLabProvider(): LabProvider {
  const raw = (
    process.env.LAB_DEFAULT_PROVIDER ??
    process.env.NEXT_PUBLIC_LAB_DEFAULT_PROVIDER
  )?.toLowerCase();
  return raw === "aws" ? "aws" : "azure";
}

function defaultImageForTemplate(templateId: TemplateId | string): string {
  return TEMPLATE_DEFAULT_IMAGES[templateId as TemplateId] ?? "ubuntu-22.04-minimal";
}

/** Résout le mode d'exécution effectif pour un exercice (simulé par défaut). */
export function resolveExerciseRuntime(exercise: Exercise): ResolvedExerciseRuntime {
  const provider = exercise.runtime?.provider ?? getDefaultLabProvider();
  const image =
    exercise.runtime?.image ?? defaultImageForTemplate(exercise.templateId);
  const maxMinutes = exercise.runtime?.maxMinutes ?? DEFAULT_MAX_MINUTES;

  if (exercise.runtime?.kind === "remote") {
    return {
      kind: "remote",
      effectiveKind: "remote",
      provider,
      image,
      maxMinutes,
      capabilities: exercise.runtime.capabilities,
    };
  }

  if (exercise.runtime?.kind === "simulated") {
    return {
      kind: "simulated",
      effectiveKind: "simulated",
      provider,
      image,
      maxMinutes,
      capabilities: exercise.runtime.capabilities,
    };
  }

  if (
    isLabRuntimeEnabled() &&
    REMOTE_CAPABLE_TEMPLATES.has(exercise.templateId as TemplateId) &&
    exercise.templateId !== "bash"
  ) {
    return {
      kind: "remote",
      effectiveKind: "remote",
      provider,
      image,
      maxMinutes,
    };
  }

  return {
    kind: "simulated",
    effectiveKind: "simulated",
    provider,
    image,
    maxMinutes,
  };
}

export function exerciseUsesTerminalPreview(
  templateId: string,
  runtime: ResolvedExerciseRuntime
): boolean {
  if (runtime.effectiveKind === "remote") return true;
  return templateId === "bash";
}

/** Sessions en mémoire (stub) — remplacé par Redis/DB + orchestrateur cloud. */
const sessions = new Map<string, LabSession>();

function newSessionId(): string {
  return `lab_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface CreateLabSessionInput {
  exerciseId: string;
  provider?: LabProvider;
  image?: string;
  maxMinutes?: number;
}

export type CreateLabSessionResult =
  | { ok: true; session: LabSession }
  | { ok: false; code: "disabled" | "invalid"; message: string };

export function createLabSession(
  input: CreateLabSessionInput
): CreateLabSessionResult {
  if (!isLabRuntimeEnabled()) {
    return {
      ok: false,
      code: "disabled",
      message:
        "Les labs cloud ne sont pas encore activés sur cette instance (LAB_RUNTIME_ENABLED=false).",
    };
  }

  const provider = input.provider ?? getDefaultLabProvider();
  const image = input.image ?? "ubuntu-22.04-minimal";
  const maxMinutes = input.maxMinutes ?? DEFAULT_MAX_MINUTES;
  const estimate = LAB_PROVIDER_ESTIMATES[provider];
  const now = Date.now();
  const id = newSessionId();

  const session: LabSession = {
    id,
    exerciseId: input.exerciseId,
    provider,
    image,
    status: "ready",
    terminalUrl: `/api/labs/sessions/${id}/terminal`,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + maxMinutes * 60_000).toISOString(),
    maxMinutes,
    estimatedUsdPerMinute: estimate.usdPerMinute,
  };

  sessions.set(id, session);
  return { ok: true, session };
}

export function getLabSession(sessionId: string): LabSession | undefined {
  return sessions.get(sessionId);
}

export function stopLabSession(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;
  sessions.set(sessionId, { ...session, status: "stopped" });
  return true;
}

/** Réinitialise le registre en mémoire (tests). */
export function resetLabSessionsForTests(): void {
  sessions.clear();
}
