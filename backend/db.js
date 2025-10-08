const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "disagro_fakeshop";
  if (!uri) throw new Error("MONGODB_URI no definido");

  await mongoose.connect(uri, { dbName });
  console.log("Conectado a MongoDB Atlas:", dbName);
}

module.exports = { connectDB };
