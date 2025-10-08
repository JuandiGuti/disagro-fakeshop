const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();
const { connectDB } = require("./db");

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB().catch((err) => {
  console.error("Error conectando a MongoDB:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});
