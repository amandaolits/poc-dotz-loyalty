const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../../src/config/env");
const pool = require("../../src/config/db");

async function createUsuario(email = "teste@email.com", senha = "123456", saldo = 10000) {
  const hash = await bcrypt.hash(senha, 10);
  const result = await pool.query(
    "INSERT INTO usuarios (email, senha_hash, saldo_pontos) VALUES ($1, $2, $3) RETURNING id, email, saldo_pontos",
    [email, hash, saldo]
  );
  return result.rows[0];
}

async function createEndereco(usuarioId, dados = {}) {
  const result = await pool.query(
    `INSERT INTO enderecos (usuario_id, cep, logradouro, numero, bairro, cidade, estado, padrao)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      usuarioId,
      dados.cep || "01310-100",
      dados.logradouro || "Av. Paulista",
      dados.numero || "1000",
      dados.bairro || "Bela Vista",
      dados.cidade || "São Paulo",
      dados.estado || "SP",
      dados.padrao ?? true,
    ]
  );
  return result.rows[0];
}

async function createProduto(dados = {}) {
  const result = await pool.query(
    `INSERT INTO produtos (nome, descricao, pontos_necessarios, categoria, subcategoria, imagem_url, ativo)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [
      dados.nome || "Fone Bluetooth",
      dados.descricao || "Fone sem fio",
      dados.pontos_necessarios ?? 5000,
      dados.categoria || "Eletrônicos",
      dados.subcategoria || "Áudio",
      dados.imagem_url || "https://via.placeholder.com/300",
      dados.ativo ?? true,
    ]
  );
  return result.rows[0];
}

function generateToken(usuarioId, email = "teste@email.com") {
  return jwt.sign({ userId: usuarioId, email }, env.jwtSecret, { expiresIn: "8h" });
}

module.exports = { createUsuario, createEndereco, createProduto, generateToken };
