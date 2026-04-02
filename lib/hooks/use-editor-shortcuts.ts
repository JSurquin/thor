import { useEffect, useRef } from "react";

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  if (el.closest?.(".monaco-editor")) return true;
  return false;
}

export type EditorShortcutHandlers = {
  onCopyFile?: () => void;
  onExportOffline?: () => void;
  onShowHelp?: () => void;
  onFocusInstructions?: () => void;
  onFocusEditor?: () => void;
  onFocusPreview?: () => void;
};

export function useEditorShortcuts(h: EditorShortcutHandlers) {
  const ref = useRef(h);

  useEffect(() => {
    ref.current = h;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      const mod = e.metaKey || e.ctrlKey;
      const { current: c } = ref;

      if (e.key === "?" || (mod && e.key === "/")) {
        e.preventDefault();
        c.onShowHelp?.();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        c.onCopyFile?.();
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        c.onExportOffline?.();
        return;
      }
      if (mod && e.key.toLowerCase() === "e") {
        e.preventDefault();
        c.onFocusEditor?.();
        return;
      }
      if (mod && e.key.toLowerCase() === "i") {
        e.preventDefault();
        c.onFocusInstructions?.();
        return;
      }
      if (mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
        c.onFocusPreview?.();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
