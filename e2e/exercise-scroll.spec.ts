import { expect, test } from "@playwright/test";

test("un énoncé long reste défilable sur mobile sans déplacer les onglets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/exercices/suz-rancher-rancher-helm");
  const instructions = page.locator("aside .instruction-content").locator("..");
  const source = instructions.getByRole("link", { name: /github.com/ });
  const codeTab = page.getByRole("button", { name: "Code", exact: true });
  await expect(codeTab).toBeVisible();
  const tabTop = (await codeTab.boundingBox())!.y;
  await expect
    .poll(() =>
      instructions.evaluate((element) => ({
        overflows: element.scrollHeight > element.clientHeight,
        fits: element.getBoundingClientRect().bottom <= window.innerHeight,
      })),
    )
    .toEqual({ overflows: true, fits: true });
  const bounds = (await instructions.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => instructions.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  await instructions.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const sourceBounds = (await source.boundingBox())!;
  expect(sourceBounds.y).toBeGreaterThanOrEqual(bounds.y);
  expect(sourceBounds.y + sourceBounds.height).toBeLessThanOrEqual(701);
  expect((await codeTab.boundingBox())!.y).toBe(tabTop);
  await codeTab.click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("button", { name: "Énoncé", exact: true }).click();
  await expect(instructions).toBeVisible();
  await expect
    .poll(() => instructions.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});
