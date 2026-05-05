const pool = require("../config/db");

async function listar({ categoria, subcategoria, busca, pagina = 1, limite = 10 }) {
  const offset = (pagina - 1) * limite;
  let where = ["ativo = true"];
  const values = [];
  let paramCount = 1;

  if (categoria) { where.push(`categoria = $${paramCount}`); values.push(categoria); paramCount++; }
  if (subcategoria) { where.push(`subcategoria = $${paramCount}`); values.push(subcategoria); paramCount++; }
  if (busca) { where.push(`(nome ILIKE $${paramCount} OR descricao ILIKE $${paramCount})`); values.push(`%${busca}%`); paramCount++; }

  const whereClause = where.join(" AND ");
  const countResult = await pool.query(`SELECT COUNT(*) FROM produtos WHERE ${whereClause}`, values);
  const result = await pool.query(
    `SELECT * FROM produtos WHERE ${whereClause} ORDER BY criado_em DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    [...values, limite, offset]
  );

  return { produtos: result.rows, total: parseInt(countResult.rows[0].count, 10), pagina: parseInt(pagina, 10), limite: parseInt(limite, 10) };
}

async function buscarPorId(id) {
  const result = await pool.query("SELECT * FROM produtos WHERE id = $1 AND ativo = true", [id]);
  return result.rows[0] || null;
}

module.exports = { listar, buscarPorId };