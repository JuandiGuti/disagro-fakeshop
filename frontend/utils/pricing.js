function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
export function applyPricingPreview(items, couponData) {
  const subtotal = round2(
    items.reduce((acc, it) => acc + it.price * it.qty, 0)
  );
  if (!couponData || !couponData.active) {
    return { subtotal, discount: 0, total: subtotal };
  }
  const pct = Math.max(0, Math.min(100, couponData.discountPct)) / 100;

  if (couponData.type === "ALL") {
    const discount = round2(subtotal * pct);
    const total = round2(subtotal - discount);
    return { subtotal, discount, total };
  }

  const eligible = new Set(couponData.productIds || []);
  const base = round2(
    items
      .filter((i) => eligible.has(i.productId))
      .reduce((acc, it) => acc + it.price * it.qty, 0)
  );
  const discount = round2(base * pct);
  const total = round2(subtotal - discount);
  return { subtotal, discount, total };
}
