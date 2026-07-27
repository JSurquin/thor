import { afterEach, describe, expect, it, vi } from "vitest";
import type { Exercise } from "./types";
import {
  createLabSession,
  getLabSession,
  resetLabSessionsForTests,
  resolveExerciseRuntime,
  stopLabSession,
  exerciseUsesTerminalPreview,
} from "./lab-runtime";

function mockExercise(
  overrides: Partial<Exercise> = {}
): Exercise {
  return {
    id: "test-exercise",
    title: "Test",
    description: "Test",
    instructions: "Test",
    templateId: "bash",
    validation: [],
    ...overrides,
  };
}

describe("resolveExerciseRuntime", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("bash reste simulé par défaut", () => {
    const runtime = resolveExerciseRuntime(mockExercise());
    expect(runtime.effectiveKind).toBe("simulated");
  });

  it("honore runtime.remote explicite", () => {
    const runtime = resolveExerciseRuntime(
      mockExercise({
        runtime: { kind: "remote", provider: "aws", image: "ubuntu-24.04" },
      })
    );
    expect(runtime.effectiveKind).toBe("remote");
    expect(runtime.provider).toBe("aws");
    expect(runtime.image).toBe("ubuntu-24.04");
  });

  it("docker bascule en remote si LAB_RUNTIME_ENABLED=true", () => {
    vi.stubEnv("LAB_RUNTIME_ENABLED", "true");
    const runtime = resolveExerciseRuntime(
      mockExercise({
        id: "docker-lab",
        templateId: "bash",
        runtime: { kind: "remote", image: "docker-in-docker" },
      })
    );
    expect(runtime.effectiveKind).toBe("remote");
    expect(runtime.image).toBe("docker-in-docker");
  });
});

describe("exerciseUsesTerminalPreview", () => {
  it("bash simulé utilise le terminal", () => {
    const runtime = resolveExerciseRuntime(mockExercise());
    expect(exerciseUsesTerminalPreview("bash", runtime)).toBe(true);
  });

  it("react n'utilise pas le terminal simulé", () => {
    const runtime = resolveExerciseRuntime(
      mockExercise({ templateId: "react" })
    );
    expect(exerciseUsesTerminalPreview("react", runtime)).toBe(false);
  });
});

describe("createLabSession", () => {
  afterEach(() => {
    resetLabSessionsForTests();
    vi.unstubAllEnvs();
  });

  it("refuse si labs désactivés", () => {
    vi.stubEnv("LAB_RUNTIME_ENABLED", "false");
    const result = createLabSession({ exerciseId: "bash-terminal-decouverte" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("disabled");
  });

  it("crée une session mock quand activé", () => {
    vi.stubEnv("LAB_RUNTIME_ENABLED", "true");
    const result = createLabSession({ exerciseId: "bash-terminal-decouverte" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session.status).toBe("ready");
      expect(getLabSession(result.session.id)?.id).toBe(result.session.id);
      expect(stopLabSession(result.session.id)).toBe(true);
      expect(getLabSession(result.session.id)?.status).toBe("stopped");
    }
  });
});
