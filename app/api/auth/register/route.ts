import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

// Función para generar username único basado en el email
async function generateUsername(baseEmail: string): Promise<string> {
  let username = baseEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 20);
  let candidate = username;
  let counter = 1;

  while (await prisma.user.findFirst({ where: { username: candidate } })) {
    candidate = `${username}-${counter++}`;
  }

  return candidate;
}

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Contraseña muy corta" }, { status: 400 });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email ya registrado" }, { status: 400 });
    
    const hashed = await bcrypt.hash(password, 10);
    const generatedUsername = await generateUsername(email);
    const user = await prisma.user.create({ 
      data: { 
        email, 
        password: hashed, 
        name: name || null,
        username: generatedUsername,
        role: "user", 
        subscriptionActive: false 
      } 
    });

    // Crear embudo clonado del embudo de Onofre (snapshot automático)
    try {
      const onofre = await prisma.user.findUnique({
        where: { email: "admin@onofrelopez.com" },
        include: { funnels: { take: 1 } },
      });

      if (onofre && onofre.funnels.length > 0) {
        const onefreFunnel = onofre.funnels[0];
        
        // Crear slug único basado en el username
        let slug = generatedUsername;
        let counter = 1;
        while (await prisma.funnel.findUnique({ where: { slug } })) {
          slug = `${generatedUsername}-${counter++}`;
        }

        // Clonar el embudo de Onofre
        await prisma.funnel.create({
          data: {
            userId: user.id,
            slug,
            name: onefreFunnel.name,
            niche: onefreFunnel.niche,
            config: onefreFunnel.config as any, // Copia de la configuración actual
            modules: onefreFunnel.modules as any, // Copia de los módulos activos
          },
        });
      }
    } catch (e) {
      console.error("Error clonando embudo de Onofre:", e);
    }

    // Clonar landing de Onofre (UserLanding) - solo plantilla y tema, datos personales vacíos
    try {
      const onofreUser = await prisma.user.findUnique({ where: { email: "admin@onofrelopez.com" } });
      if (onofreUser) {
        const onofreLanding = await prisma.userLanding.findUnique({ where: { userId: onofreUser.id } });
        const tpl = await prisma.landingTemplate.findUnique({ where: { themeKey: "azul" } });
        if (tpl) {
          await prisma.userLanding.create({
            data: {
              userId: user.id,
              fullName: name || null,
              profession: "Agente de Seguros",
              aboutMe: onofreLanding?.aboutMe || null,
              themeKey: "azul",
              sourceTemplateKey: "azul",
              templateContent: tpl.content as any,
              templateVersion: tpl.version,
            },
          });
        }
      }
    } catch (e) {
      console.error("Error creando landing del usuario:", e);
    }

    // Enviar email bienvenida (best-effort)
    try {
      const appUrl = process.env.NEXTAUTH_URL || "";
      const host = appUrl ? new URL(appUrl).hostname : "app";
      await fetch("https://apps.abacus.ai/api/sendNotificationEmail", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_BIENVENIDA_A_PROSPECCIN_MAGNTICA,
          subject: "¡Bienvenido a Marketia!",
          is_html: true,
          body: `<div style="font-family:Arial;max-width:600px;margin:0 auto;background:#000;color:#fff;padding:24px;border-radius:8px"><h1 style="color:#22C55E">¡Bienvenido${name ? ", " + name : ""}!</h1><p>Tu cuenta en Marketia ha sido creada exitosamente.</p><p>Para activar tu embudo necesitas completar el pago de tu suscripción.</p><p><a href="${appUrl}/login" style="background:#22C55E;color:#000;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold">INGRESAR A MI CUENTA</a></p><p style="color:#888;font-size:12px;margin-top:24px">Soporte: soporte@marketia.live</p></div>`,
          recipient_email: email,
          sender_email: `noreply@${host}`,
          reply_to: "soporte@marketia.live",
          sender_alias: "Marketia",
        }),
      });
    } catch (e) { console.error("welcome email error", e); }

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (e: any) { return NextResponse.json({ error: e?.message ?? "Error" }, { status: 500 }); }
}
