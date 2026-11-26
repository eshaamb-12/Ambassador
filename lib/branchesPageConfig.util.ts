import { DEFAULT_BRANCHES_PAGE_CONFIG, DEFAULT_SHOWROOM_BRANCHES } from '@/lib/branchesPage.defaults';

import type {

  BranchesAccentBandContent,

  BranchesBookVisitContent,

  BranchesGridIntroContent,

  BranchesHeroContent,

  BranchesPageConfig,

  BranchesSectionConfig,

  BranchesSectionId,

  BranchesStatsContent,

  BranchesStatItem,

  BranchesBookVisitBenefit,

  ShowroomBranch,

} from '@/lib/branchesPage.types';

import { BRANCHES_SECTION_LABELS } from '@/lib/branchesPage.types';

import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';



const SECTION_IDS = Object.keys(BRANCHES_SECTION_LABELS) as BranchesSectionId[];



function str(value: unknown, fallback: string): string {

  const s = String(value ?? '').trim();

  return s || fallback;

}



function num(value: unknown, fallback: number): number {

  const n = Number(value);

  return Number.isFinite(n) ? n : fallback;

}



function normalizeSections(raw: unknown): BranchesSectionConfig[] {

  const defaults = DEFAULT_BRANCHES_PAGE_CONFIG.sections;

  if (!Array.isArray(raw)) return defaults;



  const byId = new Map<BranchesSectionId, BranchesSectionConfig>();

  for (const item of raw) {

    if (!item || typeof item !== 'object') continue;

    const id = (item as BranchesSectionConfig).id;

    if (!SECTION_IDS.includes(id)) continue;

    byId.set(id, { id, enabled: (item as BranchesSectionConfig).enabled !== false });

  }



  const ordered: BranchesSectionConfig[] = [];

  for (const item of raw) {

    if (!item || typeof item !== 'object') continue;

    const id = (item as BranchesSectionConfig).id;

    if (!SECTION_IDS.includes(id) || ordered.some((x) => x.id === id)) continue;

    ordered.push(byId.get(id)!);

  }

  for (const def of defaults) {

    if (!ordered.some((x) => x.id === def.id)) ordered.push(byId.get(def.id) ?? def);

  }

  return ordered.length ? ordered : defaults;

}



function normalizeHero(raw: unknown): BranchesHeroContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.hero;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as BranchesHeroContent;

  return {

    badge: str(c.badge, d.badge),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    subtitle: str(c.subtitle, d.subtitle),

    backgroundImage: str(c.backgroundImage, d.backgroundImage),

    imageAlt: str(c.imageAlt, d.imageAlt),

  };

}



function normalizeAccentBand(raw: unknown): BranchesAccentBandContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.accentBand;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as BranchesAccentBandContent;

  return {

    textBeforeHighlight: str(c.textBeforeHighlight, d.textBeforeHighlight),

    highlight: str(c.highlight, d.highlight),

    textAfterHighlight: str(c.textAfterHighlight, d.textAfterHighlight),

    phoneDisplay: str(c.phoneDisplay, d.phoneDisplay),

    phoneHref: str(c.phoneHref, d.phoneHref),

    contactCta: str(c.contactCta, d.contactCta),

    contactHref: str(c.contactHref, d.contactHref),

  };

}



function normalizeGridIntro(raw: unknown): BranchesGridIntroContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.gridIntro;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as BranchesGridIntroContent;

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

    directionsCta: str(c.directionsCta, d.directionsCta),

    detailsCta: str(c.detailsCta, d.detailsCta),

    headOfficeBadge: str(c.headOfficeBadge, d.headOfficeBadge),

  };

}



function normalizeServices(raw: unknown, fallback: string[]): string[] {

  if (Array.isArray(raw)) {

    const list = raw.map((s) => String(s ?? '').trim()).filter(Boolean);

    if (list.length) return list;

  }

  if (typeof raw === 'string') {

    const list = raw

      .split(/[,|\n]/)

      .map((s) => s.trim())

      .filter(Boolean);

    if (list.length) return list;

  }

  return fallback;

}



/** Prior Fazaia map pin — CMS may still store this; use current default from `branchesPage.defaults`. */
const LEGACY_FAZAIA_COORDS = [
  { lat: 31.367931, lng: 74.235808 },
  { lat: 31.368033, lng: 74.235808 },
];

function resolveBranchCoordinates(
  branchId: string,
  lat: number,
  lng: number,
  fallback: ShowroomBranch,
): { lat: number; lng: number } {
  if (branchId !== '1') return { lat, lng };
  for (const legacy of LEGACY_FAZAIA_COORDS) {
    if (Math.abs(lat - legacy.lat) < 0.0001 && Math.abs(lng - legacy.lng) < 0.0001) {
      return { ...fallback.coordinates };
    }
  }
  return { lat, lng };
}

function normalizeBranch(raw: unknown, fallback: ShowroomBranch): ShowroomBranch {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as ShowroomBranch;

  const coords = c.coordinates && typeof c.coordinates === 'object' ? c.coordinates : fallback.coordinates;
  const id = str(c.id, fallback.id);
  const lat = num(coords.lat, fallback.coordinates.lat);
  const lng = num(coords.lng, fallback.coordinates.lng);

  return {

    id,

    name: str(c.name, fallback.name),

    address: str(c.address, fallback.address),

    city: str(c.city, fallback.city),

    state: str(c.state, fallback.state),

    pincode: str(c.pincode, fallback.pincode),

    phone: str(c.phone, fallback.phone),

    email: str(c.email, fallback.email),

    manager: str(c.manager, fallback.manager),

    hours: str(c.hours, fallback.hours),

    services: normalizeServices(c.services, fallback.services),

    image: str(c.image, fallback.image),

    coordinates: resolveBranchCoordinates(id, lat, lng, fallback),

    isHeadOffice: c.isHeadOffice === true,

  };

}



function normalizeBranches(raw: unknown): ShowroomBranch[] {

  const defaults = DEFAULT_BRANCHES_PAGE_CONFIG.branches;

  if (!Array.isArray(raw) || raw.length === 0) {

    return defaults.map((b) => ({ ...b, services: [...b.services], coordinates: { ...b.coordinates } }));

  }



  const fallbackById = new Map(defaults.map((b) => [b.id, b]));

  const merged: ShowroomBranch[] = [];



  for (const item of raw) {

    if (!item || typeof item !== 'object') continue;

    const id = str((item as ShowroomBranch).id, '');

    const fb = fallbackById.get(id) ?? defaults[merged.length % defaults.length];

    merged.push(normalizeBranch(item, fb));

  }



  if (merged.length === 0) {

    return defaults.map((b) => ({ ...b, services: [...b.services], coordinates: { ...b.coordinates } }));

  }

  return merged;

}



function normalizeStatItem(raw: unknown, fallback: BranchesStatItem): BranchesStatItem {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as BranchesStatItem;

  return {

    value: num(c.value, fallback.value),

    suffix: str(c.suffix, fallback.suffix),

    label: str(c.label, fallback.label),

  };

}



function normalizeStats(raw: unknown): BranchesStatsContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.stats;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as BranchesStatsContent;

  const defaultStats = d.stats;

  const rawStats = Array.isArray(c.stats) ? c.stats : [];

  const stats: BranchesStatItem[] = defaultStats.map((fb, i) =>

    normalizeStatItem(rawStats[i], fb),

  );

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    stats,

  };

}



function normalizeBenefit(raw: unknown, fallback: BranchesBookVisitBenefit): BranchesBookVisitBenefit {

  if (!raw || typeof raw !== 'object') return fallback;

  const c = raw as BranchesBookVisitBenefit;

  return {

    title: str(c.title, fallback.title),

    description: str(c.description, fallback.description),

  };

}



function normalizeBookVisit(raw: unknown): BranchesBookVisitContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.bookVisit;

  if (!raw || typeof raw !== 'object') return d;

  const c = raw as BranchesBookVisitContent;

  const defaultBenefits = d.benefits;

  const rawBenefits = Array.isArray(c.benefits) ? c.benefits : [];

  const benefits = defaultBenefits.map((fb, i) => normalizeBenefit(rawBenefits[i], fb));

  return {

    eyebrow: str(c.eyebrow, d.eyebrow),

    titleBefore: str(c.titleBefore, d.titleBefore),

    titleHighlight: str(c.titleHighlight, d.titleHighlight),

    description: str(c.description, d.description),

    sidebarTitle: str(c.sidebarTitle, d.sidebarTitle),

    benefits,

    preferCallText: str(c.preferCallText, d.preferCallText),

    preferCallPhoneDisplay: str(c.preferCallPhoneDisplay, d.preferCallPhoneDisplay),

    preferCallPhoneHref: str(c.preferCallPhoneHref, d.preferCallPhoneHref),

    hoursNote: str(c.hoursNote, d.hoursNote),

    submitCta: str(c.submitCta, d.submitCta),

    submitCtaLoading: str(c.submitCtaLoading, d.submitCtaLoading),

    footerLinkText: str(c.footerLinkText, d.footerLinkText),

    footerLinkLabel: str(c.footerLinkLabel, d.footerLinkLabel),

    footerLinkHref: str(c.footerLinkHref, d.footerLinkHref),

  };

}



function normalizeSignup(raw: unknown): AboutSignupBannerContent {

  const d = DEFAULT_BRANCHES_PAGE_CONFIG.signup;

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



export function mergeBranchesPageConfig(

  partial: BranchesPageConfig | Record<string, unknown> | null | undefined,

): BranchesPageConfig {

  if (!partial) {
    const d = DEFAULT_BRANCHES_PAGE_CONFIG;
    return {
      ...d,
      sections: d.sections.map((s) => ({ ...s })),
      branches: d.branches.map((b) => ({ ...b, services: [...b.services], coordinates: { ...b.coordinates } })),
      stats: { ...d.stats, stats: d.stats.stats.map((s) => ({ ...s })) },
      bookVisit: { ...d.bookVisit, benefits: d.bookVisit.benefits.map((b) => ({ ...b })) },
      signup: { ...d.signup },
    };
  }

  const p = partial as Record<string, unknown>;

  return {

    sections: normalizeSections(p.sections),

    hero: normalizeHero(p.hero),

    accentBand: normalizeAccentBand(p.accentBand),

    gridIntro: normalizeGridIntro(p.gridIntro),

    branches: normalizeBranches(p.branches),

    stats: normalizeStats(p.stats),

    bookVisit: normalizeBookVisit(p.bookVisit),

    signup: normalizeSignup(p.signup),

  };

}



export function branchesPageConfigForSave(config: BranchesPageConfig): BranchesPageConfig {

  return mergeBranchesPageConfig(config);

}



export { DEFAULT_SHOWROOM_BRANCHES };

