"use client";

import { useLocale } from "@/components/locale-provider";

export function ExerciseEditorLoading() {
  const { messages } = useLocale();
  return (
    <div className="flex items-center justify-center h-full min-h-[280px] bg-muted/30 text-muted-foreground text-sm">
      {messages.exercise.loadingEditor}
    </div>
  );
}
