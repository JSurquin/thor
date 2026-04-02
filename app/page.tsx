import Link from "next/link";
import { Code2Icon, PlayIcon, ZapIcon, ClipboardListIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "lab.andromed",
  description:
    "Playground interactif et exercices de code pour la formation.",
  url: siteUrl,
  inLanguage: "fr-FR",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col min-w-0 overflow-x-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0 sticky top-0 z-50 safe-area-inset-top">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity group min-w-0"
          >
            <div className="size-9 sm:size-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 shrink-0">
              <Code2Icon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground block truncate">
                lab.andromed
              </span>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5 hidden sm:block">
                Playground interactif
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              href="/exercices"
              className="py-2 px-2 sm:px-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md touch-manipulation min-h-[44px] flex items-center"
            >
              Exercices
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-20">
        <section className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 sm:px-4 py-1.5 text-xs font-medium text-primary">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            lab.andromed.fr
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance px-1">
            Playground{" "}
            <span className="text-primary">interactif</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Un environnement live pour coder pendant la formation. Éditeur
            Monaco, sandboxes, templates React, Next, Docker, Rails. Reset en un
            clic, export en ZIP.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <Link href="/playground">
              <Button size="lg" className="gap-2 min-h-[44px] touch-manipulation">
                <PlayIcon className="size-5 shrink-0" />
                Ouvrir le Playground
              </Button>
            </Link>
            <Link href="/exercices">
              <Button size="lg" variant="secondary" className="gap-2 min-h-[44px] touch-manipulation">
                <ClipboardListIcon className="size-5 shrink-0" />
                Exercices
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {[
            {
              icon: <Code2Icon className="size-5" />,
              title: "Éditeur Monaco",
              desc: "Même moteur que VS Code pour une expérience de code familière.",
            },
            {
              icon: <ZapIcon className="size-5" />,
              title: "Preview live",
              desc: "Rendu React/Next en direct dans le navigateur.",
            },
            {
              icon: <PlayIcon className="size-5" />,
              title: "Templates",
              desc: "React, Next.js, Docker, Rails — démarrez en un clic.",
            },
            {
              icon: <Code2Icon className="size-5" />,
              title: "Export ZIP",
              desc: "Téléchargez tout le code de votre sandbox.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-5 space-y-2 min-h-[120px] flex flex-col"
            >
              <div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground flex-1">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto safe-area-inset-bottom">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <p className="text-sm text-muted-foreground font-medium">
            lab.andromed.fr — Playground interactif (Thor)
          </p>
        </div>
      </footer>
    </div>
  );
}
