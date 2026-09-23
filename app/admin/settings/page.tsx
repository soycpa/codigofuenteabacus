"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, DollarSign } from "lucide-react";

export default function AdminSettings() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [s, setS] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.replace("/dashboard");
    if (status === "unauthenticated") router.replace("/login");
  }, [status, session]);

  useEffect(() => {
    fetch("/api/admin/settings").then(r => r.json()).then(d => setS(d.settings));
  }, []);

  const save = async () => {
    setSaving(true); setSaved(false);
    const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, price: parseFloat(s.price) }) });
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  if (!s) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  const F = ({ label, k, type = "text", placeholder = "" }: any) => (
    <div className="mb-3">
      <label className="block text-sm text-zinc-400 mb-1">{label}</label>
      {type === "textarea"
        ? <textarea value={s[k] || ""} onChange={e => setS({ ...s, [k]: e.target.value })} placeholder={placeholder} rows={3} className="w-full px-3 py-2 bg-black rounded-lg outline-none text-sm" />
        : <input type={type} value={s[k] ?? ""} onChange={e => setS({ ...s, [k]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2 bg-black rounded-lg outline-none text-sm" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/admin" className="flex items-center gap-1 text-zinc-400"><ArrowLeft size={16}/> Volver</Link>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold flex items-center gap-2"><Save size={16}/> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}</button>
        </div>
        <h1 className="font-display text-3xl text-emerald-500 mb-6">CONFIGURACIÓN GLOBAL</h1>

        <div className="bg-zinc-900 rounded-xl p-5 mb-4">
          <h3 className="font-bold flex items-center gap-2 mb-3"><DollarSign size={18}/> Precio de suscripción</h3>
          <div className="grid grid-cols-2 gap-3">
            <F label="Precio" k="price" type="number" />
            <F label="Moneda" k="currency" placeholder="USD" />
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl p-5 mb-4">
          <h3 className="font-bold mb-3">Enlaces de pago</h3>
          <p className="text-zinc-400 text-sm mb-3">Coloca los enlaces o instrucciones que vean tus usuarios al pagar. Vacío = ocultar opción.</p>
          <F label="Enlace PayPal" k="paypalUrl" type="url" placeholder="https://paypal.me/tucuenta/15" />
          <F label="Enlace Stripe (payment link)" k="stripeUrl" type="url" placeholder="https://buy.stripe.com/xxx" />
          <F label="Instrucciones OXXO" k="oxxoInfo" type="textarea" placeholder="Referencia: 1234... / Cantidad: 300 MXN..." />
          <F label="Datos de transferencia" k="transferInfo" type="textarea" placeholder="BBVA / Cuenta: ... / CLABE: ... / A nombre de: ..." />
        </div>

        <div className="bg-zinc-800/50 rounded-xl p-4 text-sm text-zinc-400">
          <p>Después del pago, debes <b>activar manualmente la suscripción</b> del usuario desde el panel <Link href="/admin" className="text-emerald-400">Usuarios</Link>.</p>
        </div>
      </div>
    </div>
  );
}
