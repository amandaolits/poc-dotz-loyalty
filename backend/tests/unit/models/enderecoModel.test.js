const pool = require("../../../src/config/db");
const {
  listarPorUsuario,
  buscarPorId,
  criar,
  atualizar,
  remover,
  unsetPadrao,
} = require("../../../src/models/enderecoModel");

jest.mock("../../../src/config/db", () => ({ query: jest.fn() }));

describe("enderecoModel", () => {
  afterEach(() => jest.clearAllMocks());

  it("listarPorUsuario: should list addresses ordered by padrao DESC", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "e1", padrao: true }, { id: "e2", padrao: false }] });
    const result = await listarPorUsuario("u1");
    expect(result).toHaveLength(2);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("ORDER BY padrao DESC"), ["u1"]);
  });

  it("buscarPorId: should find address by id and usuario_id", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "e1", usuario_id: "u1" }] });
    const result = await buscarPorId("e1", "u1");
    expect(result.id).toBe("e1");
  });

  it("buscarPorId: should return null when address belongs to another user", async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const result = await buscarPorId("e1", "other-user");
    expect(result).toBeNull();
  });

  it("criar: should insert new address", async () => {
    const mockClient = { query: jest.fn() };
    mockClient.query.mockResolvedValue({ rows: [{ id: "e1", logradouro: "Rua A" }] });
    const result = await criar(mockClient, "u1", {
      cep: "01310-100",
      logradouro: "Rua A",
      numero: "100",
      bairro: "Centro",
      cidade: "SP",
      estado: "SP",
      padrao: true,
    });
    expect(result.logradouro).toBe("Rua A");
  });

  it("remover: should delete only when address belongs to user", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });
    const result = await remover("e1", "u1");
    expect(result).toBe(true);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM enderecos"), ["e1", "u1"]);
  });

  it("unsetPadrao: should set all user addresses to non-default", async () => {
    const mockClient = { query: jest.fn() };
    await unsetPadrao(mockClient, "u1");
    expect(mockClient.query).toHaveBeenCalledWith("UPDATE enderecos SET padrao = false WHERE usuario_id = $1", ["u1"]);
  });
});
