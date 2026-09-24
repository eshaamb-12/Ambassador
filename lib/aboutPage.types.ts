export type AboutSectionId =
  | 'banner'
  | 'company'
  | 'ceoAward'
  | 'certificates'
  | 'missionValues'
  | 'clientLogos'
  | 'testimonials'
  | 'faq'
  | 'signup';

export interface AboutSectionConfig {
  id: AboutSectionId;
  enabled: boolean;
}

export interface AboutIntroHeader {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
}

export interface AboutStatPair {
  value: string;
  label: string;
}

export interface AboutBannerContent {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
}

export interface AboutCompanyContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  floatBadgeValue: string;
  floatBadgeLabel: string;
  highlights: AboutStatPair[];
}

export interface AboutCeoAwardContent {
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
  paragraphs: string[];
  signatureName: string;
  signatureRole: string;
  highlights: AboutStatPair[];
  imageUrl: string;
  imageAlt: string;
  imageBadgeLine1: string;
  imageBadgeLine2: string;
}

export interface AboutMissionValuesContent {
  intro: AboutIntroHeader;
  missionLabel: string;
  missionTitle: string;
  missionBody: string;
  visionLabel: string;
  visionTitle: string;
  visionBody: string;
  valuesTitle: string;
  valuesSubtitle: string;
  valuesImageUrl: string;
}

export interface AboutTestimonialItem {
  name: string;
  image: string;
  title: string;
  text: string;
  rating: number;
}

export interface AboutTestimonialsContent {
  intro: AboutIntroHeader;
  items: AboutTestimonialItem[];
}

export interface AboutFaqItem {
  question: string;
  answer: string;
}

export interface AboutFaqContent {
  heading: string;
  description: string;
  items: AboutFaqItem[];
}

export interface AboutSignupBannerContent {
  title: string;
  description: string;
  signupCta: string;
  loginCta: string;
  footerNote: string;
}

export interface AboutPageConfig {
  sections: AboutSectionConfig[];
  banner: AboutBannerContent;
  company: AboutCompanyContent;
  ceoAward: AboutCeoAwardContent;
  certificates: AboutIntroHeader;
  missionValues: AboutMissionValuesContent;
  clientLogos: AboutIntroHeader;
  testimonials: AboutTestimonialsContent;
  faq: AboutFaqContent;
  signup: AboutSignupBannerContent;
}

export const ABOUT_SECTION_LABELS: Record<AboutSectionId, string> = {
  banner: 'Top banner',
  company: 'Who we are',
  ceoAward: 'CEO message',
  certificates: 'Certificates carousel',
  missionValues: 'Mission, vision & values',
  clientLogos: 'Client logos grid',
  testimonials: 'Testimonials',
  faq: 'FAQ',
  signup: 'Sign up banner',
};
