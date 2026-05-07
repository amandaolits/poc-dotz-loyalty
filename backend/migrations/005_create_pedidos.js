exports.up = (pgm) => {
  pgm.createTable("pedidos", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    usuario_id: { type: "uuid", notNull: true, references: "usuarios(id)", onDelete: "cascade" },
    produto_id: { type: "uuid", notNull: true, references: "produtos(id)" },
    endereco_entrega_id: { type: "uuid", notNull: true, references: "enderecos(id)" },
    pontos_gastos: { type: "integer", notNull: true },
    status: { type: "varchar(50)", notNull: true, default: "Confirmado" },
    data_pedido: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });
  pgm.createIndex("pedidos", "usuario_id");
};
exports.down = (pgm) => pgm.dropTable("pedidos");
