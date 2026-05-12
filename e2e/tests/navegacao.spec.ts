import { test, expect } from "@playwright/test";
import { login, SEED_USER, NEW_USER_EMAIL, NEW_USER_SENHA } from "./helpers";

test.describe("Navegação e UX/UI", () => {

  // ===== LOGIN =====
  test.describe("Login - elementos removidos", () => {
    test("não deve ter link 'Esqueceu a senha'", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("text=Esqueceu a senha")).toHaveCount(0);
    });

    test("não deve ter login com Google", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("text=Entrar com Google")).toHaveCount(0);
    });

    test("não deve ter login com Apple", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("text=Entrar com Apple")).toHaveCount(0);
    });

    test("não deve ter 'ou continue com'", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("text=ou continue com")).toHaveCount(0);
    });

    test("footer não deve ter 'Privacidade', 'Termos', 'Ajuda', 'Parceiros'", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator(".footer")).toBeVisible();
      await expect(page.locator("text=Privacidade")).toHaveCount(0);
      await expect(page.locator("text=Termos")).toHaveCount(0);
      await expect(page.locator("text=Ajuda")).toHaveCount(0);
      await expect(page.locator("text=Parceiros")).toHaveCount(0);
    });
  });

  // ===== CADASTRO =====
  test.describe("Cadastro - navbar simplificada", () => {
    test("navbar deve ter apenas Dotz centralizado", async ({ page }) => {
      await page.goto("/cadastro");
      const header = page.locator(".header-inner");
      await expect(header.locator(".logo")).toBeVisible();
      await expect(header.locator("text=Início")).toHaveCount(0);
      await expect(header.locator("text=Como Funciona")).toHaveCount(0);
      await expect(header.locator("text=Parceiros")).toHaveCount(0);
      await expect(header.locator("text=Olá, visitante")).toHaveCount(0);
      await expect(header.locator("text=Minha Conta")).toHaveCount(0);
    });

    test("não deve ter checkbox de termos", async ({ page }) => {
      await page.goto("/cadastro");
      await expect(page.locator("text=Li e aceito os Termos")).toHaveCount(0);
      await expect(page.locator("#terms")).toHaveCount(0);
    });
  });

  // ===== BACK BUTTONS =====
  test.describe("Botões Voltar", () => {
    test.beforeEach(async ({ page }) => {
      await login(page, SEED_USER.email, SEED_USER.senha);
    });

    test("checkout deve ter link voltar para produtos", async ({ page }) => {
      await page.goto("/produtos");
      const firstCard = page.locator(".card").first();
      const btn = firstCard.locator(".card__btn");
      await btn.click();
      await page.waitForURL(/\/produtos\//, { timeout: 10000 });

      const resgatarLink = page.locator("a.resgatar-link");
      await resgatarLink.click();
      await page.waitForURL(/\/checkout/, { timeout: 10000 });

      const backLink = page.locator(".back-link");
      await expect(backLink).toBeVisible();
      await expect(backLink).toContainText("Voltar aos produtos");
    });

    test("novo endereço deve ter link voltar", async ({ page }) => {
      await page.goto("/enderecos/novo");
      await expect(page.locator(".back-link")).toBeVisible();
      await expect(page.locator(".back-link")).toContainText("Voltar");
      await page.locator(".back-link").click();
      await expect(page).toHaveURL(/\/enderecos$/);
    });

    test("editar endereço deve ter link voltar", async ({ page }) => {
      await page.goto("/enderecos");
      await page.waitForSelector(".endereco-card", { timeout: 10000 });
      const editBtn = page.locator("text=Editar").first();
      await editBtn.click();
      await expect(page.locator(".back-link")).toBeVisible();
      await expect(page.locator(".back-link")).toContainText("Voltar");
      await page.locator(".back-link").click();
      await expect(page).toHaveURL(/\/enderecos$/);
    });
  });

  // ===== MOBILE HAMBURGER MENU =====
  test.describe("Menu mobile hamburguer", () => {
    test.beforeEach(async ({ page }) => {
      await login(page, SEED_USER.email, SEED_USER.senha);
    });

    test("botão hamburguer deve existir em mobile e abrir menu", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      const hamburger = page.locator(".hamburger-btn");
      await expect(hamburger).toBeVisible();

      await hamburger.click();
      const mobileMenu = page.locator(".mobile-menu");
      await expect(mobileMenu).toBeVisible();
      await expect(page.locator(".mobile-overlay")).toBeVisible();
    });

    test("menu mobile deve ter links de navegação", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      await page.locator(".hamburger-btn").click();
      await expect(page.locator(".mobile-menu__link").first()).toBeVisible();
      const linkCount = await page.locator(".mobile-menu__link").count();
      expect(linkCount).toBe(4);
    });

    test("menu mobile deve ter opção Sair", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      await page.locator(".hamburger-btn").click();
      const logoutBtn = page.locator(".mobile-menu__logout");
      await expect(logoutBtn).toBeVisible();
      await expect(logoutBtn).toContainText("Sair");
    });

    test("menu mobile deve fechar ao clicar em link", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      await page.locator(".hamburger-btn").click();
      await expect(page.locator(".mobile-menu")).toBeVisible();

      await page.locator(".mobile-menu__link").first().click();
      await expect(page.locator(".mobile-menu")).not.toBeVisible();
    });

    test("menu mobile deve fechar ao clicar no overlay", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      await page.locator(".hamburger-btn").click();
      await expect(page.locator(".mobile-menu")).toBeVisible();

      await page.locator(".mobile-overlay").click({ position: { x: 50, y: 300 } });
      await expect(page.locator(".mobile-menu")).not.toBeVisible();
    });

    test("logout via menu mobile deve redirecionar ao login", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      await page.locator(".hamburger-btn").click();
      await page.locator(".mobile-menu__logout").click();
      await page.waitForURL(/\/login/, { timeout: 10000 });
    });

    test("hamburguer não deve aparecer em desktop (>768px)", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
      await expect(page.locator(".hamburger-btn")).not.toBeVisible();
    });
  });

  // ===== CONSISTÊNCIA DE NAVEGAÇÃO =====
  test.describe("Fluxos de navegação", () => {
    test.beforeEach(async ({ page }) => {
      await login(page, SEED_USER.email, SEED_USER.senha);
    });

    test("navbar deve estar visível em todas as páginas autenticadas", async ({ page }) => {
      const pages = ["/dashboard", "/produtos", "/pedidos", "/enderecos", "/extrato"];
      for (const url of pages) {
        await page.goto(url);
        await page.waitForLoadState("networkidle");
        await expect(page.locator(".navbar-header")).toBeVisible();
      }
    });

    test("deve navegar entre páginas pela navbar", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      const links = [
        { text: "Produtos", url: "/produtos" },
        { text: "Pedidos", url: "/pedidos" },
        { text: "Endereços", url: "/enderecos" },
        { text: "Extrato", url: "/extrato" },
      ];

      for (const link of links) {
        await page.locator(`.nav-link:has-text("${link.text}")`).click();
        await page.waitForURL(`**${link.url}`, { timeout: 10000 });
        await expect(page).toHaveURL(new RegExp(link.url.replace("/", "\\/")));
      }
    });

    test("logo Dotz na navbar deve levar ao dashboard", async ({ page }) => {
      await page.goto("/produtos");
      await page.waitForLoadState("networkidle");
      await page.locator(".logo").click();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
