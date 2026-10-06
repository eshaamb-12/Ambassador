import { DEFAULT_BLOG_PAGE_CONFIG } from '@/lib/blogPage.defaults';
import type {
  BlogHeroContent,
  BlogListingContent,
  BlogPageConfig,
  BlogSectionConfig,
  BlogSectionId,
} from '@/lib/blogPage.types';
import { BLOG_SECTION_LABELS } from '@/lib/blogPage.types';
import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

const SECTION_IDS = Object.keys(BLOG_SECTION_LABELS) as BlogSectionId[];

function str(value: unknown, fallback: string): string {
  const s = String(value ?? '').trim();
  return s || fallback;
}

function normalizeSections(raw: unknown): BlogSectionConfig[] {
  const defaults = DEFAULT_BLOG_PAGE_CONFIG.sections;
  if (!Array.isArray(raw)) return defaults;

  const byId = new Map<BlogSectionId, BlogSectionConfig>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as BlogSectionConfig).id;
    if (!SECTION_IDS.includes(id)) continue;
    byId.set(id, { id, enabled: (item as BlogSectionConfig).enabled !== false });
  }

  const ordered: BlogSectionConfig[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = (item as BlogSectionConfig).id;
    if (!SECTION_IDS.includes(id) || ordered.some((x) => x.id === id)) continue;
    ordered.push(byId.get(id)!);
  }
  for (const def of defaults) {
    if (!ordered.some((x) => x.id === def.id)) ordered.push(byId.get(def.id) ?? def);
  }
  return ordered.length ? ordered : defaults;
}

function normalizeHero(raw: unknown): BlogHeroContent {
  const d = DEFAULT_BLOG_PAGE_CONFIG.hero;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as BlogHeroContent;
  return {
    imageUrl: str(c.imageUrl, d.imageUrl),
    imageAlt: str(c.imageAlt, d.imageAlt),
  };
}

function normalizeListing(raw: unknown): BlogListingContent {
  const d = DEFAULT_BLOG_PAGE_CONFIG.listing;
  if (!raw || typeof raw !== 'object') return d;
  const c = raw as BlogListingContent;
  return {
    title: str(c.title, d.title),
    description: str(c.description, d.description),
    searchLabel: str(c.searchLabel, d.searchLabel),
    searchPlaceholder: str(c.searchPlaceholder, d.searchPlaceholder),
    categoryLabel: str(c.categoryLabel, d.categoryLabel),
    emptyFilteredTitle: str(c.emptyFilteredTitle, d.emptyFilteredTitle),
    emptyFilteredDescription: str(c.emptyFilteredDescription, d.emptyFilteredDescription),
    emptyDefaultTitle: str(c.emptyDefaultTitle, d.emptyDefaultTitle),
    emptyDefaultDescription: str(c.emptyDefaultDescription, d.emptyDefaultDescription),
  };
}

function normalizeSignup(raw: unknown): AboutSignupBannerContent {
  const d = DEFAULT_BLOG_PAGE_CONFIG.signup;
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

export function mergeBlogPageConfig(partial: BlogPageConfig | Record<string, unknown> | null | undefined): BlogPageConfig {
  if (!partial) return { ...DEFAULT_BLOG_PAGE_CONFIG };
  const p = partial as Record<string, unknown>;
  return {
    sections: normalizeSections(p.sections),
    hero: normalizeHero(p.hero),
    listing: normalizeListing(p.listing),
    signup: normalizeSignup(p.signup),
  };
}

export function blogPageConfigForSave(config: BlogPageConfig): BlogPageConfig {
  return mergeBlogPageConfig(config);
}
