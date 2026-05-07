const express = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");
const { login, getMe } = require("../controllers/authController");

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, senha } = req.validatedBody;
    const result = await login(email, senha);
    if (!result) return res.status(401).json({ erro: "Email ou senha inválidos" });
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const usuario = await getMe(req.userId);
    if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(usuario);
  } catch (err) { next(err); }
});

module.exports = router;