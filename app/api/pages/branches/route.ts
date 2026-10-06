import { NextResponse } from 'next/server';
import { getBranchesPageConfig } from '@/backend/lib/loadSitePage';

export const dynamic = 'force-dynamic';

/** GET /api/pages/branches — public showrooms landing CMS config */
export async function GET() {
  try {
    const data = await getBranchesPageConfig();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/pages/branches]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
