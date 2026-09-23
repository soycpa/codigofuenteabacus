"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, ExternalLink, Globe, Image as ImageIcon, Check } from "lucide-react";

type Landing = any;

const IMAGE_SECTIONS: { key: string; label: string; size: string; desc: string }[] = [
  { key: "profilePhotoUrl", label: "Foto de perfil (avatar redondo)", size: "600 \u00d7 600 px", desc: "Aparece en \"Sobre m\u00ed\" y nav m\u00f3vil. Cuadrada." },
  { key: "logoUrl", label: "Logotipo", size: "400 \u00d7 400 px", desc: "Logo en navegaci\u00f3n y footer. PNG con fondo transparente recomendado." },
  { key: "heroImage", label: "Foto principal del hero", size: "800 \u00d7 1000 px", desc: "Foto vertical del agente, parte derecha del hero." },
  { key: "familyImage", label: "Banner familia / cita destacada", size: "1600 \u00d7 600 px", desc: "Banner horizontal, sale como fondo de la cita azul." },
  { key: "processImage", label: "Imagen \"Beneficios acelerados\"", size: "800 \u00d7 1000 px", desc: "Vertical, secci\u00f3n c\u00f3mo funciona." },
  { key: "inspirationImage", label: "Banner \"Historias que nos inspiran\"", size: "1600 \u00d7 500 px", desc: "Banner horizontal antes de los testimonios." },
];

export default function LandingEditorPage() {
  const { data: session, status } = useSession() || ({} as any);
  const router = useRouter();
  const [landing, setLanding] = useState<Landing | null>(null);
  const [username, setUsername] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updatingTemplate, setUpdatingTemplate] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [masterVersion, setMasterVersion] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/landing/me").then(r => r.json()).then(d => {
      setLanding(d.landing);
      setUsername(d.username);
    });
    // Check for available updates
    fetch("/api/landing/updates").then(r => r.json()).then(d => {
      setUpdateAvailable(d.updateAvailable || false);
      setCurrentVersion(d.currentVersion || 0);
      setMasterVersion(d.masterVersion || 0);
    });
  }, [status]);

  function setField(k: string, v: any) {
    setLanding((prev: any) => ({ ...prev, [k]: v }));
  }

  async function uploadImage(key: string, file: File) {
    setUploadingKey(key);
    try {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `landing/${key}-${Date.now()}-${safe}`;
      const presign = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, contentType: file.type }),
      }).then(r => r.json());
      if (!presign.uploadUrl) throw new Error(presign.error || "Error");
      const put = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("Error subiendo a almacenamiento");
      setField(key, presign.publicUrl);
    } catch (e: any) {
      alert("Error subiendo imagen: " + (e?.message || e));
    } finally {
      setUploadingKey(null);
    }
  }

  async function updateTemplate() {
    setUpdatingTemplate(true);
    try {
      const res = await fetch("/api/landing/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-template" }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Error");
      setLanding(d.landing);
      setUpdateAvailable(false);
      setCurrentVersion(masterVersion);
      alert("¡Plantilla actualizada correctamente!");
    } catch (e: any) {
      alert("Error al actualizar: " + (e?.message || e));
    } finally {
      setUpdatingTemplate(false);
    }
  }

  async function save() {
    if (!landing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/landing/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(landing),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Error");
      setLanding(d.landing);
      setSavedAt(Date.now());
    } catch (e: any) {
      alert("Error: " + (e?.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (!landing) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando...</div>;
  }

  const publicUrl = `/agente/${username}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/70 border-b border-purple-500/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-purple-300 hover:text-white text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/landing/leads" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30">
              📊 Leads
            </Link>
            <Link href={publicUrl} target="_blank" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20">
              <ExternalLink className="w-3.5 h-3.5" /> Ver mi landing
            </Link>
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 font-bold text-sm disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
        {savedAt && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Cambios guardados
            </div>
          </div>
        )}
      </div>

      {updateAvailable && (
        <div className="bg-sky-500/20 border-t border-sky-500/30">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sky-300 text-sm">
                🔄 Actualización disponible: v{currentVersion} → v{masterVersion}
              </span>
            </div>
            <button
              onClick={updateTemplate}
              disabled={updatingTemplate}
              className="text-xs px-4 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded font-bold"
            >
              {updatingTemplate ? "Actualizando..." : "Descargar actualización"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Mi Landing Page</h1>
          <p className="text-white/60 text-sm mt-2">URL p\u00fablica: <span className="text-purple-300">marketia.live{publicUrl}</span></p>
        </div>

        {/* Diseño */}
        <Card title="🎨 Diseño de la landing" desc="Elige uno de los 4 estilos. Tu información, fotos y colores se mantienen al cambiar de diseño.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { k: "clasico", name: "Clásico", emoji: "🏛️", desc: "Profesional con todas las secciones organizadas." },
              { k: "moderno", name: "Moderno", emoji: "⚡", desc: "Estilo oscuro con tipografía grande." },
              { k: "minimal", name: "Minimal", emoji: "🌿", desc: "Una columna limpia, estilo Linktree." },
              { k: "elegante", name: "Elegante", emoji: "📰", desc: "Estilo revista con tipografía serif." },
            ].map(d => {
              const active = ((landing as any).designVariant || "clasico") === d.k;
              return (
                <button key={d.k} onClick={() => setField("designVariant" as any, d.k)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${active ? "border-purple-400 bg-purple-500/15 scale-[1.01]" : "border-white/20 hover:border-white/40 bg-white/[0.03]"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{d.emoji}</span>
                    <span className="font-bold">{d.name}</span>
                    {active && <span className="ml-auto text-[10px] uppercase tracking-widest bg-purple-500 text-white px-2 py-0.5 rounded-full">Activo</span>}
                  </div>
                  <div className="text-xs text-white/60">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Tema */}
        <Card title="Tema visual" desc="Elige los colores de tu landing.">
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "azul", name: "Azul Profesional", c: "#0EA5E9" },
              { k: "verde", name: "Verde Confianza", c: "#10B981" },
              { k: "rojo", name: "Rojo Energ\u00eda", c: "#EF4444" },
            ].map(t => (
              <button key={t.k} onClick={() => setField("themeKey", t.k)}
                className={`p-4 rounded-xl border-2 transition-all ${landing.themeKey === t.k ? "border-white scale-105" : "border-white/20 hover:border-white/40"}`}
                style={{ background: t.c + "22" }}>
                <div className="w-full h-10 rounded-lg mb-2" style={{ background: t.c }} />
                <div className="text-xs font-semibold">{t.name}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Datos personales */}
        <Card title="Datos personales" desc="Estos datos NO se sobreescriben al actualizar la plantilla maestra.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Nombre completo" value={landing.fullName || ""} onChange={v => setField("fullName", v)} />
            <Input label="Profesi\u00f3n / T\u00edtulo" value={landing.profession || ""} onChange={v => setField("profession", v)} />
            <Input label="Tel\u00e9fono (bot\u00f3n llamar)" value={landing.callPhone || ""} onChange={v => setField("callPhone", v)} placeholder="+524451057305" />
            <Input label="WhatsApp" value={landing.whatsappPhone || ""} onChange={v => setField("whatsappPhone", v)} placeholder="+524451057305" />
            <Input label="Email de contacto" value={landing.contactEmail || ""} onChange={v => setField("contactEmail", v)} />
            <Input label="Ciudad" value={landing.city || ""} onChange={v => setField("city", v)} />
            <Input label="Direcci\u00f3n" value={landing.address || ""} onChange={v => setField("address", v)} className="md:col-span-2" />
          </div>
          <div className="mt-3">
            <label className="block text-xs font-semibold text-purple-300 mb-1">Sobre m\u00ed</label>
            <textarea rows={5}
              value={landing.aboutMe || ""} onChange={e => setField("aboutMe", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-purple-500/30 text-sm focus:border-purple-400 outline-none" />
          </div>
        </Card>

        {/* Redes */}
        <Card title="Redes sociales" desc="Aparecen en el footer. D\u00e9jalas vac\u00edas si no aplican.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Facebook URL" value={landing.facebookUrl || ""} onChange={v => setField("facebookUrl", v)} />
            <Input label="Instagram URL" value={landing.instagramUrl || ""} onChange={v => setField("instagramUrl", v)} />
            <Input label="TikTok URL" value={landing.tiktokUrl || ""} onChange={v => setField("tiktokUrl", v)} />
            <Input label="LinkedIn URL" value={landing.linkedinUrl || ""} onChange={v => setField("linkedinUrl", v)} />
            <Input label="YouTube URL" value={landing.youtubeUrl || ""} onChange={v => setField("youtubeUrl", v)} />
            <Input label="Sitio web" value={landing.websiteUrl || ""} onChange={v => setField("websiteUrl", v)} />
            <Input label="🗓️ URL de Calendly (para agendar citas)" value={landing.calendlyUrl || ""} onChange={v => setField("calendlyUrl", v)} placeholder="https://calendly.com/tu-usuario" />
          </div>
        </Card>

        {/* Imagenes */}
        <Card title="Im\u00e1genes de la landing" desc="Sube tus propias im\u00e1genes con los tama\u00f1os recomendados para que se vean perfectas.">
          <div className="space-y-4">
            {IMAGE_SECTIONS.map(sec => (
              <div key={sec.key} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-black/40 border border-purple-500/20">
                <div className="w-full md:w-44 h-32 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {landing[sec.key] ? (
                    <img src={landing[sec.key]} alt={sec.label} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white/20" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{sec.label}</div>
                  <div className="text-xs text-purple-300 mt-0.5">Tama\u00f1o recomendado: <b>{sec.size}</b></div>
                  <div className="text-xs text-white/50 mt-1">{sec.desc}</div>
                  <div className="flex items-center gap-2 mt-3">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-xs cursor-pointer hover:bg-purple-500/30">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingKey === sec.key ? "Subiendo..." : "Subir imagen"}
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(sec.key, f); }}
                        disabled={uploadingKey === sec.key} />
                    </label>
                    {landing[sec.key] && (
                      <button onClick={() => setField(sec.key, "")} className="text-xs text-red-300 hover:text-red-200">Quitar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Dominio */}
        <CustomDomainCard
          landing={landing}
          setField={setField}
        />

        {/* Estado */}
        <Card title="Estado de la landing" desc="">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={landing.enabled !== false} onChange={e => setField("enabled", e.target.checked)} className="w-5 h-5" />
            <span className="text-sm">Landing activa y p\u00fablica</span>
          </label>
        </Card>

        <div className="sticky bottom-4 flex justify-end">
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 font-bold shadow-2xl shadow-purple-500/40 disabled:opacity-50">
            <Save className="w-5 h-5" /> {saving ? "Guardando..." : "Guardar todos los cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-black/40 border border-purple-500/30 p-5 md:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {desc && <p className="text-xs text-white/50 mt-0.5 mb-4">{desc}</p>}
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-purple-300 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-purple-500/30 text-sm focus:border-purple-400 outline-none" />
    </div>
  );
}

function CustomDomainCard({ landing, setField }: { landing: any; setField: (k: string, v: any) => void }) {
  const [verifying, setVerifying] = React.useState(false);
  const [verifyResult, setVerifyResult] = React.useState<any>(null);

  async function verifyDomain() {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch("/api/landing/verify-domain");
      const d = await res.json();
      setVerifyResult(d);
    } catch (e: any) {
      setVerifyResult({ error: e?.message || "Error" });
    } finally {
      setVerifying(false);
    }
  }

  const domain = landing.customDomain || "";
  const godaddyUrl = domain
    ? `https://dcc.godaddy.com/control/portfolio/${encodeURIComponent(domain)}/settings?subtab=dns`
    : "https://dcc.godaddy.com/control/dnsmanagement";

  return (
    <Card title="🌐 Dominio personalizado" desc="Opcional. Apunta tu propio dominio (ej: miagencia.com) a tu landing page.">
      <Input
        label="Tu dominio (sin https://)"
        value={domain}
        onChange={v => setField("customDomain", v)}
        placeholder="ej: miagencia.com o www.miagencia.com"
      />

      {domain && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={verifyDomain}
            disabled={verifying}
            className="text-xs px-3 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-bold disabled:opacity-50"
          >
            {verifying ? "Verificando DNS..." : "🔍 Verificar configuración DNS"}
          </button>
          <a
            href={godaddyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold flex items-center gap-1"
          >
            ⚡ Abrir DNS en GoDaddy
          </a>
        </div>
      )}

      {verifyResult && (
        <div
          className={`mt-3 p-3 rounded-lg text-xs ${
            verifyResult.configured
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"
              : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-200"
          }`}
        >
          <div className="font-bold mb-1">{verifyResult.message}</div>
          {verifyResult.cnameRecords?.length > 0 && (
            <div>Registro CNAME actual: <code className="bg-black/40 px-1 rounded">{verifyResult.cnameRecords.join(", ")}</code></div>
          )}
          {verifyResult.aRecords?.length > 0 && (
            <div>Registro A actual: <code className="bg-black/40 px-1 rounded">{verifyResult.aRecords.join(", ")}</code></div>
          )}
        </div>
      )}

      {/* Instrucciones GoDaddy */}
      <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-white/80 space-y-3">
        <div className="flex items-center gap-2 font-bold text-purple-300">
          <Globe className="w-4 h-4" /> Cómo configurar tu dominio en GoDaddy (paso a paso)
        </div>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Haz clic en <a href={godaddyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline font-bold">⚡ Abrir DNS en GoDaddy</a> (te lleva directo a la sección de DNS de tu dominio).
          </li>
          <li>Inicia sesión con tu cuenta de GoDaddy si no estás logueado.</li>
          <li>Una vez en la página de DNS, busca el botón <b>"Agregar nuevo registro"</b> (Add New Record).</li>
          <li>
            <b>Para subdominios</b> (ej: <code>www.miagencia.com</code>) crea un registro <b>CNAME</b>:
            <div className="mt-1 ml-4 bg-black/40 rounded p-2 font-mono text-[11px]">
              <div>Tipo: <span className="text-emerald-300">CNAME</span></div>
              <div>Nombre: <span className="text-emerald-300">www</span> (o el subdominio que quieras)</div>
              <div>Valor: <span className="text-emerald-300">marketia.live</span></div>
              <div>TTL: <span className="text-emerald-300">1 hora</span> (3600)</div>
            </div>
          </li>
          <li>
            <b>Para dominio raíz</b> (ej: <code>miagencia.com</code> sin www) usa un registro <b>A</b>:
            <div className="mt-1 ml-4 bg-black/40 rounded p-2 font-mono text-[11px]">
              <div>Tipo: <span className="text-emerald-300">A</span></div>
              <div>Nombre: <span className="text-emerald-300">@</span></div>
              <div>Valor: <span className="text-yellow-300">contáctanos por WhatsApp para la IP actual</span></div>
              <div>TTL: <span className="text-emerald-300">1 hora</span> (3600)</div>
            </div>
            <div className="mt-1 ml-4 text-white/60 italic">💡 Recomendado: usa <b>www.miagencia.com</b> con CNAME (más fácil y estable).</div>
          </li>
          <li>Guarda el registro. La propagación puede tardar entre 15 minutos y 24 horas.</li>
          <li>Escribe arriba el dominio exacto (ej: <code>www.miagencia.com</code>) y haz clic en <b>Guardar</b>.</li>
          <li>Usa el botón <b>🔍 Verificar configuración DNS</b> para confirmar que el dominio está apuntando correctamente.</li>
        </ol>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-yellow-200 text-[11px]">
          ⚠️ <b>Importante:</b> Una vez verificado el DNS, tu landing estará disponible en tu dominio personalizado en pocos minutos. Si necesitas ayuda, escríbenos por WhatsApp.
        </div>
      </div>
    </Card>
  );
}
