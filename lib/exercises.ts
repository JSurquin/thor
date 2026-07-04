import type {
  Exercise,
  ExerciseValidation,
  ExerciseValidationContains,
  ExerciseValidationMatches,
  ExerciseValidationNotContains,
} from "./types";
import data from "@/data/exercises.json";
import { TEMPLATES, type TemplateId } from "./templates";
import { BASH_TERMINAL_SHELL_JS } from "./bash-exercise-assets";

export type { Exercise, ExerciseValidation };

const BASH_EXERCISE_FILE_OVERRIDES: Record<string, Record<string, string>> = {
  "bash-terminal-decouverte": {
    "/shell.js": BASH_TERMINAL_SHELL_JS,
  },
};

export function getExercises(): Exercise[] {
  return (data as Exercise[]).slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getExerciseById(id: string): Exercise | undefined {
  return getExercises().find((e) => e.id === id);
}

/** Retourne les fichiers initiaux pour un exercice (template + overrides initialFiles). */
export function getExerciseInitialFiles(exercise: Exercise): Record<string, string> {
  const templateId = exercise.templateId as TemplateId;
  const template = TEMPLATES[templateId];
  const base = template ? { ...template.files } : {};
  if (exercise.initialFiles) {
    for (const [path, content] of Object.entries(exercise.initialFiles)) {
      const key = path.startsWith("/") ? path : `/${path}`;
      base[key] = content;
    }
  }
  const assetOverrides = BASH_EXERCISE_FILE_OVERRIDES[exercise.id];
  if (assetOverrides) {
    for (const [path, content] of Object.entries(assetOverrides)) {
      base[path] = content;
    }
  }
  return base;
}

export function getExerciseEntryFile(exercise: Exercise): string {
  const files = getExerciseInitialFiles(exercise);
  const paths = Object.keys(files).sort();
  const template = TEMPLATES[exercise.templateId as TemplateId];
  const templateEntry = template?.entryFile ?? "/App.js";

  const resolvePrefer = (raw: string | undefined): string | null => {
    if (!raw) return null;
    for (const key of [raw, raw.startsWith("/") ? raw.slice(1) : `/${raw}`]) {
      if (Object.prototype.hasOwnProperty.call(files, key)) return key;
    }
    return null;
  };

  return (
    resolvePrefer(exercise.entryFile) ??
    resolvePrefer(templateEntry) ??
    paths[0] ??
    templateEntry
  );
}

/** Contenu d’un fichier pour la validation (clé avec ou sans `/` initial). */
export function getExerciseFileContent(
  files: Record<string, string>,
  ruleFile: string
): string {
  const withSlash = ruleFile.startsWith("/") ? ruleFile : `/${ruleFile}`;
  const noSlash = withSlash.replace(/^\//, "");
  if (Object.prototype.hasOwnProperty.call(files, ruleFile))
    return files[ruleFile] ?? "";
  if (Object.prototype.hasOwnProperty.call(files, withSlash))
    return files[withSlash] ?? "";
  if (Object.prototype.hasOwnProperty.call(files, noSlash))
    return files[noSlash] ?? "";
  return "";
}

export type ValidationResult =
  | { ok: true; message?: string }
  | { ok: false; message: string };

/** Validation mock in-memory : contains / not_contains / matches (regex). */
export function validateExercise(
  exercise: Exercise,
  files: Record<string, string>
): ValidationResult[] {
  const results: ValidationResult[] = [];
  for (const rule of exercise.validation) {
    const content = getExerciseFileContent(files, rule.file);
    if (rule.type === "contains") {
      const r = rule as ExerciseValidationContains;
      const ok = content.includes(r.substring);
      results.push(
        ok
          ? { ok: true, message: r.successMessage ?? "Critère respecté." }
          : { ok: false, message: `Il manque : « ${r.substring} » dans ${r.file}.` }
      );
    } else if (rule.type === "not_contains") {
      const r = rule as ExerciseValidationNotContains;
      const ok = !content.includes(r.substring);
      results.push(
        ok
          ? { ok: true, message: "Critère respecté." }
          : { ok: false, message: r.failMessage ?? `« ${r.substring} » ne doit pas être dans ${r.file}.` }
      );
    } else if (rule.type === "matches") {
      const r = rule as ExerciseValidationMatches;
      let re: RegExp;
      try {
        re = new RegExp(r.pattern, r.flags ?? "");
      } catch {
        results.push({
          ok: false,
          message: `Motif regex invalide pour ${r.file}.`,
        });
        continue;
      }
      const ok = re.test(content);
      results.push(
        ok
          ? { ok: true, message: r.successMessage ?? "Expression respectée." }
          : {
              ok: false,
              message:
                r.failMessage ??
                `Le contenu de ${r.file} ne correspond pas au motif attendu.`,
            }
      );
    }
  }
  return results;
}

export function isExerciseValid(results: ValidationResult[]): boolean {
  return results.every((r) => r.ok);
}
