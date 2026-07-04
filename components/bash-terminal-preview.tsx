"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBashShell, type CommandResult } from "@/lib/bash-shell";

type HistoryLine = {
  kind: "prompt" | "stdout" | "stderr";
  text: string;
};

function formatPrompt(cwd: string, user: string): string {
  const short = cwd.replace(/^\/home\/etudiant/, "~") || "~";
  return `${user}@thor:${short}$`;
}

export function BashTerminalPreview() {
  const shellRef = useRef(createBashShell());
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(() => shellRef.current.getState().cwd);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const user = shellRef.current.getState().env.USER ?? "etudiant";
  const prompt = formatPrompt(cwd, user);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  const appendResult = useCallback((command: string, result: CommandResult) => {
    setCwd(shellRef.current.getState().cwd);
    setHistory((prev) => {
      const next: HistoryLine[] = [
        ...prev,
        { kind: "prompt", text: `${formatPrompt(shellRef.current.getState().cwd, user)} ${command}` },
      ];
      if (result.stdout) next.push({ kind: "stdout", text: result.stdout });
      if (result.stderr) next.push({ kind: "stderr", text: result.stderr });
      return next;
    });
  }, [user]);

  const runCommand = useCallback(
    (raw: string) => {
      const line = raw.trim();
      if (!line) return;
      if (line === "clear") {
        setHistory([]);
        return;
      }
      const result = shellRef.current.execute(line);
      appendResult(line, result);
    },
    [appendResult]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const line = input;
    setInput("");
    runCommand(line);
  };

  return (
    <div
      className="flex flex-col h-full min-h-[280px] rounded-lg border border-border bg-[#0d1117] text-[#c9d1d9] font-mono text-sm overflow-hidden"
      onClick={() => inputRef.current?.focus()}
      data-testid="bash-terminal-preview"
    >
      <div className="px-3 py-2 border-b border-border/40 text-xs text-muted-foreground bg-muted/10">
        Terminal Bash simulé — tapez ls, cd, pwd, cat, mkdir, help…
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-1">
        {history.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Exemple : <span className="text-foreground">ls</span>,{" "}
            <span className="text-foreground">cd Documents</span>,{" "}
            <span className="text-foreground">cat notes.txt</span>
          </p>
        ) : null}
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.kind === "stderr"
                ? "text-red-400 whitespace-pre-wrap"
                : line.kind === "prompt"
                  ? "text-green-400 whitespace-pre-wrap"
                  : "whitespace-pre-wrap"
            }
          >
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-green-400 shrink-0">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[#c9d1d9] caret-[#c9d1d9]"
            spellCheck={false}
            autoComplete="off"
            aria-label="Commande bash"
            data-testid="bash-terminal-input"
          />
        </form>
      </div>
    </div>
  );
}
