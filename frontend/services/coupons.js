import { httpGet } from "./api";

export async function getCoupon(code) {
  return httpGet(`/coupons/${encodeURIComponent(code)}`);
}
