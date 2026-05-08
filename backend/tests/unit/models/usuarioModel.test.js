const pool = require("../../../src/config/db");
const bcrypt = require("bcrypt");
const { criar, buscarPorEmail, buscarPorId, atualizarSaldo } = require("../../../src/models/usuarioModel");

jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt");

describe("usuarioModel", () => {
  afterEach(() => jest.clearAllMocks());

  it("criar: should insert user with bcrypt hash and return user data", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");
    pool.query.mockResolvedValue({
      rows: [{ id: "u1", email: "test@test.com", saldo_pontos: 0, criado_em: new Date().toISOString() }],
    });

    const result = await criar("test@test.com", "123456");

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO usuarios"), [
      "test@test.com",
      "hashed-password",
    ]);
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
    expect(mockClient.query).toHaveBeenCalledWith("UPDATE usuarios SET saldo_pontos = $1 WHERE id = $2", [5000, "u1"]);
  });
});
