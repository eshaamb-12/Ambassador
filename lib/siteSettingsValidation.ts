import type { PublicSiteSettings } from '@/lib/siteSettings.types';

const GA_ID_RE = /^(G-[A-Z0-9]+|UA-\d+-\d+)$/i;
const GTM_ID_RE = /^GTM-[A-Z0-9]+$/i;
const VERIFY_RE = /^[a-zA-Z0-9_-]{8,120}$/;

export function normalizeSiteSettingsInput(raw: Record<string, unknown>): PublicSiteSettings {
  const googleAnalyticsId = String(raw.googleAnalyticsId ?? '').trim();
  const googleTagManagerId = String(raw.googleTagManagerId ?? '').trim();
  const googleSiteVerification = String(raw.googleSiteVerification ?? '').trim();
  const headExtraHtml = sanitizeHeadExtraHtml(String(raw.headExtraHtml ?? ''));
  const bodyExtraHtml = String(raw.bodyExtraHtml ?? '').trim().slice(0, 20_000);

  if (googleAnalyticsId && !GA_ID_RE.test(googleAnalyticsId)) {
    throw new Error('Google Analytics ID must look like G-XXXXXXXXXX or UA-XXXXXX-X.');
  }
  if (googleTagManagerId && !GTM_ID_RE.test(googleTagManagerId)) {
    throw new Error('Google Tag Manager ID must look like GTM-XXXXXXX.');
  }
  if (googleSiteVerification && !VERIFY_RE.test(googleSiteVerification)) {
    throw new Error('Google Search Console verification code looks invalid.');
  }

  return {
    googleAnalyticsId,
    googleTagManagerId,
    googleSiteVerification,
    headExtraHtml,
    bodyExtraHtml,
  };
}

/** Header field: meta / link / JSON-LD — block executable scripts (use footer or GA/GTM). */
export function sanitizeHeadExtraHtml(html: string): string {
  const trimmed = html.trim().slice(0, 20_000);
  if (!trimmed) return '';
  return trimmed
    .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (full, attrs: string) => {
      if (/type\s*=\s*["']application\/ld\+json["']/i.test(attrs)) return full;
      return '';
    })
    .trim();
}
