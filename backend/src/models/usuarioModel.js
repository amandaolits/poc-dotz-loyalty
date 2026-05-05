const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function criar(email, senha) {
  const senhaHash = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    "INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING id, email, saldo_pontos, criado_em",
    [email, senhaHash]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return result.rows[0] || null;
}

async function buscarPorId(id) {
  const result = await pool.query("SELECT id, email, saldo_pontos, criado_em FROM usuarios WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function atualizarSaldo(client, userId, novoSaldo) {
  await client.query("UPDATE usuarios SET saldo_pontos = $1 WHERE id = $2", [novoSaldo, userId]);
}

module.exports = { criar, buscarPorEmail, buscarPorId, atualizarSaldo };