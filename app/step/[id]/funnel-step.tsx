"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useFunnel } from "@/lib/funnel-context";
import { TikTokShell } from "@/components/tiktok-shell";
import {
  ChevronUp, Phone, PhoneOff, Play, Pause, CheckCircle2, Lock,
  Shield, Heart, AlertTriangle, Calendar, MessageSquare, Terminal as TerminalIcon, ArrowRight
} from "lucide-react";

const LS_KEY = "funnel_progress";
const LS_PROSPECT = "funnel_prospect_id";
const LS_VISITOR_ID = "funnel_visitor_id";

function saveLocalStep(step: number) { try { localStorage.setItem(LS_KEY, String(step)); } catch {} }
async function persistStep(step: number, funnelId?: string | null) {
  try {
    const id = localStorage.getItem(LS_PROSPECT);
    if (!id) return;
    await fetch("/api/prospects", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, pasoActual: step }) });
  } catch {}
}
async function recordVisit(step: number, funnelId?: string | null) {
  try {
    if (!funnelId) return;
    
    let visitorId = localStorage.getItem(LS_VISITOR_ID);
    if (!visitorId) {
      visitorId = "visitor_" + Math.random().toString(36).slice(2, 11);
      localStorage.setItem(LS_VISITOR_ID, visitorId);
    }
    
    await fetch("/api/funnels/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ funnelId, step, visitorId }),
    });
  } catch {}
}

export default function FunnelStep({ stepId, basePath = "/step" }: { stepId: number; basePath?: string }) {
  const router = useRouter();
  const { modules, funnelId } = useFunnel();
  const enabled = modules.includes(stepId);

  // navega al siguiente paso ACTIVO
  const findNext = (from: number) => {
    for (let i = from + 1; i <= 19; i++) if (modules.includes(i)) return i;
    return 19;
  };
  const next = () => {
    const n = findNext(stepId);
    saveLocalStep(n); persistStep(n, funnelId); router.push(`${basePath}/${n}`);
  };
  const goTo = (n: number) => {
    const target = modules.includes(n) ? n : findNext(n - 1);
    saveLocalStep(target); persistStep(target, funnelId); router.push(`${basePath}/${target}`);
  };

  useEffect(() => {
    if (!enabled) {
      const n = findNext(stepId);
      router.replace(`${basePath}/${n}`);
      return;
    }
    saveLocalStep(stepId); 
    persistStep(stepId, funnelId);
    recordVisit(stepId, funnelId);
  }, [stepId, enabled]);

  if (!enabled) return null;

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Phone frame: vertical on all screens, max-w for desktop */}
      <div className="relative w-full h-full max-w-[430px] sm:h-[min(100vh,860px)] sm:rounded-3xl sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-purple-900/30 overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div key={stepId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="h-full overflow-y-auto overflow-x-hidden">
            <StepRenderer stepId={stepId} next={next} goTo={goTo} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function useCfg() { return useFunnel().config as any; }

function StepLabel({ n }: { n: number }) {
  return <div className="absolute top-3 left-3 z-40 px-3 py-1 bg-gradient-to-r from-purple-600 to-magenta-600 text-white text-xs font-bold rounded-lg">PASO {n}/19</div>;
}
function CTAButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="w-full py-4 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 active:scale-[0.98] text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-500/30 transition">{children}</button>;
}

function Step1({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const { unlockAudio } = useFunnel();
  const handleStart = () => {
    unlockAudio(); // Unlock Web Audio context on first user gesture
    onNext();
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={1} />
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl" />
      
      {/* Marketia Funnel brand logo — always visible */}
      <motion.img src="/logo-marketia-funnel.png" alt="Marketia Funnel" className="w-36 sm:w-40 mb-4 relative z-10 drop-shadow-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} />

      {/* User's custom logo */}
      <motion.img src={cfg.logoUrl} alt="logo" className="w-40 mb-6 rounded-2xl shadow-2xl shadow-purple-500/20" initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} />
      <h1 className="font-display text-5xl text-center mb-3 leading-none whitespace-pre-line bg-gradient-to-r from-purple-400 via-purple-300 to-magenta-400 bg-clip-text text-transparent relative z-10">{cfg.step1Title}</h1>
      <p className="text-white/70 text-center mb-10 uppercase tracking-widest text-sm relative z-10">{cfg.step1Subtitle}</p>
      <button onClick={handleStart} className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-magenta-600 flex items-center justify-center pulse-ring shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/70 transition relative z-10"><Lock className="w-10 h-10 text-white" /></button>
      <p className="absolute bottom-6 text-white/40 text-xs tracking-widest relative z-10">{cfg.step1Footer}</p>
    </div>
  );
}

function Step2({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  return (
    <TikTokShell>
      <StepLabel n={2} />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <video src={cfg.step2VideoUrl} autoPlay loop muted playsInline className="w-full h-screen object-cover" />
      </div>
      <div className="absolute bottom-24 left-0 right-0 px-4 z-30"><CTAButton onClick={onNext}>{cfg.step2Cta} <ArrowRight className="inline ml-2" /></CTAButton></div>
    </TikTokShell>
  );
}

function Step3({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden">
      <StepLabel n={3} />
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="text-center pt-8 relative z-10"><p className="text-white/60 text-sm uppercase tracking-widest">Llamada entrante</p><h2 className="font-display text-4xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent mt-2">{cfg.step3CallerName}</h2><p className="text-purple-400 mt-1">{cfg.step3CallerLabel}</p></div>
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="relative z-10">
        <img src={cfg.step3AvatarUrl} alt="avatar" className="w-48 h-48 rounded-full object-cover shadow-2xl shadow-purple-500/30" />
        <div className="absolute inset-0 rounded-full pulse-ring" />
      </motion.div>
      <div className="flex w-full justify-around items-center relative z-10">
        <button className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center transition shadow-lg shadow-red-500/30"><PhoneOff className="w-7 h-7 text-white" /></button>
        <button onClick={onNext} className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-magenta-600 flex items-center justify-center pulse-ring shadow-lg shadow-purple-500/30"><Phone className="w-7 h-7 text-white" /></button>
      </div>
    </div>
  );
}

function Step4({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const { audioUnlocked } = useFunnel();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ended, setEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggle = () => { const a = audioRef.current; if (!a) return; if (playing) { a.pause(); setPlaying(false); } else { a.play().then(() => setPlaying(true)).catch(() => {}); } };
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const onTime = () => setProgress((a.currentTime / (a.duration || 1)) * 100);
    const onEnd = () => { setPlaying(false); setEnded(true); setTimeout(() => onNext(), 1200); };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    // Auto-play if audio was unlocked by the user in Step1
    if (audioUnlocked) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("ended", onEnd); };
  }, []);
  const hasAudio = !!cfg.step4AudioUrl;
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={4} />
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <p className="text-purple-400 text-sm uppercase tracking-widest mb-2 relative z-10">En llamada con</p>
      <h2 className="font-display text-4xl text-white mb-8 relative z-10">{cfg.step4Title}</h2>
      {hasAudio && <audio ref={audioRef} src={cfg.step4AudioUrl} preload="auto" />}
      <div className="relative mb-8 z-10">
        {/* Wave animation */}
        {playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[0, 1, 2].map(i => (
              <span key={i} className="absolute w-32 h-32 rounded-full border-2 border-purple-400/50 animate-ping" style={{ animationDelay: `${i * 0.6}s`, animationDuration: "2s" }} />
            ))}
          </div>
        )}
        <button onClick={toggle} disabled={!hasAudio} className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 hover:shadow-purple-400/60 transition ${hasAudio ? "bg-gradient-to-br from-purple-600 to-magenta-600" : "bg-zinc-800 opacity-50 cursor-not-allowed"}`}>
          {playing ? <Pause className="w-14 h-14 text-white" /> : <Play className="w-14 h-14 text-white ml-2" />}
        </button>
      </div>
      <p className="text-white/80 text-sm mb-3 relative z-10">{playing ? "🔊 Escuchando..." : ended ? "✓ Audio completado" : "Toca ESCUCHAR si no inicia"}</p>
      {hasAudio && (
        <div className="w-full max-w-xs h-2 bg-zinc-800 rounded-full overflow-hidden mb-2 relative z-10"><div className="h-full bg-gradient-to-r from-purple-500 to-magenta-500 transition-all" style={{ width: `${progress}%` }} /></div>
      )}
      {/* step4Quote es nota de guión — solo visible en el panel admin */}
      {!hasAudio && (
        <p className="text-yellow-400 text-xs text-center mb-4 relative z-10 max-w-xs">Sube tu audio en el panel: Mi embudo → Videos & Logo → Audio Paso 4</p>
      )}
      <div className="w-full max-w-xs relative z-10">
        <button onClick={toggle} disabled={!hasAudio || playing} className="w-full mb-2 py-3 px-4 rounded-xl border border-purple-500/40 text-purple-200 font-bold disabled:opacity-40 transition hover:bg-purple-500/10">
          {playing ? "ESCUCHANDO..." : "▶ ESCUCHAR"}
        </button>
        <CTAButton onClick={onNext}>CONTINUAR</CTAButton>
      </div>
    </div>
  );
}

function Step5({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const [a1, setA1] = useState<string | null>(null);
  const [a2, setA2] = useState<string | null>(null);
  const can = a1 && a2;
  const Q = ({ label, sel, onSel }: any) => (
    <button onClick={() => onSel(label)} className={`w-full py-3 px-4 rounded-xl mb-2 text-left transition ${sel === label ? "bg-gradient-to-r from-purple-600 to-magenta-600 text-white font-bold shadow-lg shadow-purple-500/30" : "bg-zinc-900 text-white/80 hover:bg-zinc-800 border border-zinc-800"}`}>{label}</button>
  );
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 px-5 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <StepLabel n={5} />
      <h2 className="font-display text-3xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent mb-6 relative z-10">{cfg.step5Title}</h2>
      <div className="mb-6 relative z-10"><p className="text-white font-bold mb-3">1. {cfg.step5Q1}</p>{(cfg.step5Q1Options || []).map((o: string) => <Q key={o} label={o} sel={a1} onSel={setA1} />)}</div>
      <div className="mb-8 relative z-10"><p className="text-white font-bold mb-3">2. {cfg.step5Q2}</p>{(cfg.step5Q2Options || []).map((o: string) => <Q key={o} label={o} sel={a2} onSel={setA2} />)}</div>
      <button disabled={!can} onClick={onNext} className={`w-full py-4 rounded-xl font-bold text-lg transition relative z-10 ${can ? "bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white shadow-lg shadow-purple-500/30" : "bg-zinc-800 text-zinc-500"}`}>CONTINUAR</button>
    </div>
  );
}

function Step6({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const { funnelId } = useFunnel();
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.whatsapp) { setErr("Completa todos los campos"); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/prospects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, pasoActual: 6, funnelId }) });
      const d = await r.json();
      if (d?.id) { localStorage.setItem(LS_PROSPECT, d.id); onNext(); } else setErr(d?.error ?? "Error");
    } catch { setErr("Error de red"); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 px-5 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <StepLabel n={6} />
      <Shield className="text-purple-400 mb-3" size={36} />
      <h2 className="font-display text-4xl text-white leading-none mb-2 relative z-10">{cfg.step6Title}</h2>
      <p className="text-white/60 mb-8 relative z-10">{cfg.step6Subtitle}</p>
      <form onSubmit={submit} className="space-y-3 relative z-10">
        <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Tu nombre" className="w-full px-4 py-4 bg-zinc-900 text-white placeholder-white/40 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-zinc-800" />
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Tu email" className="w-full px-4 py-4 bg-zinc-900 text-white placeholder-white/40 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-zinc-800" />
        <input value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp (con lada)" className="w-full px-4 py-4 bg-zinc-900 text-white placeholder-white/40 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 border border-zinc-800" />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-500/30 transition">{loading ? "VERIFICANDO..." : cfg.step6Cta}</button>
        <p className="text-white/40 text-xs text-center pt-2">🔒 Tus datos están seguros. No spam.</p>
      </form>
    </div>
  );
}

function Step7({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const [showWhats, setShowWhats] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  useEffect(() => {
    const lines = ["> Iniciando verificación...","> Conectando con servidor seguro...","> Validando email... OK","> Validando WhatsApp... OK","> Perfil verificado ✓","> Notificando al host..."];
    let i = 0;
    const t = setInterval(() => { setTerminalLines(p => [...p, lines[i]]); i++; if (i >= lines.length) { clearInterval(t); setTimeout(() => setShowWhats(true), 500); } }, 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="min-h-screen bg-black px-4 pt-14 pb-10 relative">
      <StepLabel n={7} />
      <div className="flex items-center gap-2 mb-3"><TerminalIcon className="text-emerald-500" /><h3 className="font-display text-2xl text-emerald-500">TERMINAL_SECURE</h3></div>
      <div className="bg-zinc-950 border border-emerald-500/30 rounded-lg p-4 font-mono text-sm text-emerald-400 mb-6 min-h-[160px]">{terminalLines.map((l, i) => <div key={i}>{l}</div>)}<span className="animate-pulse">_</span></div>
      <AnimatePresence>{showWhats && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0b141a] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 bg-[#202c33] p-3"><img src={cfg.step7AvatarUrl} className="w-10 h-10 rounded-full" alt="host" /><div><div className="text-white font-semibold">{cfg.step7HostName}</div><div className="text-emerald-400 text-xs">en línea</div></div></div>
          <div className="p-3 space-y-2">
            <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[80%] text-sm">{cfg.step7Msg1}</div>
            <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[80%] text-sm">{cfg.step7Msg2}</div>
            <div className="bg-[#005c4b] text-white p-3 rounded-lg max-w-[85%] flex items-center gap-3"><audio src={cfg.step7AudioUrl} controls className="flex-1" /></div>
            <div className="bg-[#202c33] text-white p-2 rounded-lg max-w-[80%] text-sm">{cfg.step7Msg3}</div>
          </div>
        </motion.div>)}
      </AnimatePresence>
      <div className="mt-6"><CTAButton onClick={onNext}>YA ESCUCHÉ EL AUDIO</CTAButton></div>
    </div>
  );
}

function SwipeUp({ title, subtitle, onNext, n }: { title: string; subtitle: string; onNext: () => void; n: number }) {
  return (
    <TikTokShell>
      <StepLabel n={n} />
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h2 className="font-display text-5xl text-emerald-500 text-center leading-none mb-4 whitespace-pre-line">{title}</h2>
        <p className="text-white/70 text-center mb-16">{subtitle}</p>
        <motion.button 
          onClick={onNext} 
          className="flex flex-col items-center"
        >
          {/* Badge with arrow animation */}
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50"
          >
            <ChevronUp className="w-8 h-8 text-white" />
            <span className="font-bold tracking-widest text-white text-base">DESLIZA PARA CONTINUAR</span>
            <ChevronUp className="w-6 h-6 text-white animate-bounce" style={{ animationDelay: "0.2s" }} />
          </motion.div>
        </motion.button>
      </div>
    </TikTokShell>
  );
}

function Step8({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* TikTok background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050d0d] via-black to-purple-950/30" />
      
      <div className="relative z-10 w-full max-w-sm">
        {/* TikTok Logo area */}
        <div className="text-center mb-12">
          <div className="text-5xl font-black text-white mb-2">TikTok</div>
          <p className="text-white/60 text-sm">{cfg.step8Title}</p>
        </div>

        {/* Warning */}
        <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-white text-xs">{cfg.step8WarningText}</p>
        </div>

        {/* Username field */}
        <div className="mb-4">
          <label className="text-white text-xs block mb-2">Nombre de usuario</label>
          <div className="relative">
            <input
              type="text"
              value={cfg.step8Username}
              readOnly
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition outline-none"
            />
          </div>
        </div>

        {/* Password field (simulated) */}
        <div className="mb-6">
          <label className="text-white text-xs block mb-2">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value="••••••••••••"
              readOnly
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 text-gray-400 hover:text-white text-sm"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 disabled:from-gray-700 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <Lock size={18} />
              Iniciar sesión
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-white/40 text-xs text-center mt-6">{cfg.step8Subtitle}</p>
      </div>
    </div>
  );
}

function VideoStep({ n, src, title, onNext }: { n: number; src: string; title?: string; onNext: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { audioUnlocked } = useFunnel();
  const [muted, setMuted] = useState(!audioUnlocked);
  const toggle = () => { const v = ref.current; if (!v) return; v.muted = !v.muted; setMuted(v.muted); if (!v.muted) v.play().catch(() => {}); };

  // When audioUnlocked and video is ready, try to unmute
  useEffect(() => {
    const v = ref.current;
    if (audioUnlocked && v) {
      v.muted = false;
      setMuted(false);
      v.play().catch(() => { v.muted = true; setMuted(true); });
    }
  }, [audioUnlocked]);

  return (
    <TikTokShell>
      <StepLabel n={n} />
      <div className="absolute inset-0 bg-black"><video ref={ref} src={src} autoPlay muted={muted} loop playsInline className="w-full h-full object-cover" onClick={toggle} /></div>
      {title && <div className="absolute top-12 left-0 right-0 z-30 px-4 text-center"><h2 className="font-display text-3xl text-emerald-500 drop-shadow-lg">{title}</h2></div>}
      <button onClick={toggle} className="absolute top-16 right-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white">{muted ? "🔇" : "🔊"}</button>
      <div className="absolute bottom-24 left-0 right-0 z-30 px-4"><CTAButton onClick={onNext}>CONTINUAR <ArrowRight className="inline ml-2" /></CTAButton></div>
    </TikTokShell>
  );
}

function MaybeVideo({ n, onNext, children }: { n: number; onNext: () => void; children: React.ReactNode }) {
  const cfg = useCfg();
  const src = cfg[`step${n}VideoUrl`];
  if (src) return <VideoStep n={n} src={src} onNext={onNext} />;
  return <>{children}</>;
}

function StepRenderer({ stepId, next, goTo }: { stepId: number; next: () => void; goTo: (n: number) => void }) {
  const cfg = useCfg();
  const videoSrc = cfg[`step${stepId}VideoUrl`];

  // Steps that are VIDEO-ONLY by nature (per PDF spec):
  // 2 = video hook, 10 = video presentación, 12 = video beneficios, 14 = video agendar
  // These render as VideoStep when they have a video URL
  const videoOnlySteps = new Set([2, 10, 12, 14]);
  if (videoOnlySteps.has(stepId) && videoSrc) {
    return <VideoStep n={stepId} src={videoSrc} onNext={stepId === 14 ? () => goTo(15) : next} />;
  }

  // "Desliza para continuar" steps (11, 13) — swipe up transitions
  const swipeSteps = new Set([11, 13]);
  if (swipeSteps.has(stepId)) {
    const title = cfg[`step${stepId}Title`] || "";
    const subtitle = cfg[`step${stepId}Subtitle`] || cfg[`step${stepId}Body`] || "";
    return <SwipeUp n={stepId} title={title} subtitle={subtitle} onNext={next} />;
  }

  // All other steps: keep native interactive UI
  switch (stepId) {
    case 1: return <Step1 onNext={next} />;
    case 3: return <Step3 onNext={next} />;
    case 4: return <Step4 onNext={next} />;
    case 5: return <Step5 onNext={next} />;
    case 6: return <Step6 onNext={next} />;
    case 7: return <Step7 onNext={next} />;
    case 8: return <Step8 onNext={next} />;
    case 9: return <Step9 onNext={next} />;
    case 15: return <Step15 onNext={next} />;
    case 16: return <Step16 onNext={next} />;
    case 17: return <Step17 onNext={next} />;
    case 18: return <Step18 onNext={next} />;
    case 19: return <Step19 onNext={next} />;
    default: return null;
  }
}

function Step9({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const [tapped, setTapped] = useState(false);
  const [volumeOn, setVolumeOn] = useState(false);

  const handleTap = () => {
    setTapped(true);
    setTimeout(() => onNext(), 1500);
  };

  return (
    <TikTokShell>
      <StepLabel n={9} />
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex flex-col relative overflow-hidden">
        {/* Top tabs */}
        <div className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-purple-500/20 pt-4 pb-2">
          <div className="flex justify-around text-white/60 text-sm font-medium">
            <span className="text-purple-400 border-b-2 border-purple-400 pb-2">LIVE</span>
            <span className="pb-2">Explorar</span>
            <span className="pb-2">Siguiendo</span>
            <span className="pb-2">Para ti</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4">
          {/* Animated center circle */}
          <motion.div
            animate={{ scale: tapped ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-magenta-600 rounded-full blur-2xl opacity-50" />
            <button
              onClick={handleTap}
              className="relative w-32 h-32 rounded-full bg-gradient-to-b from-purple-600 to-magenta-700 shadow-2xl shadow-purple-500/50 flex items-center justify-center"
            >
              <Play className="w-12 h-12 text-white fill-white" />
            </button>
          </motion.div>

          {/* Main CTA */}
          <h1 className="font-display text-4xl text-white text-center mt-8 mb-2">
            {cfg.step9Title}
          </h1>
          <p className="text-white/60 text-center text-sm">{cfg.step9Subtitle}</p>

          {/* Sound/Video toggle */}
          <div className="mt-12 flex gap-6">
            <button
              onClick={() => setVolumeOn(!volumeOn)}
              className={`flex flex-col items-center gap-2 transition ${
                volumeOn ? "text-purple-400" : "text-white/60 hover:text-white"
              }`}
            >
              {volumeOn ? (
                <Play className="w-8 h-8 fill-current" />
              ) : (
                <Pause className="w-8 h-8" />
              )}
              <span className="text-xs font-medium">Sonido</span>
            </button>

            <button className="flex flex-col items-center gap-2 text-purple-400">
              <video className="w-8 h-8" />
              <span className="text-xs font-medium">Video</span>
            </button>
          </div>
        </div>

        {/* Bottom action indicator */}
        {!tapped && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-20 left-0 right-0 text-center text-purple-300 text-sm font-medium"
          >
            ↑ Tap para iniciar ↑
          </motion.div>
        )}

        {/* Success indicator */}
        {tapped && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur"
          >
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-purple-400 mx-auto mb-3" />
              <p className="text-white font-bold">¡Iniciado!</p>
            </div>
          </motion.div>
        )}
      </div>
    </TikTokShell>
  );
}
function Step10({ onNext }: { onNext: () => void }) { const cfg = useCfg(); return <SwipeUp n={10} title={cfg.step10Title} subtitle={cfg.step10Subtitle} onNext={onNext} />; }
function Step11({ onNext }: { onNext: () => void }) { const cfg = useCfg(); return <VideoStep n={11} src={cfg.step11VideoUrl} title={cfg.step11Title} onNext={onNext} />; }
function Step12({ onNext }: { onNext: () => void }) { const cfg = useCfg(); return <SwipeUp n={12} title={cfg.step12Title} subtitle={cfg.step12Subtitle} onNext={onNext} />; }

function Step13({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] via-purple-950/20 to-[#050d0d] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={13} />
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="relative z-10 animate-bounce mb-4">
        <CheckCircle2 className="text-purple-400" size={80} />
      </div>
      <h2 className="font-display text-5xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent text-center leading-none mb-4 whitespace-pre-line relative z-10">{cfg.step13Title}</h2>
      <p className="text-white/80 text-center mb-10 max-w-sm relative z-10">{cfg.step13Body}</p>
      <div className="w-full max-w-sm relative z-10"><CTAButton onClick={onNext}>{cfg.step13Cta}</CTAButton></div>
    </div>
  );
}

function Step14({ goTo }: { goTo: (n: number) => void }) {
  const cfg = useCfg();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={14} />
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <h2 className="font-display text-3xl text-white text-center mb-2 relative z-10">{cfg.step14Title}</h2>
      <p className="text-white/60 text-center mb-12 text-sm relative z-10">{cfg.step14Subtitle}</p>
      <div className="flex gap-6 relative z-10">
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => goTo(15)} className="flex flex-col items-center"><div className="w-32 h-20 rounded-full bg-gradient-to-b from-red-600 to-red-800 shadow-2xl shadow-red-500/50 mb-3" /><span className="text-red-400 font-bold">VERDAD</span></motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => goTo(15)} className="flex flex-col items-center"><div className="w-32 h-20 rounded-full bg-gradient-to-b from-purple-600 to-magenta-700 shadow-2xl shadow-purple-500/50 mb-3" /><span className="text-purple-300 font-bold">MAGIA</span></motion.button>
      </div>
      <p className="text-white/40 text-center mt-12 text-xs max-w-xs relative z-10">Ambos caminos te llevan al mismo lugar.</p>
    </div>
  );
}

function Step15({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] to-purple-950/20 px-5 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <StepLabel n={15} />
      <img src={cfg.step15HeroUrl} alt="hero" className="w-full rounded-2xl mb-6 shadow-2xl shadow-purple-500/20 relative z-10" />
      <h2 className="font-display text-4xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent leading-none mb-3 relative z-10">{cfg.step15Title}</h2>
      <p className="text-white/80 mb-4 relative z-10">{cfg.step15Body}</p>
      <div className="space-y-2 mb-6 relative z-10">{(cfg.step15Benefits || []).map((b: string, i: number) => (
        <div key={i} className="flex items-start gap-2"><CheckCircle2 className="text-purple-400 flex-shrink-0 mt-0.5" size={20} /><span className="text-white/90">{b}</span></div>
      ))}</div>
      <a href={cfg.calendarUrl} target="_blank" rel="noreferrer" onClick={() => setTimeout(onNext, 300)} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-purple-500/30 mb-3 relative z-10 transition">
        <Calendar size={22} /> {cfg.step15Cta}
      </a>
      <button onClick={onNext} className="w-full py-3 text-white/60 text-sm hover:text-white relative z-10">Ya agendé, continuar →</button>
    </div>
  );
}

function Step16({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const url = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage)}`;
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] via-purple-950/20 to-[#050d0d] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={16} />
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="relative z-10 mb-4">
        <AlertTriangle className="text-yellow-500" size={56} />
      </div>
      <h2 className="font-display text-4xl text-white text-center leading-none mb-3 whitespace-pre-line relative z-10">{cfg.step16Title}</h2>
      <p className="text-white/70 text-center mb-10 max-w-sm relative z-10">{cfg.step16Body}</p>
      <a href={url} target="_blank" rel="noreferrer" onClick={() => setTimeout(onNext, 600)} className="flex items-center justify-center gap-2 w-full max-w-sm py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-green-500/30 relative z-10 transition">
        <MessageSquare size={22} /> {cfg.step16Cta}
      </a>
      <button onClick={onNext} className="mt-4 text-white/40 text-sm hover:text-white relative z-10">Ya envié el mensaje →</button>
    </div>
  );
}

function Step17({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] via-purple-950/20 to-[#050d0d] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <StepLabel n={17} />
      {/* Background glow */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative z-10">
        <div className="w-32 h-32 rounded-full bg-gradient-primary/30 flex items-center justify-center mb-6"><Shield className="w-20 h-20 text-purple-400" /></div>
      </motion.div>
      <h2 className="font-display text-5xl bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent text-center leading-none mb-3 whitespace-pre-line relative z-10">{cfg.step17Title}</h2>
      <p className="text-white text-center text-lg mb-2 relative z-10">{cfg.step17Body}</p>
      <p className="text-white/60 text-center max-w-sm relative z-10">{cfg.step17Footer}</p>
      <div className="flex items-center gap-2 mt-10 text-white/40 text-xs relative z-10"><Heart size={14} className="text-red-500" /><span>Gracias</span></div>
      <button onClick={onNext} className="absolute bottom-6 left-6 right-6 py-3 bg-gradient-to-r from-purple-600 to-magenta-600 hover:from-purple-700 hover:to-magenta-700 text-white font-bold rounded-xl transition relative z-10">CONTINUAR</button>
    </div>
  );
}

function Step18({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const [phase, setPhase] = useState<"q1" | "q2" | "success">("q1");
  const [a1, setA1] = useState<string | null>(null);
  const [a2, setA2] = useState<string | null>(null);
  const waUrl = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(cfg.whatsappMessage || "Quiero validar mi compromiso")}`;

  const Opt = ({ label, sel, onSel }: any) => (
    <button onClick={() => onSel(label)} className={`w-full py-4 px-4 rounded-xl mb-3 text-left transition font-bold ${sel === label ? "bg-gradient-to-r from-purple-600 to-magenta-600 text-white shadow-lg shadow-purple-500/30" : "bg-zinc-900 text-white/80 hover:bg-zinc-800 border border-purple-500/30"}`}>{label}</button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] via-purple-950/30 to-[#050d0d] px-5 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="absolute top-10 right-0 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <StepLabel n={18} />
      <div className="max-w-sm mx-auto relative z-10">
        <h2 className="font-display text-3xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent text-center mb-6">{cfg.step18Title}</h2>

        {phase === "q1" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white font-bold mb-4 text-center">{cfg.step18Q1}</p>
            {(cfg.step18Q1Options || []).map((o: string) => <Opt key={o} label={o} sel={a1} onSel={setA1} />)}
            <button disabled={!a1} onClick={() => setPhase("q2")} className={`w-full mt-4 py-4 rounded-xl font-bold transition ${a1 ? "bg-gradient-to-r from-purple-600 to-magenta-600 text-white shadow-lg shadow-purple-500/40" : "bg-zinc-800 text-zinc-500"}`}>SIGUIENTE</button>
          </motion.div>
        )}

        {phase === "q2" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-white font-bold mb-4 text-center">{cfg.step18Q2}</p>
            {(cfg.step18Q2Options || []).map((o: string) => <Opt key={o} label={o} sel={a2} onSel={setA2} />)}
            <button disabled={!a2} onClick={() => setPhase("success")} className={`w-full mt-4 py-4 rounded-xl font-bold transition ${a2 ? "bg-gradient-to-r from-purple-600 to-magenta-600 text-white shadow-lg shadow-purple-500/40" : "bg-zinc-800 text-zinc-500"}`}>VALIDAR</button>
          </motion.div>
        )}

        {phase === "success" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-display text-4xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent mb-2">{cfg.step18SuccessTitle}</h3>
            <p className="text-purple-200 font-bold text-lg mb-6">{cfg.step18SuccessSubtitle}</p>
            <div className="bg-gradient-dark border border-purple-500/30 rounded-xl p-4 mb-6 text-left text-white/80 text-sm space-y-2">
              <p><span className="text-purple-400">✓</span> Compromiso: {a1}</p>
              <p><span className="text-purple-400">✓</span> Inversión: {a2}</p>
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setTimeout(onNext, 800)} className="w-full inline-flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/40 transition">
              <MessageSquare size={20} /> {cfg.step18Cta}
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Step19({ onNext }: { onNext: () => void }) {
  const cfg = useCfg();
  const { userWhatsappNumber } = useFunnel();
  const whatsappNumber = userWhatsappNumber || cfg.whatsappNumber || "+524451057305";
  const message = cfg.step19PrefilledMessage || cfg.whatsappMessage || "Hola, acabo de completar el diagnóstico.";
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Auto-redirección a WhatsApp tras un breve delay
    const t = setTimeout(() => {
      try { window.open(waUrl, "_blank"); setOpened(true); } catch {}
    }, 1500);
    return () => clearTimeout(t);
  }, [waUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d0d] via-purple-950/30 to-[#050d0d] px-6 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute top-10 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <StepLabel n={19} />
      <div className="max-w-sm mx-auto relative z-10">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/40">
            <MessageSquare className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="font-display text-4xl bg-gradient-to-r from-purple-400 to-magenta-400 bg-clip-text text-transparent mb-3">{cfg.step19Title}</h2>
          <p className="text-white/80 mb-2">{cfg.step19Subtitle}</p>
          {opened && <p className="text-emerald-400 text-sm font-bold animate-pulse">✓ WhatsApp abierto en otra pestaña</p>}
        </div>

        <div className="bg-gradient-dark border border-purple-500/30 rounded-xl p-4 mb-6">
          <p className="text-purple-300 text-xs uppercase tracking-widest mb-2">Mensaje preconfigurado</p>
          <p className="text-white text-sm italic">"{message}"</p>
        </div>

        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/40 transition">
          <MessageSquare size={20} /> {cfg.step19Cta}
        </a>
        <p className="text-xs text-white/50 text-center mt-4">{cfg.step19Footer}</p>
      </div>
    </div>
  );
}
