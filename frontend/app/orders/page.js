"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "@/services/orders";
import { getOrCreateUserId } from "@/store/user";

export default function OrdersPage() {
  const [orders, setOrders] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const userId = getOrCreateUserId();
    getMyOrders(userId)
      .then(setOrders)
      .catch(() => setErr("Error obteniendo pedidos"));
  }, []);

  if (err) return <div>{err}</div>;
  if (!orders) return <div>Cargando...</div>;
  if (orders.length === 0) return <div>No tienes pedidos todavía.</div>;

  return (
    <div>
      <h2>Mis pedidos</h2>
      <ul style={{ paddingLeft: 16 }}>
        {orders.map((o) => (
          <li key={o._id} style={{ marginBottom: 12 }}>
            <div>
              <strong>Fecha:</strong> {new Date(o.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Total:</strong> ${o.total.toFixed(2)}{" "}
              {o.couponCode ? `(cupón: ${o.couponCode})` : ""}
            </div>
            <details style={{ marginTop: 6 }}>
              <summary>Ver ítems</summary>
              <ul>
                {o.items.map((it, idx) => (
                  <li key={idx}>
                    {it.title} — ${it.price.toFixed(2)} x {it.qty}{" "}
                    {it.applied ? "(con descuento)" : ""}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
