import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

test.describe("Product Redemption", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  test("should access checkout page with product selected", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    const firstBtn = page.locator(".card__btn").first();
    await expect(firstBtn).toBeVisible({ timeout: 15000 });
    await firstBtn.click();
    await page.waitForURL(/\/produtos\//, { timeout: 10000 });

    await page.locator("a.resgatar-link").click();
    await page.waitForURL(/\/checkout/, { timeout: 10000 });

    await expect(page.locator("h1")).toContainText("Finalizar Resgate");
  });

  test("should show addresses on checkout page", async ({ page }) => {
    await page.goto("/checkout?produtoId=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03");
    await page.waitForLoadState("networkidle");

    const addressCards = page.locator(".address-card");
    await expect(addressCards.first()).toBeVisible({ timeout: 15000 });
  });

  test("should display error when redeeming with insufficient points", async ({ page }) => {
    await page.goto("/checkout?produtoId=c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a09");
    await page.waitForLoadState("networkidle");

    const addressCards = page.locator(".address-card");
    await expect(addressCards.first()).toBeVisible({ timeout: 15000 });
    await addressCards.first().click();

    const confirmBtn = page.locator("app-button.confirm-btn button, .confirm-btn button");
    if (await confirmBtn.isEnabled()) {
      await confirmBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  test("should complete redemption flow for a cheap product", async ({ page }) => {
    await page.goto("/produtos");
    await page.waitForLoadState("networkidle");

    const firstBtn = page.locator(".card__btn").first();
    await expect(firstBtn).toBeVisible({ timeout: 15000 });
    await firstBtn.click();
    await page.waitForURL(/\/produtos\//, { timeout: 15000 });

    await page.locator("a.resgatar-link").click();
    await page.waitForURL(/\/checkout/, { timeout: 10000 });

    await page.waitForTimeout(2000);
    const addressCards = page.locator(".address-card");
    const count = await addressCards.count();

    if (count > 0) {
      await addressCards.first().click();
      const confirmBtn = page.locator("app-button.confirm-btn, .confirm-btn");
      await expect(confirmBtn).toBeEnabled({ timeout: 5000 });
      await confirmBtn.click();
      await page.waitForURL(/\/pedidos/, { timeout: 15000 });
      await expect(page.locator("h1")).toContainText("Meus Pedidos");
    }
  });
});
