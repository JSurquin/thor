"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  LayersIcon,
  ListFilterIcon,
  RotateCcwIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import type { Exercise, ExerciseTemplateId } from "@/lib/types";
import { localizeExercise } from "@/lib/i18n";
import {
  readCompletedExerciseIds,
  clearExerciseProgress,
} from "@/lib/progress-storage";
import {
  EXERCISE_TOPICS,
  getExerciseTopic,
  matchesExerciseSearch,
  type ExerciseTopic,
} from "@/lib/exercise-topics";
import { TopicIcon } from "@/components/topic-icon";
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
import { toast } from "sonner";
import {
  sortExercises,
  type ExerciseSortMode,
} from "@/lib/exercise-list-utils";
import { useLocale } from "@/components/locale-provider";

function subscribeProgress(notify: () => void) {
  window.addEventListener("thor-progress", notify);
  window.addEventListener("storage", notify);
  window.addEventListener("focus", notify);
  return () => {
    window.removeEventListener("thor-progress", notify);
    window.removeEventListener("storage", notify);
    window.removeEventListener("focus", notify);
  };
}
const progressSnapshot = () => JSON.stringify(readCompletedExerciseIds());
const emptySnapshot = () => "[]";

export function ExercisesListClient({ exercises }: { exercises: Exercise[] }) {
  const { locale, messages } = useLocale();
  const t = messages.exercises;
  const ui = messages.studio;
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const snapshot = useSyncExternalStore(
    subscribeProgress,
    progressSnapshot,
    emptySnapshot,
  );
  const doneIds = useMemo(
    () => new Set<string>(JSON.parse(snapshot)),
    [snapshot],
  );
  const query = params.get("q") ?? "";
  const rawTopic = params.get("theme");
  const topic: ExerciseTopic | "all" = EXERCISE_TOPICS.includes(
    rawTopic as ExerciseTopic,
  )
    ? (rawTopic as ExerciseTopic)
    : "all";
  const rawLevel = params.get("level");
  const level = ["debutant", "intermediaire", "avance"].includes(rawLevel ?? "")
    ? rawLevel!
    : "all";
  const status = ["done", "todo"].includes(params.get("status") ?? "")
    ? params.get("status")!
    : "all";
  const sortMode = ["title", "level"].includes(params.get("sort") ?? "")
    ? (params.get("sort") as ExerciseSortMode)
    : "order";
  const templates: ExerciseTemplateId[] = [
    "react",
    "next",
    "vue",
    "html",
    "javascript",
    "bash",
    "docker",
    "kubernetes",
  ];
  const templateId = templates.includes(
    params.get("template") as ExerciseTemplateId,
  )
    ? params.get("template")!
    : "all";
  const levelLabel: Record<string, string> = {
    debutant: t.levelDebutant,
    intermediaire: t.levelIntermediaire,
    avance: t.levelAvance,
  };
  const templateLabel: Record<ExerciseTemplateId, string> = {
    react: t.templateReact,
    next: t.templateNext,
    vue: t.templateVue,
    html: t.templateHtml,
    javascript: t.templateJavascript,
    bash: t.templateBash,
    docker: t.templateDocker,
    kubernetes: t.templateKubernetes,
  };

  function updateFilter(key: string, value: string, push = false) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || (key === "sort" && value === "order"))
      next.delete(key);
    else next.set(key, value);
    const url = `/exercices${next.size ? `?${next}` : ""}`;
    if (push) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }
  function chooseTopic(id: ExerciseTopic | "all") {
    updateFilter("theme", id, true);
    if (window.matchMedia("(max-width: 767px)").matches)
      resultsRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
  }
  const topicCounts = useMemo(() => {
    const counts = Object.fromEntries(
      EXERCISE_TOPICS.map((id) => [id, 0]),
    ) as Record<ExerciseTopic, number>;
    for (const exercise of exercises) counts[getExerciseTopic(exercise)]++;
    return counts;
  }, [exercises]);
  const filtered = useMemo(
    () =>
      sortExercises(
        exercises.filter((exercise) => {
          const exerciseTopic = getExerciseTopic(exercise);
          return (
            (topic === "all" || exerciseTopic === topic) &&
            (level === "all" || exercise.level === level) &&
            (templateId === "all" || exercise.templateId === templateId) &&
            (status === "all" ||
              (status === "done"
                ? doneIds.has(exercise.id)
                : !doneIds.has(exercise.id))) &&
            matchesExerciseSearch(
              localizeExercise(exercise, locale),
              query,
              ui.topicNames[exerciseTopic],
            )
          );
        }),
        sortMode,
      ),
    [
      exercises,
      topic,
      level,
      templateId,
      status,
      doneIds,
      locale,
      query,
      sortMode,
      ui.topicNames,
    ],
  );
  const doneCount = exercises.filter((exercise) =>
    doneIds.has(exercise.id),
  ).length;
  const hasFilters = Boolean(
    query ||
      topic !== "all" ||
      level !== "all" ||
      templateId !== "all" ||
      status !== "all" ||
      sortMode !== "order",
  );
  const browsing = !hasFilters;
  const groups = EXERCISE_TOPICS.map((id) => ({
    id,
    exercises: filtered.filter((exercise) => getExerciseTopic(exercise) === id),
  })).filter((group) => group.exercises.length > 0);
  const progress = exercises.length
    ? Math.round((doneCount / exercises.length) * 100)
    : 0;

  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <nav aria-label={ui.topicsLabel}>
          <p className="section-kicker mb-4 px-3">{ui.topicsLabel}</p>
          <div className="topic-navigation">
            <button
              type="button"
              className={`topic-nav-item ${topic === "all" ? "is-selected" : ""}`}
              aria-pressed={topic === "all"}
              onClick={() => chooseTopic("all")}
            >
              <LayersIcon className="size-4" aria-hidden="true" />
              <span>{ui.allTopics}</span>
              <small>{exercises.length}</small>
            </button>
            {EXERCISE_TOPICS.filter((id) => topicCounts[id] > 0).map((id) => (
              <button
                key={id}
                type="button"
                data-testid={`topic-${id}`}
                className={`topic-nav-item topic-${id} ${topic === id ? "is-selected" : ""}`}
                aria-pressed={topic === id}
                onClick={() => chooseTopic(id)}
              >
                <TopicIcon topic={id} className="size-4" />
                <span>{ui.topicNames[id]}</span>
                <small>{topicCounts[id]}</small>
              </button>
            ))}
          </div>
        </nav>
        <div className="catalog-progress">
          <div className="mb-4 flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2Icon className="size-5" />
            </span>
            <strong className="font-mono text-lg">
              {progress}
              <span className="text-xs text-muted-foreground">%</span>
            </strong>
          </div>
          <p className="mb-2 text-sm font-semibold">{t.localProgress}</p>
          <Progress
            value={progress}
            aria-label={t.localProgress}
            className="my-3 h-1.5"
          />
          <p className="text-xs font-medium">
            {t.validatedCount(doneCount, exercises.length)}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            {ui.progressDescription}
          </p>
          {doneCount > 0 && (
            <button
              type="button"
              className="mt-4 inline-flex min-h-9 items-center gap-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcwIcon className="size-3" />
              {t.resetProgress}
            </button>
          )}
        </div>
      </aside>
      <div className="min-w-0" ref={resultsRef}>
        <div
          className="catalog-search-panel"
          role="search"
          aria-label={ui.searchLabel}
        >
          <label
            htmlFor="catalog-search"
            className="mb-3 block text-sm font-semibold"
          >
            {ui.searchLabel}
          </label>
          <div className="catalog-search">
            <SearchIcon
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="catalog-search"
              type="search"
              placeholder={ui.searchHint}
              value={query}
              onChange={(event) => updateFilter("q", event.target.value)}
              data-testid="exercises-search"
              autoComplete="off"
            />
            <button
              type="button"
              className={`search-clear ${query ? "" : "invisible"}`}
              onClick={() => {
                updateFilter("q", "");
                inputRef.current?.focus();
              }}
              aria-label={ui.clearSearch}
            >
              <XIcon className="size-4" />
            </button>
          </div>
          <div className="catalog-filters">
            <SlidersHorizontalIcon
              className="hidden size-4 shrink-0 text-muted-foreground lg:block"
              aria-hidden="true"
            />
            <select
              className="catalog-select"
              aria-label={t.allLevels}
              value={level}
              onChange={(e) => updateFilter("level", e.target.value)}
            >
              <option value="all">{t.allLevels}</option>
              {Object.entries(levelLabel).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <select
              className="catalog-select"
              aria-label={t.allTemplates}
              value={templateId}
              onChange={(e) => updateFilter("template", e.target.value)}
            >
              <option value="all">{t.allTemplates}</option>
              {templates.map((id) => (
                <option key={id} value={id}>
                  {templateLabel[id]}
                </option>
              ))}
            </select>
            <select
              className="catalog-select"
              aria-label={ui.statusLabel}
              value={status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="all">{ui.allStatuses}</option>
              <option value="todo">{ui.toDo}</option>
              <option value="done">{ui.completed}</option>
            </select>
          </div>
        </div>
        <div className="catalog-results-heading">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold">
              {topic === "all" ? ui.browseLabel : ui.topicNames[topic]}
            </h2>
            <span
              className="result-count"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {browsing
                ? ui.exerciseCount(filtered.length)
                : ui.results(filtered.length)}
            </span>
          </div>
          <select
            className="catalog-sort"
            aria-label={t.sortOrder}
            data-testid="exercises-sort"
            value={sortMode}
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="order">{t.sortOrder}</option>
            <option value="title">{t.sortTitle}</option>
            <option value="level">{t.sortLevel}</option>
          </select>
        </div>
        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {query && (
              <span className="filter-chip">
                <SearchIcon className="size-3" />
                {query}
              </span>
            )}
            {topic !== "all" && (
              <span className={`filter-chip topic-${topic}`}>
                <TopicIcon topic={topic} className="size-3" />
                {ui.topicNames[topic]}
              </span>
            )}
            <button
              type="button"
              className="inline-flex min-h-9 items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary"
              onClick={() => window.history.pushState(null, "", "/exercices")}
            >
              <XIcon className="size-3.5" />
              {ui.clearFilters}
            </button>
          </div>
        )}
        <div className="space-y-10">
          {groups.map((group) => (
            <section
              key={group.id}
              className={`exercise-topic-section topic-${group.id}`}
              aria-labelledby={`heading-${group.id}`}
            >
              <div className="topic-section-heading">
                <span className="topic-icon">
                  <TopicIcon topic={group.id} />
                </span>
                <h3 id={`heading-${group.id}`}>{ui.topicNames[group.id]}</h3>
                <span className="text-xs text-muted-foreground">
                  {group.exercises.length}
                </span>
                <span className="topic-heading-rule" />
              </div>
              <ul
                className={`exercise-card-grid ${browsing ? "is-preview" : ""}`}
              >
                {(browsing ? group.exercises.slice(0, 3) : group.exercises).map(
                  (exercise) => {
                    const localized = localizeExercise(exercise, locale);
                    const done = doneIds.has(exercise.id);
                    return (
                      <li key={exercise.id}>
                        <Link
                          href={`/exercices/${exercise.id}`}
                          className={`exercise-card ${done ? "is-completed" : ""}`}
                        >
                          <div className="mb-5 flex items-center justify-between gap-2">
                            <span
                              className={`level-badge level-${exercise.level ?? "debutant"}`}
                            >
                              <span />
                              {levelLabel[exercise.level ?? "debutant"]}
                            </span>
                            {done ? (
                              <CheckCircle2Icon
                                className="size-4 text-primary"
                                aria-label={t.exerciseValidated}
                              />
                            ) : (
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {templateLabel[exercise.templateId]}
                              </span>
                            )}
                          </div>
                          <h4>
                            {localized.title.replace(/^SUSE \/ Rancher — /, "")}
                          </h4>
                          <p className="exercise-description">
                            {localized.description}
                          </p>
                          <div className="exercise-card-footer">
                            <span>{done ? ui.completed : ui.openExercise}</span>
                            <ArrowUpRightIcon
                              className="size-4 transition-transform"
                              aria-hidden="true"
                            />
                          </div>
                        </Link>
                      </li>
                    );
                  },
                )}
              </ul>
              {browsing && group.exercises.length > 1 && (
                <button
                  type="button"
                  className="topic-view-all"
                  onClick={() => chooseTopic(group.id)}
                >
                  {ui.viewTopic(group.exercises.length)}
                  <ArrowRightIcon className="size-3.5" />
                </button>
              )}
            </section>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="catalog-empty">
            <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <ListFilterIcon className="size-6 text-muted-foreground" />
            </span>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {t.noResults}
            </p>
            <Button
              variant="outline"
              className="mt-5 gap-2"
              onClick={() => window.history.pushState(null, "", "/exercices")}
            >
              {ui.clearFilters}
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        )}
      </div>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.resetProgressTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.resetProgressDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white"
              onClick={() => {
                clearExerciseProgress();
                window.dispatchEvent(new Event("thor-progress"));
                setResetOpen(false);
                toast.success(t.resetSuccess);
              }}
            >
              {t.reset}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
