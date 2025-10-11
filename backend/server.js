require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const cookieParser = require("cookie-parser");

const couponsRouter = require("./routes/coupons");
const ordersRouter = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// rutas
app.use("/coupons", couponsRouter);
app.use("/orders", ordersRouter);
app.use("/auth", require("./routes/auth"));

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
