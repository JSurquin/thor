import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { LocaleProvider } from "@/components/locale-provider";

describe("Home", () => {
  it("renders main heading", () => {
    render(
      <LocaleProvider>
        <Home />
      </LocaleProvider>,
    );
    expect(
      screen.getByRole("heading", { name: /playground/i }),
    ).toBeInTheDocument();
  });

  it("renders link to playground", () => {
    render(
      <LocaleProvider>
        <Home />
      </LocaleProvider>,
    );
    const links = screen.getAllByRole("link", {
      name: /ouvrir le playground/i,
    });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/playground");
  });
});
