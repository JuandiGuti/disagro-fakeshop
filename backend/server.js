require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const cookieParser = require("cookie-parser");

const couponsRouter = require("./routes/coupons");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const adminCouponsRouter = require("./routes/coupons.admin");

const app = express();

const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "").trim();

const allowed = [
  FRONTEND_ORIGIN, // tu dominio exacto de producción en Vercel
  /\.vercel\.app$/, // previews de Vercel
  "http://localhost:3000", // desarrollo local
].filter(Boolean);

const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-User-Id",
    "X-Requested-With",
  ],
  exposedHeaders: ["X-User-Id"],
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const ok = allowed.some((rule) =>
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

app.use(express.json());
app.use(cookieParser());

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// rutas
app.use("/coupons", couponsRouter);
app.use("/orders", ordersRouter);
app.use("/auth", authRouter);
app.use("/admin/coupons", adminCouponsRouter);

// levantar
const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  });
