import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

test.describe("Orders", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  test("should list orders", async ({ page }) => {
    await page.goto("/pedidos");
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    const orderCards = page.locator(".order-card-link");
    const count = await orderCards.count();

    if (count > 0) {
      await expect(orderCards.first()).toBeVisible();
    } else {
      await expect(page.locator("text=Nenhum pedido realizado")).toBeVisible();
    }
  });

  test("should navigate to order detail", async ({ page }) => {
    await page.goto("/pedidos");
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    const firstLink = page.locator(".order-card-link").first();

    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForURL(/\/pedidos\//, { timeout: 10000 });
      await expect(page.locator("h1.detail-title")).toBeVisible();
    }
  });

  test("should show address on order detail", async ({ page }) => {
    await page.goto("/pedidos");
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    const firstLink = page.locator(".order-card-link").first();

    if (await firstLink.isVisible()) {
      await firstLink.click();
      await page.waitForURL(/\/pedidos\//, { timeout: 10000 });
      await expect(page.locator(".address-box")).toBeVisible({ timeout: 10000 });
    }
  });

  test("should show different order statuses", async ({ page }) => {
    await page.goto("/pedidos");
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(2000);
    const statusChips = page.locator(".status-chip");
    const count = await statusChips.count();

    if (count > 0) {
      const text = await statusChips.first().textContent();
      expect(text?.trim()).toBeTruthy();
    }
  });
});
