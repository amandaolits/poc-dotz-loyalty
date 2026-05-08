const pool = require("../../../src/config/db");

jest.mock("../../../src/config/db", () => ({ connect: jest.fn(), query: jest.fn(), end: jest.fn() }));

describe("realizarResgate", () => {
  let mockClient;
  let realizarResgate;

  beforeAll(async () => {
    realizarResgate = require("../../../src/services/resgateService").realizarResgate;
  });

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
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Usuário não encontrado");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("should fail if produto not found", async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Produto não encontrado ou inativo");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("should fail if endereco not found or not owned by user", async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })
      .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000 }] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Endereço não encontrado");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("should fail if saldo insuficiente", async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 1000 }] })
      .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000, nome: "Fone" }] })
      .mockResolvedValueOnce({ rows: [{ id: "end-id" }] });

    await expect(realizarResgate("user-id", "prod-id", "end-id")).rejects.toThrow("Saldo insuficiente");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
  });

  it("should complete redemption atomically when all conditions met", async () => {
    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "user-id", saldo_pontos: 10000 }] })
      .mockResolvedValueOnce({ rows: [{ id: "prod-id", pontos_necessarios: 5000, nome: "Fone Bluetooth" }] })
      .mockResolvedValueOnce({ rows: [{ id: "end-id" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "ped-id", status: "Confirmado" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await realizarResgate("user-id", "prod-id", "end-id");

    expect(result.status).toBe("Confirmado");
    expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(mockClient.query).not.toHaveBeenCalledWith("ROLLBACK");
    expect(mockClient.release).toHaveBeenCalled();
  });
});
