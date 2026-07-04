"use client";

import { useEffect, useState } from "react";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import type { ValidationResult } from "@/lib/exercises";
import { Progress } from "@/components/ui/progress";

const STEP_MS = 650;

export function useStepReveal(total: number, stepMs = STEP_MS) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
  }, [total]);

  useEffect(() => {
    if (visibleCount >= total) return;
    const timer = window.setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, stepMs);
    return () => window.clearTimeout(timer);
  }, [visibleCount, total, stepMs]);

  return visibleCount;
}

export type ExerciseCorrectionLabels = {
  title: string;
  progress: (current: number, total: number) => string;
  allPassed: string;
  someFailed: string;
};

type ExerciseCorrectionPanelProps = {
  results: ValidationResult[];
  labels: ExerciseCorrectionLabels;
  className?: string;
};

export function ExerciseCorrectionPanel({
  results,
  labels,
  className,
}: ExerciseCorrectionPanelProps) {
  const total = results.length;
  const visibleCount = useStepReveal(total);

  const allOk = results.every((r) => r.ok);
  const animating = visibleCount < total;

  if (total === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className={`border-t border-border/40 bg-muted/30 px-4 py-3 text-sm ${className ?? ""}`}
      data-testid="exercise-correction-panel"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-medium text-foreground">{labels.title}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {labels.progress(visibleCount, total)}
        </span>
      </div>
      <Progress
        value={total ? (visibleCount / total) * 100 : 0}
        className="h-1 mb-3"
        aria-hidden
      />
      <ul className="space-y-2 max-h-40 overflow-auto">
        {results.slice(0, visibleCount).map((r, i) => (
          <li
            key={`${i}-${r.message}`}
            className={`flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              r.ok ? "text-green-600 dark:text-green-400" : "text-destructive"
            }`}
          >
            {r.ok ? (
              <CheckCircle2Icon className="size-4 shrink-0 mt-0.5" aria-hidden />
            ) : (
              <XCircleIcon className="size-4 shrink-0 mt-0.5" aria-hidden />
            )}
            <span>{r.message}</span>
          </li>
        ))}
      </ul>
      {!animating ? (
        <p
          className={`mt-2 text-xs font-medium ${
            allOk ? "text-green-600 dark:text-green-400" : "text-destructive"
          }`}
        >
          {allOk ? labels.allPassed : labels.someFailed}
        </p>
      ) : null}
    </div>
  );
}
