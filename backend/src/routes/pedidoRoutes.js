const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { listarPedidos, getPedido } = require("../controllers/pedidoController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try { res.json(await listarPedidos(req.userId)); }
  catch (err) { next(err); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const pedido = await getPedido(req.params.id, req.userId);
    if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });
    res.json(pedido);
  } catch (err) { next(err); }
});

module.exports = router;
