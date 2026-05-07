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

async function buscarPorEmail(arg1, arg2) {
  let db, email;
  if (arg1 && typeof arg1 === 'object' && arg1.query) { db = arg1; email = arg2; }
  else { db = pool; email = arg1; }
  const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return result.rows[0] || null;
}

async function buscarPorId(arg1, arg2) {
  let db, id;
  if (arg1 && typeof arg1 === 'object' && arg1.query) { db = arg1; id = arg2; }
  else { db = pool; id = arg1; }
  const result = await db.query("SELECT id, email, saldo_pontos, criado_em FROM usuarios WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function atualizarSaldo(client, userId, novoSaldo) {
  await client.query("UPDATE usuarios SET saldo_pontos = $1 WHERE id = $2", [novoSaldo, userId]);
}

module.exports = { criar, buscarPorEmail, buscarPorId, atualizarSaldo };