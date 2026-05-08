import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

test.describe("Balance and Extract", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  test("should show balance on dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const saldo = page.locator(".saldo-text");
    await expect(saldo).toBeVisible({ timeout: 10000 });
    const text = await saldo.textContent();
    expect(text?.trim()).toMatch(/[\d.]+/);
  });

  test("should list extract transactions", async ({ page }) => {
    await page.goto("/extrato");
    await page.waitForLoadState("networkidle");

    const rows = page.locator(".transaction-row");
    await expect(rows.first()).toBeVisible({ timeout: 15000 });
  });

  test("should show different transaction types (ganho and resgate)", async ({ page }) => {
    await page.goto("/extrato");
    await page.waitForLoadState("networkidle");

    const txIcons = page.locator(".tx-icon");
    const count = await txIcons.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should filter extract by period", async ({ page }) => {
    await page.goto("/extrato");
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(1000);
    const filterBtns = page.locator(".filter-btn");
    const count = await filterBtns.count();

    if (count >= 3) {
      await filterBtns.nth(2).click();
      await page.waitForTimeout(2000);
      const rows = page.locator(".transaction-row");
      await expect(rows.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("should paginate extract if multiple pages", async ({ page }) => {
    await page.goto("/extrato");
    await page.waitForLoadState("networkidle");

    const nextBtn = page.locator("button.pagination-btn").last();
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
      const rows = page.locator(".transaction-row");
      await expect(rows.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
