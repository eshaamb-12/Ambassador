import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type {
  AboutBannerContent,
  AboutCeoAwardContent,
  AboutCompanyContent,
  AboutFaqContent,
  AboutFaqItem,
  AboutIntroHeader,
  AboutMissionValuesContent,
  AboutPageConfig,
  AboutSectionConfig,
  AboutSectionId,
  AboutSignupBannerContent,
  AboutStatPair,
  AboutTestimonialItem,
  AboutTestimonialsContent,
} from '@/lib/aboutPage.types';
import { ABOUT_SECTION_LABELS } from '@/lib/aboutPage.types';

const SECTION_IDS = Object.keys(ABOUT_SECTION_LABELS) as AboutSectionId[];

function str(value: unknown, fallback: string): string {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function normalizeSections(raw: unknown): AboutSectionConfig[] {
  const defaults = DEFAULT_ABOUT_PAGE_CONFIG.sections;
  if (!Array.isArray(raw)) return defaults;

  const byId = new Map<AboutSectionId, AboutSectionConfig>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as AboutSectionConfig).id;
    if (!SECTION_IDS.includes(id)) continue;
    byId.set(id, { id, enabled: (item as AboutSectionConfig).enabled !== false });
  }

  const ordered: AboutSectionConfig[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as AboutSectionConfig).id;
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

function normalizeIntro(raw: unknown, fallback: AboutIntroHeader): AboutIntroHeader {
  if (!raw || typeof raw !== 'object') return fallback;
  const c = raw as AboutIntroHeader;
  return {
    eyebrow: str(c.eyebrow, fallback.eyebrow),
    title: str(c.title, fallback.title),
    titleHighlight: str(c.titleHighlight, fallback.titleHighlight),
    description: str(c.description, fallback.description),
  };
}

function normalizeStat(raw: unknown, fallback: AboutStatPair): AboutStatPair {
  if (!raw || typeof raw !== 'object') return fallback;
  const c = raw as AboutStatPair;
  return { value: str(c.value, fallback.value), label: str(c.label, fallback.label) };
}

function normalizeStringList(raw: unknown, defaults: string[]): string[] {
  if (!Array.isArray(raw)) return defaults;
  return defaults.map((def, i) => str(raw[i], def));
}

/** CMS may still store the old 25+ years copy — map to current defaults (15+). */
const LEGACY_YEARS_VALUE = /^25\+?$/;

function coalesceYearsStatValue(value: string, fallback: string): string {
  const v = value.trim();
  return LEGACY_YEARS_VALUE.test(v) ? fallback : v || fallback;
}

function normalizeCompanyParagraphs(raw: unknown, defaults: string[]): string[] {
  const lines = normalizeStringList(raw, defaults);
  return lines.map((p) =>
    p
      .replace(/\bmore than 25 years\b/gi, 'more than 15 years')
      .replace(/\b25\+?\s*years\b/gi, '15 years'),
  );
}

function normalizeBanner(raw: unknown): AboutBannerContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.banner;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutBannerContent;
  return {
    imageUrl: str(c.imageUrl, d.imageUrl),
    imageAlt: str(c.imageAlt, d.imageAlt),
    title: str(c.title, d.title),
    subtitle: str(c.subtitle, d.subtitle),
  };
}

function normalizeCompany(raw: unknown): AboutCompanyContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.company;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutCompanyContent;
  const highlightsRaw = Array.isArray(c.highlights) ? c.highlights : d.highlights;
  return {
    eyebrow: str(c.eyebrow, d.eyebrow),
    titleBefore: str(c.titleBefore, d.titleBefore),
    titleHighlight: str(c.titleHighlight, d.titleHighlight),
    paragraphs: normalizeCompanyParagraphs(c.paragraphs, d.paragraphs),
    imageUrl: str(c.imageUrl, d.imageUrl),
    imageAlt: str(c.imageAlt, d.imageAlt),
    floatBadgeValue: coalesceYearsStatValue(str(c.floatBadgeValue, d.floatBadgeValue), d.floatBadgeValue),
    floatBadgeLabel: str(c.floatBadgeLabel, d.floatBadgeLabel),
    highlights: d.highlights.map((def, i) => {
      const stat = normalizeStat(highlightsRaw[i], def);
      if (def.label === 'Years of Experience') {
        return { ...stat, value: coalesceYearsStatValue(stat.value, def.value) };
      }
      return stat;
    }),
  };
}

function normalizeCeo(raw: unknown): AboutCeoAwardContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.ceoAward;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutCeoAwardContent;
  const highlightsRaw = Array.isArray(c.highlights) ? c.highlights : d.highlights;
  return {
    eyebrow: str(c.eyebrow, d.eyebrow),
    titleBefore: str(c.titleBefore, d.titleBefore),
    titleHighlight: str(c.titleHighlight, d.titleHighlight),
    paragraphs: normalizeStringList(c.paragraphs, d.paragraphs),
    signatureName: str(c.signatureName, d.signatureName),
    signatureRole: str(c.signatureRole, d.signatureRole),
    highlights: d.highlights.map((def, i) => normalizeStat(highlightsRaw[i], def)),
    imageUrl: str(c.imageUrl, d.imageUrl),
    imageAlt: str(c.imageAlt, d.imageAlt),
    imageBadgeLine1: str(c.imageBadgeLine1, d.imageBadgeLine1),
    imageBadgeLine2: str(c.imageBadgeLine2, d.imageBadgeLine2),
  };
}

function normalizeMissionValues(raw: unknown): AboutMissionValuesContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.missionValues;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutMissionValuesContent;
  return {
    intro: normalizeIntro(c.intro, d.intro),
    missionLabel: str(c.missionLabel, d.missionLabel),
    missionTitle: str(c.missionTitle, d.missionTitle),
    missionBody: str(c.missionBody, d.missionBody),
    visionLabel: str(c.visionLabel, d.visionLabel),
    visionTitle: str(c.visionTitle, d.visionTitle),
    visionBody: str(c.visionBody, d.visionBody),
    valuesTitle: str(c.valuesTitle, d.valuesTitle),
    valuesSubtitle: str(c.valuesSubtitle, d.valuesSubtitle),
    valuesImageUrl: str(c.valuesImageUrl, d.valuesImageUrl),
  };
}

function normalizeTestimonial(raw: unknown, fallback: AboutTestimonialItem): AboutTestimonialItem {
  if (!raw || typeof raw !== 'object') return fallback;
  const c = raw as AboutTestimonialItem;
  const rating =
    typeof c.rating === 'number' && Number.isFinite(c.rating)
      ? Math.min(5, Math.max(1, Math.round(c.rating)))
      : fallback.rating;
  return {
    name: str(c.name, fallback.name),
    image: str(c.image, fallback.image),
    title: str(c.title, fallback.title),
    text: str(c.text, fallback.text),
    rating,
  };
}

function normalizeTestimonials(raw: unknown): AboutTestimonialsContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.testimonials;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutTestimonialsContent;
  const itemsRaw = Array.isArray(c.items) ? c.items : d.items;
  return {
    intro: normalizeIntro(c.intro, d.intro),
    items: d.items.map((def, i) => normalizeTestimonial(itemsRaw[i], def)),
  };
}

function normalizeFaqItem(raw: unknown, fallback: AboutFaqItem): AboutFaqItem {
  if (!raw || typeof raw !== 'object') return fallback;
  const c = raw as AboutFaqItem;
  return { question: str(c.question, fallback.question), answer: str(c.answer, fallback.answer) };
}

function normalizeFaq(raw: unknown): AboutFaqContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.faq;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as AboutFaqContent;
  const itemsRaw = Array.isArray(c.items) ? c.items : d.items;
  return {
    heading: str(c.heading, d.heading),
    description: str(c.description, d.description),
    items: d.items.map((def, i) => normalizeFaqItem(itemsRaw[i], def)),
  };
}

function normalizeSignup(raw: unknown): AboutSignupBannerContent {
  const d = DEFAULT_ABOUT_PAGE_CONFIG.signup;
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

type AboutPageConfigInput = AboutPageConfig | Record<string, unknown> | null | undefined;

export function mergeAboutPageConfig(partial: AboutPageConfigInput): AboutPageConfig {
  if (!partial) return { ...DEFAULT_ABOUT_PAGE_CONFIG };
  const p = partial as Record<string, unknown>;

  return {
    sections: normalizeSections(p.sections),
    banner: normalizeBanner(p.banner),
    company: normalizeCompany(p.company),
    ceoAward: normalizeCeo(p.ceoAward),
    certificates: normalizeIntro(p.certificates, DEFAULT_ABOUT_PAGE_CONFIG.certificates),
    missionValues: normalizeMissionValues(p.missionValues),
    clientLogos: normalizeIntro(p.clientLogos, DEFAULT_ABOUT_PAGE_CONFIG.clientLogos),
    testimonials: normalizeTestimonials(p.testimonials),
    faq: normalizeFaq(p.faq),
    signup: normalizeSignup(p.signup),
  };
}

export function aboutPageConfigForSave(config: AboutPageConfig): AboutPageConfig {
  return mergeAboutPageConfig(config);
}
