const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const enderecoRoutes = require("./routes/enderecoRoutes");
const saldoRoutes = require("./routes/saldoRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const resgateRoutes = require("./routes/resgateRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api", authRoutes);
app.use("/api/enderecos", enderecoRoutes);
app.use("/api", saldoRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/resgates", resgateRoutes);
app.use("/api/pedidos", pedidoRoutes);

app.use(errorHandler);

module.exports = app;