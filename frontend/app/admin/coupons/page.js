export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientCoupons from "./ClientCoupons";

async function sfetch(path) {
  const cookieStore = await cookies();

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
  const me = await sfetch("/auth/me");
  const role =
    me?.role ??
    me?.user?.role ??
    me?.data?.role ??
    me?.data?.user?.role ??
    null;

  if (role !== "admin") {
    redirect("/");
  }

  const items = (await sfetch("/admin/coupons")) || [];

  return <ClientCoupons initialItems={items} />;
}
