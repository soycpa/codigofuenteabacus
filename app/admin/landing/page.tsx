"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function AdminLandingEditorPage() {
  const { data: session, status } = useSession() || ({} as any);
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.email !== "admin@onofrelopez.com") {
      if (status === "authenticated") router.replace("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user?.email !== "admin@onofrelopez.com") return;
    fetch("/api/landing/template")
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError(d.error);
        } else {
          setTemplate(d);
          setContent(d.content);
        }
      });
  }, [status, session]);

  async function save() {
    if (!template || !content) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/landing/template", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Error al guardar");
      setTemplate(d);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : (
          <div>Cargando...</div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/70 border-b border-purple-500/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-purple-900/30 transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
                Editar Plantilla Maestra
              </h1>
              <p className="text-zinc-400 text-sm">Tema: Azul v{template.version}</p>
            </div>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 disabled:opacity-50 rounded-lg font-bold transition"
          >
            <Save size={18} />
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-red-200">{error}</div>
          </div>
        )}

        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3">
            <div className="text-green-200">✓ Cambios guardados. Se incrementó versión a {template.version + 1}.</div>
          </div>
        )}

        <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Contenido de la plantilla</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Edita los textos que aparecerán en las landing pages de los agentes. Cuando guardes, se incrementará la versión y los agentes verán un botón para actualizar.
          </p>
          <textarea
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                setContent(JSON.parse(e.target.value));
                setError(null);
              } catch {
                setError("JSON inválido");
              }
            }}
            className="w-full h-96 p-4 bg-black border border-purple-500/30 rounded-lg text-white font-mono text-sm focus:border-purple-400 outline-none"
            placeholder="JSON content..."
          />
        </div>

        <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-3">Información de la plantilla</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-400">Clave del tema</p>
              <p className="font-bold">{template.themeKey}</p>
            </div>
            <div>
              <p className="text-zinc-400">Versión actual</p>
              <p className="font-bold">{template.version}</p>
            </div>
            <div>
              <p className="text-zinc-400">Última actualización</p>
              <p className="font-bold text-xs">{new Date(template.updatedAt).toLocaleString("es-MX")}</p>
            </div>
            <div>
              <p className="text-zinc-400">Creada</p>
              <p className="font-bold text-xs">{new Date(template.createdAt).toLocaleString("es-MX")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
