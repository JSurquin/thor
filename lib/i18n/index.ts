import type { Exercise } from "@/lib/types";
import { de } from "./messages/de";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { pl } from "./messages/pl";
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  type Messages,
  type ValidationMessages,
} from "./types";

export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_LABELS,
  type Locale,
  type Messages,
  type ValidationMessages,
} from "./types";

const MESSAGES: Record<Locale, Messages> = { fr, pl, de, es };

export const LOCALE_STORAGE_KEY = "thor-locale";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}

export function getValidationMessages(locale: Locale): ValidationMessages {
  return getMessages(locale).validation;
}

/** Fusionne les champs traduits optionnels d’un exercice pour la locale demandée. */
export function localizeExercise(exercise: Exercise, locale: Locale): Exercise {
  const tr = exercise.translations?.[locale];
  if (!tr) return exercise;
  return {
    ...exercise,
    title: tr.title ?? exercise.title,
    description: tr.description ?? exercise.description,
    instructions: tr.instructions ?? exercise.instructions,
    hint: tr.hint ?? exercise.hint,
    solutionSummary: tr.solutionSummary ?? exercise.solutionSummary,
  };
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isLocale(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

export function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
