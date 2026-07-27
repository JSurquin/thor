"use client";

import type { Exercise } from "@/lib/types";
import {
  resolveExerciseRuntime,
  exerciseUsesTerminalPreview,
} from "@/lib/lab-runtime";
import { BashTerminalPreview } from "@/components/bash-terminal-preview";
import { RemoteLabTerminalPreview } from "@/components/remote-lab-terminal-preview";

export function ExerciseTerminalPreview({ exercise }: { exercise: Exercise }) {
  const runtime = resolveExerciseRuntime(exercise);

  if (!exerciseUsesTerminalPreview(exercise.templateId, runtime)) {
    return null;
  }

  if (runtime.effectiveKind === "remote") {
    return (
      <RemoteLabTerminalPreview
        exerciseId={exercise.id}
        runtime={runtime}
      />
    );
  }

  return <BashTerminalPreview />;
}
