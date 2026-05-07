const express = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate");
const { criar, buscarPorEmail } = require("../models/usuarioModel");

const router = express.Router();

const cadastroSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

router.post("/", validate(cadastroSchema), async (req, res, next) => {
  try {
    const { email, senha } = req.validatedBody;
    const existente = await buscarPorEmail(email);
    if (existente) return res.status(409).json({ erro: "Email já cadastrado" });
    const usuario = await criar(email, senha);
    res.status(201).json({ id: usuario.id, email: usuario.email, saldo_pontos: usuario.saldo_pontos });
  } catch (err) { next(err); }
});

module.exports = router;