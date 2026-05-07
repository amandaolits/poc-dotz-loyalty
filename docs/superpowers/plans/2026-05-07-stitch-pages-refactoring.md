# Stitch Pixel-Perfect Pages Refactoring

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar todas as páginas autenticadas (produtos, detalhe, checkout, endereços, pedidos, extrato) para seguir o layout HTML do Stitch, e tornar a Navbar auto-suficiente para buscar o saldo.

**Architecture:** Cada página é um componente standalone Angular com template inline + CSS. O NavbarComponent será modificado para buscar `/saldo` internamente. FooterComponent já está no padrão Stitch. O conteúdo de cada página entre navbar e footer será reescrito seguindo o HTML gerado pelo Stitch.

**Tech Stack:** Angular 19 standalone, Signals, CSS Custom Properties, IconComponent SVG.

---

## Scope Check

Todas as páginas partilham navbar e footer. O NavbarComponent precisa ser auto-suficiente para saldo. O FooterComponent já foi refatorado e está OK. Cada página tem seu próprio layout que precisa ser atualizado.

---

## File Structure

### Files to modify:
- `frontend/src/app/shared/components/navbar/navbar.component.ts` — tornar auto-suficiente (buscar /saldo)
- `frontend/src/app/features/produtos/list/list.component.ts` — reescrever layout Stitch
- `frontend/src/app/features/produtos/detail/detail.component.ts` — reescrever layout Stitch
- `frontend/src/app/features/checkout/checkout.component.ts` — reescrever layout Stitch
- `frontend/src/app/features/enderecos/list/list.component.ts` — reescrever layout Stitch
- `frontend/src/app/features/pedidos/list/list.component.ts` — reescrever layout Stitch
- `frontend/src/app/features/extrato/extrato.component.ts` — reescrever layout Stitch
- `frontend/src/app/shared/components/saldo-display/saldo-display.component.ts` — remover botão se não usado pelas outras páginas (deixar como está, fica disponível via inputs)
- `frontend/angular.json` — pode precisar aumentar CSS budget novamente

### Reference HTML files (baixados do Stitch):
- `.stitch-html/produtos.html`
- `.stitch-html/produto-detalhe.html`
- `.stitch-html/checkout.html`
- `.stitch-html/enderecos.html`
- `.stitch-html/pedidos.html`
- `.stitch-html/extrato.html`
- `.stitch-html/produtos-mobile.html`
- `.stitch-html/produto-detalhe-mobile.html`
- `.stitch-html/checkout-mobile.html`
- `.stitch-html/enderecos-mobile.html`
- `.stitch-html/pedidos-mobile.html`
- `.stitch-html/extrato-mobile.html`

---

## Task 1: Navbar auto-suficiente para saldo

**Problem:** NavbarComponent recebe saldo como `input<number>(0)`, mas nenhuma página passa o valor. O navbar precisa buscar o próprio saldo da API.

**Files:**
- Modify: `frontend/src/app/shared/components/navbar/navbar.component.ts`

- [ ] **Step 1: Remover input saldo**, injetar ApiService, buscar /saldo no OnInit

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SaldoResponse } from '../../../shared/models';
import { IconComponent } from '../../icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, DecimalPipe, IconComponent],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <div class="navbar-left">
          <a routerLink="/dashboard" class="logo">Dotz</a>
          <nav class="nav-links">
            <a routerLink="/produtos" class="nav-link" [class.active]="isActive('/produtos')">Produtos</a>
            <a routerLink="/pedidos" class="nav-link" [class.active]="isActive('/pedidos')">Pedidos</a>
            <a routerLink="/enderecos" class="nav-link" [class.active]="isActive('/enderecos')">Endereços</a>
            <a routerLink="/extrato" class="nav-link" [class.active]="isActive('/extrato')">Extrato</a>
          </nav>
        </div>
        <div class="navbar-right">
          <div class="saldo-chip">
            <app-icon name="wallet" [size]="20" />
            <span class="saldo-text">{{ saldo() | number:'1.0-0' }} Dotz</span>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sair</button>
          <div class="avatar">
            {{ auth.usuario()?.email?.charAt(0)?.toUpperCase() || '?' }}
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-outline-variant);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }
    @media (min-width: 768px) {
      .navbar-container { padding: 0 32px; }
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: var(--color-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-links {
      display: none;
      align-items: center;
      gap: 24px;
    }
    @media (min-width: 768px) { .nav-links { display: flex; } }
    .nav-link {
      font-size: var(--font-size-label-bold);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      font-weight: 500;
      transition: color 200ms ease;
      white-space: nowrap;
    }
    .nav-link:hover { color: var(--color-primary); }
    .nav-link.active {
      color: var(--color-primary);
      font-weight: 600;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .saldo-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--color-primary-fixed);
      color: var(--color-on-primary-fixed);
      padding: 6px 12px;
      border-radius: var(--radius-full);
    }
    .saldo-text {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
    }
    .logout-btn {
      display: none;
      background: none;
      border: none;
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-label-bold);
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      transition: color 200ms ease;
    }
    .logout-btn:hover { color: var(--color-primary); }
    @media (min-width: 768px) { .logout-btn { display: block; } }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--color-surface-variant);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
    }
  `]
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  private router = inject(Router);
  saldo = signal(0);

  ngOnInit(): void {
    this.api.get<SaldoResponse>('/saldo').subscribe({
      next: (r) => this.saldo.set(r.saldo_pontos),
      error: () => {} // mantém 0
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
```

- [ ] **Step 2: Remover input saldo do template da Dashboard**

Em `dashboard.component.ts`, mudar `<app-navbar [saldo]="saldo()" />` para `<app-navbar />`.

- [ ] **Step 3: Build e verificar**

Run: `npx ng build --configuration=production`
Expected: Build succeeds.

---

## Task 2: Produtos List — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/produtos/list/list.component.ts`

**Referência Stitch:** `.stitch-html/produtos.html`

Layout Stitch:
- Hero card bg-white rounded-[24px] com h1 "Catálogo de Prêmios", subtítulo, search input com ícone, category/subcategory selects (grid cols-12, search 6, selects 3+3)
- Product grid: grid cols-1 sm:2 lg:3 xl:4 gap-6
- Product card: bg-white rounded-[24px], border, shadow, aspect-square image, pontos badge (bg-primary-container), title, category, "Trocar agora" button
- Pagination: centered, outlined + active filled

- [ ] **Step 4: Reescrever template do ProdutosListComponent**

```typescript
template: `
  <app-navbar />
  <main class="container produtos-main">
    <!-- Hero Search -->
    <section class="hero-search">
      <div class="hero-card">
        <h1 class="page-title">Catálogo de Prêmios</h1>
        <p class="page-subtitle">Use seus Dotz para resgatar os melhores produtos e experiências.</p>
        <div class="search-row">
          <div class="search-wrapper">
            <app-icon name="search" [size]="20" class="search-icon" />
            <input
              #searchInput
              class="search-input"
              placeholder="O que você quer resgatar hoje?"
              [value]="searchTerm()"
              (input)="onSearch(searchInput.value)"
            />
          </div>
          <select class="filter-select" (change)="onCategoryChange($any($event.target).value)">
            <option value="">Todas as Categorias</option>
            <option value="Eletrônicos">Eletrônicos</option>
            <option value="Eletrodomésticos">Eletrodomésticos</option>
            <option value="Beleza & Saúde">Beleza & Saúde</option>
            <option value="Casa & Decoração">Casa & Decoração</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    @if (loading()) {
      <div class="produtos-grid">
        @for (_ of [1,2,3,4,5,6,7,8]; track $index) {
          <app-skeleton height="380px" class="product-skeleton" />
        }
      </div>
    } @else if (produtos().length === 0) {
      <app-empty-state message="Nenhum produto encontrado" />
    } @else {
      <div class="produtos-grid">
        @for (produto of produtos(); track produto.id) {
          <a [routerLink]="'/produtos/' + produto.id" class="product-card">
            <div class="product-image">
              @if (produto.imagem_url) {
                <img [src]="produto.imagem_url" [alt]="produto.nome" />
              }
              <div class="product-badge">DZ {{ produto.pontos_necessarios | number:'1.0-0' }}</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ produto.nome }}</h3>
              @if (produto.categoria || produto.subcategoria) {
                <p class="product-category">{{ produto.categoria }}{{ produto.subcategoria ? ' • ' + produto.subcategoria : '' }}</p>
              }
              <button class="product-btn">Trocar agora</button>
            </div>
          </a>
        }
      </div>

      <!-- Pagination -->
      @if (totalPaginas() > 1) {
        <nav class="pagination">
          <button class="page-btn" [disabled]="pagina() <= 1" (click)="irParaPagina(pagina() - 1)">
            <app-icon name="chevron-left" [size]="20" />
          </button>
          @for (p of [].constructor(totalPaginas()); track $index) {
            <button class="page-btn" [class.active]="$index + 1 === pagina()" (click)="irParaPagina($index + 1)">
              {{ $index + 1 }}
            </button>
          }
          <button class="page-btn" [disabled]="pagina() >= totalPaginas()" (click)="irParaPagina(pagina() + 1)">
            <app-icon name="chevron-right" [size]="20" />
          </button>
        </nav>
      }
    }
  </main>
  <app-footer />
`,
```

- [ ] **Step 5: Atualizar estilos do ProdutosListComponent**

```css
.produtos-main {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-2xl);
}
.hero-search {
  margin-bottom: var(--space-xl);
}
.hero-card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-outline-variant);
}
.page-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-h1);
  color: var(--color-on-surface);
  margin-bottom: var(--space-sm);
}
.page-subtitle {
  font-size: var(--font-size-body-md);
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-lg);
}
.search-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}
@media (min-width: 768px) {
  .search-row {
    grid-template-columns: 1fr 280px;
  }
}
.search-wrapper {
  position: relative;
}
.search-icon {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-outline);
}
.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md) var(--space-sm) 44px;
  background: var(--color-surface);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-body-md);
  font-family: var(--font-family);
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}
.filter-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-body-md);
  font-family: var(--font-family);
  color: var(--color-on-surface);
  outline: none;
  cursor: pointer;
  appearance: none;
}
.produtos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}
@media (min-width: 640px) { .produtos-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .produtos-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1280px) { .produtos-grid { grid-template-columns: repeat(4, 1fr); } }
.product-skeleton {
  border-radius: var(--radius-xl);
}
.product-card {
  display: block;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-fast);
  text-decoration: none;
  color: inherit;
}
.product-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--color-surface-container-low);
}
.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms;
}
.product-card:hover .product-image img {
  transform: scale(1.05);
}
.product-badge {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-label-bold);
  font-weight: var(--font-weight-label-bold);
  box-shadow: var(--shadow-card);
}
.product-info {
  padding: var(--space-lg);
}
.product-name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-h3);
  color: var(--color-on-surface);
  margin-bottom: var(--space-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-category {
  font-size: var(--font-size-label-sm);
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-md);
}
.product-btn {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  padding: var(--space-sm) 0;
  border-radius: var(--radius-xl);
  font-size: var(--font-size-label-bold);
  font-weight: var(--font-weight-label-bold);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.product-btn:hover {
  opacity: 0.9;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl) 0;
}
.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-outline-variant);
  background: transparent;
  color: var(--color-on-surface-variant);
  font-size: var(--font-size-label-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.page-btn:hover:not(:disabled) {
  background: var(--color-surface);
}
.page-btn.active {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 6: Atualizar a classe do componente**

Add signals: `pagina = signal(1)`, `totalPaginas = signal(1)`. Update `onSearch`, `onCategoryChange`, `irParaPagina` methods.

- [ ] **Step 7: Build e verificar**

---

## Task 3: Detalhe do Produto — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/produtos/detail/detail.component.ts`

**Referência Stitch:** `.stitch-html/produto-detalhe.html`

Layout Stitch:
- Back link "Voltar aos produtos" with arrow-left icon
- 2-col grid (lg:2): image gallery + product info
- Image: aspect-square, rounded-[24px], object-contain with white bg
- Info: category chip, h1 title, star rating (simplified), description, price card (bg-surface-container-low, DZ value), feature list (frete, garantia, troca), CTA buttons

- [ ] **Step 8: Reescrever template do DetailComponent**

(Full template with back link, image section, info section, price card, features, CTA buttons)

- [ ] **Step 9: Atualizar estilos**

- [ ] **Step 10: Build e verificar**

---

## Task 4: Checkout — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/checkout/checkout.component.ts`

**Referência Stitch:** `.stitch-html/checkout.html`

Layout Stitch:
- h1 "Confirmar Resgate" + subtitle
- 12-col grid (8+4)
- Main (8): Product summary card + Address selection cards
- Sidebar (4): Points summary (saldo atual, resgate, saldo após), confirm/cancel buttons, security notice, "Dica Dotz" card

- [ ] **Step 11: Reescrever template do CheckoutComponent**

(Product summary card with image + details, address radio cards, sidebar with points summary and buttons)

- [ ] **Step 12: Atualizar estilos**

- [ ] **Step 13: Build e verificar**

---

## Task 5: Endereços List — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/enderecos/list/list.component.ts`

**Referência Stitch:** `.stitch-html/enderecos.html`

Layout Stitch:
- Header: h1 + description + "Novo Endereço" button (with add icon, bg-primary, rounded-full)
- Grid: 1/2/3 cols responsive
- Address cards: bg #F5F5F5, rounded-[24px], shadow, border
  - Default: green "Padrão" badge, home icon, title, address, CEP, edit/delete buttons
  - Non-default: "Definir como padrão" button, edit/delete
- Empty state / add card: dashed border, add_location_alt icon, "Adicionar Outro" text

- [ ] **Step 14: Reescrever template do EnderecosListComponent**

- [ ] **Step 15: Atualizar estilos**

- [ ] **Step 16: Build e verificar**

---

## Task 6: Pedidos List — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/pedidos/list/list.component.ts`

**Referência Stitch:** `.stitch-html/pedidos.html`

Layout Stitch:
- h1 "Meus Pedidos" + subtitle
- 12-col grid: 3 cols sidebar + 9 cols orders
- Sidebar: filter card (Todos, 30 dias, Este ano) + saldo card (bg-primary-container, white text, stars decoration)
- Order cards: bg #F5F5F5, flex row, product thumbnail (w-24 h-24, bg-white, rounded-2xl), title + status chip, date, points, action link

- [ ] **Step 17: Reescrever template do PedidosListComponent**

- [ ] **Step 18: Atualizar estilos**

- [ ] **Step 19: Build e verificar**

---

## Task 7: Extrato — Stitch layout

**Files:**
- Modify: `frontend/src/app/features/extrato/extrato.component.ts`

**Referência Stitch:** `.stitch-html/extrato.html`

Layout Stitch:
- h1 "Meu Extrato" + subtitle
- 12-col grid: 4 cols sidebar + 8 cols transactions
- Sidebar: saldo card (bg-primary-container, white text, expiry info) + filter card (period buttons)
- Transactions: table-like rows, icon + description + date + points, color-coded (green gain, red redemption)
- Info banner at bottom (bg-tertiary-container/5, dashed border)

- [ ] **Step 20: Reescrever template do ExtratoComponent**

- [ ] **Step 21: Atualizar estilos**

- [ ] **Step 22: Build e verificar**

---

## Task 8: Remover saldo input do Dashboard

**Files:**
- Modify: `frontend/src/app/features/dashboard/dashboard.component.ts`

- [ ] **Step 23: Mudar `<app-navbar [saldo]="saldo()" />` para `<app-navbar />`**

(Since navbar is now self-sufficient)

---

## Task 9: Build final e verificação

- [ ] **Step 24: Build completo**

Run: `npx ng build --configuration=production`
Expected: Build succeeds without errors.

---
