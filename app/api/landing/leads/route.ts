import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Get user's landing
    const userLanding = await prisma.userLanding.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!userLanding) {
      return NextResponse.json({ leads: [] });
    }

    // Get all leads for this landing, ordered by newest first
    const leads = await prisma.landingLead.findMany({
      where: { userLandingId: userLanding.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        genero: true,
        fechaNacimiento: true,
        fuma: true,
        estado: true,
        pagoDeseado: true,
        email: true,
        whatsapp: true,
        telefono: true,
        mensaje: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { landingId, nombre, apellido, genero, fechaNacimiento, fuma, estado, pagoDeseado, email, whatsapp, telefono, mensaje } = body || {};
    if (!landingId || !nombre) {
      return NextResponse.json({ error: "Datos requeridos" }, { status: 400 });
    }
    const landing: any = await (prisma as any).userLanding.findUnique({
      where: { id: landingId },
      include: { user: { select: { email: true, notificationEmail: true, name: true } } },
    });
    if (!landing) return NextResponse.json({ error: "Landing no encontrada" }, { status: 404 });

    const s = (v: any, max: number) => v ? String(v).slice(0, max) : null;
    const lead = await prisma.landingLead.create({
      data: {
        userLandingId: landingId,
        nombre: String(nombre).slice(0, 200),
        apellido: s(apellido, 200),
        genero: s(genero, 50),
        fechaNacimiento: s(fechaNacimiento, 50),
        fuma: s(fuma, 10),
        estado: s(estado, 100),
        pagoDeseado: s(pagoDeseado, 50),
        email: s(email, 200),
        whatsapp: s(whatsapp, 50),
        telefono: s(telefono, 50),
        mensaje: s(mensaje, 2000),
      },
    });

    try {
      const recipient = landing.user?.notificationEmail || landing.user?.email;
      const notifId = process.env.NOTIF_ID_NUEVO_PROSPECTO_CAPTURADO;
      if (recipient && notifId) {
        await fetch("https://apps.abacus.ai/api/sendNotificationEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notification_id: notifId,
            recipient_email: recipient,
            subject: "Nuevo prospecto desde tu landing: " + nombre,
            body_html:
              "<h2>Nuevo prospecto</h2>" +
              "<p><b>Nombre:</b> " + nombre + (apellido ? " " + apellido : "") + "</p>" +
              (genero ? "<p><b>Género:</b> " + genero + "</p>" : "") +
              (fechaNacimiento ? "<p><b>Fecha Nac.:</b> " + fechaNacimiento + "</p>" : "") +
              (fuma ? "<p><b>¿Fuma?:</b> " + fuma + "</p>" : "") +
              (estado ? "<p><b>Estado:</b> " + estado + "</p>" : "") +
              (pagoDeseado ? "<p><b>Pago deseado:</b> $" + pagoDeseado + "/mes</p>" : "") +
              (email ? "<p><b>Email:</b> " + email + "</p>" : "") +
              (whatsapp ? "<p><b>WhatsApp:</b> " + whatsapp + "</p>" : "") +
              (telefono ? "<p><b>Teléfono:</b> " + telefono + "</p>" : "") +
              (mensaje ? "<p><b>Mensaje:</b> " + mensaje + "</p>" : ""),
          }),
        });
      }
    } catch (e) { console.error("notify error", e); }

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
