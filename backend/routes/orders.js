const express = require("express");
const { requireUser } = require("../middlewares/auth");
const Order = require("../models/orders.js");
const Coupon = require("../models/coupons.js");
const { computeTotals } = require("../services/pricing");

const router = express.Router();

// GET /orders (por usuario)
router.get("/", requireUser, async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  res.json(orders);
});

// POST /orders
router.post("/", requireUser, async (req, res) => {
  const userId = req.user.id;
  const { items, couponCode } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items requeridos" });
  }
  for (const it of items) {
    if (
      typeof it.productId !== "number" ||
      typeof it.title !== "string" ||
      typeof it.price !== "number" ||
      typeof it.qty !== "number" ||
      it.qty < 1
    ) {
      return res.status(422).json({ error: "item inválido" });
    }
  }

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.trim().toUpperCase(),
      active: true,
    }).lean();
    if (!coupon)
      return res.status(422).json({ error: "cupón inválido o inactivo" });
  }

  const totals = computeTotals(items, coupon);

  const doc = await Order.create({
    userId,
    items: totals.items,
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    couponCode: coupon ? coupon.code : undefined,
  });

  res.status(201).json({
    orderId: String(doc._id),
    subtotal: doc.subtotal,
    discount: doc.discount,
    total: doc.total,
    couponCode: doc.couponCode,
  });
});

module.exports = router;
