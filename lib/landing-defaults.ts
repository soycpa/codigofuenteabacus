// Contenido por defecto de la plantilla de landing para agentes de seguros.
// Editable por el admin (Onofre) desde el panel admin.
// Los textos aquí son los que se sincronizan al pulsar "Actualizar contenido".

export type LandingContent = {
  topbarMessage: string;
  badgeText: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroDescription: string;
  ctaPrimary: string;
  ctaSecondary: string;
  badge1: string;
  badge2: string;
  badge3: string;
  yearsExp: string;
  attentionText: string;
  benefitsKicker: string;
  benefitsTitle: string;
  benefitsTitleHighlight: string;
  benefitsIntro: string;
  benefitsNote: string;
  benefit1Title: string;
  benefit1Desc: string;
  benefit2Title: string;
  benefit2Desc: string;
  benefit3Title: string;
  benefit3Desc: string;
  quote: string;
  scenariosKicker: string;
  scenariosTitle: string;
  scenariosTitleHighlight: string;
  scenariosIntro: string;
  scenario1Title: string;
  scenario1Desc: string;
  scenario2Title: string;
  scenario2Desc: string;
  scenario3Title: string;
  scenario3Desc: string;
  howKicker: string;
  howTitle: string;
  howTitleHighlight: string;
  howIntro: string;
  howEvent1: string;
  howEvent2: string;
  howEvent3: string;
  howEvent4: string;
  howEvent5: string;
  howUse1: string;
  howUse2: string;
  howUse3: string;
  howUse4: string;
  testimonialsKicker: string;
  testimonialsTitle: string;
  testimonial1Cat: string;
  testimonial1Quote: string;
  testimonial1Desc: string;
  testimonial2Cat: string;
  testimonial2Quote: string;
  testimonial2Desc: string;
  testimonial3Cat: string;
  testimonial3Quote: string;
  testimonial3Desc: string;
  contactKicker: string;
  contactTitle: string;
  contactDescription: string;
  formNamePlaceholder: string;
  formEmailPlaceholder: string;
  formPhonePlaceholder: string;
  formMessagePlaceholder: string;
  formButton: string;
  footerTagline: string;
};

export const DEFAULT_LANDING_CONTENT: LandingContent = {
  topbarMessage: "Agente Certificado \u00b7 Asesor\u00eda 1 a 1",
  badgeText: "Agente Certificado de Seguros",
  heroTitleLine1: "Seguro de Vida",
  heroTitleHighlight: "con Beneficios",
  heroTitleLine2: "en Vida",
  heroDescription: "Tu seguro de vida que tambi\u00e9n te ayuda cuando la vida se complica. Un solo plan que puede darte dinero en caso de enfermedad, apoyar tu retiro y dejar un legado a tu familia.",
  ctaPrimary: "Quiero una cotizaci\u00f3n",
  ctaSecondary: "Hablar ahora",
  badge1: "Agente certificado",
  badge2: "Beneficios en vida",
  badge3: "Atenci\u00f3n personalizada",
  yearsExp: "10+",
  attentionText: "Atenci\u00f3n 1 a 1",
  benefitsKicker: "Seguro de vida con beneficios en vida",
  benefitsTitle: "Tu seguro de vida que tambi\u00e9n te ayuda",
  benefitsTitleHighlight: "cuando la vida se complica.",
  benefitsIntro: "Un solo plan que puede darte dinero en caso de enfermedad, apoyar tu retiro y dejar un legado a tu familia.",
  benefitsNote: "Sin compromiso. Te explico con ejemplos reales y con n\u00fameros claros.",
  benefit1Title: "Acceso a dinero en vida",
  benefit1Desc: "En caso de enfermedad grave, cr\u00f3nica o terminal puedes adelantar parte del beneficio para cubrir lo que necesites.",
  benefit2Title: "Protecci\u00f3n para el retiro",
  benefit2Desc: "Puedes usarlo para lo que de verdad necesites: salud, deudas, familia o casa.",
  benefit3Title: "Legado familiar s\u00f3lido",
  benefit3Desc: "Beneficios en vida incluidos sin costo adicional en la p\u00f3liza.",
  quote: "No es solo un seguro para cuando faltas; es una red de apoyo mientras est\u00e1s vivo.",
  scenariosKicker: "Escenarios clave",
  scenariosTitle: "Cuando la vida cambia,",
  scenariosTitleHighlight: "tu seguro responde.",
  scenariosIntro: "Tres situaciones pueden desestabilizar tus finanzas: una enfermedad fuerte, vivir muchos a\u00f1os sin ahorro suficiente o una muerte inesperada. Este plan est\u00e1 pensado para esas tres.",
  scenario1Title: "Enfermarte y no tener c\u00f3mo cubrir todo",
  scenario1Desc: "Un diagn\u00f3stico complicado llega con costos m\u00e9dicos, traslados y tiempo sin trabajar. Aqu\u00ed puedes adelantar parte del beneficio para enfrentar ese momento.",
  scenario2Title: "Vivir muchos a\u00f1os sin ahorro suficiente",
  scenario2Desc: "La p\u00f3liza puede generar valor en efectivo y ayudarte a complementar tus ingresos en la jubilaci\u00f3n.",
  scenario3Title: "Proteger a tu familia si t\u00fa faltas",
  scenario3Desc: "El beneficio por fallecimiento da tranquilidad financiera a las personas que m\u00e1s quieres.",
  howKicker: "Proceso",
  howTitle: "\u00bfC\u00f3mo funciona",
  howTitleHighlight: "en la pr\u00e1ctica?",
  howIntro: "A trav\u00e9s de cl\u00e1usulas llamadas beneficios acelerados, puedes adelantar parte del beneficio si se presenta un evento que califica.",
  howEvent1: "Enfermedad terminal con pron\u00f3stico de vida limitado.",
  howEvent2: "Enfermedad cr\u00f3nica que impide actividades b\u00e1sicas del d\u00eda.",
  howEvent3: "Enfermedad grave como c\u00e1ncer, infarto o insuficiencia renal.",
  howEvent4: "Lesi\u00f3n grave: coma, par\u00e1lisis o lesi\u00f3n cerebral.",
  howEvent5: "Diagn\u00f3stico calificado de Alzheimer o demencia.",
  howUse1: "Pagar tratamientos, estudios, medicamentos o terapias.",
  howUse2: "Cubrir gastos del hogar, renta, hipoteca o deudas.",
  howUse3: "Contratar cuidadores o adaptar tu hogar.",
  howUse4: "Apoyar a tu familia mientras no puedes generar ingresos.",
  testimonialsKicker: "Historias reales",
  testimonialsTitle: "Tres ejemplos de c\u00f3mo puede ayudarte tu p\u00f3liza.",
  testimonial1Cat: "Enfermedad grave",
  testimonial1Quote: "Pude enfocarme en mi salud, no en las cuentas.",
  testimonial1Desc: "Ante un diagn\u00f3stico complicado, la asegurada adelant\u00f3 parte de su beneficio y lo us\u00f3 para tratamientos sin endeudarse.",
  testimonial2Cat: "Enfermedad cr\u00f3nica",
  testimonial2Quote: "Adaptamos la casa y contratamos apoyo.",
  testimonial2Desc: "Al no poder realizar actividades b\u00e1sicas, el asegurado utiliz\u00f3 los recursos para adaptar su hogar y contratar cuidadores.",
  testimonial3Cat: "Retiro e ingresos",
  testimonial3Quote: "Mi p\u00f3liza tambi\u00e9n es parte de mi plan de jubilaci\u00f3n.",
  testimonial3Desc: "Con los a\u00f1os, la p\u00f3liza genera valor en efectivo y se convierte en una fuente adicional de dinero en la jubilaci\u00f3n.",
  contactKicker: "Cont\u00e1ctame",
  contactTitle: "Solicita tu cotizaci\u00f3n sin compromiso",
  contactDescription: "D\u00e9jame tus datos y te contacto a la brevedad para resolver todas tus dudas y mostrarte n\u00fameros claros.",
  formNamePlaceholder: "Tu nombre completo",
  formEmailPlaceholder: "Tu correo electr\u00f3nico",
  formPhonePlaceholder: "Tu tel\u00e9fono / WhatsApp",
  formMessagePlaceholder: "\u00bfEn qu\u00e9 te puedo ayudar? (opcional)",
  formButton: "Enviar a WhatsApp",
  footerTagline: "Asesor\u00eda profesional, transparente y personalizada.",
};

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  bg: string;
  bgSoft: string;
  text: string;
  textSoft: string;
  border: string;
};

export const THEMES: Record<string, { name: string; colors: ThemeColors }> = {
  azul: {
    name: "Azul Profesional",
    colors: {
      primary: "#0EA5E9",
      primaryDark: "#0284C7",
      primaryLight: "#38BDF8",
      bg: "#FFFFFF",
      bgSoft: "#F0F9FF",
      text: "#0F172A",
      textSoft: "#475569",
      border: "#E0F2FE",
    },
  },
  verde: {
    name: "Verde Confianza",
    colors: {
      primary: "#10B981",
      primaryDark: "#059669",
      primaryLight: "#34D399",
      bg: "#FFFFFF",
      bgSoft: "#ECFDF5",
      text: "#0F172A",
      textSoft: "#475569",
      border: "#D1FAE5",
    },
  },
  rojo: {
    name: "Rojo Energ\u00eda",
    colors: {
      primary: "#EF4444",
      primaryDark: "#DC2626",
      primaryLight: "#F87171",
      bg: "#FFFFFF",
      bgSoft: "#FEF2F2",
      text: "#0F172A",
      textSoft: "#475569",
      border: "#FEE2E2",
    },
  },
};

export function getDefaultPersonalData(opts?: { isOnofre?: boolean }) {
  if (opts?.isOnofre) {
    return {
      fullName: "Onofre L\u00f3pez",
      profession: "Agente de Seguros de Vida",
      aboutMe: "Soy agente certificado especializado en seguros de vida con beneficios en vida. Mi compromiso es traducir las cl\u00e1usulas en ejemplos claros para que entiendas exactamente c\u00f3mo tu p\u00f3liza puede ayudarte a ti y a tu familia.",
      callPhone: "+13466257777",
      whatsappPhone: "+13466257777",
      contactEmail: "contacto@onofrelopez.com",
      city: "Houston, TX",
    };
  }
  return {
    fullName: "",
    profession: "Agente de Seguros",
    aboutMe: "Soy agente de seguros y mi compromiso es ayudarte a entender y elegir la mejor protecci\u00f3n para ti y tu familia, con asesor\u00eda clara y personalizada.",
    callPhone: "",
    whatsappPhone: "",
    contactEmail: "",
    city: "",
  };
}
