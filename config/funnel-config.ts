/**
 * CONFIGURACIÓN POR DEFECTO DEL EMBUDO
 * Todos los textos, URLs y contenidos son editables desde el panel de usuario.
 * Esta es la plantilla inicial que se asigna a cada nuevo embudo.
 */

export const defaultFunnelConfig = {
  // Branding
  brandName: "ONOFRE LÓPEZ",
  logoUrl: "https://placehold.co/200x80/000000/22C55E?text=TU+LOGO",
  niche: "seguros", // seguros | productos | servicios | coaching | otro

  // Videos verticales por paso (autoplay/muted/loop/playsInline). Subidos por el admin/usuario.
  // step2VideoUrl, step11VideoUrl y step18VideoUrl ya existen más abajo en su sección original.
  step1VideoUrl: "",
  step3VideoUrl: "",
  step4VideoUrl: "",
  step5VideoUrl: "",
  step6VideoUrl: "",
  step7VideoUrl: "",
  step8VideoUrl: "",
  step9VideoUrl: "",
  step10VideoUrl: "",
  step12VideoUrl: "",
  step13VideoUrl: "",
  step14VideoUrl: "",
  step15VideoUrl: "",
  step16VideoUrl: "",
  step17VideoUrl: "",
  step19VideoUrl: "",

  // Paso 1
  step1Title: "INICIAR EXPERIENCIA",
  step1Subtitle: "Toca para desbloquear",
  step1Footer: "© ONOFRE LÓPEZ",

  // Paso 2 - Video gancho
  step2VideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  step2Cta: "VER QUÉ PASA",

  // Paso 3 - Llamada
  step3CallerName: "EL GUARDIÁN",
  step3CallerLabel: "móvil",
  step3AvatarUrl: "https://placehold.co/300x300/22C55E/000000?text=AVATAR",

  // Paso 4 - Audio
  step4Title: "EL GUARDIÁN",
  step4AudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  step4Quote: "Vas a cambiar el futuro de tu familia",

  // Paso 5 - Encuesta
  step5Title: "RESPONDE 2 PREGUNTAS",
  step5Q1: "¿Eres una persona de familia?",
  step5Q1Options: ["Sí, mi familia es todo", "Aún no, pero pronto", "No realmente"],
  step5Q2: "¿Sabes qué pasaría con ellos si no pudieras trabajar mañana?",
  step5Q2Options: ["Sí, están protegidos", "No estoy seguro(a)", "No, y eso me preocupa"],

  // Paso 6 - Formulario
  step6Title: "VERIFICA TU PERFIL",
  step6Subtitle: "Para activar tu acceso",
  step6Cta: "ACTIVAR MI ACCESO",

  // Paso 7 - WhatsApp
  step7HostName: "Onofre López",
  step7AvatarUrl: "https://placehold.co/200x200/22C55E/FFFFFF?text=HOST",
  step7Msg1: "¡Hola! Vi que activaste tu acceso 🙌",
  step7Msg2: "Te dejo un audio importante 👇",
  step7Msg3: "Cuando termines, dale al botón verde 👇",
  step7AudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",

  // Paso 8 - TikTok Login
  step8Title: "ACCESO PRIVADO",
  step8Subtitle: "Aquí empieza un punto sin retorno",
  step8Username: "usuario_11_11",
  step8WarningText: "Credenciales generadas automáticamente. Tu acceso es único. No lo compartas.",

  // Paso 9 - Tap para iniciar
  step9Title: "TAP PARA INICIAR",
  step9Subtitle: "ACTIVAR SONIDO Y VIDEO",

  // Paso 10 - Swipe
  step10Title: "EL ESCUDO INVISIBLE",
  step10Subtitle: "Lo entendiste. Ahora viene lo mejor.",

  // Paso 11 - Video beneficios
  step11Title: "PROTECCIÓN EN VIDA",
  step11VideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",

  // Paso 12 - Swipe
  step12Title: "TU PROTECCIÓN ACTIVADA",
  step12Subtitle: "Funciona mientras vives. No solo después.",

  // Paso 13 - Fase completada
  step13Title: "FASE COMPLETADA",
  step13Body: "Has descubierto el escudo. Ahora protege a tu familia.",
  step13Cta: "TOMAR DECISIÓN",

  // Paso 14 - Pastillas
  step14Title: "ELIGE TU PASTILLA",
  step14Subtitle: "Una decisión. Un destino.",

  // Paso 15 - Landing
  step15HeroUrl: "https://placehold.co/800x400/000000/22C55E?text=PROTEGE+TU+FAMILIA",
  step15Title: "PROTEGE A TU FAMILIA HOY",
  step15Body: "Imagina poder dormir tranquilo sabiendo que pase lo que pase, tu familia está protegida.",
  step15Benefits: [
    "Beneficios mientras vives, no solo después",
    "Cobertura por enfermedades graves",
    "Plan de retiro y ahorro integrado",
    "Asesoría personalizada"
  ],
  step15Cta: "AGENDAR MI CONSULTORÍA",
  calendarUrl: "https://calendly.com/onofrelopez/consultoria",

  // Paso 16 - WhatsApp
  step16Title: "¿ESTÁS COMPROMETIDO?",
  step16Body: "Confirma tu compromiso enviando un mensaje directo por WhatsApp.",
  step16Cta: "ENVIAR WHATSAPP",
  whatsappNumber: "5215512345678",
  whatsappMessage: "Hola, vi tu video y quiero más información.",

  // Paso 17 - Final
  step17Title: "ESCUDO ACTIVADO",
  step17Body: "Tu compromiso está confirmado.",
  step17Footer: "Nos pondremos en contacto contigo muy pronto.",

  // Paso 18 - Compromiso y presupuesto (PDF spec)
  step18Title: "COMPROMISO Y PRESUPUESTO",
  step18Q1: "¿Te comprometes a reservar 30 minutos para tu sesión de diagnóstico?",
  step18Q1Options: ["SÍ ME COMPROMETO", "NO ESTOY SEGURO"],
  step18Q2: "¿Cuál es tu nivel de inversión?",
  step18Q2Options: [
    "INVERSIÓN DECISIVA: $500+",
    "PRESUPUESTO ESTÁNDAR: $250-500",
    "PRESUPUESTO DE ARRANQUE: $100-250"
  ],
  step18SuccessTitle: "¡FELICIDADES!",
  step18SuccessSubtitle: "ERES UN CANDIDATO ÓPTIMO",
  step18Cta: "VALIDAR POR WHATSAPP",

  // Paso 19 - Fin del embudo + redirección automática a WhatsApp (PDF spec)
  step19Title: "FIN DEL EMBUDO",
  step19Subtitle: "Abriendo WhatsApp con tu acceso prioritario...",
  step19PrefilledMessage: "Hola, acabo de completar el diagnóstico y quiero solicitar mi acceso prioritario a la Franquicia RESET.",
  step19Cta: "ABRIR WHATSAPP AHORA",
  step19Footer: "Si WhatsApp no se abre automáticamente, toca el botón.",

  // Contadores TikTok
  socialCounters: {
    likes: "121.8K",
    comments: "57.4K",
    saves: "89.3K",
    shares: "34.2K",
  },
};

export type FunnelConfig = typeof defaultFunnelConfig;

// Mantener export legacy para compatibilidad
export const funnelConfig = {
  ...defaultFunnelConfig,
  videoHookUrl: defaultFunnelConfig.step2VideoUrl,
  guardianAvatarUrl: defaultFunnelConfig.step3AvatarUrl,
  audioCallUrl: defaultFunnelConfig.step4AudioUrl,
  onofreAvatarUrl: defaultFunnelConfig.step7AvatarUrl,
  whatsappAudioUrl: defaultFunnelConfig.step7AudioUrl,
  videoProteccionUrl: defaultFunnelConfig.step11VideoUrl,
  landingHeroUrl: defaultFunnelConfig.step15HeroUrl,
};

// Los 19 pasos totales disponibles
export const ALL_MODULES = Array.from({ length: 19 }, (_, i) => i + 1);

// Por defecto, se activan los pasos 1-17 (18 y 19 son opcionales)
export const DEFAULT_MODULES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export const MODULE_LABELS: Record<number, string> = {
  1: "Hook inicial (logo + botón desbloquear)",
  2: "Video gancho TikTok",
  3: "Llamada simulada entrante",
  4: "Audio de bienvenida",
  5: "Encuesta 2 preguntas",
  6: "Formulario de captura (REQUERIDO)",
  7: "Terminal + WhatsApp simulado con audio",
  8: "Ventana TikTok login (credenciales)",
  9: "Tap para iniciar (red social simulada)",
  10: "Video presentación principal",
  11: "Video beneficios",
  12: "Swipe transición 1",
  13: "Fase completada",
  14: "Decisión píldoras (Matrix)",
  15: "Landing + agendar cita",
  16: "Compromiso WhatsApp",
  17: "Pantalla final de gracias",
  18: "Compromiso y presupuesto [OPCIONAL]",
  19: "Fin del embudo + WhatsApp prioritario [OPCIONAL]",
};
