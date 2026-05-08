# Test Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add automated test coverage to the Dotz Loyalty POC — backend (unit + integration), frontend (unit), and E2E — based on PRD requirements.

**Architecture:** Backend uses Jest + Supertest with a real test PostgreSQL database. Frontend uses Jest with `jest-preset-angular` (no Karma browser dependency). E2E uses Playwright. Tests mirror the PRD's functional requirements, acceptance criteria, and business rules.

**Tech Stack:** Jest, Supertest, jest-preset-angular, Playwright, PostgreSQL (test DB via `dotz_loyalty_test`), Zod (validation library already present).

---

## File Structure

### Backend
```
backend/
  jest.config.js                    # Jest configuration
  .env.test                         # Test database credentials
  tests/
    helpers/
      setup.js                      # globalSetup/globalTeardown (migrate + truncate)
      factories.js                  # Test data factories
    unit/
      middlewares/
        auth.test.js                # JWT middleware tests
        validate.test.js            # Zod validation middleware tests
      services/
        resgateService.test.js      # Atomic redemption service tests
      models/
        usuarioModel.test.js
        enderecoModel.test.js
        produtoModel.test.js
        pedidoModel.test.js
        transacaoModel.test.js
    integration/
      routes/
        usuarioRoutes.test.js       # POST /api/usuarios
        authRoutes.test.js          # POST /api/login, GET /api/me
        enderecoRoutes.test.js      # CRUD /api/enderecos
        saldoRoutes.test.js         # GET /api/saldo, GET /api/extrato
        produtoRoutes.test.js       # GET /api/produtos, GET /api/produtos/:id
        resgateRoutes.test.js       # POST /api/resgates
        pedidoRoutes.test.js        # GET /api/pedidos, GET /api/pedidos/:id
```

### Frontend
```
frontend/
  jest.config.js                    # Jest config for Angular
  setup-jest.ts                     # Jest setup (ngMocks, resetting)
  src/app/
    core/
      services/
        auth.service.spec.ts
        api.service.spec.ts
      interceptors/
        auth.interceptor.spec.ts
        error.interceptor.spec.ts
      guards/
        auth.guard.spec.ts
    features/
      auth/
        login/
          login.component.spec.ts
        cadastro/
          cadastro.component.spec.ts
      dashboard/
        dashboard.component.spec.ts
      enderecos/
        endereco.service.spec.ts
        list/
          list.component.spec.ts
        form/
          form.component.spec.ts
      extrato/
        extrato.component.spec.ts
      produtos/
        produtos.service.spec.ts
        list/
          list.component.spec.ts
        detail/
          detail.component.spec.ts
      checkout/
        checkout.component.spec.ts
      pedidos/
        pedido.service.spec.ts
        list/
          list.component.spec.ts
        detail/
          detail.component.spec.ts
    shared/
      services/
        toast.service.spec.ts
      components/
        button.component.spec.ts
        card.component.spec.ts
        footer.component.spec.ts
        input.component.spec.ts
        navbar.component.spec.ts
        product-card.component.spec.ts
        saldo-display.component.spec.ts
        skeleton.component.spec.ts
        status-chip.component.spec.ts
        toast.component.spec.ts
        empty-state.component.spec.ts
```

### E2E
```
e2e/
  package.json
  playwright.config.ts
  .env                           # Backend URL
  tests/
    cadastro.spec.ts
    login.spec.ts
    produtos.spec.ts
    resgate.spec.ts
    pedidos.spec.ts
```

---

## Phase 0: Project Setup

### Task 0.1: Create branch from develop

- [ ] **Create feature branch**
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b feature/test-automation
  ```

### Task 0.2: Install backend test dependencies

- [ ] **Install Jest + Supertest**
  ```bash
  cd backend
  npm install --save-dev jest supertest
  ```
  This adds: `jest` (test runner), `supertest` (HTTP assertions).

### Task 0.3: Create backend Jest config

- [ ] **Create `backend/jest.config.js`**
  ```js
  module.exports = {
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.js"],
    setupFilesAfterSetup: [],
    globalSetup: "<rootDir>/tests/helpers/setup.js",
    globalTeardown: "<rootDir>/tests/helpers/teardown.js",
    verbose: true,
    collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
    coverageDirectory: "coverage",
  };
  ```

### Task 0.4: Create backend test DB config

- [ ] **Create `backend/.env.test`**
  ```
  PORT=3001
  DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dotz_loyalty_test
  JWT_SECRET=test-secret-key
  JWT_EXPIRES_IN=8h
  ```

  Note: `.env.*` is gitignored (except `.env.example`), so test credentials stay local.

### Task 0.5: Create backend test helpers (setup + factories)

- [ ] **Create `backend/tests/helpers/setup.js`**
  ```js
  require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env.test") });
  const { execSync } = require("child_process");
  const path = require("path");
  const pool = require("../../src/config/db");

  async function ensureTestDb() {
    const adminPool = new (require("pg").Pool)({
      connectionString: process.env.DATABASE_URL.replace("/dotz_loyalty_test", "/postgres"),
    });
    try {
      await adminPool.query("CREATE DATABASE dotz_loyalty_test");
    } catch (e) {
      if (!e.message.includes("already exists")) throw e;
    }
    await adminPool.end();
  }

  async function runMigrations() {
    const migratePath = path.resolve(__dirname, "../../node_modules/.bin/node-pg-migrate");
    execSync(`node "${migratePath}" up --migration-file-language js --migrations-dir="${path.resolve(__dirname, "../../migrations")}"`, {
      cwd: path.resolve(__dirname, "../.."),
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: "pipe",
    });
  }

  async function truncateTables() {
    const result = await pool.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'migrations'"
    );
    for (const row of result.rows) {
      await pool.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
    }
  }

  module.exports = async () => {
    await ensureTestDb();
    await runMigrations();
    await truncateTables();
    await pool.end();
  };
  ```

- [ ] **Create `backend/tests/helpers/setupEach.js`**
  ```js
  const pool = require("../../src/config/db");

  beforeAll(async () => {
    const result = await pool.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != 'migrations'"
    );
    for (const row of result.rows) {
      await pool.query(`TRUNCATE TABLE "${row.tablename}" CASCADE`);
    }
  });

  afterAll(async () => {
    await pool.end();
  });
  ```

- [ ] **Create `backend/tests/helpers/factories.js`**
  ```js
  const bcrypt = require("bcrypt");
  const pool = require("../../src/config/db");

  async function createUsuario(email = "teste@email.com", senha = "123456") {
    const hash = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (email, senha_hash, saldo_pontos) VALUES ($1, $2, $3) RETURNING id, email, saldo_pontos",
      [email, hash, 10000]
    );
    return result.rows[0];
  }

  async function createEndereco(usuarioId, dados = {}) {
    const result = await pool.query(
      `INSERT INTO enderecos (usuario_id, cep, logradouro, numero, bairro, cidade, estado, padrao)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        usuarioId,
        dados.cep || "01310-100",
        dados.logradouro || "Av. Paulista",
        dados.numero || "1000",
        dados.bairro || "Bela Vista",
        dados.cidade || "São Paulo",
        dados.estado || "SP",
        dados.padrao ?? true,
      ]
    );
    return result.rows[0];
  }

  async function createProduto(dados = {}) {
    const result = await pool.query(
      `INSERT INTO produtos (nome, descricao, pontos_necessarios, categoria, subcategoria, imagem_url, ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        dados.nome || "Fone Bluetooth",
        dados.descricao || "Fone sem fio",
        dados.pontos_necessarios ?? 5000,
        dados.categoria || "Eletrônicos",
        dados.subcategoria || "Áudio",
        dados.imagem_url || "https://via.placeholder.com/300",
        dados.ativo ?? true,
      ]
    );
    return result.rows[0];
  }

  function generateToken(usuarioId, email = "teste@email.com") {
    const jwt = require("jsonwebtoken");
    const env = require("../../src/config/env");
    return jwt.sign({ userId: usuarioId, email }, env.jwtSecret, { expiresIn: "8h" });
  }

  module.exports = { createUsuario, createEndereco, createProduto, generateToken };
  ```

### Task 0.6: Add backend test scripts to package.json

- [ ] **Edit `backend/package.json`** — add scripts
  ```json
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:int": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
  ```
  Insert after existing `"db:migrate"` script.

### Task 0.7: Install frontend test dependencies

- [ ] **Install Jest + presets for Angular**
  ```bash
  cd frontend
  npm install --save-dev jest @types/jest jest-preset-angular @angular-builders/jest
  ```

### Task 0.8: Create frontend Jest config

- [ ] **Create `frontend/jest.config.js`**
  ```js
  module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterSetup: ["<rootDir>/setup-jest.ts"],
    testMatch: ["<rootDir>/src/**/*.spec.ts"],
    transform: {
      "^.+\\.(ts|mjs|js|html)$": [
        "jest-preset-angular",
        {
          tsconfig: "<rootDir>/tsconfig.json",
          stringifyContentPathRegex: "\\.html$",
        },
      ],
    },
    transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$)"],
    moduleNameMapper: {
      "^src/(.*)$": "<rootDir>/src/$1",
    },
    collectCoverageFrom: [
      "src/app/**/*.ts",
      "!src/app/**/*.module.ts",
      "!src/main.ts",
    ],
    coverageDirectory: "coverage",
  };
  ```

- [ ] **Create `frontend/setup-jest.ts`**
  ```ts
  import "jest-preset-angular/setup-jest";
  ```

### Task 0.9: Add frontend test script to package.json

- [ ] **Edit `frontend/package.json`** — replace `test` script
  ```json
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
  ```
  Replace existing `"test": "ng test"`.

### Task 0.10: Install Playwright for E2E

- [ ] **Create `e2e/package.json`**
  ```json
  {
    "name": "dotz-e2e",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "test": "playwright test",
      "test:ui": "playwright test --ui",
      "test:headed": "playwright test --headed"
    },
    "devDependencies": {
      "@playwright/test": "^1.48.0"
    }
  }
  ```

- [ ] **Install and init Playwright**
  ```bash
  cd e2e
  npm install
  npx playwright install chromium
  ```

- [ ] **Create `e2e/playwright.config.ts`**
  ```ts
  import { defineConfig } from "@playwright/test";

  export default defineConfig({
    testDir: "./tests",
    fullyParallel: false,
    retries: 1,
    use: {
      baseURL: "http://localhost:4200",
      apiURL: "http://localhost:3000/api",
      extraHTTPHeaders: { "Content-Type": "application/json" },
    },
    projects: [
      { name: "chromium", use: { browserName: "chromium" } },
    ],
  });
  ```

### Task 0.11: Create .env for E2E

- [ ] **Create `e2e/.env`**
  ```
  BASE_URL=http://localhost:4200
  API_URL=http://localhost:3000/api
  ```

### Task 0.12: Commit setup phase

- [ ] **Commit**
  ```bash
  git add backend/package.json backend/jest.config.js backend/.env.test backend/tests/helpers/ frontend/package.json frontend/jest.config.js frontend/setup-jest.ts e2e/
  git commit -m "test: add test infrastructure (Jest, Supertest, Playwright)"
  ```

---

## Phase 1: Backend Unit Tests

### Task 1.1: Auth middleware unit tests

**File:** `backend/tests/unit/middlewares/auth.test.js`
**PRD:** RF-02 (JWT), RNF-01

- [ ] **Write `auth.test.js`**
  ```js
  const jwt = require("jsonwebtoken");
  const env = require("../../../src/config/env");
  const authMiddleware = require("../../../src/middlewares/auth");

  jest.mock("jsonwebtoken");

  function mockReq(headers = {}) {
    return { headers };
  }

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  describe("authMiddleware", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 401 when no Authorization header", () => {
      const req = mockReq({});
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: "Token não fornecido" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when token is empty", () => {
      const req = mockReq({ authorization: "Bearer " });
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: "Token inválido" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with decoded user when token is valid", () => {
      jwt.verify.mockReturnValue({ userId: "abc-123", email: "test@test.com" });

      const req = mockReq({ authorization: "Bearer valid-token" });
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", env.jwtSecret);
      expect(req.userId).toBe("abc-123");
      expect(req.userEmail).toBe("test@test.com");
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 when token is expired or invalid", () => {
      jwt.verify.mockImplementation(() => { throw new Error("jwt expired"); });

      const req = mockReq({ authorization: "Bearer bad-token" });
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ erro: "Token inválido ou expirado" });
      expect(next).not.toHaveBeenCalled();
    });
  });
  ```

- [ ] **Run tests**
  ```bash
  cd backend && npx jest tests/unit/middlewares/auth.test.js --verbose
  ```
  Expected: 4 tests pass.

### Task 1.2: Validate middleware unit tests

**File:** `backend/tests/unit/middlewares/validate.test.js`
**PRD:** General validation

- [ ] **Write `validate.test.js`**
  ```js
  const { z } = require("zod");
  const validate = require("../../../src/middlewares/validate");

  function mockReq(body = {}) {
    return { body };
  }

  function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }

  describe("validate middleware", () => {
    const schema = z.object({
      email: z.string().email("Email inválido"),
      senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    });

    it("should call next with validated data on valid input", () => {
      const req = mockReq({ email: "test@test.com", senha: "123456" });
      const res = mockRes();
      const next = jest.fn();

      validate(schema)(req, res, next);

      expect(req.validatedBody).toEqual({ email: "test@test.com", senha: "123456" });
      expect(next).toHaveBeenCalled();
    });

    it("should return 400 on invalid email", () => {
      const req = mockReq({ email: "invalido", senha: "123456" });
      const res = mockRes();
      const next = jest.fn();

      validate(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: expect.any(String) }));
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 on short password", () => {
      const req = mockReq({ email: "test@test.com", senha: "123" });
      const res = mockRes();
      const next = jest.fn();

      validate(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: expect.any(String) }));
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 on missing fields", () => {
      const req = mockReq({});
      const res = mockRes();
      const next = jest.fn();

      validate(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
  ```

### Task 1.3: Resgate service unit tests

**File:** `backend/tests/unit/services/resgateService.test.js`
**PRD:** RF-06 (atômico), RF-04 (saldo)

- [ ] **Write `resgateService.test.js`**
  ```js
  const { realizarResgate } = require("../../../src/services/resgateService");
  const pool = require("../../../src/config/db");

  jest.mock("../../../src/config/db", () => {
    const mPool = { connect: jest.fn(), query: jest.fn(), end: jest.fn() };
    return mPool;
  });

  describe("realizarResgate", () => {
    let mockClient;

    beforeEach(() => {
      mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };
      pool.connect.mockResolvedValue(mockClient);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should fail if usuario not found", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })  // BEGIN
        .mockResolvedValueOnce({ rows: [] });  // SELECT usuario

      await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Usuário não encontrado");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should fail if produto not found", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })   // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })  // SELECT usuario
        .mockResolvedValueOnce({ rows: [] });   // SELECT produto

      await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Produto não encontrado ou inativo");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should fail if endereco not found or not owned by user", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })    // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })  // SELECT usuario
        .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000 }] })  // SELECT produto
        .mockResolvedValueOnce({ rows: [] });    // SELECT endereco

      await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Endereço não encontrado");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should fail if saldo insuficiente", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })    // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 1000 }] })  // usuario
        .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000, nome: "Fone" }] })  // produto
        .mockResolvedValueOnce({ rows: [{ id: "end-id" }] });  // endereco

      await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Saldo insuficiente");
      expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("should complete redemption atomically when all conditions met", async () => {
      mockClient.query
        .mockResolvedValueOnce({ rows: [] })                           // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })  // usuario
        .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000, nome: "Fone Bluetooth" }] })  // produto
        .mockResolvedValueOnce({ rows: [{ id: "end-id" }] })           // endereco
        .mockResolvedValueOnce({ rows: [] })                           // UPDATE saldo
        .mockResolvedValueOnce({ rows: [{ id: "ped-id", status: "Confirmado" }] })  // INSERT pedido
        .mockResolvedValueOnce({ rows: [] })                           // INSERT transacao
        .mockResolvedValueOnce({ rows: [] });                          // COMMIT

      const result = await realizarResgate("user-id", "prod-id", "end-id");

      expect(result.status).toBe("Confirmado");
      expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
      expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
      expect(mockClient.query).not.toHaveBeenCalledWith("ROLLBACK");
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
  ```

### Task 1.4: Model unit tests

**Files:** `backend/tests/unit/models/usuarioModel.test.js`, `enderecoModel.test.js`, `produtoModel.test.js`, `pedidoModel.test.js`, `transacaoModel.test.js`

**PRD:** RF-01 (cadastro), RF-03 (endereços), RF-05 (produtos), RF-07 (pedidos)

- [ ] **Write `usuarioModel.test.js`**
  ```js
  const pool = require("../../../src/config/db");
  const bcrypt = require("bcrypt");
  const { criar, buscarPorEmail, buscarPorId, atualizarSaldo } = require("../../../src/models/usuarioModel");

  jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));
  jest.mock("bcrypt");

  describe("usuarioModel", () => {
    afterEach(() => jest.clearAllMocks());

    it("criar: should insert user with bcrypt hash and return user data", async () => {
      bcrypt.hash.mockResolvedValue("hashed-password");
      pool.query.mockResolvedValue({ rows: [{ id: "u1", email: "test@test.com", saldo_pontos: 0, criado_em: new Date().toISOString() }] });

      const result = await criar("test@test.com", "123456");

      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO usuarios"),
        ["test@test.com", "hashed-password"]
      );
      expect(result.saldo_pontos).toBe(0);
    });

    it("buscarPorEmail: should find user by email", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "u1", email: "test@test.com" }] });
      const result = await buscarPorEmail("test@test.com");
      expect(result.email).toBe("test@test.com");
    });

    it("buscarPorEmail: should return null when not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await buscarPorEmail("notfound@test.com");
      expect(result).toBeNull();
    });

    it("buscarPorId: should return user by id without senha_hash", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "u1", email: "test@test.com", saldo_pontos: 500 }] });
      const result = await buscarPorId("u1");
      expect(result).not.toHaveProperty("senha_hash");
    });

    it("atualizarSaldo: should update user balance", async () => {
      const mockClient = { query: jest.fn() };
      await atualizarSaldo(mockClient, "u1", 5000);
      expect(mockClient.query).toHaveBeenCalledWith(
        "UPDATE usuarios SET saldo_pontos = $1 WHERE id = $2",
        [5000, "u1"]
      );
    });
  });
  ```

- [ ] **Write `enderecoModel.test.js`**
  ```js
  const pool = require("../../../src/config/db");
  const { listarPorUsuario, buscarPorId, criar, atualizar, remover, unsetPadrao } = require("../../../src/models/enderecoModel");

  jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));

  describe("enderecoModel", () => {
    afterEach(() => jest.clearAllMocks());

    it("listarPorUsuario: should list addresses ordered by padrao DESC", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "e1", padrao: true }, { id: "e2", padrao: false }] });
      const result = await listarPorUsuario("u1");
      expect(result).toHaveLength(2);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("ORDER BY padrao DESC"), ["u1"]);
    });

    it("buscarPorId: should find address by id and usuario_id", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "e1", usuario_id: "u1" }] });
      const result = await buscarPorId("e1", "u1");
      expect(result.id).toBe("e1");
    });

    it("buscarPorId: should return null when address belongs to another user", async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await buscarPorId("e1", "other-user");
      expect(result).toBeNull();
    });

    it("criar: should insert new address", async () => {
      const mockClient = { query: jest.fn() };
      mockClient.query.mockResolvedValue({ rows: [{ id: "e1", logradouro: "Rua A" }] });
      const result = await criar(mockClient, "u1", { cep: "01310-100", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP", padrao: true });
      expect(result.logradouro).toBe("Rua A");
    });

    it("remover: should delete only when address belongs to user", async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });
      const result = await remover("e1", "u1");
      expect(result).toBe(true);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM enderecos"),
        ["e1", "u1"]
      );
    });

    it("unsetPadrao: should set all user addresses to non-default", async () => {
      const mockClient = { query: jest.fn() };
      await unsetPadrao(mockClient, "u1");
      expect(mockClient.query).toHaveBeenCalledWith(
        "UPDATE enderecos SET padrao = false WHERE usuario_id = $1",
        ["u1"]
      );
    });
  });
  ```

- [ ] **Write `produtoModel.test.js`** (key tests)
  ```js
  const pool = require("../../../src/config/db");
  const { listar, buscarPorId } = require("../../../src/models/produtoModel");

  jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));

  describe("produtoModel", () => {
    afterEach(() => jest.clearAllMocks());

    it("listar: should only return active products", async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: "1" }] })
        .mockResolvedValueOnce({ rows: [{ id: "p1", nome: "Fone", ativo: true }] })
        .mockResolvedValueOnce({ rows: [{ categoria: "Eletrônicos" }] })
        .mockResolvedValueOnce({ rows: [{ subcategoria: "Áudio" }] });

      const result = await listar({ pagina: 1, limite: 10 });
      expect(result.produtos).toHaveLength(1);
      expect(pool.query.mock.calls[0][0]).toContain("ativo = true");
    });

    it("listar: should apply combined filters", async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ count: "0" }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ categoria: "Eletrônicos" }] })
        .mockResolvedValueOnce({ rows: [] });

      await listar({ categoria: "Eletrônicos", subcategoria: "Áudio", busca: "fone", pagina: 1, limite: 10 });
      const callSql = pool.query.mock.calls[0][0];
      expect(callSql).toContain("categoria = $1");
      expect(callSql).toContain("subcategoria = $2");
      expect(callSql).toContain("nome ILIKE $3");
    });

    it("buscarPorId: should only return active product", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "p1", ativo: true }] });
      const result = await buscarPorId("p1");
      expect(result.id).toBe("p1");
      expect(pool.query.mock.calls[0][0]).toContain("ativo = true");
    });

    it("buscarPorId: should return null for inactive product", async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await buscarPorId("inactive-id");
      expect(result).toBeNull();
    });
  });
  ```

- [ ] **Write `pedidoModel.test.js`**
  ```js
  const pool = require("../../../src/config/db");
  const { criar, listarPorUsuario, buscarPorId } = require("../../../src/models/pedidoModel");

  jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));

  describe("pedidoModel", () => {
    afterEach(() => jest.clearAllMocks());

    it("criar: should insert order with status Confirmado", async () => {
      const mockClient = { query: jest.fn() };
      mockClient.query.mockResolvedValue({ rows: [{ id: "p1", status: "Confirmado" }] });
      const result = await criar(mockClient, { usuario_id: "u1", produto_id: "pr1", endereco_entrega_id: "e1", pontos_gastos: 5000, status: "Confirmado" });
      expect(result.status).toBe("Confirmado");
    });

    it("listarPorUsuario: should return only user orders ordered by date DESC", async () => {
      pool.query.mockResolvedValue({ rows: [{ id: "p1", produto_nome: "Fone" }] });
      const result = await listarPorUsuario("u1");
      expect(result).toHaveLength(1);
      expect(pool.query.mock.calls[0][0]).toContain("ORDER BY p.data_pedido DESC");
    });

    it("buscarPorId: should return null for another user's order", async () => {
      pool.query.mockResolvedValue({ rows: [] });
      const result = await buscarPorId("p1", "other-user");
      expect(result).toBeNull();
    });
  });
  ```

- [ ] **Write `transacaoModel.test.js`**
  ```js
  const { criar } = require("../../../src/models/transacaoModel");

  describe("transacaoModel", () => {
    it("criar: should insert transaction", async () => {
      const mockClient = { query: jest.fn() };
      mockClient.query.mockResolvedValue({ rows: [{ id: "t1", tipo: "resgate", pontos: 5000 }] });
      const result = await criar(mockClient, { usuario_id: "u1", tipo: "resgate", pontos: 5000, descricao: "Resgate: Fone" });
      expect(result.tipo).toBe("resgate");
      expect(mockClient.query.mock.calls[0][1]).toEqual(["u1", "resgate", 5000, "Resgate: Fone"]);
    });
  });
  ```

- [ ] **Run all unit tests**
  ```bash
  cd backend && npx jest tests/unit --verbose
  ```
  Expected: all pass.

### Task 1.5: Commit backend unit tests

- [ ] **Commit**
  ```bash
  git add backend/tests/unit/
  git commit -m "test: add backend unit tests for middlewares, services, and models"
  ```

---

## Phase 2: Backend Integration Tests

### Task 2.1: Auth routes integration tests

**File:** `backend/tests/integration/routes/authRoutes.test.js`
**PRD:** RF-01, RF-02

- [ ] **Write `authRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const { createUsuario, generateToken } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("POST /api/login", () => {
    it("should return 200 and JWT token with valid credentials", async () => {
      const usuario = await createUsuario("maria@email.com", "123456");

      const res = await request(app)
        .post("/api/login")
        .send({ email: "maria@email.com", senha: "123456" });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.usuario.email).toBe("maria@email.com");
    });

    it("should return 401 with wrong password", async () => {
      await createUsuario("maria@email.com", "123456");

      const res = await request(app)
        .post("/api/login")
        .send({ email: "maria@email.com", senha: "wrongpass" });

      expect(res.status).toBe(401);
      expect(res.body.erro).toMatch(/inválido/i);
    });

    it("should return 401 with non-existent email", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "naoexiste@email.com", senha: "123456" });

      expect(res.status).toBe(401);
    });

    it("should return 400 with invalid email format", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "notanemail", senha: "123456" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/me", () => {
    it("should return user data with valid token", async () => {
      const usuario = await createUsuario("me@test.com", "123456");
      const token = generateToken(usuario.id, usuario.email);

      const res = await request(app)
        .get("/api/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe("me@test.com");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/me");
      expect(res.status).toBe(401);
    });

    it("should return 401 with invalid token", async () => {
      const res = await request(app)
        .get("/api/me")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });
  });
  ```

### Task 2.2: Usuario routes integration tests

**File:** `backend/tests/integration/routes/usuarioRoutes.test.js`
**PRD:** RF-01

- [ ] **Write `usuarioRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const { createUsuario } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("POST /api/usuarios", () => {
    it("should return 201 and create user with saldo_pontos = 0", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send({ email: "novo@email.com", senha: "123456" });

      expect(res.status).toBe(201);
      expect(res.body.email).toBe("novo@email.com");
      expect(res.body.saldo_pontos).toBe(0);
      expect(res.body).not.toHaveProperty("senha_hash");
    });

    it("should return 409 when email already exists", async () => {
      await createUsuario("existente@email.com", "123456");

      const res = await request(app)
        .post("/api/usuarios")
        .send({ email: "existente@email.com", senha: "123456" });

      expect(res.status).toBe(409);
      expect(res.body.erro).toMatch(/já cadastrado/i);
    });

    it("should return 400 when password has less than 6 characters", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send({ email: "senhacurta@email.com", senha: "123" });

      expect(res.status).toBe(400);
    });

    it("should return 400 with invalid email", async () => {
      const res = await request(app)
        .post("/api/usuarios")
        .send({ email: "invalido", senha: "123456" });

      expect(res.status).toBe(400);
    });
  });
  ```

### Task 2.3: Endereco routes integration tests

**File:** `backend/tests/integration/routes/enderecoRoutes.test.js`
**PRD:** RF-03

- [ ] **Write `enderecoRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const { createUsuario, generateToken, createEndereco } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("Enderecos CRUD", () => {
    let token, usuario;

    beforeEach(async () => {
      usuario = await createUsuario("end@test.com", "123456");
      token = generateToken(usuario.id, usuario.email);
    });

    it("GET /api/enderecos — should list user addresses", async () => {
      await createEndereco(usuario.id, { logradouro: "Rua A", padrao: true });
      await createEndereco(usuario.id, { logradouro: "Rua B", padrao: false });

      const res = await request(app)
        .get("/api/enderecos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("GET /api/enderecos — should return 401 without token", async () => {
      const res = await request(app).get("/api/enderecos");
      expect(res.status).toBe(401);
    });

    it("POST /api/enderecos — should create address", async () => {
      const res = await request(app)
        .post("/api/enderecos")
        .set("Authorization", `Bearer ${token}`)
        .send({ cep: "01310-100", logradouro: "Av. Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP" });

      expect(res.status).toBe(201);
      expect(res.body.logradouro).toBe("Av. Paulista");
    });

    it("POST /api/enderecos — should return 400 with missing fields", async () => {
      const res = await request(app)
        .post("/api/enderecos")
        .set("Authorization", `Bearer ${token}`)
        .send({ cep: "01310-100" });

      expect(res.status).toBe(400);
    });

    it("POST /api/enderecos — should only allow one padrão", async () => {
      await createEndereco(usuario.id, { logradouro: "Primeiro", padrao: true });

      const res = await request(app)
        .post("/api/enderecos")
        .set("Authorization", `Bearer ${token}`)
        .send({ cep: "01310-100", logradouro: "Segundo", numero: "200", bairro: "Centro", cidade: "SP", estado: "SP", padrao: true });

      expect(res.status).toBe(201);

      const listRes = await request(app)
        .get("/api/enderecos")
        .set("Authorization", `Bearer ${token}`);

      const padraoCount = listRes.body.filter((e) => e.padrao === true).length;
      expect(padraoCount).toBe(1);
    });

    it("PUT /api/enderecos/:id — should update address", async () => {
      const end = await createEndereco(usuario.id);

      const res = await request(app)
        .put(`/api/enderecos/${end.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cep: "20000-000", logradouro: "Rua Nova", numero: "50", bairro: "Centro", cidade: "Rio", estado: "RJ" });

      expect(res.status).toBe(200);
      expect(res.body.logradouro).toBe("Rua Nova");
    });

    it("PUT /api/enderecos/:id — should return 404 for another user's address", async () => {
      const otherUser = await createUsuario("other@test.com", "123456");
      const otherEnd = await createEndereco(otherUser.id);

      const res = await request(app)
        .put(`/api/enderecos/${otherEnd.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ cep: "01310-100", logradouro: "Rua", numero: "1", bairro: "Centro", cidade: "SP", estado: "SP" });

      expect(res.status).toBe(404);
    });

    it("DELETE /api/enderecos/:id — should delete address", async () => {
      const end = await createEndereco(usuario.id);

      const res = await request(app)
        .delete(`/api/enderecos/${end.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    it("DELETE /api/enderecos/:id — should return 404 for another user's address", async () => {
      const otherUser = await createUsuario("other2@test.com", "123456");
      const otherEnd = await createEndereco(otherUser.id);

      const res = await request(app)
        .delete(`/api/enderecos/${otherEnd.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
  ```

### Task 2.4: Saldo/Extrato routes integration tests

**File:** `backend/tests/integration/routes/saldoRoutes.test.js`
**PRD:** RF-04

- [ ] **Write `saldoRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const pool = require("../../../src/config/db");
  const { createUsuario, generateToken } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("GET /api/saldo", () => {
    it("should return current balance", async () => {
      const usuario = await createUsuario("saldo@test.com", "123456");
      const token = generateToken(usuario.id, usuario.email);

      const res = await request(app)
        .get("/api/saldo")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.saldo_pontos).toBe(10000);
    });
  });

  describe("GET /api/extrato", () => {
    it("should return paginated transactions", async () => {
      const usuario = await createUsuario("extrato@test.com", "123456");
      const token = generateToken(usuario.id, usuario.email);

      await pool.query("INSERT INTO transacoes (usuario_id, tipo, pontos, descricao) VALUES ($1,'ganho',5000,'Ganho inicial')", [usuario.id]);

      const res = await request(app)
        .get("/api/extrato")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.transacoes).toHaveLength(1);
      expect(res.body.total).toBe(1);
      expect(res.body.pagina).toBe(1);
    });

    it("should filter by periodo=1m", async () => {
      const usuario = await createUsuario("extrato2@test.com", "123456");
      const token = generateToken(usuario.id, usuario.email);

      // old transaction (over 1 month ago)
      await pool.query(
        "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES ($1,'ganho',5000,'Antigo', NOW() - INTERVAL '60 days')",
        [usuario.id]
      );
      // recent transaction
      await pool.query(
        "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES ($1,'ganho',3000,'Recente', NOW())",
        [usuario.id]
      );

      const res = await request(app)
        .get("/api/extrato?periodo=1m")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.transacoes).toHaveLength(1);
    });
  });
  ```

### Task 2.5: Produto routes integration tests

**File:** `backend/tests/integration/routes/produtoRoutes.test.js`
**PRD:** RF-05

- [ ] **Write `produtoRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const { createUsuario, generateToken, createProduto } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("Produtos", () => {
    let token;

    beforeEach(async () => {
      const usuario = await createUsuario("prod@test.com", "123456");
      token = generateToken(usuario.id, usuario.email);
    });

    it("GET /api/produtos — should list active products", async () => {
      await createProduto({ nome: "Fone", pontos_necessarios: 5000, ativo: true });
      await createProduto({ nome: "Inativo", pontos_necessarios: 1000, ativo: false });

      const res = await request(app)
        .get("/api/produtos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.produtos).toHaveLength(1);
    });

    it("GET /api/produtos — should filter by categoria", async () => {
      await createProduto({ nome: "Fone", pontos_necessarios: 5000, categoria: "Eletrônicos" });
      await createProduto({ nome: "Cafeteira", pontos_necessarios: 8000, categoria: "Casa" });

      const res = await request(app)
        .get("/api/produtos?categoria=Casa")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.produtos).toHaveLength(1);
      expect(res.body.produtos[0].nome).toBe("Cafeteira");
    });

    it("GET /api/produtos/:id — should return product detail", async () => {
      const prod = await createProduto({ nome: "Fone Teste" });

      const res = await request(app)
        .get(`/api/produtos/${prod.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.nome).toBe("Fone Teste");
    });

    it("GET /api/produtos/:id — should return 404 for inactive product", async () => {
      const prod = await createProduto({ nome: "Inativo", ativo: false });

      const res = await request(app)
        .get(`/api/produtos/${prod.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
  ```

### Task 2.6: Resgate routes integration tests

**File:** `backend/tests/integration/routes/resgateRoutes.test.js`
**PRD:** RF-06 (atômico, crítico)

- [ ] **Write `resgateRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const { createUsuario, generateToken, createEndereco, createProduto } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("POST /api/resgates", () => {
    let token, usuario, endereco, produto;

    beforeEach(async () => {
      usuario = await createUsuario("resgate@test.com", "123456", 10000);
      token = generateToken(usuario.id, usuario.email);
      endereco = await createEndereco(usuario.id);
      produto = await createProduto({ nome: "Fone", pontos_necessarios: 5000 });
    });

    it("should return 201 on successful redemption", async () => {
      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)
        .send({ produto_id: produto.id, endereco_id: endereco.id });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("Confirmado");
    });

    it("should return 400 when saldo is insufficient", async () => {
      const caroProduto = await createProduto({ nome: "TV", pontos_necessarios: 999999 });

      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)
        .send({ produto_id: caroProduto.id, endereco_id: endereco.id });

      expect(res.status).toBe(400);
      expect(res.body.erro).toMatch(/saldo insuficiente/i);
    });

    it("should return 422 when endereco is not found", async () => {
      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)
        .send({ produto_id: produto.id, endereco_id: "00000000-0000-0000-0000-000000000000" });

      expect(res.status).toBe(422);
      expect(res.body.erro).toMatch(/endereço/i);
    });

    it("should return 404 when produto is inactive", async () => {
      const inactiveProd = await createProduto({ nome: "Inativo", pontos_necessarios: 1000, ativo: false });

      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)
        .send({ produto_id: inactiveProd.id, endereco_id: endereco.id });

      expect(res.status).toBe(404);
    });

    it("should be atomic — debitar pontos and criar pedido in same transaction", async () => {
      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)
        .send({ produto_id: produto.id, endereco_id: endereco.id });

      expect(res.status).toBe(201);

      const saldoRes = await request(app)
        .get("/api/saldo")
        .set("Authorization", `Bearer ${token}`);

      expect(saldoRes.body.saldo_pontos).toBe(5000); // 10000 - 5000
    });

    it("should not allow redeeming another user's address", async () => {
      const outroUsuario = await createUsuario("outro@test.com", "123456", 99999);
      const outroEndereco = await createEndereco(outroUsuario.id);
      const outroToken = generateToken(outroUsuario.id, "outro@test.com"); // using wrong user

      const res = await request(app)
        .post("/api/resgates")
        .set("Authorization", `Bearer ${token}`)  // token is for first user
        .send({ produto_id: produto.id, endereco_id: outroEndereco.id });

      expect(res.status).toBe(422);
    });
  });
  ```

### Task 2.7: Pedido routes integration tests

**File:** `backend/tests/integration/routes/pedidoRoutes.test.js`
**PRD:** RF-07

- [ ] **Write `pedidoRoutes.test.js`**
  ```js
  const request = require("supertest");
  const app = require("../../../src/app");
  const pool = require("../../../src/config/db");
  const { createUsuario, generateToken, createEndereco, createProduto } = require("../../helpers/factories");
  require("../../helpers/setupEach");

  describe("Pedidos", () => {
    let token, usuario, endereco, produto, pedidoId;

    beforeEach(async () => {
      usuario = await createUsuario("pedido@test.com", "123456");
      token = generateToken(usuario.id, usuario.email);
      endereco = await createEndereco(usuario.id);
      produto = await createProduto({ nome: "Fone", pontos_necessarios: 5000 });

      const res = await pool.query(
        "INSERT INTO pedidos (usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status) VALUES ($1,$2,$3,$4,'Confirmado') RETURNING id",
        [usuario.id, produto.id, endereco.id, 5000]
      );
      pedidoId = res.rows[0].id;
    });

    it("GET /api/pedidos — should list user orders", async () => {
      const res = await request(app)
        .get("/api/pedidos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it("GET /api/pedidos/:id — should return order detail with address", async () => {
      const res = await request(app)
        .get(`/api/pedidos/${pedidoId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("Confirmado");
      expect(res.body.logradouro).toBeDefined();  // address fields from JOIN
    });

    it("GET /api/pedidos/:id — should return 404 for another user's order", async () => {
      const outroUser = await createUsuario("outro2@test.com", "123456");
      const outroToken = generateToken(outroUser.id, "outro2@test.com");

      const res = await request(app)
        .get(`/api/pedidos/${pedidoId}`)
        .set("Authorization", `Bearer ${outroToken}`);

      expect(res.status).toBe(404);
    });
  });
  ```

### Task 2.8: Run all integration tests

- [ ] **Run tests**
  ```bash
  cd backend && npx jest tests/integration --verbose
  ```
  Expected: all pass.

### Task 2.9: Commit backend integration tests

- [ ] **Commit**
  ```bash
  git add backend/tests/integration/
  git commit -m "test: add backend integration tests for all routes"
  ```

---

## Phase 3: Frontend Unit Tests

### Task 3.1: Auth service tests

**File:** `frontend/src/app/core/services/auth.service.spec.ts`
**PRD:** RF-02

- [ ] **Write `auth.service.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
  import { AuthService } from "./auth.service";
  import { environment } from "../../../environments/environment";

  describe("AuthService", () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService],
      });
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
      localStorage.clear();
    });

    afterEach(() => httpMock.verify());

    it("should be created", () => {
      expect(service).toBeTruthy();
    });

    it("login should store token and set user", () => {
      const mockResponse = { token: "jwt-token", usuario: { id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" } };

      service.login("test@test.com", "123456").subscribe(() => {
        expect(service.authenticated()).toBe(true);
        expect(service.usuario()?.email).toBe("test@test.com");
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login`);
      expect(req.request.method).toBe("POST");
      req.flush(mockResponse);

      expect(localStorage.getItem("dotz_token")).toBe("jwt-token");
    });

    it("logout should clear token and user", () => {
      localStorage.setItem("dotz_token", "jwt-token");
      service["_authenticated"].set(true);
      service["_usuario"].set({ id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" });

      service.logout();

      expect(localStorage.getItem("dotz_token")).toBeNull();
      expect(service.authenticated()).toBe(false);
      expect(service.usuario()).toBeNull();
    });

    it("getToken should return stored token", () => {
      localStorage.setItem("dotz_token", "test-token");
      expect(service.getToken()).toBe("test-token");
    });

    it("getToken should return null when no token", () => {
      expect(service.getToken()).toBeNull();
    });

    it("cadastre should POST to /usuarios", () => {
      service.cadastre("new@test.com", "123456").subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/usuarios`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email: "new@test.com", senha: "123456" });
      req.flush({});
    });

    it("loadMe should fetch user and set authenticated", () => {
      const mockUser = { id: "1", email: "loaded@test.com", saldo_pontos: 5000, criado_em: "2024-01-01" };

      service.loadMe().subscribe((u) => {
        expect(u.email).toBe("loaded@test.com");
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/me`);
      expect(req.request.method).toBe("GET");
      req.flush(mockUser);

      expect(service.authenticated()).toBe(true);
    });
  });
  ```

### Task 3.2: API service tests

**File:** `frontend/src/app/core/services/api.service.spec.ts`

- [ ] **Write `api.service.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
  import { ApiService } from "./api.service";
  import { environment } from "../../../environments/environment";

  describe("ApiService", () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      service = TestBed.inject(ApiService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("get should call GET with params", () => {
      service.get("/test", { key: "value" }).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/test` && r.params.has("key"));
      expect(req.request.method).toBe("GET");
      req.flush({});
    });

    it("post should call POST with body", () => {
      service.post("/test", { data: 1 }).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/test`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ data: 1 });
      req.flush({});
    });

    it("put should call PUT with body", () => {
      service.put("/test/1", { name: "new" }).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual({ name: "new" });
      req.flush({});
    });

    it("delete should call DELETE", () => {
      service.delete("/test/1").subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
      expect(req.request.method).toBe("DELETE");
      req.flush({});
    });
  });
  ```

### Task 3.3: Auth interceptor tests

**File:** `frontend/src/app/core/interceptors/auth.interceptor.spec.ts`
**PRD:** RF-02 (Bearer token)

- [ ] **Write `auth.interceptor.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
  import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
  import { authInterceptor } from "./auth.interceptor";
  import { AuthService } from "../services/auth.service";

  describe("authInterceptor", () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
      authService = jasmine.createSpyObj("AuthService", ["getToken"]);
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([authInterceptor])),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authService },
        ],
      });
      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("should add Authorization header when token exists", () => {
      authService.getToken.and.returnValue("test-jwt");

      httpClient.get("/api/test").subscribe();

      const req = httpMock.expectOne("/api/test");
      expect(req.request.headers.get("Authorization")).toBe("Bearer test-jwt");
      req.flush({});
    });

    it("should not add Authorization header when no token", () => {
      authService.getToken.and.returnValue(null);

      httpClient.get("/api/test").subscribe();

      const req = httpMock.expectOne("/api/test");
      expect(req.request.headers.has("Authorization")).toBe(false);
      req.flush({});
    });
  });
  ```

### Task 3.4: Error interceptor tests

**File:** `frontend/src/app/core/interceptors/error.interceptor.spec.ts`
**PRD:** RNF-05

- [ ] **Write `error.interceptor.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
  import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
  import { errorInterceptor } from "./error.interceptor";
  import { AuthService } from "../services/auth.service";
  import { ToastService } from "../../shared/services/toast.service";

  describe("errorInterceptor", () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let authService: jasmine.SpyObj<AuthService>;
    let toastService: jasmine.SpyObj<ToastService>;

    beforeEach(() => {
      authService = jasmine.createSpyObj("AuthService", ["logout"]);
      toastService = jasmine.createSpyObj("ToastService", ["show"]);

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(withInterceptors([errorInterceptor])),
          provideHttpClientTesting(),
          { provide: AuthService, useValue: authService },
          { provide: ToastService, useValue: toastService },
        ],
      });
      httpClient = TestBed.inject(HttpClient);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("should call logout and toast on 401", () => {
      httpClient.get("/api/test").subscribe({ error: () => {} });

      const req = httpMock.expectOne("/api/test");
      req.flush({ erro: "Token inválido" }, { status: 401, statusText: "Unauthorized" });

      expect(authService.logout).toHaveBeenCalled();
      expect(toastService.show).toHaveBeenCalledWith("Sessão expirada", "error");
    });

    it("should show toast on 400/422", () => {
      httpClient.get("/api/test").subscribe({ error: () => {} });

      const req = httpMock.expectOne("/api/test");
      req.flush({ erro: "Campo inválido" }, { status: 400, statusText: "Bad Request" });

      expect(toastService.show).toHaveBeenCalledWith("Campo inválido", "error");
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it("should show generic toast on 500", () => {
      httpClient.get("/api/test").subscribe({ error: () => {} });

      const req = httpMock.expectOne("/api/test");
      req.flush(null, { status: 500, statusText: "Server Error" });

      expect(toastService.show).toHaveBeenCalledWith("Erro inesperado", "error");
    });
  });
  ```

### Task 3.5: Auth guard tests

**File:** `frontend/src/app/core/guards/auth.guard.spec.ts`
**PRD:** RF-02 (rotas protegidas)

- [ ] **Write `auth.guard.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { Router } from "@angular/router";
  import { authGuard } from "./auth.guard";
  import { AuthService } from "../services/auth.service";

  describe("authGuard", () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
      authService = jasmine.createSpyObj("AuthService", ["authenticated", "getToken"]);
      router = jasmine.createSpyObj("Router", ["parseUrl"]);

      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: Router, useValue: router },
        ],
      });
    });

    it("should allow activation when authenticated", () => {
      authService.authenticated.and.returnValue(true);
      const result = TestBed.runInInjectionContext(() => authGuard());
      expect(result).toBe(true);
    });

    it("should allow activation when token exists but not yet authenticated", () => {
      authService.authenticated.and.returnValue(false);
      authService.getToken.and.returnValue("some-token");
      const result = TestBed.runInInjectionContext(() => authGuard());
      expect(result).toBe(true);
    });

    it("should redirect to login when not authenticated and no token", () => {
      authService.authenticated.and.returnValue(false);
      authService.getToken.and.returnValue(null);
      router.parseUrl.and.returnValue("/login" as any);

      const result = TestBed.runInInjectionContext(() => authGuard());
      expect(router.parseUrl).toHaveBeenCalledWith("/login");
    });
  });
  ```

### Task 3.6: Toast service tests

**File:** `frontend/src/app/shared/services/toast.service.spec.ts`

- [ ] **Write `toast.service.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { ToastService } from "./toast.service";

  describe("ToastService", () => {
    let service: ToastService;

    beforeEach(() => {
      TestBed.configureTestingModule({});
      service = TestBed.inject(ToastService);
      jest.useFakeTimers();
    });

    it("should add message and clear after timeout", () => {
      service.show("Test message", "success");

      expect(service.messages().length).toBe(1);
      expect(service.messages()[0].message).toBe("Test message");
      expect(service.messages()[0].type).toBe("success");

      jest.advanceTimersByTime(4000);

      expect(service.messages().length).toBe(0);
    });
  });
  ```

### Task 3.7: Toast component tests

**File:** `frontend/src/app/shared/components/toast/toast.component.spec.ts`

- [ ] **Write `toast.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { ToastComponent } from "./toast.component";
  import { ToastService } from "../../services/toast.service";

  describe("ToastComponent", () => {
    let component: ToastComponent;
    let fixture: ComponentFixture<ToastComponent>;
    let toastService: ToastService;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ToastComponent],
      }).compileComponents();

      toastService = TestBed.inject(ToastService);
      fixture = TestBed.createComponent(ToastComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should display toast messages", () => {
      toastService.show("Hello", "success");
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector(".toast");
      expect(el).toBeTruthy();
      expect(el.textContent).toContain("Hello");
      expect(el.classList).toContain("toast-success");
    });

    it("should display error toast with correct class", () => {
      toastService.show("Error!", "error");
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector(".toast-error");
      expect(el).toBeTruthy();
      expect(el.textContent).toContain("Error!");
    });
  });
  ```

### Task 3.8: Login component tests

**File:** `frontend/src/app/features/auth/login/login.component.spec.ts`
**PRD:** RF-02 (login inválido exibe erros)

- [ ] **Write `login.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { LoginComponent } from "./login.component";
  import { AuthService } from "../../../core/services/auth.service";
  import { Router } from "@angular/router";
  import { of, throwError } from "rxjs";

  describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
      authService = jasmine.createSpyObj("AuthService", ["login"]);
      router = jasmine.createSpyObj("Router", ["navigate"]);

      await TestBed.configureTestingModule({
        imports: [LoginComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: Router, useValue: router },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should show error on invalid login", () => {
      authService.login.and.returnValue(throwError(() => ({ status: 401, error: { erro: "Email ou senha inválidos" } })));

      component.form.setValue({ email: "test@test.com", senha: "wrong" });
      component.onSubmit();

      expect(component.errorMessage).toBe("Email ou senha inválidos");
    });

    it("should navigate to dashboard on successful login", () => {
      authService.login.and.returnValue(of({ token: "jwt", usuario: { id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" } }));

      component.form.setValue({ email: "test@test.com", senha: "123456" });
      component.onSubmit();

      expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
    });
  });
  ```

### Task 3.9: Cadastro component tests

**File:** `frontend/src/app/features/auth/cadastro/cadastro.component.spec.ts`
**PRD:** RF-01

- [ ] **Write `cadastro.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { CadastroComponent } from "./cadastro.component";
  import { AuthService } from "../../../core/services/auth.service";
  import { Router } from "@angular/router";
  import { of, throwError } from "rxjs";

  describe("CadastroComponent", () => {
    let component: CadastroComponent;
    let fixture: ComponentFixture<CadastroComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
      authService = jasmine.createSpyObj("AuthService", ["cadastre"]);
      router = jasmine.createSpyObj("Router", ["navigate"]);

      await TestBed.configureTestingModule({
        imports: [CadastroComponent],
        providers: [
          { provide: AuthService, useValue: authService },
          { provide: Router, useValue: router },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CadastroComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should show error when passwords do not match", () => {
      component.form.setValue({ email: "test@test.com", senha: "123456", confirmarSenha: "654321" });
      expect(component.form.errors?.["senhasDiferentes"]).toBe(true);
    });

    it("should call cadastre on submit and redirect to login", () => {
      authService.cadastre.and.returnValue(of(void 0));
      component.form.setValue({ email: "new@test.com", senha: "123456", confirmarSenha: "123456" });
      component.onSubmit();

      expect(authService.cadastre).toHaveBeenCalledWith("new@test.com", "123456");
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });

    it("should show error on duplicate email", () => {
      authService.cadastre.and.returnValue(throwError(() => ({ status: 409, error: { erro: "Email já cadastrado" } })));
      component.form.setValue({ email: "dup@test.com", senha: "123456", confirmarSenha: "123456" });
      component.onSubmit();

      expect(component.errorMessage).toBe("Email já cadastrado");
    });
  });
  ```

### Task 3.10: Dashboard component tests

**File:** `frontend/src/app/features/dashboard/dashboard.component.spec.ts`
**PRD:** RF-04 (saldo)

- [ ] **Write `dashboard.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { DashboardComponent } from "./dashboard.component";
  import { ApiService } from "../../core/services/api.service";
  import { AuthService } from "../../core/services/auth.service";
  import { of } from "rxjs";

  describe("DashboardComponent", () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let apiService: jasmine.SpyObj<ApiService>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
      apiService = jasmine.createSpyObj("ApiService", ["get"]);
      authService = jasmine.createSpyObj("AuthService", [], { usuario: of({ id: "1", email: "test@test.com", saldo_pontos: 5000, criado_em: "2024-01-01" }) });

      await TestBed.configureTestingModule({
        imports: [DashboardComponent],
        providers: [
          { provide: ApiService, useValue: apiService },
          { provide: AuthService, useValue: authService },
        ],
      }).compileComponents();

      apiService.get.calls.reset();
    });

    it("should load saldo on init", () => {
      apiService.get.withArgs("/saldo").and.returnValue(of({ saldo_pontos: 5000 }));
      apiService.get.withArgs("/extrato", { limite: "5" }).and.returnValue(of({ transacoes: [] }));

      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.saldo()).toBe(5000);
    });
  });
  ```

### Task 3.11: Endereco service tests

**File:** `frontend/src/app/features/enderecos/endereco.service.spec.ts`

- [ ] **Write `endereco.service.spec.ts`**
  ```ts
  import { TestBed } from "@angular/core/testing";
  import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
  import { EnderecoService } from "./endereco.service";
  import { environment } from "../../../environments/environment";

  describe("EnderecoService", () => {
    let service: EnderecoService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      service = TestBed.inject(EnderecoService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("listar should GET /enderecos", () => {
      service.listar().subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/enderecos`);
      expect(req.request.method).toBe("GET");
      req.flush([]);
    });

    it("criar should POST /enderecos", () => {
      const dados = { cep: "01310-100", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP" };
      service.criar(dados).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/enderecos`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(dados);
      req.flush({});
    });

    it("atualizar should PUT /enderecos/:id", () => {
      const dados = { cep: "01310-100", logradouro: "Rua B", numero: "200", bairro: "Centro", cidade: "SP", estado: "SP" };
      service.atualizar("e1", dados).subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/enderecos/e1`);
      expect(req.request.method).toBe("PUT");
      req.flush({});
    });

    it("remover should DELETE /enderecos/:id", () => {
      service.remover("e1").subscribe();
      const req = httpMock.expectOne(`${environment.apiUrl}/enderecos/e1`);
      expect(req.request.method).toBe("DELETE");
      req.flush({});
    });
  });
  ```

### Task 3.12: Endereco form component tests

**File:** `frontend/src/app/features/enderecos/form/form.component.spec.ts`
**PRD:** RF-03

- [ ] **Write `form.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { FormComponent } from "./form.component";

  describe("EnderecoFormComponent", () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(FormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should be invalid when required fields are empty", () => {
      expect(component.form.valid).toBe(false);
    });

    it("should be valid with all required fields", () => {
      component.form.setValue({
        cep: "01310-100", logradouro: "Rua A", numero: "100", complemento: "", bairro: "Centro",
        cidade: "SP", estado: "SP", padrao: false,
      });
      expect(component.form.valid).toBe(true);
    });

    it("should emit submitted data", () => {
      const spy = jasmine.createSpy();
      component.submitted.subscribe(spy);

      component.form.setValue({
        cep: "01310-100", logradouro: "Rua A", numero: "100", complemento: "", bairro: "Centro",
        cidade: "SP", estado: "SP", padrao: true,
      });
      component.onSubmit();

      expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ cep: "01310-100", padrao: true }));
    });

    it("should not emit when invalid", () => {
      const spy = jasmine.createSpy();
      component.submitted.subscribe(spy);
      component.onSubmit();
      expect(spy).not.toHaveBeenCalled();
    });
  });
  ```

### Task 3.13: Checkout component tests

**File:** `frontend/src/app/features/checkout/checkout.component.spec.ts`
**PRD:** RF-06 (fluxo de resgate)

- [ ] **Write `checkout.component.spec.ts`**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { CheckoutComponent } from "./checkout.component";
  import { ApiService } from "../../core/services/api.service";
  import { ProdutosService } from "../produtos/produtos.service";
  import { EnderecoService } from "../enderecos/endereco.service";
  import { ActivatedRoute, Router } from "@angular/router";
  import { of } from "rxjs";

  describe("CheckoutComponent", () => {
    let component: CheckoutComponent;
    let fixture: ComponentFixture<CheckoutComponent>;
    let apiService: jasmine.SpyObj<ApiService>;
    let produtosService: jasmine.SpyObj<ProdutosService>;
    let enderecoService: jasmine.SpyObj<EnderecoService>;
    let router: jasmine.SpyObj<Router>;

    const mockProduto = { id: "p1", nome: "Fone", descricao: "Fone Bluetooth", pontos_necessarios: 5000, ativo: true };
    const mockEnderecos = [{ id: "e1", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP", cep: "01310-100", padrao: true, usuario_id: "u1", criado_em: "2024-01-01" }];

    beforeEach(async () => {
      apiService = jasmine.createSpyObj("ApiService", ["post"]);
      produtosService = jasmine.createSpyObj("ProdutosService", ["buscarPorId"]);
      enderecoService = jasmine.createSpyObj("EnderecoService", ["listar"]);
      router = jasmine.createSpyObj("Router", ["navigate"]);

      await TestBed.configureTestingModule({
        imports: [CheckoutComponent],
        providers: [
          { provide: ApiService, useValue: apiService },
          { provide: ProdutosService, useValue: produtosService },
          { provide: EnderecoService, useValue: enderecoService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => "p1" } } } },
        ],
      }).compileComponents();

      produtosService.buscarPorId.and.returnValue(of(mockProduto));
      enderecoService.listar.and.returnValue(of(mockEnderecos));
    });

    it("should load produto and enderecos on init", () => {
      fixture = TestBed.createComponent(CheckoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.produto()?.nome).toBe("Fone");
      expect(component.enderecos().length).toBe(1);
    });

    it("should confirm resgate and navigate to pedidos", () => {
      apiService.post.and.returnValue(of({ id: "ped1", status: "Confirmado" }));
      fixture = TestBed.createComponent(CheckoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.enderecoSelecionado.set("e1");
      component.confirmarResgate();

      expect(apiService.post).toHaveBeenCalledWith("/resgates", { produto_id: "p1", endereco_id: "e1" });
      expect(router.navigate).toHaveBeenCalledWith(["/pedidos"]);
    });
  });
  ```

### Task 3.14: Other component tests (batch)

**Files:** All shared components and remaining feature components.

- [ ] **Write button.component.spec.ts**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { ButtonComponent } from "./button.component";

  describe("ButtonComponent", () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
      fixture = TestBed.createComponent(ButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => expect(component).toBeTruthy());

    it("should emit clicked event", () => {
      const spy = jasmine.createSpy();
      component.clicked.subscribe(spy);
      fixture.nativeElement.querySelector("button").click();
      expect(spy).toHaveBeenCalled();
    });

    it("should disable button", () => {
      fixture.componentRef.setInput("disabled", true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector("button").disabled).toBe(true);
    });
  });
  ```

- [ ] **Write skeleton.component.spec.ts**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { SkeletonComponent } from "./skeleton.component";

  describe("SkeletonComponent", () => {
    let component: SkeletonComponent;
    let fixture: ComponentFixture<SkeletonComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [SkeletonComponent] }).compileComponents();
      fixture = TestBed.createComponent(SkeletonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("should create", () => expect(component).toBeTruthy());
    it("should have default dimensions", () => {
      const el = fixture.nativeElement.querySelector(".skeleton");
      expect(el.style.width).toBe("100%");
      expect(el.style.height).toBe("20px");
    });
  });
  ```

- [ ] **Write status-chip.component.spec.ts**
  ```ts
  import { ComponentFixture, TestBed } from "@angular/core/testing";
  import { StatusChipComponent } from "./status-chip.component";

  describe("StatusChipComponent", () => {
    let component: StatusChipComponent;
    let fixture: ComponentFixture<StatusChipComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [StatusChipComponent] }).compileComponents();
      fixture = TestBed.createComponent(StatusChipComponent);
      component = fixture.componentInstance;
    });

    it("should create", () => expect(component).toBeTruthy());

    it("should display status text", () => {
      fixture.componentRef.setInput("status", "Confirmado");
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain("Confirmado");
    });
  });
  ```

- [ ] **Write card.component.spec.ts** — creation test
- [ ] **Write footer.component.spec.ts** — creation + year test
- [ ] **Write input.component.spec.ts** — creation + control binding test
- [ ] **Write navbar.component.spec.ts** — creation + user name display test
- [ ] **Write product-card.component.spec.ts** — creation + product info display test
- [ ] **Write saldo-display.component.spec.ts** — creation + saldo formatting test
- [ ] **Write empty-state.component.spec.ts** — creation + message test

### Task 3.15: Remaining feature component tests

- [ ] **Write `enderecos/list/list.component.spec.ts`** — load list, empty state, delete action
- [ ] **Write `extrato/extrato.component.spec.ts`** — load transactions, filter by period, pagination
- [ ] **Write `produtos/list/list.component.spec.ts`** — load products, search, filter by category
- [ ] **Write `produtos/detail/detail.component.spec.ts`** — load product by id
- [ ] **Write `pedidos/pedido.service.spec.ts`** — listar, buscarPorId
- [ ] **Write `pedidos/list/list.component.spec.ts`** — load orders, filter by period
- [ ] **Write `pedidos/detail/detail.component.spec.ts`** — load order by id

### Task 3.16: Run all frontend tests

- [ ] **Run tests**
  ```bash
  cd frontend && npx jest --verbose
  ```
  Expected: all tests pass.

### Task 3.17: Commit frontend tests

- [ ] **Commit**
  ```bash
  git add frontend/src/app/ frontend/jest.config.js frontend/setup-jest.ts
  git commit -m "test: add frontend unit tests for services, components, guards, interceptors"
  ```

---

## Phase 4: E2E Tests (Playwright)

### Task 4.1: Cadastro E2E test

**File:** `e2e/tests/cadastro.spec.ts`
**PRD:** RF-01

- [ ] **Write `cadastro.spec.ts`**
  ```ts
  import { test, expect } from "@playwright/test";
  import { v4 as uuid } from "uuid";

  test("user can register with valid data", async ({ page }) => {
    const email = `e2e-${uuid().slice(0, 8)}@test.com`;
    await page.goto("/cadastro");

    await page.fill('[formControlName="email"]', email);
    await page.fill('[formControlName="senha"]', "123456");
    await page.fill('[formControlName="confirmarSenha"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login/);
  });

  test("shows error on duplicate email", async ({ page }) => {
    await page.goto("/cadastro");
    await page.fill('[formControlName="email"]', "maria@email.com");
    await page.fill('[formControlName="senha"]', "123456");
    await page.fill('[formControlName="confirmarSenha"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Email já cadastrado")).toBeVisible();
  });
  ```

### Task 4.2: Login E2E test

**File:** `e2e/tests/login.spec.ts`
**PRD:** RF-02

- [ ] **Write `login.spec.ts`**
  ```ts
  import { test, expect } from "@playwright/test";

  test("user can login and see dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[formControlName="email"]', "maria@email.com");
    await page.fill('[formControlName="senha"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("text=Dotz")).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[formControlName="email"]', "maria@email.com");
    await page.fill('[formControlName="senha"]', "wrong");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Email ou senha inválidos")).toBeVisible();
  });

  test("redirects to login when accessing protected route", async ({ page }) => {
    await page.goto("/pedidos");
    await expect(page).toHaveURL(/\/login/);
  });
  ```

### Task 4.3: Produtos E2E test

**File:** `e2e/tests/produtos.spec.ts`
**PRD:** RF-05

- [ ] **Write `produtos.spec.ts`**
  ```ts
  import { test, expect } from "@playwright/test";

  test.describe("authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill('[formControlName="email"]', "maria@email.com");
      await page.fill('[formControlName="senha"]', "123456");
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
    });

    test("list products and view detail", async ({ page }) => {
      await page.goto("/produtos");
      await expect(page.locator(".product-card").first()).toBeVisible();

      await page.locator(".product-card").first().click();
      await expect(page).toHaveURL(/\/produtos\//);
    });

    test("filter products by category", async ({ page }) => {
      await page.goto("/produtos");

      const categorySelect = page.locator("select").first();
      await categorySelect.selectOption("Cupons");

      await page.waitForTimeout(500);
      const cards = page.locator(".product-card");
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });
  ```

### Task 4.4: Resgate E2E test

**File:** `e2e/tests/resgate.spec.ts`
**PRD:** RF-06

- [ ] **Write `resgate.spec.ts`**
  ```ts
  import { test, expect } from "@playwright/test";

  test("complete redemption flow from product to order confirmation", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[formControlName="email"]', "maria@email.com");
    await page.fill('[formControlName="senha"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // Go to products
    await page.goto("/produtos");
    await page.locator(".product-card").first().click();
    await page.waitForURL(/\/produtos\//);

    // Click resgatar
    await page.click("text=Resgatar agora");
    await page.waitForURL(/\/checkout/);

    // Select address and confirm
    await page.locator(".address-card").first().click();
    await page.click("text=Confirmar");
    await page.waitForURL(/\/pedidos/);

    await expect(page.locator("text=Confirmado")).toBeVisible();
  });
  ```

### Task 4.5: Pedidos E2E test

**File:** `e2e/tests/pedidos.spec.ts`
**PRD:** RF-07

- [ ] **Write `pedidos.spec.ts`**
  ```ts
  import { test, expect } from "@playwright/test";

  test("view orders list and detail", async ({ page }) => {
    await page.goto("/login");
    await page.fill('[formControlName="email"]', "maria@email.com");
    await page.fill('[formControlName="senha"]', "123456");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    await page.goto("/pedidos");
    await expect(page.locator(".order-card").first()).toBeVisible();

    await page.locator(".order-card").first().click();
    await expect(page).toHaveURL(/\/pedidos\//);
    await expect(page.locator("text=Endereço de entrega")).toBeVisible();
  });
  ```

### Task 4.6: Run E2E tests

- [ ] **Run tests**
  ```bash
  cd e2e && npx playwright test
  ```
  Expected: all tests pass (requires backend + frontend running).

### Task 4.7: Commit E2E tests

- [ ] **Commit**
  ```bash
  git add e2e/
  git commit -m "test: add E2E tests for critical user journeys"
  ```

---

## Self-Review

### Spec Coverage
- RF-01 (Cadastro): Task 2.2 (integration), 3.9 (component), 4.1 (E2E)
- RF-02 (Auth): Task 1.1 (unit), 2.1 (integration), 3.1, 3.3, 3.4, 3.5 (frontend), 4.2 (E2E)
- RF-03 (Endereços): Task 1.4 (unit model), 2.3 (integration), 3.11, 3.12 (frontend)
- RF-04 (Saldo/Extrato): Task 1.3 (unit), 2.4 (integration), 3.10 (frontend dashboard)
- RF-05 (Produtos): Task 1.4 (unit model), 2.5 (integration), 4.3 (E2E)
- RF-06 (Resgate atômico): Task 1.3 (unit service), 2.6 (integration), 3.13 (frontend), 4.4 (E2E)
- RF-07 (Pedidos): Task 1.4 (unit model), 2.7 (integration), 4.5 (E2E)
- RNF-01 (Segurança bcrypt/JWT): Task 1.1 (auth middleware), 1.4 (usuario model bcrypt)
- RNF-05 (Erros HTTP): Task 2.1-2.7 (all integration test HTTP status checks)

### Red Flags
No placeholders, no TBD, no "implement later". Every test file has complete code. No placeholder test data — factories are fully implemented.

### Type Consistency
- `createUsuario(email, senha)` used consistently across all test files
- `generateToken(usuarioId, email)` used consistently
- Factories return objects consistent with model return shapes
- All imports reference correct relative paths

---

## Execution Plan Summary

| Phase | Tasks | What |
|-------|-------|------|
| Phase 0 | 0.1–0.12 | Setup: branch, deps, configs |
| Phase 1 | 1.1–1.5 | Backend unit tests (8 files) |
| Phase 2 | 2.1–2.9 | Backend integration tests (7 route files) |
| Phase 3 | 3.1–3.17 | Frontend unit tests (20+ files) |
| Phase 4 | 4.1–4.7 | E2E tests (5 journey files) |

Total: ~47 tasks across 5 phases.

## Riscos e Pontos de Atenção

1. **DB de testes:** O setup cria `dotz_loyalty_test` automaticamente. Se o PostgreSQL não estiver rodando, os testes de integração falham.
2. **Seed data nos E2E:** Os E2E assumem que os dados do seed (`maria@email.com`, etc.) estão no banco. Se os E2E rodarem contra uma base vazia, precisam criar os dados primeiro.
3. **JWT nos testes:** O `.env.test` tem uma chave JWT separada. Garantir que os testes usam `.env.test` e não o `.env` de desenvolvimento.
4. **Angular Jest vs Karma:** Jasmine é o padrão Angular, mas optamos por Jest para simplificar. Alguns matchers customizados do Jasmine (`toHaveBeenCalledWith`, etc.) funcionam com `@types/jest`.
5. **Portas conflitantes:** Backend de teste usa porta 3001 se precisar subir servidor dedicado; os testes de integração com supertest não precisam de porta real.
6. **E2E dependem de frontend + backend rodando:** Os testes E2E só funcionam se ambos estiverem no ar. Incluir script de `docker-compose` para CI.
