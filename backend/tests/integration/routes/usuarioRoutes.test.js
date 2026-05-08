const request = require("supertest");
const app = require("../../../src/app");
const { createUsuario } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("POST /api/usuarios", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });



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

  it("should return 400 when email exceeds 255 chars", async () => {
    const longEmail = "a".repeat(256) + "@test.com";
    const res = await request(app)
      .post("/api/usuarios")
      .send({ email: longEmail, senha: "123456" });

    expect(res.status).toBe(400);
  });
});
