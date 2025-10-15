const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "auth";

function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

function parseTokenFrom(req) {
  const tokenCookie = req.cookies?.[COOKIE_NAME];
  if (tokenCookie) return tokenCookie;
  const h = req.headers.authorization || "";
  if (h.startsWith("Bearer ")) return h.slice(7);
  return null;
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email y password requeridos" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "email ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "user",
    });

    const token = signToken(newUser);
    setAuthCookie(res, token);

    return res.json({
      ok: true,
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email y password requeridos" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "credenciales inválidas" });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      ok: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", async (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  try {
    const token = parseTokenFrom(req);
    if (!token) return res.status(401).json({ error: "no autenticado" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      ok: true,
      user: { id: payload.sub, email: payload.email, role: payload.role },
    });
  } catch {
    return res.status(401).json({ error: "token inválido" });
  }
});

module.exports = router;
