"use client";

import { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackPreview,
  useSandpack,
  type SandpackProviderProps,
} from "@codesandbox/sandpack-react";
import { PreviewFeedback } from "./preview-feedback";

function SandpackSurface({ onRetry }: { onRetry: () => void }) {
  const { sandpack, listen } = useSandpack();
  const [phase, setPhase] = useState<"loading" | "slow" | "error" | "ready">(
    "loading",
  );
  useEffect(
    () =>
      listen((message) => {
        if (message.type === "start") setPhase("loading");
        if (message.type === "done")
          setPhase(message.compilatonError ? "error" : "ready");
      }),
    [listen],
  );
  useEffect(() => {
    if (phase !== "loading" || sandpack.status === "initial" || sandpack.status === "idle") return;
    const timeout = window.setTimeout(() => setPhase("slow"), 15_000);
    return () => window.clearTimeout(timeout);
  }, [phase, sandpack.status]);
  const effectivePhase = sandpack.error
    ? "error"
    : sandpack.status === "timeout"
      ? "slow"
      : phase;
  return (
    <div className="live-preview-surface">
      <SandpackPreview
        showOpenInCodeSandbox={false}
        showSandpackErrorOverlay={false}
        style={{ minHeight: 320, borderRadius: 12 }}
      />
      <PreviewFeedback
        phase={effectivePhase}
        error={sandpack.error?.message}
        onRetry={onRetry}
      />
    </div>
  );
}

export default function LivePreview({
  files,
  template,
  theme,
}: Pick<SandpackProviderProps, "files" | "template" | "theme">) {
  const [attempt, setAttempt] = useState(0);
  return (
    <SandpackProvider
      key={attempt}
      files={files}
      template={template}
      theme={theme}
      options={{ recompileMode: "delayed", recompileDelay: 400 }}
    >
      <SandpackSurface onRetry={() => setAttempt((value) => value + 1)} />
    </SandpackProvider>
  );
}
