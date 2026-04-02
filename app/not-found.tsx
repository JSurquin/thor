import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La ressource demandée n’existe pas sur lab.andromed.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-8 bg-background safe-area-inset-top safe-area-inset-bottom">
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 sm:p-8 max-w-md w-full text-center space-y-4">
        <div className="size-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
          <FileQuestionIcon className="size-6" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Page introuvable
        </h1>
        <p className="text-sm text-muted-foreground">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2 pt-2">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">Accueil</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/playground">Playground</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/exercices">Exercices</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
