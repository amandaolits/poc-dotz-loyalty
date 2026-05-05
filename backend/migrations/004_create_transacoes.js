exports.up = (pgm) => {
  pgm.createTable("transacoes", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    usuario_id: { type: "uuid", notNull: true, references: "usuarios(id)", onDelete: "cascade" },
    tipo: { type: "varchar(10)", notNull: true, check: "tipo IN ('ganho', 'resgate')" },
    pontos: { type: "integer", notNull: true },
    descricao: { type: "varchar(255)" },
    data_criacao: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });
  pgm.createIndex("transacoes", ["usuario_id", "data_criacao"]);
};
exports.down = (pgm) => pgm.dropTable("transacoes");
