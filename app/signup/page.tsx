"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Error"); setLoading(false); return; }
      const s = await signIn("credentials", { email, password, redirect: false });
      if (s?.error) { setError("Error al ingresar"); setLoading(false); return; }
      router.replace("/dashboard");
    } catch { setError("Error de red"); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050d0d] to-purple-950/40 px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl" />
      
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-gradient-dark border border-purple-500/30 rounded-2xl p-8 shadow-2xl shadow-purple-500/20 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-magenta-600 rounded-lg">
            <UserPlus className="text-white" size={24} />
          </div>
          <h1 className="font-display text-2xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">CREAR CUENTA</h1>
        </div>
        <input placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 mb-3 bg-black text-white placeholder-white/40 rounded-lg outline-none border border-purple-500/20 focus:border-purple-500 transition" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 mb-3 bg-black text-white placeholder-white/40 rounded-lg outline-none border border-purple-500/20 focus:border-purple-500 transition" required />
        <input type="password" placeholder="Contraseña (mín 6)" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 mb-3 bg-black text-white placeholder-white/40 rounded-lg outline-none border border-purple-500/20 focus:border-purple-500 transition" required minLength={6} />
        {error && <p className="text-red-400 text-sm mb-4 flex items-center gap-1">⚠️ {error}</p>}
        <button disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 disabled:opacity-50 text-white font-bold rounded-lg transition shadow-lg shadow-purple-500/30">{loading ? "Creando..." : "CREAR CUENTA"}</button>
        <p className="text-zinc-400 text-sm text-center mt-6">¿Ya tienes cuenta? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Ingresar aquí</Link></p>
      </form>
    </div>
  );
}
