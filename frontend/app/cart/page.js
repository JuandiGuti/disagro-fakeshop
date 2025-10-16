"use client";
export const dynamic = "force-dynamic";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/store/CartContext";
import { applyPricingPreview, eligibleBase } from "@/utils/pricing";
import { getCoupon } from "@/services/coupons";
import { createOrder } from "@/services/orders";

export default function CartPage() {
  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Cargando carrito…</div>}>
      <CartPageInner />
    </Suspense>
  );
}

function CartPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, addItem, removeItem, updateQty, clearCart, setCoupon } =
    useCart();

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

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

      const base = eligibleBase(cart.items, data);
      if (cart.items.length === 0) throw new Error("Carrito vacío");
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
        }
      );
      clearCart();
      router.push("/orders");
    } catch (e) {
      const message = e?.message || "";
      if (message.includes("no autenticado")) {
        setErr("Debes iniciar sesión para confirmar el pedido.");
        return;
      }
      setErr("No se pudo confirmar el pedido");
    }
  }

  // ---------- estilos (igual que antes) ----------
  const card = {
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#ddd",
    color: "#000000ff",
  };
  const btn = {
    border: "2px solid #000000ff",
    background: "#000000ff",
    color: "#ddd",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    textDecoration: "none",
  };
  const btnGhost = {
    border: "1px solid #000000ff",
    background: "transparent",
    color: "#000000ff",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  };
  const input = {
    border: "1px solid #aaa",
    borderRadius: 6,
    padding: "8px 10px",
    outline: "none",
  };

  return (
    <div style={{ padding: "20px 100px" }}>
      <h2>Carrito</h2>
      <div style={{ padding: "15px" }}></div>

      {!hasMounted ? (
        <div>Cargando carrito…</div>
      ) : (
        <>
          {err && (
            <div
              style={{
                ...card,
                background: "#ffe6e6",
                color: "#7a0000",
                padding: 12,
                marginBottom: 12,
              }}
            >
              {err}
            </div>
          )}

          {cart.items.length === 0 ? (
            <div style={{ ...card, padding: 16 }}>
              <p style={{ margin: 0 }}>
                No hay productos. Ve a{" "}
                <a href="/products" style={{ textDecoration: "underline" }}>
                  Productos
                </a>
                .
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 16,
                alignItems: "start",
              }}
            >
              <div style={{ ...card, padding: 12 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 12,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: 8,
                          fontWeight: 600,
                        }}
                      >
                        Producto
                      </th>
                      <th style={{ padding: 8 }}>Precio</th>
                      <th style={{ padding: 8 }}>Cantidad</th>
                      <th style={{ padding: 8 }}>Subtotal</th>
                      <th style={{ padding: 8 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((it) => (
                      <tr
                        key={it.productId}
                        style={{ borderTop: "1px solid #000000ff" }}
                      >
                        <td style={{ padding: 8 }}>{it.title}</td>
                        <td style={{ textAlign: "center", padding: 8 }}>
                          ${it.price.toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center", padding: 8 }}>
                          <input
                            type="number"
                            min={1}
                            value={it.qty}
                            onChange={(e) =>
                              updateQty(it.productId, Number(e.target.value))
                            }
                            style={{
                              ...input,
                              width: 72,
                              textAlign: "center",
                              background: "#000000ff",
                            }}
                          />
                        </td>
                        <td style={{ textAlign: "center", padding: 8 }}>
                          ${(it.price * it.qty).toFixed(2)}
                        </td>
                        <td style={{ textAlign: "center", padding: 8 }}>
                          <button
                            onClick={() => removeItem(it.productId)}
                            style={btnGhost}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  style={{
                    ...card,
                    background: "#eee",
                    padding: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <input
                    placeholder="Código de cupón"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{
                      ...input,
                      flex: 1,
                      background: "#fff",
                      color: "#000000ff",
                    }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loadingCoupon}
                    style={btn}
                  >
                    {loadingCoupon ? "Validando..." : "Aplicar cupón"}
                  </button>
                  {couponData?.code && (
                    <span
                      style={{
                        border: "1px solid #000000ff",
                        color: "#000000ff",
                        background: "#fff",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                      }}
                    >
                      Aplicado: {couponData.code}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  ...card,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Resumen</h3>
                <div style={{ padding: "10px" }} />
                <div style={{ display: "grid", rowGap: 6 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Subtotal</span>
                    <strong>${preview.subtotal.toFixed(2)}</strong>
                  </div>
                  <div style={{ padding: "2px" }} />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>Descuento</span>
                    <strong>- ${preview.discount.toFixed(2)}</strong>
                  </div>
                  <div style={{ padding: "2px" }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #bbb",
                      paddingTop: 8,
                      marginTop: 4,
                      fontSize: 18,
                    }}
                  >
                    <span>Total</span>
                    <strong>${preview.total.toFixed(2)}</strong>
                  </div>
                </div>
                <div style={{ padding: "5px" }} />
                <button
                  onClick={handleConfirm}
                  style={{ ...btn, marginTop: "auto" }}
                >
                  Confirmar pedido
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
