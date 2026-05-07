const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { getSaldo, getExtrato } = require("../controllers/saldoController");

const router = express.Router();
router.use(authMiddleware);

router.get("/saldo", async (req, res, next) => {
  try { res.json(await getSaldo(req.userId)); }
  catch (err) { next(err); }
});

router.get("/extrato", async (req, res, next) => {
  try {
    const { periodo, pagina, limite } = req.query;
    res.json(await getExtrato(req.userId, { periodo, pagina: pagina || 1, limite: limite || 10 }));
  } catch (err) { next(err); }
});

module.exports = router;
