exports.up = (pgm) => {
  pgm.createTable("produtos", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    nome: { type: "varchar(255)", notNull: true },
    descricao: { type: "text" },
    pontos_necessarios: { type: "integer", notNull: true },
    categoria: { type: "varchar(100)" },
    subcategoria: { type: "varchar(100)" },
    imagem_url: { type: "varchar(500)" },
    ativo: { type: "boolean", notNull: true, default: true },
    criado_em: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });
};
exports.down = (pgm) => pgm.dropTable("produtos");
