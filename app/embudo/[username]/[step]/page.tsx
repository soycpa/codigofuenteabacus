import FunnelStep from "@/app/step/[id]/funnel-step";
import { FunnelProvider } from "@/lib/funnel-context";
import { prisma } from "@/lib/db";
import { ALL_MODULES } from "@/config/funnel-config";
import Link from "next/link";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function PublicUserFunnelStep({ params }: { params: { username: string; step: string } }) {
  // Buscar usuario por username
  const user = await prisma.user.findFirst({
    where: { username: params.username },
    select: { id: true, username: true, subscriptionActive: true, role: true, whatsappNumber: true },
  });

  if (!user) {
    return notFound();
  }

  // Obtener el primer embudo del usuario
  const funnel = await prisma.funnel.findFirst({
    where: { userId: user.id },
  });

  if (!funnel) {
    return notFound();
  }

  // Verificar si la suscripción está activa
  const subActive = user.subscriptionActive || user.role === "admin";
  if (!subActive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/30 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-3xl text-yellow-500 mb-2">Embudo temporalmente fuera de servicio</h1>
        <p className="text-white/70 max-w-md">Este embudo no está disponible en este momento. Si eres el propietario, activa tu suscripción.</p>
        <Link href="/login" className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 rounded-lg font-bold text-white transition">
          Ingresar a mi cuenta
        </Link>
      </div>
    );
  }

  const id = parseInt(params.step, 10);
  const safeId = isNaN(id) || id < 1 || id > 19 ? 1 : id; // Updated to support 19 steps
  const config = (funnel.config as any) || {};
  const modules = (funnel.modules as any) || ALL_MODULES;

  return (
    <FunnelProvider config={config} modules={modules} funnelId={funnel.id} funnelSlug={funnel.slug} userWhatsappNumber={user.whatsappNumber}>
      <FunnelStep stepId={safeId} basePath={`/embudo/${user.username}`} />
    </FunnelProvider>
  );
}