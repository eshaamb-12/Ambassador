import type { Metadata } from 'next';
import GalleryPage from '@/client/pages/gallery/GalleryPage';
import { getGalleryPageConfig } from '@/backend/lib/loadSitePage';
import { canonicalMetadata } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery & Reviews | Ambassador Commercial Kitchen Equipment',
  description:
    'Watch chef and customer video reviews of Ambassador commercial kitchen equipment — trusted by professionals across Pakistan.',
  ...canonicalMetadata('/gallery'),
};

export default async function Gallery() {
  const config = await getGalleryPageConfig();
  return <GalleryPage config={config} />;
}
