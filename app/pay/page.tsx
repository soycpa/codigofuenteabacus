"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, MessageCircle } from "lucide-react";

export default function PayPage() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { fetch("/api/admin/settings").then(r => r.json()).then(d => setS(d.settings)); }, []);
  if (!s) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  const whatsappLink = "https://wa.me/524451057305?text=Hola,%20acabo%20de%20realizar%20un%20pago%20y%20quiero%20enviar%20el%20comprobante.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 text-white p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/dashboard" className="flex items-center gap-1 text-purple-400 mb-6 hover:text-purple-300 transition"><ArrowLeft size={16}/> Volver</Link>
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-purple-600 to-magenta-600 rounded-2xl mb-4">
            <CreditCard className="mx-auto text-white" size={48} />
          </div>
          <h1 className="font-display text-4xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">ACTIVA TU SUSCRIPCIÓN</h1>
          <p className="text-zinc-400 mt-2">Acceso completo a tus embudos publicados</p>
          <div className="mt-4 inline-block bg-gradient-dark border border-purple-500/30 px-6 py-3 rounded-xl">
            <span className="font-display text-5xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">{s.price}</span>
            <span className="text-zinc-400 ml-1">{s.currency}/mes</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {s.paypalUrl && <a href={s.paypalUrl} target="_blank" className="block bg-[#003087] hover:bg-[#001f5c] rounded-2xl p-5 transition border border-blue-400/20"><div className="font-bold text-xl text-white">💳 Pagar con PayPal</div><div className="text-blue-200 text-sm">Tarjetas internacionales • Pago seguro</div></a>}
          {s.stripeUrl && <a href={s.stripeUrl} target="_blank" className="block bg-[#635BFF] hover:bg-[#4d44d6] rounded-2xl p-5 transition border border-purple-400/20"><div className="font-bold text-xl text-white">💳 Pagar con tarjeta (Stripe)</div><div className="text-purple-100 text-sm">Visa, Mastercard, Amex</div></a>}
          {s.oxxoInfo && <div className="bg-yellow-600/20 border border-yellow-500/40 rounded-2xl p-5"><div className="font-bold text-xl text-yellow-400 mb-2">🏪 Pago en OXXO</div><pre className="whitespace-pre-wrap text-sm text-zinc-200 font-sans">{s.oxxoInfo}</pre></div>}
          {s.transferInfo && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5"><div className="font-bold text-xl text-emerald-400 mb-2">🏦 Transferencia bancaria</div><pre className="whitespace-pre-wrap text-sm text-zinc-200 font-sans">{s.transferInfo}</pre></div>}
          {!s.paypalUrl && !s.stripeUrl && !s.oxxoInfo && !s.transferInfo && <p className="text-center text-zinc-500">El administrador aún no ha configurado los métodos de pago. Contacta a soporte.</p>}
        </div>

        <div className="bg-gradient-dark border border-purple-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <MessageCircle className="text-purple-400 flex-shrink-0 mt-1" size={20} />
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Después del pago</h3>
              <p className="text-zinc-300 text-sm mb-3">Una vez realizado el pago, <span className="font-bold">envía tu comprobante por WhatsApp</span> para activar tu suscripción en menos de 24 horas.</p>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition text-sm">
                <MessageCircle size={16} /> Enviar comprobante vía WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500 space-y-1">
          <p>✓ Pagos 100% seguros</p>
          <p>✓ Acceso inmediato tras activación</p>
          <p>✓ Soporte en español 24/7</p>
        </div>
      </div>
    </div>
  );
}
