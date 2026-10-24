"use client";

import type { Exercise } from "@/lib/types";
import {
  resolveExerciseRuntime,
  exerciseUsesTerminalPreview,
} from "@/lib/lab-runtime";
import { BashTerminalPreview } from "@/components/bash-terminal-preview";
import { RemoteLabTerminalPreview } from "@/components/remote-lab-terminal-preview";
import { useLocale } from "@/components/locale-provider";

export function ExerciseTerminalPreview({ exercise }: { exercise: Exercise }) {
  const { messages } = useLocale();
  const runtime = resolveExerciseRuntime(exercise);

  if (!exerciseUsesTerminalPreview(exercise.templateId, runtime)) {
    return null;
  }

  if (runtime.effectiveKind === "external") {
    return (
      <div className="flex h-full min-h-[280px] flex-col gap-3 rounded-lg border p-6" data-testid="external-lab-preview">
        <h2 className="font-semibold">{messages.externalLab.title}</h2>
        <p className="text-sm text-muted-foreground">{messages.externalLab.description}</p>
        <p className="text-sm text-muted-foreground">{messages.externalLab.validationNote}</p>
      </div>
    );
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
