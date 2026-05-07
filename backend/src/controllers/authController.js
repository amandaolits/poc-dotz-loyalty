const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { buscarPorEmail, buscarPorId } = require("../models/usuarioModel");

async function login(email, senha) {
  const usuario = await buscarPorEmail(email);
  if (!usuario) return null;
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaValida) return null;
  const token = jwt.sign({ userId: usuario.id, email: usuario.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return { token, usuario: { id: usuario.id, email: usuario.email, saldo_pontos: usuario.saldo_pontos } };
}

async function getMe(userId) {
  return buscarPorId(userId);
}

module.exports = { login, getMe };