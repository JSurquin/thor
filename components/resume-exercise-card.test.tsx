import { act, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ResumeExerciseCard } from "./resume-exercise-card";
import { LocaleProvider } from "./locale-provider";
import {
  writeExerciseDraft,
  clearExerciseDraft,
} from "@/lib/workspace-storage";
import { markExerciseCompleted } from "@/lib/progress-storage";

it("reprend le dernier brouillon inachevé, ignore les exercices terminés et suit les suppressions", () => {
  localStorage.clear();
  for (const [id, savedAt] of [
    ["a", 100],
    ["b", 200],
  ] as const) {
    writeExerciseDraft({
      exerciseId: id,
      files: { "/f": "code" },
      selectedFile: "/f",
      savedAt,
    });
  }
  markExerciseCompleted("b");
  render(
    <LocaleProvider>
      <ResumeExerciseCard
        entries={[
          { id: "a", title: "Exercice A" },
          { id: "b", title: "Exercice B" },
        ]}
      />
    </LocaleProvider>,
  );
  expect(screen.getByTestId("resume-exercise-card")).toHaveAttribute(
    "href",
    "/exercices/a?resume=1",
  );
  expect(screen.getByTestId("resume-exercise-card")).toHaveTextContent(
    "Exercice A",
  );
  act(() => {
    clearExerciseDraft("a");
  });
  expect(screen.queryByTestId("resume-exercise-card")).not.toBeInTheDocument();
});
