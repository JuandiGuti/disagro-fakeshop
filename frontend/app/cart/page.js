"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/store/CartContext";
import { applyPricingPreview, eligibleBase } from "@/utils/pricing";
import { getCoupon } from "@/services/coupons";
import { createOrder } from "@/services/orders";
import { getOrCreateUserId } from "@/store/user";

export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, addItem, removeItem, updateQty, clearCart, setCoupon } =
    useCart();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [couponInput, setCouponInput] = useState(cart.couponCode || "");
  const [couponData, setCouponData] = useState(cart.couponData || null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [err, setErr] = useState("");

  const processedAdds = useRef(new Set());
  useEffect(() => {
    const add = searchParams.get("add");
    if (!add) return;
    if (processedAdds.current.has(add)) return;
    processedAdds.current.add(add);

    try {
      const item = JSON.parse(add);
      addItem(item);
    } catch {
      // ignorar parse error
    } finally {
      router.replace("/cart");
    }
  }, [searchParams, router, addItem]);

  useEffect(() => {
    if (!couponData) return;

    if (cart.items.length === 0) {
      setCoupon(null, null);
      setCouponData(null);
      return;
    }

    if (couponData.type === "SOME") {
      const base = eligibleBase(cart.items, couponData);
      if (base === 0) {
        setCoupon(null, null);
        setCouponData(null);
        setErr("El cupón ya no aplica a tu carrito y fue removido.");
      }
    }
  }, [cart.items, couponData, setCoupon]);

  const preview = useMemo(
    () => applyPricingPreview(cart.items, couponData),
    [cart.items, couponData]
  );

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
      //const data = getCoupon(code);

      const base = eligibleBase(cart.items, data);
      if (cart.items.length === 0) {
        throw new Error(
          "Carrito vacío: agrega productos antes de aplicar un cupón"
        );
      }
      if (data.type === "SOME" && base === 0) {
        throw new Error("Este cupón no aplica a los productos del carrito");
      }

      setCoupon(code, data);
      setCouponData(data);
    } catch {
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
      await createOrder(
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
      router.push("/orders");
    } catch {
      setErr("No se pudo confirmar el pedido");
    }
  }

  return (
    <div>
      <h2>Carrito</h2>

      {!hasMounted ? (
        <div>Cargando carrito…</div>
      ) : (
        <>
          {err && (
            <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>
          )}

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
                    <tr
                      key={it.productId}
                      style={{ borderTop: "1px solid #eee" }}
                    >
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
        </>
      )}
    </div>
  );
}
