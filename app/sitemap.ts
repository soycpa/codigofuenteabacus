import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function baseUrl(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXTAUTH_URL || "https://marketia.live";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = baseUrl();
  const now = new Date();
  const items: MetadataRoute.Sitemap = [
    { url: `${url}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${url}/funnel`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${url}/embudo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${url}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${url}/signup`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
  try {
    const users = await prisma.user.findMany({ where: { username: { not: null }, deletedAt: null }, select: { username: true, createdAt: true } });
    for (const u of users) {
      if (u.username) items.push({ url: `${url}/embudo/${u.username}`, lastModified: u.createdAt || now, changeFrequency: "weekly", priority: 0.7 });
    }
  } catch (e) { console.error("sitemap users", e); }
  return items;
}
