exports.up = (pgm) => {
  pgm.createTable("usuarios", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    email: { type: "varchar(255)", notNull: true, unique: true },
    senha_hash: { type: "varchar(255)", notNull: true },
    saldo_pontos: { type: "integer", notNull: true, default: 0 },
    criado_em: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });
  pgm.createIndex("usuarios", "email", { unique: true });
};
exports.down = (pgm) => pgm.dropTable("usuarios");
