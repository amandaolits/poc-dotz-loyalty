import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

test.describe("Address Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  test("should list existing addresses", async ({ page }) => {
    await page.goto("/enderecos");
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".endereco-card");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Padrão")).toBeVisible();
  });

  test("should create a new address", async ({ page }) => {
    await page.goto("/enderecos/novo");
    await page.waitForLoadState("networkidle");

    const inputByLabel = (label: string) =>
      page.locator("app-input").filter({ has: page.locator(".label", { hasText: label }) }).locator("input");

    await inputByLabel("CEP").fill("01001-000");
    await inputByLabel("Logradouro").fill("Rua Teste E2E");
    await inputByLabel("Número").fill("123");
    await inputByLabel("Bairro").fill("Centro");
    await inputByLabel("Cidade").fill("São Paulo");
    await inputByLabel("Estado").fill("SP");

    await page.locator('app-button[type="submit"] button, button[type="submit"]').click();
    await page.waitForURL(/\/enderecos$/, { timeout: 15000 });

    await expect(page.locator("text=Rua Teste E2E").first()).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to edit address page", async ({ page }) => {
    await page.goto("/enderecos");
    await page.waitForLoadState("networkidle");

    const editBtn = page.locator("button.action-btn:has-text('Editar')").first();
    await expect(editBtn).toBeVisible({ timeout: 10000 });
    await editBtn.click();

    await page.waitForURL(/\/enderecos\//, { timeout: 10000 });
    await expect(page.locator("h1.page-title")).toHaveText("Editar Endereço");
  });

  test("should show empty state when no addresses", async ({ page }) => {
    await page.goto("/enderecos");
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".endereco-card");
    const count = await cards.count();
    if (count === 0) {
      await expect(page.locator("text=Nenhum endereço encontrado")).toBeVisible();
    }
  });
});
