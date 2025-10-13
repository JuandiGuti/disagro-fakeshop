// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const couponRoutes = require("./routes/coupons");
const orderRoutes = require("./routes/orders");

const app = express();

// ----- Básicos -----
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "").trim();
const allowedOrigins = [
  FRONTEND_ORIGIN, // dominio principal
  /\.vercel\.app$/,
  "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some((rule) =>
      rule instanceof RegExp ? rule.test(origin) : origin === rule
    );
    return ok
      ? cb(null, true)
      : cb(new Error(`CORS bloqueado para: ${origin}`));
  },
};

app.use((req, res, next) => {
  res.header("Vary", "Origin");
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/coupons", couponRoutes);
app.use("/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, msg: "Not Found", path: req.path });
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  const status = Number(err.status || err.statusCode) || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? err.expose
        ? err.message
        : "Internal Server Error"
      : err.message || "Internal Server Error";
  res.status(status).json({ ok: false, msg: message });
});

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI en variables de entorno");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined })
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API escuchando en http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
