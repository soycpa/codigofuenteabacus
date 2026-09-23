import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function PublicUserFunnel({ params }: { params: { username: string } }) {
  const user = await prisma.user.findFirst({
    where: { username: params.username },
  });

  if (!user) {
    return notFound();
  }

  // Redirigir al paso 1 del embudo del usuario
  redirect(`/embudo/${params.username}/1`);
}