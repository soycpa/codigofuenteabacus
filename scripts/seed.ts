import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { email: "john@doe.com", password: "johndoe123", name: "Test Admin", role: "admin", whatsappNumber: "+524451057305" },
    { email: "admin@onofrelopez.com", password: "admin123456", name: "Onofre Admin", role: "admin", whatsappNumber: "+524451057305" },
    { email: "soporte@marketia.live", password: "soporte123456", name: "Soporte", role: "admin", whatsappNumber: "+524451057305" },
  ];
  for (const a of accounts) {
    const hashed = await bcrypt.hash(a.password, 10);
    await prisma.user.upsert({
      where: { email: a.email },
      update: { role: a.role, subscriptionActive: true, whatsappNumber: a.whatsappNumber },
      create: { email: a.email, password: hashed, name: a.name, role: a.role, subscriptionActive: true, whatsappNumber: a.whatsappNumber },
    });
  }
  await prisma.appSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1, price: 15, currency: "USD" } });
  console.log("Seed OK");
}

main().finally(() => prisma.$disconnect());
