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
      select: {
        templateVersion: true,
        sourceTemplateKey: true,
      },
    });

    if (!userLanding) {
      return NextResponse.json({ updateAvailable: false, currentVersion: 0, masterVersion: 0 });
    }

    // Get master template version
    const masterTemplate = await prisma.landingTemplate.findUnique({
      where: { themeKey: userLanding.sourceTemplateKey || 'azul' },
      select: { version: true, content: true },
    });

    if (!masterTemplate) {
      return NextResponse.json({ 
        updateAvailable: false, 
        currentVersion: userLanding.templateVersion, 
        masterVersion: 0 
      });
    }

    const updateAvailable = masterTemplate.version > userLanding.templateVersion;

    return NextResponse.json({
      updateAvailable,
      currentVersion: userLanding.templateVersion,
      masterVersion: masterTemplate.version,
      masterContent: updateAvailable ? masterTemplate.content : null,
    });
  } catch (error) {
    console.error('Error fetching updates info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
