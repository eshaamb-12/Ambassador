export type HomeSectionId =
  | 'hero'
  | 'sale'
  | 'clientLogos'
  | 'customKitchen'
  | 'categories'
  | 'stats'
  | 'whyChooseUs'
  | 'signup'
  | 'cta';

export interface HomeSectionConfig {
  id: HomeSectionId;
  enabled: boolean;
}

export interface HomeHeroSlide {
  id: number;
  image: string;
  alt: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  align: 'left' | 'center';
  titleTag: 'h1' | 'h2';
}

export interface HomeCategoriesIntro {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface HomeSaleContent {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  ctaText: string;
}

export interface HomeClientLogosContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface HomeCustomKitchenHighlightItem {
  title: string;
  text: string;
}

export interface HomeCustomKitchenContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageBadge: string;
  highlights: HomeCustomKitchenHighlightItem[];
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  footerLinkText: string;
}

export interface HomeStatItem {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface HomeStatsContent {
  eyebrow: string;
  heading: string;
  stats: HomeStatItem[];
  trustBadges: string[];
}

export interface HomeWhyReason {
  title: string;
  description: string;
}

export interface HomeWhyChooseUsContent {
  eyebrowBefore: string;
  eyebrowHighlight: string;
  title: string;
  description: string;
  reasons: HomeWhyReason[];
}

export interface HomeSignupBenefit {
  title: string;
  description: string;
}

export interface HomeSignupContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  benefits: HomeSignupBenefit[];
  socialProof: string;
  panelTitle: string;
  panelDescription: string;
  panelPerks: string[];
  primaryCta: string;
  secondaryCta: string;
}

export interface HomeCtaTrustItem {
  label: string;
  sub: string;
}

export interface HomeCtaContent {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  trustItems: HomeCtaTrustItem[];
}

export interface HomePageConfig {
  sections: HomeSectionConfig[];
  hero: { slides: HomeHeroSlide[] };
  categoriesIntro: HomeCategoriesIntro;
  sale: HomeSaleContent;
  clientLogos: HomeClientLogosContent;
  customKitchen: HomeCustomKitchenContent;
  stats: HomeStatsContent;
  whyChooseUs: HomeWhyChooseUsContent;
  signup: HomeSignupContent;
  cta: HomeCtaContent;
}

export type ManagedPageSlug = 'home';

export interface ManagedPageMeta {
  slug: ManagedPageSlug;
  title: string;
  path: string;
  description: string;
}

export const MANAGED_PAGES: ManagedPageMeta[] = [
  {
    slug: 'home',
    title: 'Home',
    path: '/',
    description: 'Main landing page — hero, categories, stats, and CTAs.',
  },
];

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  hero: 'Hero banner slider',
  sale: 'On sale products',
  clientLogos: 'Client logos',
  customKitchen: 'Custom kitchen highlight',
  categories: 'Product categories grid',
  stats: 'Stats / trust bar',
  whyChooseUs: 'Why choose us',
  signup: 'Sign up section',
  cta: 'Bottom call to action',
};
