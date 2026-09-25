import type { Metadata } from 'next';
import HomePage from '../client/pages/home/HomePage';
import { canonicalMetadata } from '@/lib/siteUrl';
import { getHomePageConfig } from '@/backend/lib/loadSitePage';

/** CMS content must be read from Mongo on each request — not baked in at build time. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ambassador Commercial Kitchen Equipment | Commercial Kitchen Equipment Pakistan',
  description:
    'Premium commercial kitchen equipment in Pakistan — fryers, refrigeration, custom kitchens, and professional food service solutions since 1999.',
  ...canonicalMetadata('/'),
};

export default async function Home() {
  const config = await getHomePageConfig();
  return <HomePage config={config} />;
}
