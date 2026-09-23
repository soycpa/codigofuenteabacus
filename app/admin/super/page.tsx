"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, Users, TrendingUp, Power, Lock, Eye, EyeOff } from "lucide-react";

interface UserWithStats {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  subscriptionActive: boolean;
  createdAt: string;
  totalVisits: number;
  totalSteps: number;
  googleAnalyticsId: string | null;
}

export default function SuperAdminPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  // Verificar que sea el admin super (Onofre)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.email !== "admin@onofrelopez.com") {
      // Redirigir a dashboard normal si no es el super admin
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Cargar usuarios y sus estadísticas
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === "admin@onofrelopez.com") {
      fetchUsersWithStats();
    }
  }, [status, session]);

  const fetchUsersWithStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/super");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (userId: string, currentStatus: boolean) => {
    try {
      setTogglingId(userId);
      const response = await fetch("/api/admin/super", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscriptionActive: !currentStatus }),
      });

      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, subscriptionActive: !currentStatus } : u
          )
        );
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const toggleDetails = (userId: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white">Cargando administrador general...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Requerido</h1>
          <p className="text-gray-400 mb-6">Debes iniciar sesión</p>
          <Link href="/login" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-magenta-500 text-white rounded-lg hover:opacity-90">
            Ir a Login
          </Link>
        </div>
      </div>
    );
  }

  if (session?.user?.email !== "admin@onofrelopez.com") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-gray-400 mb-6">Esta página solo es accesible para el administrador general.</p>
          <Link href="/dashboard" className="px-6 py-2 bg-gradient-to-r from-purple-500 to-magenta-500 text-white rounded-lg hover:opacity-90">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter((u) => u.subscriptionActive).length;
  const totalVisits = users.reduce((sum, u) => sum + u.totalVisits, 0);
  const totalUsers = users.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-6">
      {/* Encabezado */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              📊 Administrador General
            </h1>
            <p className="text-gray-400">Gestión de clientes y estadísticas</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-magenta-500 text-white rounded-lg hover:opacity-90 transition"
          >
            Volver
          </Link>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Usuarios</p>
                <p className="text-3xl font-bold text-white mt-2">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-magenta-900/40 to-magenta-900/20 border border-magenta-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suscripciones Activas</p>
                <p className="text-3xl font-bold text-white mt-2">{activeUsers}</p>
              </div>
              <Power className="w-8 h-8 text-magenta-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Inactivos</p>
                <p className="text-3xl font-bold text-white mt-2">{totalUsers - activeUsers}</p>
              </div>
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Visitas Totales</p>
                <p className="text-3xl font-bold text-white mt-2">{totalVisits.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-purple-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-900/50 to-magenta-900/50 border-b border-purple-500/20">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Usuario</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">Visitas</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300">Acciones</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-300"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <>
                    <tr key={user.id} className="border-b border-purple-500/10 hover:bg-purple-900/20 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{user.name || "Sin nombre"}</div>
                        <div className="text-sm text-gray-500">@{user.username || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.subscriptionActive
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {user.subscriptionActive ? "✓ Activo" : "✗ Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-white font-semibold">{user.totalVisits.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleSubscription(user.id, user.subscriptionActive)}
                          disabled={togglingId === user.id}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            user.subscriptionActive
                              ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30"
                              : "bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30"
                          } disabled:opacity-50`}
                        >
                          {togglingId === user.id ? "..." : user.subscriptionActive ? "Desactivar" : "Activar"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleDetails(user.id)}
                          className="text-purple-400 hover:text-purple-300 transition"
                        >
                          {showDetails[user.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                    {showDetails[user.id] && (
                      <tr className="bg-purple-900/10 border-b border-purple-500/10">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Creado</p>
                              <p className="text-sm text-white mt-1">{new Date(user.createdAt).toLocaleDateString("es-MX")}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Pasos Visitados</p>
                              <p className="text-sm text-white mt-1">{user.totalSteps}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Google Analytics</p>
                              <p className="text-sm text-white mt-1">{user.googleAnalyticsId ? "✓ Configurado" : "Sin configurar"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase">URL Pública</p>
                              <p className="text-sm text-cyan-400 mt-1 font-mono break-all">/embudo/{user.username}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No hay usuarios registrados aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
