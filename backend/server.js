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

app.use(
  cors({
    origin: [
      "http://localhost:3000", // dev local
      "https://disagro-fakeshop-e6yav1fh5-juandis-projects-63200f91.vercel.app/", // producción
    ],
    credentials: true,
  })
);

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
