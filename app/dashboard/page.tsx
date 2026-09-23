"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, LogOut, Edit, Users, ExternalLink, AlertTriangle, CreditCard, Mail, Save, MessageCircle, Shield, Eye, EyeOff, ChevronDown, ChevronUp, Phone } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [funnels, setFunnels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("seguros");
  const [creating, setCreating] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.replace("/login"); }, [status]);
  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/me").then(r => r.json()),
      fetch("/api/funnels").then(r => r.json()),
    ]).then(([m, f]) => { setMe(m.user); setFunnels(f.funnels || []); setLoading(false); });
  }, [status]);

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    const r = await fetch("/api/funnels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, niche }) });
    const d = await r.json();
    if (d.funnel) { setFunnels([d.funnel, ...funnels]); setName(""); }
    setCreating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  const role = (session?.user as any)?.role;
  const subActive = me?.subscriptionActive;
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-emerald-500">MIS EMBUDOS</h1>
            <p className="text-zinc-400 text-sm">{me?.email}</p>
          </div>
          <div className="flex gap-2">
            {role === "admin" && <Link href="/admin" className="px-4 py-2 bg-zinc-800 rounded-lg text-sm">Panel Admin</Link>}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-4 py-2 bg-zinc-800 rounded-lg flex items-center gap-2 text-sm"><LogOut size={16}/> Salir</button>
          </div>
        </div>

        {!subActive && role !== "admin" && (
          <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-400">Suscripción inactiva</h3>
              <p className="text-zinc-300 text-sm mt-1">Puedes crear y editar tus embudos, pero el acceso público está deshabilitado hasta que actives tu suscripción.</p>
            </div>
            <Link href="/pay" className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg flex items-center gap-2"><CreditCard size={16}/> Activar</Link>
          </div>
        )}

        <NotificationEmailCard me={me} setMe={setMe} />
        <WhatsAppNumberCard me={me} setMe={setMe} />
        <IntegrationsPanel me={me} setMe={setMe} />

        <Link href="/dashboard/landing" className="block bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 rounded-xl p-5 mb-6 transition-all">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-white mb-1">🌐 Mi Landing Page Pública</h3>
              <p className="text-white/90 text-sm">Edita tu página personal estilo Linktree: foto, datos, redes sociales, tema y dominio personalizado.</p>
              {me?.username && <p className="text-white/70 text-xs mt-1">URL: marketia.live/agente/{me.username}</p>}
            </div>
            <span className="px-4 py-2 bg-white text-sky-700 rounded-lg font-bold text-sm whitespace-nowrap">Editar →</span>
          </div>
        </Link>

        <div className="bg-zinc-900 rounded-xl p-4 mb-6">
          <h3 className="font-bold mb-3">Crear nuevo embudo</h3>
          <div className="flex flex-wrap gap-2">
            <input placeholder="Nombre del embudo" value={name} onChange={e => setName(e.target.value)} className="flex-1 min-w-[200px] px-4 py-2 bg-black rounded-lg outline-none" />
            <select value={niche} onChange={e => setNiche(e.target.value)} className="px-4 py-2 bg-black rounded-lg outline-none">
              <option value="seguros">Seguros</option>
              <option value="productos">Productos</option>
              <option value="servicios">Servicios</option>
              <option value="coaching">Coaching</option>
              <option value="infoproductos">Infoproductos</option>
              <option value="otro">Otro</option>
            </select>
            <button onClick={create} disabled={creating || !name} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Crear</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {funnels.length === 0 && <p className="text-zinc-500 col-span-full text-center py-12">Sin embudos aún. Crea el primero.</p>}
          {funnels.map(f => (
            <div key={f.id} className="bg-zinc-900 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-display text-xl">{f.name}</h3>
                  <p className="text-zinc-400 text-sm">/{f.slug} • {f.niche}</p>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">{f._count?.prospects ?? 0} prospectos</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link href={`/dashboard/funnels/${f.id}`} className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-sm font-bold flex items-center gap-1"><Edit size={14}/> Editar</Link>
                <Link href={`/dashboard/funnels/${f.id}/prospects`} className="px-3 py-2 bg-zinc-800 rounded-lg text-sm flex items-center gap-1"><Users size={14}/> Prospectos</Link>
                <a href={`/f/${f.slug}`} target="_blank" className="px-3 py-2 bg-zinc-800 rounded-lg text-sm flex items-center gap-1"><ExternalLink size={14}/> Ver embudo</a>
              </div>
              <p className="text-xs text-zinc-500 mt-3 break-all">URL pública: {appUrl}/f/{f.slug}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function IntegrationsPanel({ me, setMe }: { me: any; setMe: (m: any) => void }) {
  const [open, setOpen] = useState(false);
  const [wa, setWa] = useState({ waPhoneNumberId: "", waAccessToken: "", waBusinessId: "", waVerifyToken: "" });
  const [google, setGoogle] = useState({ googleClientId: "", googleClientSecret: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (me) {
      setWa({ waPhoneNumberId: me.waPhoneNumberId || "", waAccessToken: me.waAccessToken || "", waBusinessId: me.waBusinessId || "", waVerifyToken: me.waVerifyToken || "" });
      setGoogle({ googleClientId: me.googleClientId || "", googleClientSecret: me.googleClientSecret || "" });
    }
  }, [me]);

  if (!me) return null;

  const saveSection = async (section: string, data: Record<string, string>) => {
    setSaving(true); setSaved("");
    try {
      const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const d = await r.json();
      if (d.user) { setMe({ ...me, ...d.user }); setSaved(section); setTimeout(() => setSaved(""), 2500); }
    } finally { setSaving(false); }
  };

  const toggleShow = (key: string) => setShowTokens(p => ({ ...p, [key]: !p[key] }));
  const SecretInput = ({ label, value, onChange, field }: { label: string; value: string; onChange: (v: string) => void; field: string }) => (
    <div>
      <label className="text-xs text-zinc-400 mb-1 block">{label}</label>
      <div className="relative">
        <input type={showTokens[field] ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 pr-10 bg-black rounded-lg outline-none border border-zinc-700 focus:border-purple-500 text-white text-sm" />
        <button type="button" onClick={() => toggleShow(field)} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
          {showTokens[field] ? <EyeOff size={14}/> : <Eye size={14}/>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-900 rounded-xl mb-6 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-emerald-400" />
          <h3 className="font-bold text-white">Integraciones API</h3>
        </div>
        {open ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-6">
          {/* WhatsApp Business API */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><MessageCircle size={18} className="text-green-400" /><h4 className="font-bold text-green-300">WhatsApp Business API</h4></div>
            <p className="text-zinc-400 text-xs mb-4">Conecta tu WhatsApp Business para enviar mensajes automáticos a prospectos. Necesitas una cuenta en <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">Meta Business Suite</a>.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <SecretInput label="Phone Number ID" value={wa.waPhoneNumberId} onChange={v => setWa({ ...wa, waPhoneNumberId: v })} field="waPhoneNumberId" />
              <SecretInput label="Business Account ID" value={wa.waBusinessId} onChange={v => setWa({ ...wa, waBusinessId: v })} field="waBusinessId" />
              <SecretInput label="Access Token (Permanente)" value={wa.waAccessToken} onChange={v => setWa({ ...wa, waAccessToken: v })} field="waAccessToken" />
              <SecretInput label="Webhook Verify Token" value={wa.waVerifyToken} onChange={v => setWa({ ...wa, waVerifyToken: v })} field="waVerifyToken" />
            </div>
            <details className="text-xs text-zinc-500 mb-3">
              <summary className="cursor-pointer text-green-400 hover:text-green-300">¿Cómo obtener estas credenciales?</summary>
              <ol className="list-decimal pl-4 mt-2 space-y-1">
                <li>Ve a <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">developers.facebook.com</a> y crea una app tipo &quot;Business&quot;</li>
                <li>Agrega el producto &quot;WhatsApp&quot; a tu app</li>
                <li>En WhatsApp → Configuración de la API, encontrarás el <strong>Phone Number ID</strong> y <strong>WhatsApp Business Account ID</strong></li>
                <li>Genera un <strong>Access Token permanente</strong> en Configuración del sistema → Tokens</li>
                <li>El <strong>Webhook Verify Token</strong> es cualquier texto secreto que tú elijas para verificar webhooks</li>
              </ol>
            </details>
            <button onClick={() => saveSection("wa", wa)} disabled={saving} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-sm flex items-center gap-2 text-white disabled:opacity-50">
              <Save size={14}/> {saved === "wa" ? "✓ Guardado" : "Guardar WhatsApp"}
            </button>
          </div>

          {/* Google OAuth */}
          <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><Shield size={18} className="text-blue-400" /><h4 className="font-bold text-blue-300">Google OAuth (Inicio de sesión)</h4></div>
            <p className="text-zinc-400 text-xs mb-4">Permite que tus prospectos se autentiquen con Google en tu embudo. Necesitas crear un proyecto en <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console</a>.</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <SecretInput label="Client ID" value={google.googleClientId} onChange={v => setGoogle({ ...google, googleClientId: v })} field="googleClientId" />
              <SecretInput label="Client Secret" value={google.googleClientSecret} onChange={v => setGoogle({ ...google, googleClientSecret: v })} field="googleClientSecret" />
            </div>
            <details className="text-xs text-zinc-500 mb-3">
              <summary className="cursor-pointer text-blue-400 hover:text-blue-300">¿Cómo obtener estas credenciales?</summary>
              <ol className="list-decimal pl-4 mt-2 space-y-1">
                <li>Ve a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Cloud Console → Credenciales</a></li>
                <li>Crea un nuevo proyecto si no tienes uno</li>
                <li>Configura la pantalla de consentimiento OAuth</li>
                <li>Crea credenciales → ID de cliente OAuth 2.0</li>
                <li>Tipo de aplicación: &quot;Aplicación web&quot;</li>
                <li>Agrega como URI de redirección autorizado: <code className="bg-black px-1 rounded">https://marketia.live/api/auth/callback/google</code></li>
                <li>Copia el <strong>Client ID</strong> y <strong>Client Secret</strong></li>
              </ol>
            </details>
            <button onClick={() => saveSection("google", google)} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-sm flex items-center gap-2 text-white disabled:opacity-50">
              <Save size={14}/> {saved === "google" ? "✓ Guardado" : "Guardar Google OAuth"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationEmailCard({ me, setMe }: { me: any; setMe: (m: any) => void }) {
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (me) setVal(me.notificationEmail || ""); }, [me]);
  if (!me) return null;
  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notificationEmail: val }) });
      const d = await r.json();
      if (d.user) { setMe({ ...me, notificationEmail: d.user.notificationEmail }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  };
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-magenta-900/20 border border-purple-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-2"><Mail size={18} className="text-purple-400" /><h3 className="font-bold text-white">Notificaciones de prospectos</h3></div>
      <p className="text-zinc-400 text-sm mb-3">Email donde recibirás un aviso cada vez que un prospecto complete tu formulario. Si lo dejas vacío usaremos {me.email}.</p>
      <div className="flex flex-wrap gap-2">
        <input type="email" value={val} onChange={e => setVal(e.target.value)} placeholder={me.email} className="flex-1 min-w-[220px] px-4 py-2 bg-black rounded-lg outline-none border border-purple-500/30 text-white" />
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold flex items-center gap-2 text-white disabled:opacity-50"><Save size={16}/> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}</button>
      </div>
    </div>
  );
}

function WhatsAppNumberCard({ me, setMe }: { me: any; setMe: (m: any) => void }) {
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (me) setVal(me.whatsappNumber || "+524451057305"); }, [me]);
  if (!me) return null;
  const save = async () => {
    if (!val.trim()) return;
    setSaving(true); setSaved(false);
    try {
      const r = await fetch("/api/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ whatsappNumber: val }) });
      const d = await r.json();
      if (d.user) { setMe({ ...me, whatsappNumber: d.user.whatsappNumber }); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { setSaving(false); }
  };
  return (
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-2"><Phone size={18} className="text-green-400" /><h3 className="font-bold text-white">WhatsApp para redirección final</h3></div>
      <p className="text-zinc-400 text-sm mb-3">Número de WhatsApp al que se redirigirá a los prospectos al final del embudo (Paso 19). Incluye código de país (ej: +524451057305).</p>
      <div className="flex flex-wrap gap-2">
        <input type="tel" value={val} onChange={e => setVal(e.target.value)} placeholder="+524451057305" className="flex-1 min-w-[220px] px-4 py-2 bg-black rounded-lg outline-none border border-green-500/30 text-white" />
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center gap-2 text-white disabled:opacity-50"><Save size={16}/> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}</button>
      </div>
    </div>
  );
}