const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, index: true, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("user", userSchema);
