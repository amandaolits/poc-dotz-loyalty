# Dotz Loyalty — Screen Design Specification

**Date:** 2026-05-04  
**Product:** POC Dotz Loyalty — Programa de Fidelidade  
**Source:** prd.md (Requirements RF-01 through RF-07)

---

## Overview

9 screens organized into 3 flows: Authentication, Core Experience, Account Management.  
Top navbar navigation. Dotz brand colors (orange/red/white).  
All screens responsive (mobile-first per RNF-07).

---

## 1. Auth Flow

### 1.1 Login
- **Route:** `/login`
- **Purpose:** Authenticate existing users
- **Components:**
  - Email input (required, format validation)
  - Password input (required, min 6 chars)
  - "Entrar" button
  - Link: "Cadastre-se" → Register
- **API:** POST /api/login → store JWT in localStorage → redirect `/dashboard`
- **States:** loading spinner, invalid credentials error (401), network error

### 1.2 Register
- **Route:** `/cadastro`
- **Purpose:** New user registration
- **Components:**
  - Email input (required, unique, format validation)
  - Password input (required, min 6 chars)
  - Confirm password input (must match)
  - "Cadastrar" button
  - Link: "Já tem conta? Faça login" → Login
- **API:** POST /api/usuarios → 201 → redirect `/login`
- **States:** email already taken (409), password validation, network error, loading

---

## 2. Core Experience

### 2.1 Dashboard
- **Route:** `/dashboard`
- **Purpose:** Entry point after login — overview of account
- **Components:**
  - Saldo card (large, prominent points display)
  - Quick-action grid: Products, Orders, Addresses, Statement (cards with icons)
  - Recent activity section (last 3 transactions from /api/extrato)
- **API:** GET /api/saldo, GET /api/me, GET /api/extrato?limite=3
- **States:** loading (initial fetch), empty activity, API error

### 2.2 Products
- **Route:** `/produtos`
- **Purpose:** Browse catalog of redeemable products
- **Components:**
  - Search bar (text input, filters by name)
  - Category dropdown filter
  - Subcategory dropdown filter (populated based on selected category)
  - Product grid: cards with image, name, points cost
  - Pagination controls
- **API:** GET /api/produtos?categoria=&subcategoria=&busca=&pagina=
- **States:** loading, no results message, empty catalog, network error

### 2.3 Product Detail
- **Route:** `/produtos/:id`
- **Purpose:** Full product view + initiate redemption
- **Components:**
  - Product image (large)
  - Product name (heading)
  - Description
  - Points cost (highlighted)
  - "Resgatar" button
  - Back link → `/produtos`
- **API:** GET /api/produtos/:id
- **States:** loading, product not found (404), insufficient saldo warning, no addresses registered warning

### 2.4 Checkout
- **Route:** `/resgate/:produtoId`
- **Purpose:** Confirm redemption with address selection
- **Components:**
  - Product summary (name, image, points)
  - Address selector (radio buttons from user's addresses, default pre-selected)
  - Link: "Cadastrar novo endereço" → `/enderecos`
  - Points summary: current saldo, points after redemption
  - "Confirmar Resgate" button
- **API:** GET /api/enderecos, GET /api/saldo, POST /api/resgates → 201 → redirect `/pedidos`
- **States:** loading, no addresses available, insufficient saldo, confirmation success, error

---

## 3. Account Management

### 3.1 My Addresses
- **Route:** `/enderecos`
- **Purpose:** CRUD for delivery addresses
- **Components:**
  - Address list (cards showing full address, "Padrão" badge on default)
  - "Novo Endereço" button
  - Add/Edit form: cep, logradouro, numero, complemento, bairro, cidade, estado, checkbox "Definir como padrão"
  - Delete confirmation modal
  - Set default action (radio or button)
- **API:** GET /api/enderecos, POST /api/enderecos, PUT /api/enderecos/:id, DELETE /api/enderecos/:id
- **States:** loading, empty (no addresses), form validation errors, server error, delete confirmation

### 3.2 My Orders
- **Route:** `/pedidos`
- **Purpose:** View order history
- **Components:**
  - Order list (cards: product name, date, status badge, points spent)
  - Status colors: Confirmado (green), Em trânsito (blue), Entregue (gray)
  - Click order → detail view
- **Route:** `/pedidos/:id`
- **Detail Components:**
  - Product info, full delivery address, status timeline, order date, points spent
- **API:** GET /api/pedidos, GET /api/pedidos/:id
- **States:** loading, empty (no orders), order not found

### 3.3 My Statement
- **Route:** `/extrato`
- **Purpose:** View point transaction history
- **Components:**
  - Period filter: "Último mês" | "3 meses" | "Personalizado" (date range picker)
  - Transaction table columns: date, type (ganho/resgate), points (+/-), description
  - Saldo summary at top
- **API:** GET /api/extrato?periodo=, GET /api/saldo
- **States:** loading, empty period, no transactions, network error

---

## Navigation Structure

```
Top Navbar (authenticated):
├── Logo (click → /dashboard)
├── Saldo badge (click → /extrato)
├── Nav links: Produtos | Pedidos | Endereços | Extrato
└── Logout button (clears JWT → /login)
```

## Route Guard

- `/login`, `/cadastro` — accessible without auth
- All other routes — require valid JWT; redirect to `/login` if missing/expired

## Design Tokens (Dotz Brand)

- **Primary/Accent:** #FF6B00 (orange) — used for CTAs, highlights, and key interactions
- **Secondary:** #6B7280 (neutral gray) — used for text, borders, subtle UI elements
- **Neutral:** #FFFFFF, #F5F5F5, #333333
- **Success:** #28A745
- **Warning:** #FFC107
- **Error:** #DC3545

---

## Notes

- All screens follow mobile-first responsive design
- Loading states use spinners/skeleton placeholders
- Empty states include helpful messaging and CTAs
- Error states display user-friendly messages (API errors mapped to pt-BR)
- JWT stored in localStorage with 8h expiry (per PRD)
- Password min 6 chars, email unique identifier
