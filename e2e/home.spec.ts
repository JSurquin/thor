import { test, expect } from "@playwright/test";

test("home affiche le lien vers le playground", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /ouvrir le playground/i })
  ).toBeVisible();
});

test("navigation vers le playground depuis l’accueil", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /ouvrir le playground/i }).click();
  await expect(page).toHaveURL(/\/playground/);
});
