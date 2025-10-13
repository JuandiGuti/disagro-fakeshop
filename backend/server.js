require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db");

const couponsRouter = require("./routes/coupons");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const adminCouponsRouter = require("./routes/coupons.admin");

const app = express();

app.set("trust proxy", 1);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const allowed = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  FRONTEND_ORIGIN,
]);
const vercelRegex = /^https:\/\/([a-z0-9-]+\.)?vercel\.app$/i;

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowed.has(origin) || vercelRegex.test(new URL(origin).hostname)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRouter);
app.use("/coupons", couponsRouter);
app.use("/orders", ordersRouter);
app.use("/admin/coupons", adminCouponsRouter);

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
