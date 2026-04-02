import { test, expect } from "@playwright/test";

test("depuis la liste, ouvrir un exercice et la sauvegarde hors ligne", async ({
  page,
}) => {
  await page.goto("/exercices");
  await expect(page.getByTestId("exercises-search")).toBeVisible();
  await page.locator("main ul").getByRole("link").first().click();
  await expect(page).toHaveURL(/\/exercices\/.+/);
  await expect(page.getByTestId("exercise-export-offline")).toBeVisible();
  await page.getByTestId("exercise-export-offline").click();
  await expect(
    page.getByRole("heading", { name: /sauvegarde hors ligne/i })
  ).toBeVisible();
  await expect(page.getByTestId("offline-export-download")).toBeEnabled({
    timeout: 15_000,
  });
});
