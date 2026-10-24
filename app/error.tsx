"use client";

import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="studio-page">
      <SiteHeader />
      <main className="site-container flex flex-1 items-center justify-center py-20">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 max-w-lg w-full text-center space-y-5 shadow-sm">
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
      </main>
      <SiteFooter />
    </div>
  );
}
