import { NextResponse } from 'next/server';
import { getHomePageConfig } from '@/backend/lib/loadSitePage';

export const dynamic = 'force-dynamic';

/** GET /api/pages/home — public home page CMS config */
export async function GET() {
  try {
    const data = await getHomePageConfig();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pages/home]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
