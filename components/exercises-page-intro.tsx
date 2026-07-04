"use client";

import { ClipboardListIcon } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function ExercisesPageIntro() {
  const { messages } = useLocale();
  const t = messages.exercises;

  return (
    <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="size-10 sm:size-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
          <ClipboardListIcon className="size-5 sm:size-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.pageTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t.pageSubtitle}</p>
        </div>
      </div>
      <LocaleSwitcher className="w-full sm:w-[160px] min-h-[44px]" />
    </section>
  );
}
