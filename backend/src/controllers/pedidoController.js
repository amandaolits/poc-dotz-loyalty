const { listarPorUsuario, buscarPorId } = require("../models/pedidoModel");

async function listarPedidos(usuarioId, filtros = {}) { return listarPorUsuario(usuarioId, filtros); }
async function getPedido(id, usuarioId) { return buscarPorId(id, usuarioId); }

module.exports = { listarPedidos, getPedido };
