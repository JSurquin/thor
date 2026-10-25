"use client";

import { useEffect, useState } from "react";
import { PreviewFeedback } from "./preview-feedback";

export function HtmlPreview({
  srcDoc,
  title,
}: {
  srcDoc: string;
  title: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const documentKey = `${attempt}:${srcDoc}`;
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const phase =
    failed === documentKey
      ? "error"
      : loaded === documentKey
        ? "ready"
        : "loading";
  useEffect(() => {
    if (phase !== "loading") return;
    const timer = window.setTimeout(() => setFailed(documentKey), 15_000);
    return () => window.clearTimeout(timer);
  }, [phase, documentKey]);
  return (
    <div className="live-preview-surface">
      <iframe
        key={attempt}
        title={title}
        srcDoc={srcDoc}
        className="w-full min-h-[320px] rounded-xl border border-border bg-white"
        sandbox="allow-scripts"
        onLoad={() => {
          setFailed(null);
          setLoaded(documentKey);
        }}
        onError={() => setFailed(documentKey)}
      />
      <PreviewFeedback
        phase={phase}
        onRetry={() => setAttempt((value) => value + 1)}
      />
    </div>
  );
}
