"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ClipboardListIcon,
  SearchIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
} from "lucide-react";
import type { Exercise, ExerciseTemplateId } from "@/lib/types";
import {
  readCompletedExerciseIds,
  clearExerciseProgress,
} from "@/lib/progress-storage";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  sortExercises,
  type ExerciseSortMode,
} from "@/lib/exercise-list-utils";

const levelLabel: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

const templateLabel: Record<ExerciseTemplateId, string> = {
  react: "React",
  next: "Next.js",
  vue: "Vue",
  html: "HTML",
  javascript: "JavaScript",
};

type LevelFilter = "all" | "debutant" | "intermediaire" | "avance";
type TemplateFilter = "all" | ExerciseTemplateId;

const sortLabel: Record<ExerciseSortMode, string> = {
  order: "Ordre du parcours",
  title: "Titre (A–Z)",
  level: "Niveau",
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

type ExercisesListClientProps = {
  exercises: Exercise[];
};

export function ExercisesListClient({ exercises }: ExercisesListClientProps) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<LevelFilter>("all");
  const [templateId, setTemplateId] = useState<TemplateFilter>("all");
  const [doneIds, setDoneIds] = useState<string[]>(() =>
    readCompletedExerciseIds()
  );
  const [resetOpen, setResetOpen] = useState(false);
  const [sortMode, setSortMode] = useState<ExerciseSortMode>("order");

  const refreshProgress = useCallback(() => {
    setDoneIds(readCompletedExerciseIds());
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refreshProgress();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", refreshProgress);
    window.addEventListener("thor-progress", refreshProgress);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", refreshProgress);
      window.removeEventListener("thor-progress", refreshProgress);
    };
  }, [refreshProgress]);

  const total = exercises.length;
  const doneCount = useMemo(
    () => exercises.filter((e) => doneIds.includes(e.id)).length,
    [exercises, doneIds]
  );
  const progressValue = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    const list = exercises.filter((ex) => {
      if (level !== "all" && ex.level !== level) return false;
      if (templateId !== "all" && ex.templateId !== templateId) return false;
      if (!q) return true;
      const hay = normalize(`${ex.title} ${ex.description}`);
      return hay.includes(q);
    });
    return sortExercises(list, sortMode);
  }, [exercises, query, level, templateId, sortMode]);

  return (
    <>
      {total > 0 ? (
        <div className="mb-6 rounded-xl border border-border/50 bg-card/40 px-4 py-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Progression locale</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground tabular-nums">
                {doneCount} / {total} validés
              </span>
              {doneCount > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-destructive hover:text-destructive border-destructive/40"
                  onClick={() => setResetOpen(true)}
                  aria-label="Réinitialiser la progression sur cet appareil"
                >
                  <RotateCcwIcon className="size-3.5" />
                  <span className="hidden sm:inline">Réinitialiser</span>
                </Button>
              ) : null}
            </div>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
      ) : null}

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser la progression ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les coches « validés » sur cette liste seront effacées sur cet
              appareil (stockage local du navigateur). Vos brouillons d’exercices
              ne sont pas supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                clearExerciseProgress();
                refreshProgress();
                setResetOpen(false);
                toast.success("Progression réinitialisée");
              }}
            >
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative flex-1 min-w-[200px] max-w-xl">
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Rechercher par titre ou description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 min-h-[44px]"
            aria-label="Rechercher un exercice"
            data-testid="exercises-search"
          />
        </div>
        <Select
          value={level}
          onValueChange={(v) => setLevel(v as LevelFilter)}
        >
          <SelectTrigger
            className="w-full sm:w-[200px] min-h-[44px]"
            aria-label="Filtrer par niveau"
          >
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="debutant">{levelLabel.debutant}</SelectItem>
            <SelectItem value="intermediaire">{levelLabel.intermediaire}</SelectItem>
            <SelectItem value="avance">{levelLabel.avance}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={templateId}
          onValueChange={(v) => setTemplateId(v as TemplateFilter)}
        >
          <SelectTrigger
            className="w-full sm:w-[220px] min-h-[44px]"
            aria-label="Filtrer par template"
          >
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les templates</SelectItem>
            {(Object.keys(templateLabel) as ExerciseTemplateId[]).map((id) => (
              <SelectItem key={id} value={id}>
                {templateLabel[id]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortMode}
          onValueChange={(v) => setSortMode(v as ExerciseSortMode)}
        >
          <SelectTrigger
            className="w-full sm:w-[220px] min-h-[44px]"
            aria-label="Trier la liste"
            data-testid="exercises-sort"
          >
            <SelectValue placeholder="Tri" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(sortLabel) as ExerciseSortMode[]).map((key) => (
              <SelectItem key={key} value={key}>
                {sortLabel[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <ul className="grid gap-3 sm:gap-4">
        {filtered.map((ex) => {
          const done = doneIds.includes(ex.id);
          return (
            <li key={ex.id}>
              <Link
                href={`/exercices/${ex.id}`}
                className="block rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 sm:p-5 hover:bg-card/80 hover:border-primary/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-foreground text-base sm:text-lg">
                        {ex.title}
                      </h2>
                      {done ? (
                        <CheckCircle2Icon
                          className="size-5 text-green-600 dark:text-green-400 shrink-0"
                          aria-label="Exercice validé"
                        />
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {ex.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ex.level && (
                        <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {levelLabel[ex.level] ?? ex.level}
                        </span>
                      )}
                      <span className="inline-block text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                        {templateLabel[ex.templateId]}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-muted-foreground p-1 rounded-md group-hover:text-primary">
                    <ArrowRightIcon className="size-5" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && exercises.length > 0 ? (
        <p className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
          <ClipboardListIcon className="size-10 opacity-40" aria-hidden />
          Aucun exercice ne correspond à ces critères. Modifiez la recherche, le tri ou les
          filtres.
        </p>
      ) : null}
    </>
  );
}
