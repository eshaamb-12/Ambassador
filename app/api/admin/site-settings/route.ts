import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/backend/lib/adminAuth';
import { getAdminSiteSettings, upsertPublicSiteSettings } from '@/backend/lib/loadSiteSettings';
import { normalizeSiteSettingsInput } from '@/lib/siteSettingsValidation';

export const dynamic = 'force-dynamic';

/** GET /api/admin/site-settings — SEO & tracking (admin only) */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const data = await getAdminSiteSettings();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/admin/site-settings]', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

/** PATCH /api/admin/site-settings — update SEO & tracking */
export async function PATCH(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const normalized = normalizeSiteSettingsInput(body);
    const data = await upsertPublicSiteSettings(normalized);
    return NextResponse.json(
      { success: true, message: 'Site tracking settings saved.', data },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid settings.';
    const status = message.includes('must') || message.includes('invalid') ? 400 : 500;
    if (status === 500) console.error('[PATCH /api/admin/site-settings]', error);
    return NextResponse.json({ success: false, message }, { status });
  }
}
