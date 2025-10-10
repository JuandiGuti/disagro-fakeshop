import { httpGet } from "./api";

export async function getCoupon(code) {
  return httpGet(`/coupons/${encodeURIComponent(code)}`);
}
/*
export function getCoupon(code) {
  if (code === "PROD01")
    return { code: "PROD01", type: "ALL", discountPct: 10, active: true };
  if (code === "SERVI01")
    return {
      code: "SERVI01",
      type: "SOME",
      productIds: [1, 2, 3],
      discountPct: 15,
      active: true,
    };
  throw new Error("mock: cupón no existe");
}*/
