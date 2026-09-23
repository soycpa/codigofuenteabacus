import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DEFAULT_LANDING_CONTENT } from "@/lib/landing-defaults";

export const dynamic = "force-dynamic";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  let landing = await prisma.userLanding.findUnique({ where: { userId: user.id } });
  if (!landing) {
    const tpl = await prisma.landingTemplate.findUnique({ where: { themeKey: "azul" } });
    landing = await prisma.userLanding.create({
      data: {
        userId: user.id,
        fullName: user.name || null,
        themeKey: "azul",
        sourceTemplateKey: "azul",
        templateContent: (tpl?.content as any) || (DEFAULT_LANDING_CONTENT as any),
        templateVersion: tpl?.version || 1,
      },
    });
  }
  return NextResponse.json({ landing, username: user.username });
}

const PERSONAL_FIELDS = [
  "fullName","profession","aboutMe","profilePhotoUrl","logoUrl",
  "callPhone","whatsappPhone","contactEmail","city","address",
  "facebookUrl","instagramUrl","tiktokUrl","linkedinUrl","youtubeUrl","websiteUrl",
  "calendlyUrl",
  "customDomain","themeKey","enabled","designVariant",
  "heroImage","familyImage","inspirationImage","scenarioImage","processImage",
] as const;

export async function PATCH(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const { action } = body;

  // Handle template update action
  if (action === "update-template") {
    const existing = await prisma.userLanding.findUnique({ where: { userId: user.id } });
    if (!existing) return NextResponse.json({ error: "Landing no encontrada" }, { status: 404 });

    // Get master template
    const masterTemplate = await prisma.landingTemplate.findUnique({
      where: { themeKey: existing.sourceTemplateKey || "azul" },
      select: { version: true, content: true },
    });

    if (!masterTemplate) return NextResponse.json({ error: "Plantilla maestra no encontrada" }, { status: 404 });

    // Update templateContent and templateVersion
    const updated = await prisma.userLanding.update({
      where: { userId: user.id },
      data: {
        templateContent: masterTemplate.content as any,
        templateVersion: masterTemplate.version,
      },
    });

    return NextResponse.json({ landing: updated, message: "Plantilla actualizada correctamente" });
  }

  // Handle personal field updates
  const data: any = {};
  for (const k of PERSONAL_FIELDS) {
    if (k in body) data[k] = body[k] === "" ? null : body[k];
  }
  if (data.customDomain) {
    data.customDomain = String(data.customDomain).toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
    if (!data.customDomain) data.customDomain = null;
  }
  const existing = await prisma.userLanding.findUnique({ where: { userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Landing no encontrada" }, { status: 404 });
  const updated = await prisma.userLanding.update({ where: { userId: user.id }, data });
  return NextResponse.json({ landing: updated });
}
