import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExerciseInstructions } from "./exercise-instructions";

describe("énoncés Markdown", () => {
  it("rend titres, listes, code et tableaux du support", () => {
    const { container } = render(
      <ExerciseInstructions
        content={
          "## Objectif\n\n1. Créer un pod\n2. Vérifier son état\n\n```yaml\nkind: Pod\n```\n\n| Nom | Port |\n| --- | --- |\n| nginx | 80 |"
        }
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Objectif", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(container.querySelector("pre code")).toHaveTextContent("kind: Pod");
    expect(screen.getByRole("table")).toHaveTextContent("nginx");
  });

  it("ne rend ni HTML actif ni lien javascript depuis les données", () => {
    const { container } = render(
      <ExerciseInstructions
        content={
          "<script>alert(1)</script>\n\n[lien](javascript:alert)\n\n[Documentation](https://kubernetes.io/docs/)"
        }
      />,
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector('[href^="javascript:"]')).toBeNull();
    expect(screen.getByRole("link", { name: "Documentation" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});

it("garde le contexte du labo replié et toutes les consignes disponibles", () => {
  render(
    <ExerciseInstructions
      content={
        "## Réalisation dans Thor\nUn labo externe est nécessaire.\n\n# Exercice 1\n\n## Objectif\nInstaller Rancher."
      }
    />,
  );
  const context = screen.getByTestId("exercise-lab-context");
  expect(context).not.toHaveAttribute("open");
  expect(context).toHaveTextContent("Un labo externe est nécessaire.");
  expect(screen.getByRole("heading", { name: "Objectif" })).toBeVisible();
  expect(screen.getByText("Installer Rancher.")).toBeVisible();
});
