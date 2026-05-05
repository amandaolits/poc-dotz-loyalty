const jwt = require("jsonwebtoken");
const env = require("../config/env");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ erro: "Token não fornecido" });

  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ erro: "Token inválido" });

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;