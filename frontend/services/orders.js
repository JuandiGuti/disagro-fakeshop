import { httpGet, httpPost } from "./api";

export async function createOrder(payload, userId) {
  return httpPost("/orders", payload, { headers: { "x-user-id": userId } });
}

export async function getMyOrders(userId) {
  return httpGet("/orders", { headers: { "x-user-id": userId } });
}
