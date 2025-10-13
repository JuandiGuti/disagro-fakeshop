import { httpGet, httpPost } from "@/services/api";

export function listCoupons() {
  return httpGet("/admin/coupons");
}

export function createCoupon(payload) {
  return httpPost("/admin/coupons", payload);
}

export async function updateCoupon(id, payload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCoupon(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/coupons/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
