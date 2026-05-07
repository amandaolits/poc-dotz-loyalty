const express = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");
const { resgatar } = require("../controllers/resgateController");

const router = express.Router();
router.use(authMiddleware);

const resgateSchema = z.object({
  produto_id: z.string().uuid("Produto ID inválido"),
  endereco_id: z.string().uuid("Endereço ID inválido"),
});

router.post("/", validate(resgateSchema), async (req, res, next) => {
  try {
    const pedido = await resgatar(req.userId, req.validatedBody.produto_id, req.validatedBody.endereco_id);
    res.status(201).json(pedido);
  } catch (err) {
    if (err.message === "Saldo insuficiente") return res.status(400).json({ erro: err.message });
    if (err.message === "Endereço não encontrado") return res.status(422).json({ erro: "Endereço não encontrado ou não pertence ao usuário" });
    if (err.message === "Produto não encontrado ou inativo") return res.status(404).json({ erro: err.message });
    next(err);
  }
});

module.exports = router;