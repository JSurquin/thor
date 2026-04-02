import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  readCompletedExerciseIds,
  markExerciseCompleted,
  isExerciseMarkedCompleted,
  clearExerciseProgress,
} from "./progress-storage";

describe("progress-storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("enregistre et lit les exercices complétés", () => {
    expect(readCompletedExerciseIds()).toEqual([]);
    markExerciseCompleted("exo-a");
    expect(readCompletedExerciseIds()).toContain("exo-a");
    expect(isExerciseMarkedCompleted("exo-a")).toBe(true);
    expect(isExerciseMarkedCompleted("autre")).toBe(false);
  });

  it("agrège plusieurs ids sans doublon", () => {
    markExerciseCompleted("x");
    markExerciseCompleted("y");
    markExerciseCompleted("x");
    expect(readCompletedExerciseIds().sort()).toEqual(["x", "y"]);
  });

  it("clearExerciseProgress vide le stockage", () => {
    markExerciseCompleted("z");
    clearExerciseProgress();
    expect(readCompletedExerciseIds()).toEqual([]);
  });

  it("émet l’événement thor-progress à chaque complétion", () => {
    const spy = vi.spyOn(window, "dispatchEvent");
    markExerciseCompleted("e1");
    expect(
      spy.mock.calls.some(
        (c) =>
          c[0] instanceof Event && (c[0] as Event).type === "thor-progress"
      )
    ).toBe(true);
  });
});
