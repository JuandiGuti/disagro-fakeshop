require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || "disagro_fakeshop",
  });
  const email = process.env.ADMIN_EMAIL || "admin@demo.com";
  const pass = process.env.ADMIN_PASS || "admin123";
  const passwordHash = await bcrypt.hash(pass, 10);
  const exists = await User.findOne({ email });
  if (!exists) await User.create({ email, passwordHash, role: "admin" });
  console.log("Admin OK:", email);
  process.exit(0);
})();
