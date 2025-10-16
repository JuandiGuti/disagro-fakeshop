import { httpGet, httpPost } from "./api";

export async function createOrder(payload) {
  return httpPost("/orders", payload);
}

export async function getMyOrders() {
  return httpGet("/orders");
}
