// /frontend/app/admin/coupons/page.js
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientCoupons from "./ClientCoupons";

async function sfetch(path) {
  // 👇 cookies() ahora es async
  const cookieStore = await cookies();
  // Construimos el header "cookie: name=value; name2=value2"
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function Page() {
  // 1) Verificar sesión/rol en el servidor
  const me = await sfetch("/auth/me");
  const role =
    me?.role ??
    me?.user?.role ??
    me?.data?.role ??
    me?.data?.user?.role ??
    null;

  if (role !== "admin") {
    redirect("/"); // o "/login"
  }

  // 2) Cargar datos iniciales SSR
  const items = (await sfetch("/admin/coupons")) || [];

  // 3) Pasar datos al componente cliente
  return <ClientCoupons initialItems={items} />;
}
