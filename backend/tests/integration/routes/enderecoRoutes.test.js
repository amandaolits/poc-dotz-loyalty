const request = require("supertest");
const app = require("../../../src/app");
const { createUsuario, generateToken, createEndereco } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("Enderecos CRUD", () => {
  let token, usuario;

  beforeEach(async () => {
    await cleanDatabase();
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
      .send({
        cep: "01310-100",
        logradouro: "Av. Paulista",
        numero: "1000",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        padrao: false,
      });

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

  it("POST /api/enderecos — should only allow one padrao", async () => {
    await createEndereco(usuario.id, { logradouro: "Primeiro", padrao: true });

    const res = await request(app)
      .post("/api/enderecos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        cep: "01310-100",
        logradouro: "Segundo",
        numero: "200",
        bairro: "Centro",
        cidade: "SP",
        estado: "SP",
        padrao: true,
      });

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
      .send({
        cep: "20000-000",
        logradouro: "Rua Nova",
        numero: "50",
        bairro: "Centro",
        cidade: "Rio",
        estado: "RJ",
        padrao: false,
      });

    expect(res.status).toBe(200);
    expect(res.body.logradouro).toBe("Rua Nova");
  });

  it("PUT /api/enderecos/:id — should return 404 for another user's address", async () => {
    const otherUser = await createUsuario("other@test.com", "123456");
    const otherEnd = await createEndereco(otherUser.id);

    const res = await request(app)
      .put(`/api/enderecos/${otherEnd.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cep: "01310-100",
        logradouro: "Rua",
        numero: "1",
        bairro: "Centro",
        cidade: "SP",
        estado: "SP",
        padrao: false,
      });

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
