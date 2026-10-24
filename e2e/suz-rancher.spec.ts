import { readFile } from "node:fs/promises";
import JSZip from "jszip";
import { expect, test } from "@playwright/test";
import { clickValidate, openSolutionDialog, prepareExercisePage } from "./helpers";

test("le catalogue permet de retrouver les 52 entrées SUSE / Rancher", async ({ page }) => {
  await page.goto("/exercices");
  await page.getByTestId("exercises-search").fill("SUSE / Rancher");
  await expect(page.locator('main ul a[href^="/exercices/suz-rancher-"]')).toHaveCount(52);
  await page.getByTestId("exercises-search").fill("RBAC");
  await page.getByRole("link", { name: /Rancher : RBAC/ }).click();
  await expect(page).toHaveURL(/suz-rancher-rancher-rbac$/);
});

test("un TP Rancher explique le labo externe, rejette la réponse vide et fournit le corrigé", async ({ page }) => {
  await prepareExercisePage(page, "suz-rancher-rancher-rbac");
  const preview = page.getByTestId("external-lab-preview");
  await expect(preview).toBeVisible();
  await expect(preview).toContainText("Labo externe");
  await expect(page.getByTestId("remote-lab-terminal-preview")).toHaveCount(0);
  await expect(page.getByTestId("bash-terminal-input")).toHaveCount(0);
  await clickValidate(page);
  await expect(page.getByTestId("exercise-correction-panel").locator("li")).toHaveCount(3, { timeout: 10_000 });
  await expect(page.getByText("Corrigez les points signalés ci-dessus.")).toBeVisible();
  await page.keyboard.press("Escape");
  await openSolutionDialog(page);
  await expect(page.getByRole("dialog")).toContainText("Project Member");
});

test("le projet final exporte les applications et les manifests du lab", async ({ page }) => {
  await prepareExercisePage(page, "suz-rancher-projet-final");
  await page.getByTestId("exercise-export-offline").click();
  const button = page.getByTestId("offline-export-download");
  await expect(button).toBeEnabled({ timeout: 15_000 });
  const downloadPromise = page.waitForEvent("download");
  await button.click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(file).toBeTruthy();
  const zip = await JSZip.loadAsync(await readFile(file!));
  for (const name of ["nextjs-demo", "java-demo", "node-api", "python-api"]) {
    expect(zip.file(`lab/apps/${name}/Dockerfile`)).not.toBeNull();
  }
  expect(zip.file("lab/docker-compose.yml")).not.toBeNull();
  expect(zip.file("lab/k8s/60-ingress.yaml")).not.toBeNull();
  expect(zip.file("lab/scripts/setup-server.sh")).toBeNull();
});
