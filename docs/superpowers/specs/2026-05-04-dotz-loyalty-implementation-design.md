# Design Doc: POC Dotz Loyalty — Implementação Strategy

**Date:** 2026-05-04
**Status:** Draft — awaiting review
**Source:** PRD (prd.md) + Stitch screens ("POC Dotz Loyalty UI", project 1851586049690126454)

---

## 1. Objetivo

Implementar uma POC completa de programa de fidelidade Dotz com backend Node.js, frontend Angular e banco PostgreSQL, seguindo os requisitos do PRD e usando as 9 telas do Stitch como referência de UI/UX.

---

## 2. Telas Analisadas (Stitch — Projeto Principal)

O projeto "POC Dotz Loyalty UI" contém 9 telas funcionais, cada uma com versão Desktop e Mobile (18 variações total):

| # | Tela | Propósito |
|---|------|-----------|
| 1 | Cadastro | Formulário de registro (email + senha), validação, link para login |
| 2 | Login | Autenticação com email/senha, link para cadastro |
| 3 | Dashboard | Saldo em destaque, boas-vindas, atalhos rápidos |
| 4 | Produtos | Catálogo com filtros, busca, paginação, cards |
| 5 | Detalhe do Produto | Info completa, botão "Resgatar", indicador de saldo |
| 6 | Checkout | Seleção de endereço, resumo, confirmação de resgate |
| 7 | Endereços | CRUD completo + marcar padrão |
| 8 | Extrato | Tabela de transações, filtros por período |
| 9 | Pedidos | Lista de pedidos com status visuais |

---

## 3. Mapeamento: Tela → Ações → Endpoint → Entidade

```
CADASTRO
  └─ Criar conta              → POST /api/usuarios       → usuarios

LOGIN
  └─ Autenticar               → POST /api/login          → usuarios (JWT gerado)

DASHBOARD
  ├─ Carregar perfil          → GET /api/me              → usuarios
  └─ Carregar saldo           → GET /api/saldo           → usuarios.saldo_pontos

PRODUTOS
  ├─ Listar com filtros       → GET /api/produtos        → produtos
  ├─ Buscar/categoria/pagina  → GET /api/produtos?params → produtos
  └─ Ver detalhe              → GET /api/produtos/:id    → produtos

DETALHE DO PRODUTO
  ├─ Carregar produto         → GET /api/produtos/:id    → produtos
  ├─ Verificar saldo          → GET /api/saldo           → usuarios.saldo_pontos
  └─ Iniciar resgate          → (navega checkout)        → —

CHECKOUT
  ├─ Listar endereços         → GET /api/enderecos       → enderecos
  ├─ Selecionar endereço      → (client-side)            → enderecos
  └─ Confirmar resgate        → POST /api/resgates       → pedidos + transacoes + usuarios

ENDEREÇOS
  ├─ Listar                   → GET /api/enderecos       → enderecos
  ├─ Criar                    → POST /api/enderecos      → enderecos
  ├─ Editar                   → PUT /api/enderecos/:id   → enderecos
  ├─ Excluir                  → DELETE /api/enderecos/:id→ enderecos
  └─ Marcar padrão            → PUT /api/enderecos/:id   → enderecos.padrao

EXTRATO
  ├─ Listar transações        → GET /api/extrato         → transacoes
  └─ Filtrar por período      → GET /api/extrato?periodo → transacoes

PEDIDOS
  ├─ Listar pedidos           → GET /api/pedidos         → pedidos
  └─ Ver detalhe do pedido    → GET /api/pedidos/:id     → pedidos + produtos + enderecos
```

---

## 4. Gaps: PRD vs Telas

| Status | Item PRD | Situação |
|--------|----------|----------|
| ✅ Coberto | RF-01 Cadastro | Tela existe com validação |
| ✅ Coberto | RF-02 Login/Auth | Tela existe |
| ✅ Coberto | RF-03 Endereços CRUD | Tela completa |
| ✅ Coberto | RF-04 Saldo + Extrato | Dashboard + Extrato |
| ✅ Coberto | RF-05 Catálogo Produtos | Tela com filtros e paginação |
| ✅ Coberto | RF-06 Resgate | Checkout com endereço + confirmação |
| ✅ Coberto | RF-07 Pedidos | Tela Pedidos com status |
| ⚠️ Faltando | Tela Detalhe do Pedido | Endpoint existe mas sem tela dedicada |
| ⚠️ Faltando | UX Saldo insuficiente | Feedback visual quando sem pontos |
| ⚠️ Faltando | UX Sem endereço | Redirecionar para cadastrar no checkout |
| ❌ Faltando | Loading/Error states | Sem skeletons, spinners ou error boundaries |
| ❌ Faltando | Tela Não autorizado | Guard sem fallback visual |

**Redundâncias:** Nenhuma. As 9 telas são distintas e cobrem fluxos diferentes.

---

## 5. Arquitetura

### Backend (Node.js + Express + PostgreSQL)

```
backend/
├── src/
│   ├── config/         # db.js (pool), jwt.js (secret/expiry), env.js
│   ├── controllers/    # usuarios, auth, enderecos, saldo, produtos, resgates, pedidos
│   ├── services/       # resgateService (transação atômica), saldoService
│   ├── models/         # Queries SQL parametrizadas por entidade
│   ├── routes/         # Express router por feature
│   ├── middlewares/    # auth.js (verify JWT), validate.js (Zod), error.js
│   ├── utils/          # bcrypt.js, jwt.js
│   └── app.js          # Express setup, middleware chain
├── migrations/         # node-pg-migrate
├── seeds/              # produtos exemplo, transações demo
├── tests/
├── .env.example
└── package.json
```

**Decisões técnicas:**
- **Express** — framework REST minimalista
- **node-pg** (pool) — driver nativo PostgreSQL, sem ORM
- **Zod** — validação de input nos middlewares
- **node-pg-migrate** — migrations para criar tabelas e seeds
- **JWT** — 8h expiry, `Authorization: Bearer <token>`
- **bcrypt** — fator 10 para hash de senhas
- **Transação atômica** no resgate: `BEGIN` → check saldo → check produto → check endereço → `UPDATE saldo` + `INSERT pedido` + `INSERT transacao` → `COMMIT`

### Frontend (Angular)

```
frontend/
└── src/app/
    ├── core/                    # Singletons globais
    │   ├── guards/              # auth.guard.ts
    │   ├── interceptors/        # auth.interceptor.ts, error.interceptor.ts
    │   └── services/            # api.service.ts, auth.service.ts
    ├── shared/                  # Reusable components e models
    │   ├── components/          # button, card, input, toast, skeleton, status-chip, empty-state
    │   └── models/              # interfaces TypeScript
    └── features/                # Lazy-loaded feature modules
        ├── auth/                # login, cadastro
        ├── dashboard/           # saldo + atalhos
        ├── produtos/            # lista + detalhe
        ├── checkout/            # seleção endereço + confirmação
        ├── enderecos/           # CRUD
        ├── extrato/             # tabela + filtros
        └── pedidos/             # lista + detalhe
```

**Decisões técnicas:**
- **Standalone components** (Angular 17+) — reduz boilerplate de NgModules
- **Lazy loading** por feature — carrega sob demanda
- **HttpClient** com interceptors para JWT e error handling global
- **Signals** para state management local (leve, sem NgRx para POC)
- **Reactive Forms** com validação

---

## 6. Componentes Shared

| Component | Uso |
|-----------|-----|
| `ButtonComponent` | Primary (orange), Secondary (outline), disabled |
| `CardComponent` | Product cards, address cards, order cards |
| `InputComponent` | Text, email, password, select com validação |
| `ToastComponent` | Notificações success/error |
| `SkeletonComponent` | Loading placeholders |
| `StatusChipComponent` | Status de pedido (Confirmado, Enviado, Entregue) |
| `EmptyStateComponent` | "Nenhum pedido", "Sem endereços", etc |

---

## 7. Data Flow

### Auth Flow
```
User → Form → Validate (client) → POST /api/usuarios or /api/login
                                        ↓
                                    Response (201 or JWT)
                                        ↓
                            Login: save JWT → redirect /dashboard
                            Cadastro: redirect /login
```

### Dashboard Flow
```
Route activate → AuthGuard → GET /api/me + GET /api/saldo
                                      ↓
                            Exibe: "Olá, Nome" + Saldo
                                      ↓
                            Quick links → router.navigate()
```

### Resgate Flow
```
Produtos list → GET /api/produtos → Cards grid
     ↓ (click)
Detalhe → GET /api/produtos/:id → Info + botão "Resgatar"
     ↓ (if saldo >= pontos)
Checkout → GET /api/enderecos → Select address
     ↓ (confirm)
POST /api/resgates { produto_id, endereco_id }
     ↓ (201)
Redirect /pedidos + toast "Resgate realizado!"
```

---

## 8. Error Handling

### Backend
- Middleware `errorHandler` captura todos os erros no final da cadeia
- Respostas padronizadas: `{ "erro": "descrição" }`
- HTTP codes: 400 (validação), 401 (auth), 403 (forbidden), 404 (not found), 409 (conflict), 422 (unprocessable), 500 (server)

### Frontend
- `ErrorInterceptor` captura HTTP errors globalmente:
  - `401` → Limpa JWT → redirect `/login`
  - `400/422` → Extrai mensagem → exibe Toast
  - `500` → Toast genérico
- Reactive Forms com feedback inline antes de enviar
- `AuthGuard` protege rotas; token expirado → redirect login

---

## 9. Testing Strategy

### Backend
- **Unitários** (Jest/Vitest): services e middlewares com mocks
- **Integração** (supertest): endpoints com DB de teste
  - Fluxo completo: cadastro → login → resgate → pedido

### Frontend
- **Unitários** (Jasmine/Karma): pipes, components isolados
- **E2E** (Cypress/Playwright): fluxo crítico cadastro → login → resgate → pedido

---

## 10. Sugestões de Melhoria

### UX
- Tela de **Detalhe do Pedido** (endpoint existe no PRD)
- Feedback visual para **saldo insuficiente** (botão desabilitado + tooltip)
- **Empty states** para primeira vez sem dados
- **Skeleton loading** nos cards e tabelas
- **Toast/snackbar** para feedback de ações

### Arquitetura
- Interceptors para JWT + error handling global
- Route guards protegendo todas as rotas internas
- Migrations para criar tabelas (não SQL inline)
- Validation middleware (Zod) antes dos controllers
- Transaction atômica no resgate
