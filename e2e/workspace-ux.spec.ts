import { expect, test } from "@playwright/test";

async function fresh(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("thor-locale", "fr");
  });
}

test("mobile : actions accessibles et correction disponible sans barre qui déborde", async ({
  page,
}) => {
  await fresh(page);
  await page.setViewportSize({ width: 390, height: 760 });
  await page.goto("/exercices/suz-rancher-rancher-helm");
  await expect(
    page.getByRole("button", { name: "Valider", exact: true }),
  ).toBeInViewport();
  const validateBounds = (await page
    .getByRole("button", { name: "Valider", exact: true })
    .boundingBox())!;
  expect(validateBounds.x + validateBounds.width).toBeLessThanOrEqual(390);
  const context = page.getByTestId("exercise-lab-context");
  await expect(context).not.toHaveAttribute("open");
  await context
    .getByText("Contexte et prérequis du labo", { exact: true })
    .click();
  await expect(context).toHaveAttribute("open");
  await context
    .getByText("Contexte et prérequis du labo", { exact: true })
    .click();
  await page.getByRole("button", { name: "Autres actions" }).click();
  await expect(
    page.getByRole("menuitem", { name: "Copier", exact: true }),
  ).toBeVisible();
  await page.getByRole("menuitem", { name: "Hors ligne", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Sauvegarde hors ligne/i }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Valider", exact: true }).click();
  await expect(page.getByTestId("exercise-correction-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByTestId("correction-available").click();
  await expect(page.getByTestId("exercise-correction-panel")).toBeVisible();
});

test("mobile : le fichier et l’éditeur restent présents après changement d’onglet", async ({
  page,
}) => {
  await fresh(page);
  await page.setViewportSize({ width: 390, height: 760 });
  await page.goto("/exercices/suz-rancher-rancher-rbac");
  await expect(
    page.getByRole("button", { name: "Code", exact: true }),
  ).toContainText("reponses.md");
  await page.getByRole("button", { name: "Code", exact: true }).click();
  const editor = page.locator(".monaco-editor").first();
  await expect(editor).toBeVisible({ timeout: 20_000 });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("Mon travail en cours");
  await page.evaluate(() =>
    document
      .querySelector(".monaco-editor")
      ?.setAttribute("data-preserved", "yes"),
  );
  await page.getByRole("button", { name: "Aperçu", exact: true }).click();
  await expect(page.getByTestId("external-lab-preview")).toBeVisible();
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await expect(editor).toHaveAttribute("data-preserved", "yes");
  await expect(editor).toContainText("Mon travail en cours");
});

test("ordinateur : redimensionner, agrandir et restaurer les panneaux", async ({
  page,
}) => {
  await fresh(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/exercices/suz-rancher-rancher-rbac");
  const code = page.locator('[data-panel-name="editor"]').first();
  const handle = page.getByRole("separator").first();
  await expect(handle).toBeVisible();
  const before = (await code.boundingBox())!.width;
  const bounds = (await handle.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(bounds.x + 110, bounds.y + bounds.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect
    .poll(async () => (await code.boundingBox())!.width)
    .toBeLessThan(before - 50);
  const resized = (await code.boundingBox())!.width;
  await page
    .getByRole("button", { name: "Agrandir : Code", exact: true })
    .click();
  await expect
    .poll(async () => (await code.boundingBox())!.width)
    .toBeGreaterThan(1400);
  await page
    .getByRole("button", { name: "Restaurer les panneaux : Code", exact: true })
    .click();
  await expect
    .poll(async () => Math.abs((await code.boundingBox())!.width - resized))
    .toBeLessThan(3);
  await page.setViewportSize({ width: 390, height: 760 });
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect
    .poll(async () =>
      page
        .locator(".monaco-editor")
        .first()
        .evaluate((element) =>
          Math.abs(
            element.getBoundingClientRect().height -
              element.parentElement!.getBoundingClientRect().height,
          ),
        ),
    )
    .toBeLessThan(3);
  await page.goto("/playground");
  await expect(
    page.getByRole("button", { name: "Agrandir : Code", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Agrandir : Aperçu", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await page
          .locator('[data-panel-name="preview"]')
          .first()
          .boundingBox())!.width,
    )
    .toBeGreaterThan(1400);
});

test("un brouillon commencé se reprend depuis l’accueil et le catalogue", async ({
  page,
}) => {
  await fresh(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/exercices/suz-rancher-rancher-rbac");
  const editor = page.locator(".monaco-editor").first();
  await expect(editor).toBeVisible({ timeout: 20_000 });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText("Brouillon à reprendre");
  // Client-side navigation also verifies the last edit is flushed before the debounce expires.
  await page.getByRole("link", { name: "Accueil", exact: true }).click();
  await expect(page.getByTestId("resume-exercise-card")).toContainText("RBAC");
  await page.getByTestId("resume-exercise-card").click();
  await expect(page).toHaveURL(/resume=1/);
  await expect(page.getByTestId("resume-draft-dialog")).toHaveCount(0);
  await expect(page.locator(".monaco-editor").first()).toContainText(
    "Brouillon à reprendre",
  );
  await page.getByRole("link", { name: "Retour aux exercices" }).click();
  await page.getByLabel("Progression", { exact: true }).selectOption("started");
  await expect(page.locator("main ul a")).toHaveCount(1);
  await expect(page.locator("main ul a")).toContainText("Commencé");
});

test("mobile : le playground conserve les outils dans le menu", async ({
  page,
}) => {
  await fresh(page);
  await page.setViewportSize({ width: 390, height: 760 });
  await page.goto("/playground");
  await page.getByRole("button", { name: "Autres actions" }).click();
  await expect(
    page.getByRole("menuitem", { name: "Importer un ZIP" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("playground-export-offline")).toBeInViewport();
});
