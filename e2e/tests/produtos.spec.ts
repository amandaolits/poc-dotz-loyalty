import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

test.describe("Product Catalog", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  test("should list products on catalog page", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".card");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await expect(cards.first().locator(".card__title")).not.toBeEmpty();
  });

  test("should filter products by search", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    await page.fill(".hero-card__input", "Fone");
    await page.waitForTimeout(500);

    const cards = page.locator(".card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    await expect(cards.first().locator(".card__title")).toContainText("Fone");
  });

  test("should navigate to product detail", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    const firstBtn = page.locator(".card__btn").first();
    await expect(firstBtn).toBeVisible({ timeout: 15000 });
    await firstBtn.click();

    await page.waitForURL(/\/produtos\//, { timeout: 10000 });
    await expect(page.locator("h2.product-title")).toBeVisible();
  });

  test("should show product details with points and redeem button", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    const firstBtn = page.locator(".card__btn").first();
    await firstBtn.click();
    await page.waitForURL(/\/produtos\//, { timeout: 10000 });

    await expect(page.locator(".points-value")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("a.resgatar-link")).toBeVisible();
  });
});
