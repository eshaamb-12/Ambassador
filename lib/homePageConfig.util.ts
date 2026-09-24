import { DEFAULT_HOME_PAGE_CONFIG } from '@/lib/homePage.defaults';

import type {

  HomeCtaContent,

  HomeCtaTrustItem,

  HomeCustomKitchenContent,

  HomeCustomKitchenHighlightItem,

  HomeClientLogosContent,

  HomeHeroSlide,

  HomePageConfig,

  HomeSaleContent,

  HomeSectionConfig,

  HomeSectionId,

  HomeSignupBenefit,

  HomeSignupContent,

  HomeStatItem,

  HomeStatsContent,

  HomeWhyChooseUsContent,

  HomeWhyReason,

} from '@/lib/sitePages.types';

import { HOME_SECTION_LABELS } from '@/lib/sitePages.types';



const SECTION_IDS = Object.keys(HOME_SECTION_LABELS) as HomeSectionId[];



function str(value: unknown, fallback: string): string {

  const s = String(value ?? '').trim();

  return s || fallback;

}



function normalizeSections(raw: unknown): HomeSectionConfig[] {

  const defaults = DEFAULT_HOME_PAGE_CONFIG.sections;

  if (!Array.isArray(raw)) return defaults;



  const byId = new Map<HomeSectionId, HomeSectionConfig>();

  for (const item of raw) {

    if (!item || typeof item !== 'object') continue;

    const id = (item as HomeSectionConfig).id;

    if (!SECTION_IDS.includes(id)) continue;

    byId.set(id, { id, enabled: (item as HomeSectionConfig).enabled !== false });

  }



  const ordered: HomeSectionConfig[] = [];

  for (const item of raw) {

    if (!item || typeof item !== 'object') continue;

    const id = (item as HomeSectionConfig).id;

    if (!SECTION_IDS.includes(id) || ordered.some((x) => x.id === id)) continue;

    ordered.push(byId.get(id)!);

  }



  for (const def of defaults) {

    if (!ordered.some((x) => x.id === def.id)) {

      ordered.push(byId.get(def.id) ?? def);

    }

  }



  return ordered.length ? ordered : defaults;

}



function normalizeSlide(raw: unknown, index: number): HomeHeroSlide | null {

  if (!raw || typeof raw !== 'object') return null;

  const s = raw as HomeHeroSlide;

  const title = String(s.title ?? '').trim();

  const image = String(s.image ?? '').trim();

  if (!title || !image) return null;

  const align = s.align === 'center' ? 'center' : 'left';

  const titleTag = s.titleTag === 'h2' ? 'h2' : index === 0 ? 'h1' : 'h2';

  return {

    id: typeof s.id === 'number' ? s.id : index + 1,

    image,

    alt: String(s.alt ?? '').trim() || title,

    badge: String(s.badge ?? '').trim(),

    title,

    subtitle: String(s.subtitle ?? '').trim(),

    cta: String(s.cta ?? 'Learn more').trim(),

    ctaHref: String(s.ctaHref ?? '/products').trim() || '/products',

    align,

    titleTag,

  };

}



function normalizeHero(raw: unknown): HomePageConfig['hero'] {

  const slidesRaw =

    raw && typeof raw === 'object' && Array.isArray((raw as { slides?: unknown }).slides)

      ? (raw as { slides: unknown[] }).slides

      : null;



  if (!slidesRaw?.length) return DEFAULT_HOME_PAGE_CONFIG.hero;



  const slides = slidesRaw

    .map((item, i) => normalizeSlide(item, i))

    .filter((s): s is HomeHeroSlide => s != null);



  return slides.length ? { slides } : DEFAULT_HOME_PAGE_CONFIG.hero;

}



function normalizeCategoriesIntro(raw: unknown): HomePageConfig['categoriesIntro'] {

  const d = DEFAULT_HOME_PAGE_CONFIG.categoriesIntro;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomePageConfig['categoriesIntro'];

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    title: str(c.title, d.title),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

  };

}



function normalizeSale(raw: unknown): HomeSaleContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.sale;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeSaleContent;

  return {

    badge: str(c.badge, d.badge),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

    ctaText: str(c.ctaText, d.ctaText),

  };

}



function normalizeClientLogos(raw: unknown): HomeClientLogosContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.clientLogos;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeClientLogosContent;

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    title: str(c.title, d.title),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

  };

}



function normalizeHighlightItem(raw: unknown, fallback: HomeCustomKitchenHighlightItem): HomeCustomKitchenHighlightItem {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as HomeCustomKitchenHighlightItem;

  return {

    title: str(c.title, fallback.title),

    text: str(c.text, fallback.text),

  };

}



function normalizeCustomKitchen(raw: unknown): HomeCustomKitchenContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.customKitchen;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeCustomKitchenContent;

  const highlightsRaw = Array.isArray(c.highlights) ? c.highlights : d.highlights;

  const highlights = d.highlights.map((def, i) => normalizeHighlightItem(highlightsRaw[i], def));

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    titleAfter: str(c.titleAfter, d.titleAfter),

    description: str(c.description, d.description),

    imageUrl: str(c.imageUrl, d.imageUrl),

    imageAlt: str(c.imageAlt, d.imageAlt),

    imageBadge: str(c.imageBadge, d.imageBadge),

    highlights,

    primaryCta: str(c.primaryCta, d.primaryCta),

    primaryCtaHref: str(c.primaryCtaHref, d.primaryCtaHref),

    secondaryCta: str(c.secondaryCta, d.secondaryCta),

    secondaryCtaHref: str(c.secondaryCtaHref, d.secondaryCtaHref),

    footerLinkText: str(c.footerLinkText, d.footerLinkText),

  };

}



function normalizeStatItem(raw: unknown, fallback: HomeStatItem): HomeStatItem {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as HomeStatItem;

  const value = typeof c.value === 'number' && Number.isFinite(c.value) ? Math.max(0, c.value) : fallback.value;

  return {

    value,

    suffix: str(c.suffix, fallback.suffix),

    label: str(c.label, fallback.label),

    description: str(c.description, fallback.description),

  };

}



function normalizeStringList(raw: unknown, defaults: string[]): string[] {

  if (!Array.isArray(raw)) return defaults;

  return defaults.map((def, i) => str(raw[i], def));

}



function normalizeStats(raw: unknown): HomeStatsContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.stats;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeStatsContent;

  const statsRaw = Array.isArray(c.stats) ? c.stats : d.stats;

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    heading: str(c.heading, d.heading),

    stats: d.stats.map((def, i) => normalizeStatItem(statsRaw[i], def)),

    trustBadges: normalizeStringList(c.trustBadges, d.trustBadges),

  };

}



function normalizeWhyReason(raw: unknown, fallback: HomeWhyReason): HomeWhyReason {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as HomeWhyReason;

  return {

    title: str(c.title, fallback.title),

    description: str(c.description, fallback.description),

  };

}



function normalizeWhyChooseUs(raw: unknown): HomeWhyChooseUsContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.whyChooseUs;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeWhyChooseUsContent;

  const reasonsRaw = Array.isArray(c.reasons) ? c.reasons : d.reasons;

  return {

    eyebrowBefore: str(c.eyebrowBefore, d.eyebrowBefore),

    eyebrowHighlight: str(c.eyebrowHighlight, d.eyebrowHighlight),

    title: str(c.title, d.title),

    description: str(c.description, d.description),

    reasons: d.reasons.map((def, i) => normalizeWhyReason(reasonsRaw[i], def)),

  };

}



function normalizeSignupBenefit(raw: unknown, fallback: HomeSignupBenefit): HomeSignupBenefit {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as HomeSignupBenefit;

  return {

    title: str(c.title, fallback.title),

    description: str(c.description, fallback.description),

  };

}



function normalizeSignup(raw: unknown): HomeSignupContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.signup;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeSignupContent;

  const benefitsRaw = Array.isArray(c.benefits) ? c.benefits : d.benefits;

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

    benefits: d.benefits.map((def, i) => normalizeSignupBenefit(benefitsRaw[i], def)),

    socialProof: str(c.socialProof, d.socialProof),

    panelTitle: str(c.panelTitle, d.panelTitle),

    panelDescription: str(c.panelDescription, d.panelDescription),

    panelPerks: normalizeStringList(c.panelPerks, d.panelPerks),

    primaryCta: str(c.primaryCta, d.primaryCta),

    secondaryCta: str(c.secondaryCta, d.secondaryCta),

  };

}



function normalizeCtaTrustItem(raw: unknown, fallback: HomeCtaTrustItem): HomeCtaTrustItem {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as HomeCtaTrustItem;

  return {

    label: str(c.label, fallback.label),

    sub: str(c.sub, fallback.sub),

  };

}



function normalizeCta(raw: unknown): HomeCtaContent {

  const d = DEFAULT_HOME_PAGE_CONFIG.cta;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as HomeCtaContent;

  const trustRaw = Array.isArray(c.trustItems) ? c.trustItems : d.trustItems;

  return {

    badge: str(c.badge, d.badge),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

    primaryCta: str(c.primaryCta, d.primaryCta),

    primaryCtaHref: str(c.primaryCtaHref, d.primaryCtaHref),

    secondaryCta: str(c.secondaryCta, d.secondaryCta),

    secondaryCtaHref: str(c.secondaryCtaHref, d.secondaryCtaHref),

    trustItems: d.trustItems.map((def, i) => normalizeCtaTrustItem(trustRaw[i], def)),

  };

}



type HomePageConfigInput = HomePageConfig | Record<string, unknown> | null | undefined;

export function mergeHomePageConfig(partial: HomePageConfigInput): HomePageConfig {
  if (!partial) return { ...DEFAULT_HOME_PAGE_CONFIG };
  const p = partial as Record<string, unknown>;

  return {
    sections: normalizeSections(p.sections),
    hero: normalizeHero(p.hero),
    categoriesIntro: normalizeCategoriesIntro(p.categoriesIntro),
    sale: normalizeSale(p.sale),
    clientLogos: normalizeClientLogos(p.clientLogos),
    customKitchen: normalizeCustomKitchen(p.customKitchen),
    stats: normalizeStats(p.stats),
    whyChooseUs: normalizeWhyChooseUs(p.whyChooseUs),
    signup: normalizeSignup(p.signup),
    cta: normalizeCta(p.cta),
  };
}

export function homePageConfigForSave(config: HomePageConfig): HomePageConfig {
  return mergeHomePageConfig(config);
}


