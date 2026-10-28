export type HomeSectionId =
  | 'hero'
  | 'sale'
  | 'clientLogos'
  | 'customKitchen'
  | 'categories'
  | 'stats'
  | 'whyChooseUs'
  | 'testimonials'
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

export interface HomeTestimonialItem {
  name: string;
  profession: string;
  /** Optional legacy poster; storefront cards use videoUrl for media. */
  image?: string;
  imageAlt?: string;
  /** Uploaded file or YouTube link — main card video and “Show more”. */
  videoUrl?: string;
}

export interface HomeTestimonialsContent {
  titleBefore: string;
  titleHighlight: string;
  subtitle: string;
  showMoreLabel: string;
  items: HomeTestimonialItem[];
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
  testimonials: HomeTestimonialsContent;
  signup: HomeSignupContent;
  cta: HomeCtaContent;
}

export type ManagedPageSlug = 'home' | 'about' | 'blog' | 'gallery' | 'branches';

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
  {
    slug: 'about',
    title: 'About',
    path: '/about',
    description: 'Company story, CEO message, certificates, testimonials, and FAQ.',
  },
  {
    slug: 'blog',
    title: 'Blog',
    path: '/blog',
    description: 'Blog landing page — banner, articles intro, filters labels, and sign-up banner.',
  },
  {
    slug: 'gallery',
    title: 'Gallery',
    path: '/gallery',
    description: 'Gallery landing page — hero banner, reviews intro copy, and sign-up banner.',
  },
  {
    slug: 'branches',
    title: 'Showrooms',
    path: '/branches',
    description: 'Showrooms page — hero, branch cards, stats, book-a-visit copy, and sign-up banner.',
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
  testimonials: 'Testimonials carousel',
  signup: 'Sign up section',
  cta: 'Bottom call to action',
};

