import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

export type GallerySectionId = 'hero' | 'reviews' | 'signup';

export interface GallerySectionConfig {
  id: GallerySectionId;
  enabled: boolean;
}

export interface GalleryHeroContent {
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
}

export interface GalleryReviewsIntroContent {
  titleBefore: string;
  titleHighlight: string;
  description: string;
  viewProductCta: string;
  fullTestimonialLabel: string;
}

export interface GalleryPageConfig {
  sections: GallerySectionConfig[];
  hero: GalleryHeroContent;
  reviews: GalleryReviewsIntroContent;
  signup: AboutSignupBannerContent;
}

export const GALLERY_SECTION_LABELS: Record<GallerySectionId, string> = {
  hero: 'Hero banner',
  reviews: 'Reviews grid intro',
  signup: 'Sign up banner',
};
