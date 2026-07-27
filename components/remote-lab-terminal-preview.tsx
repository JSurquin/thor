"use client";

import { useCallback, useEffect, useState } from "react";
import { CloudIcon, Loader2Icon, PowerIcon, ServerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResolvedExerciseRuntime } from "@/lib/lab-runtime";
import { LAB_PROVIDER_ESTIMATES } from "@/lib/lab-runtime";
import { useLocale } from "@/components/locale-provider";

type LabSessionResponse = {
  session: {
    id: string;
    status: string;
    terminalUrl?: string;
    maxMinutes: number;
    estimatedUsdPerMinute: number;
    provider: "azure" | "aws";
    expiresAt: string;
  };
};

type RemoteLabTerminalPreviewProps = {
  exerciseId: string;
  runtime: ResolvedExerciseRuntime;
};

export function RemoteLabTerminalPreview({
  exerciseId,
  runtime,
}: RemoteLabTerminalPreviewProps) {
  const { messages } = useLocale();
  const t = messages.remoteLab;
  const estimate = LAB_PROVIDER_ESTIMATES[runtime.provider];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<LabSessionResponse["session"] | null>(
    null
  );

  const stopSession = useCallback(async (sessionId: string) => {
    await fetch(`/api/labs/sessions/${sessionId}`, { method: "DELETE" });
  }, []);

  useEffect(() => {
    return () => {
      if (session?.id) {
        void stopSession(session.id);
      }
    };
  }, [session?.id, stopSession]);

  const startLab = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/labs/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          provider: runtime.provider,
          image: runtime.image,
          maxMinutes: runtime.maxMinutes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.startError);
        return;
      }
      setSession((data as LabSessionResponse).session);
    } catch {
      setError(t.startError);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!session) return;
    setLoading(true);
    try {
      await stopSession(session.id);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full min-h-[280px] rounded-lg border border-border bg-[#0d1117] text-[#c9d1d9] overflow-hidden"
      data-testid="remote-lab-terminal-preview"
    >
      <div className="px-3 py-2 border-b border-border/40 text-xs text-muted-foreground bg-muted/10 flex items-center gap-2">
        <CloudIcon className="size-3.5 shrink-0" />
        {t.header(runtime.image, estimate.label)}
      </div>

      <div className="flex-1 p-4 space-y-4">
        <p className="text-sm text-muted-foreground">{t.description}</p>

        <div className="rounded-md border border-border/50 bg-muted/5 p-3 text-xs space-y-1">
          <p className="flex items-center gap-2">
            <ServerIcon className="size-3.5 shrink-0" />
            {t.billingInfo(
              estimate.usdPerMinute.toFixed(3),
              String(runtime.maxMinutes)
            )}
          </p>
          <p className="text-muted-foreground">{t.billingNote}</p>
        </div>

        {error ? (
          <p className="text-sm text-amber-400/90" role="alert">
            {error}
          </p>
        ) : null}

        {session ? (
          <div className="space-y-3">
            <p className="text-sm text-green-400">{t.sessionReady(session.id)}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {t.terminalPlaceholder}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStop}
              disabled={loading}
              className="touch-manipulation"
            >
              {loading ? (
                <Loader2Icon className="size-4 animate-spin mr-2" />
              ) : (
                <PowerIcon className="size-4 mr-2" />
              )}
              {t.stopLab}
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={startLab}
            disabled={loading}
            className="touch-manipulation"
            data-testid="remote-lab-start"
          >
            {loading ? (
              <Loader2Icon className="size-4 animate-spin mr-2" />
            ) : (
              <CloudIcon className="size-4 mr-2" />
            )}
            {t.startLab}
          </Button>
        )}
      </div>
    </div>
  );
}
