const pool = require("../../src/config/db");

async function cleanDatabase() {
  await pool.query("DELETE FROM transacoes");
  await pool.query("DELETE FROM pedidos");
  await pool.query("DELETE FROM enderecos");
  await pool.query("DELETE FROM produtos");
  await pool.query("DELETE FROM usuarios");
}

module.exports = { cleanDatabase };
