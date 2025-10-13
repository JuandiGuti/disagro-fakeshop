const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const COOKIE_NAME = process.env.COOKIE_NAME || "auth";
const isProd = process.env.NODE_ENV === "production";

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user)
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ ok: false, msg: "Credenciales inválidas" });

    const token = jwt.sign(
      { uid: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
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

module.exports = router;
