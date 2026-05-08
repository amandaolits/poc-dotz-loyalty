const pool = require("../../../src/config/db");
const { criar, listarPorUsuario, buscarPorId } = require("../../../src/models/pedidoModel");

jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));

describe("pedidoModel", () => {
  afterEach(() => jest.clearAllMocks());

  it("criar: should insert order with status Confirmado", async () => {
    const mockClient = { query: jest.fn() };
    mockClient.query.mockResolvedValue({ rows: [{ id: "p1", status: "Confirmado" }] });
    const result = await criar(mockClient, {
      usuario_id: "u1",
      produto_id: "pr1",
      endereco_entrega_id: "e1",
      pontos_gastos: 5000,
      status: "Confirmado",
    });
    expect(result.status).toBe("Confirmado");
  });

  it("listarPorUsuario: should return only user orders ordered by date DESC", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "p1", produto_nome: "Fone" }] });
    const result = await listarPorUsuario("u1");
    expect(result).toHaveLength(1);
    expect(pool.query.mock.calls[0][0]).toContain("ORDER BY p.data_pedido DESC");
  });

  it("listarPorUsuario: should accept filter params", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    await listarPorUsuario("u1", { periodo: "30d" });
    const callSql = pool.query.mock.calls[0][0];
    expect(callSql).toContain("p.data_pedido >= $2");
  });

  it("buscarPorId: should return null for another user's order", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const result = await buscarPorId("p1", "other-user");
    expect(result).toBeNull();
  });
});
