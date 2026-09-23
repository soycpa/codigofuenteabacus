import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's landing
    const userLanding = await prisma.userLanding.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!userLanding) {
      return NextResponse.json({ leads: [] });
    }

    // Get all leads for this landing
    const leads = await prisma.landingLead.findMany({
      where: { userLandingId: userLanding.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        genero: true,
        fechaNacimiento: true,
        fuma: true,
        estado: true,
        pagoDeseado: true,
        email: true,
        whatsapp: true,
        telefono: true,
        mensaje: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
