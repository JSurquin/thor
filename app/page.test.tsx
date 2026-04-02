import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders main heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /playground/i })
    ).toBeInTheDocument();
  });

  it("renders link to playground", () => {
    render(<Home />);
    const links = screen.getAllByRole("link", { name: /ouvrir le playground/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", "/playground");
  });

});
