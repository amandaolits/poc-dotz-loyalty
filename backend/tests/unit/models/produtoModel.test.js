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
