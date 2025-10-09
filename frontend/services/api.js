const BASE =
  process.env.local.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function httpGet(path, { headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, { headers, cache: "no-store" });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `GET ${path} ${res.status}`);
  }
  return res.json();
}

export async function httpPost(path, body, { headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await safeText(res);
    throw new Error(msg || `POST ${path} ${res.status}`);
  }
  return res.json();
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
