import FunnelStep from "@/app/step/[id]/funnel-step";
import { FunnelProvider } from "@/lib/funnel-context";
import { prisma } from "@/lib/db";
import { ALL_MODULES } from "@/config/funnel-config";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function PublicFunnelStep({ params }: { params: { slug: string; step: string } }) {
  const funnel = await prisma.funnel.findUnique({
    where: { slug: params.slug },
    include: { user: { select: { subscriptionActive: true, role: true, whatsappNumber: true } } },
  });

  if (!funnel) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-3xl text-emerald-500">Embudo no encontrado</h1>
        <p className="text-zinc-400 mt-2">La URL que ingresaste no existe.</p>
      </div>
    );
  }

  const subActive = funnel.user.subscriptionActive || funnel.user.role === "admin";
  if (!subActive) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-3xl text-yellow-500 mb-2">Embudo temporalmente fuera de servicio</h1>
        <p className="text-zinc-400 max-w-md">Este embudo no está disponible en este momento. Si eres el propietario, activa tu suscripción.</p>
        <Link href="/login" className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg font-bold">Ingresar a mi cuenta</Link>
      </div>
    );
  }

  const id = parseInt(params.step, 10);
  const safeId = isNaN(id) || id < 1 || id > 19 ? 1 : id; // Updated to support 19 steps
  const config = (funnel.config as any) || {};
  const modules = (funnel.modules as any) || ALL_MODULES;

  return (
    <FunnelProvider config={config} modules={modules} funnelId={funnel.id} funnelSlug={funnel.slug} userWhatsappNumber={funnel.user.whatsappNumber}>
      <FunnelStep stepId={safeId} basePath={`/f/${funnel.slug}`} />
    </FunnelProvider>
  );
}
