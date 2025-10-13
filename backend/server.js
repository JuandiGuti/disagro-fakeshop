// server.js
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

require("dotenv").config();

const app = express();
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: "Not Found", path: req.path });
});

// --------- CONFIG BÁSICA ----------
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

// CORS estricto hacia tu frontend
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
app.use(
  cors({
    origin: FRONTEND_ORIGIN === "*" ? true : FRONTEND_ORIGIN,
    credentials: true,
  })
);

// --------- HEALTH ----------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --------- RUTAS ----------
const authRoutes = require("./routes/auth");
const couponRoutes = require("./routes/coupons");
const orderRoutes = require("./routes/orders");

app.use("/auth", authRoutes);
app.use("/coupons", couponRoutes);
app.use("/orders", orderRoutes);

// --------- 404 JSON ----------
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: "Not Found", path: req.path });
});

// --------- ERROR HANDLER JSON ----------
app.use((err, req, res, _next) => {
  console.error("💥 Error:", err);
  res.status(err.status || 500).json({
    ok: false,
    msg: err.message || "Internal Server Error",
  });
});

// --------- ARRANQUE ----------
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI no está definido");
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET no está definido");

    console.log("🚀 Booting...");
    console.log("Env:", {
      NODE_ENV: process.env.NODE_ENV,
      FRONTEND_ORIGIN: FRONTEND_ORIGIN,
      PORT,
    });

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ API escuchando en 0.0.0.0:${PORT}`);
    });
  } catch (e) {
    console.error("❌ Falla al iniciar:", e);
    // No hagas process.exit inmediatamente; deja logs visibles:
    setTimeout(() => process.exit(1), 5000);
  }
})();

// Log global por si algo se escapa
process.on("unhandledRejection", (r) => {
  console.error("UNHANDLED REJECTION:", r);
});
process.on("uncaughtException", (e) => {
  console.error("UNCAUGHT EXCEPTION:", e);
});
