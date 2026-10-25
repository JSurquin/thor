"use client";

import Link from "next/link";
import { ArrowRightIcon, HistoryIcon } from "lucide-react";
import { useMemo } from "react";
import { useExerciseActivity } from "@/lib/hooks/use-exercise-activity";
import type { Locale } from "@/lib/i18n";
import { useLocale } from "./locale-provider";

export type ResumeEntry = {
  id: string;
  title: string;
  titles?: Partial<Record<Locale, string>>;
};

export function ResumeExerciseCard({ entries }: { entries: ResumeEntry[] }) {
  const { messages, locale } = useLocale();
  const ids = useMemo(() => entries.map((entry) => entry.id), [entries]);
  const activity = useExerciseActivity(ids);
  const last = activity.drafts.find(
    (draft) => !activity.completed.includes(draft.exerciseId),
  );
  const entry = last && entries.find((item) => item.id === last.exerciseId);
  if (!entry) return null;
  return (
    <Link
      href={`/exercices/${encodeURIComponent(entry.id)}?resume=1`}
      className="resume-exercise-card"
      data-testid="resume-exercise-card"
    >
      <span className="resume-exercise-icon">
        <HistoryIcon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-1 block text-xs font-semibold text-primary">
          {messages.ux.resumeExercise}
        </span>
        <strong className="block truncate text-sm">
          {entry.titles?.[locale] ?? entry.title}
        </strong>
      </span>
      <ArrowRightIcon className="size-4 shrink-0 text-primary" />
    </Link>
  );
}
