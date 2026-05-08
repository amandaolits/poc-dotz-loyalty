import { Page, expect } from "@playwright/test";

export async function login(page: Page, email: string, senha: string) {
  await page.goto("/login");
  await page.fill("#email", email);
  await page.fill("#password", senha);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

export async function getSaldoFromNavbar(page: Page): Promise<string> {
  const saldoText = await page.locator(".saldo-text").textContent();
  return saldoText?.trim() || "";
}

export async function navigateAndWait(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

export const SEED_USER = { email: "maria@email.com", senha: "123456" };
export const NEW_USER_EMAIL = `e2e-test-${Date.now()}@test.com`;
export const NEW_USER_SENHA = "123456";
