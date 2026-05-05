exports.up = (pgm) => {
  pgm.createTable("enderecos", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    usuario_id: { type: "uuid", notNull: true, references: "usuarios(id)", onDelete: "cascade" },
    cep: { type: "varchar(20)", notNull: true },
    logradouro: { type: "varchar(255)", notNull: true },
    numero: { type: "varchar(20)", notNull: true },
    complemento: { type: "varchar(100)" },
    bairro: { type: "varchar(100)", notNull: true },
    cidade: { type: "varchar(100)", notNull: true },
    estado: { type: "varchar(2)", notNull: true },
    padrao: { type: "boolean", notNull: true, default: false },
    criado_em: { type: "timestamp", notNull: true, default: pgm.func("now()") },
  });
};
exports.down = (pgm) => pgm.dropTable("enderecos");
