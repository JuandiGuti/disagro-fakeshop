const express = require("express");
const Coupon = require("../models/coupons");
const router = express.Router();

// GET /coupons/:code
router.get("/:code", async (req, res) => {
  const raw = req.params.code || "";
  const code = raw.trim().toUpperCase();
  if (!code) return res.status(400).json({ error: "code requerido" });

  const coupon = await Coupon.findOne({ code, active: true }).lean();
  if (!coupon)
    return res.status(404).json({ error: "cupón no encontrado o inactivo" });

  return res.json({
    code: coupon.code,
    type: coupon.type,
    productIds: coupon.productIds,
    discountPct: coupon.discountPct,
    active: coupon.active,
  });
});

module.exports = router;
