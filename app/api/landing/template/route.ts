import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.email !== 'admin@onofrelopez.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get master template (azul)
    const template = await prisma.landingTemplate.findUnique({
      where: { themeKey: 'azul' },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.email !== 'admin@onofrelopez.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Get current template
    const currentTemplate = await prisma.landingTemplate.findUnique({
      where: { themeKey: 'azul' },
    });

    if (!currentTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Increment version and update content
    const updatedTemplate = await prisma.landingTemplate.update({
      where: { themeKey: 'azul' },
      data: {
        content,
        version: currentTemplate.version + 1,
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}