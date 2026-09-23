import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse("No autorizado", { status: 401 });
  const prospects = await prisma.prospect.findMany({ orderBy: { timestampInicio: "desc" } });
  const headers = ["id", "nombre", "email", "whatsapp", "paso_actual", "timestamp_inicio", "updated_at"];
  const rows = prospects.map((p) => [
    p.id, p.nombre, p.email, p.whatsapp, p.pasoActual,
    p.timestampInicio.toISOString(), p.updatedAt.toISOString(),
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="prospectos-${Date.now()}.csv"`,
    },
  });
}
