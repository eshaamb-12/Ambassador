import type { Metadata } from 'next';
import BlogsPage from '@/client/pages/blog/BlogsPage';
import { getBlogPageConfig } from '@/backend/lib/loadSitePage';
import { canonicalMetadata } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Ambassador Commercial Kitchen Equipment',
  description:
    'Read Ambassador blog articles — commercial kitchen tips, product insights, and industry news from Pakistan’s trusted equipment partner.',
  ...canonicalMetadata('/blog'),
};

export default async function Blog() {
  const config = await getBlogPageConfig();
  return <BlogsPage config={config} />;
}
