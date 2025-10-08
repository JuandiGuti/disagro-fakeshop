const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, min: 0, required: true },
    qty: { type: Number, min: 1, required: true },
    applied: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, min: 0, required: true },
    discount: { type: Number, min: 0, required: true },
    total: { type: Number, min: 0, required: true },
    couponCode: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
