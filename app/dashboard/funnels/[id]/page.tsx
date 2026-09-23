"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Trash2, Film } from "lucide-react";
import { ALL_MODULES, MODULE_LABELS, defaultFunnelConfig } from "@/config/funnel-config";

const FIELDS: { key: keyof typeof defaultFunnelConfig | string; label: string; type: "text" | "textarea" | "url" | "list"; group: string }[] = [
  { key: "brandName", label: "Nombre de marca", type: "text", group: "Branding" },
  { key: "logoUrl", label: "URL del logo", type: "url", group: "Branding" },
  { key: "step1Title", label: "Paso 1 - Título", type: "text", group: "Paso 1: Hook" },
  { key: "step1Subtitle", label: "Paso 1 - Subtítulo", type: "text", group: "Paso 1: Hook" },
  { key: "step1Footer", label: "Paso 1 - Footer", type: "text", group: "Paso 1: Hook" },
  { key: "step2VideoUrl", label: "Paso 2 - URL del video gancho", type: "url", group: "Paso 2: Video gancho" },
  { key: "step2Cta", label: "Paso 2 - Texto botón", type: "text", group: "Paso 2: Video gancho" },
  { key: "step3CallerName", label: "Paso 3 - Nombre del que llama", type: "text", group: "Paso 3: Llamada" },
  { key: "step3CallerLabel", label: "Paso 3 - Etiqueta", type: "text", group: "Paso 3: Llamada" },
  { key: "step3AvatarUrl", label: "Paso 3 - Avatar URL", type: "url", group: "Paso 3: Llamada" },
  { key: "step4Title", label: "Paso 4 - Título", type: "text", group: "Paso 4: Audio" },
  { key: "step4AudioUrl", label: "Paso 4 - URL audio MP3", type: "url", group: "Paso 4: Audio" },
  { key: "step4Quote", label: "📝 Paso 4 - Nota de guión (NO se muestra al público)", type: "text", group: "Paso 4: Audio" },
  { key: "step5Title", label: "Paso 5 - Título", type: "text", group: "Paso 5: Encuesta" },
  { key: "step5Q1", label: "Paso 5 - Pregunta 1", type: "text", group: "Paso 5: Encuesta" },
  { key: "step5Q1Options", label: "Paso 5 - Opciones P1 (una por línea)", type: "list", group: "Paso 5: Encuesta" },
  { key: "step5Q2", label: "Paso 5 - Pregunta 2", type: "text", group: "Paso 5: Encuesta" },
  { key: "step5Q2Options", label: "Paso 5 - Opciones P2 (una por línea)", type: "list", group: "Paso 5: Encuesta" },
  { key: "step6Title", label: "Paso 6 - Título formulario", type: "text", group: "Paso 6: Formulario" },
  { key: "step6Subtitle", label: "Paso 6 - Subtítulo", type: "text", group: "Paso 6: Formulario" },
  { key: "step6Cta", label: "Paso 6 - Texto botón", type: "text", group: "Paso 6: Formulario" },
  { key: "step7HostName", label: "Paso 7 - Nombre host WhatsApp", type: "text", group: "Paso 7: WhatsApp simulado" },
  { key: "step7AvatarUrl", label: "Paso 7 - Avatar URL", type: "url", group: "Paso 7: WhatsApp simulado" },
  { key: "step7Msg1", label: "Paso 7 - Mensaje 1", type: "text", group: "Paso 7: WhatsApp simulado" },
  { key: "step7Msg2", label: "Paso 7 - Mensaje 2", type: "text", group: "Paso 7: WhatsApp simulado" },
  { key: "step7Msg3", label: "Paso 7 - Mensaje 3", type: "text", group: "Paso 7: WhatsApp simulado" },
  { key: "step7AudioUrl", label: "Paso 7 - URL audio WhatsApp", type: "url", group: "Paso 7: WhatsApp simulado" },
  { key: "step8Title", label: "Paso 8 - Título", type: "text", group: "Paso 8: Swipe" },
  { key: "step8Subtitle", label: "Paso 8 - Subtítulo", type: "text", group: "Paso 8: Swipe" },
  { key: "step9Title", label: "Paso 9 - Título video", type: "text", group: "Paso 9: Video principal" },
  { key: "step9VideoUrl", label: "Paso 9 - URL video", type: "url", group: "Paso 9: Video principal" },
  { key: "step10Title", label: "Paso 10 - Título", type: "text", group: "Paso 10: Swipe" },
  { key: "step10Subtitle", label: "Paso 10 - Subtítulo", type: "text", group: "Paso 10: Swipe" },
  { key: "step11Title", label: "Paso 11 - Título video", type: "text", group: "Paso 11: Video beneficios" },
  { key: "step11VideoUrl", label: "Paso 11 - URL video", type: "url", group: "Paso 11: Video beneficios" },
  { key: "step12Title", label: "Paso 12 - Título", type: "text", group: "Paso 12: Swipe" },
  { key: "step12Subtitle", label: "Paso 12 - Subtítulo", type: "text", group: "Paso 12: Swipe" },
  { key: "step13Title", label: "Paso 13 - Título", type: "text", group: "Paso 13: Fase completada" },
  { key: "step13Body", label: "Paso 13 - Cuerpo", type: "textarea", group: "Paso 13: Fase completada" },
  { key: "step13Cta", label: "Paso 13 - Texto botón", type: "text", group: "Paso 13: Fase completada" },
  { key: "step14Title", label: "Paso 14 - Título", type: "text", group: "Paso 14: Píldoras" },
  { key: "step14Subtitle", label: "Paso 14 - Subtítulo", type: "text", group: "Paso 14: Píldoras" },
  { key: "step15HeroUrl", label: "Paso 15 - URL imagen hero", type: "url", group: "Paso 15: Landing" },
  { key: "step15Title", label: "Paso 15 - Título", type: "text", group: "Paso 15: Landing" },
  { key: "step15Body", label: "Paso 15 - Cuerpo", type: "textarea", group: "Paso 15: Landing" },
  { key: "step15Benefits", label: "Paso 15 - Beneficios (uno por línea)", type: "list", group: "Paso 15: Landing" },
  { key: "step15Cta", label: "Paso 15 - Texto botón", type: "text", group: "Paso 15: Landing" },
  { key: "calendarUrl", label: "URL del calendario (Calendly, Cal.com)", type: "url", group: "Paso 15: Landing" },
  { key: "step16Title", label: "Paso 16 - Título", type: "text", group: "Paso 16: WhatsApp" },
  { key: "step16Body", label: "Paso 16 - Cuerpo", type: "textarea", group: "Paso 16: WhatsApp" },
  { key: "step16Cta", label: "Paso 16 - Texto botón", type: "text", group: "Paso 16: WhatsApp" },
  { key: "whatsappNumber", label: "Número WhatsApp (con lada, sin +)", type: "text", group: "Paso 16: WhatsApp" },
  { key: "whatsappMessage", label: "Mensaje pre-llenado", type: "textarea", group: "Paso 16: WhatsApp" },
  { key: "step17Title", label: "Paso 17 - Título", type: "text", group: "Paso 17: Final" },
  { key: "step17Body", label: "Paso 17 - Cuerpo", type: "text", group: "Paso 17: Final" },
  { key: "step17Footer", label: "Paso 17 - Footer", type: "text", group: "Paso 17: Final" },
  { key: "step18Title", label: "Paso 18 - Título", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18Q1", label: "Paso 18 - Pregunta 1", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18Q1Options", label: "Paso 18 - Opciones P1 (una por línea)", type: "list", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18Q2", label: "Paso 18 - Pregunta 2", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18Q2Options", label: "Paso 18 - Opciones P2 (una por línea)", type: "list", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18SuccessTitle", label: "Paso 18 - Título éxito", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18SuccessSubtitle", label: "Paso 18 - Subtítulo éxito", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step18Cta", label: "Paso 18 - Texto botón WhatsApp", type: "text", group: "Paso 18: Compromiso y presupuesto" },
  { key: "step19Title", label: "Paso 19 - Título", type: "text", group: "Paso 19: Fin del embudo" },
  { key: "step19Subtitle", label: "Paso 19 - Subtítulo", type: "text", group: "Paso 19: Fin del embudo" },
  { key: "step19PrefilledMessage", label: "Paso 19 - Mensaje preconfigurado WhatsApp", type: "textarea", group: "Paso 19: Fin del embudo" },
  { key: "step19Cta", label: "Paso 19 - Texto botón", type: "text", group: "Paso 19: Fin del embudo" },
  { key: "step19Footer", label: "Paso 19 - Footer", type: "text", group: "Paso 19: Fin del embudo" },
];

export default function FunnelEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [funnel, setFunnel] = useState<any>(null);
  const [config, setConfig] = useState<any>({});
  const [modules, setModules] = useState<number[]>(ALL_MODULES);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/funnels/${id}`).then(r => r.json()).then(d => {
      if (d.funnel) {
        setFunnel(d.funnel);
        setConfig({ ...defaultFunnelConfig, ...(d.funnel.config || {}) });
        setModules(d.funnel.modules || ALL_MODULES);
        setName(d.funnel.name);
      }
    });
  }, [id]);

  const save = async () => {
    setSaving(true); setSaved(false);
    const r = await fetch(`/api/funnels/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, config, modules }) });
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  const remove = async () => {
    if (!confirm("¿Eliminar este embudo? Se perderán los prospectos asociados.")) return;
    await fetch(`/api/funnels/${id}`, { method: "DELETE" });
    router.replace("/dashboard");
  };

  const toggleModule = (n: number) => {
    if (n === 6) return; // requerido
    setModules(modules.includes(n) ? modules.filter(m => m !== n) : [...modules, n].sort((a, b) => a - b));
  };

  if (!funnel) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  const groups = Array.from(new Set(FIELDS.map(f => f.group)));

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <Link href="/dashboard" className="flex items-center gap-1 text-zinc-400 hover:text-white"><ArrowLeft size={16}/> Volver</Link>
          <div className="flex items-center gap-2">
            <a href={`/dashboard/funnels/${funnel.id}/media`} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm flex items-center gap-1"><Film size={14}/> Videos & Logo</a>
            <a href={`/f/${funnel.slug}`} target="_blank" className="px-3 py-2 bg-zinc-800 rounded-lg text-sm">Vista previa</a>
            <button onClick={remove} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-1"><Trash2 size={14}/> Eliminar</button>
            <button onClick={save} disabled={saving} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold flex items-center gap-2"><Save size={16}/> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar"}</button>
          </div>
        </div>

        <h1 className="font-display text-3xl text-emerald-500 mb-1">EDITAR EMBUDO</h1>
        <p className="text-zinc-400 mb-6">URL: /f/{funnel.slug}</p>

        <div className="bg-zinc-900 rounded-xl p-5 mb-6">
          <h3 className="font-bold mb-3">Datos generales</h3>
          <label className="block text-sm text-zinc-400 mb-1">Nombre del embudo</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 bg-black rounded-lg outline-none mb-3" />
        </div>

        <div className="bg-zinc-900 rounded-xl p-5 mb-6">
          <h3 className="font-bold mb-3">Módulos activos</h3>
          <p className="text-zinc-400 text-sm mb-4">Activa o desactiva pasos del embudo. El paso 6 (formulario) es obligatorio.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {ALL_MODULES.map(n => (
              <label key={n} className={`flex items-center gap-2 p-2 rounded ${n === 6 ? "opacity-60" : "cursor-pointer hover:bg-zinc-800"}`}>
                <input type="checkbox" checked={modules.includes(n)} onChange={() => toggleModule(n)} disabled={n === 6} className="w-4 h-4 accent-emerald-500" />
                <span className="text-sm"><span className="font-bold text-emerald-400">P{n}.</span> {MODULE_LABELS[n]}</span>
              </label>
            ))}
          </div>
        </div>

        {groups.map(g => (
          <div key={g} className="bg-zinc-900 rounded-xl p-5 mb-4">
            <h3 className="font-bold text-emerald-400 mb-3">{g}</h3>
            <div className="space-y-3">
              {FIELDS.filter(f => f.group === g).map(f => (
                <div key={f.key as string}>
                  <label className="block text-sm text-zinc-400 mb-1">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea value={config[f.key as string] || ""} onChange={e => setConfig({ ...config, [f.key as string]: e.target.value })} rows={3} className="w-full px-3 py-2 bg-black rounded-lg outline-none text-sm" />
                  ) : f.type === "list" ? (
                    <textarea value={(config[f.key as string] || []).join("\n")} onChange={e => setConfig({ ...config, [f.key as string]: e.target.value.split("\n").filter(Boolean) })} rows={4} className="w-full px-3 py-2 bg-black rounded-lg outline-none text-sm" />
                  ) : (
                    <input type={f.type === "url" ? "url" : "text"} value={config[f.key as string] || ""} onChange={e => setConfig({ ...config, [f.key as string]: e.target.value })} className="w-full px-3 py-2 bg-black rounded-lg outline-none text-sm" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="sticky bottom-4 flex justify-end">
          <button onClick={save} disabled={saving} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold flex items-center gap-2 shadow-2xl shadow-emerald-500/30"><Save size={16}/> {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}</button>
        </div>
      </div>
    </div>
  );
}
