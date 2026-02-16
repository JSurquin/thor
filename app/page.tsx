import Link from "next/link";
import { Code2Icon, PlayIcon, ZapIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col min-w-0 overflow-x-hidden bg-gradient-to-b from-background via-background to-primary/5">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 sm:px-8 py-4 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 group-hover:ring-primary/50 transition-all">
              <Code2Icon className="size-5 text-primary" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                lab.andromed
              </span>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest -mt-0.5">
                Playground interactif
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-8 py-12 sm:py-20">
        <section className="text-center space-y-6 mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            lab.andromed.fr
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance">
            Playground{" "}
            <span className="text-primary">interactif</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Un environnement live pour coder pendant la formation. Éditeur
            Monaco, sandboxes, templates React, Next, Docker, Rails. Reset en un
            clic, export en ZIP.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/playground">
              <Button size="lg" className="gap-2">
                <PlayIcon className="size-5" />
                Ouvrir le Playground
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
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
              className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 space-y-2"
            >
              <div className="size-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-8 py-6">
          <p className="text-sm text-muted-foreground font-medium">
            lab.andromed.fr — Playground interactif (Thor)
          </p>
        </div>
      </footer>
    </div>
  );
}
