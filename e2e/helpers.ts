import { expect, type Page } from "@playwright/test";
import { LOCALE_STORAGE_KEY, getMessages, type Locale } from "@/lib/i18n";

const DESKTOP_VIEWPORT = { width: 1280, height: 900 };

export async function prepareExercisePage(
  page: Page,
  exerciseId: string,
  locale: Locale = "fr"
) {
  await page.addInitScript(
    ({ key, loc }) => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem(key, loc);
    },
    { key: LOCALE_STORAGE_KEY, loc: locale }
  );

  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto(`/exercices/${encodeURIComponent(exerciseId)}`);

  const draft = page.getByTestId("resume-draft-dialog");
  if (await draft.isVisible({ timeout: 3_000 }).catch(() => false)) {
    const t = getMessages(locale).exercise;
    await page.getByRole("button", { name: t.resumeDraftFresh }).click();
  }

  await expect(page.getByRole("button", { name: getMessages(locale).exercise.validate })).toBeVisible({
    timeout: 45_000,
  });
}

export async function dismissDraftIfPresent(page: Page, locale: Locale = "fr") {
  const draft = page.getByTestId("resume-draft-dialog");
  if (await draft.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await page.getByRole("button", { name: getMessages(locale).exercise.resumeDraftFresh }).click();
  }
}

export async function runBashCommand(page: Page, command: string) {
  const input = page.getByTestId("bash-terminal-input");
  await input.click();
  await input.fill(command);
  await input.press("Enter");
}

export async function clickValidate(page: Page, locale: Locale = "fr") {
  await page.getByRole("button", { name: getMessages(locale).exercise.validate }).click();
}

export async function waitForCorrectionComplete(
  page: Page,
  criteriaCount: number,
  locale: Locale = "fr"
) {
  const panel = page.getByTestId("exercise-correction-panel");
  await expect(panel).toBeVisible();
  await expect(panel.locator("li")).toHaveCount(criteriaCount, {
    timeout: criteriaCount * 900 + 5_000,
  });
  await expect(
    page.getByText(getMessages(locale).exercise.correctionAllPassed)
  ).toBeVisible();
}

export async function openSolutionDialog(page: Page, locale: Locale = "fr") {
  const t = getMessages(locale).exercise;
  await page.getByRole("button", { name: t.solution }).click();
  await page.getByRole("button", { name: t.solutionConfirmShow }).click();
  await expect(page.getByRole("heading", { name: t.solutionDialogTitle })).toBeVisible();
}

export async function selectMonacoFile(page: Page, fileName: string) {
  await page.getByRole("button", { name: fileName }).click();
  const editor = page.locator(".monaco-editor").first();
  await expect(editor).toBeVisible({ timeout: 30_000 });
  await editor.click();
}
