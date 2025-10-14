import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/admin")) {
    const meRes = await fetch(new URL("/api/auth/me", req.url), {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });

    if (!meRes.ok) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    let me = null;
    try {
      me = await meRes.json();
    } catch {
      me = null;
    }

    const role =
      (me &&
        (me.role || me.user?.role || me.data?.role || me.data?.user?.role)) ||
      null;

    if (role !== "admin") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
