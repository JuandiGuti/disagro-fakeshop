const jwt = require("jsonwebtoken");

const COOKIE_NAME = process.env.COOKIE_NAME || "auth";

function parseTokenFrom(req) {
  const tokenCookie = req.cookies?.[COOKIE_NAME];
  if (tokenCookie) return tokenCookie;
  const h = req.headers.authorization || "";
  if (h.startsWith("Bearer ")) return h.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = parseTokenFrom(req);
  if (!token) return res.status(401).json({ error: "no autenticado" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "token inválido" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "no autenticado" });
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "no autorizado" });
  next();
}

module.exports = { requireAuth, requireAdmin };
