import { DEFAULT_ABOUT_PAGE_CONFIG } from '@/lib/aboutPage.defaults';
import type { BlogPageConfig, BlogSectionId } from '@/lib/blogPage.types';

const SECTION_ORDER: BlogSectionId[] = ['hero', 'listing', 'signup'];

export const DEFAULT_BLOG_PAGE_CONFIG: BlogPageConfig = {
  sections: SECTION_ORDER.map((id) => ({ id, enabled: true })),
  hero: {
    imageUrl: '/Images/blog-image.png',
    imageAlt: 'Ambassador blog',
  },
  listing: {
    title: 'Latest Articles',
    description:
      'Browse guides and updates from our commercial kitchen equipment specialists.',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by title or topic…',
    categoryLabel: 'Category',
    emptyFilteredTitle: 'No matching articles',
    emptyFilteredDescription: 'Try a different search or category.',
    emptyDefaultTitle: 'No articles yet',
    emptyDefaultDescription: 'Check back soon for new posts from the Ambassador team.',
  },
  signup: { ...DEFAULT_ABOUT_PAGE_CONFIG.signup },
};
