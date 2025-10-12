const express = require("express");
const Coupon = require("../models/coupons");
const { requireAuth, requireAdmin } = require("../middlewares/auth");

const router = express.Router();

router.use(requireAuth, requireAdmin);

// GET /admin/coupons
router.get("/", async (req, res, next) => {
  try {
    const docs = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json(docs);
  } catch (e) {
    next(e);
  }
});

// POST /admin/coupons
router.post("/", async (req, res, next) => {
  try {
    const { code, type, productIds, discountPct, active } = req.body || {};
    if (!code || !type)
      return res.status(400).json({ error: "code y type requeridos" });

    const exists = await Coupon.findOne({
      code: String(code).trim().toUpperCase(),
    });
    if (exists) return res.status(409).json({ error: "code duplicado" });

    const doc = await Coupon.create({
      code: String(code).trim().toUpperCase(),
      type,
      productIds: Array.isArray(productIds) ? productIds : [],
      discountPct: Number(discountPct) || 0,
      active: Boolean(active),
    });

    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});

// PUT /admin/coupons/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, productIds, discountPct, active } = req.body || {};
    const doc = await Coupon.findByIdAndUpdate(
      id,
      {
        ...(type !== undefined && { type }),
        ...(productIds !== undefined && { productIds }),
        ...(discountPct !== undefined && { discountPct: Number(discountPct) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "no encontrado" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// DELETE /admin/coupons/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const r = await Coupon.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ error: "no encontrado" });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
