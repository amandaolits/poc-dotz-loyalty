function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);
  if (err.code === "23505") return res.status(409).json({ erro: "Recurso já existe" });
  res.status(500).json({ erro: "Erro interno do servidor" });
}

module.exports = errorHandler;