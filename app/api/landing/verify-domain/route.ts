import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const landing = await prisma.userLanding.findUnique({
      where: { userId: session.user.id },
      select: { customDomain: true },
    });

    if (!landing?.customDomain) {
      return NextResponse.json({ configured: false, message: "No hay dominio configurado" });
    }

    const domain = landing.customDomain;
    const expectedTarget = "marketia.live";
    let cnameRecords: string[] = [];
    let aRecords: string[] = [];
    let configured = false;
    let message = "";

    try {
      const cnames = await dns.resolveCname(domain);
      cnameRecords = cnames;
      if (cnames.some(c => c.toLowerCase().includes("marketia.live") || c.toLowerCase().includes("abacusai.app"))) {
        configured = true;
        message = "✅ DNS configurado correctamente. Tu dominio está apuntando a Marketia.";
      }
    } catch {
      // No CNAME, intentar A
      try {
        const as = await dns.resolve4(domain);
        aRecords = as;
      } catch {}
    }

    if (!configured) {
      message = "❌ El dominio aún no está apuntando a marketia.live. Verifica que el registro CNAME esté configurado correctamente.";
    }

    return NextResponse.json({
      configured,
      domain,
      expectedTarget,
      cnameRecords,
      aRecords,
      message,
    });
  } catch (error: any) {
    console.error("Error verifying domain:", error);
    return NextResponse.json({ error: error?.message || "Error interno" }, { status: 500 });
  }
}
