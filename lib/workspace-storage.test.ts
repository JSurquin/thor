import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  readPlaygroundDraft,
  writePlaygroundDraft,
  clearPlaygroundDraft,
  readExerciseDraft,
  writeExerciseDraft,
  clearExerciseDraft,
  WORKSPACE_MAX_JSON_CHARS,
} from "./workspace-storage";

const store = new Map<string, string>();

describe("workspace-storage (playground)", () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v);
      },
      removeItem: (k: string) => {
        store.delete(k);
      },
    });
    clearPlaygroundDraft();
  });

  it("write puis read retourne le brouillon", () => {
    expect(writePlaygroundDraft({
      templateId: "react",
      files: { "/App.js": "x" },
      selectedFile: "/App.js",
    })).toBe(true);
    const d = readPlaygroundDraft();
    expect(d?.templateId).toBe("react");
    expect(d?.files["/App.js"]).toBe("x");
    expect(d?.selectedFile).toBe("/App.js");
  });

  it("clear supprime le brouillon", () => {
    writePlaygroundDraft({
      templateId: "html",
      files: { "/index.html": "<p/>" },
      selectedFile: "/index.html",
    });
    clearPlaygroundDraft();
    expect(readPlaygroundDraft()).toBeNull();
  });

  it("refuse les JSON trop volumineux", () => {
    const huge = "x".repeat(WORKSPACE_MAX_JSON_CHARS + 100);
    const ok = writePlaygroundDraft({
      templateId: "react",
      files: { "/App.js": huge },
      selectedFile: "/App.js",
    });
    expect(ok).toBe(false);
  });
});

describe("workspace-storage (exercise)", () => {
  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    });
  });

  it("isole par exerciseId", () => {
    writeExerciseDraft({
      exerciseId: "a",
      files: { "/f": "1" },
      selectedFile: "/f",
    });
    writeExerciseDraft({
      exerciseId: "b",
      files: { "/f": "2" },
      selectedFile: "/f",
    });
    expect(readExerciseDraft("a")?.files["/f"]).toBe("1");
    expect(readExerciseDraft("b")?.files["/f"]).toBe("2");
    clearExerciseDraft("a");
    expect(readExerciseDraft("a")).toBeNull();
    expect(readExerciseDraft("b")).not.toBeNull();
  });
});
