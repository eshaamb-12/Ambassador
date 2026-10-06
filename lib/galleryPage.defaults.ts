import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { GalleryPageConfig, GallerySectionId } from '@/lib/galleryPage.types';

const SECTION_ORDER: GallerySectionId[] = ['hero', 'reviews', 'signup'];

export const DEFAULT_GALLERY_PAGE_CONFIG: GalleryPageConfig = {
  sections: SECTION_ORDER.map((id) => ({ id, enabled: true })),
  hero: {
    imageUrl: '/Images/Chef-Reviews-Banner.png',
    imageAlt: 'Gallery & Reviews Background',
    title: 'Gallery & Reviews',
    subtitle:
      'See what top chefs, YouTubers, and celebrities say about Ambassador Commercial Kitchen Equipment',
  },
  reviews: {
    titleBefore: 'Customer',
    titleHighlight: 'Reviews',
    description:
      'Hear directly from culinary professionals who trust Ambassador Commercial Kitchen Equipment for their businesses',
    viewProductCta: 'View Product',
    fullTestimonialLabel: 'Full testimonial',
  },
  signup: { ...DEFAULT_ABOUT_PAGE_CONFIG.signup },
};
