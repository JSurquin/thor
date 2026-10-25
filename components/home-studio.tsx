"use client";

import Link from "next/link";
import { ResumeExerciseCard, type ResumeEntry } from "./resume-exercise-card";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BracesIcon,
  CheckIcon,
  DownloadIcon,
  EyeIcon,
  SparklesIcon,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { TopicIcon } from "@/components/topic-icon";
import { useLocale } from "@/components/locale-provider";
import type { ExerciseTopic } from "@/lib/exercise-topics";

export function HomeStudio({
  count,
  templateCount,
  topics,
  resumeEntries,
}: {
  count: number;
  templateCount: number;
  topics: { id: ExerciseTopic; count: number }[];
  resumeEntries: ResumeEntry[];
}) {
  const { messages } = useLocale();
  const t = messages.studio;
  return (
    <div className="studio-page">
      <SiteHeader />
      <main>
        <div className="site-container pt-5 empty:hidden">
          <ResumeExerciseCard entries={resumeEntries} />
        </div>
        <section className="site-container hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              {t.eyebrow}
            </div>
            <h1>
              {t.homeTitle}
              <br />
              <span className="text-primary">{t.homeAccent}</span>
            </h1>
            <p className="hero-description">{t.homeDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/exercices"
                className="studio-button studio-button-primary"
              >
                {t.explore}
                <ArrowRightIcon className="size-4" />
              </Link>
              <Link
                href="/playground"
                className="studio-button studio-button-secondary"
              >
                {t.openPlayground}
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
            <div className="hero-stats">
              <span>
                <strong>{count}</strong>
                {t.exercises.toLowerCase()}
              </span>
              <span>
                <strong>{topics.length}</strong>
                {t.themes}
              </span>
              <span>
                <strong>{templateCount}</strong>templates
              </span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-orbit visual-orbit-one" />
            <div className="visual-orbit visual-orbit-two" />
            <div className="demo-editor">
              <div className="demo-titlebar">
                <span className="flex gap-1.5">
                  <i />
                  <i />
                  <i />
                </span>
                <span>mon-premier-projet</span>
                <BracesIcon className="size-4" />
              </div>
              <div className="demo-filebar">
                <span className="demo-file-active">App.jsx</span>
                <span>style.css</span>
                <span className="ml-auto text-primary">React</span>
              </div>
              <div className="demo-code">
                <span className="code-line">
                  <em>01</em>
                  <span>
                    <b>import</b> {"{ useState }"} <b>from</b>{" "}
                    <i>&quot;react&quot;</i>;
                  </span>
                </span>
                <span className="code-line">
                  <em>02</em>
                  <span />
                </span>
                <span className="code-line">
                  <em>03</em>
                  <span>
                    <b>export default function</b> <strong>App</strong>() {"{"}
                  </span>
                </span>
                <span className="code-line">
                  <em>04</em>
                  <span>
                    {" "}
                    <b>const</b> [count, setCount] = <strong>useState</strong>(
                    <i>0</i>);
                  </span>
                </span>
                <span className="code-line">
                  <em>05</em>
                  <span />
                </span>
                <span className="code-line">
                  <em>06</em>
                  <span>
                    {" "}
                    <b>return</b> (
                  </span>
                </span>
                <span className="code-line">
                  <em>07</em>
                  <span>
                    {" "}
                    &lt;<strong>button</strong> onClick=
                    {"{() => setCount(count + 1)}"}&gt;
                  </span>
                </span>
                <span className="code-line">
                  <em>08</em>
                  <span> {"{count}"} ✨</span>
                </span>
                <span className="code-line">
                  <em>09</em>
                  <span>
                    {" "}
                    &lt;/<strong>button</strong>&gt;
                  </span>
                </span>
                <span className="code-line">
                  <em>10</em>
                  <span> );</span>
                </span>
                <span className="code-line">
                  <em>11</em>
                  <span>{"}"}</span>
                </span>
              </div>
              <div className="demo-status">
                <span>
                  <span className="status-dot" />
                  {t.readyLabel}
                </span>
                <span>JavaScript · UTF-8</span>
              </div>
            </div>
            <div className="demo-preview">
              <span className="demo-preview-label">
                <EyeIcon className="size-3.5" />
                {t.previewLabel}
              </span>
              <div className="demo-counter">
                01<span>✨</span>
              </div>
              <div className="demo-preview-rule" />
              <span className="text-xs text-muted-foreground">
                {t.previewFeature}
              </span>
            </div>
            <div className="demo-chip">
              <span>
                <CheckIcon className="size-3.5" />
              </span>
              {t.exerciseCount(count)}
              <SparklesIcon className="ml-1 size-3.5 text-primary" />
            </div>
          </div>
        </section>
        <div className="site-container">
          <div className="feature-strip">
            {[
              [BracesIcon, t.editorFeature],
              [EyeIcon, t.previewFeature],
              [DownloadIcon, t.exportFeature],
            ].map(([Icon, label], index) => {
              const FeatureIcon = Icon as typeof BracesIcon;
              return (
                <div key={index}>
                  <FeatureIcon className="size-4 text-primary" />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
        <section id="themes" className="site-container py-14 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="section-kicker">{t.topicsLabel}</p>
              <h2 className="section-title">{t.topicsTitle}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                {t.topicsDescription}
              </p>
            </div>
            <Link
              href="/exercices"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              {t.allTopics}
              <ArrowDownIcon className="size-4 -rotate-90" />
            </Link>
          </div>
          <div className="home-topics-grid">
            {topics.map((topic, index) => (
              <Link
                href={`/exercices?theme=${topic.id}`}
                className={`home-topic-card topic-${topic.id}`}
                key={topic.id}
              >
                <div className="mb-7 flex items-start justify-between">
                  <span className="topic-icon">
                    <TopicIcon topic={topic.id} />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-semibold">{t.topicNames[topic.id]}</h3>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.exerciseCount(topic.count)}</span>
                  <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
