const pool = require("../config/db");
const { buscarPorId: buscarUsuario, atualizarSaldo } = require("../models/usuarioModel");
const { buscarPorId: buscarProduto } = require("../models/produtoModel");
const { buscarPorId: buscarEndereco } = require("../models/enderecoModel");
const { criar: criarTransacao } = require("../models/transacaoModel");
const { criar: criarPedido } = require("../models/pedidoModel");

async function realizarResgate(usuarioId, produtoId, enderecoId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const usuario = await buscarUsuario(client, usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const produto = await buscarProduto(client, produtoId);
    if (!produto) throw new Error("Produto não encontrado ou inativo");

    const endereco = await buscarEndereco(client, enderecoId, usuarioId);
    if (!endereco) throw new Error("Endereço não encontrado");

    if (usuario.saldo_pontos < produto.pontos_necessarios) throw new Error("Saldo insuficiente");

    const novoSaldo = usuario.saldo_pontos - produto.pontos_necessarios;
    await atualizarSaldo(client, usuarioId, novoSaldo);

    const pedido = await criarPedido(client, {
      usuario_id: usuarioId, produto_id: produtoId, endereco_entrega_id: enderecoId,
      pontos_gastos: produto.pontos_necessarios, status: "Confirmado",
    });

    await criarTransacao(client, {
      usuario_id: usuarioId, tipo: "resgate", pontos: produto.pontos_necessarios,
      descricao: `Resgate: ${produto.nome}`,
    });

    await client.query("COMMIT");
    return pedido;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { realizarResgate };