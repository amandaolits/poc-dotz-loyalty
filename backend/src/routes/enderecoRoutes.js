const express = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");
const { listarPorUsuario, buscarPorId, criar, atualizar, remover, unsetPadrao } = require("../models/enderecoModel");
const pool = require("../config/db");

const router = express.Router();
router.use(authMiddleware);

const enderecoSchema = z.object({
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 caracteres"),
  padrao: z.boolean().optional(),
});

router.get("/", async (req, res, next) => {
  try { res.json(await listarPorUsuario(req.userId)); }
  catch (err) { next(err); }
});

router.post("/", validate(enderecoSchema), async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (req.validatedBody.padrao) await unsetPadrao(client, req.userId);
    const endereco = await criar(client, req.userId, req.validatedBody);
    await client.query("COMMIT");
    res.status(201).json(endereco);
  } catch (err) { await client.query("ROLLBACK"); next(err); }
  finally { client.release(); }
});

router.put("/:id", validate(enderecoSchema), async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (req.validatedBody.padrao) await unsetPadrao(client, req.userId);
    const endereco = await atualizar(client, req.params.id, req.userId, req.validatedBody);
    if (!endereco) return res.status(404).json({ erro: "Endereço não encontrado" });
    await client.query("COMMIT");
    res.json(endereco);
  } catch (err) { await client.query("ROLLBACK"); next(err); }
  finally { client.release(); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const removed = await remover(req.params.id, req.userId);
    if (!removed) return res.status(404).json({ erro: "Endereço não encontrado" });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;