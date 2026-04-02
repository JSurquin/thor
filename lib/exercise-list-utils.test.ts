import { describe, it, expect } from "vitest";
import type { Exercise } from "@/lib/types";
import { sortExercises } from "./exercise-list-utils";

function mock(
  overrides: Partial<Exercise> & Pick<Exercise, "id" | "title">
): Exercise {
  return {
    ...overrides,
    description: overrides.description ?? "",
    instructions: "",
    templateId: "react",
    validation: [],
  } as Exercise;
}

describe("sortExercises", () => {
  it("trie par order (parcours pédagogique)", () => {
    const list = [
      mock({ id: "b", title: "B", order: 2 }),
      mock({ id: "a", title: "A", order: 1 }),
    ];
    expect(sortExercises(list, "order").map((e) => e.id)).toEqual(["a", "b"]);
  });

  it("trie par titre (locale fr)", () => {
    const list = [
      mock({ id: "1", title: "Élément", order: 1 }),
      mock({ id: "2", title: "Alpha", order: 2 }),
    ];
    expect(sortExercises(list, "title").map((e) => e.id)).toEqual(["2", "1"]);
  });

  it("trie par niveau puis order", () => {
    const list = [
      mock({ id: "adv", title: "x", level: "avance", order: 1 }),
      mock({ id: "beg", title: "y", level: "debutant", order: 3 }),
      mock({ id: "mid", title: "z", level: "intermediaire", order: 2 }),
    ];
    const ids = sortExercises(list, "level").map((e) => e.id);
    expect(ids).toEqual(["beg", "mid", "adv"]);
  });
});
