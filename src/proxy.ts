import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  if (host.endsWith(`.${rootDomain}`)) {
    const tenantSlug = host.replace(`.${rootDomain}`, "");

    return NextResponse.rewrite(new URL(`/tenants/${tenantSlug}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|media/|[\\w-]+\\.\\w+).*)"],
};
