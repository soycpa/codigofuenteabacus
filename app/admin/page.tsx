"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Users, Settings, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";

export default function AdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") router.replace("/dashboard");
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/admin/users").then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  }, [status]);

  const toggleSub = async (u: any) => {
    const r = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: u.id, subscriptionActive: !u.subscriptionActive }) });
    if (r.ok) setUsers(users.map(x => x.id === u.id ? { ...x, subscriptionActive: !u.subscriptionActive } : x));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h1 className="font-display text-3xl text-emerald-500">PANEL DE ADMINISTRACIÓN</h1>
          <div className="flex gap-2">
            <Link href="/admin/settings" className="px-4 py-2 bg-zinc-800 rounded-lg flex items-center gap-2 text-sm"><Settings size={16}/> Configuración</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-zinc-800 rounded-lg text-sm">Mis embudos</Link>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-4 py-2 bg-zinc-800 rounded-lg flex items-center gap-2 text-sm"><LogOut size={16}/> Salir</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-zinc-900 rounded-lg p-4"><div className="text-zinc-400 text-sm">Usuarios</div><div className="text-3xl font-display text-emerald-500">{users.length}</div></div>
          <div className="bg-zinc-900 rounded-lg p-4"><div className="text-zinc-400 text-sm">Activos</div><div className="text-3xl font-display">{users.filter(u => u.subscriptionActive).length}</div></div>
          <div className="bg-zinc-900 rounded-lg p-4"><div className="text-zinc-400 text-sm">Inactivos</div><div className="text-3xl font-display">{users.filter(u => !u.subscriptionActive).length}</div></div>
          <div className="bg-zinc-900 rounded-lg p-4"><div className="text-zinc-400 text-sm">Admins</div><div className="text-3xl font-display">{users.filter(u => u.role === "admin").length}</div></div>
        </div>

        <h2 className="font-display text-xl mb-3 flex items-center gap-2"><Users size={20}/> Usuarios y suscripciones</h2>
        <div className="bg-zinc-900 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-400"><tr><th className="text-left p-3">Email</th><th className="text-left p-3">Nombre</th><th className="text-left p-3">Rol</th><th className="text-left p-3">Embudos</th><th className="text-left p-3">Suscripción</th><th className="text-left p-3">Acciones</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-zinc-800">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-zinc-300">{u.name || "-"}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${u.role === "admin" ? "bg-yellow-500/20 text-yellow-400" : "bg-zinc-700 text-zinc-300"}`}>{u.role}</span></td>
                  <td className="p-3">{u._count?.funnels ?? 0}</td>
                  <td className="p-3">{u.subscriptionActive ? <span className="text-emerald-400 font-bold">ACTIVA</span> : <span className="text-red-400">Inactiva</span>}</td>
                  <td className="p-3">
                    <button onClick={() => toggleSub(u)} className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 ${u.subscriptionActive ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {u.subscriptionActive ? <><ToggleLeft size={14}/> Desactivar</> : <><ToggleRight size={14}/> Activar</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
