# Stitch Pixel-Perfect Refactoring Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refatorar o frontend Angular para ficar visualmente idêntico às telas do Stitch (pixel-perfect).

**Architecture:** Manter estrutura atual de componentes standalone Angular + Signals + CSS Custom Properties. Ajustar cada página e componente compartilhado individualmente. Substituir emoji por SVG icons. Padronizar uso de tokens CSS. Adicionar Footer ausente.

**Tech Stack:** Angular 19 standalone, CSS Custom Properties (design tokens), Google Material Icons ou SVG inline.

---

## Scope Check

Este plano cobre uma única área de trabalho: alinhamento visual do frontend com os designs do Stitch. Não há subsistemas independentes — todas as tasks convergem para o mesmo objetivo.

---

## File Structure

### Files to modify:
- `frontend/src/app/features/auth/login/login.component.ts` — ícones, layout
- `frontend/src/app/features/auth/cadastro/cadastro.component.ts` — ícones, layout
- `frontend/src/app/features/dashboard/dashboard.component.ts` — ícones, footer
- `frontend/src/app/features/produtos/list/list.component.ts` — ícones, footer
- `frontend/src/app/features/produtos/detail/detail.component.ts` — footer
- `frontend/src/app/features/checkout/checkout.component.ts` — footer, layout
- `frontend/src/app/features/enderecos/list/list.component.ts` — footer
- `frontend/src/app/features/enderecos/novo/novo-endereco.component.ts` — visual review
- `frontend/src/app/features/enderecos/editar/editar-endereco.component.ts` — visual review
- `frontend/src/app/features/extrato/extrato.component.ts` — ícones, footer
- `frontend/src/app/features/pedidos/list/list.component.ts` — footer
- `frontend/src/app/features/pedidos/detail/detail.component.ts` — refatorar completo (inline styles, missing navbar/footer)
- `frontend/src/app/shared/components/input/input.component.ts` — ícones (prefixIcon/suffixIcon)
- `frontend/src/app/shared/components/saldo-display/saldo-display.component.ts` — revisar font-size
- `frontend/src/app/shared/components/status-chip/status-chip.component.ts` — hardcoded colors, duplicate class
- `frontend/src/app/shared/components/card/card.component.ts` — revisar padding
- `frontend/src/styles.css` — adicionar tokens de ícone se necessário

### Files to create:
- `frontend/src/app/shared/icons/` — diretório para componentes de ícone SVG

---

## Task 1: Substituir emoji por SVG icons

**Problem:** Todas as páginas usam emoji (📧, 🔒, 🛒, 📦, 📋, 📍, ✨, 🔍) no lugar de ícones de UI. O Stitch usa ícones de interface (provavelmente Material Icons ou SVGs).

**Solution:** Criar sistema de ícones SVG inline e substituir todos os emoji.

### 1a: Criar componente Icon
**Files:**
- Create: `frontend/src/app/shared/icons/icon.component.ts`
- Create: `frontend/src/app/shared/icons/index.ts`

- [ ] **Step 1: Criar IconComponent**

```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg class="icon" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" [attr.stroke]="color() || 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('mail') {
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        }
        @case ('lock') {
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        }
        @case ('shopping-cart') {
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        }
        @case ('package') {
          <polyline points="16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.29 7 12 12 20.71 7"/>
        }
        @case ('list') {
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        }
        @case ('map-pin') {
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        }
        @case ('sparkles') {
          <path d="M12 3l1.66 3.34L17 6.5l-3.34 1.66L12 11.5l-1.66-3.34L7 6.5l3.34-1.66L12 3z"/><path d="M18 14l1.5 3L21 17l-3 1.5L18 22l-1.5-3L13 17l3-1.5z"/><path d="M6 14l1.5-3L9 14l-3 1.5L6 19l-1.5-3L1 14l3-1.5z"/>
        }
        @case ('search') {
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        }
        @case ('chevron-right') {
          <polyline points="9 18 15 12 9 6"/>
        }
        @case ('check') {
          <polyline points="20 6 9 17 4 12"/>
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        }
        @case ('trash') {
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        }
        @case ('edit') {
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        }
        @case ('arrow-left') {
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        }
        @case ('arrow-right') {
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        }
      }
    </svg>
  `,
  styles: [`
    .icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
  `]
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('');
}
```

- [ ] **Step 2: Criar barrel export**

```typescript
export { IconComponent } from './icon.component';
```

### 1b: Substituir emoji no InputComponent
**Files:**
- Modify: `frontend/src/app/shared/components/input/input.component.ts`

- [ ] **Step 3: Adicionar IconComponent aos imports do InputComponent**

Add `IconComponent` to imports array.

- [ ] **Step 4: Substituir span de prefixIcon/suffixIcon por app-icon**

```html
@if (prefixIcon()) {
  <span class="prefix-icon">
    <app-icon [name]="prefixIcon()" size="16" />
  </span>
}
@if (suffixIcon()) {
  <span class="suffix-icon">
    <app-icon [name]="suffixIcon()" size="16" />
  </span>
}
```

### 1c: Substituir emoji no LoginComponent
**Files:**
- Modify: `frontend/src/app/features/auth/login/login.component.ts`

- [ ] **Step 5: Trocar prefixIcon de emoji para nome do ícone**

Change `prefixIcon="📧"` to `prefixIcon="mail"` and `prefixIcon="🔒"` to `prefixIcon="lock"`.

Add `IconComponent` to imports.

### 1d: Substituir emoji no CadastroComponent
**Files:**
- Modify: `frontend/src/app/features/auth/cadastro/cadastro.component.ts`

- [ ] **Step 6: Trocar prefixIcon de emoji para nome do ícone**

Change `prefixIcon="📧"` to `prefixIcon="mail"`, `prefixIcon="🔒"` to `prefixIcon="lock"`.

Add `IconComponent` to imports.

### 1e: Substituir emoji no DashboardComponent
**Files:**
- Modify: `frontend/src/app/features/dashboard/dashboard.component.ts`

- [ ] **Step 7: Substituir emoji nos action cards por app-icon**

Replace:
```html
<span class="action-icon">🛒</span>
```
with:
```html
<span class="action-icon"><app-icon name="shopping-cart" size="32" /></span>
```

Same for 📦 → `package`, 📋 → `list`, 📍 → `map-pin`.

Add `IconComponent` to imports.

### 1f: Substituir emoji no ProdutosListComponent
**Files:**
- Modify: `frontend/src/app/features/produtos/list/list.component.ts`

- [ ] **Step 8: Substituir 🔍 por app-icon**

Replace search icon span with `<app-icon name="search" size="16" />`.

Add `IconComponent` to imports.

### 1g: Substituir emoji no ExtratoComponent
**Files:**
- Modify: `frontend/src/app/features/extrato/extrato.component.ts`

- [ ] **Step 9: Substituir emoji de tipo de transação por app-icon**

Replace:
- 🛒 → `shopping-cart`
- ✨ → `sparkles`

Add `IconComponent` to imports.

---

## Task 2: Adicionar FooterComponent às páginas que estão sem

**Problem:** FooterComponent está definido mas não é usado na maioria das páginas. Stitch mostra footer em todas as telas.

**Files to modify:**
- `frontend/src/app/features/dashboard/dashboard.component.ts`
- `frontend/src/app/features/produtos/list/list.component.ts`
- `frontend/src/app/features/produtos/detail/detail.component.ts`
- `frontend/src/app/features/checkout/checkout.component.ts`
- `frontend/src/app/features/extrato/extrato.component.ts`
- `frontend/src/app/features/pedidos/list/list.component.ts`
- `frontend/src/app/features/enderecos/list/list.component.ts`

- [ ] **Step 10: Adicionar FooterComponent aos imports de cada página**

Add `FooterComponent` to the imports array of each component listed above.

- [ ] **Step 11: Inserir `<app-footer />` no template de cada página**

Add `<app-footer />` as the last element inside the `<main>` or at the bottom of each component template, after the closing `</main>` tag.

Example pattern for all pages:
```html
</main>
<app-footer />
```

---

## Task 3: Refatorar PedidosDetailComponent

**Problem:** Este componente:
- Usa estilos inline hardcoded (`#FF6B00`, `#9CA3AF`, `16px`, `24px`) em vez de CSS custom properties
- Template em uma única linha — ilegível
- Não inclui NavbarComponent nem FooterComponent
- Layout não segue o padrão do Stitch

**Files:**
- Modify: `frontend/src/app/features/pedidos/detail/detail.component.ts`

- [ ] **Step 12: Reescrever template com formatação adequada**

```typescript
@Component({
  selector: 'app-pedidos-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, CardComponent, StatusChipComponent, SkeletonComponent],
  template: `
    <app-navbar />
    <main class="container detail-main">
      <a routerLink="/pedidos" class="back-link">
        <app-icon name="arrow-left" size="16" /> Voltar
      </a>
      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (pedido()) {
        <app-card class="detail-card elevated">
          @if (pedido()!.produto_imagem) {
            <img [src]="pedido()!.produto_imagem" [alt]="pedido()!.produto_nome" class="detail-img" />
          }
          <div class="detail-header">
            <h1 class="detail-title">{{ pedido()!.produto_nome }}</h1>
            <app-status-chip [status]="pedido()!.status" />
          </div>
          <div class="detail-points">
            <p class="points-value">{{ pedido()!.pontos_gastos | number:'1.0-0' }} <span class="points-unit">Dotz</span></p>
            <p class="points-label">gastos neste pedido</p>
          </div>
          <p class="detail-date">{{ pedido()!.data_pedido | date:'dd/MM/yyyy HH:mm' }}</p>

          <h2 class="section-title">Endereço de entrega</h2>
          <div class="address-box">
            <p class="address-line">{{ pedido()!.logradouro }}, {{ pedido()!.numero }}</p>
            @if (pedido()!.complemento) {
              <p class="address-line">{{ pedido()!.complemento }}</p>
            }
            <p class="address-line">{{ pedido()!.bairro }} - {{ pedido()!.cidade }}, {{ pedido()!.estado }}</p>
            <p class="address-line">CEP: {{ pedido()!.cep }}</p>
          </div>
        </app-card>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .detail-main { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); }
    .back-link { display: inline-flex; align-items: center; gap: var(--space-sm); color: var(--color-primary); text-decoration: none; font-weight: var(--font-weight-label-bold); margin-bottom: var(--space-lg); }
    .back-link:hover { text-decoration: underline; }
    .detail-card { max-width: 600px; }
    .detail-img { width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-lg); }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-md); margin-bottom: var(--space-md); }
    .detail-title { font-size: var(--font-size-h2); font-weight: var(--font-weight-h2); color: var(--color-on-surface); line-height: var(--font-line-height-h2); }
    .detail-points { padding: var(--space-md); background: var(--color-surface-container); border-radius: var(--radius-lg); margin-bottom: var(--space-md); }
    .points-value { font-size: var(--font-size-h2); font-weight: var(--font-weight-h1); color: var(--color-primary); }
    .points-unit { font-size: var(--font-size-body-md); color: var(--color-on-surface-variant); }
    .points-label { font-size: var(--font-size-label-sm); color: var(--color-on-surface-variant); margin-top: var(--space-xs); }
    .detail-date { font-size: var(--font-size-body-md); color: var(--color-on-surface-variant); margin-bottom: var(--space-lg); }
    .section-title { font-size: var(--font-size-h3); font-weight: var(--font-weight-h3); color: var(--color-on-surface); margin-bottom: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-outline-variant); }
    .address-box { background: var(--color-surface-container); border-radius: var(--radius-lg); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs); }
    .address-line { font-size: var(--font-size-body-md); color: var(--color-on-surface); }
  `]
})
```

- [ ] **Step 13: Adicionar IconComponent aos imports**

Add to imports: `IconComponent`.

- [ ] **Step 14: Build e verificar**

Run: `npx ng build --configuration=production`
Expected: Build succeeds without errors.

---

## Task 4: Corrigir CSS tokens hardcoded no StatusChipComponent

**Problem:** O componente usa valores hex e rgba hardcoded para cores de status em vez de CSS custom properties.

**Files:**
- Modify: `frontend/src/app/shared/components/status-chip/status-chip.component.ts`

- [ ] **Step 15: Definir tokens de status no styles.css**

Add to `frontend/src/styles.css`:
```css
:root {
  --color-success: #059669;
  --color-success-container: rgba(0, 163, 109, 0.1);
  --color-warning: #D97706;
  --color-warning-container: rgba(254, 243, 199, 0.1);
  --color-error: #DC2626;
  --color-error-container: rgba(254, 226, 226, 0.1);
  --color-info: #2563EB;
  --color-info-container: rgba(219, 234, 254, 0.1);
}
```

- [ ] **Step 16: Substituir hardcoded colors por CSS custom properties**

```css
.chip-confirmado,
.chip-concluido {
  background: var(--color-success-container);
  color: var(--color-success);
}
.chip-processando,
.chip-em_andamento {
  background: var(--color-warning-container);
  color: var(--color-warning);
}
.chip-cancelado {
  background: var(--color-error-container);
  color: var(--color-error);
}
.chip-pendente {
  background: var(--color-info-container);
  color: var(--color-info);
}
.chip-enviado {
  background: rgba(147, 197, 253, 0.1);
  color: #1D4ED8;
}
```

- [ ] **Step 17: Remover classe duplicada `.chip-cancelado`**

Delete the duplicate `.chip-cancelado` block (lines 29-32).

---

## Task 5: Revisar SaldoDisplayComponent

**Problem:** Font-size do valor do saldo é 48px hardcoded. Stitch design system define h1 como 32px.

**Files:**
- Modify: `frontend/src/app/shared/components/saldo-display/saldo-display.component.ts`

**Uncertainty:** A imagem do Stitch pode realmente usar 48px para o valor do saldo em destaque, já que é um elemento hero. O design system descreve "Saldo Display: A specialized component using H1 typography in #FF6B00". H1 é 32px. Mas o valor do saldo pode ser maior. É necessário confirmar visualmente.

- [ ] **Step 18: Revisar font-size do saldo**

Aguardar confirmação visual da imagem. Se o Stitch usa 32px (h1), alterar:
```css
.value {
  font-size: var(--font-size-h1);
  ...
}
```

Se o Stitch usa 48px, manter valor atual ou criar token:
```css
--font-size-hero: 48px;
```

---

## Task 6: Footer — verificar altura e espaçamento

**Problem:** Footer pode não corresponder ao Stitch em altura ou padding.

**Files:**
- Review: `frontend/src/app/shared/components/footer/footer.component.ts`

**Uncertainty:** Não é possível confirmar a altura exata do footer no Stitch sem ver a imagem.

- [ ] **Step 19: Verificar visualmente footer no Stitch vs frontend**

Comparar screenshot do Stitch com footer atual. Ajustar `padding` no `FooterComponent` se necessário.

---

## Task 7: Revisão de CardComponent padding

**Problem:** Stitch spec diz "16px-24px internal padding" em cards. O CardComponent usa `padding: var(--space-lg)` que é 24px. Pode ser necessário variável/customização.

**Files:**
- Review: `frontend/src/app/shared/components/card/card.component.ts`

- [ ] **Step 20: Adicionar input de padding ao CardComponent (se necessário)**

```typescript
padding = input<'sm' | 'md' | 'lg'>('lg');
```

E no template: `[class.padding-sm]="padding() === 'sm'"` etc., com classes CSS:
```css
:host(.padding-sm) .card { padding: var(--space-md); }
:host(.padding-md) .card { padding: var(--space-lg); }
```

---

## Task 8: Verificação de layout por página

**Problem:** Podem existir diferenças de layout, alinhamento, espaçamento que só são visíveis comparando screenshots lado a lado.

**Files:** Todos os componentes de página.

**Uncertainty:** Não é possível verificar 100% sem acesso visual às imagens.

- [ ] **Step 21: Para cada página, comparar screenshot do Stitch com renderização real**

Para cada item abaixo, comparar visualmente:
1. Login Desktop + Mobile
2. Cadastro Desktop + Mobile
3. Dashboard Desktop + Mobile
4. Produtos list Desktop + Mobile
5. Produtos detail Desktop + Mobile
6. Checkout Desktop + Mobile
7. Endereços list Desktop + Mobile
8. Endereços novo/editar Desktop + Mobile
9. Pedidos list Desktop + Mobile
10. Pedidos detail Desktop + Mobile
11. Extrato Desktop + Mobile

Criar lista de ajustes por página neste formato:
```
## Página: [nome]
- [ ] Ajustar [elemento] — [descrição do problema]
- [ ] Corrigir [espaçamento] — [valor esperado vs atual]
```

---

## Task 9: Ordem de execução

- [ ] **Step 22: Executar tasks na seguinte ordem**

1. **Task 1a**: Criar IconComponent (base para todas as refatorações de ícone)
2. **Task 1b-g**: Substituir emoji página por página (pode paralelizar)
3. **Task 4**: Corrigir StatusChipComponent tokens
4. **Task 3**: Refatorar PedidosDetailComponent
5. **Task 2**: Adicionar Footer às páginas
6. **Task 5-7**: Ajustes finos (saldo, card padding, footer)
7. **Task 8**: Revisão visual final e ajustes por página

---

## Estratégia global de UI

1. **Icon System:** SVG inline via `IconComponent` com nomes semânticos (Lucide/Feather-style). Sem dependência externa.
2. **CSS Tokens:** Todos os valores visuais devem usar `var(--token)` — zero hardcoded colors/px.
3. **Layout:** Grid CSS para listas de cards, Flexbox para componentes internos. Breakpoint 768px.
4. **Responsivo:** Manter padrão atual (container com padding variável, grid collapse). Verificar cada página mobile.
5. **Footer:** Presente em TODAS as páginas autenticadas (após `</main>`).

---

## Notas sobre limitações

1. **Imagens não visualizáveis:** Este plano foi escrito sem acesso direto às imagens do Stitch (limitação do modelo). Tasks 5, 6 e 8 dependem de confirmação visual humana.

2. **Ícones exatos do Stitch:** O Stitch pode usar Material Icons, Feather Icons ou ícones customizados. O `IconComponent` acima usa paths Feather-style. Se o Stitch usar ícones diferentes, os paths SVG precisam ser ajustados.

3. **Cores exatas de background:** O design markdown do Stitch menciona `#F5F5F5` para cards, mas os tokens reais usam `#ffeae1` (surface-container). A implementação atual segue os tokens. Confirmar qual está correto visualmente.

---

## Auto-Review Checklist

- [ ] Spec coverage: Tasks 1-9 cobrem ícones, footer, componente pedido, tokens CSS, e revisão visual
- [ ] All code shown: IconComponent tem paths SVG para todos os ícones usados
- [ ] Type consistency: `IconComponent.name()` aceita strings compatíveis com todos os usos
- [ ] No placeholders
