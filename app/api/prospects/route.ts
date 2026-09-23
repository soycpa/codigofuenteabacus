import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function notifyOwner(funnelId: string | null, prospect: { nombre: string; email: string; whatsapp: string }) {
  try {
    if (!funnelId) return;
    const funnel = await prisma.funnel.findUnique({ where: { id: funnelId }, include: { user: true } });
    if (!funnel?.user) return;
    const recipient = funnel.user.notificationEmail || funnel.user.email;
    if (!recipient) return;
    const appUrl = process.env.NEXTAUTH_URL || "";
    const host = appUrl ? new URL(appUrl).hostname : "mail.abacusai.app";
    await fetch("https://apps.abacus.ai/api/sendNotificationEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_NUEVO_PROSPECTO_CAPTURADO,
        subject: `🔥 Nuevo prospecto: ${prospect.nombre}`,
        is_html: true,
        body: `<div style="font-family:Arial;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:24px;border-radius:8px"><h1 style="color:#a855f7">¡Nuevo prospecto capturado!</h1><p>Acaba de registrarse un prospecto en tu embudo <b>${funnel.name}</b>.</p><table style="width:100%;border-collapse:collapse;margin:16px 0"><tr><td style="padding:8px;border-bottom:1px solid #333"><b>Nombre:</b></td><td style="padding:8px;border-bottom:1px solid #333">${prospect.nombre}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #333"><b>Email:</b></td><td style="padding:8px;border-bottom:1px solid #333">${prospect.email}</td></tr><tr><td style="padding:8px;border-bottom:1px solid #333"><b>WhatsApp:</b></td><td style="padding:8px;border-bottom:1px solid #333">${prospect.whatsapp}</td></tr></table><p><a href="${appUrl}/dashboard" style="background:#a855f7;color:#fff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">VER EN DASHBOARD</a></p></div>`,
        recipient_email: recipient,
        sender_email: `noreply@${host}`,
        reply_to: "soporte@marketia.live",
        sender_alias: "Marketia",
      }),
    });
  } catch (e) { console.error("notify owner error", e); }
}

export async function POST(req: Request) {
  try {
    const { nombre, email, whatsapp, pasoActual, funnelId } = await req.json();
    if (!nombre || !email || !whatsapp) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    const where = funnelId ? { email, funnelId } : { email };
    const existing = await prisma.prospect.findFirst({ where });
    let prospect; let isNew = false;
    if (existing) {
      prospect = await prisma.prospect.update({ where: { id: existing.id }, data: { nombre, whatsapp, pasoActual: pasoActual ?? existing.pasoActual } });
    } else {
      prospect = await prisma.prospect.create({ data: { nombre, email, whatsapp, pasoActual: pasoActual ?? 6, funnelId: funnelId ?? null } });
      isNew = true;
    }
    if (isNew) { notifyOwner(funnelId ?? null, { nombre, email, whatsapp }).catch(() => {}); }
    return NextResponse.json({ id: prospect.id });
  } catch (e: any) { return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const { id, pasoActual } = await req.json();
    if (!id || typeof pasoActual !== "number") return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    await prisma.prospect.update({ where: { id }, data: { pasoActual } });
    return NextResponse.json({ ok: true });
  } catch (e: any) { return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 }); }
}
