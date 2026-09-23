"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export default function FunnelProspects() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any>(null);
  const [filter, setFilter] = useState<number | "all">("all");

  useEffect(() => {
    fetch(`/api/funnels/${id}`).then(r => r.json()).then(d => setFunnel(d.funnel));
    fetch(`/api/funnels/${id}/prospects`).then(r => r.json()).then(d => setData(d.prospects || []));
  }, [id]);

  const filtered = filter === "all" ? data : data.filter(p => p.pasoActual === filter);
  const counts: Record<number, number> = {};
  data.forEach(p => { counts[p.pasoActual] = (counts[p.pasoActual] ?? 0) + 1; });

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <Link href="/dashboard" className="flex items-center gap-1 text-zinc-400"><ArrowLeft size={16}/> Volver</Link>
          <a href={`/api/funnels/${id}/prospects/export`} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg flex items-center gap-2 font-bold"><Download size={16}/> Exportar CSV</a>
        </div>
        <h1 className="font-display text-3xl text-emerald-500 mb-2">PROSPECTOS</h1>
        <p className="text-zinc-400 mb-6">{funnel?.name} • {data.length} totales</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-full text-sm ${filter === "all" ? "bg-emerald-500" : "bg-zinc-800"}`}>Todos ({data.length})</button>
          {Array.from({ length: 12 }, (_, i) => i + 6).map(n => counts[n] ? (
            <button key={n} onClick={() => setFilter(n)} className={`px-3 py-1 rounded-full text-sm ${filter === n ? "bg-emerald-500" : "bg-zinc-800"}`}>Paso {n} ({counts[n]})</button>
          ) : null)}
        </div>

        <div className="bg-zinc-900 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-400"><tr><th className="text-left p-3">Nombre</th><th className="text-left p-3">Email</th><th className="text-left p-3">WhatsApp</th><th className="text-left p-3">Paso</th><th className="text-left p-3">Último</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-zinc-500">Sin prospectos</td></tr>}
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-zinc-800">
                  <td className="p-3">{p.nombre}</td>
                  <td className="p-3 text-zinc-300">{p.email}</td>
                  <td className="p-3 text-zinc-300">{p.whatsapp}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded font-bold">{p.pasoActual}/17</span></td>
                  <td className="p-3 text-zinc-400">{new Date(p.updatedAt).toLocaleString("es-MX")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
