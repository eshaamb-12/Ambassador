import { NextResponse } from 'next/server';
import { getGalleryPageConfig } from '@/backend/lib/loadSitePage';

export const dynamic = 'force-dynamic';

/** GET /api/pages/gallery — public gallery landing CMS config */
export async function GET() {
  try {
    const data = await getGalleryPageConfig();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pages/gallery]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
