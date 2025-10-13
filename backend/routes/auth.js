const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "auth";
const isProd = process.env.NODE_ENV === "production";

function requireAuth(req, res, next) {
  const raw = req.cookies?.[COOKIE_NAME];
  if (!raw) return res.status(401).json({ ok: false, msg: "No autenticado" });
  try {
    req.auth = jwt.verify(raw, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ ok: false, msg: "Token inválido" });
  }
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: "Datos incompletos" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ ok: false, msg: "El email ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, role: "user", passwordHash });

    const token = jwt.sign(
      { uid: String(user._id), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      ok: true,
      user: { id: String(user._id), email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: "Datos incompletos" });
    }
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user)
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok)
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { uid: String(user._id), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      ok: true,
      user: { id: String(user._id), email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: "none",
    path: "/",
  });
  res.json({ ok: true });
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.uid).select("email role");
    if (!user)
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    res.json({
      ok: true,
      user: { id: String(user._id), email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
