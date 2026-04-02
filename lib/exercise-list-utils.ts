import type { Exercise } from "@/lib/types";

export type ExerciseSortMode = "order" | "title" | "level";

const levelRank: Record<string, number> = {
  debutant: 0,
  intermediaire: 1,
  avance: 2,
};

/** Trie une copie de la liste (ne mute pas l’entrée). */
export function sortExercises(
  exercises: Exercise[],
  mode: ExerciseSortMode
): Exercise[] {
  const copy = exercises.slice();
  if (mode === "title") {
    copy.sort((a, b) =>
      a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
    );
    return copy;
  }
  if (mode === "level") {
    copy.sort((a, b) => {
      const ra = a.level != null ? (levelRank[a.level] ?? 99) : 99;
      const rb = b.level != null ? (levelRank[b.level] ?? 99) : 99;
      if (ra !== rb) return ra - rb;
      return (a.order ?? 99) - (b.order ?? 99);
    });
    return copy;
  }
  copy.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  return copy;
}
