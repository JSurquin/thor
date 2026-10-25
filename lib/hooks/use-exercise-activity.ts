"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  readExerciseDraftSummaries,
  type ExerciseDraftSummary,
} from "@/lib/workspace-storage";
import { readCompletedExerciseIds } from "@/lib/progress-storage";

function subscribe(notify: () => void) {
  const events = ["storage", "thor-workspace", "thor-progress", "focus"];
  events.forEach((event) => window.addEventListener(event, notify));
  return () =>
    events.forEach((event) => window.removeEventListener(event, notify));
}
const emptySnapshot = () => '{"drafts":[],"completed":[]}';

export function useExerciseActivity(ids: readonly string[]) {
  const getSnapshot = useCallback(
    () =>
      JSON.stringify({
        drafts: readExerciseDraftSummaries(ids),
        completed: readCompletedExerciseIds(),
      }),
    [ids],
  );
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, emptySnapshot);
  return useMemo(
    () =>
      JSON.parse(snapshot) as {
        drafts: ExerciseDraftSummary[];
        completed: string[];
      },
    [snapshot],
  );
}
