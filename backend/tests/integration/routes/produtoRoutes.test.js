const request = require("supertest");
const app = require("../../../src/app");
const { createUsuario, generateToken, createProduto } = require("../../helpers/factories");
const { cleanDatabase } = require("../../helpers/setupEach");

describe("Produtos", () => {
  beforeEach(async () => {
    await cleanDatabase();
    const usuario = await createUsuario("prod@test.com", "123456");
    token = generateToken(usuario.id, usuario.email);
  });



  let token;

  it("GET /api/produtos — should list active products", async () => {
    await createProduto({ nome: "Fone", pontos_necessarios: 5000, ativo: true });
    await createProduto({ nome: "Inativo", pontos_necessarios: 1000, ativo: false });

    const res = await request(app)
      .get("/api/produtos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.produtos).toHaveLength(1);
  });

  it("GET /api/produtos — should filter by categoria", async () => {
    await createProduto({ nome: "Fone", pontos_necessarios: 5000, categoria: "Eletrônicos" });
    await createProduto({ nome: "Cafeteira", pontos_necessarios: 8000, categoria: "Casa" });

    const res = await request(app)
      .get("/api/produtos?categoria=Casa")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.produtos).toHaveLength(1);
    expect(res.body.produtos[0].nome).toBe("Cafeteira");
  });

  it("GET /api/produtos — should search by nome", async () => {
    await createProduto({ nome: "Fone Bluetooth", pontos_necessarios: 5000, descricao: "Fone sem fio" });
    await createProduto({ nome: "Cafeteira", pontos_necessarios: 8000, descricao: "Cafeteira elétrica" });

    const res = await request(app)
      .get("/api/produtos?busca=fone")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.produtos).toHaveLength(1);
  });

  it("GET /api/produtos — should combine filters", async () => {
    await createProduto({ nome: "Fone Top", pontos_necessarios: 5000, categoria: "Eletrônicos", subcategoria: "Áudio" });
    await createProduto({ nome: "Fone Barato", pontos_necessarios: 1000, categoria: "Eletrônicos", subcategoria: "Acessórios" });

    const res = await request(app)
      .get("/api/produtos?categoria=Eletrônicos&subcategoria=Áudio")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.produtos).toHaveLength(1);
  });

  it("GET /api/produtos/:id — should return product detail", async () => {
    const prod = await createProduto({ nome: "Fone Teste" });

    const res = await request(app)
      .get(`/api/produtos/${prod.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Fone Teste");
  });

  it("GET /api/produtos/:id — should return 404 for inactive product", async () => {
    const prod = await createProduto({ nome: "Inativo", ativo: false });

    const res = await request(app)
      .get(`/api/produtos/${prod.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
