import { NextResponse } from 'next/server';
import { getBlogPageConfig } from '@/backend/lib/loadSitePage';

export const dynamic = 'force-dynamic';

/** GET /api/pages/blog — public blog landing CMS config */
export async function GET() {
  try {
    const data = await getBlogPageConfig();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pages/blog]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
