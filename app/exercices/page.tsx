import Link from "next/link";
import { Code2Icon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ExercisesListClient } from "@/components/exercises-list-client";
import { ExercisesPageIntro } from "@/components/exercises-page-intro";
import { getExercises } from "@/lib/exercises";

export const metadata = {
  title: "Exercices — lab.andromed",
  description:
    "Exercices avec aperçu live : Vue 3, Next.js (App Router), React, HTML/CSS.",
};

export default function ExercicesListPage() {
  const exercises = getExercises();

  return (
    <div className="min-h-screen flex flex-col min-w-0 overflow-x-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0 sticky top-0 z-50 safe-area-inset-top">
        <div className="mx-auto max-w-4xl flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 text-foreground hover:opacity-90 transition-opacity group min-w-0"
          >
            <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 shrink-0">
              <Code2Icon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-bold tracking-tight text-foreground text-base sm:text-xl truncate block">
                lab.andromed
              </span>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5 hidden sm:block">
                Exercices
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-2 shrink-0">
            <Link
              href="/playground"
              className="text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-2 rounded-md touch-manipulation"
            >
              Playground
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-6 sm:py-10">
        <ExercisesPageIntro />

        {exercises.length > 0 ? (
          <ExercisesListClient exercises={exercises} />
        ) : null}

        {exercises.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Aucun exercice pour le moment. Ajoutez-en dans <code className="text-foreground bg-muted px-1 rounded">data/exercises.json</code>.
          </p>
        )}
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto safe-area-inset-bottom">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 sm:py-6">
          <p className="text-sm text-muted-foreground font-medium">
            lab.andromed.fr — Exercices (Thor)
          </p>
        </div>
      </footer>
    </div>
  );
}
