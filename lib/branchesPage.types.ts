import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

export type BranchesSectionId = 'hero' | 'accentBand' | 'grid' | 'stats' | 'bookVisit' | 'signup';

export interface BranchesSectionConfig {
  id: BranchesSectionId;
  enabled: boolean;
}

export interface ShowroomBranch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  manager: string;
  hours: string;
  services: string[];
  image: string;
  coordinates: { lat: number; lng: number };
  isHeadOffice?: boolean;
}

export interface BranchesHeroContent {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  subtitle: string;
  backgroundImage: string;
  imageAlt: string;
}

export interface BranchesAccentBandContent {
  textBeforeHighlight: string;
  highlight: string;
  textAfterHighlight: string;
  phoneDisplay: string;
  phoneHref: string;
  contactCta: string;
  contactHref: string;
}

export interface BranchesGridIntroContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  directionsCta: string;
  detailsCta: string;
  headOfficeBadge: string;
}

export interface BranchesStatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface BranchesStatsContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  stats: BranchesStatItem[];
}

export interface BranchesBookVisitBenefit {
  title: string;
  description: string;
}

export interface BranchesBookVisitContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  description: string;
  sidebarTitle: string;
  benefits: BranchesBookVisitBenefit[];
  preferCallText: string;
  preferCallPhoneDisplay: string;
  preferCallPhoneHref: string;
  hoursNote: string;
  submitCta: string;
  submitCtaLoading: string;
  footerLinkText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export interface BranchesPageConfig {
  sections: BranchesSectionConfig[];
  hero: BranchesHeroContent;
  accentBand: BranchesAccentBandContent;
  gridIntro: BranchesGridIntroContent;
  branches: ShowroomBranch[];
  stats: BranchesStatsContent;
  bookVisit: BranchesBookVisitContent;
  signup: AboutSignupBannerContent;
}

export const BRANCHES_SECTION_LABELS: Record<BranchesSectionId, string> = {
  hero: 'Hero banner',
  accentBand: 'Contact accent band',
  grid: 'Showrooms grid',
  stats: 'Stats / impact',
  bookVisit: 'Book a visit',
  signup: 'Sign up banner',
};
