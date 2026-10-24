"use client";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export function ExercisesPageIntro() {
  const { messages } = useLocale();
  return (
    <section className="catalog-intro">
      <div>
        <p className="section-kicker">{messages.studio.eyebrow}</p>
        <h1>
          {messages.studio.exercises}
          <span className="text-primary">.</span>
        </h1>
        <p>{messages.studio.topicsDescription}</p>
      </div>
      <Link
        href="/playground"
        className="studio-button studio-button-secondary"
      >
        {messages.studio.openPlayground}
        <ArrowUpRightIcon className="size-4" />
      </Link>
    </section>
  );
}
