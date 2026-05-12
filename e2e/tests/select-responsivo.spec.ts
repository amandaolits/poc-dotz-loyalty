import { test, expect } from "@playwright/test";
import { login, SEED_USER } from "./helpers";

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-375", width: 375, height: 667 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

test.describe("Select Responsivo - Validação", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, SEED_USER.email, SEED_USER.senha);
  });

  for (const vp of VIEWPORTS) {
    test(`select customizado respeita viewport em ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/produtos");
      await page.waitForLoadState("networkidle");
      await page.waitForSelector("app-select", { timeout: 15000 });

      // 1. O componente customizado existe no lugar do <select> nativo
      const appSelects = page.locator("app-select");
      await expect(appSelects).toHaveCount(2);

      // 2. O gatilho do select está visível e clicável
      const trigger = appSelects.first().locator(".select-trigger");
      await expect(trigger).toBeVisible();
      await expect(trigger).toHaveText(/Categoria/);

      // 3. Clicar abre o dropdown
      await trigger.click();
      const dropdown = page.locator(".select-dropdown");
      await expect(dropdown).toBeVisible();

      // 4. O dropdown está dentro da viewport
      const dropdownBox = await dropdown.boundingBox();
      expect(dropdownBox).not.toBeNull();
      if (dropdownBox) {
        // Horizontalmente dentro da viewport
        expect(dropdownBox.x).toBeGreaterThanOrEqual(0);
        expect(dropdownBox.x + dropdownBox.width).toBeLessThanOrEqual(vp.width);
        // Verticalmente dentro da viewport (pelo menos parcialmente visível no topo)
        expect(dropdownBox.y).toBeGreaterThanOrEqual(0);
        // Não está totalmente abaixo da viewport
        expect(dropdownBox.y).toBeLessThan(vp.height);
      }

      // 5. As opções estão visíveis
      const items = dropdown.locator(".select-dropdown__item");
      const count = await items.count();
      expect(count).toBeGreaterThan(1);

      // 6. Selecionar uma opção fecha o dropdown e atualiza o texto
      const firstOption = items.nth(1);
      const optionText = await firstOption.textContent();
      await firstOption.click();
      await expect(dropdown).not.toBeVisible();
      await expect(trigger).toContainText(optionText!);

      // 7. O dropdown reaparece ao clicar novamente
      await trigger.click();
      await expect(dropdown).toBeVisible();
      // Fechar com clique fora
      await page.locator("h1").click();
      await expect(dropdown).not.toBeVisible();

      // 8. Testar o segundo select (subcategoria)
      const subTrigger = appSelects.nth(1).locator(".select-trigger");
      await expect(subTrigger).toHaveText(/Subcategoria/);
      await subTrigger.click();
      const subDropdown = page.locator(".select-dropdown");
      await expect(subDropdown).toBeVisible();

      const subDropdownBox = await subDropdown.boundingBox();
      if (subDropdownBox) {
        expect(subDropdownBox.x).toBeGreaterThanOrEqual(0);
        expect(subDropdownBox.x + subDropdownBox.width).toBeLessThanOrEqual(vp.width);
        expect(subDropdownBox.y).toBeGreaterThanOrEqual(0);
        expect(subDropdownBox.y).toBeLessThan(vp.height);
      }

      // Fechar com Escape
      await page.keyboard.press("Escape");
      await expect(subDropdown).not.toBeVisible();
    });
  }
});
