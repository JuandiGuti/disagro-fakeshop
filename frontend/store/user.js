const KEY = "disagro_user_id";

export function getOrCreateUserId() {
  if (typeof window === "undefined") return null;
  let v = window.localStorage.getItem(KEY);
  if (!v) {
    v = "user_" + Math.random().toString(36).slice(2, 10);
    window.localStorage.setItem(KEY, v);
  }
  return v;
}
