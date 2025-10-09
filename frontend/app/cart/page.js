"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/CartContext";
import { applyPricingPreview } from "@/utils/pricing";
import { getCoupon } from "@/services/coupons";
import { createOrder } from "@/services/orders";
import { getOrCreateUserId } from "@/store/user";

export default function CartPage({ searchParams }) {
  const { cart, addItem, removeItem, updateQty, clearCart, setCoupon } =
    useCart();
  const [couponInput, setCouponInput] = useState(cart.couponCode || "");
  const [couponData, setCouponData] = useState(cart.couponData || null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (searchParams?.add) {
      try {
        const item = JSON.parse(searchParams.add);
        addItem(item);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const preview = useMemo(() => {
    return applyPricingPreview(cart.items, couponData);
  }, [cart.items, couponData]);

  async function handleApplyCoupon() {
    setErr("");
    setLoadingCoupon(true);
    try {
      const code = (couponInput || "").trim().toUpperCase();
      if (!code) {
        setCoupon(null, null);
        setCouponData(null);
        return;
      }
      const data = await getCoupon(code);
      setCoupon(code, data);
      setCouponData(data);
    } catch (e) {
      setErr("Cupón inválido o inactivo");
      setCoupon(null, null);
      setCouponData(null);
    } finally {
      setLoadingCoupon(false);
    }
  }

  async function handleConfirm() {
    setErr("");
    if (cart.items.length === 0) {
      setErr("El carrito está vacío");
      return;
    }
    const userId = getOrCreateUserId();
    try {
      const res = await createOrder(
        {
          items: cart.items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            qty: i.qty,
          })),
          couponCode: couponData?.code || undefined,
        },
        userId
      );
      clearCart();
      window.location.href = "/orders";
    } catch (e) {
      setErr("No se pudo confirmar el pedido");
    }
  }

  return (
    <div>
      <h2>Carrito</h2>
      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      {cart.items.length === 0 ? (
        <p>
          No hay productos. Ve a <a href="/products">Productos</a>.
        </p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 12,
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((it) => (
                <tr key={it.productId} style={{ borderTop: "1px solid #eee" }}>
                  <td>{it.title}</td>
                  <td style={{ textAlign: "center" }}>
                    ${it.price.toFixed(2)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        updateQty(it.productId, Number(e.target.value))
                      }
                      style={{ width: 64 }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    ${(it.price * it.qty).toFixed(2)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button onClick={() => removeItem(it.productId)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              margin: "12px 0",
            }}
          >
            <input
              placeholder="Código de cupón"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button onClick={handleApplyCoupon} disabled={loadingCoupon}>
              {loadingCoupon ? "Validando..." : "Aplicar cupón"}
            </button>
            {couponData?.code && <span>Aplicado: {couponData.code}</span>}
          </div>

          <div style={{ marginTop: 12 }}>
            <div>
              Subtotal: <strong>${preview.subtotal.toFixed(2)}</strong>
            </div>
            <div>
              Descuento: <strong>-${preview.discount.toFixed(2)}</strong>
            </div>
            <div>
              Total: <strong>${preview.total.toFixed(2)}</strong>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button onClick={handleConfirm}>Confirmar pedido</button>
          </div>
        </>
      )}
    </div>
  );
}
