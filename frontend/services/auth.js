const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function me() {
  const res = await fetch(`${BASE}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) return null; // no autenticado
  const data = await res.json();
  return data?.user || null;
}

export async function register(email, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
