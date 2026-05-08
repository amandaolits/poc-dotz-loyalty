import { test, expect } from "@playwright/test";
import { NEW_USER_EMAIL, NEW_USER_SENHA } from "./helpers";

test.describe("Authentication Flow", () => {
  test("should register a new user and redirect to login", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(page.locator("h2.card-title")).toHaveText("Criar conta");

    await page.fill("#email", NEW_USER_EMAIL);
    await page.fill("#password", NEW_USER_SENHA);
    await page.fill("#confirmarSenha", NEW_USER_SENHA);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page.locator("h1.card-title")).toHaveText("Boas-vindas de volta");
  });

  test("should login with valid credentials and access dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "maria@email.com");
    await page.fill("#password", "123456");
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator(".welcome-text")).toContainText("Olá, maria");

    const saldo = page.locator(".saldo-text");
    await expect(saldo).toBeVisible();
    await expect(saldo).not.toBeEmpty();
  });

  test("should show error on invalid login", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "invalid@email.com");
    await page.fill("#password", "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator(".error-banner")).toBeVisible({ timeout: 10000 });
  });

  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page.locator("h1.card-title")).toBeVisible();
  });

  test("should logout and redirect to login", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "maria@email.com");
    await page.fill("#password", "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    await page.click("button.logout-btn");
    await page.waitForURL(/\/login/, { timeout: 10000 });

    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });
  });
});
