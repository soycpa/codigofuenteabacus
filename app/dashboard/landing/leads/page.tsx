"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Search, Eye, EyeOff } from "lucide-react";

type Lead = {
  id: string;
  nombre: string;
  apellido: string | null;
  genero: string | null;
  fechaNacimiento: string | null;
  fuma: string | null;
  estado: string | null;
  pagoDeseado: string | null;
  email: string | null;
  whatsapp: string | null;
  telefono: string | null;
  mensaje: string | null;
  createdAt: string;
};

export default function LeadsPage() {
  const { data: session, status } = useSession() || ({} as any);
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMensaje, setShowMensaje] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/landing/leads")
      .then(r => r.json())
      .then(d => {
        setLeads(d.leads || []);
        setLoading(false);
      })
      .catch(e => {
        console.error("Error loading leads:", e);
        setLoading(false);
      });
  }, [status]);

  const filteredLeads = leads.filter(lead =>
    lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.telefono && lead.telefono.includes(searchTerm))
  );

  function exportCSV() {
    const headers = ["Nombre", "Apellido", "Género", "Fecha Nac.", "¿Fuma?", "Estado", "Pago Deseado", "Email", "WhatsApp", "Teléfono", "Mensaje", "Fecha"];
    const rows = filteredLeads.map(lead => [
      lead.nombre,
      lead.apellido || "",
      lead.genero || "",
      lead.fechaNacimiento || "",
      lead.fuma || "",
      lead.estado || "",
      lead.pagoDeseado || "",
      lead.email || "",
      lead.whatsapp || "",
      lead.telefono || "",
      lead.mensaje || "",
      new Date(lead.createdAt).toLocaleString("es-MX"),
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${Date.now()}.csv`;
    link.click();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-black/70 border-b border-purple-500/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link href="/dashboard/landing" className="p-2 rounded-lg hover:bg-purple-900/30 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">
              Leads Capturados
            </h1>
          </div>
          <button
            onClick={exportCSV}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 disabled:opacity-50 rounded-lg font-bold transition"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-zinc-400">Cargando leads...</div>
        ) : leads.length === 0 ? (
          <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl p-8 text-center">
            <p className="text-zinc-400">Aún no hay leads capturados en tu landing page.</p>
            <p className="text-zinc-500 text-sm mt-2">Los prospectos que llenen el formulario aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black border border-purple-500/30 rounded-lg text-white focus:border-purple-400 outline-none"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900/50 border border-purple-500/30 rounded-lg p-3">
                <p className="text-zinc-400 text-sm">Total de leads</p>
                <p className="font-bold text-2xl">{leads.length}</p>
              </div>
              <div className="bg-zinc-900/50 border border-purple-500/30 rounded-lg p-3">
                <p className="text-zinc-400 text-sm">Con email</p>
                <p className="font-bold text-2xl">{leads.filter(l => l.email).length}</p>
              </div>
              <div className="bg-zinc-900/50 border border-purple-500/30 rounded-lg p-3">
                <p className="text-zinc-400 text-sm">Con teléfono</p>
                <p className="font-bold text-2xl">{leads.filter(l => l.telefono).length}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/50 border border-purple-500/30 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-purple-500/30 bg-black/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Nombre</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Teléfono</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Estado</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Pago</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Detalles</th>
                      <th className="px-4 py-3 text-left text-zinc-400 font-semibold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/20">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-black/30 transition">
                        <td className="px-4 py-3 text-white font-medium">
                          {lead.nombre}{lead.apellido ? " " + lead.apellido : ""}
                        </td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">
                          {lead.email ? (
                            <a href={`mailto:${lead.email}`} className="text-purple-400 hover:text-purple-300">
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">
                          {(lead.telefono || lead.whatsapp) ? (
                            <a href={`https://wa.me/${(lead.whatsapp || lead.telefono || "").replace(/\D/g, '')}`} target="_blank" className="text-green-400 hover:text-green-300">
                              {lead.telefono || lead.whatsapp}
                            </a>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{lead.estado || <span className="text-zinc-600">—</span>}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{lead.pagoDeseado ? "$" + lead.pagoDeseado + "/mes" : <span className="text-zinc-600">—</span>}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">
                          <button
                            onClick={() => setShowMensaje(prev => ({ ...prev, [lead.id]: !prev[lead.id] }))}
                            className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                          >
                            {showMensaje[lead.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            Ver
                          </button>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">
                          {new Date(lead.createdAt).toLocaleString("es-MX", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detalles expandidos */}
            <div className="space-y-2">
              {filteredLeads.map(lead =>
                showMensaje[lead.id] ? (
                  <div key={`msg-${lead.id}`} className="bg-black border border-purple-500/30 rounded-lg p-4">
                    <p className="text-sm font-semibold text-purple-300 mb-3">{lead.nombre}{lead.apellido ? " " + lead.apellido : ""} — Detalles</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {lead.genero && <div><span className="text-zinc-500">Género:</span> <span className="text-white">{lead.genero}</span></div>}
                      {lead.fechaNacimiento && <div><span className="text-zinc-500">Fecha Nac.:</span> <span className="text-white">{lead.fechaNacimiento}</span></div>}
                      {lead.fuma && <div><span className="text-zinc-500">¿Fuma?:</span> <span className="text-white">{lead.fuma}</span></div>}
                      {lead.estado && <div><span className="text-zinc-500">Estado:</span> <span className="text-white">{lead.estado}</span></div>}
                      {lead.pagoDeseado && <div><span className="text-zinc-500">Pago deseado:</span> <span className="text-white">${lead.pagoDeseado}/mes</span></div>}
                      {lead.email && <div><span className="text-zinc-500">Email:</span> <span className="text-white">{lead.email}</span></div>}
                      {lead.whatsapp && <div><span className="text-zinc-500">WhatsApp:</span> <span className="text-white">{lead.whatsapp}</span></div>}
                      {lead.telefono && <div><span className="text-zinc-500">Teléfono:</span> <span className="text-white">{lead.telefono}</span></div>}
                    </div>
                    {lead.mensaje && <p className="text-white text-sm whitespace-pre-wrap mt-3 border-t border-purple-500/20 pt-3">{lead.mensaje}</p>}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
