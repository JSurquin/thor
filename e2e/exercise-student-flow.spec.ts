import { test, expect } from "@playwright/test";
import { LOCALES, getMessages } from "@/lib/i18n";
import {
  clickValidate,
  openSolutionDialog,
  prepareExercisePage,
  runBashCommand,
  waitForCorrectionComplete,
  selectMonacoFile,
} from "./helpers";

test.describe("parcours élève — exercice Bash", () => {
  test("commandes terminal, validation et correction animée", async ({ page }) => {
    await prepareExercisePage(page, "bash-terminal-decouverte");

    await expect(page.getByTestId("bash-terminal-preview")).toBeVisible();
    await runBashCommand(page, "ls");
    await expect(page.getByText("Documents")).toBeVisible();
    await expect(page.getByText("Downloads")).toBeVisible();

    await runBashCommand(page, "cd Documents");
    await runBashCommand(page, "pwd");
    await expect(page.getByText(/\/home\/etudiant\/Documents/)).toBeVisible();

    await clickValidate(page);

    const panel = page.getByTestId("exercise-correction-panel");
    await expect(panel).toBeVisible();
    await expect(panel.locator("li")).toHaveCount(1, { timeout: 3_000 });
    await waitForCorrectionComplete(page, 3);
  });

  test("bouton Solution affiche le récapitulatif animé", async ({ page }) => {
    await prepareExercisePage(page, "bash-terminal-decouverte");
    await clickValidate(page);
    await waitForCorrectionComplete(page, 3);

    await openSolutionDialog(page);
    await expect(page.getByText(/bash-shell\.ts|registre de commandes/i)).toBeVisible({
      timeout: 5_000,
    });
  });
});

test.describe("parcours élève — exercice HTML", () => {
  test("édition du code, validation et panneau de correction", async ({ page }) => {
    await prepareExercisePage(page, "html-titre-couleur");

    await selectMonacoFile(page, "index.html");
    await page.keyboard.press("ControlOrMeta+KeyA");
    await page.keyboard.insertText(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Ma page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Marie</h1>
  <p>Modifiez index.html et style.css.</p>
</body>
</html>`);

    await clickValidate(page);
    await waitForCorrectionComplete(page, 2);
  });
});

test.describe("correction et libellés par langue", () => {
  for (const locale of LOCALES) {
    test(`exercice Bash en ${locale} — titre de correction localisé`, async ({ page }) => {
      const t = getMessages(locale).exercise;
      await prepareExercisePage(page, "bash-terminal-decouverte", locale);
      await clickValidate(page, locale);

      await expect(page.getByTestId("exercise-correction-panel")).toBeVisible();
      await expect(page.getByText(t.correctionTitle)).toBeVisible();
      await waitForCorrectionComplete(page, 3, locale);
    });
  }
});
