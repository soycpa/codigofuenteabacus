"use client";
import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { defaultFunnelConfig, ALL_MODULES, FunnelConfig } from "@/config/funnel-config";

type Ctx = {
  config: FunnelConfig & Record<string, any>;
  modules: number[];
  funnelId?: string | null;
  funnelSlug?: string | null;
  userWhatsappNumber?: string | null;
  audioUnlocked: boolean;
  unlockAudio: () => void;
};

const FunnelCtx = createContext<Ctx>({
  config: defaultFunnelConfig,
  modules: ALL_MODULES,
  funnelId: null,
  funnelSlug: null,
  userWhatsappNumber: null,
  audioUnlocked: false,
  unlockAudio: () => {},
});

export function FunnelProvider({
  children,
  config,
  modules,
  funnelId,
  funnelSlug,
  userWhatsappNumber,
}: {
  children: ReactNode;
  config?: any;
  modules?: number[];
  funnelId?: string | null;
  funnelSlug?: string | null;
  userWhatsappNumber?: string | null;
}) {
  const merged = { ...defaultFunnelConfig, ...(config || {}) };
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const unlockAudio = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      // Play + immediately pause a silent audio to unlock the Web Audio context
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        ctx.resume();
      } catch {}
    }
  }, [audioUnlocked]);

  return (
    <FunnelCtx.Provider
      value={{
        config: merged,
        modules: modules?.length ? modules : ALL_MODULES,
        funnelId: funnelId ?? null,
        funnelSlug: funnelSlug ?? null,
        userWhatsappNumber: userWhatsappNumber ?? null,
        audioUnlocked,
        unlockAudio,
      }}
    >
      {children}
    </FunnelCtx.Provider>
  );
}

export const useFunnel = () => useContext(FunnelCtx);
