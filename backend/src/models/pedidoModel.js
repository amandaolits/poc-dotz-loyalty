const pool = require("../config/db");

async function criar(clientOrPool, data) {
  const db = clientOrPool.query ? clientOrPool : pool;
  const result = await db.query(
    "INSERT INTO pedidos (usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [data.usuario_id, data.produto_id, data.endereco_entrega_id, data.pontos_gastos, data.status]
  );
  return result.rows[0];
}

async function listarPorUsuario(usuarioId) {
  const result = await pool.query(
    `SELECT p.*, pr.nome as produto_nome, pr.imagem_url as produto_imagem,
            e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
     FROM pedidos p
     JOIN produtos pr ON p.produto_id = pr.id
     JOIN enderecos e ON p.endereco_entrega_id = e.id
     WHERE p.usuario_id = $1 ORDER BY p.data_pedido DESC`,
    [usuarioId]
  );
  return result.rows;
}

async function buscarPorId(id, usuarioId) {
  const result = await pool.query(
    `SELECT p.*, pr.nome as produto_nome, pr.descricao as produto_descricao, pr.imagem_url as produto_imagem, pr.pontos_necessarios,
            e.cep, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
     FROM pedidos p JOIN produtos pr ON p.produto_id = pr.id JOIN enderecos e ON p.endereco_entrega_id = e.id
     WHERE p.id = $1 AND p.usuario_id = $2`,
    [id, usuarioId]
  );
  return result.rows[0] || null;
}

module.exports = { criar, listarPorUsuario, buscarPorId };