const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

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
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
  });
}
function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
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
  return res.json({ ok: true });
});

module.exports = router;
