import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
afterEach(() => vi.useRealTimers());
import { HtmlPreview } from "./html-preview";
import { LocaleProvider } from "./locale-provider";

it("suit le chargement du document HTML, ses changements et une relance", () => {
  vi.useFakeTimers();
  const view = render(
    <LocaleProvider>
      <HtmlPreview title="Aperçu" srcDoc="<p>Bonjour</p>" />
    </LocaleProvider>,
  );
  fireEvent.load(screen.getByTitle("Aperçu"));
  expect(screen.queryByTestId("preview-feedback")).not.toBeInTheDocument();
  view.rerender(
    <LocaleProvider>
      <HtmlPreview title="Aperçu" srcDoc="<p>Modifié</p>" />
    </LocaleProvider>,
  );
  expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
    "Préparation",
  );
  act(() => {
    vi.advanceTimersByTime(15_000);
  });
  expect(screen.getByRole("alert")).toHaveTextContent("erreur");
  fireEvent.click(screen.getByRole("button", { name: "Réessayer" }));
  expect(screen.getByTestId("preview-feedback")).toHaveTextContent(
    "Préparation",
  );
  fireEvent.load(screen.getByTitle("Aperçu"));
  expect(screen.queryByTestId("preview-feedback")).not.toBeInTheDocument();
});
