const request = require("supertest");
const app = require("../../../src/app");
const pool = require("../../../src/config/db");
const { createUsuario, generateToken, createEndereco, createProduto } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("POST /api/resgates", () => {
  let token, usuario, endereco, produto;

  beforeEach(async () => {
    await cleanDatabase();
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

  it("should return 422 when endereco does not belong to user", async () => {
    const outroUsuario = await createUsuario("outro@test.com", "123456", 99999);
    const outroEndereco = await createEndereco(outroUsuario.id);

    const res = await request(app)
      .post("/api/resgates")
      .set("Authorization", `Bearer ${token}`)
      .send({ produto_id: produto.id, endereco_id: outroEndereco.id });

    expect(res.status).toBe(422);
  });

  it("should return 404 when produto is inactive", async () => {
    const inactiveProd = await createProduto({ nome: "Inativo", pontos_necessarios: 1000, ativo: false });

    const res = await request(app)
      .post("/api/resgates")
      .set("Authorization", `Bearer ${token}`)
      .send({ produto_id: inactiveProd.id, endereco_id: endereco.id });

    expect(res.status).toBe(404);
  });

  it("should be atomic — debitar pontos and criar pedido", async () => {
    const res = await request(app)
      .post("/api/resgates")
      .set("Authorization", `Bearer ${token}`)
      .send({ produto_id: produto.id, endereco_id: endereco.id });

    expect(res.status).toBe(201);

    const saldoRes = await request(app)
      .get("/api/saldo")
      .set("Authorization", `Bearer ${token}`);

    expect(saldoRes.body.saldo_pontos).toBe(5000);

    const pedidosRes = await request(app)
      .get("/api/pedidos")
      .set("Authorization", `Bearer ${token}`);

    expect(pedidosRes.body).toHaveLength(1);
    expect(pedidosRes.body[0].status).toBe("Confirmado");
  });

  it("should return 422 when endereco_id is invalid UUID", async () => {
    const res = await request(app)
      .post("/api/resgates")
      .set("Authorization", `Bearer ${token}`)
      .send({ produto_id: produto.id, endereco_id: "not-a-uuid" });

    expect(res.status).toBe(400);
  });
});
