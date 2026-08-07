import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Debe coincidir con NOMBRE_COOKIE_ACCESO del backend. */
const COOKIE_ACCESO = "ctp27_access_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tieneSesion = Boolean(request.cookies.get(COOKIE_ACCESO)?.value);

  const esLogin = pathname === "/login";
  const esProtegida =
    pathname.startsWith("/dashboard") || pathname.startsWith("/inventario");

  if (esLogin && tieneSesion) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (esProtegida && !tieneSesion) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/inventario/:path*"],
};
