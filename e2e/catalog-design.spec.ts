import { expect, test } from "@playwright/test";

async function french(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem("thor-locale", "fr");
  });
}

test("thèmes, recherche, filtres et retour à la liste conservent leur état", async ({
  page,
}) => {
  await french(page);
  await page.goto("/exercices");
  await page.getByTestId("topic-security").click();
  await expect(page).toHaveURL(/theme=security/);
  await expect(
    page.getByRole("heading", {
      name: "Sécurité & accès",
      exact: true,
      level: 3,
    }),
  ).toBeVisible();
  await page.getByTestId("exercises-search").fill("dev-user demo-project");
  await expect(page.locator("main ul a")).toHaveCount(1);
  await page.locator("main ul a").click();
  await expect(page).toHaveURL(/suz-rancher-rancher-rbac$/);
  await page.goBack();
  await expect(page.getByTestId("exercises-search")).toHaveValue(
    "dev-user demo-project",
  );
  await expect(page.getByTestId("topic-security")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page
    .getByRole("button", { name: "Effacer la recherche", exact: true })
    .click();
  await expect(page.getByTestId("exercises-search")).toBeFocused();
  await page
    .getByLabel("Tous les niveaux", { exact: true })
    .selectOption("avance");
  await expect(page).toHaveURL(/level=avance/);
  await page
    .getByRole("button", { name: "Effacer les filtres", exact: true })
    .click();
  await expect(page).toHaveURL(/\/exercices$/);
});

test("recherche vide et progression locale sont utilisables", async ({
  page,
}) => {
  await french(page);
  await page.goto("/exercices?q=introuvable-xyz");
  await expect(page.locator("main ul a")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 résultat");
  await page
    .getByRole("button", { name: "Effacer les filtres", exact: true })
    .first()
    .click();
  await page.evaluate(() => {
    localStorage.setItem(
      "thor.exercise.progress.v1",
      JSON.stringify(["suz-rancher-rancher-rbac"]),
    );
    window.dispatchEvent(new Event("thor-progress"));
  });
  await page.getByLabel("Progression", { exact: true }).selectOption("done");
  await expect(page.locator("main ul a")).toHaveCount(1);
  await expect(page.locator("main ul a")).toHaveAttribute(
    "href",
    "/exercices/suz-rancher-rancher-rbac",
  );
  await page
    .getByRole("button", { name: "Réinitialiser", exact: true })
    .click();
  const dialog = page.getByRole("alertdialog");
  await dialog.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(page.locator("main ul a")).toHaveCount(1);
});

test("le catalogue mobile et l’accueil restent accessibles sans débordement", async ({
  page,
}) => {
  await french(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page
    .getByRole("link", { name: "Explorer les exercices", exact: true })
    .click();
  await expect(page.getByTestId("exercises-search")).toBeVisible();
  await page.getByTestId("topic-rancher").click();
  await expect(page.getByTestId("topic-rancher")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByTestId("exercises-search").fill("helm");
  await expect(page.locator("main ul a").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("Monaco est servi localement et permet de valider une réponse éditée", async ({
  page,
}) => {
  await french(page);
  const externalMonacoRequests: string[] = [];
  page.on("request", (request) => {
    if (
      request.url().includes("cdn.jsdelivr.net") &&
      request.url().includes("monaco-editor")
    )
      externalMonacoRequests.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/exercices/suz-rancher-rancher-rbac");
  const editor = page.locator(".monaco-editor").first();
  await expect(editor).toBeVisible({ timeout: 30_000 });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.insertText(
    "Utilisateur dev-user, projet demo-project, rôle Project Member. Vérification des accès depuis le compte de test.",
  );
  await page.getByRole("button", { name: "Valider", exact: true }).click();
  await expect(
    page.getByText("Tous les critères sont validés !").first(),
  ).toBeVisible({ timeout: 10_000 });
  expect(externalMonacoRequests).toEqual([]);
});
