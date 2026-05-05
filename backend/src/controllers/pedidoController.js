const { listarPorUsuario, buscarPorId } = require("../models/pedidoModel");

async function listarPedidos(usuarioId) { return listarPorUsuario(usuarioId); }
async function getPedido(id, usuarioId) { return buscarPorId(id, usuarioId); }

module.exports = { listarPedidos, getPedido };
