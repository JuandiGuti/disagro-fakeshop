const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["ALL", "SOME"], required: true },
    productIds: { type: [Number], default: [] }, // aplica si type = SOME
    discountPct: { type: Number, min: 0, max: 100, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
