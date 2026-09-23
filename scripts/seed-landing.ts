import { PrismaClient } from "@prisma/client";
import { DEFAULT_LANDING_CONTENT, THEMES, getDefaultPersonalData } from "../lib/landing-defaults";

const prisma = new PrismaClient();

async function main() {
  // 1) Plantillas de los 3 temas
  for (const [themeKey, theme] of Object.entries(THEMES)) {
    await prisma.landingTemplate.upsert({
      where: { themeKey },
      update: {
        name: theme.name,
        colors: theme.colors as any,
        // No sobreescribir contenido si ya existe (para preservar ediciones de Onofre)
      },
      create: {
        themeKey,
        name: theme.name,
        version: 1,
        content: DEFAULT_LANDING_CONTENT as any,
        colors: theme.colors as any,
      },
    });
    console.log(`✓ Plantilla ${themeKey} lista`);
  }

  // 2) UserLanding para Onofre
  const onofre = await prisma.user.findUnique({ where: { email: "admin@onofrelopez.com" } });
  if (onofre) {
    const personal = getDefaultPersonalData({ isOnofre: true });
    await prisma.userLanding.upsert({
      where: { userId: onofre.id },
      update: {},
      create: {
        userId: onofre.id,
        ...personal,
        themeKey: "azul",
        sourceTemplateKey: "azul",
        templateContent: DEFAULT_LANDING_CONTENT as any,
        templateVersion: 1,
      },
    });
    console.log("✓ UserLanding de Onofre creado");
  }

  console.log("\u2705 Seed de landing completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
