const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL no está definido");

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function httpGet(path, { headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    cache: "no-store",
    headers,
  });
  if (!res.ok)
    throw new Error((await safeText(res)) || `GET ${path} ${res.status}`);
  return res.json();
}

export async function httpPost(path, body, { headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error((await safeText(res)) || `POST ${path} ${res.status}`);
  return res.json();
}
