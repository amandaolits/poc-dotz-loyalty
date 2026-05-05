const pool = require("../config/db");

async function listarPorUsuario(usuarioId) {
  const result = await pool.query("SELECT * FROM enderecos WHERE usuario_id = $1 ORDER BY padrao DESC, criado_em DESC", [usuarioId]);
  return result.rows;
}

async function buscarPorId(id, usuarioId) {
  const result = await pool.query("SELECT * FROM enderecos WHERE id = $1 AND usuario_id = $2", [id, usuarioId]);
  return result.rows[0] || null;
}

async function criar(usuarioId, data) {
  const result = await pool.query(
    `INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, bairro, cidade, estado, padrao)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [usuarioId, data.cep, data.logradouro, data.numero, data.complemento || null, data.bairro, data.cidade, data.estado, data.padrao || false]
  );
  return result.rows[0];
}

async function atualizar(id, usuarioId, data) {
  const result = await pool.query(
    `UPDATE enderecos SET cep=$1, logradouro=$2, numero=$3, complemento=$4, bairro=$5, cidade=$6, estado=$7, padrao=$8
     WHERE id=$9 AND usuario_id=$10 RETURNING *`,
    [data.cep, data.logradouro, data.numero, data.complemento || null, data.bairro, data.cidade, data.estado, data.padrao, id, usuarioId]
  );
  return result.rows[0] || null;
}

async function remover(id, usuarioId) {
  const result = await pool.query("DELETE FROM enderecos WHERE id = $1 AND usuario_id = $2", [id, usuarioId]);
  return result.rowCount > 0;
}

async function unsetPadrao(client, usuarioId) {
  await client.query("UPDATE enderecos SET padrao = false WHERE usuario_id = $1", [usuarioId]);
}

module.exports = { listarPorUsuario, buscarPorId, criar, atualizar, remover, unsetPadrao };