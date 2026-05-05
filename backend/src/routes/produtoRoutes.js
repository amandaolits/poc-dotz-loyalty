const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { listar, buscarPorId } = require("../models/produtoModel");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { categoria, subcategoria, busca, pagina, limite } = req.query;
    res.json(await listar({ categoria, subcategoria, busca, pagina: pagina || 1, limite: limite || 10 }));
  } catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const produto = await buscarPorId(req.params.id);
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(produto);
  } catch (err) { next(err); }
});

module.exports = router;
