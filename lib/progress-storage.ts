const KEY = "thor.exercise.progress.v1";

export function readCompletedExerciseIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    if (!Array.isArray(p)) return [];
    return p.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function markExerciseCompleted(id: string): void {
  if (typeof window === "undefined") return;
  const set = new Set(readCompletedExerciseIds());
  set.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("thor-progress"));
  } catch {
    /* ignore */
  }
}

export function isExerciseMarkedCompleted(id: string): boolean {
  return readCompletedExerciseIds().includes(id);
}

export function clearExerciseProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
