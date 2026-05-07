const { realizarResgate } = require("../services/resgateService");

async function resgatar(usuarioId, produtoId, enderecoId) {
  return realizarResgate(usuarioId, produtoId, enderecoId);
}

module.exports = { resgatar };