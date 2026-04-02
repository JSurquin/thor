import { test, expect } from "@playwright/test";

test("playground charge la barre d’outils et l’export hors ligne", async ({
  page,
}) => {
  await page.goto("/playground");
  await expect(page.getByRole("link", { name: /lab\.andromed/i })).toBeVisible();
  await expect(page.getByTestId("playground-export-offline")).toBeVisible();
});

test("ouvre la modale de sauvegarde hors ligne", async ({ page }) => {
  await page.goto("/playground");
  await page.getByTestId("playground-export-offline").click();
  await expect(
    page.getByRole("heading", { name: /sauvegarde hors ligne/i })
  ).toBeVisible();
  await expect(page.getByTestId("offline-export-download")).toBeVisible();
});

test("le bouton Télécharger est activé une fois le ZIP prêt", async ({
  page,
}) => {
  await page.goto("/playground");
  await page.getByTestId("playground-export-offline").click();
  await expect(page.getByTestId("offline-export-download")).toBeEnabled({
    timeout: 15_000,
  });
});
