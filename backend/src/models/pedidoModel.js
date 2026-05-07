const pool = require("../config/db");

async function criar(clientOrPool, data) {
  const db = clientOrPool.query ? clientOrPool : pool;
  const result = await db.query(
    "INSERT INTO pedidos (usuario_id, produto_id, endereco_entrega_id, pontos_gastos, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [data.usuario_id, data.produto_id, data.endereco_entrega_id, data.pontos_gastos, data.status]
  );
  return result.rows[0];
}

async function listarPorUsuario(usuarioId, filtros = {}) {
  let query = `SELECT p.*, pr.nome as produto_nome, pr.imagem_url as produto_imagem,
                      e.logradouro, e.numero, e.complemento, e.bairro, e.cidade, e.estado
               FROM pedidos p
               JOIN produtos pr ON p.produto_id = pr.id
               JOIN enderecos e ON p.endereco_entrega_id = e.id
               WHERE p.usuario_id = $1`;
  const values = [usuarioId];
  let idx = 2;

  if (filtros.periodo === "30d") {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    query += ` AND p.data_pedido >= $${idx}`;
    values.push(d);
    idx++;
  } else if (filtros.periodo === "1y") {
    const d = new Date(new Date().getFullYear(), 0, 1);
    query += ` AND p.data_pedido >= $${idx}`;
    values.push(d);
    idx++;
  }

  if (filtros.data_inicio) {
    query += ` AND p.data_pedido >= $${idx}`;
    values.push(filtros.data_inicio);
    idx++;
  }
  if (filtros.data_fim) {
    query += ` AND p.data_pedido <= $${idx}`;
    values.push(new Date(filtros.data_fim + "T23:59:59"));
    idx++;
  }

  query += " ORDER BY p.data_pedido DESC";
  const result = await pool.query(query, values);
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