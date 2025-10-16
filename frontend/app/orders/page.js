export const dynamic = "force-dynamic";

import OrdersClient from "./OrdersClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE = process.env.COOKIE_NAME || "auth";
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api").replace(/\/$/, "");

async function fetchOrders(cookieHeader) {
  const headers = cookieHeader ? { cookie: cookieHeader } : {};

  const res = await fetch(`${API_BASE}/orders`, {
    headers,
    cache: "no-store",
  });

  if (res.status === 401) {
    const err = new Error("no autenticado");
    err.status = 401;
    throw err;
  }

  if (!res.ok) {
    const message = await res.text();
    const err = new Error(message || `GET /orders ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE);

  if (!authCookie) {
    redirect("/login?next=/orders");
  }

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  let orders = [];
  let error = "";

  try {
    orders = await fetchOrders(cookieHeader);
  } catch (err) {
    if (err?.status === 401) {
      redirect("/login?next=/orders");
    }
    console.error("orders-ssr", err);
    error = "Error obteniendo pedidos. Intente de nuevo.";
  }

  return <OrdersClient initialOrders={orders} initialError={error} />;
}
