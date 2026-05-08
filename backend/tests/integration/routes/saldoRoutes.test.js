const request = require("supertest");
const app = require("../../../src/app");
const pool = require("../../../src/config/db");
const { createUsuario, generateToken } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("GET /api/saldo", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("should return current balance", async () => {
    const usuario = await createUsuario("saldo@test.com", "123456");
    const token = generateToken(usuario.id, usuario.email);

    const res = await request(app)
      .get("/api/saldo")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.saldo_pontos).toBe(10000);
  });

  it("should return 401 without token", async () => {
    const res = await request(app).get("/api/saldo");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/extrato", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("should return paginated transactions", async () => {
    const usuario = await createUsuario("extrato@test.com", "123456");
    const token = generateToken(usuario.id, usuario.email);

    await pool.query(
      "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao) VALUES ($1,'ganho',5000,'Ganho inicial')",
      [usuario.id]
    );

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

    await pool.query(
      "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES ($1,'ganho',5000,'Antigo', NOW() - INTERVAL '60 days')",
      [usuario.id]
    );
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

  it("should filter by periodo=3m", async () => {
    const usuario = await createUsuario("extrato3@test.com", "123456");
    const token = generateToken(usuario.id, usuario.email);

    await pool.query(
      "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES ($1,'ganho',2000,'Muito antigo', NOW() - INTERVAL '120 days')",
      [usuario.id]
    );
    await pool.query(
      "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao, data_criacao) VALUES ($1,'ganho',4000,'Recente', NOW())",
      [usuario.id]
    );

    const res = await request(app)
      .get("/api/extrato?periodo=3m")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.transacoes).toHaveLength(1);
  });
});
