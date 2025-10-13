function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function computeTotals(items, coupon) {
  const subtotal = round2(
    items.reduce((acc, it) => acc + it.price * it.qty, 0)
  );

  if (!coupon || !coupon.active) {
    return {
      items: items.map((it) => ({ ...it, applied: false })),
      subtotal,
      discount: 0,
      total: subtotal,
    };
  }

  const pct = Math.max(0, Math.min(100, coupon.discountPct)) / 100;

  if (coupon.type === "ALL") {
    const discount = round2(subtotal * pct);
    const total = round2(subtotal - discount);
    const itemsApplied = items.map((it) => ({ ...it, applied: true }));
    return { items: itemsApplied, subtotal, discount, total };
  }

  const eligible = new Set(coupon.productIds || []);
  let discountBase = 0;
  const itemsApplied = items.map((it) => {
    const isEligible = eligible.has(it.productId);
    if (isEligible) discountBase += it.price * it.qty;
    return { ...it, applied: isEligible };
  });

  discountBase = round2(discountBase);
  const discount = round2(discountBase * pct);
  const total = round2(subtotal - discount);

  return { items: itemsApplied, subtotal, discount, total };
}

module.exports = { computeTotals, round2 };
