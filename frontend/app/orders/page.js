"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orders";
import { getOrCreateUserId } from "@/store/user";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState("");

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
  const muted = { opacity: 0.8 };

  useEffect(() => {
    const userId = getOrCreateUserId();
    getMyOrders(userId)
      .then(setOrders)
      .catch(() => setErr("Error obteniendo pedidos. Intente de nuevo."));
  }, []);

  if (err)
    return (
      <div
        style={{
          ...card,
          padding: 16,
          background: "#ffe6e6",
          color: "#7a0000",
        }}
      >
        {err}
      </div>
    );

  if (!orders)
    return <div style={{ ...card, padding: 16 }}>Cargando pedidos...</div>;

  if (orders.length === 0)
    return (
      <div style={{ ...card, padding: 16 }}>
        <p style={{ margin: 0 }}>
          No tienes pedidos todavía. Ve a{" "}
          <a href="/products" style={{ textDecoration: "underline" }}>
            Productos
          </a>{" "}
          para comenzar.
        </p>
      </div>
    );

  return (
    <div style={{ padding: "20px 100px" }}>
      <h2>Mis pedidos</h2>
      <div style={{ height: 15 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
        {orders.map((o) => (
          <div key={o._id} style={{ ...card, padding: 12 }}>
            <div
              style={{
                ...card,
                background: "#eee",
                padding: 12,
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={muted}>Pedido</div>
                <div style={{ fontWeight: 600 }}>{String(o._id)}</div>
              </div>
              <div>
                <div style={muted}>Fecha</div>
                <div>{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div style={muted}>Cupón</div>
                <div>{o.couponCode ? o.couponCode : "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={muted}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  ${Number(o.total).toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ height: 10 }} />

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#f6f6f6",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th style={{ textAlign: "left", padding: 10 }}>Producto</th>
                  <th style={{ padding: 10 }}>Precio</th>
                  <th style={{ padding: 10 }}>Cantidad</th>
                  <th style={{ padding: 10 }}>Subtotal</th>
                  <th style={{ padding: 10 }}>Estado desc.</th>
                </tr>
              </thead>
              <tbody>
                {o.items.map((it, idx) => (
                  <tr key={idx} style={{ borderTop: "1px solid #e5e5e5" }}>
                    <td style={{ padding: 10 }}>{it.title}</td>
                    <td style={{ textAlign: "center", padding: 10 }}>
                      ${Number(it.price).toFixed(2)}
                    </td>
                    <td style={{ textAlign: "center", padding: 10 }}>
                      {it.qty}
                    </td>
                    <td style={{ textAlign: "center", padding: 10 }}>
                      ${(Number(it.price) * Number(it.qty)).toFixed(2)}
                    </td>
                    <td style={{ textAlign: "center", padding: 10 }}>
                      {it.applied ? "Aplicado" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ height: 10 }} />
            <div
              style={{
                ...card,
                background: "#eee",
                padding: 12,
                display: "grid",
                rowGap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Subtotal</span>
                <strong>${Number(o.subtotal ?? 0).toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Descuento</span>
                <strong>- ${Number(o.discount ?? 0).toFixed(2)}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #bbb",
                  paddingTop: 8,
                  marginTop: 4,
                  fontSize: 16,
                }}
              >
                <span>Total</span>
                <strong>${Number(o.total).toFixed(2)}</strong>
              </div>
            </div>
            <div style={{ height: 10 }} />
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <button style={btn}>Exportar PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
