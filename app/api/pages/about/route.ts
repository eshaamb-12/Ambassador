import { NextResponse } from 'next/server';
import { getAboutPageConfig } from '@/backend/lib/loadSitePage';

export const dynamic = 'force-dynamic';

/** GET /api/pages/about — public about page CMS config */
export async function GET() {
  try {
    const data = await getAboutPageConfig();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pages/about]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
