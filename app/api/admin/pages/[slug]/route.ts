import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/backend/lib/adminAuth';
import {
  getHomePageConfig,
  isManagedPageSlug,
  saveHomePageConfig,
} from '@/backend/lib/loadSitePage';
import { homePageConfigForSave } from '@/lib/homePageConfig.util';
import type { HomePageConfig } from '@/lib/sitePages.types';

export const dynamic = 'force-dynamic';

/** GET /api/admin/pages/[slug] */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  if (!isManagedPageSlug(slug)) {
    return NextResponse.json({ success: false, message: 'Unknown page.' }, { status: 404 });
  }

  try {
    if (slug === 'home') {
      const data = await getHomePageConfig();
      return NextResponse.json({ success: true, data }, { status: 200 });
    }
    return NextResponse.json({ success: false, message: 'Not implemented.' }, { status: 501 });
  } catch (error) {
    console.error('[GET /api/admin/pages/[slug]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** PATCH /api/admin/pages/[slug] */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const { slug } = await params;
  if (!isManagedPageSlug(slug)) {
    return NextResponse.json({ success: false, message: 'Unknown page.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    if (slug === 'home') {
      const saved = await saveHomePageConfig(homePageConfigForSave(body as HomePageConfig));
      return NextResponse.json(
        { success: true, message: 'Home page saved.', data: saved },
        { status: 200 },
      );
    }
    return NextResponse.json({ success: false, message: 'Not implemented.' }, { status: 501 });
  } catch (error) {
    console.error('[PATCH /api/admin/pages/[slug]]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
