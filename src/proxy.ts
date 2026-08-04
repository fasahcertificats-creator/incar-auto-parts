import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getLocaleFromPathname } from "@/i18n/routing";

export function proxy(request: NextRequest) {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  if (!locale) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-incar-locale", locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set("incar-locale", locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
