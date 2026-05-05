async function criar(clientOrPool, data) {
  const db = clientOrPool.query ? clientOrPool : require("../config/db");
  const result = await db.query(
    "INSERT INTO transacoes (usuario_id, tipo, pontos, descricao) VALUES ($1,$2,$3,$4) RETURNING *",
    [data.usuario_id, data.tipo, data.pontos, data.descricao || null]
  );
  return result.rows[0];
}

module.exports = { criar };