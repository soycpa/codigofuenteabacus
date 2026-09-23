import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXTAUTH_URL || "https://marketia.live";
}

export default function robots(): MetadataRoute.Robots {
  const url = baseUrl();
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/funnel", "/embudo", "/login", "/signup"], disallow: ["/api/", "/dashboard", "/admin", "/funnel/admin"] },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
