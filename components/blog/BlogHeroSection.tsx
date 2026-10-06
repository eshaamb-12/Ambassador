'use client';

import Image from 'next/image';
import { DEFAULT_BLOG_PAGE_CONFIG } from '@/lib/blogPage.defaults';
import type { BlogHeroContent } from '@/lib/blogPage.types';

const BANNER_WIDTH = 2752;
const BANNER_HEIGHT = 1536;

type BlogHeroSectionProps = {
  content?: BlogHeroContent;
};

const BlogHeroSection = ({ content: contentProp }: BlogHeroSectionProps) => {
  const content = contentProp ?? DEFAULT_BLOG_PAGE_CONFIG.hero;
  const src = content.imageUrl?.trim() || DEFAULT_BLOG_PAGE_CONFIG.hero.imageUrl;

  return (
    <section className="w-full overflow-hidden bg-white">
      <Image
        src={src}
        alt={content.imageAlt || 'Ambassador blog'}
        width={BANNER_WIDTH}
        height={BANNER_HEIGHT}
        className="h-auto w-full"
        sizes="100vw"
        priority
      />
    </section>
  );
};

export default BlogHeroSection;
