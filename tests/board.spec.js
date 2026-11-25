import { test, expect } from "@playwright/test";
test("create, move, persist, filter, and delete a task", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "+ New task" }).click();
  await page.getByLabel("Task title").fill("Launch from Lagos");
  await page
    .getByLabel("Description", { exact: true })
    .fill("A real end-to-end mission.");
  await page.getByRole("button", { name: "Add to backlog" }).click();
  const card = page.locator("article").filter({ hasText: "Launch from Lagos" });
  await expect(card).toBeVisible();
  await page.getByLabel("Status for Launch from Lagos").selectOption("Shipped");
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "43");
  await page.reload();
  await expect(page.getByLabel("Status for Launch from Lagos")).toHaveValue(
    "Shipped",
  );
  await page.getByRole("searchbox").fill("no matching task");
  await expect(page.locator("article")).toHaveCount(0);
  await page.getByRole("searchbox").fill("Launch from Lagos");
  await page.getByRole("button", { name: "Delete Launch from Lagos" }).click();
  await expect(card).toHaveCount(0);
});
test("mobile board fits the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Small steps. Extraordinary launches." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
