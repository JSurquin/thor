import { describe, expect, it } from "vitest";
import { getExerciseById, getExercises } from "./exercises";
import {
  EXERCISE_TOPICS,
  getExerciseTopic,
  matchesExerciseSearch,
} from "./exercise-topics";
import { getMessages } from "./i18n";

describe("catalogue par thèmes", () => {
  it("classe chaque exercice dans un thème disponible et traduit", () => {
    const exercises = getExercises();
    for (const exercise of exercises) {
      const topic = getExerciseTopic(exercise);
      expect(EXERCISE_TOPICS).toContain(topic);
      for (const locale of ["fr", "de", "es", "pl"] as const) {
        expect(getMessages(locale).studio.topicNames[topic]).toBeTruthy();
      }
    }
    for (const topic of EXERCISE_TOPICS) {
      expect(
        exercises.some((exercise) => getExerciseTopic(exercise) === topic),
      ).toBe(true);
    }
  });

  it.each([
    ["docker-compose-volume", "compose"],
    ["suz-rancher-compose-et-podman-podman", "compose"],
    ["suz-rancher-rke2-serveur", "rke2"],
    ["suz-rancher-rancher-rbac", "security"],
    ["suz-rancher-rancher-prime-longhorn", "storage"],
    ["suz-rancher-rancher-prime-fleet", "gitops"],
    ["suz-rancher-supervision-logs", "monitoring"],
    ["suz-rancher-projet-final", "projects"],
  ])("distingue %s du template générique (%s)", (id, topic) => {
    expect(getExerciseTopic(getExerciseById(id)!)).toBe(topic);
  });

  it("recherche tous les mots sans imposer leur ordre, casse ou accents", () => {
    const exercise = getExerciseById("suz-rancher-rancher-rbac")!;
    expect(
      matchesExerciseSearch(
        exercise,
        "  MEMBRE   accès ",
        "Membre et sécurité",
      ),
    ).toBe(true);
    expect(matchesExerciseSearch(exercise, "dev-user demo-project")).toBe(true);
    expect(
      matchesExerciseSearch(exercise, "dev-user inconnu-introuvable"),
    ).toBe(false);
    expect(matchesExerciseSearch(exercise, "   ")).toBe(true);
  });

  it("indexe les consignes mais ne révèle pas les corrigés dans la recherche", () => {
    const exercise = {
      ...getExerciseById("react-hello-state")!,
      title: "Compteur",
      description: "Un état",
      instructions: "Ajoutez un bouton",
      solutionSummary: "réponse-secrète",
      solutionFiles: { "/solution.js": "réponse-secrète" },
    };
    expect(matchesExerciseSearch(exercise, "bouton")).toBe(true);
    expect(matchesExerciseSearch(exercise, "réponse-secrète")).toBe(false);
  });
});
