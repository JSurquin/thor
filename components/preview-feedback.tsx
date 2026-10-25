"use client";
import { AlertCircleIcon, LoaderCircleIcon, RotateCcwIcon } from "lucide-react";
import { useLocale } from "./locale-provider";
import { Button } from "./ui/button";
export function PreviewFeedback({
  phase,
  error,
  onRetry,
}: {
  phase: "loading" | "slow" | "error" | "ready";
  error?: string;
  onRetry: () => void;
}) {
  const { messages } = useLocale();
  const t = messages.ux;
  if (phase === "ready")
    return (
      <span className="sr-only" role="status">
        {t.previewReady}
      </span>
    );
  return (
    <div
      className="preview-feedback"
      data-testid="preview-feedback"
      role={phase === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {phase === "loading" ? (
        <LoaderCircleIcon className="size-6 animate-spin text-primary" />
      ) : (
        <AlertCircleIcon className="size-6 text-primary" />
      )}
      <p>
        {phase === "loading"
          ? t.previewLoading
          : phase === "slow"
            ? t.previewSlow
            : t.previewError}
      </p>
      {error && (
        <details className="w-full text-left text-xs">
          <summary>{t.errorDetails}</summary>
          <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words">
            {error}
          </pre>
        </details>
      )}
      {phase !== "loading" && (
        <Button variant="outline" className="gap-2" onClick={onRetry}>
          <RotateCcwIcon className="size-4" />
          {t.retry}
        </Button>
      )}
    </div>
  );
}
