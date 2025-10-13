export function emitAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:changed"));
  }
}

export function onAuthChanged(handler) {
  window.addEventListener("auth:changed", handler);
  return () => window.removeEventListener("auth:changed", handler);
}
