import type { Metadata } from 'next';
import BranchesPage from '@/client/pages/branches/BranchesPage';
import { getBranchesPageConfig } from '@/backend/lib/loadSitePage';
import { canonicalMetadata } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Showrooms & Branches | Ambassador Commercial Kitchen Equipment',
  description:
    'Visit Ambassador showrooms in Lahore and Rawalpindi — live demos, expert advice, and commercial kitchen equipment you can see in person.',
  ...canonicalMetadata('/branches'),
};

export default async function Branches() {
  const config = await getBranchesPageConfig();
  return <BranchesPage config={config} />;
}
