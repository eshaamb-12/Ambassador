import type { AboutSignupBannerContent } from '@/lib/aboutPage.types';

export type BlogSectionId = 'hero' | 'listing' | 'signup';

export interface BlogSectionConfig {
  id: BlogSectionId;
  enabled: boolean;
}

export interface BlogHeroContent {
  imageUrl: string;
  imageAlt: string;
}

export interface BlogListingContent {
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  emptyFilteredTitle: string;
  emptyFilteredDescription: string;
  emptyDefaultTitle: string;
  emptyDefaultDescription: string;
}

export interface BlogPageConfig {
  sections: BlogSectionConfig[];
  hero: BlogHeroContent;
  listing: BlogListingContent;
  signup: AboutSignupBannerContent;
}

export const BLOG_SECTION_LABELS: Record<BlogSectionId, string> = {
  hero: 'Top banner',
  listing: 'Articles listing',
  signup: 'Sign up banner',
};
