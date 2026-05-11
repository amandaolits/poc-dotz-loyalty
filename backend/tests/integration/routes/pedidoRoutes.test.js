const request = require("supertest");
const app = require("../../../src/app");
const pool = require("../../../src/config/db");
const { createUsuario, generateToken, createEndereco, createProduto } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("Pedidos", () => {
  let token, usuario, endereco, produto, pedidoId;

  beforeEach(async () => {
    await cleanDatabase();
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

  it("GET /api/pedidos — should return empty array when user has no orders", async () => {
    const emptyUser = await createUsuario("empty@test.com", "123456");
    const emptyToken = generateToken(emptyUser.id, "empty@test.com");

    const res = await request(app)
      .get("/api/pedidos")
      .set("Authorization", `Bearer ${emptyToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /api/pedidos/:id — should return order detail with address", async () => {
    const res = await request(app)
      .get(`/api/pedidos/${pedidoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Confirmado");
    expect(res.body.logradouro).toBeDefined();
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
