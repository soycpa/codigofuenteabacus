"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, RotateCcw, CheckCircle2, Image as ImageIcon, Video, Loader2, X } from "lucide-react";
import { MODULE_LABELS } from "@/config/funnel-config";

type MediaItem = {
  field: string;
  label: string;
  type: "video" | "image" | "audio";
  step?: number;
};

const MEDIA_ITEMS: MediaItem[] = [
  { field: "logoUrl", label: "Logo (aparece en todos los pasos)", type: "image" },
  { field: "step4AudioUrl", label: "Audio Paso 4 (El Guardián - se reproduce automático)", type: "audio", step: 4 },
  { field: "step7AudioUrl", label: "Audio Paso 7 (WhatsApp del host)", type: "audio", step: 7 },
  ...Array.from({ length: 19 }, (_, i) => ({
    field: `step${i + 1}VideoUrl`,
    label: `Paso ${i + 1}: ${MODULE_LABELS[i + 1] ?? ""}`,
    type: "video" as const,
    step: i + 1,
  })),
];

export default function MediaManagerPage() {
  const params = useParams();
  const router = useRouter();
  const funnelId = params?.id as string;
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!funnelId) return;
    fetch(`/api/funnels/${funnelId}`)
      .then((r) => r.json())
      .then((data) => {
        setConfig(data?.funnel?.config ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [funnelId]);

  const updateField = (field: string, value: string) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  const saveField = async (field: string, value: string) => {
    await fetch(`/api/funnels/${funnelId}/media`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    setSavedAt(new Date().toLocaleTimeString());
  };

  const resetToDefaults = async () => {
    setResetting(true);
    try {
      const res = await fetch(`/api/funnels/${funnelId}/reset-defaults`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: "media" }),
      });
      if (res.ok) {
        // Recargar config
        const data = await fetch(`/api/funnels/${funnelId}`).then((r) => r.json());
        setConfig(data?.funnel?.config ?? null);
        setSavedAt("Restaurado a defaults de Onofre");
        setShowResetConfirm(false);
      }
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/dashboard/funnels/${funnelId}`} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-3">
              <ArrowLeft className="w-4 h-4" /> Volver al editor
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              🎬 Gestión de Videos e Imágenes
            </h1>
            <p className="text-gray-400 mt-2">Sube tu logo y los 19 videos verticales del embudo. Se reproducirán en autoplay.</p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            disabled={resetting}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            title="Restaurar a los videos/logo originales de Onofre López"
          >
            <RotateCcw className="w-4 h-4" />
            Resetear a defaults de Onofre
          </button>
        </div>

        {savedAt && (
          <div className="mb-4 px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardado: {savedAt}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDIA_ITEMS.map((item) => (
            <MediaCard
              key={item.field}
              item={item}
              currentUrl={config?.[item.field] ?? ""}
              onUpdate={(url) => {
                updateField(item.field, url);
                saveField(item.field, url);
              }}
            />
          ))}
        </div>

        {/* Modal de confirmación */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-zinc-900 to-purple-900/40 border border-purple-500/30 rounded-2xl p-8 max-w-md">
              <h3 className="text-2xl font-bold text-white mb-3">¿Resetear a los defaults?</h3>
              <p className="text-gray-300 mb-6">
                Esto reemplazará tu logo y los 19 videos por los actuales del embudo de <strong>Onofre López</strong>. Tus textos y configuraciones NO se modificarán.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resetToDefaults}
                  disabled={resetting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {resetting ? "Restaurando..." : "Sí, resetear"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaCard({
  item,
  currentUrl,
  onUpdate,
}: {
  item: MediaItem;
  currentUrl: string;
  onUpdate: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      // 1. Get presigned URL
      const presignedRes = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });
      const { uploadUrl, publicUrl } = await presignedRes.json();
      if (!uploadUrl) throw new Error("No upload URL");

      // 2. Upload to S3 directly with progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(xhr.statusText));
        xhr.onerror = () => reject("Upload error");
        xhr.send(file);
      });

      onUpdate(publicUrl);
    } catch (err) {
      console.error(err);
      alert("Error al subir el archivo: " + err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const accept = item.type === "video" ? "video/*" : item.type === "audio" ? "audio/*" : "image/*";

  return (
    <div className="bg-gradient-to-br from-zinc-900/70 to-black/60 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition">
      <div className="flex items-center gap-2 mb-3">
        {item.type === "video" ? <Video className="w-4 h-4 text-purple-400" /> : item.type === "audio" ? <span className="w-4 h-4 text-emerald-400">🎙️</span> : <ImageIcon className="w-4 h-4 text-cyan-400" />}
        <h3 className="text-sm font-semibold text-white">{item.label}</h3>
      </div>

      {/* Preview */}
      <div className={`relative ${item.type === "audio" ? "aspect-video" : "aspect-[9/16]"} bg-black rounded-lg overflow-hidden mb-3 border border-purple-500/10`}>
        {currentUrl ? (
          item.type === "video" ? (
            <video src={currentUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline controls={false} />
          ) : item.type === "audio" ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-3">
              <div className="text-4xl mb-2">🎙️</div>
              <audio src={currentUrl} controls className="w-full" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt={item.label} className="w-full h-full object-contain" />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            {item.type === "video" ? <Video className="w-10 h-10 mb-2" /> : item.type === "audio" ? <div className="text-3xl mb-2">🎙️</div> : <ImageIcon className="w-10 h-10 mb-2" />}
            <span className="text-xs">Sin {item.type}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
            <p className="text-white text-sm font-medium">{progress}%</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:opacity-90 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <Upload className="w-3 h-3" />
          {currentUrl ? "Reemplazar" : "Subir"}
        </button>
        {currentUrl && (
          <button
            onClick={() => onUpdate("")}
            disabled={uploading}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm disabled:opacity-50"
            title="Quitar"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
