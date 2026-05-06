# Design: Refatoração Frontend - Stitch POC Dotz Loyalty

**Data**: 2026-05-06
**Escopo**: Refatoração completa do frontend Angular 19 para espelhar o design criado no Stitch (Project: POC Dotz Loyalty UI, ID: 1851586049690126454)

---

## 1. Design System / Estilos Globais

### 1.1 CSS Variables (`:root`)

Substituir o `frontend/src/styles.css` atual (4 linhas) por um sistema completo de tokens CSS baseado no `DESIGN.md`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Colors - Primary & Accent */
  --color-primary: #FF6B00;
  --color-primary-container: #ffdbcc;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #572000;
  --color-inverse-primary: #ffb693;

  /* Colors - Secondary */
  --color-secondary: #585f6c;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #dce2f3;
  --color-on-secondary-container: #5e6572;

  /* Colors - Neutral Surface */
  --color-background: #fff8f6;
  --color-surface: #ffffff;
  --color-surface-dim: #efd5ca;
  --color-surface-bright: #fff8f6;
  --color-surface-container: #ffeae1;
  --color-surface-container-low: #fff1eb;
  --color-surface-container-high: #fee3d8;
  --color-surface-container-highest: #f8ddd2;
  --color-surface-variant: #f8ddd2;

  /* Colors - Text */
  --color-on-surface: #261812;
  --color-on-surface-variant: #5a4136;
  --color-inverse-on-surface: #ffede6;
  --color-inverse-surface: #3d2d26;

  /* Colors - Outline */
  --color-outline: #8e7164;
  --color-outline-variant: #e2bfb0;

  /* Colors - Status */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;

  /* Colors - Tertiary */
  --color-tertiary: #0062a1;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #059eff;
  --color-on-tertiary-container: #003357;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-h1: 32px;
  --font-weight-h1: 700;
  --font-line-height-h1: 1.2;
  --font-letter-spacing-h1: -0.02em;

  --font-size-h2: 24px;
  --font-weight-h2: 600;
  --font-line-height-h2: 1.3;
  --font-letter-spacing-h2: -0.01em;

  --font-size-h3: 20px;
  --font-weight-h3: 600;
  --font-line-height-h3: 1.4;

  --font-size-body-lg: 18px;
  --font-weight-body-lg: 400;
  --font-line-height-body-lg: 1.6;

  --font-size-body-md: 16px;
  --font-weight-body-md: 400;
  --font-line-height-body-md: 1.5;

  --font-size-label-bold: 14px;
  --font-weight-label-bold: 600;
  --font-line-height-label-bold: 1.2;
  --font-letter-spacing-label-bold: 0.02em;

  --font-size-label-sm: 12px;
  --font-weight-label-sm: 500;
  --font-line-height-label-sm: 1.2;
  --font-letter-spacing-label-sm: 0.01em;

  --font-size-caption: 11px;
  --font-weight-caption: 400;
  --font-line-height-caption: 1.1;

  /* Spacing (base 4px) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-gutter: 16px;
  --space-margin-mobile: 16px;
  --space-margin-desktop: 32px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 12px rgba(0,0,0,0.05);
  --shadow-card-hover: 0 8px 20px rgba(0,0,0,0.08);
  --shadow-focus: 0 0 0 2px rgba(255,107,0,0.2);

  /* Transitions */
  --transition-fast: 200ms ease-in-out;
}

/* Reset */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: var(--font-family);
  background: var(--color-background);
  color: var(--color-on-surface);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* Layout */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-margin-mobile);
}
@media (min-width: 768px) {
  .container { padding: 0 var(--space-margin-desktop); }
}

/* Typography Utilities */
.text-h1 {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-h1);
  line-height: var(--font-line-height-h1);
  letter-spacing: var(--font-letter-spacing-h1);
}
.text-h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-h2);
  line-height: var(--font-line-height-h2);
  letter-spacing: var(--font-letter-spacing-h2);
}
.text-h3 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-h3);
  line-height: var(--font-line-height-h3);
}
.text-body-lg {
  font-size: var(--font-size-body-lg);
  font-weight: var(--font-weight-body-lg);
  line-height: var(--font-line-height-body-lg);
}
.text-body-md {
  font-size: var(--font-size-body-md);
  font-weight: var(--font-weight-body-md);
  line-height: var(--font-line-height-body-md);
}
.text-label-bold {
  font-size: var(--font-size-label-bold);
  font-weight: var(--font-weight-label-bold);
  line-height: var(--font-line-height-label-bold);
  letter-spacing: var(--font-letter-spacing-label-bold);
}
.text-label-sm {
  font-size: var(--font-size-label-sm);
  font-weight: var(--font-weight-label-sm);
  line-height: var(--font-line-height-label-sm);
  letter-spacing: var(--font-letter-spacing-label-sm);
}
.text-caption {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-caption);
  line-height: var(--font-line-height-caption);
}

/* Color Utilities */
.bg-surface { background: var(--color-surface); }
.bg-surface-container { background: var(--color-surface-container); }
.bg-primary { background: var(--color-primary); color: var(--color-on-primary); }
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-on-surface { color: var(--color-on-surface); }
.text-on-surface-variant { color: var(--color-on-surface-variant); }

/* Border Radius Utilities */
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-full { border-radius: var(--radius-full); }

/* Shadow Utilities */
.shadow-card { box-shadow: var(--shadow-card); }
.shadow-card-hover:hover { box-shadow: var(--shadow-card-hover); }
```

---

## 2. Arquitetura de Componentes

### 2.1 Shared Components (Atualizações)

| Componente | Atualização |
|------------|-------------|
| `ButtonComponent` | Usar variáveis CSS para cores, adicionar variantes `primary`, `secondary`, `text`; tamanhos `sm`, `md`, `lg`; transição `var(--transition-fast)` |
| `InputComponent` | Borda 1px `--color-outline`; foco: `border-color: var(--color-primary)` + `box-shadow: var(--shadow-focus)`; suporte a ícones |
| `CardComponent` | `border-radius: var(--radius-xl)`; `box-shadow: var(--shadow-card)`; variantes `elevated`, `outlined`, `filled`; transição hover |
| `StatusChipComponent` | `border-radius: var(--radius-full)` (pill shape); background com 10% opacity da cor do status; atualizar status: `confirmado`, `processando`, `cancelado` |
| **Novo: `NavbarComponent`** | Header padrão com logo Dotz (cor primary), email do usuário, botão sair |
| **Novo: `SaldoDisplayComponent`** | H1 em `--color-primary`, "Dotz" em `--color-on-surface-variant`; card elevated |
| **Novo: `ProductCardComponent`** | Imagem 160px height, object-fit cover, border-radius-lg; nome h3; pontos em text-primary; categoria chip |
| **Novo: `FooterComponent`** | Rodapé simples com texto "Dotz Loyalty POC" |

### 2.2 Page Components (Refatoração)

Cada tela terá seu template substituído pelo HTML do Stitch convertido para Angular syntax:

| Tela | Stitch Screen ID | Componente Angular | Descrição da Conversão |
|------|------------------|---------------------|------------------------|
| Login | `4afec45007f24a24a44c6b947a66002b` | `login.component.ts` | HTML → template Angular; usar `CardComponent`, `InputComponent`, `ButtonComponent` |
| Cadastro | `f9487e55a88944f7aba7c99b3b70fabe` | `cadastro.component.ts` | Mesmo padrão do Login |
| Dashboard | `0a0e8af8dd7d4f02a7384a1db121a97a` | `dashboard.component.ts` | `NavbarComponent` + `SaldoDisplayComponent` + grid de links |
| Produtos/List | `34dfb6925cf14a84a3fdde97d3693ff2` | `list.component.ts` | Search bar + filtros + grid de `ProductCardComponent` |
| Produtos/Detail | `0beca591a5ca43afb78f15642ac61254` | `detail.component.ts` | Imagem, descrição, pontos, botão resgatar |
| Checkout | `15be5c984fc341aead400a46e89a36c3` | `checkout.component.ts` | Resumo pedido + seleção endereço + confirmação |
| Endereços/List | `a20384ef843347b187a5d2088b3bb047` | `list.component.ts` (enderecos) | Lista de cards de endereço |
| Endereços/Form | - | `form.component.ts` | Formulário com `InputComponent` + `ButtonComponent` |
| Pedidos/List | `a888e8f8c5264e648d8cbfe3baa1ed13` | `list.component.ts` (pedidos) | Cards de pedidos com `StatusChipComponent` |
| Pedidos/Detail | - | `detail.component.ts` (pedidos) | Detalhes pedido + status |
| Extrato | `36bd7750ed9a4960b6efca412039e9b6` | `extrato.component.ts` | Lista transações com ícones |

### 2.3 Conversão HTML → Angular Template

Os HTMLs do Stitch (via `htmlCode.downloadUrl`) serão convertidos seguindo:
- `class="..."` → `class="..."` (manter, Angular suporta)
- `{{ variable }}` → `{{ variable }}` (interpolação Angular)
- Loops: converter para `@for (item of items; track item.id) { ... }`
- Conditionals: converter para `@if (condition) { ... }`
- Event handlers: `onclick="..."` → `(click)="..."`
- Forms: usar `[(ngModel)]` ou Reactive Forms (`formControlName`)

---

## 3. Data Flow & Component Communication

### 3.1 Serviços (Inalterados)
- `AuthService` - mantido, usa signals (`usuario`, `token`)
- `ApiService` - mantido, HTTP requests com interceptor
- `ProdutosService` - mantido
- `PedidoService` - mantido
- `EnderecoService` - mantido

### 3.2 Fluxo por Tela

| Tela | Fonte de Dados | Estado (Signals) |
|------|----------------|-------------------|
| Dashboard | `AuthService.usuario` + `ApiService.get('/saldo')` | `saldo`, `loading` |
| Produtos/List | `ProdutosService.listar({ busca })` | `produtos`, `loading`, `busca` |
| Produtos/Detail | `ProdutosService.detalhe(id)` | `produto`, `loading` |
| Checkout | `ProdutosService.detalhe(produtoId)` + `EnderecoService.listar()` | `produto`, `enderecos`, `enderecoSelecionado` |
| Pedidos/List | `PedidoService.listar()` | `pedidos`, `loading` |
| Pedidos/Detail | `PedidoService.detalhe(id)` | `pedido`, `loading` |
| Endereços/List | `EnderecoService.listar()` | `enderecos`, `loading` |
| Endereços/Form | `EnderecoService.criar()` ou `atualizar()` | `endereco`, `loading` |
| Extrato | `ApiService.get('/extrato')` | `transacoes`, `loading` |

### 3.3 Navegação
- Mantém `RouterLink` no template
- Navegação programática via `Router`
- Rotas em `app.routes.ts` inalteradas

---

## 4. Error Handling & Validação

### 4.1 Error Handling (Inalterado)
- `ErrorInterceptor` captura HTTP errors
- `ToastService` / `ToastComponent` exibe mensagens (atualizar estilo para design system)
- Loading states: `SkeletonComponent` (atualizar estilo)

### 4.2 Validação Frontend
- **Login/Cadastro**: Reactive Forms com Validators (`required`, `email`, `minLength(6)`)
- **Endereços/Form**: Validators para campos obrigatórios
- Mensagens de erro: tipografia `text-label-sm` na cor `--color-error`

### 4.3 Feedback Visual
- **Loading**: `SkeletonComponent` com cores do design system
- **Empty State**: `EmptyStateComponent` com ícone e mensagem
- **Success**: Toast verde (usar `--color-tertiary-container` com opacidade)
- **Error**: Toast vermelho (usar `--color-error-container` com opacidade)
- **Hover/Active**: Transições 200ms ease-in-out (`var(--transition-fast)`)

---

## 5. O que NÃO muda

- Lógica de negócio em serviços
- `AuthGuard` e `ErrorInterceptor`, `AuthInterceptor`
- Estrutura de rotas (`app.routes.ts`)
- Models/interfaces (`shared/models/index.ts`)
- Configuração de ambiente (`environments/`)
- Comportamento de navegação

---

## 6. Telas Mobile

O Stitch possui versões mobile para todas as telas. A refatoração deve:
- Usar as telas desktop como base principal
- Garantir que o CSS seja **mobile-first** (conforme design system)
- Testar responsividade com as media queries já definidas no styles.css
- Telas mobile do Stitch servem como referência para breakpoints menores

---

## 7. Implementação

### 7.1 Ordem de Implementação
1. `styles.css` - Design system completo
2. Shared Components - `Button`, `Input`, `Card`, `StatusChip`
3. Novos Shared Components - `Navbar`, `SaldoDisplay`, `ProductCard`
4. Page Templates - Converter HTMLs do Stitch para Angular
5. Testar e ajustar responsividade

### 7.2 Acesso aos HTMLs do Stitch
Os HTMLs estão disponíveis via `stitch_get_screen` → `htmlCode.downloadUrl`. Exemplo de download:
```bash
curl -L "https://contribution.usercontent.google.com/download?c=..." -o frontend/src/app/features/auth/login/login.stitch.html
```
Depois converter manualmente para o template Angular.

---

**Documento preparado para revisão antes da criação do plano de implementação.**
