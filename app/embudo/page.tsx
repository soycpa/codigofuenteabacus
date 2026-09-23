"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Zap, BarChart3, Users, Lock, Sparkles, Shield, Globe, Play, CheckCircle2, Rocket } from "lucide-react";

export default function EmbudoLandingPage() {
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (session?.user) router.push("/dashboard");
  }, [session, router]);

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] bg-magenta-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[150px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(168,85,247,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-3 sm:px-6 md:px-12 py-2 sm:py-4">
        <Link href="/embudo" className="flex-shrink min-w-0">
          <img src="/logo-marketia-funnel.png" alt="Marketia Funnel" className="h-8 sm:h-10 md:h-12 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 ml-2">
          <Link href="/login" className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg text-[11px] sm:text-sm font-medium text-white/80 hover:text-white transition whitespace-nowrap">
            Ingresar
          </Link>
          <Link href="/signup" className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-500 hover:to-magenta-500 text-white font-bold text-[11px] sm:text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all whitespace-nowrap">
            Registro
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Rocket className="w-4 h-4" />
          <span>Plataforma de Embudos TikTok-Style</span>
        </div>

        <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[0.95] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="block bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">Convierte</span>
          <span className="block bg-gradient-to-r from-purple-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent">Prospectos</span>
          <span className="block text-white/90">en Clientes</span>
        </h1>

        <p className={`text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          Embudos inmersivos que combinan la experiencia de TikTok con estrategias probadas de ventas. Captura datos, genera confianza y cierra deals.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/signup" className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-500 hover:to-magenta-500 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02]">
            Comenzar Gratis
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-lg flex items-center justify-center gap-3 backdrop-blur transition-all">
            <Play size={18} />
            Ya tengo cuenta
          </Link>
        </div>

        {/* Stats strip */}
        <div className={`flex flex-wrap justify-center gap-8 mt-16 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Stat value="19" label="Pasos del Embudo" />
          <Stat value="TikTok" label="Experiencia Inmersiva" />
          <Stat value="100%" label="Personalizable" />
        </div>
      </section>

      {/* Dashboard showcase image — 50% smaller */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20 flex justify-center">
        <div className={`relative rounded-3xl overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-500/20 transition-all duration-700 delay-[600ms] w-full max-w-[50%] ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent z-10 pointer-events-none" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/funnel-hero.png" alt="Dashboard del embudo con estadísticas, gráficas y embudo 3D" className="w-full h-auto" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Todo lo que necesitas</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">Herramientas poderosas para crear embudos que realmente conviertan</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon={<Zap />} title="19 Pasos Disponibles" description="Simulaciones de llamada, TikTok login, WhatsApp, formularios y más." gradient="from-purple-500 to-purple-700" />
          <FeatureCard icon={<BarChart3 />} title="Analítica en Tiempo Real" description="Mide cuántos visitantes llegan a cada paso de tu embudo." gradient="from-magenta-500 to-magenta-700" />
          <FeatureCard icon={<Users />} title="Multi-Tenant SaaS" description="Cada usuario tiene su propio embudo personalizable." gradient="from-cyan-500 to-cyan-700" />
          <FeatureCard icon={<Globe />} title="Tu URL Personal" description="Comparte tu embudo en marketia.live/funnel/tu-usuario." gradient="from-emerald-500 to-emerald-700" />
          <FeatureCard icon={<Shield />} title="Videos Personalizados" description="Sube tus propios videos o usa los defaults de Onofre." gradient="from-orange-500 to-orange-700" />
          <FeatureCard icon={<Lock />} title="Activar / Desactivar" description="Controla qué pasos se muestran en tu embudo." gradient="from-rose-500 to-rose-700" />
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <div className="relative rounded-3xl overflow-hidden">
          {/* BG glow for pricing card */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-magenta-600/20" />
          <div className="absolute inset-0 bg-[#0a0a1a]/80 backdrop-blur-xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <div className="relative p-8 md:p-14">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: Pricing info */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3 h-3" /> Plan Único
                </span>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-6xl md:text-7xl text-white">$16</span>
                  <div className="text-left">
                    <span className="block text-white/80 text-lg font-bold">USD</span>
                    <span className="block text-white/40 text-sm">por mes</span>
                  </div>
                </div>
                <p className="text-white/50 mt-4 mb-8 leading-relaxed">
                  Acceso completo a todas las funciones. Sin compromisos, cancela cuando quieras.
                </p>
                <Link href="/signup" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-500 hover:to-magenta-500 text-white font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02]">
                  Comenzar Ahora
                  <ArrowRight size={20} />
                </Link>
              </div>

              {/* Right: Benefits list */}
              <div className="space-y-4">
                <BenefitItem text="19 pasos de embudo disponibles" />
                <BenefitItem text="Mi Landing Page personal incluida ✨" />
                <BenefitItem text="Dominio personalizado (opcional)" />
                <BenefitItem text="Videos personalizados por paso" />
                <BenefitItem text="Analítica ilimitada en tiempo real" />
                <BenefitItem text="Google Analytics integrado" />
                <BenefitItem text="Captura de prospectos automática" />
                <BenefitItem text="Exportación de datos CSV" />
                <BenefitItem text="Soporte directo por WhatsApp" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 text-center px-6 pb-20">
        <h2 className="font-display text-3xl md:text-4xl mb-4">
          <span className="text-white">¿Listo para transformar </span>
          <span className="bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">tus ventas?</span>
        </h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">Únete hoy y empieza a convertir prospectos con la experiencia TikTok-Style.</p>
        <Link href="/signup" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-500 hover:to-magenta-500 text-white font-bold text-lg shadow-2xl shadow-purple-500/30 transition-all hover:scale-[1.02]">
          Crear Cuenta Gratis
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-4 text-sm">
          <Link href="/privacidad" className="text-white/40 hover:text-purple-400 transition">Aviso de Privacidad</Link>
          <span className="text-white/20">•</span>
          <Link href="/terminos" className="text-white/40 hover:text-purple-400 transition">Términos y Condiciones</Link>
        </div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} Marketia. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent">{value}</div>
      <div className="text-white/40 text-sm mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="group relative rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <div className="text-white w-5 h-5">{icon}</div>
      </div>
      <h3 className="font-bold text-white mb-2 text-lg">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
      <span className="text-white/80">{text}</span>
    </div>
  );
}
