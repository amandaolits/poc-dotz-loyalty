const request = require("supertest");
const app = require("../../../src/app");
const { createUsuario, generateToken } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("POST /api/login", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it("should return 200 and JWT token with valid credentials", async () => {
    await createUsuario("maria@email.com", "123456");

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
  beforeEach(async () => {
    await cleanDatabase();
  });

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
