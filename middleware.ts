import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hostnames principales (no son dominios personalizados)
const PRIMARY_HOSTS = new Set<string>([
  "marketia.live",
  "www.marketia.live",
  "embudo-onofre-lopez-ee3cas.abacusai.app",
  "localhost:3000",
  "localhost",
]);

export function middleware(req: NextRequest) {
  // En producción el reverse proxy pone el dominio real en x-forwarded-host
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const url = req.nextUrl.clone();
  const cleanHost = host.replace(/^www\./, "").replace(/:\d+$/, "");

  // Si es un dominio principal o el preview de Abacus, no hacer nada
  if (
    PRIMARY_HOSTS.has(host) ||
    PRIMARY_HOSTS.has(cleanHost) ||
    host.endsWith(".abacusai.app") ||
    host.startsWith("localhost")
  ) {
    return NextResponse.next();
  }

  // Es un dominio personalizado: reescribir a /custom/[host]
  // Solo en el root path o subpaths de la landing
  const path = url.pathname;

  // No interceptar rutas internas o assets
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.match(/\.[a-z0-9]+$/i)
  ) {
    return NextResponse.next();
  }

  // Reescribir a /custom/[domain]
  url.pathname = `/custom/${cleanHost}${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
