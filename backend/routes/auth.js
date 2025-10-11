const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/users");

const router = express.Router();
const COOKIE_NAME = process.env.COOKIE_NAME || "auth";

function signToken(user) {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_SECRET });
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email y password requeridos" });
    const exists = await user.findOne({ email });
    if (exists) return res.status(409).json({ error: "email ya registrado" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await user.create({
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "user",
    });

    const token = signToken(user);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.COOKIE_NAME === "true",
      sameSite: "lax",
      path: "/",
    });
    res.json({
      ok: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email y password requeridos" });

    const user = await user.findOne({ email });

    if (!user) return res.status(400).json({ error: "Credenciales invalidas" });

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) return res.status(400).json({ error: "Credenciales invalidas" });

    const token = signToken(user);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
    });
    res.json({
      ok: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (e) {
    next(e);
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
