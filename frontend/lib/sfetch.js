import { cookies } from "next/headers";

export async function sfetch(path) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api${path}`, {
    headers: { cookie: cookies().toString() },
    cache: "no-store",
  });
  if (!r.ok) return null;
  return r.json();
}
