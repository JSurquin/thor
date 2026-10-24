import { describe, expect, it } from "vitest";
import importedExercises from "@/data/exercises-suz-rancher.json";
import type { Exercise } from "./types";
import {
  getExerciseById,
  getExerciseEntryFile,
  getExerciseInitialFiles,
  getExercises,
  isExerciseValid,
  validateExercise,
} from "./exercises";
import { exerciseUsesTerminalPreview, resolveExerciseRuntime } from "./lab-runtime";

const exercises = importedExercises as unknown as Exercise[];

describe("parcours suz-rancher intégré", () => {
  it("ajoute les 51 exercices et le projet final sans collision avec le catalogue", () => {
    expect(exercises).toHaveLength(52);
    const catalog = getExercises();
    expect(new Set(catalog.map((exercise) => exercise.id)).size).toBe(catalog.length);
    expect(catalog.filter((exercise) => exercise.id.startsWith("suz-rancher-"))).toHaveLength(52);
    expect(catalog[0].id).toBe("vue-ref-compteur");
  });

  it.each(exercises)("$id : démarre incomplet et accepte son corrigé", (exercise) => {
    expect(getExerciseById(exercise.id)).toEqual(exercise);
    const initial = getExerciseInitialFiles(exercise);
    expect(initial).toHaveProperty(getExerciseEntryFile(exercise));
    expect(initial).toEqual(exercise.initialFiles);
    expect(exercise.validation.length).toBeGreaterThan(0);
    expect(isExerciseValid(validateExercise(exercise, initial))).toBe(false);

    const solution = { ...initial, ...exercise.solutionFiles };
    const results = validateExercise(exercise, solution);
    expect(results.filter((result) => !result.ok)).toEqual([]);

    // Une copie du corrigé ne doit pas masquer un fichier de réponse effacé.
    for (const file of new Set(exercise.validation.map((rule) => rule.file))) {
      expect(isExerciseValid(validateExercise(exercise, { ...solution, [file]: "" }))).toBe(false);
    }

    const runtime = resolveExerciseRuntime(exercise);
    expect(runtime.effectiveKind).toBe("external");
    expect(exerciseUsesTerminalPreview(exercise.templateId, runtime)).toBe(true);
    expect(exercise.instructions).toContain("bd17eda410b1a48a4f2bc97b93222bd3242d0ad2");
  });

  it("embarque les quatre applications et leurs manifests, sans le sandbox k3s", () => {
    const project = getExerciseById("suz-rancher-projet-final")!;
    const files = getExerciseInitialFiles(project);
    for (const name of ["nextjs-demo", "java-demo", "node-api", "python-api"]) {
      expect(files[`/lab/apps/${name}/Dockerfile`]).toBeTruthy();
      expect(files["/lab/docker-compose.yml"]).toContain(name);
    }
    expect(files["/lab/apps/node-api/server.mjs"]).toContain("express");
    expect(files["/lab/apps/python-api/app.py"]).toContain("Flask");
    expect(files["/lab/k8s/00-namespace.yaml"]).toContain("suz-rancher-lab");
    expect(files["/lab/k8s/60-ingress.yaml"]).toContain("kind: Ingress");
    expect(files).not.toHaveProperty("/lab/scripts/setup-server.sh");
    expect(files).not.toHaveProperty("/deployment.yaml");
  });
});
