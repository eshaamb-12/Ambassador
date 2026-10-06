import { DEFAULT_GALLERY_PAGE_CONFIG } from '@/lib/galleryPage.defaults';
import type {
  GalleryHeroContent,
  GalleryPageConfig,
  GalleryReviewsIntroContent,
  GallerySectionConfig,
  GallerySectionId,
} from '@/lib/galleryPage.types';
import { GALLERY_SECTION_LABELS } from '@/lib/galleryPage.types';
import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

const SECTION_IDS = Object.keys(GALLERY_SECTION_LABELS) as GallerySectionId[];

function str(value: unknown, fallback: string): string {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function normalizeSections(raw: unknown): GallerySectionConfig[] {
  const defaults = DEFAULT_GALLERY_PAGE_CONFIG.sections;
  if (!Array.isArray(raw)) return defaults;

  const byId = new Map<GallerySectionId, GallerySectionConfig>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as GallerySectionConfig).id;
    if (!SECTION_IDS.includes(id)) continue;
    byId.set(id, { id, enabled: (item as GallerySectionConfig).enabled !== false });
  }

  const ordered: GallerySectionConfig[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as GallerySectionConfig).id;
    if (!SECTION_IDS.includes(id) || ordered.some((x) => x.id === id)) continue;
    ordered.push(byId.get(id)!);
  }
  for (const def of defaults) {
    if (!ordered.some((x) => x.id === def.id)) ordered.push(byId.get(def.id) ?? def);
  }
  return ordered.length ? ordered : defaults;
}

function normalizeHero(raw: unknown): GalleryHeroContent {
  const d = DEFAULT_GALLERY_PAGE_CONFIG.hero;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as GalleryHeroContent;
  return {
    imageUrl: str(c.imageUrl, d.imageUrl),
    imageAlt: str(c.imageAlt, d.imageAlt),
    title: str(c.title, d.title),
    subtitle: str(c.subtitle, d.subtitle),
  };
}

function normalizeReviews(raw: unknown): GalleryReviewsIntroContent {
  const d = DEFAULT_GALLERY_PAGE_CONFIG.reviews;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as GalleryReviewsIntroContent;
  return {
    titleBefore: str(c.titleBefore, d.titleBefore),
    titleHighlight: str(c.titleHighlight, d.titleHighlight),
    description: str(c.description, d.description),
    viewProductCta: str(c.viewProductCta, d.viewProductCta),
    fullTestimonialLabel: str(c.fullTestimonialLabel, d.fullTestimonialLabel),
  };
}

function normalizeSignup(raw: unknown): AboutSignupBannerContent {
  const d = DEFAULT_GALLERY_PAGE_CONFIG.signup;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutSignupBannerContent;
  return {
    title: str(c.title, d.title),
    description: str(c.description, d.description),
    signupCta: str(c.signupCta, d.signupCta),
    loginCta: str(c.loginCta, d.loginCta),
    footerNote: str(c.footerNote, d.footerNote),
  };
}

export function mergeGalleryPageConfig(
  partial: GalleryPageConfig | Record<string, unknown> | null | undefined,
): GalleryPageConfig {
  if (!partial) return { ...DEFAULT_GALLERY_PAGE_CONFIG };
  const p = partial as Record<string, unknown>;
  return {
    sections: normalizeSections(p.sections),
    hero: normalizeHero(p.hero),
    reviews: normalizeReviews(p.reviews),
    signup: normalizeSignup(p.signup),
  };
}

export function galleryPageConfigForSave(config: GalleryPageConfig): GalleryPageConfig {
  return mergeGalleryPageConfig(config);
}
