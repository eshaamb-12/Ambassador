'use client';

import BlogHeroSection from '@/components/blog/BlogHeroSection';
import BlogGridSection from '@/components/blog/BlogGridSection';
import SignupBanner from '@/components/common/signup-banner';
import { DEFAULT_BLOG_PAGE_CONFIG } from '@/lib/blogPage.defaults';
import type { BlogPageConfig, BlogSectionId } from '@/lib/blogPage.types';

type BlogsPageProps = {
  config?: BlogPageConfig;
};

const BlogsPage = ({ config: configProp }: BlogsPageProps) => {
  const config = configProp ?? DEFAULT_BLOG_PAGE_CONFIG;

  const renderSection = (id: BlogSectionId) => {
    switch (id) {
      case 'hero':
        return <BlogHeroSection content={config.hero} />;
      case 'listing':
        return <BlogGridSection content={config.listing} />;
      case 'signup':
        return <SignupBanner content={config.signup} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {config.sections
        .filter((s) => s.enabled)
        .map((section) => (
          <div key={section.id}>{renderSection(section.id)}</div>
        ))}
    </div>
  );
};

export default BlogsPage;
