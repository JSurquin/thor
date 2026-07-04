import { describe, it, expect } from "vitest";
import {
  DEFAULT_LOCALE,
  getMessages,
  getValidationMessages,
  isLocale,
  localizeExercise,
} from "./i18n";
import { getExerciseById } from "./exercises";

describe("i18n", () => {
  it("reconnaît les locales supportées", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("pl")).toBe(true);
    expect(isLocale("en")).toBe(false);
  });

  it("retourne les messages pour chaque locale", () => {
    expect(getMessages("de").locale).toBe("de");
    expect(getMessages("es").exercises.pageTitle).toContain("Ejercicios");
    expect(getValidationMessages("pl").criterionOk).toContain("Kryterium");
  });

  it("localise un exercice avec traductions optionnelles", () => {
    const ex = getExerciseById("vue-ref-compteur")!;
    const localized = localizeExercise(
      {
        ...ex,
        translations: {
          de: { title: "Vue: Zähler mit ref" },
        },
      },
      "de"
    );
    expect(localized.title).toBe("Vue: Zähler mit ref");
    expect(localizeExercise(ex, "de").title).toBe(ex.title);
  });

  it("utilise le français par défaut", () => {
    expect(getMessages(DEFAULT_LOCALE).locale).toBe("fr");
  });
});
