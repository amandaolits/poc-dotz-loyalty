const { criar } = require("../../../src/models/transacaoModel");

describe("transacaoModel", () => {
  it("criar: should insert transaction", async () => {
    const mockClient = { query: jest.fn() };
    mockClient.query.mockResolvedValue({ rows: [{ id: "t1", tipo: "resgate", pontos: 5000 }] });
    const result = await criar(mockClient, {
      usuario_id: "u1",
      tipo: "resgate",
      pontos: 5000,
      descricao: "Resgate: Fone",
    });
    expect(result.tipo).toBe("resgate");
    expect(mockClient.query.mock.calls[0][1]).toEqual(["u1", "resgate", 5000, "Resgate: Fone"]);
  });
});
