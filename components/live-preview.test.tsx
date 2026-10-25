import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "./locale-provider";
import LivePreview from "./live-preview";

const bus = vi.hoisted(() => ({
  listeners: new Set<
    (message: { type: string; compilatonError?: boolean }) => void
  >(),
}));
vi.mock("@codesandbox/sandpack-react", () => ({
  SandpackProvider: ({ children }: { children: React.ReactNode }) => children,
  SandpackPreview: () => <iframe title="test preview" />,
  useSandpack: () => ({
    sandpack: { error: null, status: "running" },
    listen: (
      listener: (message: { type: string; compilatonError?: boolean }) => void,
    ) => {
      bus.listeners.add(listener);
      return () => {
        bus.listeners.delete(listener);
      };
    },
  }),
}));
function emit(message: { type: string; compilatonError?: boolean }) {
  act(() => {
    bus.listeners.forEach((listener) => listener(message));
  });
}

describe("états de l’aperçu", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    bus.listeners.clear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("explique une attente prolongée, relance puis affiche le résultat prêt", () => {
    render(
      <LocaleProvider>
        <LivePreview files={{ "/App.js": "" }} template="react" />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
      "Préparation",
    );
    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
      "Vérifiez votre connexion",
    );
    fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
      "Préparation",
    );
    emit({ type: "done" });
    expect(screen.queryByTestId("preview-feedback")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Aperçu prêt");
  });
  it("annonce une erreur de compilation puis suit une nouvelle compilation", () => {
    render(
      <LocaleProvider>
        <LivePreview files={{ "/App.js": "" }} template="react" />
      </LocaleProvider>,
    );
    emit({ type: "done", compilatonError: true });
    expect(screen.getByRole("alert")).toHaveTextContent("erreur");
    emit({ type: "start" });
    expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
      "Préparation",
    );
    emit({ type: "done" });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
