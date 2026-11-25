import connectDB from '@/backend/config/db';
import SiteSettings, { SITE_SETTINGS_KEY } from '@/backend/models/SiteSettings.model';
import {
  DEFAULT_PUBLIC_SITE_SETTINGS,
  type PublicSiteSettings,
} from '@/lib/siteSettings.types';
import { sanitizeHeadExtraHtml } from '@/lib/siteSettingsValidation';

function toPublic(doc: {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSiteVerification?: string;
  headExtraHtml?: string;
  bodyExtraHtml?: string;
} | null): PublicSiteSettings {
  if (!doc) return { ...DEFAULT_PUBLIC_SITE_SETTINGS };
  return {
    googleAnalyticsId: doc.googleAnalyticsId?.trim() ?? '',
    googleTagManagerId: doc.googleTagManagerId?.trim() ?? '',
    googleSiteVerification: doc.googleSiteVerification?.trim() ?? '',
    headExtraHtml: doc.headExtraHtml?.trim() ?? '',
    bodyExtraHtml: doc.bodyExtraHtml?.trim() ?? '',
  };
}

async function loadSiteSettingsDoc(): Promise<PublicSiteSettings> {
  await connectDB();
  const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
  return toPublic(doc);
}

/** Admin SEO screen — exact stored HTML so editors can see and remove snippets later. */
export async function getAdminSiteSettings(): Promise<PublicSiteSettings> {
  try {
    return await loadSiteSettingsDoc();
  } catch (error) {
    console.error('[getAdminSiteSettings]', error);
    return { ...DEFAULT_PUBLIC_SITE_SETTINGS };
  }
}

/** Storefront + metadata — never throw; fall back to defaults if DB is unavailable. */
export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const raw = await loadSiteSettingsDoc();
    return {
      ...raw,
      headExtraHtml: sanitizeHeadExtraHtml(raw.headExtraHtml),
    };
  } catch (error) {
    console.error('[getPublicSiteSettings]', error);
    return { ...DEFAULT_PUBLIC_SITE_SETTINGS };
  }
}

export async function upsertPublicSiteSettings(data: PublicSiteSettings): Promise<PublicSiteSettings> {
  await connectDB();
  const doc = await SiteSettings.findOneAndUpdate(
    { key: SITE_SETTINGS_KEY },
    {
      $set: {
        googleAnalyticsId: data.googleAnalyticsId,
        googleTagManagerId: data.googleTagManagerId,
        googleSiteVerification: data.googleSiteVerification,
        headExtraHtml: data.headExtraHtml,
        bodyExtraHtml: data.bodyExtraHtml,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return toPublic(doc);
}
