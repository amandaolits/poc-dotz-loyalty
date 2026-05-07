const { buscarPorId } = require("../models/usuarioModel");
const pool = require("../config/db");

async function getSaldo(userId) {
  const usuario = await buscarPorId(userId);
  return { saldo_pontos: usuario?.saldo_pontos || 0 };
}

async function getExtrato(userId, { periodo, pagina = 1, limite = 10 }) {
  const offset = (pagina - 1) * limite;
  let where = "usuario_id = $1";
  const values = [userId];
  let paramCount = 2;

  if (periodo) {
    const now = new Date();
    let startDate;
    if (periodo === "1m") startDate = new Date(now.setMonth(now.getMonth() - 1));
    else if (periodo === "3m") startDate = new Date(now.setMonth(now.getMonth() - 3));
    else if (periodo === "6m") startDate = new Date(now.setMonth(now.getMonth() - 6));
    if (startDate) { where += ` AND data_criacao >= $${paramCount}`; values.push(startDate); paramCount++; }
  }

  const countResult = await pool.query(`SELECT COUNT(*) FROM transacoes WHERE ${where}`, values);
  const result = await pool.query(
    `SELECT * FROM transacoes WHERE ${where} ORDER BY data_criacao DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    [...values, limite, offset]
  );

  return { transacoes: result.rows, total: parseInt(countResult.rows[0].count, 10), pagina: parseInt(pagina, 10) };
}

module.exports = { getSaldo, getExtrato };
