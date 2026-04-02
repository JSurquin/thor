"use client";

import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-8 bg-background safe-area-inset-top safe-area-inset-bottom">
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 sm:p-8 max-w-md w-full text-center space-y-4">
        <div className="size-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <AlertCircleIcon className="size-6" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Une erreur est survenue
        </h1>
        <p className="text-sm text-muted-foreground">
          {error.message || "Un problème inattendu s'est produit."}
        </p>
        {error.digest ? (
          <p className="text-xs font-mono text-muted-foreground/80 break-all">
            Référence : {error.digest}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button onClick={reset} variant="default">
            Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Accueil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/exercices">Exercices</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
